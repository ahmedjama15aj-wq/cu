/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, User, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Chrome } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: 'home' | 'dashboard' | 'search' | 'registration' | 'privacy-policy' | 'terms-of-service' | 'verification') => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onNavigate }) => {
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    await login();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto pt-10 sm:pt-20 md:pt-32">
          <motion.div
            layout
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.y) > 100) {
                onClose();
              }
            }}
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] w-full max-w-md overflow-hidden border border-slate-100 mb-10 cursor-grab active:cursor-grabbing"
          >
            <div className="bg-black p-6 md:p-10 text-white relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1.5 bg-white/20 rounded-full" />
              </div>
              
              <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500 rounded-full blur-[60px] -ml-24 -mb-24 opacity-50" />
              </div>
              
              <button 
                onClick={onClose} 
                className="absolute top-6 right-6 md:top-8 md:right-8 bg-white/10 hover:bg-orange-500 text-white p-2 rounded-2xl transition-all z-20 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative z-10 text-center">
                <h3 className="text-xl md:text-2xl font-serif mb-2 leading-tight">
                  Welcome to <br />
                  <span className="text-orange-500 italic">Cupping</span> Connect
                </h3>
                <p className="text-slate-300 font-light text-xs md:text-sm">
                  Sign in to access your dashboard and book sessions.
                </p>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-6 md:space-y-8 bg-white">
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-black hover:bg-slate-900 text-white font-bold py-5 md:py-6 rounded-[1.5rem] transition-all shadow-xl flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs active:scale-95 transform"
              >
                <Chrome className="w-6 h-6 text-orange-500" />
                <span>Continue with Google</span>
              </button>

              <div className="text-center pt-2 md:pt-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-loose max-w-[280px] mx-auto">
                  By continuing, you agree to our <br />
                  <button 
                    onClick={() => {
                      onClose();
                      onNavigate?.('terms-of-service');
                    }}
                    className="text-black underline cursor-pointer hover:text-orange-600 font-bold"
                  >
                    Terms of Service
                  </button> and <button 
                    onClick={() => {
                      onClose();
                      onNavigate?.('privacy-policy');
                    }}
                    className="text-black underline cursor-pointer hover:text-orange-600 font-bold"
                  >
                    Privacy Policy
                  </button>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
