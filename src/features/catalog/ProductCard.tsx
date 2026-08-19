import { Link } from 'react-router-dom';
import { ProductImage } from '../../components/ui/ProductImage';
import { Button } from '../../components/ui/Button';
import { CircleAlert } from 'lucide-react';
import type { CatalogProduct } from '../../types';

interface ProductCardProps {
  product: CatalogProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-(--radius-card) border border-jade-100 bg-white shadow-(--shadow-card)">
      <Link
        to={`/catalog/products/${product.baseProductId}`}
        className="flex flex-1 flex-col no-underline"
        aria-label={`View details for ${product.baseProductName}`}
      >
        <ProductImage
          src={product.sampleImage}
          alt={product.baseProductName}
          size="card"
        />
        <div className="flex flex-1 flex-col p-4 pb-0">
          <div className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <CircleAlert size={13} aria-hidden="true" />
            No Contract Price
          </div>
          <p className="font-mono text-sm text-gray-500">{product.productCode}</p>
          <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">{product.baseProductName}</h2>
          {product.packagingQuantity != null && (
            <p className="mt-1 text-sm text-gray-500">{product.packagingQuantity.toLocaleString()} pcs / carton</p>
          )}
          <p className="mt-6 text-sm font-medium leading-5 text-gray-500">
            Request a quote to unlock your contract price.
          </p>
        </div>
      </Link>
      <div className="p-4 pt-3">
        <Button type="button" className="w-full">
          Request a Quote
        </Button>
      </div>
    </article>
  );
}
