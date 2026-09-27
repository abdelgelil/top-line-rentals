import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const fieldClass = 'mt-2 min-h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-lg text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900';

function AuthShell({ title, hint, children, footer }) {
  return <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950"><section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 sm:p-10" aria-labelledby="auth-title"><h1 id="auth-title" className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1><p className="mt-3 text-lg leading-7 text-slate-600 dark:text-slate-300">{hint}</p>{children}{footer && <p className="mt-8 text-center text-base text-slate-600 dark:text-slate-300">{footer}</p>}</section></main>;
}

function PasswordAuthForm({ registering }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const endpoint = registering ? '/auth/register' : '/auth/login';
      const body = registering ? { username, phone, password, ...(email.trim() ? { email: email.trim() } : {}) } : { phone, password };
      const { data } = await API.post(endpoint, body, { skipAuth: true });
      setAuthenticatedUser(data);
      toast.success(t('auth.welcome'));
      navigate(data.user.role === 'admin' ? '/admin/analytics' : '/', { replace: true });
    } catch (error) { toast.error(error.response?.data?.message || t('auth.signInFailed')); }
    finally { setBusy(false); }
  };

  return <AuthShell title={t(registering ? 'auth.createAccount' : 'auth.signIn')} hint={t(registering ? 'auth.signupHint' : 'auth.loginHint')} footer={<>{t(registering ? 'auth.haveAccount' : 'auth.noAccount')} <Link className="font-bold text-blue-700 underline underline-offset-4 dark:text-blue-300" to={registering ? '/sign-in' : '/sign-up'}>{t(registering ? 'auth.signIn' : 'auth.createAccount')}</Link></>}>
    <form className="mt-8 space-y-5" onSubmit={submit}>
      {registering && <div><label htmlFor="auth-username" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.username')}</label><input id="auth-username" className={fieldClass} autoComplete="username" required maxLength={100} value={username} onChange={(e) => setUsername(e.target.value)} /></div>}
      <div><label htmlFor="auth-phone" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.phone')}</label><input id="auth-phone" className={fieldClass} type="tel" inputMode="tel" autoComplete="tel" placeholder="+201000000000" required value={phone} onChange={(e) => setPhone(e.target.value)} /><p className="mt-2 text-sm text-slate-500">{t('auth.phoneFormat')}</p></div>
      {registering && <div><label htmlFor="auth-email" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.emailOptional')}</label><input id="auth-email" className={fieldClass} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>}
      <div><label htmlFor="auth-password" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.password')}</label><input id="auth-password" className={fieldClass} type="password" autoComplete={registering ? 'new-password' : 'current-password'} minLength={8} maxLength={128} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      {!registering && <Link to="/reset-password" className="flex min-h-10 items-center text-base font-semibold text-blue-700 underline underline-offset-4 dark:text-blue-300">{t('auth.forgotPassword')}</Link>}
      <button disabled={busy} className="min-h-14 w-full rounded-xl bg-blue-700 px-5 text-lg font-bold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:opacity-60">{busy ? t('auth.pleaseWait') : t(registering ? 'auth.createAccount' : 'auth.signIn')}</button>
    </form>
  </AuthShell>;
}

export function SignInPage() { return <PasswordAuthForm registering={false} />; }
export function SignUpPage() { return <PasswordAuthForm registering />; }

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const sendCode = async (event) => {
    event.preventDefault(); setBusy(true);
    try { await API.post('/auth/forgot-password', { email }, { skipAuth: true }); setStep('reset'); toast.success(t('auth.resetCodeSent')); }
    catch (error) { toast.error(error.response?.data?.message || t('auth.sendFailed')); }
    finally { setBusy(false); }
  };
  const resetPassword = async (event) => {
    event.preventDefault(); setBusy(true);
    try { await API.post('/auth/reset-password', { email, otp, newPassword }, { skipAuth: true }); toast.success(t('auth.passwordReset')); window.location.assign('/sign-in'); }
    catch (error) { toast.error(error.response?.data?.message || t('auth.resetFailed')); }
    finally { setBusy(false); }
  };
  return <AuthShell title={t('auth.resetPassword')} hint={t(step === 'email' ? 'auth.resetEmailHint' : 'auth.resetCodeHint')} footer={<>{t('auth.haveAccount')} <Link className="font-bold text-blue-700 underline underline-offset-4 dark:text-blue-300" to="/sign-in">{t('auth.signIn')}</Link></>}>
    {step === 'email' ? <form className="mt-8 space-y-5" onSubmit={sendCode}><div><label htmlFor="reset-email" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.email')}</label><input id="reset-email" className={fieldClass} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div><button disabled={busy} className="min-h-14 w-full rounded-xl bg-blue-700 px-5 text-lg font-bold text-white disabled:opacity-60">{busy ? t('auth.pleaseWait') : t('auth.sendCode')}</button></form>
      : <form className="mt-8 space-y-5" onSubmit={resetPassword}><div><label htmlFor="reset-code" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.verificationCode')}</label><input id="reset-code" className={`${fieldClass} text-center tracking-[0.5em]`} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} /></div><div><label htmlFor="new-password" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.newPassword')}</label><input id="new-password" className={fieldClass} type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div><button disabled={busy || otp.length !== 6} className="min-h-14 w-full rounded-xl bg-blue-700 px-5 text-lg font-bold text-white disabled:opacity-60">{busy ? t('auth.pleaseWait') : t('auth.resetPassword')}</button></form>}
  </AuthShell>;
}
