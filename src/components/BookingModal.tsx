/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PractitionerProfile } from '../types';
import { CreditCard, Shield, X, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, User, Loader2, CheckCircle2, Lock, Smartphone, Banknote, Landmark, Wallet, QrCode, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '../CurrencyContext';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isAfter, 
  startOfDay,
  eachDayOfInterval,
  getDay
} from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import { BookingConfirmationDialog } from './BookingConfirmationDialog';

// Initialize stripe outside component to avoid multiple instances
const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

interface Props {
  practitioner: PractitionerProfile & { initialSpecialty?: string; initialDay?: string };
  onClose: () => void;
  onConfirm: (bookingData: any) => void;
}

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const DAYS_MAP: { [key: string]: number } = {
  'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
};

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const GLOBAL_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'stripe', name: 'Secure Payment (Stripe)', icon: <ShieldCheck className="w-5 h-5 text-teal-500" /> },
  { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard className="w-5 h-5 text-slate-600" /> },
  { id: 'applepay', name: 'Apple Pay', icon: <Smartphone className="w-5 h-5 text-black" /> },
  { id: 'googlepay', name: 'Google Pay', icon: <Smartphone className="w-5 h-5 text-blue-500" /> },
  { id: 'paypal', name: 'PayPal', icon: <Wallet className="w-5 h-5 text-blue-600" /> },
];

const LOCAL_PAYMENT_METHODS: Record<string, PaymentMethod[]> = {
  SAR: [{ id: 'mada', name: 'Mada', icon: <CreditCard className="w-5 h-5 text-blue-600" /> }, { id: 'stcpay', name: 'STC Pay', icon: <Smartphone className="w-5 h-5 text-orange-500" /> }],
  AED: [{ id: 'paytabs', name: 'PayTabs', icon: <CreditCard className="w-5 h-5 text-slate-600" /> }],
  CNY: [{ id: 'alipay', name: 'Alipay', icon: <Smartphone className="w-5 h-5 text-blue-400" /> }, { id: 'wechat', name: 'WeChat Pay', icon: <QrCode className="w-5 h-5 text-green-500" /> }, { id: 'unionpay', name: 'UnionPay', icon: <CreditCard className="w-5 h-5 text-red-600" /> }],
  MYR: [{ id: 'fpx', name: 'FPX', icon: <Landmark className="w-5 h-5 text-blue-800" /> }, { id: 'tng', name: 'Touch n Go', icon: <Smartphone className="w-5 h-5 text-blue-500" /> }, { id: 'grabpay', name: 'GrabPay', icon: <Wallet className="w-5 h-5 text-green-500" /> }],
  SGD: [{ id: 'paynow', name: 'PayNow', icon: <QrCode className="w-5 h-5 text-purple-600" /> }, { id: 'grabpay', name: 'GrabPay', icon: <Wallet className="w-5 h-5 text-green-500" /> }],
  IDR: [{ id: 'gopay', name: 'GoPay', icon: <Wallet className="w-5 h-5 text-blue-500" /> }, { id: 'ovo', name: 'OVO', icon: <Wallet className="w-5 h-5 text-purple-600" /> }, { id: 'dana', name: 'DANA', icon: <Wallet className="w-5 h-5 text-blue-400" /> }],
  TRY: [{ id: 'troy', name: 'Troy', icon: <CreditCard className="w-5 h-5 text-blue-600" /> }, { id: 'iyzico', name: 'iyzico', icon: <Lock className="w-5 h-5 text-blue-500" /> }, { id: 'papara', name: 'Papara', icon: <Wallet className="w-5 h-5 text-black" /> }],
  GBP: [{ id: 'bacs', name: 'Bacs Direct Debit', icon: <Landmark className="w-5 h-5 text-blue-900" /> }],
  PKR: [{ id: 'jazzcash', name: 'JazzCash', icon: <Smartphone className="w-5 h-5 text-red-600" /> }, { id: 'easypaisa', name: 'EasyPaisa', icon: <Smartphone className="w-5 h-5 text-green-600" /> }],
  AUD: [{ id: 'poli', name: 'POLi', icon: <Landmark className="w-5 h-5 text-blue-700" /> }, { id: 'afterpay', name: 'Afterpay', icon: <CreditCard className="w-5 h-5 text-teal-400" /> }],
  EUR: [{ id: 'giropay', name: 'Giropay', icon: <Landmark className="w-5 h-5 text-blue-600" /> }, { id: 'sofort', name: 'SOFORT', icon: <Smartphone className="w-5 h-5 text-pink-500" /> }, { id: 'sepa', name: 'SEPA Transfer', icon: <Landmark className="w-5 h-5 text-blue-800" /> }],
  NZD: [{ id: 'windcave', name: 'Windcave', icon: <CreditCard className="w-5 h-5 text-blue-500" /> }],
  CHF: [{ id: 'twint', name: 'TWINT', icon: <Smartphone className="w-5 h-5 text-blue-500" /> }, { id: 'postfinance', name: 'PostFinance', icon: <Landmark className="w-5 h-5 text-yellow-500" /> }],
  CAD: [{ id: 'interac', name: 'Interac e-Transfer', icon: <Banknote className="w-5 h-5 text-blue-600" /> }],
  THB: [{ id: 'promptpay', name: 'PromptPay', icon: <QrCode className="w-5 h-5 text-blue-600" /> }, { id: 'truemoney', name: 'TrueMoney', icon: <Wallet className="w-5 h-5 text-orange-500" /> }],
  KRW: [{ id: 'kakaopay', name: 'KakaoPay', icon: <Smartphone className="w-5 h-5 text-yellow-400" /> }, { id: 'toss', name: 'Toss', icon: <Smartphone className="w-5 h-5 text-blue-500" /> }, { id: 'naverpay', name: 'Naver Pay', icon: <Smartphone className="w-5 h-5 text-green-500" /> }],
  JPY: [{ id: 'paypay', name: 'PayPay', icon: <Smartphone className="w-5 h-5 text-red-500" /> }, { id: 'linepay', name: 'LINE Pay', icon: <Smartphone className="w-5 h-5 text-green-500" /> }],
  PHP: [{ id: 'gcash', name: 'GCash', icon: <Smartphone className="w-5 h-5 text-blue-500" /> }, { id: 'maya', name: 'Maya', icon: <Smartphone className="w-5 h-5 text-green-500" /> }],
};

