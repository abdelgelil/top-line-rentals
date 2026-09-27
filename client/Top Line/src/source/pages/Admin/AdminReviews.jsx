import React, { useEffect, useState } from 'react';
import { Check, Clock3, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import i18n from '../../../i18n.js';
import { fetchReviewsForModeration, setReviewApproval } from '../../services/api';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');

  useEffect(() => {
    let active = true;
    fetchReviewsForModeration()
      .then(({ data }) => { if (active) setReviews(data?.data || []); })
      .catch((error) => toast.error(error.response?.data?.message || i18n.t('Unable to load reviews.')))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const updateApproval = async (review, approved) => {
    setUpdatingId(review._id);
    try {
      const { data } = await setReviewApproval(review._id, approved);
      setReviews((current) => current.map((item) => item._id === review._id ? data.data : item));
      toast.success(approved ? i18n.t('Review approved.') : i18n.t('Review hidden.'));
    } catch (error) {
      toast.error(error.response?.data?.message || i18n.t('Unable to update review.'));
    } finally {
      setUpdatingId('');
    }
  };

  const pendingCount = reviews.filter((review) => !review.approved).length;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{i18n.t('Guest Reviews')}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{i18n.t('Approve guest feedback before it appears on apartment pages.')}</p>
        </div>
        <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">{pendingCount} {i18n.t('awaiting approval')}</span>
      </header>

      {loading ? <p className="py-16 text-center text-slate-500">{i18n.t('Loading reviews...')}</p> : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900">{i18n.t('No reviews have been submitted yet.')}</div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <article key={review._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{review.apartment?.title || i18n.t('Apartment')}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{review.guestName} · {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${review.approved ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'}`}>
                  {review.approved ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}{review.approved ? i18n.t('Approved') : i18n.t('Pending')}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1 text-amber-500" aria-label={`${review.rating} ${i18n.t('stars')}`}>
                {Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />)}
              </div>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">{review.comment}</p>
              <div className="mt-5 flex justify-end">
                <button type="button" disabled={updatingId === review._id} onClick={() => updateApproval(review, !review.approved)} className={`min-h-10 rounded-lg px-4 text-sm font-semibold transition disabled:opacity-60 ${review.approved ? 'border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800' : 'bg-blue-700 text-white hover:bg-blue-800'}`}>
                  {updatingId === review._id ? i18n.t('Saving...') : review.approved ? i18n.t('Hide review') : i18n.t('Approve review')}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
