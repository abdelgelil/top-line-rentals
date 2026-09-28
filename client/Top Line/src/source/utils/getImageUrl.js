const DEFAULT_FALLBACK_URL = '/placeholder-apartment.svg';

export const getFirstImage = (apartment, fallbackUrl = DEFAULT_FALLBACK_URL) => {
  if (!apartment) return fallbackUrl;

  const imageSource = Array.isArray(apartment.images) && apartment.images.length > 0
    ? apartment.images[0]
    : apartment.image;

  if (typeof imageSource !== 'string' || !imageSource.trim()) return fallbackUrl;

  const imageUrl = imageSource.trim();
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith('//')) return `https:${imageUrl}`;
  if (imageUrl.startsWith('res.cloudinary.com/')) return `https://${imageUrl}`;

  return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
};
