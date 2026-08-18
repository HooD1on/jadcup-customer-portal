import { useEffect, useMemo, useState } from 'react';
import { PageShell } from '../../components/layout/PageShell';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { ProductGrid } from './ProductGrid';
import { useAuth } from '../auth/AuthContext';
import { portalAccountApi, PortalApiError } from '../../services/portalAccountApi';
import type { CatalogProduct } from '../../types';
import { Package } from 'lucide-react';
import { PromotionSection } from './PromotionSection';
import { SearchBar } from './SearchBar';
import { CategoryFilter, catalogCategories } from './CategoryFilter';
import { Pagination } from './Pagination';

const PRODUCTS_PER_PAGE = 12;

export function CatalogPage() {
  const { session } = useAuth();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const activeCategory = catalogCategories.find((category) => category.id === selectedCategory);

    return products.filter((product) => {
      const matchesSearch = !normalizedSearch
        || product.baseProductName.toLowerCase().includes(normalizedSearch)
        || product.productCode.toLowerCase().includes(normalizedSearch);
      const matchesCategory = activeCategory ? activeCategory.matches(product) : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedProducts = useMemo(
    () => filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE),
    [filteredProducts, currentPage],
  );

  const isFiltering = searchTerm.trim().length > 0 || selectedCategory !== 'all';

  return (
    <PageShell>
      <PromotionSection />

      <div className="mt-10 flex items-center gap-2">
        <Package size={18} className="text-jade-700" aria-hidden="true" />
        <h2 className="text-xl font-bold text-jade-900">All Products</h2>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="sm:max-w-sm sm:flex-1">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      </div>

      {isLoading && <LoadingState />}
      {!isLoading && error && <ErrorState message={error} />}
      {!isLoading && !error && (
        <>
          <ProductGrid
            products={paginatedProducts}
            emptyTitle={isFiltering ? 'No products match your search.' : 'No products found.'}
            emptyDescription={isFiltering ? 'Try a different product name, code, or category.' : undefined}
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </PageShell>
  );
}