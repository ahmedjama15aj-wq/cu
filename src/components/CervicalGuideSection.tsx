import React from 'react';
import { motion } from 'motion/react';
import { Activity, Shield } from 'lucide-react';

export const CervicalGuideSection: React.FC = () => {
  return (
    <section className="py-24 bg-stone-50 text-stone-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-stone-900"
          >
            Cervical Spine
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed"
          >
            Release neck stress and improve cervical mobility.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image with Points */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-2xl bg-stone-200 aspect-[3/4] md:aspect-square lg:aspect-[4/5] mx-auto w-full max-w-md lg:max-w-none"
          >
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop" 
              alt="Human neck and upper back showing cervical region" 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-stone-900/10" />
            
            {/* Cupping Points Overlays */}
            {/* C7 / Base of Neck */}
            <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 group z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-500/40 rounded-full animate-ping absolute inset-0" />
              <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-500/60 border-2 border-blue-200 rounded-full relative flex items-center justify-center backdrop-blur-sm cursor-pointer transition-transform hover:scale-110">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                C7 (Base of Neck)
              </div>
            </div>

            {/* Left Upper Trapezius */}
            <div className="absolute top-[45%] left-[30%] -translate-x-1/2 -translate-y-1/2 group z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-500/40 rounded-full animate-ping absolute inset-0" style={{ animationDelay: '0.5s' }} />
              <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-500/60 border-2 border-blue-200 rounded-full relative flex items-center justify-center backdrop-blur-sm cursor-pointer transition-transform hover:scale-110">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Left Upper Trapezius
              </div>
            </div>

            {/* Right Upper Trapezius */}
            <div className="absolute top-[45%] left-[70%] -translate-x-1/2 -translate-y-1/2 group z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-500/40 rounded-full animate-ping absolute inset-0" style={{ animationDelay: '1s' }} />
              <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-500/60 border-2 border-blue-200 rounded-full relative flex items-center justify-center backdrop-blur-sm cursor-pointer transition-transform hover:scale-110">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Right Upper Trapezius
              </div>
            </div>

            {/* Suboccipital (Left) */}
            <div className="absolute top-[20%] left-[40%] -translate-x-1/2 -translate-y-1/2 group z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-500/40 rounded-full animate-ping absolute inset-0" style={{ animationDelay: '0.2s' }} />
              <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-500/60 border-2 border-purple-200 rounded-full relative flex items-center justify-center backdrop-blur-sm cursor-pointer transition-transform hover:scale-110">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Suboccipital (Left)
              </div>
            </div>

            {/* Suboccipital (Right) */}
            <div className="absolute top-[20%] left-[60%] -translate-x-1/2 -translate-y-1/2 group z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-500/40 rounded-full animate-ping absolute inset-0" style={{ animationDelay: '0.7s' }} />
              <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-500/60 border-2 border-purple-200 rounded-full relative flex items-center justify-center backdrop-blur-sm cursor-pointer transition-transform hover:scale-110">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Suboccipital (Right)
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900">Key Cupping Points</h3>
              </div>
              <div className="space-y-6">
                {[
                  {
                    title: "C7 (Base of Neck)",
                    desc: "Also known as Al-Kahil, this central point at the base of the neck is crucial for relieving systemic tension and stiffness."
                  },
                  {
                    title: "Upper Trapezius",
                    desc: "Points on the upper shoulders to release built-up stress, often caused by poor posture or prolonged sitting."
                  },
                  {
                    title: "Suboccipital Region",
                    desc: "Located at the base of the skull, targeting these points helps alleviate tension headaches and neck stiffness."
                  },
                  {
                    title: "Levator Scapulae",
                    desc: "Points along the sides of the neck to improve mobility and reduce the 'stiff neck' sensation."
                  }
                ].map((point, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-blue-200">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white" />
                    <h4 className="font-bold text-stone-900 mb-1">{point.title}</h4>
                    <p className="text-stone-600 text-sm leading-relaxed">{point.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Tension Headache Relief</h3>
              <p className="text-stone-600 leading-relaxed">
                By targeting the suboccipital muscles and upper trapezius, cupping helps release the muscular tension that often refers pain to the head, providing significant relief from tension headaches.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
