import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Package,
  ShoppingBag,
  Truck,
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
  if (!userName.trim()) {
    errors.userName = 'Username is required.';
  } else if (userName.trim().length > 50) {
    errors.userName = 'Username must not exceed 50 characters.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length > 128) {
    errors.password = 'Password must not exceed 128 characters.';
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
    navigate(
      session.accountStatus === 'Approved' ? '/dashboard' : '/application-status',
      { replace: true },
    );
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
      setErrors({
        form: error instanceof Error ? error.message : 'Unable to sign in. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
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
              Approved customers can access their Jadcup account and order information.
              Applicants can also sign in to check the progress of their application.
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
                Your username is created when you submit the Customer Portal application.
              </p>
            </div>
          </div>

          <div>
            <div className="md:hidden mb-6 text-center">
              <div className="w-12 h-12 bg-jade-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Lock className="text-white" size={22} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Customer Login</h1>
              <p className="text-sm text-gray-500 mt-1">Sign in with your portal username</p>
            </div>

            <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 hidden md:block">Sign In</h2>

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                  <FormField
                    id="login-username"
                    label="Username"
                    required
                    autoComplete="username"
                    maxLength={50}
                    placeholder="Enter your portal username"
                    value={userName}
                    onChange={(event) => {
                      setUserName((event.target as HTMLInputElement).value);
                      clearFieldError('userName');
                    }}
                    error={errors.userName}
                  />

                  <FormField
                    id="login-password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    maxLength={128}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => {
                      setPassword((event.target as HTMLInputElement).value);
                      clearFieldError('password');
                    }}
                    error={errors.password}
                    suffix={(
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-jade-600 focus:ring-jade-500"
                      />
                      <span className="text-sm text-gray-600">Keep me signed in</span>
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

                {errors.form && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-(--radius-button) p-3" role="alert">
                    <p className="text-sm text-red-700">{errors.form}</p>
                  </div>
                )}

                {showForgotMsg && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-(--radius-button) p-3" role="status">
                    <p className="text-sm text-amber-800">
                      Password reset is not available yet. Please contact Jadcup support for assistance.
                    </p>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full mt-6" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" />Signing in...</>
                  ) : 'Log In'}
                </Button>
              </form>

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
