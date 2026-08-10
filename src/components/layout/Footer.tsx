import { ArrowUpRight, CupSoda, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-jade-950 text-jade-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.8fr]">
          <div className="max-w-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-300 text-jade-950"><CupSoda size={20} /></div>
              <div>
                <p className="text-xl font-bold tracking-tight text-white">Jadcup</p>
                <p className="text-xs uppercase tracking-[0.16em] text-jade-300">NZ made food packaging</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-jade-200/70">
              Custom cups and sustainable food packaging, manufactured in Auckland and supplied with the care of a local business.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-lime-300">Find your path</h2>
            <div className="mt-4 space-y-3 text-sm">
              <a href="https://jadcup.co.nz/our-products/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-jade-100/75 no-underline hover:text-white">Explore products <ArrowUpRight size={13} /></a>
              <a href="https://jadcup.co.nz/contact/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-jade-100/75 no-underline hover:text-white">Start a new enquiry <ArrowUpRight size={13} /></a>
              <Link to="/login" className="block text-jade-100/75 no-underline hover:text-white">Customer sign in</Link>
              <Link to="/apply" className="block text-jade-100/75 no-underline hover:text-white">Request portal access</Link>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-lime-300">Jadcup Auckland</h2>
            <div className="mt-4 space-y-3 text-sm text-jade-100/75">
              <p className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" />17B Landing Drive, Māngere, Auckland 2022</p>
              <a href="tel:+6492823988" className="flex items-center gap-2 text-jade-100/75 no-underline hover:text-white"><Phone size={15} />09 282 3988</a>
              <a href="mailto:Info@jadcup.co.nz" className="flex items-center gap-2 text-jade-100/75 no-underline hover:text-white"><Mail size={15} />Info@jadcup.co.nz</a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-jade-100/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Jadcup. All rights reserved.</p>
          <p>Customer Portal for existing Jadcup customers.</p>
        </div>
      </div>
    </footer>
  );
}
