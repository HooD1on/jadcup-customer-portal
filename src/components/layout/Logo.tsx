import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2 no-underline ${className}`} aria-label="Jadcup Home">
      <div className="w-8 h-8 bg-jade-700 rounded-lg flex items-center justify-center">
        <Package className="text-white" size={18} />
      </div>
      <span className="text-xl font-bold text-jade-900 tracking-tight">Jadcup</span>
    </Link>
  );
}
