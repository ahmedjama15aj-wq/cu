import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Calendar, Clock, MapPin, User, ChevronRight, X } from 'lucide-react';
import { PractitionerProfile } from '../types';
import { useCurrency } from '../CurrencyContext';

interface BookingConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDashboard: () => void;
  practitioner: PractitionerProfile;
  bookingDetails: {
    date: Date;
    time: string;
    totalAmount: number;
    therapyType: string;
    specialty?: string;
    duration?: number;
    currency?: string;
    paymentMethod?: string;
  };
}

export const BookingConfirmationDialog: React.FC<BookingConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onViewDashboard,
  practitioner,
  bookingDetails
}) => {
  const { formatPrice } = useCurrency();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-[2rem] shadow-2xl border border-blue-100 overflow-hidden w-full max-w-sm p-6 text-center"
          >
            {/* Drag Handle */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full mb-4" />

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 mt-4 flex justify-center">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                  className="bg-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200"
                >
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-1.5 border-2 border-emerald-100 rounded-[1.8rem] -z-10"
                />
              </div>
            </div>

            <h2 className="text-xl font-black text-slate-900 mb-1">Booking Confirmed!</h2>
            <p className="text-xs text-slate-500 font-medium mb-6">
              Session with <span className="text-teal-600 font-bold">{practitioner.displayName.split(' ')[0]}</span> scheduled.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left space-y-3 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-teal-600 shadow-sm border border-slate-200">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Date</div>
                  <div className="text-xs font-bold text-slate-700">
                    {new Date(bookingDetails.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-teal-600 shadow-sm border border-slate-200">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Time</div>
                  <div className="text-xs font-bold text-slate-700">{bookingDetails.time}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Paid</span>
                <span className="text-base font-black text-slate-900">{formatPrice(bookingDetails.totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={onViewDashboard}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-2 uppercase tracking-widest text-xs border-b-4 border-teal-800 active:border-b-0 active:translate-y-0.5"
              >
                Go to Dashboard
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 text-[9px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-[0.2em] transition-colors"
              >
                Close
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3 text-slate-400">
              <MapPin className="w-4 h-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Address: {practitioner.location.address}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
