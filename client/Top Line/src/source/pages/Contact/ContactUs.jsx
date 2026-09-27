import i18n from "../../../i18n.js";
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Building2,
  Palmtree,
  Waves,
  Info,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { sendContactMessage } from '../../services/api';

export const ContactUs = () => {
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Reservation Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await sendContactMessage(formState);
      setSubmitStatus('success');
      toast.success(i18n.t('Message sent successfully.'));
      setFormState({
        fullName: '',
        email: '',
        phone: '',
        subject: 'Reservation Inquiry',
        message: '',
      });
    } catch (err) {
      setSubmitStatus('error');
      toast.error(i18n.t('Failed to send your message. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Ambient Background Glows */}
      <div className="bg-blue-500/10 blur-[120px] fixed top-1/4 -left-20 w-96 h-96 rounded-full -z-10 pointer-events-none"></div>
      <div className="bg-sky-500/10 blur-[120px] fixed bottom-1/4 -right-20 w-96 h-96 rounded-full -z-10 pointer-events-none"></div>

      {/* Header Section */}
      <section className="w-full pt-16 pb-12 px-4 sm:px-8 lg:px-12 text-center space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 bg-clip-text text-transparent">{' '}{i18n.t("Get in Touch")}{' '}</h1>
        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">{' '}{i18n.t("Whether you're planning a coastal getaway or exploring investment opportunities in Alamein City, our reservation specialists are here to help.")}{' '}</p>
      </section>

      <div className="w-full px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">

        {/* Left Column: Story & Expansion */}
        <div className="space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-blue-100/60 dark:border-blue-500/20 shadow-xl shadow-blue-900/5 space-y-6 transition-all duration-300 hover:border-blue-300/60">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <Info className="w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{i18n.t("About TopLine Rentals")}</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">{' '}{i18n.t("TopLine Rentals is a premier provider of luxury rental property listings and apartment management. We specialize in curating high-end residences designed for both short-term stays and extended luxury living, ensuring every guest experiences the pinnacle of coastal sophistication.")}{' '}</p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 dark:bg-slate-800 text-white border border-blue-500/20 shadow-2xl space-y-6 relative overflow-hidden group transition-all duration-300 hover:border-blue-500/40">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>

            <div className="flex items-center gap-3 text-sky-400">
              <Building2 className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">{i18n.t("Alamein City Expansion")}</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{' '}{i18n.t("We are proud to announce our expansion into the modern compound development in")}{' '}<span className="text-sky-400 font-semibold">{i18n.t("Alamein City")}</span>{i18n.t(". This flagship project offers an unparalleled blend of coastal residences, resort-style amenities, and strategic investment opportunities along the Mediterranean coast.")}{' '}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20 flex items-center gap-2">
                <Palmtree className="w-3 h-3" />{' '}{i18n.t("Coastal Living")}{' '}</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20 flex items-center gap-2">
                <Waves className="w-3 h-3" />{' '}{i18n.t("Resort Amenities")}{' '}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Phone, label: 'Hotline', value: '+1 (555) 000-0000', color: 'blue' },
              { icon: Mail, label: 'Email Support', value: 'reservations@toplinerentals.com', color: 'blue' },
              { icon: MapPin, label: 'Headquarters', value: 'Alexandria, Cleopatra', color: 'blue' },
              { icon: Clock, label: 'Working Hours', value: 'Sun - Thu: 9am - 6pm', color: 'blue' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-blue-100/60 dark:border-blue-500/20 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{i18n.t(item.label)}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{i18n.t(item.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="relative">
          <div className="p-6 sm:p-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-blue-100/60 dark:border-blue-500/20 shadow-2xl transition-all duration-300 hover:border-blue-300/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{i18n.t("Send a Message")}</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{i18n.t("Full Name")}</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formState.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder={i18n.t("John Doe")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{i18n.t("Email Address")}</label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder={i18n.t("john@example.com")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{i18n.t("Phone Number")}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formState.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{i18n.t("Subject")}</label>
                  <select
                    name="subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                  >
                    <option value="Reservation Inquiry">{i18n.t("Reservation Inquiry")}</option>
                    <option value="Alamein City Compound Info">{i18n.t("Alamein City Compound Info")}</option>
                    <option value="Property Support">{i18n.t("Property Support")}</option>
                    <option value="Other">{i18n.t("Other")}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{i18n.t("Message")}</label>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder={i18n.t("How can we help you?")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold transition-all hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{i18n.t("Send Message")}</span>
                  </>
                )}
              </button>
            </form>

            {submitStatus === 'success' && (
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in zoom-in duration-300 z-10 border border-blue-100/60 dark:border-blue-500/20">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-2">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{i18n.t("Message Sent!")}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{' '}{i18n.t("Thank you for reaching out. Our reservation team will get back to you shortly.")}{' '}</p>
                <button
                  onClick={() => setSubmitStatus(null)}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-bold hover:shadow-lg transition-all"
                >{' '}{i18n.t("Send Another Message")}{' '}</button>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in zoom-in duration-300 z-10 border border-blue-100/60 dark:border-blue-500/20">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-2">
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{i18n.t("Something went wrong")}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{' '}{i18n.t("Please try again later or contact us via phone.")}{' '}</p>
                <button
                  onClick={() => setSubmitStatus(null)}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-bold hover:shadow-lg transition-all"
                >{' '}{i18n.t("Try Again")}{' '}</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="mx-auto mt-12 w-full max-w-7xl px-4 sm:px-8 lg:px-12" aria-label={i18n.t('location.title')}>
        <div className="group relative isolate overflow-hidden rounded-3xl border border-blue-200/70 bg-white/80 shadow-xl shadow-blue-900/5 backdrop-blur-xl transition-all duration-300 hover:border-blue-300 dark:border-blue-500/20 dark:bg-slate-900/80">
          <div className="absolute inset-y-0 right-0 -z-10 w-1/2 opacity-70 dark:opacity-40" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-200/70 via-blue-100/30 to-transparent dark:from-blue-900/70 dark:via-slate-900/30" />
            <div className="absolute -right-8 top-1/2 h-40 w-[120%] -translate-y-1/2 rotate-[-12deg] border-y-8 border-white/70 bg-blue-100/40 dark:border-slate-700/70 dark:bg-slate-800/40" />
            <div className="absolute right-1/3 top-0 h-full w-5 rotate-[24deg] bg-white/60 dark:bg-slate-700/60" />
            <div className="absolute right-1/2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/25 ring-8 ring-blue-500/15 transition-transform group-hover:scale-110">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
          <div className="relative flex min-h-52 flex-col justify-center gap-5 p-7 sm:p-10 md:max-w-2xl">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <MapPin className="h-6 w-6" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{i18n.t('location.title')}</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{i18n.t('location.description')}</p>
            <a
              href="https://maps.app.goo.gl/PZ7EcCYEGwLkZJ849?g_st=iw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30"
            >
              {i18n.t('location.directions')} <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