export const BookingModal: React.FC<Props> = ({ practitioner, onClose, onConfirm }) => {
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState<'details' | 'calendar' | 'ringing' | 'accepted' | 'payment' | 'success'>('details');

  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (practitioner.initialDay) {
      const today = new Date();
      const targetDayIndex = DAYS_MAP[practitioner.initialDay];
      const currentDayIndex = today.getDay();
      let diff = targetDayIndex - currentDayIndex;
      if (diff < 0) diff += 7;
      const initialDate = new Date(today);
      initialDate.setDate(today.getDate() + diff);
      return initialDate;
    }
    return null;
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(GLOBAL_PAYMENT_METHODS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);

  const availablePaymentMethods = useMemo(() => {
    const currency = practitioner.currency || 'USD';
    const locals = LOCAL_PAYMENT_METHODS[currency] || [];
    return [...locals, ...GLOBAL_PAYMENT_METHODS];
  }, [practitioner.currency]);

  const availableDayIndices = useMemo(() => {
    if (Array.isArray(practitioner.availability)) {
      return practitioner.availability.map(day => DAYS_MAP[day]);
    }
    return Object.entries(practitioner.availability)
      .filter(([_, data]) => data.active)
      .map(([day, _]) => DAYS_MAP[day]);
  }, [practitioner.availability]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
  }, [currentMonth]);

  const isDateAvailable = (date: Date) => {
    const today = startOfDay(new Date());
    if (isAfter(today, date) && !isSameDay(today, date)) return false;
    return availableDayIndices.includes(getDay(date));
  };

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleNext = () => {
    if (step === 'details') setStep('calendar');
    else if (step === 'calendar' && selectedDate && selectedTime) {
      setStep('ringing');
      setTimeout(() => {
        setStep('accepted');
        setTimeout(() => {
          setStep('payment');
        }, 2000);
      }, 3000);
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    const calculatedAmount = practitioner.pricePerSession * (selectedDuration / 60) * 1.08;
    const bookingData = {
      date: selectedDate || new Date(),
      time: selectedTime || '09:00 AM',
      duration: selectedDuration,
      therapyType: practitioner.initialSpecialty || 'Al Hijamah Session',
      specialty: practitioner.initialSpecialty || 'Al Hijamah Session',
      practitionerId: practitioner.uid,
      practitionerName: practitioner.displayName,
      totalAmount: calculatedAmount,
      currency: practitioner.currency || 'USD',
      paymentMethod: selectedPaymentMethod.name,
      practitionerStripeAccountId: practitioner.stripeAccountId
    };

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingData })
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        // Mock fallback if Stripe isn't configured
        onConfirm({
          ...bookingData,
          date: bookingData.date.toISOString().split('T')[0],
          amount: bookingData.totalAmount
        });
        setStep('success');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-slate-50"
      >
        {/* Header */}
        <div className="bg-black p-8 text-white relative shrink-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent" />
          </div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-2xl font-serif">
              {step === 'details' && 'Session Details'}
              {step === 'calendar' && 'Select Date & Time'}
              {step === 'ringing' && 'Contacting Practitioner...'}
              {step === 'accepted' && 'Request Accepted!'}
              {step === 'payment' && 'Secure Checkout'}
              {step === 'success' && 'Booking Confirmed!'}
            </h3>
            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border-2 border-orange-500 shadow-lg text-white shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="font-bold text-lg">{practitioner.displayName}</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {practitioner.availability ? (Array.isArray(practitioner.availability) ? (
                  practitioner.availability.map(day => (
                    <span key={day} className="px-2 py-0.5 bg-orange-500 text-black rounded text-[9px] font-black uppercase tracking-widest">
                      {day}
                    </span>
                  ))
                ) : (
                  Object.entries(practitioner.availability)
                    .filter(([_, data]) => data && data.active)
                    .map(([day, _]) => (
                      <span key={day} className="px-2 py-0.5 bg-orange-500 text-black rounded text-[9px] font-black uppercase tracking-widest">
                        {day}
                      </span>
                    ))
                )) : null}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-500" 
               style={{ width: step === 'details' ? '25%' : step === 'calendar' ? '50%' : (step === 'ringing' || step === 'accepted' || step === 'payment') ? '75%' : '100%' }} />
        </div>
        
        <div className="p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <h4 className="text-black font-bold mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                    <CalendarIcon className="w-4 h-4 text-orange-500" />
                    Weekly Availability
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isAvailable = practitioner.availability ? (Array.isArray(practitioner.availability) 
                        ? practitioner.availability.includes(day)
                        : practitioner.availability[day]?.active) : false;
                      return (
                        <button 
                          key={day}
                          disabled={!isAvailable}
                          onClick={() => {
                            const today = new Date();
                            const targetDayIndex = DAYS_MAP[day];
                            const currentDayIndex = today.getDay();
                            let diff = targetDayIndex - currentDayIndex;
                            if (diff < 0) diff += 7;
                            const targetDate = new Date(today);
                            targetDate.setDate(today.getDate() + diff);
                            
                            setSelectedDate(targetDate);
                            setSelectedTime(null);
                            setStep('calendar');
                          }}
                          className={`flex-1 min-w-[60px] text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
                            isAvailable 
                              ? 'bg-black text-white border-orange-500 shadow-md scale-105 hover:bg-slate-900 cursor-pointer' 
                              : 'bg-white text-slate-200 border-slate-100 cursor-not-allowed'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <h4 className="text-black font-bold mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                    <Clock className="w-4 h-4 text-orange-500" />
                    Session Duration
                  </h4>
                  <div className="flex gap-2">
                    {[30, 60, 120].map(duration => {
                      const price = practitioner.pricePerSession * (duration / 60);
                      return (
                        <button 
                          key={duration}
                          onClick={() => setSelectedDuration(duration)}
                          className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-0.5 border transition-all active:scale-95 ${
                            selectedDuration === duration 
                              ? 'bg-black text-white border-orange-500 shadow-md scale-105' 
                              : 'bg-white text-slate-500 border-slate-100 hover:border-orange-200'
                          }`}
                        >
                          <span className="text-[9px] font-black uppercase tracking-widest">{duration} Min</span>
                          <span className={`text-[8px] font-bold ${selectedDuration === duration ? 'text-orange-400' : 'text-slate-400'}`}>
                            {formatPrice(practitioner.pricePerSession * (duration / 60))}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <h4 className="text-black font-bold mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                    <Shield className="w-4 h-4 text-orange-500" />
                    Service Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-500 text-xs">
                      <span className="font-medium text-slate-900">{practitioner.initialSpecialty || 'Al Hijamah Session'} ({selectedDuration} Min)</span>
                      <span className="font-bold text-black">{formatPrice(practitioner.pricePerSession * (selectedDuration / 60))}</span>
                    </div>
                    {practitioner.initialSpecialty && (
                      <div className="bg-orange-50 p-2 rounded-xl border border-orange-100 flex items-center gap-2">
                        <Shield className="w-3 h-3 text-orange-600" />
                        <span className="text-[9px] text-orange-800 font-bold uppercase tracking-widest">Selected: {practitioner.initialSpecialty}</span>
                      </div>
                    )}
                    <div className="h-px bg-slate-200 my-1" />
                    <div className="flex justify-between text-lg font-serif text-black">
                      <span className="text-sm">Total</span>
                      <span className="font-bold text-base">{formatPrice(practitioner.pricePerSession * (selectedDuration / 60))}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 bg-orange-50/50 p-3 rounded-2xl border border-orange-100">
                    <Shield className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <p className="uppercase tracking-widest font-bold text-orange-900">100% Satisfaction Guarantee</p>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-black hover:bg-slate-900 text-white font-bold py-4 rounded-2xl transition-all shadow-xl hover:shadow-orange-100 flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest border-b-4 border-orange-600 active:border-b-0 active:translate-y-1"
                >
                  <span>Select Date & Time</span>
                  <ChevronRight className="w-4 h-4 text-orange-500" />
                </button>
              </motion.div>
            )}

            {step === 'calendar' && (
              <motion.div 
                key="calendar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Selection Display */}
                {(selectedDate || selectedTime) && (
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 shadow-lg text-white flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">Selected Slot</div>
                        <div className="text-sm font-bold text-orange-950">
                          {selectedDate ? format(selectedDate, 'EEE, MMM d, yyyy') : 'No date selected'}
                          {selectedTime && ` at ${selectedTime}`}
                        </div>
                      </div>
                    </div>
                    {selectedDate && selectedTime && (
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    )}
                  </div>
                )}

                {/* Calendar Grid */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">
                      {format(currentMonth, 'MMMM yyyy')}
                    </h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-400" />
                      </button>
                      <button 
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <div key={`${d}-${i}`} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((date, i) => {
                      const isCurrentMonth = isSameMonth(date, currentMonth);
                      const isAvailable = isDateAvailable(date);
                      const isSelected = selectedDate && isSameDay(selectedDate, date);
                      const isToday = isSameDay(new Date(), date);
                      
                      return (
                        <button
                          key={date.toISOString()}
                          disabled={!isAvailable}
                          onClick={() => handleDateSelect(date)}
                          className={`
                            aspect-square w-full rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center relative
                            ${isSelected ? 'bg-orange-600 text-white shadow-xl scale-110 z-10 border-none' : 
                              isAvailable ? (isCurrentMonth ? 'bg-white text-slate-700 shadow-sm hover:border-orange-500 border border-slate-100' : 'bg-slate-50/50 text-slate-300') : 
                              'text-slate-200 cursor-not-allowed opacity-30'}
                            ${isToday && !isSelected ? 'ring-2 ring-orange-200' : ''}
                          `}
                        >
                          <span>{format(date, 'd')}</span>
                          {isToday && !isSelected && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-widest">
                      <Clock className="w-4 h-4 text-orange-500" />
                      Select Hour
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            py-3 rounded-xl text-[10px] font-black transition-all border uppercase tracking-tighter
                            ${selectedTime === time 
                              ? 'bg-black text-white border-black shadow-lg scale-105' 
                              : 'bg-white text-slate-500 border-slate-200 hover:border-orange-200'}
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setStep('details')}
                    className="flex-1 bg-slate-50 text-slate-900 font-black py-4 rounded-2xl hover:bg-slate-100 transition-all text-[10px] uppercase tracking-widest border border-slate-200"
                  >
                    Back
                  </button>
                  <button
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleNext}
                    className="flex-[2] bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl text-[10px] uppercase tracking-widest border-b-4 border-teal-800 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
                  >
                    <span>Request Booking</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'ringing' && (
              <motion.div 
                key="ringing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-12 space-y-6"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-blue-100 rounded-full"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                    className="absolute inset-0 bg-blue-200 rounded-full"
                  />
                  <div className="relative w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-2xl z-10 border-4 border-orange-500">
                    <User className="w-12 h-12" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="text-xl font-serif text-slate-900 mb-2">Ringing {practitioner.displayName}...</h4>
                  <p className="text-slate-400 font-light">Waiting for practitioner to accept your request</p>
                </div>
              </motion.div>
            )}

            {step === 'accepted' && (
              <motion.div 
                key="accepted"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-12 space-y-6"
              >
                <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-2xl">
                  <Shield className="w-12 h-12" />
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-serif text-orange-600 mb-2">Request Accepted!</h4>
                  <p className="text-slate-400 font-light">Proceeding to secure payment...</p>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
                  <div className="flex items-center gap-3 text-orange-700 font-bold mb-3 text-xs uppercase tracking-widest">
                    <CalendarIcon className="w-4 h-4" />
                    Booking Summary
                  </div>
                  <div className="text-orange-900 space-y-1">
                    <p className="font-serif text-lg">{selectedDate?.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-orange-600 font-medium">at {selectedTime}</p>
                    <div className="mt-2 pt-2 border-t border-orange-100/50">
                      <p className="text-[10px] text-orange-500 uppercase tracking-widest font-bold">Session Type & Duration</p>
                      <p className="text-sm font-bold">{practitioner.initialSpecialty || 'Al Hijamah Session'} • {selectedDuration} Min</p>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5">
                  <div className="flex items-center gap-3 text-rose-700 font-bold mb-3 text-xs uppercase tracking-widest">
                    <Shield className="w-4 h-4" />
                    Cancellation Policy
                  </div>
                  <p className="text-[10px] text-rose-800 leading-relaxed uppercase tracking-widest font-bold opacity-70">
                    Free cancellation up to 24 hours before your appointment.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 relative border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-900 font-bold mb-4 text-xs uppercase tracking-widest">
                    <CreditCard className="w-4 h-4 text-orange-500" />
                    Payment Method
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowPaymentSelector(!showPaymentSelector)}
                      className="w-full flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-4 hover:border-orange-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 bg-slate-50 rounded-md flex items-center justify-center text-lg">
                          {selectedPaymentMethod.icon}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{selectedPaymentMethod.name}</span>
                      </div>
                      <span className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">Change</span>
                    </button>

                    <AnimatePresence>
                      {showPaymentSelector && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20 max-h-48 overflow-y-auto"
                        >
                          {availablePaymentMethods.map((method) => (
                            <button
                              key={method.id}
                              onClick={() => {
                                setSelectedPaymentMethod(method);
                                setShowPaymentSelector(false);
                              }}
                              className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left"
                            >
                              <div className="w-8 h-8 bg-slate-50 rounded-md flex items-center justify-center text-lg">
                                {method.icon}
                              </div>
                              <span className="text-sm font-bold text-slate-700">{method.name}</span>
                              {selectedPaymentMethod.id === method.id && (
                                <Shield className="w-4 h-4 text-orange-500 ml-auto" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="text-[10px] text-slate-500 bg-white p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold mb-2 text-slate-900 uppercase tracking-widest">Platform Fees</h4>
                    <p className="mb-3 font-light leading-relaxed">To maintain Cupping Connect, we apply an 8% fee structure to every session.</p>
                    <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                      <span className="uppercase tracking-widest font-bold">Total you pay:</span>
                      <span className="text-base font-serif text-slate-900">
                        {formatPrice(practitioner.pricePerSession * (selectedDuration / 60) * 1.08)}
                      </span>
                    </div>
                    {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && (
                      <div className="mt-3 text-[9px] text-teal-600 flex items-center gap-1 font-bold uppercase tracking-widest">
                        <ShieldCheck className="w-3 h-3" /> Stripe Secure Checkout Enabled
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep('calendar')}
                    className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl hover:bg-slate-100 transition-all text-xs uppercase tracking-widest"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="flex-[2] bg-black hover:bg-slate-900 text-white font-bold py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-xs uppercase tracking-widest disabled:opacity-50 border-b-4 border-orange-600 active:border-b-0 active:translate-y-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 text-orange-500" />
                        <span>Pay with {selectedPaymentMethod.name}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
            {step === 'success' && (
              <BookingConfirmationDialog
                isOpen={true}
                onClose={onClose}
                onViewDashboard={() => {
                  window.location.hash = 'dashboard';
                  onClose();
                }}
                practitioner={practitioner}
                bookingDetails={{
                  date: selectedDate || new Date(),
                  time: selectedTime || '09:00 AM',
                  totalAmount: practitioner.pricePerSession * (selectedDuration / 60) * 1.08,
                  therapyType: practitioner.initialSpecialty || 'Al Hijamah Session'
                }}
              />
            )}
          </AnimatePresence>
          
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">
            Secure 256-bit SSL Encryption
          </p>
        </div>
      </motion.div>
    </div>
  );
};
