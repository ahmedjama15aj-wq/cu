import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Activity, Wind, Heart, Sparkles, RefreshCw } from 'lucide-react';

export const DetoxificationSection: React.FC = () => {
  const points = [
    {
      title: "Systemic Entry Point",
      subtitle: "Kahil - Back of the Neck",
      description: "The primary point for clearing heat and systemic toxins from the upper body, promoting overall balance.",
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Detoxification Nexus",
      subtitle: "Lower Back/Spinal Points",
      description: "Targets the kidneys and adrenal glands to flush out deep-seated impurities and support natural filtration.",
      icon: Droplets,
      color: "text-teal-600",
      bg: "bg-teal-100"
    },
    {
      title: "Lymphatic Flow",
      subtitle: "Thighs/Legs",
      description: "Stimulates the lower body's lymphatic system to reduce fluid retention, swelling, and heavy legs.",
      icon: Wind,
      color: "text-cyan-600",
      bg: "bg-cyan-100"
    },
    {
      title: "Organs of Elimination",
      subtitle: "Abdominal Points",
      description: "Enhances digestive function and supports the liver and intestines in their natural detoxification processes.",
      icon: Heart,
      color: "text-rose-600",
      bg: "bg-rose-100"
    },
    {
      title: "Extremity Detox",
      subtitle: "Hands/Forearms",
      description: "Clears peripheral stagnation and improves micro-circulation in the limbs for complete body wellness.",
      icon: Sparkles,
      color: "text-amber-600",
      bg: "bg-amber-100"
    },
    {
      title: "Circulation and Radiance",
      subtitle: "Integration",
      description: "A holistic approach that improves overall blood flow, leaving the skin glowing and the body feeling revitalized.",
      icon: RefreshCw,
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  return (
    <section className="py-24 bg-white text-zinc-900 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-zinc-900"
          >
            Detoxification
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed"
          >
            Remove toxins and improve blood circulation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 rounded-2xl ${point.bg} flex items-center justify-center ${point.color} mb-6`}>
                <point.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-1">{point.title}</h3>
              <p className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-wider">{point.subtitle}</p>
              <p className="text-zinc-600 text-sm leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
