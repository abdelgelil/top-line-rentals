import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ArrowLeft, Check, ChevronDown } from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import { LanguageToggle } from '../../components/common/LanguageToggle';
import { COUNTRY_CODES } from '../../constants/countryCodes';

const fieldClass = 'mt-2 min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-800 dark:focus:ring-blue-900/60';

function AuthShell({ title, hint, children, footer }) {
  const { t } = useTranslation();
  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50/60 px-4 py-8 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/30 sm:px-6 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-700/10" />
      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-bold uppercase tracking-[0.12em] text-slate-800 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 dark:text-slate-100 dark:hover:bg-slate-800" aria-label="Back to home">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" /><span>{t('Back', 'Back')}</span>
        </Link>
        <LanguageToggle />
      </div>
      <div className="relative flex flex-1 items-center justify-center py-8 sm:py-10">
        <section className="w-full max-w-xl rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.25)] backdrop-blur sm:rounded-[2.5rem] sm:p-10 lg:p-12 dark:border-slate-800 dark:bg-slate-900/95" aria-labelledby="auth-title">
          <div className="mb-7 flex justify-center"><Logo /></div>
          <h1 id="auth-title" className="text-center text-3xl font-black uppercase tracking-tight text-slate-900 sm:text-4xl dark:text-white">{title}</h1>
          <p className="mx-auto mt-3 max-w-md text-center text-base leading-7 text-slate-600 dark:text-slate-300">{hint}</p>
          {children}
          {footer && <p className="mt-7 text-center text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">{footer}</p>}
        </section>
      </div>
    </main>
  );
}

function PasswordAuthForm({ registering }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [countryIso, setCountryIso] = useState('EG');
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const selectedCountry = COUNTRY_CODES.find(({ iso }) => iso === countryIso) || COUNTRY_CODES[0];

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const endpoint = registering ? '/auth/register' : '/auth/login';
      // Egyptian mobile numbers are entered in their familiar 11-digit local form (01...).
      // Strip the trunk zero when composing the international number sent to the API.
      const localPhone = countryIso === 'EG' ? phone.replace(/^0/, '') : phone;
      const fullPhone = `${selectedCountry.code}${localPhone}`;
      const body = registering ? { username, phone: fullPhone, password, ...(email.trim() ? { email: email.trim() } : {}) } : { phone: fullPhone, password };
      const { data } = await API.post(endpoint, body, { skipAuth: true });
      setAuthenticatedUser(data);
      toast.success(t('auth.welcome'));
      navigate(data.user.role === 'admin' ? '/admin/analytics' : '/apartments', { replace: true });
    } catch (error) { toast.error(error.response?.data?.message || t('auth.signInFailed')); }
    finally { setBusy(false); }
  };

  return <AuthShell title={t(registering ? 'auth.createAccount' : 'auth.signIn')} hint={t(registering ? 'auth.signupHint' : 'auth.loginHint')} footer={<>{t(registering ? 'auth.haveAccount' : 'auth.noAccount')} <Link className="font-bold text-blue-700 underline underline-offset-4 dark:text-blue-300" to={registering ? '/sign-in' : '/sign-up'}>{t(registering ? 'auth.signIn' : 'auth.createAccount')}</Link></>}>
    <form className="mt-8 space-y-5" onSubmit={submit}>
      {registering && <div><label htmlFor="auth-username" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.username')}</label><input id="auth-username" className={fieldClass} autoComplete="username" required maxLength={100} value={username} onChange={(e) => setUsername(e.target.value)} /></div>}
      <div>
        <label htmlFor="auth-phone" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.phone')}</label>
        <div className="mt-2 flex gap-2">
          <div className="relative w-[46%] shrink-0 sm:w-[50%]">
            <button
              type="button"
              aria-label={t('auth.countryCode', 'Country code')}
              aria-haspopup="listbox"
              aria-expanded={countryMenuOpen}
              className="flex min-h-14 w-full items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-left text-sm text-slate-800 shadow-sm outline-none transition hover:border-blue-200 hover:bg-white focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100 sm:gap-3 sm:px-4 sm:text-base dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-900/60"
              onClick={() => setCountryMenuOpen((open) => !open)}
              onKeyDown={(event) => { if (event.key === 'Escape') setCountryMenuOpen(false); }}
            >
              <span aria-hidden="true" className="flex h-8 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-gradient-to-br from-white to-blue-50 text-[10px] font-black tracking-wide text-blue-800 shadow-sm dark:border-slate-600 dark:from-slate-700 dark:to-slate-800 dark:text-blue-200">{selectedCountry.iso}</span>
              <span className="min-w-0 flex-1 truncate font-semibold">{selectedCountry.country}</span>
              <span className="shrink-0 text-xs font-bold text-slate-500 sm:text-sm dark:text-slate-400">{selectedCountry.code}</span>
              <ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${countryMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {countryMenuOpen && <div role="listbox" aria-label={t('auth.countryCode', 'Country code')} className="absolute left-0 top-[calc(100%+0.5rem)] z-30 max-h-72 w-[min(22rem,calc(100vw-3rem))] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-[0_20px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl ring-1 ring-slate-900/5 dark:border-slate-700 dark:bg-slate-900/95 dark:ring-white/10">
              {COUNTRY_CODES.map((country) => {
                const active = country.iso === countryIso;
                return <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  key={country.iso}
                  className={`group flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${active ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/60 dark:text-blue-100' : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'}`}
                  onClick={() => { setCountryIso(country.iso); setPhone(''); setCountryMenuOpen(false); }}
                >
                  <span aria-hidden="true" className={`flex h-9 w-10 shrink-0 items-center justify-center rounded-xl border text-[10px] font-black tracking-wide shadow-sm ${active ? 'border-blue-200 bg-white text-blue-800 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-200' : 'border-slate-200 bg-gradient-to-br from-white to-slate-50 text-slate-600 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-slate-300'}`}>{country.iso}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">{country.country}</span>
                  <span className="text-sm font-bold tabular-nums text-slate-500 dark:text-slate-400">{country.code}</span>
                  {active && <Check aria-hidden="true" className="h-4 w-4 text-blue-600 dark:text-blue-300" />}
                </button>;
              })}
            </div>}
          </div>
          <input
            id="auth-phone"
            className={fieldClass.replace('mt-2 ', '')}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder={countryIso === 'EG' ? '01000000000' : 'Phone number'}
            required
            maxLength={countryIso === 'EG' ? 11 : 14}
            pattern={countryIso === 'EG' ? '[0-9]{11}' : '[0-9]{4,14}'}
            title={countryIso === 'EG' ? 'Enter an 11-digit Egyptian phone number' : 'Enter 4 to 14 digits'}
            value={phone}
            onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, countryIso === 'EG' ? 11 : 14))}
          />
        </div>
        <p className="mt-2 text-sm text-slate-500">{countryIso === 'EG' ? 'Enter 11 digits, including the leading 0 (for example, 01000000000).' : `Enter the phone number for ${COUNTRY_CODES.find(({ iso }) => iso === countryIso)?.country}; the country code is added automatically.`}</p>
      </div>
      {registering && <div><label htmlFor="auth-email" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.emailOptional')}</label><input id="auth-email" className={fieldClass} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>}
      <div><label htmlFor="auth-password" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.password')}</label><input id="auth-password" className={fieldClass} type="password" autoComplete={registering ? 'new-password' : 'current-password'} minLength={8} maxLength={128} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      {!registering && <div className="flex justify-end"><Link to="/reset-password" className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 dark:text-blue-300 dark:hover:bg-blue-950/50">{t('auth.forgotPassword')}</Link></div>}
      <button disabled={busy} className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-5 text-base font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:translate-y-0 disabled:opacity-60">{busy ? t('auth.pleaseWait') : t(registering ? 'auth.createAccount' : 'auth.signIn')}</button>
    </form>
  </AuthShell>;
}

