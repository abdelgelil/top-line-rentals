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
  MessageSquare
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
      setFormState({
        fullName: '',
        email: '',
        phone: '',
        subject: 'Reservation Inquiry',
        message: '',
      });
    } catch (err) {
      setSubmitStatus('error');
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
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Whether you're planning a coastal getaway or exploring investment opportunities in Alamein City, our reservation specialists are here to help.
        </p>
      </section>

      <div className="w-full px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">

        {/* Left Column: Story & Expansion */}
        <div className="space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-blue-100/60 dark:border-blue-500/20 shadow-xl shadow-blue-900/5 space-y-6 transition-all duration-300 hover:border-blue-300/60">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <Info className="w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">About TopLine Rentals</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              TopLine Rentals is a premier provider of luxury rental property listings and apartment management. We specialize in curating high-end residences designed for both short-term stays and extended luxury living, ensuring every guest experiences the pinnacle of coastal sophistication.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 dark:bg-slate-800 text-white border border-blue-500/20 shadow-2xl space-y-6 relative overflow-hidden group transition-all duration-300 hover:border-blue-500/40">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>

            <div className="flex items-center gap-3 text-sky-400">
              <Building2 className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">Alamein City Expansion</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We are proud to announce our expansion into the modern compound development in <span className="text-sky-400 font-semibold">Alamein City</span>. This flagship project offers an unparalleled blend of coastal residences, resort-style amenities, and strategic investment opportunities along the Mediterranean coast.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20 flex items-center gap-2">
                <Palmtree className="w-3 h-3" /> Coastal Living
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20 flex items-center gap-2">
                <Waves className="w-3 h-3" /> Resort Amenities
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Phone, label: 'Hotline', value: '+1 (555) 000-0000', color: 'blue' },
              { icon: Mail, label: 'Email Support', value: 'reservations@toplinerentals.com', color: 'blue' },
              { icon: MapPin, label: 'Headquarters', value: 'Alamein City, Mediterranean Coast', color: 'blue' },
              { icon: Clock, label: 'Working Hours', value: 'Sun - Thu: 9am - 6pm', color: 'blue' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-blue-100/60 dark:border-blue-500/20 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.value}</p>
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
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Send a Message</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formState.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
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
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subject</label>
                  <select
                    name="subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                  >
                    <option value="Reservation Inquiry">Reservation Inquiry</option>
                    <option value="Alamein City Compound Info">Alamein City Compound Info</option>
                    <option value="Property Support">Property Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="How can we help you?"
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
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>

            {submitStatus === 'success' && (
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in zoom-in duration-300 z-10 border border-blue-100/60 dark:border-blue-500/20">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-2">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Sent!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Thank you for reaching out. Our reservation team will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitStatus(null)}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-bold hover:shadow-lg transition-all"
                >
                  Send Another Message
                </button>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in zoom-in duration-300 z-10 border border-blue-100/60 dark:border-blue-500/20">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-2">
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Something went wrong</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Please try again later or contact us via phone.
                </p>
                <button
                  onClick={() => setSubmitStatus(null)}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-bold hover:shadow-lg transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
