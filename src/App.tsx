/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WorldMap } from './components/WorldMap';
import { PainPointSection } from './components/PainPointSection';
import { EducationalSection } from './components/EducationalSection';
import { MigraineGuideSection } from './components/MigraineGuideSection';
import { CervicalGuideSection } from './components/CervicalGuideSection';
import { LumbarGuideSection } from './components/LumbarGuideSection';
import { MuscleRecoveryGuideSection } from './components/MuscleRecoveryGuideSection';
import { DetoxificationSection } from './components/DetoxificationSection';
import { BenefitsAndPricing } from './components/BenefitsAndPricing';
import { HowItWorksSection } from './components/HowItWorksSection';
import { SpecialistSearchPage } from './components/SpecialistSearchPage';
import { PractitionerCard } from './components/PractitionerCard';
import { PractitionerProfile } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { BookingModal } from './components/BookingModal';
import { useAuth } from './AuthContext';
import { UserDashboard } from './components/UserDashboard';
import { ContactUs } from './components/ContactUs';
import { AdminDashboard } from './components/AdminDashboard';
import { Logo } from './components/Logo';
import { Star, ArrowUpDown, Filter, Calendar as CalendarIcon, Shield } from 'lucide-react';

import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

const SPECIALTIES_OPTIONS = [
  'Pedicures',
  'Paraffin treatments',
  'Beauty packages',
  'Wet Cupping',
  'Dry Cupping',
  'Massage Cupping',
  'SPA Massage',
  'Sports Recovery',
  'Detox',
  'Migraine Relief',
  'Stress Management',
  'General Wellness',
  'Traditional Hijamah',
  'Traditional Chinese Medicine (TCM)',
  'Japanese Acupuncture',
  'Korean Acupuncture',
  'Vietnamese Acupuncture',
  'Marmapuncture',
  'Auricular (Ear) Acupuncture',
  'Korean Hand Acupuncture',
  'Scalp Acupuncture',
  'Sujok Therapy',
  'Western Medical Acupuncture',
  'Dry Needling (Trigger Point Acupuncture)',
  'Electroacupuncture',
  'Five Element Acupuncture',
  'Master Tung & Dr. Tan Balance Method',
  'Laser Acupuncture',
  'Swedish Massage',
  'Aromatherapy Massage',
  'Hot Stone Massage',
  'Balinese Massage',
  'Deep Tissue Massage',
  'Trigger Point Massage',
  'Manual Lymphatic Drainage (MLD)',
  'Medical Massage',
  'Neuromuscular Therapy (NMT)',
  'Thai Massage',
  'Shiatsu',
  'Ayurvedic Massage',
  'Tui Na',
  'Sports Massage',
  'Prenatal Massage',
  'Chair Massage'
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

import { PractitionerRegistration } from './components/PractitionerRegistration';
import { PractitionerVerification } from './components/PractitionerVerification';
import { Chat } from './components/Chat';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { BookingConfirmationDialog } from './components/BookingConfirmationDialog';
import { LearnMore } from './components/LearnMore';

const MOCK_PRACTITIONERS: PractitionerProfile[] = [
  {
    uid: '1',
    email: 'ahmed@example.com',
    displayName: 'Dr. Ahmed Al-Farsi',
    role: 'practitioner',
    bio: 'Specialist in wet cupping and sports recovery with over 10 years of experience in Al Hijamah therapy.',
    specialties: ['Wet Cupping', 'Sports Recovery', 'Detox', 'Traditional Chinese Medicine (TCM)'],
    pricePerSession: 85,
    currency: 'USD',
    totalSessions: 1240,
    location: {
      lat: 25.2048,
      lng: 55.2708,
      address: 'Dubai, UAE'
    },
    availability: ['Mon', 'Wed', 'Fri', 'Sat'],
    createdAt: new Date().toISOString(),
    verificationStatus: 'verified',
    credentialsUrl: ''
  },
  {
    uid: '2',
    email: 'sarah@example.com',
    displayName: 'Sarah Johnson',
    role: 'practitioner',
    bio: 'Certified practitioner focusing on migraine relief and stress management through dry and wet cupping.',
    specialties: ['Migraine Relief', 'Stress Management', 'Dry Cupping', 'Deep Tissue Massage'],
    pricePerSession: 70,
    currency: 'USD',
    totalSessions: 850,
    location: {
      lat: 51.5074,
      lng: -0.1278,
      address: 'London, UK'
    },
    availability: ['Tue', 'Thu', 'Sun'],
    createdAt: new Date().toISOString(),
    verificationStatus: 'verified',
    credentialsUrl: ''
  },
  {
    uid: '3',
    email: 'omar@example.com',
    displayName: 'Omar Hassan',
    role: 'practitioner',
    bio: 'Holistic health expert specializing in traditional Al Hijamah for general wellness and detoxification.',
    specialties: ['Traditional Hijamah', 'General Wellness', 'Detox'],
    pricePerSession: 65,
    currency: 'USD',
    totalSessions: 620,
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'New York, USA'
    },
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    createdAt: new Date().toISOString(),
    verificationStatus: 'verified',
    credentialsUrl: ''
  },
  {
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
  }
];

