import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './source/context/AuthContext';
import { FavoritesProvider } from './source/context/FavoritesContext';
import { LanguageProvider } from './source/context/LanguageContext';
import './index.css';
import './i18n';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode><BrowserRouter><LanguageProvider><AuthProvider><FavoritesProvider><App /></FavoritesProvider></AuthProvider></LanguageProvider></BrowserRouter></StrictMode>,
);
