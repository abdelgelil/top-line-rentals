export const DEFAULT_IMAGE_FALLBACK = '/placeholder-apartment.svg';

/** Convert stored image values into browser-loadable URLs. */
export const getImageUrl = (imageSource, fallbackUrl = DEFAULT_IMAGE_FALLBACK) => {
  if (Array.isArray(imageSource)) imageSource = imageSource.find(Boolean);

  // Some API responses expose the URL as an object instead of a string.
  if (imageSource && typeof imageSource === 'object') {
    imageSource = imageSource.url || imageSource.secure_url || imageSource.src;
  }

  if (typeof imageSource !== 'string' || !imageSource.trim()) return fallbackUrl;

  const imageUrl = imageSource.trim();
  if (/^(https?:|data:image\/|blob:)/i.test(imageUrl)) return imageUrl;
  if (/^[A-Za-z\d+/]+={0,2}$/.test(imageUrl) && imageUrl.length >= 64 && imageUrl.length % 4 === 0) {
    return `data:image/jpeg;base64,${imageUrl}`;
  }
  if (imageUrl.startsWith('//')) return `https:${imageUrl}`;
  if (/^res\.cloudinary\.com\//i.test(imageUrl)) return `https://${imageUrl}`;

  // Reject executable or unsupported schemes rather than treating them as paths.
  if (/^[a-z][a-z\d+.-]*:/i.test(imageUrl)) return fallbackUrl;
  return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
};

export const getFirstImage = (apartment, fallbackUrl = DEFAULT_IMAGE_FALLBACK) => {
  if (!apartment) return fallbackUrl;
  const imageSource = Array.isArray(apartment.images) && apartment.images.length
    ? apartment.images[0]
    : apartment.image;
  return getImageUrl(imageSource, fallbackUrl);
};
