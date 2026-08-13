import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../features/language/LanguageContext';

interface LoadingStateProps {
  message?: string;
  variant?: 'page' | 'inline';
}

export function LoadingState({ message, variant = 'page' }: LoadingStateProps) {
  const { t } = useLanguage();
  const visibleMessage = message || t('Loading...', '正在加载……');
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-4" role="status" aria-live="polite">
        <Loader2 className="animate-spin" size={18} />
        <span className="text-sm">{visibleMessage}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4" role="status" aria-live="polite">
      <Loader2 className="animate-spin text-jade-600 mb-4" size={36} />
      <p className="text-gray-500 text-sm">{visibleMessage}</p>
    </div>
  );
}
