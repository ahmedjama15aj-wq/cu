import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, CalendarCheck, UserCheck, HeartPulse, Info } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { INFO_CONTENT } from '../constants';

const STEPS = [
  {
    title: "Find a Specialist",
    description: "Search our global network of certified Al Hijamah and cupping therapy practitioners by location, specialty, or rating.",
    icon: Search,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Choose Your Service",
    description: "Select the type of cupping therapy you need, such as Wet Cupping, Dry Cupping, or Sports Recovery.",
    icon: UserCheck,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Book an Appointment",
    description: "Pick a convenient date and time, and securely book your session directly through the platform.",
    icon: CalendarCheck,
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "Get Treated",
    description: "Attend your session, experience the healing benefits of cupping therapy, and leave a review.",
    icon: HeartPulse,
    color: "bg-red-100 text-red-600"
  }
];

interface Props {
  onStepClick?: (stepIndex: number) => void;
}

export const HowItWorksSection: React.FC<Props> = ({ onStepClick }) => {
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; title: string; content: string; type: 'therapy' | 'availability' | 'general' }>({
    isOpen: false,
    title: '',
    content: '',
    type: 'general'
  });

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

  const renderDescription = (text: string) => {
    const terms = ['Wet Cupping', 'Sports Recovery', 'Detox', 'Traditional Chinese Medicine (TCM)'];
    let lastIndex = 0;
    const result = [];

    // Simple replacement for demo purposes
    // In a real app, I'd use a more robust regex or a library
    const parts = text.split(new RegExp(`(${terms.join('|')})`, 'g'));
    
    return parts.map((part, i) => {
      if (terms.includes(part)) {
        return (
          <span 
            key={i} 
            onClick={(e) => {
              e.stopPropagation();
              handleInfoClick(part);
            }}
            className="text-blue-600 font-bold cursor-pointer hover:underline inline-flex items-center gap-0.5"
          >
            {part}
            <Info className="w-3 h-3" />
          </span>
        );
      }
      return part;
    });
  };

  return (
    <section id="how-it-works" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-blue-900 mb-6"
          >
            How Cupping Connect Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Booking your next cupping therapy session is simple, secure, and fast. Follow these four easy steps to start your healing journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-100 -z-10"></div>

          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onStepClick?.(index)}
              className={`relative bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all text-center group ${onStepClick ? 'cursor-pointer hover:-translate-y-2' : ''}`}
            >
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                {index + 1}
              </div>
              <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 ${step.color} group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{renderDescription(step.description)}</p>
              {onStepClick && (
                <div className="mt-6 text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to start →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <InfoModal
          isOpen={modalInfo.isOpen}
          onClose={() => setModalInfo(prev => ({ ...prev, isOpen: false }))}
          title={modalInfo.title}
          content={modalInfo.content}
          type={modalInfo.type}
        />
      </div>
    </section>
  );
};
