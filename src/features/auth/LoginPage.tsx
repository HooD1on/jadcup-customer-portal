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
import { useLanguage, type PortalLanguage } from '../language/LanguageContext';

interface LoginErrors {
  userName?: string;
  password?: string;
  form?: string;
}

function validateLogin(userName: string, password: string, language: PortalLanguage): LoginErrors {
  const zh = language === 'zh';
  const errors: LoginErrors = {};
  if (!userName.trim()) errors.userName = zh ? '请输入用户名。' : 'Username is required.';
  else if (userName.trim().length > 50) errors.userName = zh ? '用户名不能超过50个字符。' : 'Username must not exceed 50 characters.';
  if (!password) errors.password = zh ? '请输入密码。' : 'Password is required.';
  else if (password.length > 128) errors.password = zh ? '密码不能超过128个字符。' : 'Password must not exceed 128 characters.';
  return errors;
}

const portalBenefits = [
  { icon: PackageCheck, title: 'Follow the account', titleZh: '查看客户业务', text: 'Keep orders, delivery activity and account information in one customer view.', textZh: '在一个客户视图中查看订单、配送和账户信息。' },
  { icon: FileClock, title: 'Check application status', titleZh: '查看申请状态', text: 'If access is still being reviewed, the same login shows the current decision.', textZh: '如果访问权限仍在审核中，可使用同一登录查看当前状态。' },
  { icon: ShieldCheck, title: 'Protected customer access', titleZh: '受保护的客户访问', text: 'Business information opens only after Jadcup approves and links the correct account.', textZh: '只有Jadcup批准并连接正确账户后，才会开放企业信息。' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { session, isInitializing, login } = useAuth();
  const { language, t } = useLanguage();
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

    const validationErrors = validateLogin(userName, password, language);
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
      setErrors({ form: error instanceof Error ? error.message : t('Unable to sign in. Please try again.', '无法登录，请重试。') });
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
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-lime-300"><BadgeCheck size={14} /> {t('For Jadcup customers', 'Jadcup客户入口')}</p>
            <h1 className="mt-7 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.045em] leading-[1.02]">{t('Welcome back to the working side of your packaging.', '欢迎回到您的包装业务工作区。')}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-jade-100/70">
              {t('The Customer Portal is where an existing Jadcup relationship becomes easier to follow—one login for your account activity and access status.', '客户门户让现有Jadcup合作关系更容易跟进，一个登录即可查看账户业务和访问状态。')}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {portalBenefits.map(({ icon: Icon, title, titleZh, text, textZh }) => (
                <div key={title} className="rounded-2xl border border-white/12 bg-white/7 p-5 backdrop-blur-sm">
                  <Icon className="text-lime-300" size={21} />
                  <h2 className="mt-5 text-sm font-semibold">{t(title, titleZh)}</h2>
                  <p className="mt-2 text-xs leading-relaxed text-jade-100/60">{t(text, textZh)}</p>
                </div>
              ))}
            </div>

            <div className="mt-9 border-t border-white/12 pt-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-jade-200/55">{t('Not sure which path is yours?', '不确定应该选择哪个入口？')}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link to="/apply" className="rounded-2xl bg-white p-4 text-jade-950 no-underline transition hover:bg-jade-50">
                  <span className="flex items-center gap-2 text-sm font-bold"><KeyRound size={16} />{t('Existing customer, no login', '已有客户，但没有登录账户')}</span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-stone-500">{t('Request access to an account your business already has.', '为企业已有的客户账户申请访问权限。')}</span>
                </Link>
                <a href="https://jadcup.co.nz/contact/" target="_blank" rel="noreferrer" className="rounded-2xl border border-white/18 p-4 text-white no-underline transition hover:bg-white/8">
                  <span className="flex items-center gap-2 text-sm font-bold"><Building2 size={16} />{t('New to Jadcup', '初次了解Jadcup')}</span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-jade-100/60">{t('Start with the packaging and sales team.', '从包装需求和销售团队开始。')}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center px-4 py-10 sm:px-8 lg:px-12 xl:px-20">
          <div className="mx-auto w-full max-w-lg lg:mr-auto">
            <div className="mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-jade-100 text-jade-800"><Lock size={22} /></div>
              <p className="section-kicker mt-6">{t('Customer sign in', '客户登录')}</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-gray-950">{t('Open your Jadcup account.', '进入您的Jadcup账户。')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-500">{t('Use the portal username created with your access request.', '请使用申请访问权限时创建的门户用户名。')}</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="space-y-5">
                <FormField id="login-username" label={t('Portal username', '门户用户名')} required autoComplete="username" maxLength={50} placeholder={t('Enter your username', '请输入用户名')} value={userName} onChange={(event) => { setUserName((event.target as HTMLInputElement).value); clearFieldError('userName'); }} error={errors.userName} />
                <FormField id="login-password" label={t('Password', '密码')} type={showPassword ? 'text' : 'password'} required autoComplete="current-password" maxLength={128} placeholder={t('Enter your password', '请输入密码')} value={password} onChange={(event) => { setPassword((event.target as HTMLInputElement).value); clearFieldError('password'); }} error={errors.password} suffix={(
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="rounded-lg p-2 text-stone-400 hover:text-stone-700" aria-label={showPassword ? t('Hide password', '隐藏密码') : t('Show password', '显示密码')}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                )} />

                <div className="flex items-center justify-between gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-stone-300 text-jade-700 focus:ring-jade-600" />
                    <span className="text-sm text-stone-600">{t('Keep me signed in', '保持登录')}</span>
                  </label>
                  <button type="button" onClick={() => setShowForgotMsg(true)} className="text-sm font-semibold text-jade-800 underline-offset-2 hover:underline">{t('Forgot password?', '忘记密码？')}</button>
                </div>
              </div>

              {errors.form && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3.5" role="alert"><p className="text-sm text-red-700">{errors.form}</p></div>}
              {showForgotMsg && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5" role="status"><p className="text-sm text-amber-900">{t('Online password reset is not available yet. Contact Jadcup on', '目前暂不支持在线重置密码，请致电')} <a href="tel:+6492823988" className="font-bold underline">09 282 3988</a> {t('for help.', '联系Jadcup获取帮助。')}</p></div>}

              <Button type="submit" size="lg" className="mt-6 w-full rounded-full! py-3.5!" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" />{t('Signing in...', '正在登录...')}</> : <>{t('Sign in', '登录')} <ArrowRight size={18} /></>}
              </Button>
            </form>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4">
              <ShieldCheck className="mt-0.5 shrink-0 text-jade-700" size={18} />
              <p className="text-xs leading-relaxed text-stone-500">{t('Applicants use this same sign-in to check whether access is Pending, Approved, Rejected or Disabled.', '申请人使用同一登录即可查看访问权限处于审核中、已批准、已拒绝或已停用状态。')}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
