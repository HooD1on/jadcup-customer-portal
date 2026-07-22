import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl font-bold text-jade-200 mb-2">404</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h1>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="no-underline">
        <Button variant="primary">
          <Home size={16} />
          Go Home
        </Button>
      </Link>
    </div>
  );
}
