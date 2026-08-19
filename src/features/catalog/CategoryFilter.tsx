import type { CatalogProduct } from '../../types';

export type CatalogCategoryId = 'all' | 'cups' | 'lids' | 'bags' | 'boxes' | 'other';

// Explicit exact-match lookup keyed by the backend's productTypeName, confirmed with the business.
// Swap the key to productTypeId once every ProductTypeId is confirmed for these names.
const PRODUCT_TYPE_NAME_TO_CATEGORY: Record<string, Exclude<CatalogCategoryId, 'all'>> = {
  'Printed Paper Cups': 'cups',
  'Customize Paper Cups': 'cups',
  'Plain Paper Cups': 'cups',
  'Printed Ice Cream Cup': 'cups',
  'Plain Ice Cream Cup': 'cups',
  'Customize Ice Cream Cup': 'cups',

  'Paper Cup Lids': 'lids',

  'Printed Paper Bags': 'bags',
  'Plain Paper Bags': 'bags',
  'Customize Paper Bags': 'bags',

  Cartons: 'boxes',
  'Printed Paper Boxes': 'boxes',
  'Printed Cake Boxes': 'boxes',
  'Customize Paper Boxes': 'boxes',

  'Printed Deli Paper': 'other',
  'Customize Greaseproof Paper': 'other',
  'Printed Others': 'other',
  Others: 'other',
  'Printed Paper Cup Fan': 'other',
  'Printed Paper Bowls': 'other',
  'Plain Paper Bowls': 'other',
  'Clear Punnet': 'other',
  'Clear Cup & Lid': 'other',
};

// Unmapped/unresolved ProductTypes (including null) fall back to Other rather than being fabricated.
function categoryForProduct(product: CatalogProduct): CatalogCategoryId {
  const productTypeName = product.productTypeName?.trim();
  if (!productTypeName) return 'other';
  return PRODUCT_TYPE_NAME_TO_CATEGORY[productTypeName] ?? 'other';
}

export interface CatalogCategory {
  id: CatalogCategoryId;
  label: string;
  matches: (product: CatalogProduct) => boolean;
}

export const catalogCategories: CatalogCategory[] = [
  { id: 'all', label: 'All', matches: () => true },
  { id: 'cups', label: 'Cups', matches: (product) => categoryForProduct(product) === 'cups' },
  { id: 'lids', label: 'Lids', matches: (product) => categoryForProduct(product) === 'lids' },
  { id: 'bags', label: 'Bags', matches: (product) => categoryForProduct(product) === 'bags' },
  { id: 'boxes', label: 'Boxes', matches: (product) => categoryForProduct(product) === 'boxes' },
  { id: 'other', label: 'Other', matches: (product) => categoryForProduct(product) === 'other' },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products by category">
      {catalogCategories.map((category) => {
        const isActive = category.id === selectedCategory;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-jade-700 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
