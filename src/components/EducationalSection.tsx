/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Droplets, Heart, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    title: "Suction",
    description: "Cups are placed on the skin to create a vacuum, drawing blood to the surface.",
    icon: Droplets
  },
  {
    title: "Detoxification",
    description: "In wet cupping (Hijamah), small superficial incisions are made to remove stagnant blood and toxins.",
    icon: Shield
  },
  {
    title: "Recovery",
    description: "The area is cleaned and dressed. You'll feel an immediate sense of lightness and relief.",
    icon: Heart
  }
];

export const EducationalSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-blue-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-blue-900 mb-4"
          >
            Understanding Hijamah. Cupping Therapy Detox.
          </motion.h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hijamah is an ancient therapeutic practice that promotes natural healing by removing toxins and improving blood circulation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-green-700">The Detoxification Process</h3>
            <p className="text-gray-600 leading-relaxed">
              Cupping therapy works by creating a vacuum on the skin's surface. This suction pulls stagnant blood, metabolic waste, and toxins from the deep tissues to the surface, where they can be more easily processed by the body's lymphatic system or removed through controlled micro-incisions (Wet Cupping).
            </p>
            <ul className="space-y-4">
              {[
                "Boosts immune system response",
                "Reduces inflammation and pain",
                "Improves blood flow and oxygenation",
                "Promotes deep tissue relaxation"
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-blue-900 font-medium">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-blue-900"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-blue-600 flex items-center justify-center p-8 text-center">
              <p className="text-white text-2xl font-medium italic">"A natural way to restore balance and vitality to your body."</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-blue-50 hover:border-blue-200 transition-all text-center group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                <step.icon className="text-blue-600 w-8 h-8 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-blue-900 mb-3">{step.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
