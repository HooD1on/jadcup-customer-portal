import { PageShell } from '../../components/layout/PageShell';

export function CatalogPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-bold text-gray-900">
        Catalog & Quotes
      </h1>

      <p className="mt-2 text-gray-500">
        Browse products, add to an order, or request a quote.
      </p>
    </PageShell>
  );
}