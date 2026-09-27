import React, { useEffect, useState } from 'react';
import fallbackImage from '../../../assets/hero.png';

const optimizeImageUrl = (url) => {
  if (typeof url !== 'string') return url;

  // Cloudinary negotiates WebP/AVIF when the browser supports it.
  if (/res\.cloudinary\.com\//i.test(url) && url.includes('/upload/') && !url.includes('/upload/f_auto')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }

  // Unsplash can return modern formats while retaining a JPEG fallback.
  if (/images\.unsplash\.com\//i.test(url)) {
    const separator = url.includes('?') ? '&' : '?';
    if (!/[?&]auto=format(?:&|$)/.test(url)) return `${url}${separator}auto=format&fit=crop`;
  }

  return url;
};

const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  imageClassName = 'h-full w-full object-cover',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const imageSrc = usingFallback ? fallbackImage : (optimizeImageUrl(src) || fallbackImage);

  useEffect(() => {
    setLoaded(false);
    setUsingFallback(false);
    setFallbackFailed(false);
  }, [src]);

  const handleError = () => {
    if (!usingFallback) {
      setUsingFallback(true);
      setLoaded(false);
    } else {
      setFallbackFailed(true);
      setLoaded(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
      )}
      {!fallbackFailed && (
        <img
          src={imageSrc}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={decoding}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`${imageClassName} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
