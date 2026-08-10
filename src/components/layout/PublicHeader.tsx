import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../../features/auth/AuthContext';

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { session, logout } = useAuth();

  const signOut = () => {
    logout();
    setMobileOpen(false);
    navigate('/login', { replace: true });
  };

  const accountPath = session?.accountStatus === 'Approved' ? '/dashboard' : '/application-status';
  const accountLabel = session?.accountStatus === 'Approved' ? 'Open dashboard' : 'Application status';

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/90 bg-stone-50/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between">
          <Logo />

          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            <a href="/#solutions" className="text-sm font-semibold text-stone-600 no-underline hover:text-jade-900">Solutions</a>
            <a href="/#products" className="text-sm font-semibold text-stone-600 no-underline hover:text-jade-900">Products</a>
            <a href="/#why-jadcup" className="text-sm font-semibold text-stone-600 no-underline hover:text-jade-900">Why Jadcup</a>
            <a href="/#customer-proof" className="text-sm font-semibold text-stone-600 no-underline hover:text-jade-900">Customer proof</a>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                <Link to={accountPath} className="rounded-full bg-jade-900 px-4 py-2.5 text-sm font-bold text-white no-underline hover:bg-jade-950">
                  {accountLabel}
                </Link>
                <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-100 hover:text-jade-900">
                  <LogOut size={15} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full px-4 py-2.5 text-sm font-bold text-jade-900 no-underline hover:bg-stone-100">Customer sign in</Link>
                <Link to="/apply" className="rounded-full bg-jade-900 px-4 py-2.5 text-sm font-bold text-white no-underline hover:bg-jade-950">Request portal access</Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden rounded-full border border-stone-300 p-2.5 text-stone-700 hover:bg-white"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-stone-200 bg-stone-50 px-4 py-5" aria-label="Mobile navigation">
          <div className="space-y-1">
            <Link to="/" className="block rounded-xl px-3 py-3 text-sm font-semibold text-stone-700 no-underline hover:bg-white" onClick={() => setMobileOpen(false)}>Home</Link>
            <a href="/#solutions" className="block rounded-xl px-3 py-3 text-sm font-semibold text-stone-700 no-underline hover:bg-white" onClick={() => setMobileOpen(false)}>Solutions</a>
            <a href="/#products" className="block rounded-xl px-3 py-3 text-sm font-semibold text-stone-700 no-underline hover:bg-white" onClick={() => setMobileOpen(false)}>Products</a>
            <a href="/#why-jadcup" className="block rounded-xl px-3 py-3 text-sm font-semibold text-stone-700 no-underline hover:bg-white" onClick={() => setMobileOpen(false)}>Why Jadcup</a>
            <a href="/#customer-proof" className="block rounded-xl px-3 py-3 text-sm font-semibold text-stone-700 no-underline hover:bg-white" onClick={() => setMobileOpen(false)}>Customer proof</a>
          </div>
          <div className="mt-4 border-t border-stone-200 pt-4 space-y-2">
            {session ? (
              <>
                <Link to={accountPath} className="block rounded-full bg-jade-900 px-4 py-3 text-center text-sm font-bold text-white no-underline" onClick={() => setMobileOpen(false)}>{accountLabel}</Link>
                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-stone-600" onClick={signOut}><LogOut size={15} /> Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block rounded-full border border-stone-300 px-4 py-3 text-center text-sm font-bold text-jade-900 no-underline" onClick={() => setMobileOpen(false)}>Customer sign in</Link>
                <Link to="/apply" className="block rounded-full bg-jade-900 px-4 py-3 text-center text-sm font-bold text-white no-underline" onClick={() => setMobileOpen(false)}>Request portal access</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
