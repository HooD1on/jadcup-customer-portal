import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  variant?: 'page' | 'inline';
}

export function LoadingState({ message = 'Loading...', variant = 'page' }: LoadingStateProps) {
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-4" role="status" aria-live="polite">
        <Loader2 className="animate-spin" size={18} />
        <span className="text-sm">{message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4" role="status" aria-live="polite">
      <Loader2 className="animate-spin text-jade-600 mb-4" size={36} />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
