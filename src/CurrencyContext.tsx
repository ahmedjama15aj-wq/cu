/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export const CURRENCIES = [
  { code: 'USD', symbol: '', name: 'US Dollar', rate: 1 },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', rate: 36.85 },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', rate: 1380 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 154.60 },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', rate: 57.20 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.94 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.81 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rate: 3.75 },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', rate: 0.31 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.24 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rate: 4.78 },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rate: 16180 },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', rate: 32.50 },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', rate: 278.30 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.55 },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', rate: 1.69 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.91 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.38 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.36 },
];

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

interface CurrencyContextType {
  selectedCurrency: Currency;
  setCurrency: (code: string) => void;
  formatPrice: (priceInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('selectedCurrency');
    if (saved) {
      const found = CURRENCIES.find(c => c.code === saved);
      if (found) return found;
    }
    return CURRENCIES[0];
  });

  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency.code);
  }, [selectedCurrency]);

  const setCurrency = (code: string) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (found) {
      setSelectedCurrency(found);
    }
  };

  const formatPrice = (priceInUSD: number) => {
    const converted = priceInUSD * selectedCurrency.rate;
    // Format based on currency rules (e.g., JPY usually has no decimals)
    const options: Intl.NumberFormatOptions = {
      style: 'decimal',
      minimumFractionDigits: (selectedCurrency.code === 'JPY' || selectedCurrency.code === 'KRW' || selectedCurrency.code === 'IDR') ? 0 : 2,
      maximumFractionDigits: (selectedCurrency.code === 'JPY' || selectedCurrency.code === 'KRW' || selectedCurrency.code === 'IDR') ? 0 : 2,
    };
    return `${selectedCurrency.symbol}${converted.toLocaleString(undefined, options)}`;
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
