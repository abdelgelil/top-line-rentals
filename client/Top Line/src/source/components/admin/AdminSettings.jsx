import i18n from "../../../i18n.js";
import React, { useState } from 'react';
import API from '../../services/api';

export default function AdminSettings() {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleGrantAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    if (!newAdminEmail.trim() && !newAdminPhone.trim()) {
      setMsg({ type: 'error', text: i18n.t('Enter an email address, phone number, or both') });
      setLoading(false);
      return;
    }

    try {
      const res = await API.post('/users/make-admin', {
        email: newAdminEmail.trim(),
        phone: newAdminPhone.trim(),
      });
      setMsg({ type: 'success', text: res.data.message });
      setNewAdminEmail('');
      setNewAdminPhone('');
    } catch (err) {
      setMsg({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update user role' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{i18n.t("Admin Management")}</h2>
        <p className="text-xs text-slate-500 mt-1">{' '}{i18n.t("Promote an existing registered account by verified email, phone number, or both.")}{' '}</p>
      </div>

      {msg.text && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${
          msg.type === 'success' 
            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
            : 'bg-red-500/10 text-red-500 border border-red-500/20'
        }`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleGrantAdmin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">{' '}{i18n.t("Email Address (optional)")}{' '}</label>
          <input
            type="email"
            placeholder={i18n.t("Enter registered email")}
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">{' '}{i18n.t("Phone Number (optional)")}{' '}</label>
          <input
            type="tel"
            placeholder={i18n.t("Enter registered phone number with country code")}
            value={newAdminPhone}
            onChange={(e) => setNewAdminPhone(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
          />
          <p className="mt-1 text-[11px] text-slate-500">{i18n.t("If both are entered, they must belong to the same account.")}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all disabled:opacity-50"
        >
          {loading ? i18n.t('Updating...') : i18n.t('Make Admin')}
        </button>
      </form>
    </div>
  );
}
