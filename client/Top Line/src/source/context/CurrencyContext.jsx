import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const RATES = {
  EGP: { symbol: 'EGP', rate: 1, name: 'Egyptian Pound' },
  USD: { symbol: '$', rate: 0.021, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.019, name: 'Euro' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('EGP');

  const formatPrice = (amountInEGP) => {
    const { symbol, rate } = RATES[currency];
    const converted = Math.round(amountInEGP * rate);
    
    if (currency === 'EGP') {
      return `${converted.toLocaleString()} EGP`;
    }
    return `${symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);