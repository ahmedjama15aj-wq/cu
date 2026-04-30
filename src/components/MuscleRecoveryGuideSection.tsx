import React from 'react';
import { motion } from 'motion/react';
import { Activity, Target, Flame, ChevronRight } from 'lucide-react';

interface Props {
  onNavigateToSearch?: () => void;
}

export const MuscleRecoveryGuideSection: React.FC<Props> = ({ onNavigateToSearch }) => {
  return (
    <section className="py-24 bg-zinc-950 text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white"
          >
            Muscle Recovery
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed"
          >
            For muscle recovery following high-intensity training, Moving Cupping (Massage Cupping) is often used in conjunction with traditional Hijama (Wet Cupping) to provide a comprehensive recovery experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Therapy in Motion */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Therapy in Motion</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Unlike stationary Hijama, "moving" or "gliding" cupping involves applying oil to the skin to allow the cups to slide across the muscle fibers.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: "Myofascial Release", desc: "Breaking up adhesions in connective tissue." },
                { title: "Lymphatic Drainage", desc: "Stimulating lymph fluid to reduce swelling." },
                { title: "Deep Tissue", desc: "A 'reverse massage' pulling tissue upward." }
              ].map((item, i) => (
                <motion.button 
                  key={i} 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800 hover:border-blue-500/50 transition-all flex gap-3 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                  <div>
                    <strong className="text-white block text-sm mb-1">{item.title}</strong>
                    <span className="text-zinc-500 text-xs leading-relaxed group-hover:text-zinc-400 transition-colors">{item.desc}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Strategic Targets */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Strategic Targets</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Focusing on specific muscle groups to restore flexibility and alleviate tightness after workouts.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: "Posterior Chain", desc: "Lower back, glutes, and hamstrings." },
                { title: "Upper Trapezius", desc: "Base of the neck toward the shoulders." },
                { title: "IT Band", desc: "Side of the leg to alleviate knee/hip pain." }
              ].map((item, i) => (
                <motion.button 
                  key={i} 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800 hover:border-orange-500/50 transition-all flex gap-3 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                  <div>
                    <strong className="text-white block text-sm mb-1">{item.title}</strong>
                    <span className="text-zinc-500 text-xs leading-relaxed group-hover:text-zinc-400 transition-colors">{item.desc}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Column 3: Maximizing Results */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 mb-6">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Maximizing Results</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Post-session care is crucial to maintain the new range of motion and support muscle repair.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: "Warmth Post-Session", desc: "Keep areas warm to prevent muscle contraction." },
                { title: "Light Stretching", desc: "Gentle, low-impact stretching." },
                { title: "Mineral Balance", desc: "Adequate electrolytes and hydration." }
              ].map((item, i) => (
                <motion.button 
                  key={i} 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800 hover:border-green-500/50 transition-all flex gap-3 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                  <div>
                    <strong className="text-white block text-sm mb-1">{item.title}</strong>
                    <span className="text-zinc-500 text-xs leading-relaxed group-hover:text-zinc-400 transition-colors">{item.desc}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-zinc-800/50 rounded-3xl border border-zinc-700/50 text-center"
        >
          <p className="text-zinc-300 mb-6">
            Would you like more details on the specific oils used for gliding cupping, or perhaps a guide on how to combine these sessions with your training schedule?
          </p>
          <button 
            onClick={onNavigateToSearch}
            className="inline-flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
          >
            Contact a Recovery Specialist <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
