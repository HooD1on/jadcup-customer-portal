import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
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

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-jade-700 no-underline">Home</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  to={session.accountStatus === 'Approved' ? '/dashboard' : '/application-status'}
                  className="no-underline"
                >
                  <Button variant="outline" size="sm">
                    {session.accountStatus === 'Approved' ? 'Dashboard' : 'Application Status'}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut size={15} />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="no-underline">
                  <Button variant="outline" size="sm">Log In</Button>
                </Link>
                <Link to="/apply" className="no-underline">
                  <Button variant="primary" size="sm">Apply for Account</Button>
                </Link>
              </>
            )}
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

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white" aria-label="Mobile navigation">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 no-underline"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {session ? (
                <>
                  <Link
                    to={session.accountStatus === 'Approved' ? '/dashboard' : '/application-status'}
                    className="block no-underline"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button variant="outline" size="md" className="w-full">
                      {session.accountStatus === 'Approved' ? 'Dashboard' : 'Application Status'}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="md" className="w-full" onClick={signOut}>
                    <LogOut size={16} />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block no-underline" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="md" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/apply" className="block no-underline" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" size="md" className="w-full">Apply for Account</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
