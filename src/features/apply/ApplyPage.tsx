import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
  MessageSquareText,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/ui/FormField';
import { useLanguage, type PortalLanguage } from '../language/LanguageContext';
import { portalAccountApi } from '../../services/portalAccountApi';

interface ApplicationForm {
  userName: string;
  password: string;
  confirmPassword: string;
  registeredBusinessName: string;
  registeredContactName: string;
  email: string;
  phone: string;
  notes: string;
  consent: boolean;
}

type FieldErrors = Partial<Record<keyof ApplicationForm | 'form', string>>;

const initialForm: ApplicationForm = {
  userName: '',
  password: '',
  confirmPassword: '',
  registeredBusinessName: '',
  registeredContactName: '',
  email: '',
  phone: '',
  notes: '',
  consent: false,
};

const NOTES_MAX = 500;

function validate(form: ApplicationForm, language: PortalLanguage): FieldErrors {
  const errors: FieldErrors = {};
  const copy = (english: string, chinese: string) => language === 'zh' ? chinese : english;
  const userName = form.userName.trim();
  const businessName = form.registeredBusinessName.trim();
  const contactName = form.registeredContactName.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();

  if (!userName) errors.userName = copy('Username is required.', '请输入用户名。');
  else if (userName.length > 50) errors.userName = copy('Username must not exceed 50 characters.', '用户名不能超过 50 个字符。');

  if (!form.password) errors.password = copy('Password is required.', '请输入密码。');
  else if (form.password.length < 8) errors.password = copy('Password must contain at least 8 characters.', '密码至少需要 8 个字符。');
  else if (form.password.length > 128) errors.password = copy('Password must not exceed 128 characters.', '密码不能超过 128 个字符。');

  if (!form.confirmPassword) errors.confirmPassword = copy('Confirm your password.', '请再次输入密码。');
  else if (form.confirmPassword !== form.password) errors.confirmPassword = copy('Passwords do not match.', '两次输入的密码不一致。');

  if (!businessName) errors.registeredBusinessName = copy('Company or trading name is required.', '请输入公司或营业名称。');
  else if (businessName.length > 200) errors.registeredBusinessName = copy('Company name must not exceed 200 characters.', '公司名称不能超过 200 个字符。');

  if (!contactName) errors.registeredContactName = copy('Contact person is required.', '请输入联系人。');
  else if (contactName.length > 60) errors.registeredContactName = copy('Contact name must not exceed 60 characters.', '联系人姓名不能超过 60 个字符。');

  if (!email) errors.email = copy('Work email is required.', '请输入工作邮箱。');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = copy('Enter a valid email address.', '请输入有效的邮箱地址。');
  else if (email.length > 100) errors.email = copy('Email must not exceed 100 characters.', '邮箱不能超过 100 个字符。');

  if (phone.length > 255) errors.phone = copy('Phone number is too long.', '电话号码过长。');
  else if (phone && !/^[\d\s\-+()]{7,30}$/.test(phone)) errors.phone = copy('Enter a valid phone number.', '请输入有效的电话号码。');

  if (form.notes.length > NOTES_MAX) errors.notes = copy(`Notes must not exceed ${NOTES_MAX} characters.`, `备注不能超过 ${NOTES_MAX} 个字符。`);
  if (!form.consent) errors.consent = copy('You must agree before submitting.', '提交前请确认并同意。');
  return errors;
}

const fieldIds: Record<keyof ApplicationForm, string> = {
  userName: 'apply-username',
  password: 'apply-password',
  confirmPassword: 'apply-confirm-password',
  registeredBusinessName: 'apply-company',
  registeredContactName: 'apply-contact',
  email: 'apply-email',
  phone: 'apply-phone',
  notes: 'apply-notes',
  consent: 'apply-consent',
};

