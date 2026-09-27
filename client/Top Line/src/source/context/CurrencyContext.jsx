import React, { createContext, useContext } from 'react';
import { formatCurrency } from '../utils/formatters';

const CurrencyContext = createContext();

export const RATES = {
  EGP: { symbol: 'EGP', rate: 1, name: 'Egyptian Pound' },
  EUR: { symbol: '€', rate: 0.019, name: 'Euro' },
};

export const CurrencyProvider = ({ children }) => {
  const formatPrice = formatCurrency;

  return (
    <CurrencyContext.Provider value={{ currency: 'EGP', formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