export function SignInPage() { return <PasswordAuthForm registering={false} />; }
export function SignUpPage() { return <PasswordAuthForm registering />; }

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const sendCode = async (event) => {
    event.preventDefault(); setBusy(true);
    try { await API.post('/auth/forgot-password', { identifier, targetEmail }, { skipAuth: true }); setStep('reset'); toast.success(t('auth.resetCodeSent')); }
    catch (error) { toast.error(error.response?.data?.message || t('auth.sendFailed')); }
    finally { setBusy(false); }
  };
  const resetPassword = async (event) => {
    event.preventDefault(); setBusy(true);
    try { await API.post('/auth/reset-password', { identifier, otp, newPassword }, { skipAuth: true }); toast.success(t('auth.passwordReset')); window.location.assign('/sign-in'); }
    catch (error) { toast.error(error.response?.data?.message || t('auth.resetFailed')); }
    finally { setBusy(false); }
  };
  return <AuthShell title={t('auth.resetPassword')} hint={t(step === 'email' ? 'auth.resetEmailHint' : 'auth.resetCodeHint')} footer={<>{t('auth.haveAccount')} <Link className="font-bold text-blue-700 underline underline-offset-4 dark:text-blue-300" to="/sign-in">{t('auth.signIn')}</Link></>}>
    {step === 'email' ? <form className="mt-8 space-y-5" onSubmit={sendCode}><div><label htmlFor="reset-identifier" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.accountIdentifier')}</label><input id="reset-identifier" className={fieldClass} autoComplete="username" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} /></div><div><label htmlFor="reset-target-email" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.targetEmail')}</label><input id="reset-target-email" className={fieldClass} type="email" autoComplete="email" required value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)} /></div><button disabled={busy} className="min-h-14 w-full rounded-xl bg-blue-700 px-5 text-lg font-bold text-white disabled:opacity-60">{busy ? t('auth.pleaseWait') : t('auth.sendCode')}</button></form>
      : <form className="mt-8 space-y-5" onSubmit={resetPassword}><div><label htmlFor="reset-code" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.verificationCode')}</label><input id="reset-code" className={`${fieldClass} text-center tracking-[0.5em]`} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} /></div><div><label htmlFor="new-password" className="text-base font-semibold text-slate-800 dark:text-slate-200">{t('auth.newPassword')}</label><input id="new-password" className={fieldClass} type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div><button disabled={busy || otp.length !== 6} className="min-h-14 w-full rounded-xl bg-blue-700 px-5 text-lg font-bold text-white disabled:opacity-60">{busy ? t('auth.pleaseWait') : t('auth.resetPassword')}</button></form>}
  </AuthShell>;
}
