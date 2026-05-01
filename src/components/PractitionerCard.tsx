/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, MapPin, Clock, MessageSquare, User, ChevronDown, ChevronUp, Calendar, Share2, Info } from 'lucide-react';
import { PractitionerProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { InfoModal } from './InfoModal';
import { INFO_CONTENT } from '../constants';
import { useCurrency } from '../CurrencyContext';
import Markdown from 'react-markdown';

interface Props {
  practitioner: PractitionerProfile;
  onBook: (id: string, initialSpecialty?: string, initialDay?: string) => void;
  onMessage: (p: PractitionerProfile, initialMessage?: string) => void;
  minimal?: boolean;
}

export const PractitionerCard: React.FC<Props> = ({ practitioner, onBook, onMessage, minimal = false }) => {
  const { formatPrice } = useCurrency();
  const [showReviews, setShowReviews] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; title: string; content: string; type: 'therapy' | 'availability' | 'general' }>({
    isOpen: false,
    title: '',
    content: '',
    type: 'general'
  });

  const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const isOpenNow = (() => {
    if (!practitioner.businessHours) return true;
    const now = new Date();
    const [startH, startM] = practitioner.businessHours.start.split(/[:\s]/);
    const [endH, endM] = practitioner.businessHours.end.split(/[:\s]/);
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    
    // Simple 24h comparison for now, assuming standard HH:MM format
    const startNum = parseInt(startH) * 100 + parseInt(startM || '0');
    const endNum = parseInt(endH) * 100 + parseInt(endM || '0');
    const currentNum = currentH * 100 + currentM;

    return currentNum >= startNum && currentNum <= endNum;
  })();

  const handleInfoClick = (key: string) => {
    const info = INFO_CONTENT[key];
    if (info) {
      setModalInfo({
        isOpen: true,
        title: info.title,
        content: info.content,
        type: info.type
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:shadow-2xl transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-50 overflow-hidden border-2 border-teal-500 text-slate-400 shrink-0 flex items-center justify-center">
          {practitioner.photoURL ? (
            <img src={practitioner.photoURL} alt={practitioner.displayName} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-serif text-slate-900 group-hover:text-teal-600 transition-colors flex items-center gap-2 truncate">
            {practitioner.displayName}
            {!minimal && practitioner.verificationStatus === 'verified' && (
              <span className="bg-teal-50 text-teal-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">Verified</span>
            )}
            {!minimal && practitioner.verificationStatus === 'pending' && (
              <span className="bg-rose-50 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">Pending</span>
            )}
            {!minimal && practitioner.verificationStatus === 'rejected' && (
              <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">Rejected</span>
            )}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shadow-sm transition-colors hover:bg-slate-100/50">
              <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
              <span className="font-bold truncate max-w-[200px] sm:max-w-xs">{practitioner.location.address}</span>
            </div>
            {!minimal && (
              <div className={`flex items-center gap-2 text-[11px] px-3 py-2 rounded-2xl border transition-all shadow-sm ${
                isOpenNow 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                <div className="relative">
                  <Clock className={`w-3.5 h-3.5 ${isOpenNow ? 'text-emerald-500' : 'text-slate-400'}`} />
                  {isOpenNow && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-black uppercase tracking-widest leading-none mb-0.5">
                    {practitioner.businessHours 
                      ? `${practitioner.businessHours.start} - ${practitioner.businessHours.end}`
                      : '9:00 AM - 6:00 PM'}
                  </span>
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isOpenNow ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {isOpenNow ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-right flex flex-col items-end shrink-0 ml-auto pl-2">
          <div className="text-2xl font-black text-slate-900 tracking-tighter whitespace-nowrap leading-none mb-1">{formatPrice(practitioner.pricePerSession)}</div>
          <div className="text-[10px] text-teal-600 font-black mb-3 uppercase tracking-[0.3em] whitespace-nowrap">per session</div>
          {!minimal && (
            <button
              onClick={() => onBook(practitioner.uid)}
              className="hidden sm:flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black py-3 px-6 rounded-2xl transition-all shadow-xl hover:shadow-teal-100 active:scale-95 uppercase tracking-widest border-b-4 border-teal-800"
            >
              <Calendar className="w-4 h-4" />
              Book
            </button>
          )}
        </div>
      </div>
      <div className="mt-5 text-slate-600 text-sm leading-relaxed font-serif italic border-l-2 border-teal-100 pl-4 markdown-body">
        <Markdown>{practitioner.bio}</Markdown>
      </div>
      
      {!minimal && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {practitioner.specialties.map((specialty, index) => (
            <button 
              key={index} 
              onClick={() => onBook(practitioner.uid, specialty)}
              className="bg-white text-slate-900 text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest border border-slate-200 hover:border-teal-500 hover:text-teal-600 hover:shadow-sm transition-all flex items-center gap-2 active:scale-95"
            >
              {specialty}
              <Calendar className="w-3 h-3 text-teal-400" />
            </button>
          ))}
        </div>
      )}

      {/* Availability Section */}
      {!minimal && (
        <div className="mt-4 pt-4 border-t border-slate-50">
          <button 
            onClick={() => onBook(practitioner.uid)}
            className="text-[10px] font-bold text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-widest hover:text-teal-600 transition-colors group/avail"
          >
            <Calendar className="w-3.5 h-3.5 text-teal-500" />
            Availability
            <Info className="w-3 h-3 text-slate-200 group-hover/avail:text-teal-400" />
          </button>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {ALL_DAYS.map(day => {
              const isAvailable = practitioner.availability ? (Array.isArray(practitioner.availability)
                ? practitioner.availability.includes(day)
                : (practitioner.availability as any)[day]?.active) : false;
              return (
                <button 
                  key={day} 
                  onClick={() => isAvailable && onBook(practitioner.uid, undefined, day)}
                  className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-tighter transition-all hover:scale-105 active:scale-95 ${
                    isAvailable 
                      ? 'bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 cursor-pointer' 
                      : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Message Input */}
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group/msg-input focus-within:border-teal-200 transition-all">
            <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">
              Quick Inquiry
            </label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                placeholder={`Ask ${practitioner.displayName.split(' ')[0]} a question...`}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && quickMessage.trim()) {
                    onMessage(practitioner, quickMessage);
                    setQuickMessage('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (quickMessage.trim()) {
                    onMessage(practitioner, quickMessage);
                    setQuickMessage('');
                  } else {
                    onMessage(practitioner);
                  }
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl transition-all shadow-md active:scale-95 group/send"
              >
                <MessageSquare className="w-5 h-5 group-hover/send:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
      

      <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
        {!minimal && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            animate={{ 
              boxShadow: ["0px 0px 0px rgba(13, 148, 136, 0)", "0px 0px 25px rgba(13, 148, 136, 0.4)", "0px 0px 0px rgba(13, 148, 136, 0)"] 
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            onClick={() => onBook(practitioner.uid)}
            className="col-span-2 sm:flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black py-5 px-6 rounded-3xl transition-all shadow-2xl flex items-center justify-center gap-3 text-sm uppercase tracking-widest border-b-6 border-teal-800 active:border-b-0 active:translate-y-1 group"
          >
            <Calendar className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            Instant Booking
          </motion.button>
        )}
        <button 
          onClick={() => onBook(practitioner.uid)}
          className="sm:flex-1 border-2 border-slate-100 rounded-3xl hover:bg-slate-50 transition-all text-slate-900 font-black py-4 px-4 active:scale-95 text-[10px] uppercase tracking-widest"
        >
          View Profile
        </button>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => onMessage(practitioner)}
            className="flex-1 sm:flex-none p-4 border-2 border-orange-200 bg-orange-50 rounded-3xl hover:bg-orange-100 transition-all font-black flex items-center justify-center gap-3 active:scale-95 text-orange-700 shadow-lg group"
            title="Open Chat"
          >
            <MessageSquare className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" />
            <span className="sm:hidden lg:inline text-[10px] uppercase tracking-widest">Chat Now</span>
          </button>
          <button 
            onClick={async () => {
              const shareUrl = `${window.location.origin}${window.location.pathname}?practitionerId=${practitioner.uid}`;
              const shareData = {
                title: `Book a session with ${practitioner.displayName}`,
                text: `Check out ${practitioner.displayName} on Cupping Connect!`,
                url: shareUrl,
              };
              
              if (navigator.share) {
                try {
                  await navigator.share(shareData);
                } catch (err) {
                  if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err);
                  }
                }
              } else {
                try {
                  await navigator.clipboard.writeText(shareUrl);
                  alert('Profile link copied to clipboard!');
                } catch (err) {
                  console.error('Failed to copy:', err);
                }
              }
            }}
            className="flex-1 sm:flex-none p-4 border-2 border-slate-100 rounded-3xl hover:bg-slate-50 transition-all text-slate-900 font-bold flex items-center justify-center gap-2 active:scale-95"
            title="Share Profile"
          >
            <Share2 className="w-5 h-5 text-slate-400" />
            <span className="sm:hidden lg:inline text-[10px] uppercase tracking-widest">Share</span>
          </button>
        </div>
      </div>

      <InfoModal
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo(prev => ({ ...prev, isOpen: false }))}
        title={modalInfo.title}
        content={modalInfo.content}
        type={modalInfo.type}
      />
    </div>
  );
};
