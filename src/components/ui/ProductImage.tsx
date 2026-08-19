import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'card' | 'detail';
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24 md:w-32 md:h-32',
  card: 'h-28 w-full sm:h-32',
  detail: 'h-56 w-full sm:h-64 sm:w-64',
};

const iconSizes = {
  sm: 16,
  md: 24,
  lg: 32,
  card: 32,
  detail: 40,
};

export function ProductImage({ src, alt, className = '', size = 'md' }: ProductImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const imageSource = src?.trim() || null;
  const shouldShowImage = imageSource !== null && failedSource !== imageSource;

  if (!shouldShowImage) {
    return (
      <div
        className={`${sizeClasses[size]} flex flex-shrink-0 items-center justify-center bg-jade-50 text-jade-300 ${size === 'card' ? '' : 'rounded-(--radius-card) border border-jade-100'} ${className}`}
        role="img"
        aria-label={alt}
      >
        <Package className="text-jade-300" size={iconSizes[size]} />
      </div>
    );
  }

  return (
    <img
      src={imageSource}
      alt={alt}
      className={`${sizeClasses[size]} flex-shrink-0 object-cover ${size === 'card' ? '' : 'rounded-(--radius-card) border border-gray-100'} ${className}`}
      onError={() => setFailedSource(imageSource)}
      loading="lazy"
    />
  );
}
