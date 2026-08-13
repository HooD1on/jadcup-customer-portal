import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useLanguage } from './language/LanguageContext';

export function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl font-bold text-jade-200 mb-2">404</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">{t('Page not found', '未找到页面')}</h1>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {t("The page you're looking for doesn't exist or has been moved.", '您访问的页面不存在或已移动。')}
      </p>
      <Link to="/" className="no-underline">
        <Button variant="primary">
          <Home size={16} />
          {t('Go Home', '返回首页')}
        </Button>
      </Link>
    </div>
  );
}