const reviewSteps = [
  ['Application sent', 'Your portal login is created in a pending state.', '申请已提交', '您的门户账号已创建，目前处于待审核状态。'],
  ['Jadcup confirms the business', 'Our staff match your request to the correct customer account.', 'Jadcup 核实企业信息', '我们的团队会将您的申请匹配到正确的客户账户。'],
  ['Portal access opens', 'Once approved, the same login takes you into your customer dashboard.', '客户门户开通', '审核通过后，使用同一账号即可进入客户工作台。'],
];

export function ApplyPage() {
  const { language, t } = useLanguage();
  const [form, setForm] = useState<ApplicationForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedUserName, setSubmittedUserName] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);

  const updateField = useCallback(<K extends keyof ApplicationForm>(field: K, value: ApplicationForm[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined, form: undefined }));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate(form, language);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const fieldOrder: (keyof ApplicationForm)[] = [
        'userName', 'password', 'confirmPassword', 'registeredBusinessName',
        'registeredContactName', 'email', 'phone', 'notes', 'consent',
      ];
      const firstInvalidField = fieldOrder.find((field) => validationErrors[field]);
      if (firstInvalidField) document.getElementById(fieldIds[firstInvalidField])?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await portalAccountApi.register({
        userName: form.userName.trim(),
        password: form.password,
        registeredBusinessName: form.registeredBusinessName.trim(),
        registeredContactName: form.registeredContactName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        notes: form.notes.trim() || undefined,
      });
      setSubmittedUserName(form.userName.trim());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : t('Unable to submit your application. Please try again.', '申请暂时无法提交，请稍后重试。') });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedUserName) {
    return (
      <main className="flex-1 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18">
          <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm" role="status">
            <div className="bg-jade-950 px-7 py-9 text-center text-white sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-300 text-jade-950">
                <CheckCircle2 size={32} />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-lime-300">{t('Application received', '申请已收到')}</p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">{t('Your portal request is now with Jadcup.', '您的门户申请已交由 Jadcup 审核。')}</h1>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-jade-100/75">
                {t('You can sign in immediately to follow the review. Customer account information stays protected until our team confirms the correct business record.', '您现在即可登录查看审核进度。在团队确认正确的企业账户前，客户资料将保持受保护状态。')}
              </p>
            </div>
            <div className="p-7 sm:p-10">
              <div className="rounded-2xl bg-stone-50 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">{t('Your portal username', '您的门户用户名')}</p>
                <p className="mt-2 text-xl font-semibold text-gray-950">{submittedUserName}</p>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {reviewSteps.map(([title, description, titleZh, descriptionZh], index) => (
                  <div key={title}>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-jade-800 text-white' : 'bg-jade-100 text-jade-800'}`}>{index + 1}</span>
                    <h2 className="mt-3 text-sm font-semibold text-gray-950">{t(title, titleZh)}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{t(description, descriptionZh)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/login" className="no-underline"><Button size="lg" className="w-full sm:w-auto"><LogIn size={17} />{t('Sign in to check status', '登录查看审核状态')}</Button></Link>
                <Link to="/" className="no-underline"><Button variant="outline" size="lg" className="w-full sm:w-auto">{t('Return home', '返回首页')}</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const passwordToggle = (
    <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="rounded-lg p-2 text-stone-400 hover:text-stone-700" aria-label={showPassword ? t('Hide passwords', '隐藏密码') : t('Show passwords', '显示密码')}>
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <main className="flex-1 bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl">
            <p className="section-kicker">{t('Existing Jadcup customers', 'Jadcup 现有客户')}</p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] leading-[1.03] text-gray-950">{t('Request access to the account you already have.', '申请访问您已有的客户账户。')}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              {t('This form creates your Customer Portal login. It does not open a new trade account or start a new packaging enquiry.', '此表单用于创建客户门户登录账号，不会新开贸易账户，也不会发起新的包装咨询。')}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12 items-start">
          <aside className="lg:sticky lg:top-28 space-y-5">
            <div className="rounded-[1.75rem] bg-jade-950 p-7 text-white sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-300 text-jade-950"><BadgeCheck size={21} /></div>
              <h2 className="mt-6 text-2xl font-semibold tracking-tight">{t('Is this the right form?', '这个表单适合您吗？')}</h2>
              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <Check className="mt-0.5 shrink-0 text-lime-300" size={18} />
                  <div><p className="text-sm font-semibold">{t('Yes—if your business already buys from Jadcup', '适合——您的企业已经向 Jadcup 采购')}</p><p className="mt-1 text-xs leading-relaxed text-jade-100/65">{t('Use the company and contact details our team already knows.', '请填写我们团队已有记录的公司与联系人信息。')}</p></div>
                </div>
                <div className="flex gap-3">
                  <Check className="mt-0.5 shrink-0 text-lime-300" size={18} />
                  <div><p className="text-sm font-semibold">{t('Yes—if you need an individual portal login', '适合——您需要一个独立的门户登录账号')}</p><p className="mt-1 text-xs leading-relaxed text-jade-100/65">{t('Jadcup staff will connect it to the correct customer record after review.', '审核后，Jadcup 团队会将其关联到正确的客户档案。')}</p></div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-stone-200 bg-white p-7 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">{t('New to Jadcup?', '第一次接触 Jadcup？')}</p>
              <h2 className="mt-3 text-xl font-semibold text-gray-950">{t('Start with the packaging team.', '先与包装顾问沟通。')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{t('Tell us about the product, volume and brand. We will help you find the right packaging route before any portal access is needed.', '告诉我们您的产品、用量和品牌需求。无需先开通门户，我们会先帮您找到合适的包装方案。')}</p>
              <a href="https://jadcup.co.nz/contact/" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-jade-800 hover:text-jade-950">{t('Start a sales enquiry', '开始销售咨询')} <ArrowRight size={15} /></a>
            </div>

            <div className="flex items-start gap-3 px-2 text-sm text-stone-500">
              <ShieldCheck className="mt-0.5 shrink-0 text-jade-700" size={18} />
              <p>{t('Your request stays pending until Jadcup verifies the business. No customer data is available before approval.', '在 Jadcup 完成企业核实前，申请将保持待审核状态；审核通过前不会显示任何客户资料。')}</p>
            </div>
          </aside>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-jade-100 text-jade-800"><KeyRound size={19} /></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{t('Step 1', '第 1 步')}</p><h2 className="text-xl font-semibold text-gray-950">{t('Create your portal sign-in', '创建门户登录账号')}</h2></div>
              </div>
              <div className="space-y-5">
                <FormField id="apply-username" label={t('Portal username', '门户用户名')} required autoComplete="username" maxLength={50} placeholder={t('Choose a username', '设置一个用户名')} hint={t('You will use this to sign in and check the review status.', '您将使用此用户名登录并查看审核进度。')} value={form.userName} onChange={(event) => updateField('userName', (event.target as HTMLInputElement).value)} error={errors.userName} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField id="apply-password" label={t('Password', '密码')} type={showPassword ? 'text' : 'password'} required autoComplete="new-password" maxLength={128} hint={t('Use at least 8 characters.', '至少使用 8 个字符。')} value={form.password} onChange={(event) => updateField('password', (event.target as HTMLInputElement).value)} error={errors.password} suffix={passwordToggle} />
                  <FormField id="apply-confirm-password" label={t('Confirm password', '确认密码')} type={showPassword ? 'text' : 'password'} required autoComplete="new-password" maxLength={128} value={form.confirmPassword} onChange={(event) => updateField('confirmPassword', (event.target as HTMLInputElement).value)} error={errors.confirmPassword} />
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-jade-100 text-jade-800"><Building2 size={19} /></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{t('Step 2', '第 2 步')}</p><h2 className="text-xl font-semibold text-gray-950">{t('Identify your Jadcup account', '确认您的 Jadcup 客户账户')}</h2></div>
              </div>
              <div className="space-y-5">
                <FormField id="apply-company" label={t('Company or trading name', '公司或营业名称')} required autoComplete="organization" maxLength={200} placeholder={t('Use the name shown on your Jadcup account', '请填写 Jadcup 账户中登记的名称')} hint={t('You do not need to know your Customer ID or customer code.', '无需填写客户 ID 或客户代码。')} value={form.registeredBusinessName} onChange={(event) => updateField('registeredBusinessName', (event.target as HTMLInputElement).value)} error={errors.registeredBusinessName} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField id="apply-contact" label={t('Contact person', '联系人')} required autoComplete="name" maxLength={60} placeholder={t('Your full name', '您的姓名')} value={form.registeredContactName} onChange={(event) => updateField('registeredContactName', (event.target as HTMLInputElement).value)} error={errors.registeredContactName} />
                  <FormField id="apply-email" label={t('Work email', '工作邮箱')} type="email" required autoComplete="email" maxLength={100} placeholder="you@company.co.nz" value={form.email} onChange={(event) => updateField('email', (event.target as HTMLInputElement).value)} error={errors.email} />
                </div>
                <FormField id="apply-phone" label={t('Phone', '联系电话')} type="tel" autoComplete="tel" placeholder="09 282 3988" value={form.phone} onChange={(event) => updateField('phone', (event.target as HTMLInputElement).value)} error={errors.phone} />
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-jade-100 text-jade-800"><MessageSquareText size={19} /></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{t('Step 3', '第 3 步')}</p><h2 className="text-xl font-semibold text-gray-950">{t('Help the team verify your request', '帮助团队核实您的申请')}</h2></div>
              </div>
              <FormField as="textarea" id="apply-notes" label={t('Notes for Jadcup staff', '给 Jadcup 团队的备注')} rows={4} maxLength={NOTES_MAX} placeholder={t('Optional: your account manager, recent order reference, branch or anything that helps us identify the account...', '选填：客户经理、近期订单号、分店或任何有助于我们确认账户的信息……')} value={form.notes} onChange={(event) => updateField('notes', (event.target as HTMLTextAreaElement).value)} error={errors.notes} />
              <p className="mt-1 text-right text-xs text-stone-400">{form.notes.length}/{NOTES_MAX}</p>
              <div className="mt-5 rounded-2xl bg-stone-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input id="apply-consent" type="checkbox" checked={form.consent} onChange={(event) => updateField('consent', event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-stone-300 text-jade-700 focus:ring-jade-600" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'apply-consent-error' : undefined} />
                  <span className="text-sm leading-relaxed text-stone-600">{t('I confirm that I represent this business and that Jadcup may contact me to verify the portal request.', '我确认本人代表该企业，并同意 Jadcup 与我联系以核实门户申请。')}</span>
                </label>
                {errors.consent && <p id="apply-consent-error" className="ml-7 mt-1.5 text-xs text-red-600" role="alert">{errors.consent}</p>}
              </div>
            </section>

            {errors.form && <div className="rounded-xl border border-red-200 bg-red-50 p-4" role="alert"><p className="text-sm text-red-700">{errors.form}</p></div>}

            <Button type="submit" size="lg" className="w-full rounded-full! py-3.5!" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" />{t('Submitting request...', '正在提交申请……')}</> : <>{t('Request portal access', '申请门户访问权限')} <ArrowRight size={18} /></>}
            </Button>
            <p className="text-center text-xs leading-relaxed text-stone-400">{t('Submitting creates a pending login. Jadcup staff must approve and connect it before customer information becomes available.', '提交后会创建一个待审核账号；Jadcup 团队批准并关联客户账户后，您才能查看客户资料。')}</p>
          </form>
        </div>
      </div>

      <section className="border-t border-stone-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><UserRound className="text-jade-700" size={21} /><div><p className="text-sm font-semibold text-gray-950">{t('Already requested access?', '已经提交过申请？')}</p><p className="text-xs text-stone-500">{t('Sign in to see whether the request is pending, approved or rejected.', '登录即可查看申请是待审核、已通过还是未通过。')}</p></div></div>
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-jade-800">{t('Customer sign in', '客户登录')} <ArrowRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}
