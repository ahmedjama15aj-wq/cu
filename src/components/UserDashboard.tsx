/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, HeartPulse, TrendingUp, Users, DollarSign, Award, Receipt, History, ArrowDownRight, ArrowUpRight, MessageSquare, Star, X, FileText, Download, CreditCard, LayoutGrid, List, Camera, Loader2, Building } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { PractitionerProfile } from '../types';
import { CalendarView } from './CalendarView';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
  onViewMessages?: (practitionerId?: string) => void;
  practitioners?: PractitionerProfile[];
  initialTab?: 'upcoming' | 'past' | 'cancelled';
}

export const UserDashboard: React.FC<Props> = ({ onViewMessages, practitioners, initialTab = 'upcoming' }) => {
  const { user, updateUser } = useAuth();
  const isPractitioner = user?.role === 'practitioner';
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingTab, setBookingTab] = useState<'upcoming' | 'past' | 'cancelled'>(initialTab);

  useEffect(() => {
    setBookingTab(initialTab);
  }, [initialTab]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    
    // Simulate upload with FileReader for base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        await updateUser({ photoURL: base64String });
      } catch (error) {
        console.error("Error updating profile photo:", error);
        alert("Failed to update profile photo.");
      } finally {
        setIsUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const mockMessages = [
    { id: 'm1', practitionerId: '1', senderName: 'Dr. Ahmed Al-Farsi', lastMessage: 'Looking forward to our session tomorrow!', time: '10:30 AM', unread: true },
    { id: 'm2', practitionerId: '2', senderName: 'Sarah Johnson', lastMessage: 'Thank you for the advice.', time: 'Yesterday', unread: false },
  ];

  const [bookings, setBookings] = useState([
    {
      id: 'b1',
      practitionerId: '1',
      practitionerName: 'Dr. Ahmed Al-Farsi',
      specialty: 'Wet Cupping',
      date: '2026-04-05',
      time: '10:00 AM',
      status: 'confirmed',
      amount: 85,
      currency: 'USD',
      address: 'Dubai, UAE',
      reminders: { twentyFourHour: true, oneHour: false }
    },
    {
      id: 'b2',
      practitionerId: '2',
      practitionerName: 'Sarah Johnson',
      specialty: 'Sports Recovery',
      date: '2026-03-20',
      time: '02:30 PM',
      status: 'completed',
      amount: 70,
      currency: 'USD',
      address: 'London, UK',
      reminders: { twentyFourHour: false, oneHour: false }
    },
    {
      id: 'b3',
      practitionerId: '3',
      practitionerName: 'Dr. Omar',
      specialty: 'Detox',
      date: '2026-02-15',
      time: '11:00 AM',
      status: 'cancelled',
      amount: 95,
      currency: 'USD',
      address: 'New York, USA',
      reminders: { twentyFourHour: false, oneHour: false }
    }
  ]);

  const handleToggleReminder = (id: string, type: 'twentyFourHour' | 'oneHour') => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        const currentReminders = b.reminders || { twentyFourHour: false, oneHour: false };
        return {
          ...b,
          reminders: {
            ...currentReminders,
            [type]: !currentReminders[type]
          }
        };
      }
      return b;
    }));
  };

  const filteredBookings = bookings.filter(b => {
    if (bookingTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (bookingTab === 'past') return b.status === 'completed';
    if (bookingTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });


  const handleCancelBooking = async (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking: {
              ...booking,
              customerName: user?.displayName || 'Guest',
              customerEmail: user?.email || 'customer@example.com',
              customerPhone: '+1234567890',
              practitionerEmail: 'practitioner@example.com',
              practitionerPhone: '+0987654321',
            },
            type: 'cancel'
          })
        });
      } catch (error) {
        console.error('Failed to send cancellation notification:', error);
      }
    }
  };

  const handleSendReminder = async (booking: any, type: '24h' | '1h', method: 'email' | 'sms' = 'email') => {
    try {
      await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking: {
            ...booking,
            customerName: user?.displayName || 'Jane Doe',
            customerEmail: user?.email || 'customer@example.com',
            customerPhone: '+1234567890',
            practitionerEmail: 'practitioner@example.com',
            practitionerPhone: '+0987654321',
          },
          type,
          method
        })
      });
      alert(`Sent ${type} reminder via ${method.toUpperCase()} for booking on ${booking.date}`);
    } catch (error) {
      console.error('Failed to send reminder:', error);
      alert('Failed to send reminder. Check console for details.');
    }
  };

  const handleConnectStripe = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/create-connect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.url && data.accountId) {
        // Save the account ID to the practitioner profile before redirecting
        if (user) {
          await updateUser({ stripeAccountId: data.accountId });
        }
        window.location.href = data.url;
      } else {
        alert("Stripe is not configured or an error occurred.");
      }
    } catch (error) {
      console.error("Error connecting Stripe:", error);
      alert("Failed to initiate Stripe connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteSession = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'completed' } : b));
  };

  const mockPayments = [
    {
      id: 'p1',
      date: '2026-03-15',
      amount: 85,
      currency: 'USD',
      status: 'paid',
      description: isPractitioner ? 'Session with Jane Doe' : 'Session with Dr. Ahmed',
      type: isPractitioner ? 'earning' : 'payment',
      fee: 6.8, // 8%
      net: 78.2
    },
    {
      id: 'p2',
      date: '2026-03-10',
      amount: 70,
      currency: 'USD',
      status: 'paid',
      description: isPractitioner ? 'Session with Mike Ross' : 'Session with Sarah Johnson',
      type: isPractitioner ? 'earning' : 'payment',
      fee: 5.6,
      net: 64.4
    },
    {
      id: 'p3',
      date: '2026-03-01',
      amount: 95,
      currency: 'USD',
      status: 'paid',
      description: isPractitioner ? 'Session with Harvey Specter' : 'Session with Dr. Omar',
      type: isPractitioner ? 'earning' : 'payment',
      fee: 7.6,
      net: 87.4
    }
  ];

  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');
  const [paymentSortBy, setPaymentSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  const filteredAndSortedPayments = mockPayments
    .filter(payment => payment.description.toLowerCase().includes(paymentSearchQuery.toLowerCase()))
    .sort((a, b) => {
      if (paymentSortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (paymentSortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (paymentSortBy === 'amount-desc') return b.amount - a.amount;
      if (paymentSortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  const practitionerStats = {
    totalEarnings: 4250,
    platformFees: 340, // 8%
    netEarnings: 3910, // 92%
    totalSessions: 52,
            rating: 4.9,
            activePatients: 18,
            payoutSplit: '92% Practitioner / 16% Platform'
          };

  const handleDownloadStatement = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Cupping Connect', 14, 22);
    
    doc.setFontSize(12);
    doc.text('Financial Statement', 14, 32);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 40);
    doc.text(`User: ${user?.displayName || 'User'}`, 14, 48);

    // Summary
    doc.setFontSize(14);
    doc.text('Summary', 14, 60);
    doc.setFontSize(10);
    if (isPractitioner) {
      doc.text(`Total Earnings: ${practitionerStats.totalEarnings.toFixed(2)}`, 14, 68);
      doc.text(`Platform Fees: ${practitionerStats.platformFees.toFixed(2)}`, 14, 74);
      doc.text(`Net Earnings: ${practitionerStats.netEarnings.toFixed(2)}`, 14, 80);
    } else {
      const totalSpent = filteredAndSortedPayments.reduce((sum, p) => sum + p.amount, 0);
      doc.text(`Total Spent: ${totalSpent.toFixed(2)}`, 14, 68);
    }

    // Transactions Table
    const tableColumn = isPractitioner 
      ? ["Date", "Description", "Amount", "Fee (8%)", "Net", "Status"]
      : ["Date", "Description", "Amount", "Status"];
      
    const tableRows = filteredAndSortedPayments.map(payment => {
      if (isPractitioner) {
        return [
          payment.date,
          payment.description,
          `${payment.amount.toFixed(2)}`,
          `-${payment.fee.toFixed(2)}`,
          `${payment.net.toFixed(2)}`,
          payment.status.toUpperCase()
        ];
      } else {
        return [
          payment.date,
          payment.description,
          `${payment.amount.toFixed(2)}`,
          payment.status.toUpperCase()
        ];
      }
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 90,
      theme: 'striped',
      headStyles: { fillColor: [13, 148, 136] }, // teal-600
    });

    doc.save('Cupping_Connect_Statement.pdf');
  };

  return (
    <div className="pt-44 pb-20 px-4 min-h-screen bg-slate-50/30">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 text-center sm:text-left">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-slate-100 flex items-center justify-center">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-3xl md:text-4xl font-serif text-slate-300">
                    {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <label className={`absolute inset-0 flex items-center justify-center bg-slate-900/60 text-white rounded-full transition-opacity cursor-pointer ${isUploadingPhoto ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {isUploadingPhoto ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Update</span>
                  </div>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  disabled={isUploadingPhoto}
                />
              </label>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-slate-900 mb-2">Welcome back, {user?.displayName}!</h1>
              <p className="text-slate-400 font-light text-sm md:text-base">
                {isPractitioner 
                  ? 'Manage your practice and track your earnings.' 
                  : 'Manage your Al Hijamah sessions and health journey.'}
              </p>
            </div>
          </div>
          {isPractitioner && (
            <div className="flex items-center gap-3 bg-teal-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-xl self-center md:self-auto">
              <Award className="w-5 h-5" />
              <span className="font-bold uppercase tracking-widest text-[10px] md:text-xs">Verified Practitioner</span>
            </div>
          )}
        </header>

        {isPractitioner && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              { label: 'Total Earnings', value: `${practitionerStats.totalEarnings} USD`, icon: Building, color: 'text-teal-600', bg: 'bg-teal-50' },
              { label: 'Total Sessions', value: practitionerStats.totalSessions, icon: CheckCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
              { label: 'Active Patients', value: practitionerStats.activePatients, icon: Users, color: 'text-slate-600', bg: 'bg-slate-100' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-10 -mt-10 transition-all group-hover:scale-150" />
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm relative z-10`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 relative z-10">{stat.label}</div>
                <div className="text-3xl font-serif text-slate-900 relative z-10">{stat.value}</div>
              </motion.div>
            ))}
          </section>
        )}

        {isPractitioner && (
          <div className="bg-slate-900 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden mb-16">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent" />
            </div>
            <h2 className="text-2xl font-serif text-white mb-8 flex items-center gap-3 relative z-10">
              <CreditCard className="w-7 h-7 text-teal-500" />
              Payouts & Banking
            </h2>
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div>
                <h3 className="font-serif text-white text-xl">Connect your bank account</h3>
                <p className="text-slate-400 font-light mt-2">Set up your Stripe Connect Express account to receive payouts directly to your bank account.</p>
              </div>
              <button 
                onClick={handleConnectStripe}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl hover:shadow-teal-100 whitespace-nowrap uppercase tracking-widest text-xs"
              >
                Set up Payouts
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <section className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <h2 className="text-2xl font-serif text-slate-900 flex items-center gap-3">
                <Calendar className="text-teal-600 w-6 h-6" />
                {isPractitioner ? 'Session History' : 'Booking History'}
              </h2>
              <div className="flex items-center gap-4">
                {bookingTab === 'upcoming' && (
                  <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                      title="List View"
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                      title="Calendar View"
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
                  {(['upcoming', 'past', 'cancelled'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setBookingTab(tab);
                        if (tab !== 'upcoming') setViewMode('list');
                      }}
                      className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                        bookingTab === tab 
                          ? 'bg-teal-600 text-white shadow-lg' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {viewMode === 'calendar' && bookingTab === 'upcoming' ? (
              <CalendarView bookings={filteredBookings} />
            ) : (
              <div className="space-y-6">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 flex flex-col gap-6 group hover:shadow-2xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="flex items-center gap-6 flex-1">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${booking.status === 'completed' ? 'bg-teal-50 text-teal-600' : booking.status === 'cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
                          {booking.status === 'completed' ? <CheckCircle className="w-7 h-7" /> : booking.status === 'cancelled' ? <XCircle className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-serif text-slate-900">{isPractitioner ? 'Patient: Jane Doe' : booking.practitionerName}</h3>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            <MapPin className="w-3 h-3 text-teal-500" />
                            <span>{booking.address}</span>
                          </div>
                          <div className="mt-2 inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-teal-100">
                            <Award className="w-3 h-3" />
                            {booking.specialty || 'Al Hijamah Session'}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                        <div>
                          <div className="text-[10px] text-slate-300 uppercase tracking-widest font-bold mb-1">Date & Time</div>
                          <div className="font-serif text-slate-900">{booking.date} at {booking.time}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-300 uppercase tracking-widest font-bold mb-1">Amount</div>
                          <div className="font-bold text-teal-600">{booking.amount} {booking.currency || 'USD'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-300 uppercase tracking-widest font-bold mb-1">Status</div>
                          <div className={`text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest ${
                            booking.status === 'completed' ? 'bg-teal-50 text-teal-600' : booking.status === 'cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                          }`}>
                            {booking.status}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap justify-center">
                        {booking.status === 'confirmed' && (
                          <>
                            <div className="flex flex-col gap-2 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center">Send Reminder</span>
                              <div className="flex gap-2 items-center">
                                <select 
                                  id={`reminder-select-${booking.id}`}
                                  className="text-[10px] font-bold text-slate-600 bg-white px-2 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-teal-500 w-full"
                                >
                                  <option value="24h-email">24h Email</option>
                                  <option value="24h-sms">24h SMS</option>
                                  <option value="1h-email">1h Email</option>
                                  <option value="1h-sms">1h SMS</option>
                                </select>
                                <button 
                                  onClick={() => {
                                    const select = document.getElementById(`reminder-select-${booking.id}`) as HTMLSelectElement;
                                    if (select) {
                                      const [type, method] = select.value.split('-');
                                      handleSendReminder(booking, type as '24h' | '1h', method as 'email' | 'sms');
                                    }
                                  }}
                                  className="text-[10px] font-bold text-white bg-teal-600 hover:bg-teal-700 px-4 py-1.5 rounded-lg transition-all shadow-sm"
                                >
                                  Send
                                </button>
                              </div>
                            </div>
                            {isPractitioner && (
                              <button 
                                onClick={() => handleCompleteSession(booking.id)} 
                                className="flex items-center gap-2 bg-teal-50 text-teal-600 font-bold px-4 py-2 rounded-xl hover:bg-teal-100 transition-all text-[10px] uppercase tracking-widest border border-teal-200"
                                title="Mark session as completed for proof"
                              >
                                <CheckCircle className="w-4 h-4" /> Session Done
                              </button>
                            )}
                            <button onClick={() => handleCancelBooking(booking.id)} className="text-[10px] font-bold text-rose-500 hover:text-rose-600 px-4 py-2 uppercase tracking-widest">Cancel</button>
                          </>
                        )}
                        <button className="bg-black text-white font-bold px-8 py-3 rounded-xl hover:bg-slate-800 transition-all text-[10px] uppercase tracking-widest shadow-lg">
                          Details
                        </button>
                      </div>
                    </div>
                    
                    {booking.status === 'confirmed' && (
                      <div className="border-t border-slate-50 pt-6 mt-2">
                        <h4 className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">Reminder Preferences</h4>
                        <div className="flex flex-wrap gap-8">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={booking.reminders?.twentyFourHour || false}
                                onChange={() => handleToggleReminder(booking.id, 'twentyFourHour')}
                              />
                              <div className={`block w-12 h-7 rounded-full transition-all ${booking.reminders?.twentyFourHour ? 'bg-orange-500 shadow-lg shadow-orange-100' : 'bg-slate-200'}`}></div>
                              <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-all ${booking.reminders?.twentyFourHour ? 'transform translate-x-5' : ''}`}></div>
                            </div>
                            <span className="text-xs text-slate-600 font-bold uppercase tracking-widest group-hover:text-orange-600 transition-colors">24 hours before</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={booking.reminders?.oneHour || false}
                                onChange={() => handleToggleReminder(booking.id, 'oneHour')}
                              />
                              <div className={`block w-12 h-7 rounded-full transition-all ${booking.reminders?.oneHour ? 'bg-orange-500 shadow-lg shadow-orange-100' : 'bg-slate-200'}`}></div>
                              <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-all ${booking.reminders?.oneHour ? 'transform translate-x-5' : ''}`}></div>
                            </div>
                            <span className="text-xs text-slate-600 font-bold uppercase tracking-widest group-hover:text-orange-600 transition-colors">1 hour before</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-50 shadow-xl">
                  <Calendar className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                  <h3 className="text-xl font-serif text-slate-900 mb-2">No {bookingTab} bookings</h3>
                  <p className="text-slate-400 font-light">You don't have any {bookingTab} appointments at the moment.</p>
                </div>
              )}
            </div>
            )}

            {/* Payment History Section */}
            <div className="mt-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <h2 className="text-2xl font-serif text-slate-900 flex items-center gap-3">
                  <History className="text-teal-600 w-6 h-6" />
                  {isPractitioner ? 'Earnings History' : 'Payment History'}
                </h2>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search transactions..."
                      value={paymentSearchQuery}
                      onChange={(e) => setPaymentSearchQuery(e.target.value)}
                      className="pl-4 pr-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-teal-500 transition-all bg-white text-xs w-full sm:w-64 shadow-sm"
                    />
                  </div>
                  <select
                    value={paymentSortBy}
                    onChange={(e) => setPaymentSortBy(e.target.value as any)}
                    className="px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-teal-500 transition-all bg-white text-[10px] font-bold text-slate-600 cursor-pointer shadow-sm uppercase tracking-widest"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="amount-desc">Highest Amount</option>
                    <option value="amount-asc">Lowest Amount</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-white rounded-[2rem] shadow-xl border border-slate-50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                        <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                        {isPractitioner && (
                          <>
                            <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Fee (8%)</th>
                            <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Net</th>
                          </>
                        )}
                        <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                        <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredAndSortedPayments.length > 0 ? (
                        filteredAndSortedPayments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-6 text-xs text-slate-400">{payment.date}</td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                {isPractitioner ? (
                                  <ArrowUpRight className="w-4 h-4 text-teal-500" />
                                ) : (
                                  <ArrowDownRight className="w-4 h-4 text-rose-500" />
                                )}
                                <span className="font-serif text-slate-900 group-hover:text-teal-600 transition-colors">{payment.description}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right font-bold text-slate-900">{payment.amount.toFixed(2)} {payment.currency || 'USD'}</td>
                            {isPractitioner && (
                              <>
                                <td className="px-8 py-6 text-right text-xs text-rose-500">-{payment.fee.toFixed(2)} {payment.currency || 'USD'}</td>
                                <td className="px-8 py-6 text-right font-bold text-teal-600">{payment.net.toFixed(2)} {payment.currency || 'USD'}</td>
                              </>
                            )}
                            <td className="px-8 py-6 text-center">
                              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-600 uppercase tracking-widest">
                                {payment.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex justify-end gap-4">
                                <button className="text-slate-300 hover:text-teal-600 transition-colors" title="View Details">
                                  <FileText className="w-4 h-4" />
                                </button>
                                <button className="text-slate-300 hover:text-teal-600 transition-colors" title="Download Receipt">
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={isPractitioner ? 7 : 5} className="px-8 py-12 text-center text-slate-400 font-light">
                            No transactions found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-slate-50/50 text-center border-t border-slate-100">
                  <button 
                    onClick={handleDownloadStatement}
                    className="text-[10px] font-bold text-teal-600 hover:text-teal-700 uppercase tracking-widest cursor-pointer active:scale-95 transform transition-all"
                  >
                    Download Full Statement (PDF)
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-8">
            <section className="bg-rose-50 border border-rose-100 rounded-[2rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100 rounded-full -mr-10 -mt-10 transition-all group-hover:scale-150" />
              <div className="flex items-start gap-5 relative z-10">
                <div className="bg-rose-500 p-3 rounded-2xl shadow-lg shadow-rose-100">
                  <HeartPulse className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-rose-900 mb-2">Health Tip</h3>
                  <p className="text-rose-700/80 leading-relaxed text-sm font-light">
                    {isPractitioner 
                      ? 'Ensure your equipment is sterilized and you follow all safety protocols for each session.' 
                      : 'After your Hijamah session, remember to stay hydrated and avoid intense physical activity for the next 24 hours.'}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white border border-slate-50 rounded-[2rem] p-8 shadow-xl">
              <h3 className="text-xl font-serif text-slate-900 mb-8 flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                Recent Messages
              </h3>
              <div className="space-y-6">
                {mockMessages.map((msg) => (
                  <button 
                    key={msg.id}
                    onClick={() => onViewMessages?.(msg.practitionerId)}
                    className="w-full text-left p-5 rounded-2xl bg-slate-50 hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100 group relative cursor-pointer active:scale-[0.98] transform"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-black group-hover:text-orange-600 transition-colors">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{msg.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-800 font-medium line-clamp-2 leading-relaxed">{msg.lastMessage}</p>
                      {msg.unread && (
                        <div className="w-2.5 h-2.5 bg-orange-600 rounded-full shadow-lg shadow-orange-200 shrink-0 ml-4" />
                      )}
                    </div>
                  </button>
                ))}
                <button 
                  onClick={() => onViewMessages?.()}
                  className="w-full text-center py-4 rounded-2xl text-xs font-bold text-white bg-black hover:bg-orange-600 transition-all uppercase tracking-widest mt-4 shadow-lg active:scale-95 transform cursor-pointer"
                >
                  View All Messages
                </button>
              </div>
            </section>

            {isPractitioner && (
              <section className="bg-slate-900 text-white rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent" />
                </div>
                <h3 className="text-xl font-serif mb-8 relative z-10">Practitioner Tools</h3>
                <div className="space-y-4 relative z-10">
                  <button className="w-full bg-white/5 hover:bg-white/10 text-left px-5 py-4 rounded-2xl transition-all flex items-center justify-between group border border-white/5 hover:border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-white">Update Availability</span>
                    <Clock className="w-4 h-4 text-teal-500" />
                  </button>
                  <button className="w-full bg-white/5 hover:bg-white/10 text-left px-5 py-4 rounded-2xl transition-all flex items-center justify-between group border border-white/5 hover:border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-white">Edit Profile</span>
                    <Award className="w-4 h-4 text-teal-500" />
                  </button>
                  <button className="w-full bg-white/5 hover:bg-white/10 text-left px-5 py-4 rounded-2xl transition-all flex items-center justify-between group border border-white/5 hover:border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-white">Earnings Report</span>
                    <TrendingUp className="w-4 h-4 text-teal-500" />
                  </button>
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>

    </div>
  );
};
