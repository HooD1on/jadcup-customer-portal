export type ProductFamily = 'hot' | 'cold' | 'dessert' | 'food' | 'wrap' | 'bags' | 'bakery' | 'accessories';

export interface ShowcaseProduct {
  id: number;
  name: string;
  productCode: string;
  family: ProductFamily;
  category: string;
  material: string;
  packSize: string;
  image: string | null;
  source: 'live-catalogue' | 'verified-snapshot';
}

interface ShowcaseResponse {
  success?: boolean;
  data?: ShowcaseProduct[];
}

const fallbackProducts: ShowcaseProduct[] = [
  {
    id: 36,
    name: '12oz single wall compostable paper cup',
    productCode: 'CUSTOM-12SW',
    family: 'hot',
    category: 'Hot cups',
    material: 'Paper + PLA lining',
    packSize: '1,000 per carton',
    image: '/img/highlight-cups.svg',
    source: 'verified-snapshot',
  },
  {
    id: 38,
    name: '8oz double wall compostable paper cup',
    productCode: 'CUSTOM-8DW',
    family: 'hot',
    category: 'Hot cups',
    material: 'Insulated paper + PLA lining',
    packSize: '500 per carton',
    image: '/img/cup-12oz.svg',
    source: 'verified-snapshot',
  },
  {
    id: 94,
    name: 'Custom milkshake paper cup',
    productCode: 'CUSTOM-MILKSHAKE',
    family: 'cold',
    category: 'Cold drinks',
    material: 'Food-grade printed paper',
    packSize: 'Ask about available sizes',
    image: '/img/cup-16oz.svg',
    source: 'verified-snapshot',
  },
  {
    id: 271,
    name: 'PLA clear cold cup',
    productCode: 'PLA-CLEAR',
    family: 'cold',
    category: 'Clear cups',
    material: 'Plant-based PLA',
    packSize: 'Multiple sizes available',
    image: '/img/highlight-accessories.svg',
    source: 'verified-snapshot',
  },
  {
    id: 1177,
    name: 'Custom ice cream paper cup',
    productCode: 'CUSTOM-ICECREAM',
    family: 'dessert',
    category: 'Dessert packaging',
    material: 'Printed paper + food-safe lining',
    packSize: 'Ask about available sizes',
    image: '/img/bowl.svg',
    source: 'verified-snapshot',
  },
  {
    id: 474,
    name: 'Custom printed napkin',
    productCode: 'CUSTOM-NAPKIN',
    family: 'accessories',
    category: 'Brand accessories',
    material: 'Printed paper',
    packSize: 'Business supply cartons',
    image: '/img/highlight-packaging.svg',
    source: 'verified-snapshot',
  },
];

function validProduct(value: unknown): value is ShowcaseProduct {
  if (!value || typeof value !== 'object') return false;
  const product = value as Partial<ShowcaseProduct>;
  return typeof product.id === 'number'
    && typeof product.name === 'string'
    && typeof product.productCode === 'string'
    && ['hot', 'cold', 'dessert', 'food', 'wrap', 'bags', 'bakery', 'accessories'].includes(product.family || '')
    && typeof product.category === 'string'
    && typeof product.material === 'string'
    && typeof product.packSize === 'string'
    && (typeof product.image === 'string' || product.image === null)
    && (product.source === 'live-catalogue' || product.source === 'verified-snapshot');
}

export async function getShowcaseProducts(signal?: AbortSignal): Promise<ShowcaseProduct[]> {
  try {
    const response = await fetch('/api/showcase-products', {
      headers: { Accept: 'application/json' },
      signal,
    });
    if (!response.ok) return fallbackProducts;

    const body = await response.json() as ShowcaseResponse;
    const products = Array.isArray(body.data) ? body.data.filter(validProduct) : [];
    return products.length >= 4 ? products.slice(0, 6) : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}
