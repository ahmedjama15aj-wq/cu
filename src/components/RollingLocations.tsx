import React from 'react';
import { motion } from 'motion/react';

const locations1 = [
  "Worldwide", "USA", "New York", "UK", "London", "UAE", "Dubai", "Canada", "Toronto", "Australia", "Sydney"
];

const locations2 = [
  "Saudi Arabia", "Riyadh", "Malaysia", "Kuala Lumpur", "Singapore", "Turkey", "Istanbul", "Egypt", "Cairo", "South Africa", "Cape Town"
];

export const RollingLocations: React.FC = () => {
  return (
    <div className="absolute left-6 top-6 bottom-6 w-32 overflow-hidden pointer-events-none hidden md:flex gap-4 opacity-40 z-0">
      {/* Column 1: Scrolling Up */}
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          animate={{ y: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex flex-col gap-4 absolute top-0 w-full"
        >
          {[...locations1, ...locations1].map((loc, i) => (
            <div key={i} className="text-blue-900 font-bold text-sm whitespace-nowrap">
              {loc}
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Column 2: Scrolling Down */}
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          animate={{ y: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="flex flex-col gap-4 absolute top-0 w-full"
        >
          {[...locations2, ...locations2].map((loc, i) => (
            <div key={i} className="text-blue-900 font-bold text-sm whitespace-nowrap">
              {loc}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
