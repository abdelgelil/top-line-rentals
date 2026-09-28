import React from 'react';

const Logo = ({ className = '', showText = true }) => (
  <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`}>
    <img src="/logo1.jpg" alt="" aria-hidden="true" width="40" height="40" decoding="async" className="h-10 w-10 shrink-0 rounded-lg object-contain" />
    {showText && <span className="max-w-[13rem] text-sm font-semibold leading-tight tracking-tight text-slate-900 dark:text-[#f9f8f5] sm:text-base">Topline Luxury Apartments</span>}
  </span>
);

export default Logo;
