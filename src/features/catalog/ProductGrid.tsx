import { ProductCard } from './ProductCard';
import { EmptyState } from '../../components/feedback/EmptyState';
import type { CatalogProduct } from '../../types';

interface ProductGridProps {
  products: CatalogProduct[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({ products, emptyTitle = 'No products found.', emptyDescription }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <ul className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.baseProductId}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
