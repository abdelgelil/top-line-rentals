import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = '', showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-400 text-white shadow-lg shadow-blue-500/30">
        {/* House Outline with Ascending Arrow */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-5 h-5"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 15l3-3 3 3" />
          <path d="M12 12v6" />
        </svg>
      </div>
      
      {showText && (
        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
          TopLine <span className="text-blue-600 dark:text-blue-400">Rentals</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
