import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Building2,
  User,
  CheckCircle2,
  Loader2,
  ClipboardList,
  UserCheck,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/ui/FormField';

// ─── Types ───────────────────────────────────────────────────────────

interface ApplicationForm {
  company: string;
  nzbn: string;
  address: string;
  suburb: string;
  city: string;
  postalCode: string;
  contactPerson: string;
  email: string;
  phone: string;
  mobile: string;
  message: string;
  consent: boolean;
}

type FieldErrors = Partial<Record<keyof ApplicationForm, string>>;

const initialForm: ApplicationForm = {
  company: '',
  nzbn: '',
  address: '',
  suburb: '',
  city: '',
  postalCode: '',
  contactPerson: '',
  email: '',
  phone: '',
  mobile: '',
  message: '',
  consent: false,
};

const MESSAGE_MAX = 500;

// ─── Validation ──────────────────────────────────────────────────────

function validate(form: ApplicationForm): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.company.trim()) errors.company = 'Company name is required.';
  if (!form.address.trim()) errors.address = 'Business address is required.';
  if (!form.city.trim()) errors.city = 'City is required.';
  if (!form.postalCode.trim()) {
    errors.postalCode = 'Postal code is required.';
  } else if (!/^\d{4}$/.test(form.postalCode.trim())) {
    errors.postalCode = 'Enter a valid 4-digit New Zealand postal code.';
  }
  if (!form.contactPerson.trim()) errors.contactPerson = 'Contact person is required.';
  if (!form.email.trim()) {
    errors.email = 'Work email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[\d\s\-+()]{7,15}$/.test(form.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (form.mobile.trim() && !/^[\d\s\-+()]{7,15}$/.test(form.mobile.trim())) {
    errors.mobile = 'Please enter a valid mobile number.';
  }
  if (form.message.length > MESSAGE_MAX) {
    errors.message = `Message must not exceed ${MESSAGE_MAX} characters.`;
  }
  if (!form.consent) errors.consent = 'You must agree to continue.';

  return errors;
}

// ─── Field-to-element-id mapping ─────────────────────────────────────

const fieldIds: Record<string, string> = {
  company: 'apply-company',
  address: 'apply-address',
  city: 'apply-city',
  postalCode: 'apply-postal',
  contactPerson: 'apply-contact',
  email: 'apply-email',
  phone: 'apply-phone',
  mobile: 'apply-mobile',
  message: 'apply-message',
  consent: 'apply-consent',
  nzbn: 'apply-nzbn',
  suburb: 'apply-suburb',
};

// ─── Process steps ───────────────────────────────────────────────────

const processSteps = [
  { icon: ClipboardList, title: 'Submit Application', desc: 'Fill out the form below with your company details.' },
  { icon: UserCheck, title: 'Staff Review', desc: 'Our team will review your application and verify your details.' },
  { icon: Mail, title: 'Account Activation', desc: 'Once approved, you will receive instructions to activate your portal account.' },
];

// ─── Component ───────────────────────────────────────────────────────

