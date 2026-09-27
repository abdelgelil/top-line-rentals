import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function PhoneAuthForm({ mode }) {
  const registering = mode === 'register';
  const resetting = mode === 'reset';
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();
  const [step, setStep] = useState('details');
  const [busy, setBusy] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryDestination, setDeliveryDestination] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const requestCode = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const endpoint = registering ? '/auth/register' : '/auth/request-otp';
      const { data } = await API.post(endpoint, { phone, purpose: mode, password, ...(registering ? { name, email } : {}) }, { skipAuth: true });
      setDeliveryDestination(data.destination || '');
      setStep('code');
      toast.success(t('auth.emailCodeSent'));
    } catch (error) { toast.error(error.response?.data?.message || t('auth.sendFailed')); }
    finally { setBusy(false); }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const { data } = await API.post('/auth/verify-otp', { phone, code }, { skipAuth: true });
      setAuthenticatedUser(data);
      toast.success(t('auth.welcome'));
      navigate(data.user.role === 'admin' ? '/admin/analytics' : '/', { replace: true });
    } catch (error) { toast.error(error.response?.data?.message || t('auth.verifyFailed')); }
    finally { setBusy(false); }
  };

  const fieldClass = 'mt-2 min-h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-lg text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900';
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 sm:p-10" aria-labelledby="auth-title">
        <h1 id="auth-title" className="text-3xl font-bold text-slate-900 dark:text-white">{t(registering ? 'auth.createAccount' : resetting ? 'auth.resetPassword' : 'auth.signIn')}</h1>
        <p className="mt-3 text-lg leading-7 text-slate-600 dark:text-slate-300">{t(step === 'code' ? 'auth.enterCodeHint' : 'auth.phoneHint')}</p>
        {step === 'details' ? (
          <form className="mt-8 space-y-5" onSubmit={requestCode}>
            {registering && <div><label htmlFor="auth-name" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.name')}</label><input id="auth-name" className={fieldClass} autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} /></div>}
            <div><label htmlFor="auth-password" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.password')}</label><input id="auth-password" className={fieldClass} type="password" autoComplete={registering || resetting ? 'new-password' : 'current-password'} minLength={12} maxLength={128} required value={password} onChange={(e) => setPassword(e.target.value)} /><p className="mt-2 text-sm text-slate-500">{t(registering ? 'auth.passwordHint' : resetting ? 'auth.resetPasswordHint' : 'auth.passwordLoginHint')}</p></div>
            <div><label htmlFor="auth-phone" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.phone')}</label><input id="auth-phone" className={fieldClass} type="tel" inputMode="tel" autoComplete="tel" placeholder="+201000000000" required value={phone} onChange={(e) => setPhone(e.target.value)} aria-describedby="phone-hint"/><p id="phone-hint" className="mt-2 text-sm text-slate-500">{t('auth.phoneFormat')}</p></div>
            {registering && <div><label htmlFor="auth-email" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.email')}</label><input id="auth-email" className={fieldClass} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>}
            <button disabled={busy} className="min-h-14 w-full rounded-xl bg-blue-700 px-5 text-lg font-bold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:opacity-60">{busy ? t('auth.sending') : t(resetting ? 'auth.sendResetCode' : 'auth.sendCode')}</button>
            {!registering && !resetting && <Link to="/reset-password" className="flex min-h-12 items-center justify-center text-base font-semibold text-blue-700 underline underline-offset-4 dark:text-blue-300">{t('auth.forgotPassword')}</Link>}
          </form>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={verifyCode}>
            <p className="text-base text-slate-700 dark:text-slate-200">{t('auth.codeSentTo')} <strong dir="ltr">{deliveryDestination || email}</strong></p>
            <div><label htmlFor="auth-code" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.verificationCode')}</label><input id="auth-code" className={`${fieldClass} text-center tracking-[0.5em]`} type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} /></div>
            <button disabled={busy || code.length !== 6} className="min-h-14 w-full rounded-xl bg-blue-700 px-5 text-lg font-bold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:opacity-60">{busy ? t('auth.verifying') : t('auth.verifyAndContinue')}</button>
            <button type="button" className="min-h-12 w-full rounded-xl text-base font-semibold text-blue-700 underline underline-offset-4 dark:text-blue-300" onClick={() => { setStep('details'); setCode(''); }}>{t('auth.changeNumber')}</button>
          </form>
        )}
        <p className="mt-8 text-center text-base text-slate-600 dark:text-slate-300">{t(registering || resetting ? 'auth.haveAccount' : 'auth.noAccount')} <Link className="font-bold text-blue-700 underline underline-offset-4 dark:text-blue-300" to={registering || resetting ? '/sign-in' : '/sign-up'}>{t(registering || resetting ? 'auth.signIn' : 'auth.createAccount')}</Link></p>
      </section>
    </main>
  );
}

export const SignInPage = () => <PhoneAuthForm mode="login" />;
export const SignUpPage = () => <PhoneAuthForm mode="register" />;
export const ResetPasswordPage = () => <PhoneAuthForm mode="reset" />;
