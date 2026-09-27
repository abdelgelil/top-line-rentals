import React, { useEffect, useState } from 'react';
import fallbackImage from '../../../assets/hero.png';

const optimizeImageUrl = (url, width = 1200) => {
  if (typeof url !== 'string') return url;

  // Cloudinary negotiates a modern format and resizes oversized uploads.
  if (/res\.cloudinary\.com\//i.test(url) && url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }

  // Unsplash can return a resized modern format while retaining a fallback.
  if (/images\.unsplash\.com\//i.test(url)) {
    const [base, query = ''] = url.split('?');
    const params = new URLSearchParams(query);
    params.set('auto', 'format');
    params.set('fit', 'crop');
    params.set('q', '75');
    params.set('w', String(width));
    return `${base}?${params.toString()}`;
  }

  return url;
};

const imageSrcSet = (url) => {
  if (typeof url !== 'string') return undefined;
  if (/res\.cloudinary\.com\//i.test(url) && url.includes('/upload/')) {
    return [480, 768, 1024, 1440]
      .map((width) => `${optimizeImageUrl(url, width)} ${width}w`)
      .join(', ');
  }
  if (/images\.unsplash\.com\//i.test(url)) {
    return [480, 768, 1024, 1440]
      .map((width) => `${optimizeImageUrl(url, width)} ${width}w`)
      .join(', ');
  }
  return undefined;
};

const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  sizes = '100vw',
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
          srcSet={usingFallback ? undefined : imageSrcSet(src)}
          sizes={sizes}
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
