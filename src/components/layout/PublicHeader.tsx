import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from '../ui/Button';

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-jade-700 no-underline">Home</Link>
            <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-jade-700 no-underline">Products</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">Log In</Button>
            </Link>
            <Link to="/apply">
              <Button variant="primary" size="sm">Apply for Account</Button>
            </Link>
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
            <Link
              to="/products"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 no-underline"
              onClick={() => setMobileOpen(false)}
            >
              Products
            </Link>
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <Link to="/login" className="block no-underline" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="md" className="w-full">Log In</Button>
              </Link>
              <Link to="/apply" className="block no-underline" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="md" className="w-full">Apply for Account</Button>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
