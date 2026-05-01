/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, ShieldCheck, Sparkles, X, Globe, Activity, Wind, Droplets, Heart, Footprints, Gift, Scissors } from 'lucide-react';
import { Logo } from './Logo';
import { AnimatePresence } from 'motion/react';

export const Hero: React.FC<{ onFindNearest?: () => void, onSearch?: (location: string, specialty: string) => void }> = ({ onFindNearest, onSearch }) => {
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');

  const [infoModal, setInfoModal] = useState<{ title: string, content: string } | null>(null);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(location, specialty);
    }
  };

  const infoData = {
    technical: {
      title: "Technical Connection",
      content: "Cupping Connect utilizes a state-of-the-art platform to bridge the gap between patients and certified practitioners. Our system features real-time geolocation discovery, secure encrypted payments, and an automated booking engine that ensures a seamless experience from search to session."
    },
    organic: {
      title: "Organic Therapy",
      content: "We prioritize the traditional and holistic roots of Cupping Therapy (Al Hijamah). Our platform connects you with practitioners who are certified in various organic methods, including wet, dry, and massage cupping, focusing on natural healing, detoxification, and immediate physical relief."
    },
    verified: {
      title: "Verified Practitioners",
      content: "Every practitioner on Cupping Connect undergoes a rigorous verification process. We verify their professional certifications, clinical experience, and identity to ensure you receive the highest standard of care. Look for the orange shield badge to identify providers who have met our strict quality benchmarks."
    },
    payments: {
      title: "Secure Online Payments",
      content: "Your financial security is our top priority. We partner with Stripe to provide industry-leading payment processing. Whether you use Credit Card, Apple Pay, Google Pay, or PayPal, your transactions are protected by 256-bit SSL encryption and secure tokenization, ensuring your data never touches our servers."
    },
    acupuncture: {
      title: "Acupuncture Therapy",
      content: "Traditional Chinese medicine using fine needles to stimulate specific points on the body. Effective for pain relief, hormonal balance, and nervous system regulation. Our practitioners are fully licensed and follow strict clinical safety protocols."
    },
    massage_spa: {
      title: "Massage Spa",
      content: "A luxury therapeutic retreat focusing on full-body relaxation and stress reduction. Includes aromatherapy and heated stones to melt away tension and restore your body's natural baseline of calm."
    },
    cupping: {
      title: "Ancient Cupping",
      content: "Specialized suction therapy to increase blood flow, reduce inflammation, and facilitate the release of toxins deep within muscle tissue. We offer wet, dry, and fire cupping performed by certified experts."
    },
    massage: {
      title: "Massage Therapy",
      content: "Deep tissue and remedial massage techniques designed to address musculoskeletal issues, improve posture, and assist in athletic recovery. Tailored to your specific body concerns and pain points."
    },
    pedicures: {
      title: "Medical Pedicures",
      content: "Professional foot care that goes beyond aesthetics. Focuses on nail health, skin rejuvenation, and pressure point relief, ensuring your foundation remains healthy and pain-free."
    },
    paraffin: {
      title: "Paraffin Treatments",
      content: "Soothing heat treatments using therapeutic wax to soften skin, improve joint mobility, and provide deep-reaching warmth for arthritic or overused hands and feet."
    },
    beauty: {
      title: "Beauty Packages",
      content: "Comprehensive wellness and beauty packages that combine our therapeutic services for a complete body overhaul. Designed for those seeking a total reset of their physical and mental well-being."
    }
  };

  return (
    <div className="relative pt-32 pb-24 px-4 min-h-screen flex items-center">
      {/* Video Background */}
      <div className="fixed inset-0 w-full h-[100dvh] -z-10 pointer-events-none bg-slate-950">
        <div className="absolute inset-0 bg-slate-950/70 z-10" /> {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-slate-950/60 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-cupping-therapy-physiotherapist-puts-jars-on-patient-body-40280-large.mp4" 
            type="video/mp4" 
          />
        </video>
      </div>

      <div className="max-w-7xl mx-auto relative z-20 w-full">
        <div className="text-center max-w-5xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20 px-4">
            <div className="text-left text-white">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-6xl md:text-8xl font-serif text-white mb-8 leading-[1.05] tracking-tight font-medium"
              >
                Cupping <span className="text-orange-500 italic drop-shadow-[0_4px_20px_rgba(249,115,22,0.4)]">Connect</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl text-slate-100 mb-10 leading-relaxed font-light max-w-2xl drop-shadow-lg"
              >
                Experience the perfect balance of modern technology and ancient healing. We connect you with verified practitioners for immediate relief and long-term wellness.
              </motion.p>

              <div className="flex flex-wrap gap-4 mb-12">
                <button 
                  onClick={() => setInfoModal(infoData.technical)}
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-7 py-4.5 rounded-2xl border border-white/10 hover:bg-white/15 transition-all group shadow-xl"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">Technical Connection</span>
                </button>
                <button 
                  onClick={() => setInfoModal(infoData.organic)}
                  className="flex items-center gap-3 bg-orange-500/5 backdrop-blur-xl px-7 py-4.5 rounded-2xl border border-orange-500/20 hover:bg-orange-500/10 transition-all group shadow-xl"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">Organic Therapy</span>
                </button>
              </div>
            </div>

            <div className="relative flex justify-center lg:flex mb-12 lg:mb-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl">
                  <Logo 
                    className="w-64 h-64 md:w-80 md:h-80 brightness-110 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]" 
                    variant="square" 
                    bgClassName="p-4 bg-[#FFF7ED]/50 backdrop-blur-xl rounded-[2.5rem] border border-[#F97316]/20 shadow-2xl"
                  />
                </div>
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-orange-500/15 rounded-full blur-[120px] -z-0" />
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 max-w-7xl mx-auto px-4"
          >
            {[
              { name: "Acupuncture", full: "Acupuncture", info: "Traditional meridian balance.", icon: <Activity className="text-orange-500 w-4 h-4" />, modal: infoData.acupuncture, smallTitle: true },
              { name: "Massage Spa", full: "Massage Spa", info: "Luxury therapeutic retreat.", icon: <Wind className="text-orange-500 w-5 h-5" />, modal: infoData.massage_spa },
              { name: "Cupping", full: "Cupping", info: "Ancient detox circulation.", icon: <Droplets className="text-orange-500 w-5 h-5" />, modal: infoData.cupping },
              { name: "Massage", full: "Massage", info: "Deep tissue muscle relief.", icon: <Heart className="text-orange-500 w-5 h-5" />, modal: infoData.massage },
              { name: "Pedicures", full: "Pedicures", info: "Medical-grade foot therapy.", icon: <Footprints className="text-orange-500 w-5 h-5" />, modal: infoData.pedicures },
              { name: "Paraffin", full: "Paraffin", info: "Soothing heat treatments.", icon: <Sparkles className="text-orange-500 w-5 h-5" />, modal: infoData.paraffin },
              { name: "Beauty", full: "Beauty", info: "Holistic wellness packages.", icon: <Scissors className="text-orange-500 w-5 h-5" />, modal: infoData.beauty },
            ].map((service) => (
              <button
                key={service.info}
                onClick={() => setInfoModal(service.modal)}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] hover:bg-white/15 hover:border-orange-500/50 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10 transition-all text-center flex flex-col items-center justify-center gap-3 shadow-xl active:scale-95 min-h-[140px] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-transparent transition-all pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20 group-hover:scale-110 transition-all shadow-inner`}>
                    {service.icon}
                  </div>
                  
                  <div className="flex flex-col gap-1.5 items-center">
                    <span className={`text-white font-bold uppercase tracking-[0.15em] transition-colors leading-tight ${service.smallTitle ? 'text-[9px]' : 'text-[10px]'}`}>
                      {service.name}
                    </span>
                    <span className="text-slate-400 text-[9px] leading-snug font-medium group-hover:text-slate-200 transition-colors px-2">
                      {service.info}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col md:flex-row gap-4 max-w-5xl mx-auto"
          >
            <div className="flex-[1.5] flex items-center gap-4 px-6 py-4 border-b md:border-b-0 md:border-r border-slate-50">
              <MapPin className="text-teal-500 w-6 h-6" />
              <input
                type="text"
                placeholder="Where are you?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-300"
              />
            </div>
            <div className="flex-1 flex items-center gap-4 px-6 py-4">
              <Search className="text-rose-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search specialty..."
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-300"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleSearch}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg active:scale-95"
              >
                Find Now
              </button>
              <button 
                onClick={onFindNearest}
                className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 border border-orange-100"
              >
                <MapPin className="w-5 h-5" />
                Nearest
              </button>
            </div>
          </motion.div>
          
          <div className="mt-16 flex flex-wrap items-center justify-center gap-12 text-sm font-semibold text-slate-400">
            <button 
              onClick={() => setInfoModal(infoData.verified)}
              className="flex items-center gap-3 hover:text-orange-600 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-orange-600 w-5 h-5" />
              </div>
              <span>Verified Practitioners</span>
            </button>
            <button 
              onClick={() => setInfoModal(infoData.payments)}
              className="flex items-center gap-3 hover:text-rose-500 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-rose-500 w-5 h-5" />
              </div>
              <span>Secure Online Payments</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {infoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInfoModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              layout
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.y) > 100) {
                  setInfoModal(null);
                }
              }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2rem] shadow-2xl p-8 max-w-lg w-full overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <div className="flex justify-center mb-6">
                <div className="w-12 h-1.5 bg-slate-100 rounded-full" />
              </div>
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-500" />
              <button 
                onClick={() => setInfoModal(null)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-2xl font-serif text-slate-900">{infoModal.title}</h3>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-8">
                {infoModal.content}
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    const title = infoModal.title.toLowerCase();
                    let beautyFound = false;
                    // Map title back to specialty for search
                    const specialties = ["Acupuncture", "Massage Spa", "Cupping", "Massage", "Pedicures", "Paraffin", "Beauty"];
                    const match = specialties.find(s => title.includes(s.toLowerCase()));
                    if (match) {
                      onSearch?.('', match);
                    }
                    setInfoModal(null);
                  }}
                  className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Find Practitioners
                </button>
                <button 
                  onClick={() => setInfoModal(null)}
                  className="w-full bg-slate-100 text-slate-900 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
