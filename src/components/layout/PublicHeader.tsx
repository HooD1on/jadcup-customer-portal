import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { LanguageToggle } from './LanguageToggle';
import { useAuth } from '../../features/auth/AuthContext';
import { useLanguage } from '../../features/language/LanguageContext';

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  const { t } = useLanguage();

  const signOut = () => {
    logout();
    setMobileOpen(false);
    navigate('/login', { replace: true });
  };

  const accountPath = session?.accountStatus === 'Approved' ? '/dashboard' : '/application-status';
  const accountLabel = session?.accountStatus === 'Approved'
    ? t('Open workspace', '进入工作台')
    : t('Application status', '申请状态');

  const publicLinks = [
    { to: '/', en: 'Homepage', zh: '主页' },
    { to: '/products', en: 'Products', zh: '产品' },
    { to: '/sample', en: 'Samples & quotes', zh: '样品与报价' },
    { to: '/help', en: 'Help', zh: '帮助' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/90 bg-stone-50/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-6" aria-label={t('Main navigation', '主导航')}>
            {session?.accountStatus === 'Approved' ? (
              <>
                <Link to="/dashboard" className="text-sm font-semibold text-stone-600 no-underline hover:text-jade-900">{t('Overview', '概览')}</Link>
                <Link to="/orders" className="text-sm font-semibold text-stone-600 no-underline hover:text-jade-900">{t('Orders', '订单')}</Link>
                <Link to="/products" className="text-sm font-semibold text-stone-600 no-underline hover:text-jade-900">{t('Products', '产品')}</Link>
                <Link to="/help" className="text-sm font-semibold text-stone-600 no-underline hover:text-jade-900">{t('Help', '帮助')}</Link>
              </>
            ) : session ? (
              <>
                <Link to="/application-status" className="text-sm font-semibold text-stone-600 no-underline hover:text-jade-900">{t('Application status', '申请状态')}</Link>
                <Link to="/help" className="text-sm font-semibold text-stone-600 no-underline hover:text-jade-900">{t('Help', '帮助')}</Link>
              </>
            ) : publicLinks.map((item) => (
              <Link key={item.to} to={item.to} className="text-sm font-semibold text-stone-600 no-underline hover:text-jade-900">{t(item.en, item.zh)}</Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle compact />
            {session ? (
              <>
                <Link to={accountPath} className="rounded-full bg-jade-900 px-4 py-2.5 text-sm font-bold text-white no-underline hover:bg-jade-950">{accountLabel}</Link>
                <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-100 hover:text-jade-900"><LogOut size={15} /> {t('Sign out', '退出')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full px-3 py-2.5 text-sm font-bold text-jade-900 no-underline hover:bg-stone-100">{t('Sign in', '登录')}</Link>
                <Link to="/start" className="rounded-full bg-jade-900 px-4 py-2.5 text-sm font-bold text-white no-underline hover:bg-jade-950">{t('Start a project', '开始项目')}</Link>
              </>
            )}
          </div>

          <button type="button" className="md:hidden rounded-full border border-stone-300 p-2.5 text-stone-700 hover:bg-white" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label={mobileOpen ? t('Close menu', '关闭菜单') : t('Open menu', '打开菜单')}>
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-stone-200 bg-stone-50 px-4 py-5" aria-label={t('Mobile navigation', '移动端导航')}>
          <div className="mb-4"><LanguageToggle /></div>
          <div className="space-y-1">
            <Link to="/" className="block rounded-xl px-3 py-3 text-sm font-semibold text-stone-700 no-underline hover:bg-white" onClick={() => setMobileOpen(false)}>{t('Home', '首页')}</Link>
            {session?.accountStatus === 'Approved' ? (
              <>
                <Link to="/dashboard" className="block rounded-xl px-3 py-3 text-sm font-semibold text-stone-700 no-underline hover:bg-white" onClick={() => setMobileOpen(false)}>{t('Overview', '概览')}</Link>
                <Link to="/orders" className="block rounded-xl px-3 py-3 text-sm font-semibold text-stone-700 no-underline hover:bg-white" onClick={() => setMobileOpen(false)}>{t('Orders', '订单')}</Link>
                <Link to="/products" className="block rounded-xl px-3 py-3 text-sm font-semibold text-stone-700 no-underline hover:bg-white" onClick={() => setMobileOpen(false)}>{t('Products', '产品')}</Link>
              </>
            ) : session ? (
              <Link to="/application-status" className="block rounded-xl px-3 py-3 text-sm font-semibold text-stone-700 no-underline hover:bg-white" onClick={() => setMobileOpen(false)}>{t('Application status', '申请状态')}</Link>
            ) : publicLinks.filter((item) => item.to !== '/' && item.to !== '/help').map((item) => (
              <Link key={item.to} to={item.to} className="block rounded-xl px-3 py-3 text-sm font-semibold text-stone-700 no-underline hover:bg-white" onClick={() => setMobileOpen(false)}>{t(item.en, item.zh)}</Link>
            ))}
            <Link to="/help" className="block rounded-xl px-3 py-3 text-sm font-semibold text-stone-700 no-underline hover:bg-white" onClick={() => setMobileOpen(false)}>{t('Help', '帮助')}</Link>
          </div>
          <div className="mt-4 space-y-2 border-t border-stone-200 pt-4">
            {session ? (
              <>
                <Link to={accountPath} className="block rounded-full bg-jade-900 px-4 py-3 text-center text-sm font-bold text-white no-underline" onClick={() => setMobileOpen(false)}>{accountLabel}</Link>
                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-stone-600" onClick={signOut}><LogOut size={15} /> {t('Sign out', '退出')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block rounded-full border border-stone-300 px-4 py-3 text-center text-sm font-bold text-jade-900 no-underline" onClick={() => setMobileOpen(false)}>{t('Customer sign in', '客户登录')}</Link>
                <Link to="/start" className="block rounded-full bg-jade-900 px-4 py-3 text-center text-sm font-bold text-white no-underline" onClick={() => setMobileOpen(false)}>{t('Start a project', '开始项目')}</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
