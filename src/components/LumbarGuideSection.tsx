import React from 'react';
import { motion } from 'motion/react';
import { Activity, Shield, Zap, Droplets, ArrowRight } from 'lucide-react';

export const LumbarGuideSection: React.FC = () => {
  return (
    <section className="py-24 bg-stone-50 text-stone-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-stone-900"
          >
            Lumbar Region & Sciatica
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed"
          >
            Discover how Hijamah (wet cupping) provides deep relief for chronic lower back tension, inflammation, and sciatica discomfort.
          </motion.p>
        </div>

        {/* Mechanism of Action Section */}
        <div className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 lg:pl-24"
            >
              <h3 className="text-3xl font-bold text-sky-500 text-center">How Hijamah alleviates lumbar pain</h3>
              <p className="text-lg text-stone-600 leading-relaxed">
                Lower back pain is often driven by restricted blood flow, chronic muscle spasms, and the buildup of cellular waste. Wet cupping directly addresses these root causes through a multi-step physiological mechanism.
              </p>
              
              <div className="space-y-6 mt-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <Activity className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-stone-900 mb-2">1. Hyperemia (Increased Blood Flow)</h4>
                    <p className="text-stone-600">The vacuum created by the cups draws fresh, oxygen-rich blood to the lumbar fascia and deep spinal muscles. This surge in circulation accelerates tissue repair and delivers essential nutrients to damaged areas.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-stone-900 mb-2">2. Myofascial Release</h4>
                    <p className="text-stone-600">Unlike massage which presses down, the negative pressure of cupping lifts the skin, fascia, and muscle layers upward. This separates fused tissue layers, instantly releasing chronic tension in the Quadratus Lumborum (QL) and erector spinae muscles.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Droplets className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-stone-900 mb-2">3. Detoxification of Inflammatory Compounds</h4>
                    <p className="text-stone-600">Through the superficial micro-incisions of wet cupping, stagnant blood containing inflammatory mediators (like prostaglandins and cytokines), lactic acid, and cellular waste are physically drawn out of the body. This rapidly reduces local inflammation and pain signaling.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop" 
                alt="Therapist applying massage" 
                className="rounded-3xl w-full h-64 object-cover shadow-lg"
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop" 
                alt="Lower back focus" 
                className="rounded-3xl w-full h-64 object-cover shadow-lg mt-8"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
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
              src="https://images.unsplash.com/photo-1611558709798-e009c8fd7706?q=80&w=1000&auto=format&fit=crop" 
              alt="Human back showing lumbar region" 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-stone-900/20" />
            
            {/* Cupping Points Overlays */}
            {/* L3-L4 Area */}
            <div className="absolute top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2 group z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-red-500/40 rounded-full animate-ping absolute inset-0" />
              <div className="w-8 h-8 md:w-12 md:h-12 bg-red-500/60 border-2 border-red-200 rounded-full relative flex items-center justify-center backdrop-blur-sm cursor-pointer transition-transform hover:scale-110">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                L3-L4 (Central Lumbar)
              </div>
            </div>

            {/* Left Quadratus Lumborum */}
            <div className="absolute top-[60%] left-[35%] -translate-x-1/2 -translate-y-1/2 group z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-red-500/40 rounded-full animate-ping absolute inset-0" style={{ animationDelay: '0.5s' }} />
              <div className="w-8 h-8 md:w-12 md:h-12 bg-red-500/60 border-2 border-red-200 rounded-full relative flex items-center justify-center backdrop-blur-sm cursor-pointer transition-transform hover:scale-110">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Left QL Muscle
              </div>
            </div>

            {/* Right Quadratus Lumborum */}
            <div className="absolute top-[60%] left-[65%] -translate-x-1/2 -translate-y-1/2 group z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-red-500/40 rounded-full animate-ping absolute inset-0" style={{ animationDelay: '1s' }} />
              <div className="w-8 h-8 md:w-12 md:h-12 bg-red-500/60 border-2 border-red-200 rounded-full relative flex items-center justify-center backdrop-blur-sm cursor-pointer transition-transform hover:scale-110">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Right QL Muscle
              </div>
            </div>

            {/* Sacrum */}
            <div className="absolute top-[75%] left-[50%] -translate-x-1/2 -translate-y-1/2 group z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-red-500/40 rounded-full animate-ping absolute inset-0" style={{ animationDelay: '1.5s' }} />
              <div className="w-8 h-8 md:w-12 md:h-12 bg-red-500/60 border-2 border-red-200 rounded-full relative flex items-center justify-center backdrop-blur-sm cursor-pointer transition-transform hover:scale-110">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Sacrum / Base
              </div>
            </div>

            {/* Sciatic Nerve Path (Left) */}
            <div className="absolute top-[85%] left-[38%] -translate-x-1/2 -translate-y-1/2 group z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-500/40 rounded-full animate-ping absolute inset-0" style={{ animationDelay: '0.2s' }} />
              <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-500/60 border-2 border-orange-200 rounded-full relative flex items-center justify-center backdrop-blur-sm cursor-pointer transition-transform hover:scale-110">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Sciatic Path (Gluteal)
              </div>
            </div>

            {/* Sciatic Nerve Path (Right) */}
            <div className="absolute top-[85%] left-[62%] -translate-x-1/2 -translate-y-1/2 group z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-500/40 rounded-full animate-ping absolute inset-0" style={{ animationDelay: '0.7s' }} />
              <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-500/60 border-2 border-orange-200 rounded-full relative flex items-center justify-center backdrop-blur-sm cursor-pointer transition-transform hover:scale-110">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Sciatic Path (Gluteal)
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
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900">Targeted Cupping Points</h3>
              </div>
              
              <img 
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop" 
                alt="Cupping points demonstration on lower back" 
                className="w-full h-48 object-cover rounded-2xl mb-6 shadow-sm"
                referrerPolicy="no-referrer"
              />

              <div className="space-y-6">
                {[
                  {
                    title: "L3-L4 (Central Lumbar)",
                    desc: "Focuses on the central lower back to decompress the spine, increase blood flow, and relieve chronic aching."
                  },
                  {
                    title: "Quadratus Lumborum (QL)",
                    desc: "Located on either side of the lumbar spine, targeting these muscles relieves deep-seated lower back tension."
                  },
                  {
                    title: "Sacrum Base",
                    desc: "Applied at the base of the spine to help restore mobility to the pelvic girdle and relieve stiffness."
                  },
                  {
                    title: "Gluteal/Sciatic Path",
                    desc: "Points along the piriformis and gluteal region to release tension that may be compressing the sciatic nerve."
                  }
                ].map((point, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-red-200">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-red-500 border-4 border-white" />
                    <h4 className="font-bold text-stone-900 mb-1">{point.title}</h4>
                    <p className="text-stone-600 text-sm leading-relaxed">{point.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
