/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, Calendar, Check, X, Clock, Heart, Activity } from 'lucide-react';
import { Booking } from '../types';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';

const MOCK_BOOKINGS: Booking[] = [
  { id: '1', customerId: 'c1', customerName: 'John Doe', practitionerId: 'p1', practitionerName: 'Dr. Smith', status: 'confirmed', amount: 100, commission: 8, practitionerEarnings: 92, date: '2026-04-01', time: '10:00 AM', createdAt: '2026-03-25' },
  { id: '2', customerId: 'c2', customerName: 'Alice Smith', practitionerId: 'p1', practitionerName: 'Dr. Smith', status: 'pending', amount: 85, commission: 6.8, practitionerEarnings: 78.2, date: '2026-04-02', time: '02:00 PM', createdAt: '2026-03-26' },
  { id: '3', customerId: 'c3', customerName: 'Bob Wilson', practitionerId: 'p1', practitionerName: 'Dr. Smith', status: 'completed', amount: 120, commission: 9.6, practitionerEarnings: 110.4, date: '2026-03-26', time: '11:00 AM', createdAt: '2026-03-20', completionVerifiedByAdmin: true, completionProof: 'Session completed successfully. Patients reported immediate relief.' },
  { id: '4', customerId: 'c4', customerName: 'Jane Doe', practitionerId: 'p1', practitionerName: 'Dr. Smith', status: 'completed', amount: 90, commission: 7.2, practitionerEarnings: 82.8, date: '2026-03-25', time: '09:00 AM', createdAt: '2026-03-19', completionVerifiedByAdmin: false, completionProof: 'Waiting for admin verification.' },
];

