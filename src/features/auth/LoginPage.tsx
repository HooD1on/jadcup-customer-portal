import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Eye,
  EyeOff,
  FileClock,
  KeyRound,
  Loader2,
  Lock,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/ui/FormField';
import { useAuth } from './AuthContext';

interface LoginErrors {
  userName?: string;
  password?: string;
  form?: string;
}

function validateLogin(userName: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  if (!userName.trim()) errors.userName = 'Username is required.';
  else if (userName.trim().length > 50) errors.userName = 'Username must not exceed 50 characters.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length > 128) errors.password = 'Password must not exceed 128 characters.';
  return errors;
}

const portalBenefits = [
  { icon: PackageCheck, title: 'Follow the account', text: 'Keep orders, delivery activity and account information in one customer view.' },
  { icon: FileClock, title: 'Check application status', text: 'If access is still being reviewed, the same login shows the current decision.' },
  { icon: ShieldCheck, title: 'Protected customer access', text: 'Business information opens only after Jadcup approves and links the correct account.' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { session, isInitializing, login } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  useEffect(() => {
    if (isInitializing || !session) return;
    navigate(session.accountStatus === 'Approved' ? '/dashboard' : '/application-status', { replace: true });
  }, [isInitializing, navigate, session]);

  const clearFieldError = useCallback((field: keyof LoginErrors) => {
    setErrors((previous) => {
      if (!previous[field] && !previous.form) return previous;
      return { ...previous, [field]: undefined, form: undefined };
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowForgotMsg(false);

    const validationErrors = validateLogin(userName, password);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      document.getElementById(validationErrors.userName ? 'login-username' : 'login-password')?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const accountStatus = await login(userName.trim(), password, rememberMe);
      navigate(accountStatus === 'Approved' ? '/dashboard' : '/application-status', { replace: true });
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Unable to sign in. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-stone-50">
      <div className="grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden bg-jade-950 px-4 py-12 text-white sm:px-8 lg:px-12 lg:py-16 xl:px-20">
          <div className="absolute inset-0 portal-hero-texture" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl lg:ml-auto">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-lime-300"><BadgeCheck size={14} /> For Jadcup customers</p>
            <h1 className="mt-7 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.045em] leading-[1.02]">Welcome back to the working side of your packaging.</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-jade-100/70">
              The Customer Portal is where an existing Jadcup relationship becomes easier to follow—one login for your account activity and access status.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {portalBenefits.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/12 bg-white/7 p-5 backdrop-blur-sm">
                  <Icon className="text-lime-300" size={21} />
                  <h2 className="mt-5 text-sm font-semibold">{title}</h2>
                  <p className="mt-2 text-xs leading-relaxed text-jade-100/60">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-9 border-t border-white/12 pt-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-jade-200/55">Not sure which path is yours?</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link to="/apply" className="rounded-2xl bg-white p-4 text-jade-950 no-underline transition hover:bg-jade-50">
                  <span className="flex items-center gap-2 text-sm font-bold"><KeyRound size={16} />Existing customer, no login</span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-stone-500">Request access to an account your business already has.</span>
                </Link>
                <a href="https://jadcup.co.nz/contact/" target="_blank" rel="noreferrer" className="rounded-2xl border border-white/18 p-4 text-white no-underline transition hover:bg-white/8">
                  <span className="flex items-center gap-2 text-sm font-bold"><Building2 size={16} />New to Jadcup</span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-jade-100/60">Start with the packaging and sales team.</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center px-4 py-10 sm:px-8 lg:px-12 xl:px-20">
          <div className="mx-auto w-full max-w-lg lg:mr-auto">
            <div className="mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-jade-100 text-jade-800"><Lock size={22} /></div>
              <p className="section-kicker mt-6">Customer sign in</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-gray-950">Open your Jadcup account.</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-500">Use the portal username created with your access request.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="space-y-5">
                <FormField id="login-username" label="Portal username" required autoComplete="username" maxLength={50} placeholder="Enter your username" value={userName} onChange={(event) => { setUserName((event.target as HTMLInputElement).value); clearFieldError('userName'); }} error={errors.userName} />
                <FormField id="login-password" label="Password" type={showPassword ? 'text' : 'password'} required autoComplete="current-password" maxLength={128} placeholder="Enter your password" value={password} onChange={(event) => { setPassword((event.target as HTMLInputElement).value); clearFieldError('password'); }} error={errors.password} suffix={(
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="rounded-lg p-2 text-stone-400 hover:text-stone-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                )} />

                <div className="flex items-center justify-between gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-stone-300 text-jade-700 focus:ring-jade-600" />
                    <span className="text-sm text-stone-600">Keep me signed in</span>
                  </label>
                  <button type="button" onClick={() => setShowForgotMsg(true)} className="text-sm font-semibold text-jade-800 underline-offset-2 hover:underline">Forgot password?</button>
                </div>
              </div>

              {errors.form && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3.5" role="alert"><p className="text-sm text-red-700">{errors.form}</p></div>}
              {showForgotMsg && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5" role="status"><p className="text-sm text-amber-900">Password reset is not available online yet. Contact Jadcup on <a href="tel:+6492823988" className="font-bold underline">09 282 3988</a> for help.</p></div>}

              <Button type="submit" size="lg" className="mt-6 w-full rounded-full! py-3.5!" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" />Signing in...</> : <>Sign in <ArrowRight size={18} /></>}
              </Button>
            </form>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4">
              <ShieldCheck className="mt-0.5 shrink-0 text-jade-700" size={18} />
              <p className="text-xs leading-relaxed text-stone-500">Applicants use this same sign-in to check whether access is Pending, Approved, Rejected or Disabled.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
