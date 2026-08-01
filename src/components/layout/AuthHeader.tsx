import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../ui/Button';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'My Orders', icon: ShoppingBag },
];

export function AuthHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  const displayName = session?.userName || 'Customer';

  const signOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                  isActive(to)
                    ? 'bg-jade-50 text-jade-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop user info */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 leading-tight">{displayName}</p>
              <p className="text-xs text-gray-500 leading-tight">Customer Portal</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-jade-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-jade-700">
                {displayName.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut size={15} />
              Sign Out
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white" aria-label="Mobile navigation">
          <div className="px-4 py-3">
            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-jade-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-jade-700">
                  {displayName.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">Customer Portal</p>
              </div>
            </div>

            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                  isActive(to)
                    ? 'bg-jade-50 text-jade-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