export function ApplyPage() {
  const [form, setForm] = useState<ApplicationForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const updateField = useCallback(<K extends keyof ApplicationForm>(
    field: K,
    value: ApplicationForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus the first field with an error
      const fieldOrder: (keyof ApplicationForm)[] = [
        'company', 'nzbn', 'address', 'suburb', 'city', 'postalCode',
        'contactPerson', 'email', 'phone', 'mobile', 'message', 'consent',
      ];
      for (const field of fieldOrder) {
        if (validationErrors[field]) {
          document.getElementById(fieldIds[field])?.focus();
          break;
        }
      }
      return;
    }

    setIsSubmitting(true);

    // --- PROTOTYPE ONLY ---
    // Simulates submission delay. No data is sent anywhere.
    // Must be replaced with a real POST to the portal application endpoint.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // --- END PROTOTYPE ONLY ---
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setIsSubmitted(false);
  };

  // ─── Success state ─────────────────────────────────────────────────

  if (isSubmitted) {
    return (
      <div className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div
            className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-8 sm:p-10 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="w-16 h-16 rounded-full bg-jade-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-jade-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Application Received</h1>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto mb-2">
              Thank you for applying for a Jadcup customer account. Our staff will review
              your application and contact you.
            </p>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
              Submitting this application does not immediately create or activate a portal account.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/" className="no-underline">
                <Button variant="outline" className="w-full sm:w-auto">Return to Home</Button>
              </Link>
              <Link to="/login" className="no-underline">
                <Button variant="secondary" className="w-full sm:w-auto">Go to Login</Button>
              </Link>
              <Button variant="ghost" onClick={handleReset} className="w-full sm:w-auto">
                Submit Another Application
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Form state ────────────────────────────────────────────────────

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* Left — info panel (2/5 width on desktop) */}
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
              Apply for a Jadcup customer account. Once submitted, our staff will review
              your application and contact you. Approved applications will be linked to
              the correct customer or company record before portal access is activated.
            </p>

            <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">How it works</h2>
            <div className="space-y-5">
              {processSteps.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-jade-50 flex items-center justify-center flex-shrink-0 relative">
                    <Icon size={18} className="text-jade-600" />
                    <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-jade-700 text-white text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-jade-50 border border-jade-100 rounded-(--radius-card) p-4">
              <p className="text-sm text-jade-800">
                Already have an account?{' '}
                <Link to="/login" className="font-medium underline underline-offset-2">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Right — form (3/5 width on desktop) */}
          <div className="lg:col-span-3">
            {/* Mobile-only heading */}
            <div className="md:hidden mb-5 text-center">
              <div className="w-12 h-12 bg-jade-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="text-white" size={22} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Apply for an Account</h1>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Submit your details and our staff will review your application.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              {/* Company Information */}
              <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5 sm:p-6 mb-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 size={16} className="text-jade-600" />
                  Company Information
                </h2>
                <div className="space-y-4">
                  <FormField
                    id="apply-company"
                    label="Company / Trading Name"
                    required
                    autoComplete="organization"
                    placeholder="Pacific Fresh Foods Ltd"
                    value={form.company}
                    onChange={(e) => updateField('company', (e.target as HTMLInputElement).value)}
                    error={errors.company}
                  />
                  <FormField
                    id="apply-nzbn"
                    label="NZBN"
                    autoComplete="off"
                    placeholder="e.g. 9429041234567"
                    value={form.nzbn}
                    onChange={(e) => updateField('nzbn', (e.target as HTMLInputElement).value)}
                    hint="New Zealand Business Number (optional)"
                    error={errors.nzbn}
                  />
                  <FormField
                    id="apply-address"
                    label="Business Address"
                    required
                    autoComplete="street-address"
                    placeholder="42 Harbour View Road"
                    value={form.address}
                    onChange={(e) => updateField('address', (e.target as HTMLInputElement).value)}
                    error={errors.address}
                  />
                  <FormField
                    id="apply-suburb"
                    label="Suburb"
                    autoComplete="address-level3"
                    placeholder="e.g. Auckland CBD"
                    value={form.suburb}
                    onChange={(e) => updateField('suburb', (e.target as HTMLInputElement).value)}
                    error={errors.suburb}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      id="apply-city"
                      label="City"
                      required
                      autoComplete="address-level2"
                      placeholder="Auckland"
                      value={form.city}
                      onChange={(e) => updateField('city', (e.target as HTMLInputElement).value)}
                      error={errors.city}
                    />
                    <FormField
                      id="apply-postal"
                      label="Postal Code"
                      required
                      autoComplete="postal-code"
                      placeholder="1010"
                      inputMode="numeric"
                      maxLength={4}
                      value={form.postalCode}
                      onChange={(e) => updateField('postalCode', (e.target as HTMLInputElement).value)}
                      error={errors.postalCode}
                    />
                  </div>
                </div>
              </div>

              {/* Primary Contact */}
              <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5 sm:p-6 mb-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={16} className="text-jade-600" />
                  Primary Contact
                </h2>
                <div className="space-y-4">
                  <FormField
                    id="apply-contact"
                    label="Contact Person"
                    required
                    autoComplete="name"
                    placeholder="Sarah Chen"
                    value={form.contactPerson}
                    onChange={(e) => updateField('contactPerson', (e.target as HTMLInputElement).value)}
                    error={errors.contactPerson}
                  />
                  <FormField
                    id="apply-email"
                    label="Work Email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.co.nz"
                    value={form.email}
                    onChange={(e) => updateField('email', (e.target as HTMLInputElement).value)}
                    error={errors.email}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      id="apply-phone"
                      label="Phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="09 555 0123"
                      value={form.phone}
                      onChange={(e) => updateField('phone', (e.target as HTMLInputElement).value)}
                      error={errors.phone}
                    />
                    <FormField
                      id="apply-mobile"
                      label="Mobile"
                      type="tel"
                      autoComplete="tel"
                      placeholder="021 555 0456"
                      value={form.mobile}
                      onChange={(e) => updateField('mobile', (e.target as HTMLInputElement).value)}
                      hint="Optional"
                      error={errors.mobile}
                    />
                  </div>
                </div>
              </div>

              {/* Message & Consent */}
              <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5 sm:p-6 mb-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Additional Information</h2>
                <div className="space-y-4">
                  <div>
                    <FormField
                      as="textarea"
                      id="apply-message"
                      label="Packaging Requirements or Message"
                      placeholder="Tell us about the products you're interested in, expected order volumes, or any other details..."
                      rows={4}
                      maxLength={MESSAGE_MAX}
                      value={form.message}
                      onChange={(e) => updateField('message', (e.target as HTMLTextAreaElement).value)}
                      error={errors.message}
                    />
                    <p className={`text-xs mt-1 text-right ${form.message.length > MESSAGE_MAX ? 'text-red-500' : 'text-gray-400'}`}>
                      {form.message.length}/{MESSAGE_MAX}
                    </p>
                  </div>

                  {/* Consent */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        id="apply-consent"
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => updateField('consent', e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-gray-300 text-jade-600 focus:ring-jade-500"
                        aria-invalid={errors.consent ? true : undefined}
                        aria-describedby={errors.consent ? 'apply-consent-error' : undefined}
                        aria-required="true"
                      />
                      <span className="text-sm text-gray-600 leading-snug">
                        I confirm that the information provided is accurate and agree that Jadcup
                        may contact me regarding this application.{' '}
                        <span className="text-jade-700 underline underline-offset-2 cursor-pointer">
                          Privacy Policy
                        </span>
                      </span>
                    </label>
                    {errors.consent && (
                      <p id="apply-consent-error" className="text-xs text-red-600 mt-1.5 ml-7" role="alert">
                        {errors.consent}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting application...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Submitting this form does not create an active account. Applications are reviewed by Jadcup staff.
              </p>

              {/* Mobile — already have account */}
              <div className="md:hidden mt-6 pt-5 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-jade-700 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
