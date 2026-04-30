/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe } from 'lucide-react';
import { useCurrency, CURRENCIES } from '../CurrencyContext';

export const CurrencySelector: React.FC = () => {
  const { selectedCurrency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/50 hover:bg-white px-3 py-1.5 rounded-lg border border-blue-100 transition-all text-sm font-semibold text-blue-900"
      >
        <Globe className="w-4 h-4 text-blue-500" />
        <span>{selectedCurrency.code}{selectedCurrency.symbol ? ` (${selectedCurrency.symbol})` : ''}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-blue-50 overflow-y-auto max-h-[400px] z-50">
          <div className="p-1">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm font-medium flex justify-between items-center ${
                  selectedCurrency.code === c.code ? 'bg-blue-50 text-blue-700' : 'hover:bg-blue-50/50 text-slate-700'
                }`}
              >
                <span>{c.name}</span>
                <span className="text-blue-600 font-bold">{c.symbol}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
