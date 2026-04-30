import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Activity, Brain, Battery, Shield, Tag, Clock, Info } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { INFO_CONTENT } from '../constants';
import { useCurrency } from '../CurrencyContext';

const BENEFITS = [
  {
    title: "Pain Relief",
    description: "Effectively targets deep muscle tissue to relieve chronic pain, stiffness, and tension.",
    icon: Activity
  },
  {
    title: "Detoxification",
    description: "Draws out toxins, metabolic waste, and stagnant blood from the body.",
    icon: Shield
  },
  {
    title: "Stress Reduction",
    description: "Calms the nervous system, promoting deep relaxation and better sleep.",
    icon: Brain
  },
  {
    title: "Energy Restoration",
    description: "Improves blood circulation and energy flow, combating chronic fatigue.",
    icon: Battery
  }
];

const PAIN_POINTS = [
  "Chronic Back & Neck Pain",
  "Migraines & Tension Headaches",
  "Sports Injuries & Muscle Soreness",
  "Joint Stiffness & Arthritis",
  "Digestive Issues",
  "Respiratory Conditions"
];

const PRICING_TIERS = [
  {
    name: "Dry Cupping",
    price: 70,
    duration: "45 mins",
    description: "Suction only. Ideal for muscle tension, relaxation, and improving blood flow.",
    features: ["Consultation", "Targeted suction", "Light massage"]
  },
  {
    name: "Wet Cupping (Hijamah)",
    price: 85,
    duration: "60 mins",
    description: "Traditional method involving superficial incisions to draw out stagnant blood and toxins.",
    features: ["Consultation", "Sterile incisions", "Deep detoxification", "Aftercare guidance"],
    popular: true
  },
  {
    name: "Massage Cupping",
    price: 90,
    duration: "60 mins",
    description: "Dynamic cupping where cups are glided over the skin with oil. Great for lymphatic drainage.",
    features: ["Consultation", "Oil application", "Gliding technique", "Lymphatic drainage"]
  },
  {
    name: "Sports Recovery",
    price: 100,
    duration: "75 mins",
    description: "Intensive session combining dry cupping, massage, and stretching for athletes.",
    features: ["Consultation", "Deep tissue focus", "Stretching", "Performance advice"]
  },
  {
    name: "Acupuncture",
    price: 95,
    duration: "60 mins",
    description: "Traditional technique using thin needles to balance energy flow and relieve pain.",
    features: ["Consultation", "Needle application", "Energy balancing", "Relaxation"]
  },
  {
    name: "Pedicures",
    price: 45,
    duration: "45 mins",
    description: "Professional medical and aesthetic foot care.",
    features: ["Nail shaping", "Callus removal", "Foot massage", "Hydrating treatment"]
  },
  {
    name: "Paraffin treatments",
    price: 30,
    duration: "30 mins",
    description: "Soothing heat therapy for hands and feet.",
    features: ["Deep hydration", "Joint pain relief", "Skin softening", "Warm wax wrap"]
  },
  {
    name: "Beauty packages",
    price: 150,
    duration: "150 mins",
    description: "Tailored full-body rejuvenation packages.",
    features: ["Custom facial", "Body treatment", "Mani-Pedi combo", "Aroma therapy"]
  }
];

export const BenefitsAndPricing: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; title: string; content: string; type: 'therapy' | 'availability' | 'general' }>({
    isOpen: false,
    title: '',
    content: '',
    type: 'general'
  });

  const handleInfoClick = (key: string) => {
    // Map names to keys in INFO_CONTENT
    let infoKey = key;
    if (key.includes('Wet Cupping')) infoKey = 'Wet Cupping';
    if (key.includes('Detoxification')) infoKey = 'Detox';
    if (key.includes('Sports Recovery')) infoKey = 'Sports Recovery';
    if (key.includes('Acupuncture')) infoKey = 'Acupuncture';
    if (key.includes('Pedicures')) infoKey = 'Pedicures';
    if (key.includes('Paraffin')) infoKey = 'Paraffin treatments';
    if (key.includes('Beauty')) infoKey = 'Beauty packages';

    const info = INFO_CONTENT[infoKey];
    if (info) {
      setModalInfo({
        isOpen: true,
        title: info.title,
        content: info.content,
        type: info.type
      });
    }
  };

  return (
    <section id="benefits-pricing" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-blue-900 mb-6"
          >
            Healing & Transparency
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-800 max-w-3xl mx-auto"
          >
            Discover how Al Hijamah can transform your health, and explore our clear, upfront pricing for various therapy sessions.
          </motion.p>
        </div>

        {/* Benefits & Pain Points Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Benefits */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-blue-900 mb-8">Core Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {BENEFITS.map((benefit, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleInfoClick(benefit.title)}
                  className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-left hover:bg-blue-100 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <benefit.icon className="w-8 h-8 text-blue-600" />
                    <Info className="w-4 h-4 text-blue-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <h4 className="text-xl font-bold text-blue-900 mb-2">{benefit.title}</h4>
                  <p className="text-gray-800 text-sm leading-relaxed">{benefit.description}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Pain Points */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-blue-900 p-10 rounded-3xl text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
            <h3 className="text-3xl font-bold mb-8 relative z-10">Conditions Addressed</h3>
            <p className="text-blue-100 mb-8 relative z-10">
              Cupping therapy is highly effective in managing and alleviating a wide range of physical ailments and pain points:
            </p>
            <ul className="space-y-4 relative z-10">
              {PAIN_POINTS.map((point, idx) => (
                <li key={idx} className="flex items-center gap-3 text-lg font-medium group cursor-pointer" onClick={() => handleInfoClick(point)}>
                  <CheckCircle className="text-green-400 w-6 h-6 shrink-0" />
                  <span className="group-hover:text-green-300 transition-colors">{point}</span>
                  <Info className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-16">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-blue-900 mb-4"
          >
            Transparent Pricing
          </motion.h3>
          <p className="text-gray-800 max-w-2xl mx-auto">
            No hidden fees. Choose the session that best fits your needs. Prices may vary slightly by practitioner location.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRICING_TIERS.map((tier, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 border ${tier.popular ? 'border-blue-500 shadow-xl shadow-blue-100' : 'border-gray-200 shadow-lg'} flex flex-col`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                  MOST POPULAR
                </div>
              )}
              
              <h4 className="text-2xl font-bold text-blue-900 mb-2 flex items-center justify-between">
                {tier.name}
                <button onClick={() => handleInfoClick(tier.name)} className="text-blue-300 hover:text-blue-600 transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </h4>
              <p className="text-gray-600 text-sm mb-6 min-h-[2.5rem]">{tier.description}</p>
              
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-2xl font-black text-blue-900">{formatPrice(tier.price)}</span>
                <span className="text-gray-500 font-medium">/ session</span>
              </div>
              
              <div className="flex items-center gap-2 text-blue-600 font-medium mb-8 bg-blue-50 w-fit px-3 py-1.5 rounded-lg text-sm">
                <Clock className="w-4 h-4" />
                {tier.duration}
              </div>

              <div className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-800 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-xl font-bold transition-all ${tier.popular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : 'bg-blue-50 hover:bg-blue-100 text-blue-700'}`}>
                Find Practitioner
              </button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 bg-gray-50 rounded-2xl p-6 flex items-start gap-4 border border-gray-200 max-w-3xl mx-auto">
          <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-800 leading-relaxed">
            <strong>Note:</strong> The prices listed above are average platform rates. Individual practitioners may set their own rates based on experience, location, and additional services provided. Always check the practitioner's profile for exact pricing before booking.
          </p>
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
