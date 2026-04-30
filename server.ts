import express from "express";
import { createServer as createHttpServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { checkAndSendReminders, sendNotification, addMockBooking, updateMockBooking, sendReminder, sendVerificationStatusEmail } from './src/services/reminderService.ts';
import { fileURLToPath } from "url";
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: any;

import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' as any }) 
  : null;

async function startServer() {
  const app = express();

  if (!admin.apps.length) {
    try {
      console.log("Initializing Firebase Admin with defaults");
      admin.initializeApp();
    } catch (error) {
      console.error("Firebase Admin default initialization error, trying with config:", error);
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
  }

  try {
    console.log("Initializing Firestore with Database ID:", firebaseConfig.firestoreDatabaseId);
    db = getFirestore(admin.app(), firebaseConfig.firestoreDatabaseId);
    
    // Test connection
    const testSnapshot = await db.collection('test').limit(1).get();
    console.log("Firestore connection test successful, found documents:", testSnapshot.size);
  } catch (error) {
    console.error("Firestore initialization/test error:", error);
    db = null; // Mark as failed
  }
  const httpServer = createHttpServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Socket.io handlers
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", async (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
      
      if (!db) {
        console.warn("Database not connected. Cannot load messages.");
        return;
      }

      try {
        // Load messages from Firestore
        const messagesSnapshot = await db.collection("conversations")
          .doc(roomId)
          .collection("messages")
          .orderBy("createdAt", "asc")
          .get();
        
        const messages = messagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        socket.emit("load_messages", messages);
      } catch (err) {
        console.error("Error loading messages from Firestore:", err);
      }
    });

    socket.on("send_message", async (data) => {
      const { roomId, message, senderId, senderName } = data;
      
      if (!db) {
        console.warn("Database not connected. Cannot save message.");
        return;
      }

      const newMessage = {
        text: message,
        senderId,
        senderName,
        createdAt: new Date().toISOString()
      };
      
      try {
        // Store in Firestore
        const docRef = await db.collection("conversations")
          .doc(roomId)
          .collection("messages")
          .add(newMessage);
          
        const savedMessage = {
          id: docRef.id,
          ...newMessage
        };

        // Ensure the conversation document exists
        await db.collection("conversations").doc(roomId).set({
          lastUpdated: new Date().toISOString(),
          participants: roomId.split('_')
        }, { merge: true });

        io.to(roomId).emit("receive_message", savedMessage);
      } catch (err) {
        console.error("Error saving message to Firestore:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // API routes
  app.use(express.json());

  app.post("/api/notifications", async (req, res) => {
    try {
      const { booking, type } = req.body;
      if (!booking || !type) {
        return res.status(400).json({ error: "Missing booking or type" });
      }
      
      if (type === 'new') {
        addMockBooking(booking);
      } else if (type === 'cancel' || type === 'reschedule') {
        updateMockBooking(booking, type);
      }

      await sendNotification(booking, type);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  app.post("/api/reminders", async (req, res) => {
    try {
      const { booking, type, method } = req.body;
      if (!booking || !type) {
        return res.status(400).json({ error: "Missing booking or type" });
      }
      
      await sendReminder(booking, type, method || 'both');
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending reminder:", error);
      res.status(500).json({ error: "Failed to send reminder" });
    }
  });

  app.post("/api/admin/verify-notify", async (req, res) => {
    try {
      const { email, status } = req.body;
      if (!email || !status) {
        return res.status(400).json({ error: "Missing email or status" });
      }
      
      await sendVerificationStatusEmail(email, status);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).json({ error: "Failed to send verification email" });
    }
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { bookingData } = req.body;
      if (!bookingData) {
        return res.status(400).json({ error: "Missing booking data" });
      }

      // Split Logic per user request:
      // Base session cost = 100%
      // Customer pays = 100% + 8% service fee = 108%
      // Platform takes = 8% (from customer) + 8% (from practitioner) = 16% total platform share
      // Practitioner gets = 108% - 16% = 92% of base session cost
      // Stripe fee is deducted from the platform's 16% share.
      
      const baseAmount = bookingData.amount; // e.g., 100
      const customerFee = baseAmount * 0.08; // 8% fee on top (what customer pays)
      const practitionerFee = baseAmount * 0.08; // 8% commission (what practitioner pays)
      
      const totalCustomerCharge = baseAmount + customerFee; // customer cost 108
      const totalPlatformFee = customerFee + practitionerFee; // platform total 16

      // If Stripe is configured, create a real checkout session
      if (stripe) {
        const sessionConfig: any = {
          line_items: [
            {
              price_data: {
                currency: bookingData.currency.toLowerCase(),
                product_data: {
                  name: `Cupping Session with ${bookingData.practitionerName}`,
                  description: `${bookingData.date} at ${bookingData.time}`,
                },
                unit_amount: Math.round(totalCustomerCharge * 100), // in cents
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          automatic_payment_methods: {
            enabled: true,
          },
          success_url: `${process.env.APP_URL || 'http://localhost:3000'}/?session_id={CHECKOUT_SESSION_ID}&status=success`,
          cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/?status=cancelled`,
        };

        // If the practitioner has a connected Stripe account, route the funds
        if (bookingData.practitionerStripeAccountId) {
          sessionConfig.payment_intent_data = {
            application_fee_amount: Math.round(totalPlatformFee * 100),
            transfer_data: {
              destination: bookingData.practitionerStripeAccountId,
            },
          };
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        res.json({ url: session.url });
      } else {
        // Mock response if Stripe is not configured
        res.json({ mock: true, totalCustomerCharge, totalPlatformFee });
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.post("/api/create-connect-account", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(400).json({ error: "Stripe is not configured" });
      }

      // Create an Express account
      const account = await stripe.accounts.create({
        type: 'express',
        capabilities: {
          transfers: { requested: true },
        },
      });

      // Create an account link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.APP_URL || 'http://localhost:3000'}/?view=dashboard`,
        return_url: `${process.env.APP_URL || 'http://localhost:3000'}/?view=dashboard&stripe_onboarded=true`,
        type: 'account_onboarding',
      });

      res.json({ url: accountLink.url, accountId: account.id });
    } catch (error) {
      console.error("Error creating Connect account:", error);
      res.status(500).json({ error: "Failed to create Connect account" });
    }
  });

  // Admin endpoints for platform owner
  app.get("/api/admin/balance", async (req, res) => {
    try {
      if (!stripe) {
        // Return mock balance if Stripe is not configured
        return res.json({
          available: [{ amount: 125000, currency: 'usd' }], // $1250.00
          pending: [{ amount: 45000, currency: 'usd' }] // $450.00
        });
      }
      const balance = await stripe.balance.retrieve();
      res.json(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  });

  app.post("/api/admin/payout", async (req, res) => {
    try {
      const { amount, currency } = req.body;
      
      if (!stripe) {
        // Mock successful payout if Stripe is not configured
        return res.json({ success: true, mock: true, amount, currency });
      }
      
      // Create a payout to the platform owner's connected bank account
      const payout = await stripe.payouts.create({
        amount: amount, // amount in cents
        currency: currency || 'usd',
      });
      
      res.json({ success: true, payout });
    } catch (error: any) {
      console.error("Error creating payout:", error);
      res.status(500).json({ error: error.message || "Failed to create payout" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const { roomId, message, senderId, senderName } = req.body;
      if (!roomId || !message || !senderId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!db) {
        return res.status(503).json({ error: "Database connection unavailable" });
      }

      const newMessage = {
        text: message,
        senderId,
        senderName,
        createdAt: new Date().toISOString()
      };

      const docRef = await db.collection("conversations")
        .doc(roomId)
        .collection("messages")
        .add(newMessage);
        
      const savedMessage = {
        id: docRef.id,
        ...newMessage
      };

      await db.collection("conversations").doc(roomId).set({
        lastUpdated: new Date().toISOString(),
        participants: roomId.split('_')
      }, { merge: true });

      io.to(roomId).emit("receive_message", savedMessage);
      res.json({ success: true, message: savedMessage });
    } catch (error) {
      console.error("Error sending message via API:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.get("/api/messages/:roomId", async (req, res) => {
    try {
      const { roomId } = req.params;

      if (!db) {
        return res.status(503).json({ error: "Database connection unavailable" });
      }

      const messagesSnapshot = await db.collection("conversations")
        .doc(roomId)
        .collection("messages")
        .orderBy("createdAt", "asc")
        .get();
      
      const messages = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.get("/api/admin/conversations", async (req, res) => {
    try {
      if (!db) {
        return res.status(503).json({ error: "Database connection unavailable" });
      }

      const convsSnapshot = await db.collection("conversations").get();
      const convs = await Promise.all(convsSnapshot.docs.map(async (doc) => {
        const messagesSnapshot = await doc.ref.collection("messages")
          .orderBy("createdAt", "asc")
          .get();
        return {
          id: doc.id,
          ...doc.data(),
          messages: messagesSnapshot.docs.map(m => ({ id: m.id, ...m.data() }))
        };
      }));
      res.json(convs);
    } catch (error) {
      console.error("Error fetching admin conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.get("/api/admin/stripe-status", async (req, res) => {
    try {
      res.json({
        configured: !!stripe,
        mode: !!stripe ? 'live/test' : 'mock',
        publishableKeySet: !!process.env.VITE_STRIPE_PUBLISHABLE_KEY
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check stripe status" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Schedule appointment reminders (check every minute)
    setInterval(() => {
      if (db) {
        checkAndSendReminders(db).catch(err => console.error("Error in checkAndSendReminders:", err));
      }
    }, 60000);
  });
}

startServer();
