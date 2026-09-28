import React, { useEffect, useState } from 'react';
import { DEFAULT_IMAGE_FALLBACK, getImageUrl } from '../../utils/getImageUrl';

const optimizeImageUrl = (url, width = 1200) => {
  if (typeof url !== 'string') return url;

  // Keep existing Cloudinary transformations and update/add only the width.
  if (/res\.cloudinary\.com\//i.test(url) && /\/upload\//i.test(url)) {
    return url.replace(/\/upload\/([^/?#]*)(.*)$/i, (match, segment, remainder) => {
      const isTransformation = segment.includes(',') || /^(f_|q_|w_|c_|g_|dpr_|ar_|e_|fl_)/.test(segment);
      if (!isTransformation) return `/upload/f_auto,q_auto,w_${width},c_limit/${segment}${remainder}`;

      const parts = segment.split(',').filter(Boolean);
      const hasAutoFormat = parts.includes('f_auto');
      const hasAutoQuality = parts.includes('q_auto');
      const hasLimitCrop = parts.includes('c_limit');
      const nextParts = parts
        .filter((part) => !/^w_\d+$/.test(part))
        .concat(`w_${width}`);
      if (!hasAutoFormat) nextParts.unshift('f_auto');
      if (!hasAutoQuality) nextParts.push('q_auto');
      if (!hasLimitCrop) nextParts.push('c_limit');
      return `/upload/${nextParts.join(',')}${remainder}`;
    });
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
  width = 1200,
  imageClassName = 'h-full w-full object-cover',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [sourceMode, setSourceMode] = useState('optimized');
  const normalizedSrc = getImageUrl(src);
  const optimizedSrc = optimizeImageUrl(normalizedSrc, width);
  const imageSrc = sourceMode === 'fallback'
    ? DEFAULT_IMAGE_FALLBACK
    : sourceMode === 'original' ? normalizedSrc : optimizedSrc;

  useEffect(() => {
    setLoaded(false);
    setSourceMode('optimized');
  }, [src]);

  const handleError = () => {
    if (sourceMode === 'optimized' && optimizedSrc !== normalizedSrc) {
      setSourceMode('original');
      setLoaded(false);
    } else if (sourceMode !== 'fallback') {
      setSourceMode('fallback');
      setLoaded(false);
    } else {
      setSourceMode('failed');
      setLoaded(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
      )}
      {sourceMode !== 'failed' && (
        <img
          src={imageSrc}
          srcSet={sourceMode === 'optimized' ? imageSrcSet(normalizedSrc) : undefined}
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
      {sourceMode === 'failed' && <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-slate-100 to-blue-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900" role="img" aria-label={alt || 'Image unavailable'} />}
    </div>
  );
};

export default OptimizedImage;
