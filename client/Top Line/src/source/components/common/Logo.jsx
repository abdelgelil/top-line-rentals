import React from 'react';
import logoMark from '../../../assets/Logo2Mark.png';

const Logo = ({ className = '', showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logoMark} alt="" aria-hidden="true" className="h-9 w-8 object-contain" />
      
      {showText && (
        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Top<span className="text-blue-600 dark:text-blue-400">Line</span></span>
      )}
    </div>
  );
};

export default Logo;
