import i18n from "../../../i18n.js";
import { translateText } from '../../../utils/translateContent.js';
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchApartmentById, fetchApartmentReviews, fetchEligibleReviews, submitReview } from '../../services/api';
import BookingForm from '../../components/booking/BookingForm';
import { formatCurrency } from '../../utils/formatters';
import OptimizedImage from '../../components/common/OptimizedImage';
import { 
  Users, 
  Maximize, 
  Building, 
  Bed, 
  Star, 
  Info, 
  X, 
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getFirstImage } from '../../utils/getImageUrl';

const ImageLightbox = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-4 text-white z-10">
        <div className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
          {currentIndex + 1} / {images.length}
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-12">
        <button 
          onClick={prevImage}
          className="absolute left-4 p-3 rounded-full bg-black/30 text-white hover:bg-black/60 transition-all backdrop-blur-sm z-10"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <OptimizedImage
          src={images[currentIndex]} 
          alt={`Property view ${currentIndex + 1}`} 
          className="max-w-full max-h-full rounded-lg shadow-2xl"
          imageClassName="max-w-full max-h-full object-contain transition-all duration-300"
          loading="eager"
        />

        <button 
          onClick={nextImage}
          className="absolute right-4 p-3 rounded-full bg-black/30 text-white hover:bg-black/60 transition-all backdrop-blur-sm z-10"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      <div className="p-6 flex justify-center gap-3 overflow-x-auto bg-gradient-to-t from-black/50 to-transparent">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              currentIndex === idx ? 'border-blue-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <OptimizedImage src={img} className="h-full w-full" imageClassName="h-full w-full object-cover" alt={`Thumb ${idx}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export function ApartmentDetails({ currentUser: propUser }) {
  const { id } = useParams();
  const { user } = useAuth();
  const currentUser = propUser || user;

  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');
  const [eligibleBookings, setEligibleBookings] = useState([]);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityError, setEligibilityError] = useState('');
  const [eligibilityRetry, setEligibilityRetry] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const loadReviews = useCallback(() => {
    if (!id) return;
    setReviewsLoading(true);
    setReviewsError('');
    fetchApartmentReviews(id).then(({ data }) => {
      setReviews(data?.data || []);
      setAverageRating(data?.averageRating ?? null);
    }).catch(() => {
      setReviews([]);
      setAverageRating(null);
      setReviewsError(i18n.t('Unable to load reviews. Please try again.'));
    }).finally(() => setReviewsLoading(false));
  }, [id]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  useEffect(() => {
    if (loading || window.location.hash !== '#apartment-reviews') return undefined;
    const scrollTimer = window.setTimeout(() => {
      document.getElementById('apartment-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => window.clearTimeout(scrollTimer);
  }, [loading, id]);

  useEffect(() => {
    let active = true;
    if (!currentUser?.id) {
      setEligibleBookings([]);
      setEligibilityError('');
      setEligibilityLoading(false);
      return undefined;
    }
    setEligibleBookings([]);
    setEligibilityError('');
    setEligibilityLoading(true);
    fetchEligibleReviews(id)
      .then(({ data }) => { if (active) setEligibleBookings(data?.data || []); })
      .catch(() => {
        if (active) {
          setEligibleBookings([]);
          setEligibilityError(i18n.t('Unable to check review eligibility. Please try again.'));
        }
      })
      .finally(() => { if (active) setEligibilityLoading(false); });
    return () => { active = false; };
  }, [id, currentUser?.id, eligibilityRetry]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!eligibleBookings.length || reviewSubmitting) return;
    setReviewSubmitting(true);
    try {
      await submitReview({ bookingId: eligibleBookings[0]._id, rating: reviewRating, comment: reviewComment });
      setEligibleBookings((current) => current.slice(1));
      setReviewComment('');
      setReviewSubmitted(true);
      toast.success(i18n.t('Your review was submitted for approval.'));
    } catch (error) {
      toast.error(error.response?.data?.message || i18n.t('Unable to submit your review.'));
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    fetchApartmentById(id)
      .then((res) => {
        const fetchedData = res?.data?.data || res?.data || res;
        if (fetchedData && (fetchedData._id || fetchedData.id)) {
          setApartment(fetchedData);
        } else {
          setApartment(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch apartment:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-medium">{i18n.t("Loading luxury details...")}</p>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500 space-y-4">
        <Info className="w-12 h-12" />
        <p className="text-xl font-semibold">{i18n.t("Apartment not found.")}</p>
      </div>
    );
  }

  const images = Array.isArray(apartment.images) && apartment.images.length
    ? apartment.images.map((image) => getFirstImage({ image }))
    : [getFirstImage(apartment)];

  const openLightbox = (index) => {
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-24 lg:pt-16 lg:pb-24">
        
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">{i18n.t("Apartments")}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-medium">{translateText(apartment.title)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3" />{' '}{i18n.t("Verified Listing")}{' '}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            
            {/* Horizontal Image Slider / Carousel */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-black/5 bg-slate-200 dark:bg-slate-800">
                <div 
                  className="flex transition-transform duration-500 ease-out" 
                  style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
                >
                  {images.length > 0 ? (
                    images.map((img, idx) => (
                      <OptimizedImage
                        key={idx}
                        src={img}
                        alt={`Property view ${idx + 1}`} 
                        loading={idx === activeImageIndex ? 'eager' : 'lazy'}
                        fetchPriority={idx === activeImageIndex ? 'high' : 'auto'}
                        decoding="async"
                        sizes="(min-width: 1024px) 66vw, 100vw"
                        className="h-[260px] w-full flex-shrink-0 sm:h-[340px] lg:h-[420px]"
                        imageClassName="h-full w-full object-cover"
                      />
                    ))
                  ) : (
                    <OptimizedImage
                      className="h-[260px] w-full flex-shrink-0 sm:h-[340px] lg:h-[420px]"
                      imageClassName="h-full w-full object-cover"
                      alt={i18n.t("Placeholder")} 
                    />
                  )}
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImageIndex(prev => (prev - 1 + images.length) % images.length)}
                      aria-label={i18n.t('Previous photo')}
                      className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg backdrop-blur-md transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/60 dark:bg-black/70 dark:text-white dark:hover:bg-black"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setActiveImageIndex(prev => (prev + 1) % images.length)}
                      aria-label={i18n.t('Next photo')}
                      className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg backdrop-blur-md transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/60 dark:bg-black/70 dark:text-white dark:hover:bg-black"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* View All Overlay Button */}
                {images.length > 1 && (
                  <div className="absolute bottom-6 right-6">
                    <button 
                      onClick={() => openLightbox(0)}
                      className="flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/90 px-5 py-3 text-base font-bold text-slate-900 shadow-xl backdrop-blur-md transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/60 dark:bg-black/70 dark:text-white dark:hover:bg-black"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>{i18n.t("View All")}{' '}{images.length}{' '}{i18n.t("Photos")}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination Dots */}
              {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {images.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`${i18n.t('Go to photo')} ${idx + 1}`}
                      aria-current={activeImageIndex === idx ? 'true' : undefined}
                      className="flex h-12 w-12 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50"
                    >
                      <span className={`h-2 rounded-full transition-all duration-300 ${
                        activeImageIndex === idx ? 'w-8 bg-blue-700' : 'w-2 bg-slate-500 dark:bg-slate-300'
                      }`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest">

                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {translateText(apartment.title)}
                  </h1>
                </div>
                <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{i18n.t("Premium Luxury Listing")}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Building, label: 'Tower', value: translateText(apartment.tower || 'Tower 1') },
                  { icon: Users, label: 'Guests', value: `${apartment.guests || 2} ${i18n.t('Max')}` },
                  { icon: Maximize, label: 'Area', value: `${apartment.sizeSqM || 'N/A'} ${i18n.t('sqm')}` },
                  { icon: Bed, label: 'Type', value: i18n.t('Luxury Suite') },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{i18n.t(stat.label)}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12 pt-4">
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold text-2xl">
                  <div className="w-1 h-8 bg-blue-600 rounded-full" />
                  <h2>{i18n.t("Property Overview")}</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-loose text-lg max-w-4xl">
                  {translateText(apartment.description)}
                </p>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-12 p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-6">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xl flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />{' '}{i18n.t("Building Amenities")}{' '}</h3>
                  <ul className="grid grid-cols-1 gap-4">
                    {['Infinity Pool', 'Fitness Center', '24/7 Concierge', 'Secure Parking', 'Private Beach Access', 'Spa & Wellness'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 group cursor-default">
                        <div className="w-2 h-2 rounded-full bg-blue-600 group-hover:scale-150 transition-transform" />
                      <span className="text-sm transition-colors group-hover:text-slate-900 dark:group-hover:text-white">{i18n.t(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xl flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />{' '}{i18n.t("House Rules")}{' '}</h3>
                  <ul className="grid grid-cols-1 gap-4">
                    {['No Smoking Indoors', 'No Parties', 'Check-in after 2PM', 'Quiet hours 10PM-8AM', 'ID Required for Entry'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 group cursor-default">
                        <div className="w-2 h-2 rounded-full bg-blue-600 group-hover:scale-150 transition-transform" />
                      <span className="text-sm transition-colors group-hover:text-slate-900 dark:group-hover:text-white">{i18n.t(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            <section id="apartment-reviews" className="relative isolate scroll-mt-24 space-y-6 overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-amber-50/60 p-5 shadow-xl shadow-blue-950/5 sm:p-8 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/50 dark:shadow-black/20" aria-labelledby="apartment-reviews-title">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full bg-amber-300/15 blur-3xl dark:bg-amber-400/10" />
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-amber-800 shadow-sm dark:border-amber-400/20 dark:bg-slate-800 dark:text-amber-200"><Star className="h-3.5 w-3.5 fill-current" />{i18n.t('Guest experiences')}</span>
                  <h2 id="apartment-reviews-title" className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{i18n.t('Guest Reviews')}</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{reviews.length && averageRating !== null ? `${averageRating.toFixed(1)} / 5 · ${reviews.length} ${i18n.t('reviews')}` : i18n.t('No reviews yet')}</p>
                </div>
                {averageRating !== null && <div className="flex min-w-20 items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-lg font-black text-amber-700 shadow-md shadow-amber-950/5 dark:border-amber-400/20 dark:bg-slate-800 dark:text-amber-200"><Star className="h-5 w-5 fill-current" />{averageRating.toFixed(1)}</div>}
              </div>

              {eligibleBookings.length > 0 && (
                <form onSubmit={handleReviewSubmit} className="space-y-5 rounded-2xl border border-blue-200 bg-white p-5 shadow-lg shadow-blue-950/5 sm:p-6 dark:border-blue-400/20 dark:bg-slate-800/80 dark:shadow-black/20">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{i18n.t('Review your completed stay')}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{i18n.t('Your feedback helps future guests choose the right stay.')}</p>
                  </div>
                  <div className="flex items-center gap-1" role="radiogroup" aria-label={i18n.t('Rating')}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button key={rating} type="button" role="radio" aria-checked={reviewRating === rating} aria-label={`${rating} ${i18n.t('stars')}`} onClick={() => setReviewRating(rating)} className="rounded-lg p-1.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                        <Star className={`h-7 w-7 ${rating <= reviewRating ? 'fill-amber-400 text-amber-500 dark:text-amber-300' : 'text-slate-300 dark:text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                  <label htmlFor="review-comment" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    {i18n.t('Your review')}
                    <textarea id="review-comment" required minLength={5} maxLength={1000} value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} rows={4} placeholder={i18n.t('Share the highlights of your stay...')} className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-4 text-base leading-relaxed text-slate-900 caret-blue-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50 dark:caret-blue-300 dark:placeholder:text-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-900/50" />
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{i18n.t('Reviews appear after admin approval.')}</p>
                  <button disabled={reviewSubmitting || reviewComment.trim().length < 5} type="submit" className="min-h-12 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55">{reviewSubmitting ? i18n.t('Submitting...') : i18n.t('Submit review')}</button>
                </form>
              )}
              {!currentUser?.id && <p className="text-sm text-slate-600 dark:text-slate-400"><Link to="/sign-in" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">{i18n.t('Sign in')}</Link>{' '}{i18n.t('to review after a completed stay.')}</p>}
              {reviewSubmitted && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-950/40 dark:text-emerald-200">{i18n.t('Your review was submitted and will appear after approval.')}</p>}
              {eligibilityLoading && currentUser?.id && <p role="status" className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-sm text-blue-900 dark:border-blue-400/20 dark:bg-blue-950/40 dark:text-blue-100">{i18n.t('Checking whether you can review this stay...')}</p>}
              {eligibilityError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 dark:border-rose-400/20 dark:bg-rose-950/40 dark:text-rose-200">{eligibilityError} <button type="button" onClick={() => setEligibilityRetry((current) => current + 1)} className="ml-1 font-bold underline underline-offset-2">{i18n.t('Retry')}</button></p>}
              {eligibleBookings.length === 0 && currentUser?.id && !eligibilityLoading && !eligibilityError && <p className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">{i18n.t('Reviews are available after a confirmed stay is completed.')}</p>}

              {reviewsLoading ? (
                <p role="status" className="rounded-xl border border-slate-200 bg-white/80 px-4 py-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">{i18n.t('Loading reviews...')}</p>
              ) : reviewsError ? (
                <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 dark:border-rose-400/20 dark:bg-rose-950/40 dark:text-rose-200">{reviewsError} <button type="button" onClick={loadReviews} className="ml-1 font-bold underline underline-offset-2">{i18n.t('Retry')}</button></p>
              ) : reviews.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {reviews.map((review) => (
                    <article key={review._id} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{review.guestName}</h3>
                          <time className="text-xs text-slate-500 dark:text-slate-400" dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>
                        </div>
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-300"><Star className="h-4 w-4 fill-current" />{review.rating}</span>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{review.comment}</p>
                    </article>
                  ))}
                </div>
              ) : <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-700">{i18n.t('Be the first guest to share a review.')}</p>}
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 z-10">
              <BookingForm apartment={apartment} currentUser={currentUser} />
            </div>
          </div>
        </div>

        {isLightboxOpen && (
          <ImageLightbox 
            images={images} 
            initialIndex={activeImageIndex} 
            onClose={() => setIsLightboxOpen(false)} 
          />
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pb-[env(safe-area-inset-bottom)] py-3 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">{translateText(apartment.title)}</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 sm:text-base">
              {formatCurrency(apartment.pricePerNight || apartment.price || 0)} <span className="font-normal">{i18n.t('/ night')}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const bookingForm = document.getElementById('booking-form');
              bookingForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              bookingForm?.focus({ preventScroll: true });
            }}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            {i18n.t('accessibility.bookStay')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApartmentDetails;
