import { Languages } from 'lucide-react';
import { useLanguage } from '../../features/language/LanguageContext';

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center rounded-full border border-stone-300 bg-white p-1 ${compact ? 'gap-0.5' : 'gap-1'}`} aria-label="Language / 语言">
      {!compact && <Languages className="ml-2 text-stone-400" size={14} aria-hidden="true" />}
      <button type="button" onClick={() => setLanguage('en')} className={`rounded-full px-2.5 py-1.5 text-xs font-bold transition ${language === 'en' ? 'bg-jade-900 text-white' : 'text-stone-500 hover:text-jade-900'}`} aria-pressed={language === 'en'}>EN</button>
      <button type="button" onClick={() => setLanguage('zh')} className={`rounded-full px-2.5 py-1.5 text-xs font-bold transition ${language === 'zh' ? 'bg-jade-900 text-white' : 'text-stone-500 hover:text-jade-900'}`} aria-pressed={language === 'zh'}>中文</button>
    </div>
  );
}
