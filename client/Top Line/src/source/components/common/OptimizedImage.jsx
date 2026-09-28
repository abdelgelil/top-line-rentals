import React, { useState } from 'react';
import { DEFAULT_IMAGE_FALLBACK, getImageUrl } from '../../utils/getImageUrl';

const ImageWithFallback = ({
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
  const [useFallback, setUseFallback] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const imageSrc = useFallback ? DEFAULT_IMAGE_FALLBACK : src;

  const handleError = () => {
    if (!useFallback && src !== DEFAULT_IMAGE_FALLBACK) {
      setUseFallback(true);
      setLoaded(false);
      return;
    }
    setFallbackFailed(true);
    setLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
      )}
      {!fallbackFailed ? (
        <img
          key={imageSrc}
          src={imageSrc}
          sizes={sizes}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={decoding}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`${imageClassName} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-slate-100 to-blue-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900" role="img" aria-label={alt || 'Image unavailable'} />
      )}
    </div>
  );
};

const OptimizedImage = (props) => {
  const normalizedSrc = getImageUrl(props.src);
  return <ImageWithFallback key={normalizedSrc} {...props} src={normalizedSrc} />;
};

export default OptimizedImage;
