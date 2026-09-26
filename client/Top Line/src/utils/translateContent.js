import i18n from '../i18n.js';

const dynamicTranslations = {
  'This apartment was added from mobile': 'تمت إضافة هذه الشقة من خلال تطبيق الهاتف المحمول',
  'Luxury apartment with sea view': 'شقة فاخرة بإطلالة على البحر',
  'Fully furnished unit with modern amenities': 'وحدة مفروشة بالكامل مع مرافق حديثة',
  'No description provided': 'لا يوجد وصف متاح',
  'Luxury serviced suite with beach access.': 'جناح فاخر مخدوم مع إمكانية الوصول إلى الشاطئ.',
  'The Towers, Coastal District': 'الأبراج، المنطقة الساحلية',
  'Luxury Apartment': 'شقة فاخرة',
  'Apartment Unit': 'وحدة سكنية',
  'Deleted/Unknown Apartment': 'شقة محذوفة أو غير معروفة',
  'Tower Residence': 'وحدة في البرج',
  'Tower 1': 'البرج ١',
  'Tower 2': 'البرج ٢',
  'Tower 3': 'البرج ٣',
};

/** Translate known database copy for Arabic while preserving unknown user content. */
export const translateText = (text) => {
  if (typeof text !== 'string' || !text) return text || '';

  const normalized = text.trim();
  if (!normalized || !i18n.language?.toLowerCase().startsWith('ar')) return text;

  return dynamicTranslations[normalized]
    || i18n.getResource('ar', 'translation', normalized)
    || text;
};
