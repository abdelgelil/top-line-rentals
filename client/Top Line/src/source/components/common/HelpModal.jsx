import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Phone, MessageCircle, MessageSquare, CalendarCheck } from 'lucide-react';

const SUPPORT_PHONE = '+201234567890';

const HelpModal = ({ onClose }) => {
  const { t } = useTranslation();
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('a[href], button:not([disabled])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const callbackMessage = encodeURIComponent(t('accessibility.callbackMessage'));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-help-title"
        tabIndex={-1}
        ref={dialogRef}
        className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-slate-800 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <Phone className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 id="booking-help-title" className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {t('accessibility.needHelp')}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t('accessibility.closeHelp')}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <a href={`tel:${SUPPORT_PHONE}`} className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-center text-base font-bold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50">
            <Phone className="h-5 w-5" aria-hidden="true" /> {t('accessibility.callSupport')}
          </a>
          <a href={`https://wa.me/${SUPPORT_PHONE.slice(1)}`} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-4 py-3 text-center text-base font-bold text-slate-800 transition hover:border-blue-500 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800">
            <MessageCircle className="h-5 w-5" aria-hidden="true" /> {t('accessibility.whatsapp')}
          </a>
          <a href={`sms:${SUPPORT_PHONE}?body=${callbackMessage}`} className="flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-4 py-3 text-center text-base font-bold text-slate-800 transition hover:border-blue-500 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800">
            <MessageSquare className="h-5 w-5" aria-hidden="true" /> {t('accessibility.requestCallback')}
          </a>
        </div>
        <p className="mt-3 text-center text-lg font-semibold text-slate-700 dark:text-slate-200" dir="ltr">+20 123 456 7890</p>

        <div className="mt-7 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/70">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <CalendarCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            {t('accessibility.easyStepsTitle')}
          </h3>
          <ol className="mt-4 space-y-3 text-base leading-relaxed text-slate-700 dark:text-slate-200">
            <li>{t('accessibility.step1')}</li>
            <li>{t('accessibility.step2')}</li>
            <li>{t('accessibility.step3')}</li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default HelpModal;
