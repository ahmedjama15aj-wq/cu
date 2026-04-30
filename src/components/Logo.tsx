/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

type LogoVariant = 'concept1' | 'concept2' | 'concept3' | 'square' | 'default';

export const Logo: React.FC<{ className?: string, variant?: LogoVariant, bgClassName?: string }> = ({ 
  className = "w-16 h-16", 
  variant = 'default',
  bgClassName
}) => {
  if (variant === 'concept1') {
    // Concept 1: The Organic Connection (Black & Orange)
    // Merging a therapeutic cup shape with a technical node structure
    return (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          <motion.path
            d="M25,45 Q25,25 50,25 Q75,25 75,45 L75,55 Q75,75 50,75 Q25,75 25,55 Z"
            fill="#18181B"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="12"
            fill="url(#grad-orange)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          />
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <path d="M50,30 L50,20 M70,50 L80,50 M50,70 L50,80 M30,50 L20,50" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="20" r="3" fill="#F97316" />
            <circle cx="80" cy="50" r="3" fill="#F97316" />
            <circle cx="50" cy="80" r="3" fill="#F97316" />
            <circle cx="20" cy="50" r="3" fill="#F97316" />
          </motion.g>
        </svg>
      </div>
    );
  }

  const defaultBg = "p-2 bg-[#FFEDD5]/20 backdrop-blur-md rounded-xl border border-[#F97316]/10 shadow-md group-hover:bg-[#FFEDD5]/40 transition-colors";
  const finalBgClass = bgClassName || defaultBg;

  if (variant === 'concept2' || variant === 'default') {
    // Square Variant style for default/concept2 for consistency
    return (
      <div className={`relative ${className} ${finalBgClass}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="#18181B" stroke="#27272A" strokeWidth="1" />
          <motion.circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#F97316"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, rotate: -90 }}
            animate={{ pathLength: 0.85 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <text 
            x="50" 
            y="63" 
            textAnchor="middle" 
            fill="#F97316" 
            fontSize="34" 
            fontWeight="300" 
            fontFamily="sans-serif"
            className="select-none tracking-tighter"
          >
            CU
          </text>
          <path
            d="M30,50 L35,50 L40,44 L45,56 L50,50 L70,50"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.15"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'concept3') {
    // Concept 3: Modern Minimalist (Black & Orange)
    // Geometric representation using overlapping circles for "connect"
    return (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="40" cy="50" r="30" fill="#18181B" fillOpacity="0.9" />
          <circle cx="60" cy="50" r="30" fill="#F97316" fillOpacity="0.9" />
          <circle cx="50" cy="50" r="15" fill="white" />
          <path d="M45,50 L55,50 M50,45 L50,55" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (variant === 'square') {
    // Square Variant: A slightly darker cream rounded square container with the dark circular logo inside
    return (
      <div className={`relative ${className} ${finalBgClass}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="#18181B" stroke="#27272A" strokeWidth="1" />
          <motion.circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#F97316"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, rotate: -90 }}
            animate={{ pathLength: 0.85 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <text 
            x="50" 
            y="63" 
            textAnchor="middle" 
            fill="#F97316" 
            fontSize="34" 
            fontWeight="200" 
            fontFamily="sans-serif"
            className="select-none tracking-tighter"
          >
            CU
          </text>
          <path
            d="M30,50 L35,50 L40,44 L45,56 L50,50 L70,50"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.15"
          />
        </svg>
      </div>
    );
  }

  return null;
};
