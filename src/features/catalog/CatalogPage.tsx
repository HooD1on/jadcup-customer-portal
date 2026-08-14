import { useEffect, useState } from 'react';
import { PageShell } from '../../components/layout/PageShell';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { ProductGrid } from './ProductGrid';
import { useAuth } from '../auth/AuthContext';
import { portalAccountApi, PortalApiError } from '../../services/portalAccountApi';
import type { CatalogProduct } from '../../types';
import { Package } from 'lucide-react';

export function CatalogPage() {
  const { session } = useAuth();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!session) return;
    setIsLoading(true);
    setError(undefined);
    portalAccountApi
      .getCatalogProducts(session.token)
      .then(setProducts)
      .catch((err) => {
        setError(err instanceof PortalApiError ? err.message : 'Failed to load catalog.');
      })
      .finally(() => setIsLoading(false));
  }, [session]);

  return (
    <PageShell>
      <div className="flex items-center gap-2">
        <Package size={18} className="text-jade-700" aria-hidden="true" />
        <h1 className="text-xl font-bold text-jade-900">All Products</h1>
      </div>

      {isLoading && <LoadingState />}
      {!isLoading && error && <ErrorState message={error} />}
      {!isLoading && !error && <ProductGrid products={products} />}
    </PageShell>
  );
}