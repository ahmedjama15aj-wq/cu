/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';
import { PractitionerProfile } from '../types';
import { MapPin, List, Star, Compass, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { RollingLocations } from './RollingLocations';
import { AppCheckIntegrator } from './AppCheckIntegrator';
import { GOOGLE_MAPS_CONFIG } from '../constants';

const apiKey = GOOGLE_MAPS_CONFIG.apiKey;
const mapId = GOOGLE_MAPS_CONFIG.mapId;

interface Props {
  practitioners: PractitionerProfile[];
  onSelectPractitioner: (p: PractitionerProfile) => void;
  className?: string;
  userLocation?: { lat: number; lng: number } | null;
  searchRadius?: number | 'all';
}

const RecenterButton = ({ userLocation }: { userLocation?: { lat: number; lng: number } | null }) => {
  const map = useMap();
  const handleRecenter = useCallback(() => {
    if (!map) return;
    if (userLocation) {
      map.panTo({ lat: userLocation.lat, lng: userLocation.lng });
      map.setZoom(10);
    } else {
      map.panTo({ lat: 20, lng: 0 });
      map.setZoom(2);
    }
  }, [map, userLocation]);

  return (
    <button 
      onClick={handleRecenter}
      className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 w-full justify-center border border-orange-100"
    >
      <Compass className="w-4 h-4" />
      Recenter View
    </button>
  );
};

const ZoomControls = () => {
  const map = useMap();
  return (
    <div className="flex flex-col gap-2 pointer-events-auto">
      <div className="bg-[#18181B]/95 backdrop-blur-xl p-2 rounded-2xl border border-[#F97316]/30 flex flex-col gap-1 shadow-2xl">
        <button 
          onClick={() => map?.setZoom((map.getZoom() || 10) + 1)}
          className="p-3 bg-white/5 hover:bg-[#F97316] hover:text-[#18181B] text-[#F97316] rounded-xl transition-all active:scale-95 shadow-inner"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button 
          onClick={() => map?.setZoom((map.getZoom() || 10) - 1)}
          className="p-3 bg-white/5 hover:bg-[#F97316] hover:text-[#18181B] text-[#F97316] rounded-xl transition-all active:scale-95 shadow-inner"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const WorldMap: React.FC<Props> = ({ practitioners, onSelectPractitioner, className = "", userLocation, searchRadius }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedPractitioner = practitioners.find(p => p.uid === selectedId);

  if (!apiKey) {
    return (
      <div className={`flex flex-col gap-6 ${className}`}>
        <div className="relative w-full h-[600px] bg-[#18181B] rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center p-8 border-2 border-[#F97316]/20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
            className="w-20 h-20 bg-[#F97316]/10 rounded-full flex items-center justify-center mb-6 border border-[#F97316]/30 cursor-pointer"
          >
            <Compass className="w-10 h-10 text-[#F97316]" />
          </motion.button>
          <h3 className="text-2xl font-black text-[#FFF7ED] uppercase tracking-tighter mb-4">Discovery Map</h3>
          <div className="bg-[#18181B]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-[#F97316]/30 max-w-lg shadow-2xl">
            <p className="text-[#FFF7ED] text-base leading-relaxed mb-6 font-bold">
              Zoom and pan to find Hijamah practitioners worldwide. Each marker represents a certified specialist ready to serve you.
            </p>
            <p className="text-[#F97316] text-xs font-black uppercase tracking-[0.2em] mb-8">
              Interactive Map Experience
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 1200, behavior: 'smooth' })}
              className="w-full bg-[#F97316] text-[#18181B] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#F97316]/20 hover:bg-[#FFF7ED] transition-all"
            >
              Explore Near You
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <APIProvider apiKey={apiKey}>
        <AppCheckIntegrator />
        <div className="relative w-full h-[700px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-[#18181B] group bg-[#FFF7ED]">
          <RollingLocations />
          
          <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
            <button
              onClick={() => setShowList(!showList)}
              className="flex items-center gap-2 bg-[#18181B] backdrop-blur-xl px-5 py-3.5 rounded-2xl shadow-2xl border border-[#F97316]/30 text-[#F97316] font-black uppercase tracking-widest text-xs hover:bg-[#F97316] hover:text-[#18181B] transition-all active:scale-95"
            >
              {showList ? <MapPin className="w-4 h-4" /> : <List className="w-4 h-4" />}
              {showList ? 'Hide Directory' : 'Open Directory'}
            </button>
          </div>

          <Map
            defaultCenter={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : { lat: 20, lng: 0 }}
            defaultZoom={userLocation ? 10 : 2}
            mapId={mapId}
            reuseMaps={true}
            disableDefaultUI={true}
            gestureHandling={'greedy'}
            className="w-full h-full"
          >
            {practitioners.map((p) => (
              <AdvancedMarker
                key={p.uid}
                position={{ lat: p.location.lat, lng: p.location.lng }}
                onClick={() => setSelectedId(p.uid)}
                onMouseEnter={() => setHoveredId(p.uid)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2, zIndex: 50 }}
                  className="relative cursor-pointer"
                >
                  <Pin
                    background={selectedId === p.uid ? '#F97316' : '#18181B'}
                    borderColor={'#FFF7ED'}
                    glyphColor={'#FFF7ED'}
                  />
                  
                  <AnimatePresence>
                    {hoveredId === p.uid && selectedId !== p.uid && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#18181B]/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-[#F97316]/30 min-w-[160px] pointer-events-none"
                      >
                        <p className="text-[#F97316] font-black text-xs uppercase tracking-tight">{p.displayName}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AdvancedMarker>
            ))}

            {userLocation && (
              <AdvancedMarker position={{ lat: userLocation.lat, lng: userLocation.lng }}>
                <div className="relative">
                  <div className="absolute inset-0 animate-ping bg-[#F97316] rounded-full opacity-75" />
                  <div className="relative w-5 h-5 bg-[#F97316] border-2 border-[#FFF7ED] rounded-full shadow-lg" />
                </div>
              </AdvancedMarker>
            )}

            {selectedPractitioner && (
              <InfoWindow
                position={{ lat: selectedPractitioner.location.lat, lng: selectedPractitioner.location.lng }}
                onCloseClick={() => setSelectedId(null)}
                headerDisabled={true}
              >
                <div className="p-4 bg-[#FFF7ED] min-w-[250px] rounded-xl">
                  <h4 className="font-black text-[#18181B] text-base uppercase mb-2">{selectedPractitioner.displayName}</h4>
                  <p className="text-[#18181B]/70 text-xs mb-3 line-clamp-2 font-bold">{selectedPractitioner.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {selectedPractitioner.specialties.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-[10px] px-2.5 py-1 bg-[#18181B] text-[#F97316] rounded-full font-black border border-[#F97316]/10 uppercase tracking-tighter">
                        {s}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onSelectPractitioner(selectedPractitioner)}
                    className="w-full bg-[#18181B] text-[#F97316] py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#F97316] hover:text-[#18181B] transition-all"
                  >
                    View Specialist Profile
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>

          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none flex-col md:flex-row gap-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowList(!showList)}
              className="bg-[#18181B]/95 backdrop-blur-2xl p-7 rounded-[2.5rem] shadow-2xl border border-[#F97316]/20 max-w-sm pointer-events-auto text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-[#F97316]/10 rounded-xl group-hover:bg-[#F97316] group-hover:text-[#18181B] transition-all">
                  <Maximize className="w-5 h-5 text-[#F97316] group-hover:text-[#18181B]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#FFF7ED] uppercase tracking-tighter">Discovery Hub</h4>
                  <p className="text-[10px] text-[#F97316]/60 uppercase font-black tracking-widest">Ultra-Updated Live Map</p>
                </div>
              </div>
              <p className="text-[10px] text-[#FFF7ED]/70 font-bold leading-relaxed mb-6">
                Zoom and pan to find Hijamah practitioners worldwide. Each marker represents a certified specialist ready to serve you.
              </p>
              <RecenterButton userLocation={userLocation} />
            </motion.div>

            <ZoomControls />
          </div>
        </div>
      </APIProvider>

      <AnimatePresence>
        {showList && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[#18181B] rounded-[3.5rem] shadow-2xl border border-[#F97316]/20 p-10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-black text-[#FFF7ED] uppercase tracking-tighter">Global Specialist Directory</h3>
                <p className="text-[#F97316]/80 text-xs font-black uppercase tracking-widest mt-1">Verified Specialists Found: {practitioners.length}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {practitioners.map((p) => (
                <div 
                  key={p.uid} 
                  onClick={() => onSelectPractitioner(p)}
                  className="group p-6 rounded-[2rem] border border-[#F97316]/10 hover:border-[#F97316]/50 hover:bg-[#F97316]/5 transition-all cursor-pointer bg-slate-900/40 flex flex-col h-full gap-5 shadow-xl backdrop-blur-sm"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-[#FFF7ED] text-base uppercase tracking-tight group-hover:text-[#F97316] transition-colors leading-tight">{p.displayName}</h4>
                  </div>
                  
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {p.specialties.slice(0, 2).map((spec, i) => (
                      <span key={i} className="text-[10px] px-3 py-1 bg-[#F97316]/10 text-[#F97316] rounded-full font-black uppercase tracking-tighter border border-[#F97316]/10">
                        {spec}
                      </span>
                    ))}
                    {p.specialties.length > 2 && (
                      <span className="text-[10px] px-3 py-1 bg-slate-800 text-slate-400 rounded-full font-black uppercase tracking-tighter">
                        +{p.specialties.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
