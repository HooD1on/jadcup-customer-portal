import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24 md:w-32 md:h-32',
};

const iconSizes = {
  sm: 16,
  md: 24,
  lg: 32,
};

export function ProductImage({ src, alt, className = '', size = 'md' }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`${sizeClasses[size]} flex items-center justify-center bg-jade-50 rounded-(--radius-card) border border-jade-100 flex-shrink-0 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Package className="text-jade-300" size={iconSizes[size]} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} object-cover rounded-(--radius-card) border border-gray-100 flex-shrink-0 ${className}`}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
