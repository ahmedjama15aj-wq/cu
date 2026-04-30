import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, CheckCircle2, Clock, ShieldCheck, Zap } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  type?: 'therapy' | 'availability' | 'general';
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, content, type = 'general' }) => {
  const getIcon = () => {
    switch (type) {
      case 'therapy': return <Zap className="w-6 h-6 text-teal-500" />;
      case 'availability': return <Clock className="w-6 h-6 text-blue-500" />;
      default: return <Info className="w-6 h-6 text-slate-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 cursor-grab active:cursor-grabbing"
          >
            <div className="flex justify-center pt-4">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  {getIcon()}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8">
              <div className="prose prose-slate">
                <p className="text-slate-600 leading-relaxed text-lg">
                  {content}
                </p>
              </div>
              
              <div className="mt-8 p-4 bg-teal-50 rounded-2xl border border-teal-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-sm text-teal-900 font-medium">
                  All treatments on Cupping Connect are performed by verified professionals following strict safety protocols.
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
