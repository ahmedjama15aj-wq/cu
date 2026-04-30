import twilio from 'twilio';
import sgMail from '@sendgrid/mail';
import admin from 'firebase-admin';

// Initialize services
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) 
  : null;
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendReminder = async (booking: any, type: '24h' | '1h', method: 'email' | 'sms' | 'both' = 'both') => {
  const timeStr = type === '24h' ? '24 hours' : '1 hour';
  const customerMessage = `Reminder: Your Cupping Connect session with ${booking.practitionerName || 'your practitioner'} is in ${timeStr}. Date: ${booking.date}, Time: ${booking.time}.`;
  const practitionerMessage = `Reminder: You have a Cupping Connect session with ${booking.customerName || 'your client'} in ${timeStr}. Date: ${booking.date}, Time: ${booking.time}.`;

  if (method === 'email' || method === 'both') {
    // Send Email to Customer
    if (process.env.SENDGRID_API_KEY && booking.customerEmail) {
      await sgMail.send({
        to: booking.customerEmail,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@cuppingconnect.com',
        subject: 'Appointment Reminder',
        text: customerMessage,
      }).catch(console.error);
    }

    // Send Email to Practitioner
    if (process.env.SENDGRID_API_KEY && booking.practitionerEmail) {
      await sgMail.send({
        to: booking.practitionerEmail,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@cuppingconnect.com',
        subject: 'Appointment Reminder',
        text: practitionerMessage,
      }).catch(console.error);
    }
  }

  if (method === 'sms' || method === 'both') {
    // Send SMS to Customer
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER && booking.customerPhone) {
      await twilioClient.messages.create({
        body: customerMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: booking.customerPhone,
      }).catch(console.error);
    }

    // Send SMS to Practitioner
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER && booking.practitionerPhone) {
      await twilioClient.messages.create({
        body: practitionerMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: booking.practitionerPhone,
      }).catch(console.error);
    }
  }
};

export const sendVerificationStatusEmail = async (email: string, status: 'verified' | 'rejected') => {
  if (!process.env.SENDGRID_API_KEY || !email) return;

  const subject = status === 'verified' 
    ? 'Your Cupping Connect Practitioner Account is Verified!' 
    : 'Update on your Cupping Connect Practitioner Application';
    
  const text = status === 'verified'
    ? 'Congratulations! Your practitioner account has been verified. You can now start accepting bookings on Cupping Connect.'
    : 'Thank you for your interest in Cupping Connect. Unfortunately, we are unable to approve your practitioner application at this time. Please contact support for more details.';

  await sgMail.send({
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@cuppingconnect.com',
    subject,
    text,
  }).catch(console.error);
};

export const sendNotification = async (booking: any, type: 'new' | 'cancel' | 'reschedule') => {
  let customerMessage = '';
  let practitionerMessage = '';
  let subject = '';

  switch (type) {
    case 'new':
      subject = 'New Booking Confirmation';
      customerMessage = `Your Cupping Connect session with ${booking.practitionerName || 'your practitioner'} is confirmed for ${booking.date} at ${booking.time}.`;
      practitionerMessage = `New booking! ${booking.customerName || 'A client'} has booked a session for ${booking.date} at ${booking.time}.`;
      break;
    case 'cancel':
      subject = 'Booking Cancellation';
      customerMessage = `Your Cupping Connect session with ${booking.practitionerName || 'your practitioner'} on ${booking.date} at ${booking.time} has been cancelled.`;
      practitionerMessage = `Booking cancelled. ${booking.customerName || 'A client'} has cancelled their session on ${booking.date} at ${booking.time}.`;
      break;
    case 'reschedule':
      subject = 'Booking Rescheduled';
      customerMessage = `Your Cupping Connect session with ${booking.practitionerName || 'your practitioner'} has been rescheduled to ${booking.date} at ${booking.time}.`;
      practitionerMessage = `Booking rescheduled. ${booking.customerName || 'A client'} has rescheduled their session to ${booking.date} at ${booking.time}.`;
      break;
  }

  // Send Email to Customer
  if (process.env.SENDGRID_API_KEY && booking.customerEmail) {
    await sgMail.send({
      to: booking.customerEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@cuppingconnect.com',
      subject: subject,
      text: customerMessage,
    }).catch(console.error);
  }

  // Send Email to Practitioner
  if (process.env.SENDGRID_API_KEY && booking.practitionerEmail) {
    await sgMail.send({
      to: booking.practitionerEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@cuppingconnect.com',
      subject: subject,
      text: practitionerMessage,
    }).catch(console.error);
  }

  // Send SMS to Customer
  if (twilioClient && process.env.TWILIO_PHONE_NUMBER && booking.customerPhone) {
    await twilioClient.messages.create({
      body: customerMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: booking.customerPhone,
    }).catch(console.error);
  }

  // Send SMS to Practitioner
  if (twilioClient && process.env.TWILIO_PHONE_NUMBER && booking.practitionerPhone) {
    await twilioClient.messages.create({
      body: practitionerMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: booking.practitionerPhone,
    }).catch(console.error);
  }
};

export const addMockBooking = (booking: any) => {
  // Logic shifted to Firestore on client, but can be added here if server-side creation is needed
  console.log("addMockBooking called for:", booking.id);
};

export const updateMockBooking = (booking: any, type: string) => {
  // Logic shifted to Firestore on client
  console.log("updateMockBooking called for:", booking.id, type);
};

export const checkAndSendReminders = async (db: admin.firestore.Firestore) => {
  const now = new Date();
  
  try {
    // Fetch upcoming confirmed bookings
    const bookingsSnapshot = await db.collection("bookings")
      .where("status", "==", "confirmed")
      .get();

    for (const doc of bookingsSnapshot.docs) {
      const booking = doc.data();
      
      try {
        // Parse time like "10:00 AM" to a valid Date object
        const [time, modifier] = booking.time.split(' ');
        let [hours, minutes] = time.split(':');
        let parsedHours = parseInt(hours, 10);
        
        if (parsedHours === 12) {
          parsedHours = modifier === 'AM' ? 0 : 12;
        } else if (modifier === 'PM') {
          parsedHours += 12;
        }
        
        const formattedHours = parsedHours.toString().padStart(2, '0');
        const bookingTime = new Date(`${booking.date}T${formattedHours}:${minutes}:00`);
        
        const diffHours = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Send 24h reminder (between 23.9 and 24 hours before)
        if (diffHours > 23.9 && diffHours <= 24 && !booking.reminder24hSent) {
          console.log(`Sending 24h reminder for booking ${doc.id}`);
          await sendReminder(booking, '24h');
          await doc.ref.update({ reminder24hSent: true });
        } 
        // Send 1h reminder (between 0.9 and 1 hour before)
        else if (diffHours > 0.9 && diffHours <= 1 && !booking.reminder1hSent) {
          console.log(`Sending 1h reminder for booking ${doc.id}`);
          await sendReminder(booking, '1h');
          await doc.ref.update({ reminder1hSent: true });
        }
      } catch (error) {
        console.error(`Error processing reminder for booking ${doc.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error in checkAndSendReminders:", error);
  }
};