export const PractitionerDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStatusUpdate = async (id: string, status: Booking['status']) => {
    try {
      if (id.length > 5) { // Likely a real Firestore ID
        await updateDoc(doc(db, 'bookings', id), { status });
      }
    } catch (error) {
      console.error('Failed to update booking status in Firestore:', error);
    }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    
    if (status === 'cancelled') {
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        try {
          await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              booking: {
                ...booking,
                customerEmail: 'customer@example.com',
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
    }
  };

  const handleMarkAsDone = async (id: string) => {
    const proof = prompt('Please enter a brief session summary or proof of completion for the record:');
    if (proof !== null) {
      const completionData = {
        status: 'completed' as const,
        completionTimestamp: new Date().toISOString(),
        completionProof: proof,
        completionVerifiedByAdmin: false
      };

      try {
        if (id.length > 5) {
          await updateDoc(doc(db, 'bookings', id), completionData);
        }
      } catch (error) {
        console.error('Failed to mark booking as done in Firestore:', error);
      }

      setBookings(prev => prev.map(b => b.id === id ? { ...b, ...completionData } : b));
    }
  };

  const handleReschedule = async (id: string) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    const newTime = prompt('Enter new time (e.g., 10:00 AM):');
    
    if (newDate && newTime) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, date: newDate, time: newTime } : b));
      
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        try {
          await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              booking: {
                ...booking,
                date: newDate,
                time: newTime,
                customerEmail: 'customer@example.com',
                customerPhone: '+1234567890',
                practitionerEmail: 'practitioner@example.com',
                practitionerPhone: '+0987654321',
              },
              type: 'reschedule'
            })
          });
        } catch (error) {
          console.error('Failed to send reschedule notification:', error);
        }
      }
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

  const handlePayout = async () => {
    setIsProcessing(true);
    const totalEarnings = bookings
      .filter(b => b.status === 'completed' && b.completionVerifiedByAdmin)
      .reduce((sum, b) => sum + b.practitionerEarnings, 0);
    
    try {
      const response = await fetch('/api/admin/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: Math.round(totalEarnings * 100),
          currency: 'usd'
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(`Payout of $${totalEarnings.toFixed(2)} initiated successfully!`);
      } else {
        alert("Failed to initiate payout: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Payout error:", error);
      alert("Failed to initiate payout.");
    } finally {
      setIsProcessing(false);
    }
  };

  const stats = [
    { label: 'Total Earnings', value: '$4,250', icon: DollarSign, color: 'bg-teal-500' },
    { label: 'Total Sessions', value: '52', icon: Calendar, color: 'bg-rose-500' },
    { label: 'New Customers', value: '12', icon: Users, color: 'bg-slate-800' },
  ];

  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="p-10 bg-white rounded-[2rem] shadow-2xl border border-slate-50">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-serif text-slate-900">Practitioner Dashboard</h2>
          <p className="text-slate-400 font-light text-sm mt-1">Manage your sessions and earnings</p>
        </div>
        <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full -mr-10 -mt-10 transition-all group-hover:scale-150" />
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
              <stat.icon className="text-white w-6 h-6" />
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-3xl font-serif text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-12 p-8 bg-slate-900 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent" />
        </div>
        <h3 className="text-xl font-serif text-white mb-8 flex items-center gap-3 relative z-10">
          <Activity className="w-6 h-6 text-teal-500" />
          Analytics & Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-start gap-5 hover:bg-white/10 transition-colors">
            <div className="bg-teal-500/20 p-3 rounded-lg text-teal-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Avg. Duration</p>
              <p className="text-xl font-serif text-white mt-1">45 mins</p>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-start gap-5 hover:bg-white/10 transition-colors">
            <div className="bg-rose-500/20 p-3 rounded-lg text-rose-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Peak Hours</p>
              <p className="text-xl font-serif text-white mt-1">2 PM - 5 PM</p>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-start gap-5 hover:bg-white/10 transition-colors">
            <div className="bg-teal-500/20 p-3 rounded-lg text-teal-500">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Retention</p>
              <p className="text-xl font-serif text-white mt-1">85%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12 p-8 bg-slate-50 border border-slate-100 rounded-2xl">
        <h3 className="text-xl font-serif text-slate-900 mb-6">Practitioner Payout</h3>
        
        <div className="bg-slate-900 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-white font-serif text-lg mb-2">Connect your bank account</h4>
            <p className="text-slate-400 text-sm font-light">Set up your Stripe Connect account to receive payouts directly.</p>
          </div>
          <button 
            onClick={handleConnectStripe}
            disabled={isProcessing}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl hover:shadow-teal-100 disabled:opacity-50 uppercase tracking-widest text-xs whitespace-nowrap"
          >
            {isProcessing ? 'Connecting...' : 'Set up Payouts'}
          </button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Available for Payout</p>
            <p className="text-4xl font-serif text-slate-900">
              ${bookings.filter(b => b.status === 'completed' && b.completionVerifiedByAdmin).reduce((sum, b) => sum + b.practitionerEarnings, 0).toFixed(2)}
            </p>
            <p className="text-[10px] text-slate-400 mt-2">
              Pending Verification: ${bookings.filter(b => b.status === 'completed' && !b.completionVerifiedByAdmin).reduce((sum, b) => sum + b.practitionerEarnings, 0).toFixed(2)}
            </p>
          </div>
          <button 
            onClick={handlePayout}
            disabled={isProcessing}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl hover:shadow-teal-100 disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {isProcessing ? 'Processing...' : 'Initiate Payout'}
          </button>
        </div>
        <div className="text-[10px] text-slate-400 flex justify-between items-center uppercase tracking-widest font-bold">
          <p>Payout to: <span className="text-slate-900">Stripe Connected Account</span></p>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-xl font-serif text-slate-900 mb-8">Upcoming Appointments</h3>
        <div className="space-y-6">
          {upcomingBookings.map(booking => (
            <div key={booking.id} className={`flex items-center justify-between p-8 bg-white border rounded-2xl transition-all group hover:shadow-xl ${booking.status === 'pending' ? 'border-rose-200 bg-rose-50/30' : 'border-slate-50'}`}>
              <div>
                <div className="font-serif text-lg text-slate-900 flex items-center gap-3">
                  {booking.customerName}
                  {booking.status === 'pending' && (
                    <span className="bg-rose-100 text-rose-600 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest animate-pulse">
                      Ringing...
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-teal-500" /> {booking.date} at {booking.time}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {booking.status === 'confirmed' && (
                  <button onClick={() => handleMarkAsDone(booking.id)} className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-xl hover:shadow-teal-100 transition-all flex items-center gap-2 font-bold px-6 text-[10px] uppercase tracking-widest">
                    <Check className="w-4 h-4" /> Session Done
                  </button>
                )}
                {booking.status === 'pending' && (
                  <button onClick={() => handleStatusUpdate(booking.id, 'confirmed')} className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-xl hover:shadow-teal-100 transition-all flex items-center gap-2 font-bold px-6 text-[10px] uppercase tracking-widest">
                    <Check className="w-4 h-4" /> Accept
                  </button>
                )}
                <button onClick={() => handleReschedule(booking.id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all">
                  <Clock className="w-5 h-5" />
                </button>
                <button onClick={() => handleStatusUpdate(booking.id, 'cancelled')} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-serif text-slate-900 mb-8">Past Appointments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-300 font-bold uppercase tracking-widest border-b border-slate-50">
                <th className="pb-6">Customer</th>
                <th className="pb-6">Date</th>
                <th className="pb-6">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {pastBookings.map((row, i) => (
                <tr key={i} className="border-b border-slate-50/50 last:border-0 group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 font-serif">{row.customerName}</td>
                  <td className="py-6 text-xs text-slate-400">{row.date}</td>
                  <td className="py-6 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${row.status === 'completed' ? 'bg-teal-50 text-teal-600' : 'bg-rose-50 text-rose-600'}`}>
                      {row.status}
                    </span>
                    {row.completionVerifiedByAdmin && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PractitionerDashboard;
