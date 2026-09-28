import React from 'react';

const Logo = ({ className = '', showText = true, size = 'default' }) => (
  <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`}>
    <img src="/logo1.jpg" alt="" aria-hidden="true" width={size === 'large' ? 64 : 44} height={size === 'large' ? 64 : 44} decoding="async" className={`${size === 'large' ? 'h-16 w-16' : 'h-11 w-11'} shrink-0 rounded-full border border-[#c6a052]/50 bg-[#080d1a] object-cover p-0.5 shadow-[0_0_0_3px_rgba(198,160,82,0.08),0_8px_20px_rgba(0,0,0,0.2)]`} />
    {showText && <span className="max-w-[13rem] text-sm font-semibold leading-tight tracking-tight text-slate-900 dark:text-[#f9f8f5] sm:text-base">Topline Luxury Apartments</span>}
  </span>
);

export default Logo;
