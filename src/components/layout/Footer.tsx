import { LifeBuoy, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-jade-950">Jadcup Customer Portal</p>
            <p className="mt-1 text-xs text-stone-500">Explore as a new customer or manage an existing Jadcup relationship.</p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm" aria-label="Footer navigation">
            <Link to="/start" className="font-semibold text-stone-600 no-underline hover:text-jade-900">Packaging finder</Link>
            <Link to="/products" className="font-semibold text-stone-600 no-underline hover:text-jade-900">Products</Link>
            <Link to="/sample" className="font-semibold text-stone-600 no-underline hover:text-jade-900">Samples &amp; quote</Link>
            <Link to="/help" className="inline-flex items-center gap-1.5 font-semibold text-stone-600 no-underline hover:text-jade-900"><LifeBuoy size={14} />Help</Link>
          </nav>
          <div className="flex flex-wrap gap-4 text-xs text-stone-500">
            <a href="tel:+6492823988" className="inline-flex items-center gap-1.5 text-stone-500 no-underline hover:text-jade-900"><Phone size={13} />09 282 3988</a>
            <a href="mailto:Info@jadcup.co.nz" className="inline-flex items-center gap-1.5 text-stone-500 no-underline hover:text-jade-900"><Mail size={13} />Info@jadcup.co.nz</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
