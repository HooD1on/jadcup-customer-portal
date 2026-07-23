import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  CreditCard,
  Truck,
  Package,
  Loader2,
  Info,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/ui/FormField';

interface LoginErrors {
  email?: string;
  password?: string;
}

function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  if (!email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  return errors;
}

const portalFeatures = [
  { icon: ShoppingBag, text: 'View your orders and order history' },
  { icon: Package, text: 'Check order progress and product details' },
  { icon: Truck, text: 'View delivery information and dates' },
  { icon: CreditCard, text: 'View your account credit balance' },
];

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  const clearFieldError = useCallback((field: keyof LoginErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowForgotMsg(false);

    const validationErrors = validateLogin(email, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = validationErrors.email ? 'login-email' : 'login-password';
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setIsSubmitting(true);

    // --- PROTOTYPE ONLY ---
    // Simulates a login delay. No credentials are sent or stored.
    // Must be replaced with real authentication (JWT) before production.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    navigate('/dashboard');
    // --- END PROTOTYPE ONLY ---
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Left — branding & info (hidden on small mobile, shown from md) */}
          <div className="hidden md:block lg:py-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-jade-700 rounded-xl flex items-center justify-center">
                <Lock className="text-white" size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
                <p className="text-sm text-gray-500">Sign in to your Jadcup account</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              Access your Jadcup customer portal to manage your orders and account.
              The portal is available to approved customers with an activated account.
            </p>

            <div className="space-y-4 mb-8">
              {portalFeatures.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-jade-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-jade-600" />
                  </div>
                  <span className="text-sm text-gray-700">{text}</span>
                </div>
              ))}
            </div>

            <div className="bg-jade-50 border border-jade-100 rounded-(--radius-card) p-4">
              <p className="text-sm text-jade-800 flex items-start gap-2">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                Customer Portal access is available after your account application has been reviewed and activated by Jadcup staff.
              </p>
            </div>
          </div>

          {/* Right — login form */}
          <div>
            {/* Mobile-only heading */}
            <div className="md:hidden mb-6 text-center">
              <div className="w-12 h-12 bg-jade-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Lock className="text-white" size={22} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Customer Login</h1>
              <p className="text-sm text-gray-500 mt-1">Sign in to your Jadcup account</p>
            </div>

            <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 hidden md:block">Sign In</h2>

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                  <FormField
                    id="login-email"
                    label="Email Address"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.co.nz"
                    value={email}
                    onChange={(e) => {
                      setEmail((e.target as HTMLInputElement).value);
                      clearFieldError('email');
                    }}
                    error={errors.email}
                  />

                  <FormField
                    id="login-password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword((e.target as HTMLInputElement).value);
                      clearFieldError('password');
                    }}
                    error={errors.password}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-jade-600 focus:ring-jade-500"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotMsg(true)}
                      className="text-sm text-jade-700 hover:text-jade-800 font-medium underline-offset-2 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                {showForgotMsg && (
                  <div
                    className="mt-4 bg-amber-50 border border-amber-200 rounded-(--radius-button) p-3"
                    role="status"
                    aria-live="polite"
                  >
                    <p className="text-sm text-amber-800">
                      Password reset will be available once the account service is connected.
                      Please contact Jadcup support if you need assistance.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Log In'
                  )}
                </Button>
              </form>

              {/* Mobile-only notice */}
              <div className="md:hidden mt-5 bg-jade-50 border border-jade-100 rounded-(--radius-button) p-3">
                <p className="text-xs text-jade-700 flex items-start gap-1.5">
                  <Info size={13} className="flex-shrink-0 mt-0.5" />
                  Portal access is available after your application has been reviewed and activated by Jadcup staff.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 text-center space-y-3">
                <p className="text-sm text-gray-500">
                  Don&rsquo;t have an account?{' '}
                  <Link to="/apply" className="text-jade-700 font-medium hover:underline">
                    Apply for an Account
                  </Link>
                </p>
                <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 inline-block">
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
