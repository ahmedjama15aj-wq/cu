import React from 'react';
import { motion } from 'motion/react';
import { Brain, HelpCircle, Droplets, Coffee, ShieldCheck, Activity, CheckCircle2, ListChecks, Clock } from 'lucide-react';

export const MigraineGuideSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-blue-900 mb-4"
          >
            Migraine & Headache Relief Guide
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Everything you need to know about targeting chronic headaches and migraines with Hijamah therapy.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Key Points Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900">Key Hijama Points</h3>
            </div>
            <div className="space-y-6">
              {[
                {
                  title: "Point 1 (Al-Kahil)",
                  desc: "Located at the base of the neck (near the 7th cervical vertebra). This is considered a 'master point' for detox and reducing overall systemic inflammation."
                },
                {
                  title: "Points 43 & 44",
                  desc: "Positioned on the upper back, between the shoulder blades, which helps relieve tension that often travels up to the head."
                },
                {
                  title: "Points 101-106 (Occipital/Vertex)",
                  desc: "These are points on the back and top of the head. While they can require shaving a small area of hair, they are directly associated with relieving intracranial pressure."
                },
                {
                  title: "Temple Points (Optional)",
                  desc: "Sometimes 'dry cupping' (without incisions) is applied to the temples for immediate localized relief."
                }
              ].map((point, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-blue-200">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white" />
                  <h4 className="font-bold text-blue-900 mb-1">{point.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Checklist Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-blue-900 rounded-3xl p-8 shadow-xl text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-800 flex items-center justify-center text-green-400">
                <ListChecks className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">5 Questions to Ask</h3>
            </div>
            <p className="text-blue-200 text-sm mb-6">
              Before your first session, verify the practitioner's experience and safety standards:
            </p>
            <ul className="space-y-6">
              {[
                {
                  q: "What is your training and certification?",
                  a: "Ensure they have formal training in Hijama and understand the specific points for neurological issues like migraines."
                },
                {
                  q: "Do you use single-use, disposable equipment?",
                  a: "This is the most critical question for preventing infection. Blades and cups should be opened in front of you."
                },
                {
                  q: "How do you determine the depth of the incisions?",
                  a: "For migraines, the 'scratches' should be very superficial—just enough to allow the stagnant fluid to be drawn out."
                },
                {
                  q: "What is the recommended 'aftercare' protocol?",
                  a: "Ask about how to clean the sites and what foods or activities to avoid (typically, avoiding dairy and heavy exercise for 24 hours)."
                },
                {
                  q: "Have you treated patients with chronic migraines before?",
                  a: "Understanding their success rate with your specific condition can provide peace of mind."
                }
              ].map((item, i) => (
                <li key={i} className="bg-blue-800/50 rounded-2xl p-4 border border-blue-700/50">
                  <h4 className="font-bold text-green-400 mb-2 text-sm flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    "{item.q}"
                  </h4>
                  <p className="text-blue-100 text-sm leading-relaxed pl-6">{item.a}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Preparation Tips Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900">Preparation Tips</h3>
            </div>
            <div className="space-y-6 flex-1">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Fasting</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    It is often recommended to perform Hijama on an empty stomach (or at least 2–3 hours after a light meal) to maximize the detox effect.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Hydration</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Drink plenty of water the day before to ensure your blood isn't too thick, making the process more effective.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Post-Session</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Keep the area dry and covered for 24 hours. Applying natural oils like black seed oil or olive oil can assist with the healing of the small marks.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 font-medium">
                Remember: Consistency is key. Chronic migraines may require multiple sessions spaced 4-6 weeks apart for optimal results.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
