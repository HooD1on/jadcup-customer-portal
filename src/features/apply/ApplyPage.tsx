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

function validate(form: ApplicationForm): FieldErrors {
  const errors: FieldErrors = {};
  const userName = form.userName.trim();
  const businessName = form.registeredBusinessName.trim();
  const contactName = form.registeredContactName.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();

  if (!userName) errors.userName = 'Username is required.';
  else if (userName.length > 50) errors.userName = 'Username must not exceed 50 characters.';

  if (!form.password) errors.password = 'Password is required.';
  else if (form.password.length < 8) errors.password = 'Password must contain at least 8 characters.';
  else if (form.password.length > 128) errors.password = 'Password must not exceed 128 characters.';

  if (!form.confirmPassword) errors.confirmPassword = 'Confirm your password.';
  else if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.';

  if (!businessName) errors.registeredBusinessName = 'Company or trading name is required.';
  else if (businessName.length > 200) errors.registeredBusinessName = 'Company name must not exceed 200 characters.';

  if (!contactName) errors.registeredContactName = 'Contact person is required.';
  else if (contactName.length > 60) errors.registeredContactName = 'Contact name must not exceed 60 characters.';

  if (!email) errors.email = 'Work email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  else if (email.length > 100) errors.email = 'Email must not exceed 100 characters.';

  if (phone.length > 255) errors.phone = 'Phone number is too long.';
  else if (phone && !/^[\d\s\-+()]{7,30}$/.test(phone)) errors.phone = 'Enter a valid phone number.';

  if (form.notes.length > NOTES_MAX) errors.notes = `Notes must not exceed ${NOTES_MAX} characters.`;
  if (!form.consent) errors.consent = 'You must agree before submitting.';
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
  ['Application sent', 'Your portal login is created in a pending state.'],
  ['Jadcup confirms the business', 'Our staff match your request to the correct customer account.'],
  ['Portal access opens', 'Once approved, the same login takes you into your customer dashboard.'],
];

