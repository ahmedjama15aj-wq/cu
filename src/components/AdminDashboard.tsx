import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../AuthContext';
import { PractitionerProfile } from '../types';
import { Check, X, FileText, DollarSign, Clock, Building, ArrowUpRight, Info, Lock, MessageSquare } from 'lucide-react';
import { PractitionerVerification } from './PractitionerVerification';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [pendingPractitioners, setPendingPractitioners] = useState<PractitionerProfile[]>([]);
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stripe state
  const [balance, setBalance] = useState<any>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'financials' | 'verifications' | 'messages' | 'completions'>('financials');
  const [stripeStatus, setStripeStatus] = useState<{ configured: boolean; mode: string; publishableKeySet: boolean } | null>(null);
  const [showStripeModal, setShowStripeModal] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchStripeStatus = async () => {
      try {
        const response = await fetch('/api/admin/stripe-status');
        if (response.ok) {
          setStripeStatus(await response.json());
        }
      } catch (err) {
        console.error("Error fetching stripe status:", err);
      }
    };

    const fetchPending = async () => {
      const path = 'users';
      try {
        const q = query(collection(db, path), where('verificationStatus', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const firestorePractitioners = querySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as PractitionerProfile));
        
        // For demo purposes, we can also include the mock pending practitioner if not in Firestore
        const mockPending = {
          uid: '4',
          email: 'fatima@example.com',
          displayName: 'Fatima Ali',
          role: 'practitioner',
          bio: 'New practitioner specializing in massage cupping and stress management.',
          specialties: ['Massage Cupping', 'Stress Management', 'Deep Tissue Massage'],
          pricePerSession: 50,
          currency: 'USD',
          totalSessions: 0,
          location: {
            lat: 34.0522,
            lng: -118.2437,
            address: 'Los Angeles, USA'
          },
          availability: ['Sat', 'Sun'],
          createdAt: new Date().toISOString(),
          verificationStatus: 'pending',
          credentialsUrl: 'https://example.com/credentials.pdf'
        } as PractitionerProfile;

        const allPending = [...firestorePractitioners];
        const mockDocPath = `users/${mockPending.uid}`;
        try {
          const mockDoc = await getDoc(doc(db, 'users', mockPending.uid));
          if (!mockDoc.exists() && !allPending.find(p => p.uid === mockPending.uid)) {
            allPending.push(mockPending);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, mockDocPath);
        }

        setPendingPractitioners(allPending);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    };
    
    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/admin/balance');
        if (!response.ok) {
          throw new Error('Failed to fetch balance. Ensure Stripe is configured.');
        }
        const data = await response.json();
        setBalance(data);
        setStripeError(null);
      } catch (err: any) {
        setStripeError(err.message);
      }
    };

    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/admin/conversations');
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    const fetchCompletedBookings = async () => {
      const path = 'bookings';
      try {
        const q = query(collection(db, path), where('status', '==', 'completed'));
        const querySnapshot = await getDocs(q);
        const bookings = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setCompletedBookings(bookings);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    };

    Promise.all([fetchPending(), fetchBalance(), fetchConversations(), fetchStripeStatus(), fetchCompletedBookings()]).finally(() => setLoading(false));
  }, []);

  const handleVerifyCompletion = async (id: string) => {
    const path = `bookings/${id}`;
    try {
      await setDoc(doc(db, 'bookings', id), { 
        completionVerifiedByAdmin: true 
      }, { merge: true });
      
      setCompletedBookings(prev => prev.map(b => b.id === id ? { ...b, completionVerifiedByAdmin: true } : b));
      alert("Session completion verified!");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      alert("Failed to verify completion.");
    }
  };

  const handleVerify = async (uid: string, status: 'verified' | 'rejected') => {
    const path = `users/${uid}`;
    try {
      const practitioner = pendingPractitioners.find(p => p.uid === uid);
      if (!practitioner) return;
      
      // Use setDoc with merge: true to handle both existing and new (mock) practitioners
      await setDoc(doc(db, 'users', uid), { 
        ...practitioner,
        verificationStatus: status 
      }, { merge: true });
      
      setPendingPractitioners(prev => prev.filter(p => p.uid !== uid));
      
      if (practitioner?.email) {
        await fetch('/api/admin/verify-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: practitioner.email, status })
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      alert("Failed to update verification status.");
    }
  };

  const handlePayout = async () => {
    if (!payoutAmount || isNaN(Number(payoutAmount)) || Number(payoutAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setIsProcessingPayout(true);
    try {
      const response = await fetch('/api/admin/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(Number(payoutAmount) * 100), // Convert to cents
          currency: 'usd' // Defaulting to USD for demo
        })
      });

      const data = await response.json();
      if (data.success) {
        alert("Payout initiated successfully!");
        setPayoutAmount('');
        // Refresh balance
        const balResponse = await fetch('/api/admin/balance');
        if (balResponse.ok) {
          setBalance(await balResponse.json());
        }
      } else {
        throw new Error(data.error || "Failed to initiate payout");
      }
    } catch (err: any) {
      alert(`Payout failed: ${err.message}\n\nNote: You must link a bank account in your Stripe Dashboard before you can trigger payouts.`);
    } finally {
      setIsProcessingPayout(false);
    }
  };

  if (loading) return <div className="pt-44 pb-20 px-4 text-center">Loading Admin Dashboard...</div>;

  if (!isAdmin) {
    return (
      <div className="pt-44 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-red-100">
          <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have administrative privileges to access this dashboard.</p>
        </div>
      </div>
    );
  }

  const availableBalance = balance?.available?.[0]?.amount ? balance.available[0].amount / 100 : 0;
  const pendingBalance = balance?.pending?.[0]?.amount ? balance.pending[0].amount / 100 : 0;
  const currency = balance?.available?.[0]?.currency?.toUpperCase() || 'USD';

  return (
    <div className="pt-44 pb-20 px-4 min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Platform Admin Dashboard</h1>
            <p className="text-gray-600">Manage verifications, platform fees, and payouts.</p>
          </div>
          <div 
            onClick={() => setShowStripeModal(true)}
            className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-6 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-blue-500 transition-colors">Stripe Connect</span>
              {stripeStatus?.configured ? (
                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> ACTIVE ({stripeStatus.mode})
                </span>
              ) : (
                <span className="text-xs font-bold text-orange-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> MOCK MODE
                </span>
              )}
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-blue-500 transition-colors">Client Keys (VITE_)</span>
              {stripeStatus?.publishableKeySet ? (
                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> CONFIGURED
                </span>
              ) : (
                <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                  <X className="w-3 h-3" /> MISSING
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-6 py-4 font-bold text-sm tracking-widest uppercase transition-all border-b-2 ${
              activeTab === 'financials' ? 'border-blue-600 text-blue-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Financials
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-6 py-4 font-bold text-sm tracking-widest uppercase transition-all border-b-2 ${
              activeTab === 'verifications' ? 'border-blue-600 text-blue-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Verifications ({pendingPractitioners.length})
          </button>
          <button
            onClick={() => setActiveTab('completions')}
            className={`px-6 py-4 font-bold text-sm tracking-widest uppercase transition-all border-b-2 ${
              activeTab === 'completions' ? 'border-blue-600 text-blue-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Completions ({completedBookings.filter(b => !b.completionVerifiedByAdmin).length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-4 font-bold text-sm tracking-widest uppercase transition-all border-b-2 ${
              activeTab === 'messages' ? 'border-blue-600 text-blue-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Messages Oversight ({conversations.length})
          </button>
        </div>

        {activeTab === 'financials' && (
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Financials & Payouts</h2>
          {stripeError ? (
            <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 flex items-start gap-4">
              <Info className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-1">Stripe Configuration Required</h3>
                <p>{stripeError}</p>
                <p className="mt-2 text-sm">Please add your STRIPE_SECRET_KEY to the environment variables to view your balance and trigger payouts.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-50">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Available for Payout</div>
                  <div className="text-4xl font-black text-blue-900">
                    {availableBalance.toFixed(2)} {currency}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-50">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Pending Clearance</div>
                  <div className="text-4xl font-black text-blue-900">
                    {pendingBalance.toFixed(2)} {currency}
                  </div>
                </div>

                <div 
                  onClick={() => document.getElementById('verifications-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-blue-50 cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Pending Verifications</div>
                  <div className="text-4xl font-black text-blue-900">
                    {pendingPractitioners.length}
                  </div>
                </div>
              </div>

              {/* Payout Section */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100">
                <h3 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-3">
                  <Building className="w-6 h-6 text-blue-600" />
                  Withdraw to Personal Bank Account
                </h3>
                
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <div className="text-blue-800 mb-6">
                    <h4 className="font-bold mb-2 text-blue-900">Platform Fees and Payouts</h4>
                    <p className="mb-2">To maintain and operate Cupping Connect, we apply the following fee structure to every completed session:</p>
                    <ul className="list-disc pl-6 space-y-1 mb-4">
                      <li>Cupping Connect platform share: 16% of the base session fee (8% from customer + 8% from practitioner).</li>
                      <li>Practitioner share: 92% of the base session fee (92 out of every 100).</li>
                      <li>Customer total: Base session fee + 8% platform service fee.</li>
                      <li>Stripe Transaction Fees: Deducted from the platform's 16% share, so practitioners receive their full 92% clear.</li>
                    </ul>
                    <p><strong>Note: You must first link your personal bank account in the <a href="https://dashboard.stripe.com/settings/payouts" target="_blank" rel="noreferrer" className="underline font-bold">Stripe Dashboard</a>.</strong></p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                      <label className="block text-sm font-bold text-blue-900 mb-2">Amount to Withdraw ({currency})</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max={availableBalance}
                          step="0.01"
                          value={payoutAmount}
                          onChange={(e) => setPayoutAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-4 pr-4 py-3 rounded-xl border border-blue-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handlePayout}
                      disabled={isProcessingPayout || !payoutAmount || Number(payoutAmount) > availableBalance}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {isProcessingPayout ? 'Processing...' : 'Withdraw Funds'}
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
        )}

        {activeTab === 'verifications' && (
          <section id="verifications-section">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Pending Verifications</h2>
            <PractitionerVerification 
              practitioners={pendingPractitioners} 
              onApprove={(id) => handleVerify(id, 'verified')} 
              onReject={(id) => handleVerify(id, 'rejected')} 
            />
          </section>
        )}

        {activeTab === 'completions' && (
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Session Completion Verification</h2>
            <div className="grid grid-cols-1 gap-6">
              {completedBookings.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] text-center border border-dashed border-gray-200">
                  <p className="text-gray-500">No completed sessions found.</p>
                </div>
              ) : (
                completedBookings.map((booking: any) => (
                  <div key={booking.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-900 text-lg">{booking.practitionerName}</span>
                        <ArrowUpRight className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-600">{booking.customerName}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.date} at {booking.time}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${booking.amount}</span>
                      </div>
                      {booking.completionProof && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest block mb-1">Practitioner Proof/Note</span>
                          <p className="text-sm text-blue-900 italic">"{booking.completionProof}"</p>
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {booking.completionVerifiedByAdmin ? (
                        <div className="flex items-center gap-2 bg-green-50 text-green-600 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest border border-green-100">
                          <Check className="w-4 h-4" /> Verified
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleVerifyCompletion(booking.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-200 active:scale-95 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" /> Mark as Verified
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === 'messages' && (
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-blue-900">Platform Messages Oversight</h2>
              <button 
                onClick={async () => {
                  const response = await fetch('/api/admin/conversations');
                  if (response.ok) setConversations(await response.json());
                }}
                className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-blue-900 hover:bg-gray-50 flex items-center gap-2"
              >
                Refresh
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {conversations.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] text-center border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-1">No messages recorded yet</h3>
                  <p className="text-gray-500">Conversations between users and specialists will appear here for oversight.</p>
                </div>
              ) : (
                conversations.map((conv: any) => (
                  <div key={conv.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gray-50 flex justify-between items-center border-b border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Conversation ID</span>
                        <span className="font-mono text-xs text-blue-900">{conv.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{conv.messages.length} Messages</span>
                      </div>
                    </div>
                    <div className="p-6 max-h-[300px] overflow-y-auto space-y-4">
                      {conv.messages.map((msg: any) => (
                        <div key={msg.id} className="flex gap-4">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-black text-[10px] shrink-0">
                            {msg.senderName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-blue-900">{msg.senderName}</span>
                              <span className="text-[9px] text-gray-400 font-bold uppercase">{new Date(msg.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-2xl rounded-tl-none">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Stripe Configuration Drawer */}
        <AnimatePresence>
          {showStripeModal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowStripeModal(false)}
                className="fixed inset-0 z-50 bg-blue-900/40 backdrop-blur-sm"
              />
              <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  drag="y"
                  dragConstraints={{ top: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 100) setShowStripeModal(false);
                  }}
                  className="bg-white w-full max-w-sm rounded-t-[3rem] shadow-2xl border-x border-t border-blue-100 overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
                >
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 shrink-0 cursor-grab active:cursor-grabbing" />
                  
                  <div className="p-8 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <div>
                      <h3 className="text-xl font-black text-blue-900 leading-tight">Stripe Integration</h3>
                      <p className="text-gray-500 text-xs mt-1">Platform configuration details</p>
                    </div>
                    <button 
                      onClick={() => setShowStripeModal(false)}
                      className="bg-gray-50 p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-8 space-y-6 overflow-y-auto">
                    <div className="space-y-3">
                      <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${stripeStatus?.configured ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                          {stripeStatus?.configured ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900 text-sm mb-0.5">Secret Key</h4>
                          <p className="text-[11px] text-gray-600 leading-relaxed italic">
                            {stripeStatus?.configured 
                              ? `Active: ${stripeStatus.mode}`
                              : "Currently in MOCK MODE."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${stripeStatus?.publishableKeySet ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {stripeStatus?.publishableKeySet ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900 text-sm mb-0.5">Publishable Key</h4>
                          <p className="text-[11px] text-gray-600 leading-relaxed italic">
                            {stripeStatus?.publishableKeySet 
                              ? "Frontend configured."
                              : "Missing VITE_ key."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm">
                        <Lock className="w-3.5 h-3.5" /> Setup Guide
                      </h4>
                      <ol className="text-xs text-gray-600 space-y-3">
                        <li className="flex gap-2.5">
                          <span className="w-4 h-4 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[8px] font-black shrink-0 mt-0.5">1</span>
                          <span>Get keys from <strong>Stripe Dashboard</strong>.</span>
                        </li>
                        <li className="flex gap-2.5">
                          <span className="w-4 h-4 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[8px] font-black shrink-0 mt-0.5">2</span>
                          <span>Add to <strong>Settings</strong> in this editor:</span>
                        </li>
                        <div className="bg-blue-900 text-blue-50 p-3 rounded-lg font-mono text-[9px] ml-6 space-y-1 select-all">
                          <div>STRIPE_SECRET_KEY=sk_...</div>
                          <div>VITE_STRIPE_PUBLISHABLE_KEY=pk_...</div>
                        </div>
                      </ol>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white border-t border-gray-100 shrink-0">
                    <button 
                      onClick={() => setShowStripeModal(false)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
