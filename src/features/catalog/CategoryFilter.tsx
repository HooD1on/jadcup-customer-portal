import type { CatalogProduct } from '../../types';

export interface CatalogCategory {
  id: string;
  label: string;
  /** Available once the Catalog API exposes a ProductType field to match against. */
  available: boolean;
  matches: (product: CatalogProduct) => boolean;
}

// Placeholder category list. Swap `matches` for real ProductType checks once the
// business confirms the mapping - the rest of the catalog filtering pipeline will not need to change.
export const catalogCategories: CatalogCategory[] = [
  { id: 'all', label: 'All', available: true, matches: () => true },
  { id: 'cups', label: 'Cups', available: false, matches: () => true },
  { id: 'lids', label: 'Lids', available: false, matches: () => true },
  { id: 'food-packaging', label: 'Food Packaging', available: false, matches: () => true },
  { id: 'bags-boxes', label: 'Bags & Boxes', available: false, matches: () => true },
  { id: 'accessories', label: 'Accessories', available: false, matches: () => true },
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
            disabled={!category.available}
            onClick={() => onSelectCategory(category.id)}
            title={category.available ? undefined : 'Category data is not available yet.'}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
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
