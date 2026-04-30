import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { WorldMap } from './WorldMap';
import { PractitionerCard } from './PractitionerCard';
import { PractitionerProfile } from '../types';
import { Search, Filter, Calendar as CalendarIcon, ArrowUpDown, MapPin, Navigation } from 'lucide-react';

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

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

interface Props {
  practitioners: PractitionerProfile[];
  onSelectPractitioner: (p: PractitionerProfile) => void;
  onBook: (id: string, initialSpecialty?: string, initialDay?: string) => void;
  onMessage: (p: PractitionerProfile, initialMessage?: string) => void;
  onNavigateToRegistration: () => void;
}

export const SpecialistSearchPage: React.FC<Props> = ({ practitioners, onSelectPractitioner, onBook, onMessage, onNavigateToRegistration }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'distance'>(() => {
    const savedLocation = localStorage.getItem('userLocation');
    return savedLocation ? 'distance' : 'default';
  });
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(() => {
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
  const [searchRadius, setSearchRadius] = useState<number | 'all'>('all');
  const [isLocating, setIsLocating] = useState(false);

  // Persist location to localStorage
  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
    } else {
      localStorage.removeItem('userLocation');
    }
  }, [userLocation]);

  const handleGetLocation = () => {
    setIsLocating(true);
    
    const handleSuccess = (lat: number, lng: number) => {
      setUserLocation({ lat, lng });
      if (searchRadius === 'all') {
        setSearchRadius(50); // Default to 50km when location is first found
      }
      if (sortBy === 'default') {
        setSortBy('distance');
      }
      setIsLocating(false);
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleSuccess(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Location access denied or unavailable. Using a demo location (London) to show nearest practitioners.");
          handleSuccess(51.5074, -0.1278);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Using a demo location (London).");
      handleSuccess(51.5074, -0.1278);
    }
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
      
      let matchesDistance = true;
      if (userLocation && searchRadius !== 'all') {
        const distance = getDistanceFromLatLonInKm(
          userLocation.lat, userLocation.lng,
          p.location.lat, p.location.lng
        );
        matchesDistance = distance <= searchRadius;
      }
      
      return matchesSearch && matchesSpecialty && matchesDay && matchesDistance;
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
    <div className="min-h-screen bg-[#FFF7ED] pt-36 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12 relative">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-[#18181B] mb-4"
          >
            Find a Recovery Specialist
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#18181B]/60 max-w-2xl mx-auto mb-8 font-medium leading-relaxed"
          >
            Search our global network of certified Al Hijamah and cupping therapy practitioners.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onNavigateToRegistration}
            className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] px-8 py-3 rounded-full font-black hover:bg-[#F97316]/20 transition-all border border-[#F97316]/20 uppercase tracking-widest text-[10px]"
          >
            Are you a specialist? Register your business
          </motion.button>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 mb-12"
        >
          <div className="flex flex-col md:flex-row flex-wrap gap-6">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search by name or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 outline-none focus:border-[#F97316] transition-all bg-slate-50/30 text-slate-700 placeholder:text-slate-300 font-medium"
              />
            </div>
            
            <div className="relative flex items-center min-w-[180px]">
              <Filter className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <select 
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full pl-9 pr-4 py-4 rounded-2xl border border-slate-100 outline-none focus:border-[#F97316] transition-all bg-slate-50/30 text-sm font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="all">All Specialties</option>
                {SPECIALTIES_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="relative flex items-center min-w-[150px]">
              <CalendarIcon className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <select 
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full pl-9 pr-4 py-4 rounded-2xl border border-slate-100 outline-none focus:border-[#F97316] transition-all bg-slate-50/30 text-sm font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="all">Any Day</option>
                {DAYS_OF_WEEK.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="relative flex items-center min-w-[160px]">
              <ArrowUpDown className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <select 
                value={sortBy}
                onChange={(e) => {
                  const newSortBy = e.target.value as any;
                  if (newSortBy === 'distance' && !userLocation) {
                    handleGetLocation();
                  }
                  setSortBy(newSortBy);
                }}
                className="w-full pl-9 pr-4 py-4 rounded-2xl border border-slate-100 outline-none focus:border-[#F97316] transition-all bg-slate-50/30 text-sm font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="default">Default Sort</option>
                <option value="distance">Nearest</option>
              </select>
            </div>
          </div>

          {/* Distance Filter Row */}
          <div className="flex flex-col md:flex-row flex-wrap gap-6 mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGetLocation}
                disabled={isLocating}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${
                  userLocation 
                    ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20' 
                    : 'bg-[#18181B] text-white border border-[#18181B] hover:bg-[#F97316] hover:text-[#18181B]'
                }`}
              >
                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-pulse' : ''}`} />
                {isLocating ? 'Locating...' : userLocation ? 'Location Set' : 'Use My Location'}
              </button>
              
              {userLocation && (
                <button 
                  onClick={() => {
                    setUserLocation(null);
                    setSearchRadius('all');
                    if (sortBy === 'distance') setSortBy('default');
                  }}
                  className="text-[10px] text-slate-400 hover:text-[#F97316] underline uppercase tracking-widest font-black"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex-1 flex items-center gap-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Search Radius:</span>
              <div className="flex-1 flex items-center gap-6">
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={searchRadius === 'all' ? 500 : searchRadius}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setSearchRadius(val === 500 ? 'all' : val);
                  }}
                  disabled={!userLocation}
                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                    !userLocation ? 'bg-slate-100' : 'bg-[#F97316]/20 accent-[#F97316]'
                  }`}
                />
                <span className="text-xs font-black text-[#F97316] min-w-[70px] uppercase tracking-tighter bg-[#F97316]/5 px-2 py-1 rounded-lg">
                  {searchRadius === 'all' ? 'Anywhere' : `${searchRadius} km`}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Map View */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <WorldMap 
            practitioners={filteredPractitioners} 
            onSelectPractitioner={onSelectPractitioner} 
            className="h-[550px] md:h-[650px]"
            userLocation={userLocation}
            searchRadius={searchRadius}
          />
        </motion.div>

        {/* Results List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif text-[#18181B]">
              {filteredPractitioners.length} <span className="text-[#F97316] italic">Certified Specialists</span> Available
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPractitioners.map((practitioner, index) => (
              <motion.div
                key={practitioner.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * Math.min(index, 10) }}
              >
                <PractitionerCard
                  practitioner={practitioner}
                  onBook={onBook}
                  onMessage={onMessage}
                />
              </motion.div>
            ))}
          </div>
          
          {filteredPractitioners.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[2rem] shadow-xl border border-slate-50">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-teal-300" />
              </div>
              <h3 className="text-2xl font-serif text-slate-900 mb-4">No specialists found</h3>
              <p className="text-slate-400 font-light">Try adjusting your filters or search query to find more practitioners.</p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};
