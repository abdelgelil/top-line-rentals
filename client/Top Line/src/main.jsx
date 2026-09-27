import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './source/context/AuthContext';
import { LanguageProvider } from './source/context/LanguageContext';
import './index.css';
import './i18n';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode><BrowserRouter><LanguageProvider><AuthProvider><App /></AuthProvider></LanguageProvider></BrowserRouter></StrictMode>,
);
