import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Loader2,
  LogIn,
  SearchCheck,
  ShieldCheck,
  User,
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

const processSteps = [
  { icon: ClipboardList, title: 'Create your login', description: 'Choose a username and password, then submit your company details.' },
  { icon: SearchCheck, title: 'Staff review', description: 'Jadcup staff verify your application and link it to the correct customer record.' },
  { icon: ShieldCheck, title: 'Portal access', description: 'Sign in at any time to check the status. Approved accounts can access the portal.' },
];

export function ApplyPage() {
  const [form, setForm] = useState<ApplicationForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedUserName, setSubmittedUserName] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);

  const updateField = useCallback(<K extends keyof ApplicationForm>(
    field: K,
    value: ApplicationForm[K],
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined, form: undefined }));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const fieldOrder: (keyof ApplicationForm)[] = [
        'userName',
        'password',
        'confirmPassword',
        'registeredBusinessName',
        'registeredContactName',
        'email',
        'phone',
        'notes',
        'consent',
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
      setErrors({
        form: error instanceof Error ? error.message : 'Unable to submit your application. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedUserName) {
    return (
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-8 sm:p-10 text-center" role="status">
            <div className="w-16 h-16 rounded-full bg-jade-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-jade-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Application received</h1>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              Your Customer Portal account is now awaiting review by Jadcup staff.
            </p>
            <div className="mt-6 p-4 bg-gray-50 rounded-(--radius-button)">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Your portal username</p>
              <p className="font-semibold text-gray-900">{submittedUserName}</p>
            </div>
            <p className="text-sm text-gray-500 mt-5">
              You can sign in now to check whether your application is pending, approved, or rejected.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/login" className="no-underline">
                <Button className="w-full sm:w-auto"><LogIn size={17} />Sign In</Button>
              </Link>
              <Link to="/" className="no-underline">
                <Button variant="outline" className="w-full sm:w-auto">Return Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((visible) => !visible)}
      className="p-2 text-gray-400 hover:text-gray-600 rounded"
      aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
    >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2 hidden md:block lg:py-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-jade-700 rounded-xl flex items-center justify-center">
                <FileText className="text-white" size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Apply for an Account</h1>
                <p className="text-sm text-gray-500">Jadcup Customer Portal</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              Create your portal login and tell us which business you represent. You do not need a Jadcup customer code—our staff will find and confirm the correct customer record.
            </p>

            <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">How it works</h2>
            <div className="space-y-5">
              {processSteps.map(({ icon: Icon, title, description }, index) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-jade-50 flex items-center justify-center flex-shrink-0 relative">
                    <Icon size={18} className="text-jade-600" />
                    <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-jade-700 text-white text-[10px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="md:hidden mb-5 text-center">
              <div className="w-12 h-12 bg-jade-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="text-white" size={22} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Apply for an Account</h1>
              <p className="text-sm text-gray-500 mt-1">Create your login and submit your company details.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <section className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5 sm:p-6 mb-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <KeyRound size={16} className="text-jade-600" />Portal Login
                </h2>
                <div className="space-y-4">
                  <FormField
                    id="apply-username"
                    label="Username"
                    required
                    autoComplete="username"
                    maxLength={50}
                    placeholder="Choose a portal username"
                    hint="You will use this username to sign in and check your application status."
                    value={form.userName}
                    onChange={(event) => updateField('userName', (event.target as HTMLInputElement).value)}
                    error={errors.userName}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      id="apply-password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      maxLength={128}
                      hint="At least 8 characters."
                      value={form.password}
                      onChange={(event) => updateField('password', (event.target as HTMLInputElement).value)}
                      error={errors.password}
                      suffix={passwordToggle}
                    />
                    <FormField
                      id="apply-confirm-password"
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      maxLength={128}
                      value={form.confirmPassword}
                      onChange={(event) => updateField('confirmPassword', (event.target as HTMLInputElement).value)}
                      error={errors.confirmPassword}
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5 sm:p-6 mb-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 size={16} className="text-jade-600" />Company Information
                </h2>
                <FormField
                  id="apply-company"
                  label="Company / Trading Name"
                  required
                  autoComplete="organization"
                  maxLength={200}
                  placeholder="Your registered or trading name"
                  hint="Jadcup staff will use this together with your email to find the correct customer record."
                  value={form.registeredBusinessName}
                  onChange={(event) => updateField('registeredBusinessName', (event.target as HTMLInputElement).value)}
                  error={errors.registeredBusinessName}
                />
              </section>

              <section className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5 sm:p-6 mb-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={16} className="text-jade-600" />Primary Contact
                </h2>
                <div className="space-y-4">
                  <FormField
                    id="apply-contact"
                    label="Contact Person"
                    required
                    autoComplete="name"
                    maxLength={60}
                    value={form.registeredContactName}
                    onChange={(event) => updateField('registeredContactName', (event.target as HTMLInputElement).value)}
                    error={errors.registeredContactName}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      id="apply-email"
                      label="Work Email"
                      type="email"
                      required
                      autoComplete="email"
                      maxLength={100}
                      placeholder="you@company.co.nz"
                      value={form.email}
                      onChange={(event) => updateField('email', (event.target as HTMLInputElement).value)}
                      error={errors.email}
                    />
                    <FormField
                      id="apply-phone"
                      label="Phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="09 555 0123"
                      value={form.phone}
                      onChange={(event) => updateField('phone', (event.target as HTMLInputElement).value)}
                      error={errors.phone}
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5 sm:p-6 mb-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Additional Information</h2>
                <FormField
                  as="textarea"
                  id="apply-notes"
                  label="Notes for Jadcup Staff"
                  rows={4}
                  maxLength={NOTES_MAX}
                  placeholder="Optional information that may help us identify your existing Jadcup account..."
                  value={form.notes}
                  onChange={(event) => updateField('notes', (event.target as HTMLTextAreaElement).value)}
                  error={errors.notes}
                />
                <p className="text-xs mt-1 text-right text-gray-400">{form.notes.length}/{NOTES_MAX}</p>

                <div className="mt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      id="apply-consent"
                      type="checkbox"
                      checked={form.consent}
                      onChange={(event) => updateField('consent', event.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-jade-600 focus:ring-jade-500"
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? 'apply-consent-error' : undefined}
                    />
                    <span className="text-sm text-gray-600 leading-snug">
                      I confirm that the information provided is accurate and agree that Jadcup may contact me about this application.
                    </span>
                  </label>
                  {errors.consent && (
                    <p id="apply-consent-error" className="text-xs text-red-600 mt-1.5 ml-7" role="alert">{errors.consent}</p>
                  )}
                </div>
              </section>

              {errors.form && (
                <div className="mb-5 bg-red-50 border border-red-200 rounded-(--radius-button) p-4" role="alert">
                  <p className="text-sm text-red-700">{errors.form}</p>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" />Submitting application...</>
                ) : (
                  <>Submit Application<ArrowRight size={18} /></>
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Submitting creates a pending portal login. Jadcup staff must approve and link it before customer data can be accessed.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