export default function App() {
  const [practitioners, setPractitioners] = React.useState<PractitionerProfile[]>(MOCK_PRACTITIONERS);
  const [selectedPractitioner, setSelectedPractitioner] = React.useState<PractitionerProfile | null>(null);
  const [confirmedPractitioner, setConfirmedPractitioner] = React.useState<PractitionerProfile | null>(null);
  const [bookingDetails, setBookingDetails] = React.useState<any>(null);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [chatPractitioner, setChatPractitioner] = React.useState<PractitionerProfile | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [userLocation, setUserLocation] = React.useState<{ lat: number; lng: number } | null>(() => {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [sortBy, setSortBy] = React.useState<'default' | 'distance'>(() => {
    const savedLocation = localStorage.getItem('userLocation');
    return savedLocation ? 'distance' : 'default';
  });
  const [selectedSpecialty, setSelectedSpecialty] = React.useState<string>('all');
  const [selectedDay, setSelectedDay] = React.useState<string>('all');
  const [verificationStatusFilter, setVerificationStatusFilter] = React.useState<'all' | 'verified' | 'pending'>('verified');
  const [view, setView] = React.useState<'home' | 'dashboard' | 'registration' | 'search' | 'privacy-policy' | 'terms-of-service' | 'verification' | 'learn-more' | 'contact-us'>('home');
  const [dashboardTab, setDashboardTab] = React.useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const practitionersListRef = React.useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Persist location to localStorage
  React.useEffect(() => {
    if (userLocation) {
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
    } else {
      localStorage.removeItem('userLocation');
    }
  }, [userLocation]);

  // Listen to practitioners in Firestore
  React.useEffect(() => {
    const path = 'users';
    const q = query(collection(db, path), where('role', '==', 'practitioner'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestorePractitioners = snapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id
      } as PractitionerProfile));
      
      setPractitioners(prev => {
        const merged = [...firestorePractitioners];
        const seenUids = new Set(merged.map(p => p.uid));
        
        MOCK_PRACTITIONERS.forEach(mock => {
          if (!seenUids.has(mock.uid)) {
            merged.push(mock);
            seenUids.add(mock.uid);
          }
        });
        return merged;
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, []);

  // Handle URL parameters
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const stripeOnboarded = params.get('stripe_onboarded');
    const sessionId = params.get('session_id');
    const practitionerId = params.get('practitionerId');

    if (viewParam === 'dashboard') {
      setView('dashboard');
    }

    if (stripeOnboarded === 'true') {
      // Clear the URL parameters without reloading the page
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => {
        alert("Stripe account connected successfully! You can now receive payouts.");
      }, 500);
    }

    if (sessionId) {
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => {
        alert("Payment successful! Your booking is confirmed.");
        setView('dashboard');
      }, 500);
    }
  }, []);

  // Handle shared practitioner profiles
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const practitionerId = params.get('practitionerId');
    
    if (practitionerId && practitioners.length > 0) {
      const p = practitioners.find(p => p.uid === practitionerId);
      if (p) {
        setSelectedPractitioner(p);
        // Clear the param to avoid re-opening on every render/navigation
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('practitionerId');
        window.history.replaceState({}, document.title, newUrl.toString());
      }
    }
  }, [practitioners]);

  // Expose onMessage to window for PractitionerCard access
  const handleMessage = React.useCallback((p: PractitionerProfile, initialMessage?: string) => {
    if (!user) {
      alert('Please login to message practitioners.');
      setIsAuthModalOpen(true);
      return;
    }
    
    if (initialMessage) {
      const roomId = [user.uid, p.uid].sort().join('_');
      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          message: initialMessage,
          senderId: user.uid,
          senderName: user.displayName || 'User'
        })
      }).catch(err => console.error('Failed to send initial message:', err));
    }
    
    setChatPractitioner(p);
  }, [user]);

  React.useEffect(() => {
    (window as any).onMessage = handleMessage;
  }, [handleMessage]);

  const handleFindNearest = () => {
    const handleSuccess = (lat: number, lng: number) => {
      setUserLocation({ lat, lng });
      setSortBy('distance');
      setTimeout(() => {
        practitionersListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleSuccess(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to a default location (e.g., London) for demo purposes if blocked
          alert("Location access denied or unavailable. Using a demo location (London) to show nearest practitioners.");
          handleSuccess(51.5074, -0.1278);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Using a demo location (London).");
      handleSuccess(51.5074, -0.1278);
    }
  };

  const handleBook = (id: string, initialSpecialty?: string, initialDay?: string) => {
    const p = practitioners.find(p => p.uid === id);
    if (p) {
      setSelectedPractitioner({ ...p, initialSpecialty, initialDay } as any);
    }
  };

  const handleApprove = (id: string) => {
    setPractitioners(prev => prev.map(p => p.uid === id ? { ...p, verificationStatus: 'verified' } : p));
  };

  const handleReject = (id: string) => {
    setPractitioners(prev => prev.map(p => p.uid === id ? { ...p, verificationStatus: 'rejected' } : p));
  };


  const handleConfirmBooking = async (data: any) => {
    console.log('Booking confirmed:', data);
    setBookingDetails(data);
    setConfirmedPractitioner(selectedPractitioner);
    setShowConfirmation(true);

    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking: {
            ...data,
            customerName: user?.displayName || 'Guest',
            customerEmail: user?.email || 'guest@example.com',
            customerPhone: '+1234567890', // In a real app, this would come from user profile
            practitionerEmail: selectedPractitioner?.email || 'practitioner@example.com',
            practitionerPhone: '+0987654321', // In a real app, this would come from practitioner profile
          },
          type: 'new'
        }),
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
    
    setSelectedPractitioner(null);
  };

  const filteredPractitioners = practitioners
    .filter(p => {
      const matchesSearch = p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.location.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'all' || p.specialties.includes(selectedSpecialty);
      const matchesDay = selectedDay === 'all' || (
        p.availability ? (Array.isArray(p.availability) 
          ? p.availability.includes(selectedDay)
          : (p.availability as any)[selectedDay]?.active) : false
      );
      const matchesVerification = verificationStatusFilter === 'all' || p.verificationStatus === verificationStatusFilter;
      
      return matchesSearch && matchesSpecialty && matchesDay && matchesVerification;
    })
    .sort((a, b) => {
      if (sortBy === 'distance' && userLocation) {
        const distA = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, a.location.lat, a.location.lng);
        const distB = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, b.location.lat, b.location.lng);
        return distA - distB;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-blue-50/30 font-sans selection:bg-blue-200 selection:text-blue-900">
      <Navbar 
        onNavigate={(v) => setView(v)} 
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
      />
      
      <AnimatePresence>
        {selectedPractitioner && (
          <BookingModal
            practitioner={selectedPractitioner}
            onClose={() => setSelectedPractitioner(null)}
            onConfirm={handleConfirmBooking}
          />
        )}
        {showConfirmation && bookingDetails && confirmedPractitioner && (
          <BookingConfirmationDialog
            isOpen={showConfirmation}
            bookingDetails={bookingDetails}
            practitioner={confirmedPractitioner}
            onClose={() => setShowConfirmation(false)}
            onViewDashboard={() => {
              setShowConfirmation(false);
              setView('dashboard');
            }}
          />
        )}
        {chatPractitioner && (
          <Chat 
            practitioner={chatPractitioner}
            onClose={() => setChatPractitioner(null)}
          />
        )}
      </AnimatePresence>

      <main className="relative z-10">
        {view === 'dashboard' && user ? (
          <UserDashboard 
            onViewMessages={(practitionerId) => {
              if (practitionerId) {
                const target = practitioners.find(p => p.uid === practitionerId) || MOCK_PRACTITIONERS.find(p => p.uid === practitionerId);
                if (target) setChatPractitioner(target);
              } else {
                // If "View All Messages" is clicked, default to the first available practitioner for demo purposes
                if (practitioners.length > 0) {
                  setChatPractitioner(practitioners[0]);
                } else if (MOCK_PRACTITIONERS.length > 0) {
                  setChatPractitioner(MOCK_PRACTITIONERS[0]);
                }
              }
            }}
            practitioners={practitioners} 
            initialTab={dashboardTab}
          />
        ) : view === 'registration' ? (
          <PractitionerRegistration 
            onSuccess={() => setView('dashboard')}
            onCancel={() => setView('home')}
          />
        ) : view === 'search' ? (
          <SpecialistSearchPage 
            practitioners={practitioners}
            onSelectPractitioner={(p) => setSelectedPractitioner(p)}
            onBook={handleBook}
            onMessage={handleMessage}
            onNavigateToRegistration={() => setView('registration')}
          />
        ) : view === 'privacy-policy' ? (
          <PrivacyPolicy />
        ) : view === 'terms-of-service' ? (
          <TermsOfService />
        ) : view === 'contact-us' ? (
          <ContactUs />
        ) : view === 'verification' ? (
          <AdminDashboard />
        ) : view === 'learn-more' ? (
          <LearnMore onRegister={() => setView('registration')} />
        ) : (
          <>
            <Hero 
              onFindNearest={handleFindNearest} 
              onSearch={(location, specialty) => {
                setSearchQuery(location);
                if (specialty) {
                  // Try to match specialty, otherwise just use search query for both
                  const matchedSpecialty = SPECIALTIES_OPTIONS.find(s => s.toLowerCase().includes(specialty.toLowerCase()));
                  if (matchedSpecialty) {
                    setSelectedSpecialty(matchedSpecialty);
                  } else {
                    setSearchQuery(prev => prev ? `${prev} ${specialty}` : specialty);
                  }
                }
                setView('search');
              }}
            />
            
            <HowItWorksSection onStepClick={(index) => {
              if (index === 0) { // Find a Specialist
                setView('search');
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              } else if (index === 1) { // Choose Your Service
                setView('search');
              } else if (index === 2) { // Book an Appointment
                practitionersListRef.current?.scrollIntoView({ behavior: 'smooth' });
              } else if (index === 3) { // Get Treated
                if (user) {
                  setDashboardTab('past');
                  setView('dashboard');
                } else {
                  setIsAuthModalOpen(true);
                }
              }
            }} />
            
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <button 
                    onClick={handleFindNearest}
                    className="group"
                  >
                    <h2 className="text-4xl font-serif text-slate-900 mb-4 group-hover:text-teal-600 transition-colors">Discover Practitioner Near You</h2>
                    <p className="text-xl text-slate-500 group-hover:text-slate-700 transition-colors font-light">Find the best Hijamah experts near you. Click to use your location →</p>
                  </button>
                </div>
                <WorldMap 
                  practitioners={practitioners} 
                  onSelectPractitioner={(p) => setSelectedPractitioner(p)} 
                  userLocation={userLocation}
                />
              </div>
            </section>

            <EducationalSection />
            
            <BenefitsAndPricing />

            <PainPointSection />
            
            <MigraineGuideSection />

            <CervicalGuideSection />

            <LumbarGuideSection />

            <MuscleRecoveryGuideSection onNavigateToSearch={() => setView('search')} />

            <DetoxificationSection />
            
            <section ref={practitionersListRef} className="py-20 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                  <div>
                    <h2 className="text-3xl font-serif text-slate-900 mb-2">Top Rated Practitioners</h2>
                    <p className="text-slate-500 font-light">Find the best Al Hijamah experts near you worldwide.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex items-center">
                      <ArrowUpDown className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="pl-9 pr-4 py-2 rounded-xl border border-slate-100 outline-none focus:border-teal-400 transition-all bg-white text-sm font-medium text-slate-700 appearance-none cursor-pointer"
                      >
                        <option value="default">Default Sort</option>
                        <option value="rating">Highest Rated</option>
                        {userLocation && <option value="distance">Nearest</option>}
                      </select>
                    </div>

                    <div className="relative flex items-center">
                      <Shield className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select 
                        value={verificationStatusFilter}
                        onChange={(e) => setVerificationStatusFilter(e.target.value as any)}
                        className="pl-9 pr-4 py-2 rounded-xl border border-slate-100 outline-none focus:border-teal-400 transition-all bg-white text-sm font-medium text-slate-700 appearance-none cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <div className="relative flex items-center">
                      <Filter className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select 
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="pl-9 pr-4 py-2 rounded-xl border border-slate-100 outline-none focus:border-teal-400 transition-all bg-white text-sm font-medium text-slate-700 appearance-none cursor-pointer"
                      >
                        <option value="all">All Specialties</option>
                        {SPECIALTIES_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative flex items-center">
                      <CalendarIcon className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select 
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="pl-9 pr-4 py-2 rounded-xl border border-slate-100 outline-none focus:border-teal-400 transition-all bg-white text-sm font-medium text-slate-700 appearance-none cursor-pointer"
                      >
                        <option value="all">Any Day</option>
                        {DAYS_OF_WEEK.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <input 
                        type="text" 
                        placeholder="Search by name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-slate-100 outline-none focus:border-teal-400 transition-all text-sm"
                      />
                    </div>

                    {(selectedSpecialty !== 'all' || selectedDay !== 'all' || searchQuery !== '' || verificationStatusFilter !== 'all') && (
                      <button 
                        onClick={() => {
                          setSelectedSpecialty('all');
                          setSelectedDay('all');
                          setSearchQuery('');
                          setVerificationStatusFilter('all');
                        }}
                        className="text-sm text-rose-500 font-bold hover:underline"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPractitioners.map((p, index) => (
                    <motion.div
                      key={p.uid}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PractitionerCard practitioner={p} onBook={handleBook} onMessage={handleMessage} minimal={true} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-slate-900 py-24 px-4 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent" />
              </div>
              <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-4xl md:text-5xl font-serif mb-8">Are you a Practitioner?</h2>
                <p className="text-xl text-slate-300 mb-12 font-light leading-relaxed">
                  Take your practice to the next level with Cupping Connect. Join the world’s leading network to automate your management, reach a wider audience, and simplify your workday effortlessly.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button 
                    onClick={() => setView('registration')}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-12 py-5 rounded-2xl transition-all shadow-xl text-lg uppercase tracking-widest"
                  >
                    Register as Provider
                  </button>
                  <button 
                    onClick={() => setView('learn-more')}
                    className="bg-transparent border-2 border-slate-700 hover:border-teal-500 text-white font-bold px-12 py-5 rounded-2xl transition-all text-lg uppercase tracking-widest"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </section>

          </>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
          {/* Main Brand Box */}
          <div className="flex flex-col lg:flex-row items-center gap-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-sm w-full lg:w-auto">
            <div className="flex items-center cursor-pointer group" onClick={() => setView('home')}>
              <Logo className="w-[60px] h-[60px] mr-5 transition-transform group-hover:scale-105 drop-shadow-md" variant="square" />
              <div className="flex flex-col">
                <span className="text-3xl font-serif text-slate-900 tracking-tighter group-hover:text-teal-600 transition-colors">
                  Cupping <span className="italic text-teal-600">Connect</span>
                </span>
              </div>
            </div>
            
            <div className="hidden lg:block w-px h-12 bg-slate-200 mx-4"></div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setView('home')}
                className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest bg-teal-600 text-white px-8 py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-600/20 active:scale-95"
              >
                Find A Provider
              </button>
              <button 
                onClick={() => setView('registration')}
                className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl hover:border-teal-500 hover:text-teal-600 transition-all active:scale-95"
              >
                Become A Practitioner
              </button>
            </div>
          </div>
          
          {/* Secondary Footer Info */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full border-t border-slate-100 pt-8 gap-8 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
            <div className="flex flex-wrap justify-center gap-8">
              <button onClick={() => setView('privacy-policy')} className="hover:text-teal-600 transition-colors">Privacy Policy</button>
              <button onClick={() => setView('terms-of-service')} className="hover:text-teal-600 transition-colors">Terms of Service</button>
              <button onClick={() => setView('contact-us')} className="hover:text-teal-600 transition-colors">Contact Us</button>
            </div>
            
            <p className="font-medium opacity-60">
              © 2026 Cupping Connect Platform. Built for professional care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
