import { useState } from 'react';
import { Database, ImageOff } from 'lucide-react';
import { useLanguage } from '../../features/language/LanguageContext';

interface CatalogueProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function CatalogueProductImage({ src, alt, className = '' }: CatalogueProductImageProps) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);
  const unavailable = !src || failed;

  return (
    <div className={`flex items-center justify-center overflow-hidden bg-jade-50 ${className}`}>
      {unavailable ? (
        <div
          className="flex h-full min-h-36 w-full flex-col items-center justify-center gap-2 px-4 text-center text-jade-800/55"
          role="img"
          aria-label={`${alt}: ${t('no public database image', '数据库暂无公开图片')}`}
        >
          {failed ? <ImageOff size={27} /> : <Database size={27} />}
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em]">
            {failed
              ? t('Database image unavailable', '数据库图片暂不可用')
              : t('No public database image', '数据库暂无公开图片')}
          </p>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