export function ApplyPage() {
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
    const validationErrors = validate(form);
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
      setErrors({ form: error instanceof Error ? error.message : 'Unable to submit your application. Please try again.' });
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
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-lime-300">Application received</p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">Your portal request is now with Jadcup.</h1>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-jade-100/75">
                You can sign in immediately to follow the review. Customer account information stays protected until our team confirms the correct business record.
              </p>
            </div>
            <div className="p-7 sm:p-10">
              <div className="rounded-2xl bg-stone-50 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">Your portal username</p>
                <p className="mt-2 text-xl font-semibold text-gray-950">{submittedUserName}</p>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {reviewSteps.map(([title, description], index) => (
                  <div key={title}>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-jade-800 text-white' : 'bg-jade-100 text-jade-800'}`}>{index + 1}</span>
                    <h2 className="mt-3 text-sm font-semibold text-gray-950">{title}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/login" className="no-underline"><Button size="lg" className="w-full sm:w-auto"><LogIn size={17} />Sign in to check status</Button></Link>
                <Link to="/" className="no-underline"><Button variant="outline" size="lg" className="w-full sm:w-auto">Return home</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const passwordToggle = (
    <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="rounded-lg p-2 text-stone-400 hover:text-stone-700" aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}>
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <main className="flex-1 bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl">
            <p className="section-kicker">Existing Jadcup customers</p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] leading-[1.03] text-gray-950">Request access to the account you already have.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              This form creates your Customer Portal login. It does not open a new trade account or start a new packaging enquiry.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12 items-start">
          <aside className="lg:sticky lg:top-28 space-y-5">
            <div className="rounded-[1.75rem] bg-jade-950 p-7 text-white sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-300 text-jade-950"><BadgeCheck size={21} /></div>
              <h2 className="mt-6 text-2xl font-semibold tracking-tight">Is this the right form?</h2>
              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <Check className="mt-0.5 shrink-0 text-lime-300" size={18} />
                  <div><p className="text-sm font-semibold">Yes—if your business already buys from Jadcup</p><p className="mt-1 text-xs leading-relaxed text-jade-100/65">Use the company and contact details our team already knows.</p></div>
                </div>
                <div className="flex gap-3">
                  <Check className="mt-0.5 shrink-0 text-lime-300" size={18} />
                  <div><p className="text-sm font-semibold">Yes—if you need an individual portal login</p><p className="mt-1 text-xs leading-relaxed text-jade-100/65">Jadcup staff will connect it to the correct customer record after review.</p></div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-stone-200 bg-white p-7 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">New to Jadcup?</p>
              <h2 className="mt-3 text-xl font-semibold text-gray-950">Start with the packaging team.</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">Tell us about the product, volume and brand. We will help you find the right packaging route before any portal access is needed.</p>
              <a href="https://jadcup.co.nz/contact/" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-jade-800 hover:text-jade-950">Start a sales enquiry <ArrowRight size={15} /></a>
            </div>

            <div className="flex items-start gap-3 px-2 text-sm text-stone-500">
              <ShieldCheck className="mt-0.5 shrink-0 text-jade-700" size={18} />
              <p>Your request stays pending until Jadcup verifies the business. No customer data is available before approval.</p>
            </div>
          </aside>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-jade-100 text-jade-800"><KeyRound size={19} /></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">Step 1</p><h2 className="text-xl font-semibold text-gray-950">Create your portal sign-in</h2></div>
              </div>
              <div className="space-y-5">
                <FormField id="apply-username" label="Portal username" required autoComplete="username" maxLength={50} placeholder="Choose a username" hint="You will use this to sign in and check the review status." value={form.userName} onChange={(event) => updateField('userName', (event.target as HTMLInputElement).value)} error={errors.userName} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField id="apply-password" label="Password" type={showPassword ? 'text' : 'password'} required autoComplete="new-password" maxLength={128} hint="Use at least 8 characters." value={form.password} onChange={(event) => updateField('password', (event.target as HTMLInputElement).value)} error={errors.password} suffix={passwordToggle} />
                  <FormField id="apply-confirm-password" label="Confirm password" type={showPassword ? 'text' : 'password'} required autoComplete="new-password" maxLength={128} value={form.confirmPassword} onChange={(event) => updateField('confirmPassword', (event.target as HTMLInputElement).value)} error={errors.confirmPassword} />
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-jade-100 text-jade-800"><Building2 size={19} /></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">Step 2</p><h2 className="text-xl font-semibold text-gray-950">Identify your Jadcup account</h2></div>
              </div>
              <div className="space-y-5">
                <FormField id="apply-company" label="Company or trading name" required autoComplete="organization" maxLength={200} placeholder="Use the name shown on your Jadcup account" hint="You do not need to know your Customer ID or customer code." value={form.registeredBusinessName} onChange={(event) => updateField('registeredBusinessName', (event.target as HTMLInputElement).value)} error={errors.registeredBusinessName} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField id="apply-contact" label="Contact person" required autoComplete="name" maxLength={60} placeholder="Your full name" value={form.registeredContactName} onChange={(event) => updateField('registeredContactName', (event.target as HTMLInputElement).value)} error={errors.registeredContactName} />
                  <FormField id="apply-email" label="Work email" type="email" required autoComplete="email" maxLength={100} placeholder="you@company.co.nz" value={form.email} onChange={(event) => updateField('email', (event.target as HTMLInputElement).value)} error={errors.email} />
                </div>
                <FormField id="apply-phone" label="Phone" type="tel" autoComplete="tel" placeholder="09 282 3988" value={form.phone} onChange={(event) => updateField('phone', (event.target as HTMLInputElement).value)} error={errors.phone} />
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-jade-100 text-jade-800"><MessageSquareText size={19} /></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">Step 3</p><h2 className="text-xl font-semibold text-gray-950">Help the team verify your request</h2></div>
              </div>
              <FormField as="textarea" id="apply-notes" label="Notes for Jadcup staff" rows={4} maxLength={NOTES_MAX} placeholder="Optional: your account manager, recent order reference, branch or anything that helps us identify the account..." value={form.notes} onChange={(event) => updateField('notes', (event.target as HTMLTextAreaElement).value)} error={errors.notes} />
              <p className="mt-1 text-right text-xs text-stone-400">{form.notes.length}/{NOTES_MAX}</p>
              <div className="mt-5 rounded-2xl bg-stone-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input id="apply-consent" type="checkbox" checked={form.consent} onChange={(event) => updateField('consent', event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-stone-300 text-jade-700 focus:ring-jade-600" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'apply-consent-error' : undefined} />
                  <span className="text-sm leading-relaxed text-stone-600">I confirm that I represent this business and that Jadcup may contact me to verify the portal request.</span>
                </label>
                {errors.consent && <p id="apply-consent-error" className="ml-7 mt-1.5 text-xs text-red-600" role="alert">{errors.consent}</p>}
              </div>
            </section>

            {errors.form && <div className="rounded-xl border border-red-200 bg-red-50 p-4" role="alert"><p className="text-sm text-red-700">{errors.form}</p></div>}

            <Button type="submit" size="lg" className="w-full rounded-full! py-3.5!" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" />Submitting request...</> : <>Request portal access <ArrowRight size={18} /></>}
            </Button>
            <p className="text-center text-xs leading-relaxed text-stone-400">Submitting creates a pending login. Jadcup staff must approve and connect it before customer information becomes available.</p>
          </form>
        </div>
      </div>

      <section className="border-t border-stone-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><UserRound className="text-jade-700" size={21} /><div><p className="text-sm font-semibold text-gray-950">Already requested access?</p><p className="text-xs text-stone-500">Sign in to see whether the request is pending, approved or rejected.</p></div></div>
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-jade-800">Customer sign in <ArrowRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}
