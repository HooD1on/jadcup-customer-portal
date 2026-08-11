import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, LayoutDashboard, PackageSearch, ShoppingBag } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../ui/Button';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../../features/language/LanguageContext';

const navItems = [
  { to: '/dashboard', en: 'Overview', zh: '概览', icon: LayoutDashboard },
  { to: '/orders', en: 'My Orders', zh: '我的订单', icon: ShoppingBag },
  { to: '/products', en: 'Products', zh: '产品', icon: PackageSearch },
];

export function AuthHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  const { t } = useLanguage();
  const displayName = session?.userName || t('Customer', '客户');

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
          <nav className="hidden md:flex items-center gap-1" aria-label={t('Main navigation', '主导航')}>
            {navItems.map(({ to, en, zh, icon: Icon }) => (
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
                {t(en, zh)}
              </Link>
            ))}
          </nav>

          {/* Desktop user info */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle compact />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 leading-tight">{displayName}</p>
              <p className="text-xs text-gray-500 leading-tight">{t('Customer Portal', '客户门户')}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-jade-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-jade-700">
                {displayName.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut size={15} />
              {t('Sign Out', '退出')}
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t('Close menu', '关闭菜单') : t('Open menu', '打开菜单')}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white" aria-label={t('Mobile navigation', '移动端导航')}>
          <div className="px-4 py-3">
            <div className="mb-3"><LanguageToggle /></div>
            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-jade-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-jade-700">
                  {displayName.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">{t('Customer Portal', '客户门户')}</p>
              </div>
            </div>

            {navItems.map(({ to, en, zh, icon: Icon }) => (
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
                {t(en, zh)}
              </Link>
            ))}
            <button
              type="button"
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <LogOut size={18} />
              {t('Sign Out', '退出')}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
