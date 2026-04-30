/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';
import { PractitionerProfile } from '../types';
import { MapPin, Tag, Clock, Award, FileText, Check, Camera, Image as ImageIcon } from 'lucide-react';
import { storage, auth, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

interface PractitionerRegistrationProps {
  onSuccess: () => void;
  onCancel: () => void;
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
const DAYS_OF_WEEK_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CURRENCIES = [
  { code: 'SAR', flag: '🇸🇦', label: 'Saudi Arabia' },
  { code: 'AED', flag: '🇦🇪', label: 'UAE' },
  { code: 'CNY', flag: '🇨🇳', label: 'China' },
  { code: 'MYR', flag: '🇲🇾', label: 'Malaysia' },
  { code: 'IDR', flag: '🇮🇩', label: 'Indonesia' },
  { code: 'TRY', flag: '🇹🇷', label: 'Turkey' },
  { code: 'GBP', flag: '🇬🇧', label: 'UK' },
  { code: 'PKR', flag: '🇵🇰', label: 'Pakistan' },
  { code: 'USD', flag: '🇺🇸', label: 'US' },
  { code: 'AUD', flag: '🇦🇺', label: 'Australia' },
  { code: 'EUR', flag: '🇩🇪', label: 'Germany' },
  { code: 'NZD', flag: '🇳🇿', label: 'New Zealand' },
  { code: 'CHF', flag: '🇨🇭', label: 'Switzerland' },
  { code: 'CAD', flag: '🇨🇦', label: 'Canada' },
  { code: 'THB', flag: '🇹🇭', label: 'Thailand' },
  { code: 'KRW', flag: '🇰🇷', label: 'South Korea' },
  { code: 'JPY', flag: '🇯🇵', label: 'Japan' },
  { code: 'PHP', flag: '🇵🇭', label: 'Philippines' },
  { code: 'SGD', flag: '🇸🇬', label: 'Singapore' },
];

export const PractitionerRegistration: React.FC<PractitionerRegistrationProps> = ({ onSuccess, onCancel }) => {
  const { register, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    specialties: [] as string[],
    pricePerSession: 50,
    currency: 'USD',
    address: '',
    availability: DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day]: { active: false, start: '09:00', end: '17:00' }
    }), {} as Record<string, { active: boolean; start: string; end: string }>),
    displayName: user?.displayName || '',
    email: user?.email || '',
    credentialsFile: null as File | null,
    profilePictureFile: null as File | null,
    profilePicturePreview: user?.photoURL || '',
    googleMapsApiKey: '',
    startTime: '09:00',
    endTime: '17:00'
  });

  const handleToggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleToggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          active: !prev.availability[day].active
        }
      }
    }));
  };

  const handleAvailabilityTimeChange = (day: string, type: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [type]: value
        }
      }
    }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePictureFile: file,
        profilePicturePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload credentials
      let credentialsUrl = '';
      if (formData.credentialsFile) {
        const storageRef = ref(storage, `credentials/${user?.uid}/${formData.credentialsFile.name}`);
        await uploadBytes(storageRef, formData.credentialsFile);
        credentialsUrl = await getDownloadURL(storageRef);
      }

      // Upload profile picture
      let photoURL = formData.profilePicturePreview;
      if (formData.profilePictureFile) {
        const photoRef = ref(storage, `profile_pictures/${user?.uid}/${formData.profilePictureFile.name}`);
        await uploadBytes(photoRef, formData.profilePictureFile);
        photoURL = await getDownloadURL(photoRef);
      }

      // Update Auth Profile if needed
      if (auth.currentUser && (auth.currentUser.displayName !== formData.displayName || auth.currentUser.photoURL !== photoURL)) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName,
          photoURL: photoURL
        });
      }

      // Simulate API call
      const practitionerData: Partial<PractitionerProfile> = {
        displayName: formData.displayName,
        email: formData.email,
        role: 'practitioner',
        bio: formData.bio,
        specialties: formData.specialties,
        pricePerSession: formData.pricePerSession,
        currency: formData.currency,
        location: {
          address: formData.address,
          lat: 0, // Mock lat/lng
          lng: 0
        },
        availability: formData.availability,
        businessHours: {
          start: formData.startTime,
          end: formData.endTime
        },
        totalSessions: 0,
        verificationStatus: 'pending',
        credentialsUrl,
        photoURL
      };

      await register(practitionerData);
      
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        alert('Registration successful! Please check your email to verify your account.');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-44 pb-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-50"
      >
        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent" />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl font-serif mb-2">Become a Practitioner</h2>
            <p className="text-slate-400 font-light">Join our global network of Al Hijamah experts and grow your practice.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          {/* Profile Picture */}
          <section className="flex flex-col items-center justify-center space-y-6 pb-6 border-b border-slate-50">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-xl relative bg-slate-50 flex items-center justify-center">
                {formData.profilePicturePreview ? (
                  <img src={formData.profilePicturePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-200" />
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                </label>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white p-2 rounded-full shadow-lg">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Profile Picture</h3>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Recommended: Square image, max 2MB</p>
            </div>
          </section>

          {/* Basic Info */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
              <Award className="w-4 h-4 text-teal-500" /> Professional Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-teal-500 outline-none transition-all bg-slate-50/50 text-slate-700 placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-teal-500 outline-none transition-all bg-slate-50/50 text-slate-700 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                Business or office address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500" />
                <input
                  type="text"
                  placeholder="Enter your business or office address"
                  value={formData.googleMapsApiKey}
                  onChange={e => setFormData({ ...formData, googleMapsApiKey: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 focus:border-teal-500 outline-none transition-all bg-white text-slate-700 font-bold shadow-sm"
                />
              </div>
            </div>
          </section>

          {/* Bio */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
              <FileText className="w-4 h-4 text-teal-500" /> About You
            </h3>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Professional Bio</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your experience, approach, and qualifications..."
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-teal-500 outline-none transition-all bg-slate-50/50 text-slate-700 placeholder:text-slate-300 resize-none"
              />
            </div>
          </section>

          {/* Credentials Upload */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
              <FileText className="w-4 h-4 text-teal-500" /> Professional Credentials
            </h3>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Upload Certification/License</label>
              <input
                type="file"
                required
                accept=".pdf,.jpg,.png"
                onChange={e => setFormData({ ...formData, credentialsFile: e.target.files?.[0] || null })}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-teal-500 outline-none transition-all bg-slate-50/50 text-slate-400"
              />
              <p className="text-[10px] text-slate-300 mt-2 uppercase tracking-widest font-bold">Accepted formats: PDF, JPG, PNG.</p>
            </div>
          </section>

          {/* Specialties */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
              <Award className="w-4 h-4 text-teal-500" /> Specialties
            </h3>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES_OPTIONS.map(specialty => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => handleToggleSpecialty(specialty)}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all flex items-center gap-2 uppercase tracking-widest border ${
                    formData.specialties.includes(specialty)
                      ? 'bg-teal-600 text-white border-teal-600 shadow-lg'
                      : 'bg-white text-slate-400 border-slate-100 hover:border-teal-200'
                  }`}
                >
                  {formData.specialties.includes(specialty) && <Check className="w-3 h-3" />}
                  {specialty}
                </button>
              ))}
            </div>
          </section>

          {/* Pricing & Location */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                <Tag className="w-4 h-4 text-teal-500" /> Pricing
              </h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Select Currency</label>
                <div className="flex flex-wrap gap-2 mb-6">
                  {CURRENCIES.map(curr => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => setFormData({ ...formData, currency: curr.code })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                        formData.currency === curr.code
                          ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                          : 'bg-white border-slate-100 text-slate-400 hover:border-teal-200'
                      }`}
                    >
                      <span>{curr.flag}</span>
                      <span>{curr.code}</span>
                    </button>
                  ))}
                </div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Price per Session ({formData.currency})</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">{formData.currency}</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.pricePerSession}
                    onChange={e => setFormData({ ...formData, pricePerSession: parseInt(e.target.value) || 0 })}
                    className="w-full pl-16 pr-4 py-3 rounded-xl border border-slate-100 focus:border-teal-500 outline-none transition-all bg-slate-50/50 text-slate-700"
                  />
                </div>
                <p className="text-[10px] text-slate-300 mt-3 uppercase tracking-widest font-bold">You will receive 92% of this amount after our platform fee.</p>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                <MapPin className="w-4 h-4 text-teal-500" /> Location
              </h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Clinic Address / City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dubai, UAE"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-teal-500 outline-none transition-all bg-slate-50/50 text-slate-700 placeholder:text-slate-300"
                />
              </div>

              <div className="pt-2">
                <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Full Clinic Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-300" />
                  <input
                    type="text"
                    placeholder="Enter your full clinic address"
                    value={(formData as any).fullAddress || ''}
                    onChange={e => setFormData({ ...formData, fullAddress: e.target.value } as any)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 focus:border-teal-500 outline-none transition-all bg-slate-50/50 text-slate-700 placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Availability & Business Hours */}
          <section className="space-y-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                <Clock className="w-4 h-4 text-teal-500" /> Weekly Availability
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {DAYS_OF_WEEK_FULL.map((day, idx) => {
                  const shortDay = DAYS_OF_WEEK[idx];
                  const dayData = formData.availability[shortDay];
                  const isSelected = dayData.active;
                  return (
                    <div 
                      key={day} 
                      className={`flex flex-col gap-4 p-4 rounded-3xl border-2 transition-all ${
                        isSelected 
                          ? 'bg-teal-50 border-teal-500 shadow-sm' 
                          : 'bg-white border-slate-100 hover:border-teal-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-4 cursor-pointer">
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'bg-teal-500 border-teal-500' : 'bg-white border-slate-200'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            isSelected ? 'text-teal-900' : 'text-slate-400'
                          }`}>
                            {day}
                          </span>
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={isSelected}
                            onChange={() => handleToggleDay(shortDay)}
                          />
                        </label>

                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-teal-600" />
                            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Set Hours</span>
                          </div>
                        )}
                      </div>

                      {isSelected && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Start Time</label>
                            <input
                              type="time"
                              value={dayData.start}
                              onChange={(e) => handleAvailabilityTimeChange(shortDay, 'start', e.target.value)}
                              className="w-full bg-white border border-teal-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:border-teal-500 outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">End Time</label>
                            <input
                              type="time"
                              value={dayData.end}
                              onChange={(e) => handleAvailabilityTimeChange(shortDay, 'end', e.target.value)}
                              className="w-full bg-white border border-teal-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:border-teal-500 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500" />
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 focus:border-teal-500 outline-none transition-all bg-white text-slate-700 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">End Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500" />
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 focus:border-teal-500 outline-none transition-all bg-white text-slate-700 font-bold"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-6 pt-10 border-t border-slate-50">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-teal-600 hover:bg-teal-700 text-white px-12 py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center gap-3 uppercase tracking-widest text-xs ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
