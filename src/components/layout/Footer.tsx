import { LifeBuoy, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../features/language/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-jade-950">{t('Jadcup Customer Portal', 'Jadcup 客户门户')}</p>
            <p className="mt-1 text-xs text-stone-500">{t('Start new packaging work or continue an approved customer account.', '开始新的包装项目，或继续已批准客户账户中的业务。')}</p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm" aria-label={t('Footer navigation', '页脚导航')}>
            <Link to="/start" className="font-semibold text-stone-600 no-underline hover:text-jade-900">{t('Start', '开始')}</Link>
            <Link to="/products" className="font-semibold text-stone-600 no-underline hover:text-jade-900">{t('Products', '产品')}</Link>
            <Link to="/sample" className="font-semibold text-stone-600 no-underline hover:text-jade-900">{t('Sample or quote', '样品或报价')}</Link>
            <Link to="/login" className="font-semibold text-stone-600 no-underline hover:text-jade-900">{t('Customer sign in', '客户登录')}</Link>
            <Link to="/help" className="inline-flex items-center gap-1.5 font-semibold text-stone-600 no-underline hover:text-jade-900"><LifeBuoy size={14} />{t('Help', '帮助')}</Link>
            <a href="https://jadcup.co.nz/" target="_blank" rel="noreferrer" className="font-semibold text-stone-500 no-underline hover:text-jade-900">{t('Jadcup website', 'Jadcup 官网')}</a>
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
