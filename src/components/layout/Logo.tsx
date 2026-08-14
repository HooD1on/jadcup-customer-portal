import { CupSoda } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../features/language/LanguageContext';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  const { t } = useLanguage();
  return (
    <Link to="/" className={`flex items-center gap-2 no-underline ${className}`} aria-label={t('Jadcup Home', 'Jadcup 首页')}>
      <div className="w-9 h-9 bg-jade-900 rounded-full flex items-center justify-center">
        <CupSoda className="text-lime-300" size={18} />
      </div>
      <span className="text-xl font-bold text-jade-950 tracking-[-0.035em]">Jadcup</span>
      <span className="hidden sm:inline border-l border-stone-300 pl-2 text-xs font-semibold uppercase tracking-[0.13em] text-stone-500">{t('Customer Portal', '客户门户')}</span>
    </Link>
  );
}
