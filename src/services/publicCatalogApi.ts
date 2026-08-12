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
  source: 'live-catalogue';
}

interface ShowcaseResponse {
  success?: boolean;
  data?: ShowcaseProduct[];
}

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
    && product.source === 'live-catalogue';
}

export async function getShowcaseProducts(signal?: AbortSignal): Promise<ShowcaseProduct[]> {
  try {
    const response = await fetch('/api/showcase-products', {
      headers: { Accept: 'application/json' },
      signal,
    });
    if (!response.ok) return [];

    const body = await response.json() as ShowcaseResponse;
    const products = Array.isArray(body.data) ? body.data.filter(validProduct) : [];
    return products;
  } catch {
    return [];
  }
}
