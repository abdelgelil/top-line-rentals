import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './source/context/AuthContext';
import { FavoritesProvider } from './source/context/FavoritesContext';
import { LanguageProvider } from './source/context/LanguageContext';
import { ThemeProvider } from './source/context/ThemeContext';
import './index.css';
import './i18n';
import App from './App.jsx';

const initialTheme = (() => {
  try {
    const savedTheme = window.localStorage.getItem('topline_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  } catch { /* Fall back to the operating-system preference. */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
})();
document.documentElement.classList.toggle('dark', initialTheme === 'dark');
document.documentElement.style.colorScheme = initialTheme;

createRoot(document.getElementById('root')).render(
  <StrictMode><ThemeProvider><BrowserRouter><LanguageProvider><AuthProvider><FavoritesProvider><App /></FavoritesProvider></AuthProvider></LanguageProvider></BrowserRouter></ThemeProvider></StrictMode>,
);
