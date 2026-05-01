import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, HeartPulse } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { AppCheckIntegrator } from './AppCheckIntegrator';

import { GOOGLE_MAPS_CONFIG } from '../constants';

const GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_CONFIG.apiKey;
const GOOGLE_MAPS_MAP_ID = GOOGLE_MAPS_CONFIG.mapId;

export const ContactUs: React.FC = () => {
  const clinicLocation = { lat: 25.2048, lng: 55.2708 }; // Dubai, UAE as a central location for this app
  return (
    <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-blue-50"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6">
            Get in Touch with <span className="text-green-600">Cupping Connect</span>
          </h1>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto leading-relaxed">
            Experience the pinnacle of holistic healing and wellness. Whether you have questions about our platform, need assistance booking a session, or want to join our elite network of practitioners, our dedicated Customer Support team is here to ensure your journey is seamless and transformative.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Customer Support</h2>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Call Us Directly</h3>
                <p className="text-gray-800 mb-2">Speak with our wellness concierges for immediate assistance.</p>
                <a href="tel:612-562-9116" className="text-2xl font-extrabold text-blue-600 hover:text-blue-800 transition-colors">
                  612-562-9116
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Email Support</h3>
                <p className="text-gray-800 mb-2">Send us your inquiries and we'll respond within 24 hours.</p>
                <a href="mailto:supportcuppingconnet@gmail.com" className="text-lg font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  supportcuppingconnet@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Hours of Operation</h3>
                <p className="text-gray-800">Monday - Friday: 8:00 AM - 8:00 PM EST</p>
                <p className="text-gray-800">Saturday - Sunday: 9:00 AM - 5:00 PM EST</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-3xl p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">Why Choose Cupping Connect?</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Verified Excellence</h4>
                  <p className="text-sm text-gray-800">Every practitioner on our platform undergoes a rigorous vetting process to guarantee the highest standards of care.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <HeartPulse className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Immediate Relief</h4>
                  <p className="text-sm text-gray-800">Find the right specialist exactly when you need them, with transparent pricing and instant booking.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Local & Accessible</h4>
                  <p className="text-sm text-gray-800">Connecting you with top-tier holistic health professionals right in your neighborhood.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Google Maps Integration */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Our Headquarters</h2>
          <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-inner border border-blue-100 bg-blue-50/30">
            {GOOGLE_MAPS_API_KEY ? (
              <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <AppCheckIntegrator />
                <Map
                  defaultCenter={clinicLocation}
                  defaultZoom={13}
                  mapId={GOOGLE_MAPS_MAP_ID}
                  gestureHandling={'greedy'}
                  disableDefaultUI={true}
                  className="w-full h-full"
                >
                  <AdvancedMarker position={clinicLocation}>
                    <Pin background={'#10b981'} borderColor={'#ffffff'} glyphColor={'#ffffff'} />
                  </AdvancedMarker>
                </Map>
              </APIProvider>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-blue-50/50">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Interactive Map Preview</h3>
                <p className="text-gray-600 max-w-sm">
                  Zoom and pan to explore our clinic locations around the globe.
                </p>
              </div>
            )}
            
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-blue-50 max-w-md">
                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-2 rounded-xl">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Cupping Connect HQ</h4>
                    <p className="text-sm text-gray-600">Sheikh Zayed Road, Dubai, UAE</p>
                    <p className="text-xs text-gray-500 mt-1 italic">Main Operations & Practitioner Support Center</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
