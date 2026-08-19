import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { ProductImage } from '../../components/ui/ProductImage';
import { useAuth } from '../auth/AuthContext';
import { portalAccountApi, PortalApiError } from '../../services/portalAccountApi';
import type { ProductDetails } from '../../types';

interface InfoRow {
  label: string;
  value: string;
}

function buildInfoRows(product: ProductDetails): InfoRow[] {
  const rows: InfoRow[] = [];

  if (product.packagingQuantity != null) {
    rows.push({ label: 'Packaging', value: `${product.packagingQuantity.toLocaleString()} pcs / carton` });
  }
  if (product.sleeveQty != null && product.sleevePkt != null) {
    rows.push({ label: 'Sleeve', value: `${product.sleeveQty} sleeves \u00d7 ${product.sleevePkt} pcs` });
  }
  if (product.packagingCategory) {
    rows.push({ label: 'Packaging Category', value: product.packagingCategory });
  }
  if (product.cartonLength != null && product.cartonWidth != null && product.cartonHeight != null) {
    rows.push({ label: 'Carton Dimensions', value: `${product.cartonLength} \u00d7 ${product.cartonWidth} \u00d7 ${product.cartonHeight}` });
  }
  if (product.grossWeight != null) {
    rows.push({ label: 'Gross Weight', value: `${product.grossWeight}` });
  }

  return rows;
}

export function ProductDetailsPage() {
  const { baseProductId } = useParams<{ baseProductId: string }>();
  const { session } = useAuth();
  const [product, setProduct] = useState<ProductDetails>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [isNotFound, setIsNotFound] = useState(false);

  const fetchProduct = useCallback(() => {
    if (!session || !baseProductId) return;
    setIsLoading(true);
    setError(undefined);
    setIsNotFound(false);
    portalAccountApi
      .getProductDetails(Number(baseProductId), session.token)
      .then(setProduct)
      .catch((err) => {
        if (err instanceof PortalApiError && err.status === 404) {
          setIsNotFound(true);
        } else {
          setError(err instanceof PortalApiError ? err.message : 'Failed to load product details.');
        }
      })
      .finally(() => setIsLoading(false));
  }, [session, baseProductId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const infoRows = product ? buildInfoRows(product) : [];

  return (
    <PageShell>
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-jade-700 no-underline mb-4">
        <ArrowLeft size={14} />
        Back to Catalog
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h1>

      {isLoading && <LoadingState />}

      {!isLoading && isNotFound && (
        <ErrorState
          title="Product not found"
          message="This product may have been removed or the link is incorrect."
        />
      )}

      {!isLoading && !isNotFound && error && (
        <ErrorState message={error} onRetry={fetchProduct} />
      )}

      {!isLoading && !isNotFound && !error && product && (
        <div className="space-y-6">
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5 sm:p-6">
            <div className="flex flex-col gap-6 sm:flex-row">
              <ProductImage src={product.imgUrl} alt={product.baseProductName} size="detail" />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm text-gray-500">{product.productCode}</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">{product.baseProductName}</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  {product.productTypeName && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500">Product Type:</dt>
                      <dd className="font-medium text-gray-900">{product.productTypeName}</dd>
                    </div>
                  )}
                  {product.packagingTypeName && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500">Packaging Type:</dt>
                      <dd className="font-medium text-gray-900">{product.packagingTypeName}</dd>
                    </div>
                  )}
                  {product.packagingQuantity != null && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500">Packaging Quantity:</dt>
                      <dd className="font-medium text-gray-900">{product.packagingQuantity.toLocaleString()} pcs / carton</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-5 inline-flex items-center gap-2 rounded-(--radius-badge) bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                  <CircleAlert size={14} aria-hidden="true" />
                  Contract pricing is not available yet for this product.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {product.description || 'No description available.'}
            </p>
          </div>

          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Information</h3>
            {infoRows.length > 0 ? (
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {infoRows.map((row) => (
                  <div key={row.label}>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">{row.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-gray-500">No packaging information available.</p>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
}
