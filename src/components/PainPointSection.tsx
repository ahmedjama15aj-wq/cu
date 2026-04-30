/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { PAIN_POINTS } from '../constants';

export const PainPointSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
          Why Hijamah Cupping Therapy?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PAIN_POINTS.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100 hover:border-green-400 transition-colors h-full flex flex-col"
            >
              {point.image && (
                <img
                  src={point.image}
                  alt={point.title}
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-3 text-green-700">{point.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
