export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);

    if (request.method === 'GET' && requestUrl.pathname === '/api/showcase-products') {
      return getShowcaseProducts();
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== 'GET') return response;

    requestUrl.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(requestUrl, request));
  },
};

const SHOWCASE_SOURCE = 'https://apijadcup.gradspace.org/Api/ProductForShowing/GetAllShowingProducts';
const PREFERRED_PRODUCT_IDS = [36, 38, 94, 271, 1177, 474];

function cleanText(value, fallback, maxLength = 120) {
  if (typeof value !== 'string') return fallback;
  const clean = value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
  return clean ? clean.slice(0, maxLength) : fallback;
}

function safeImage(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const imageUrl = new URL(value, SHOWCASE_SOURCE);
    return imageUrl.protocol === 'https:' ? imageUrl.toString() : null;
  } catch {
    return null;
  }
}

function inferCategory(name, sourceCategory) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('ice cream')) return 'Dessert packaging';
  if (lowerName.includes('clear')) return 'Clear cups';
  if (lowerName.includes('milkshake') || lowerName.includes('cold')) return 'Cold drinks';
  if (lowerName.includes('napkin')) return 'Brand accessories';
  if (lowerName.includes('cup')) return 'Hot cups';
  return cleanText(sourceCategory, 'Food packaging', 50);
}

function publicProduct(product) {
  const name = cleanText(product?.baseProductName, 'Jadcup food packaging');
  const quantity = Number(product?.packagingType?.quantity);
  const packageName = cleanText(product?.packagingType?.packagingTypeName, '', 50);

  return {
    id: Number(product?.baseProductId),
    name,
    productCode: cleanText(product?.productCode, 'Ask Jadcup', 50),
    category: inferCategory(name, product?.productType?.productTypeName),
    material: cleanText(product?.rawmaterialDesc, 'Ask about material options', 90),
    packSize: Number.isFinite(quantity) && quantity > 0
      ? `${quantity.toLocaleString('en-NZ')} per ${packageName.toLowerCase() || 'pack'}`
      : 'Ask about available pack sizes',
    image: safeImage(product?.sampleImage),
  };
}

async function getShowcaseProducts() {
  try {
    const upstream = await fetch(SHOWCASE_SOURCE, {
      headers: { Accept: 'application/json' },
      cf: { cacheTtl: 600, cacheEverything: true },
    });
    if (!upstream.ok) throw new Error(`Catalogue returned ${upstream.status}`);

    const payload = await upstream.json();
    const rows = Array.isArray(payload?.data) ? payload.data : [];
    const byId = new Map(rows.map((row) => [Number(row?.baseProductId), row]));
    const selected = PREFERRED_PRODUCT_IDS.map((id) => byId.get(id)).filter(Boolean);
    const products = selected.map(publicProduct).filter((product) => Number.isFinite(product.id));

    return Response.json(
      { success: true, data: products },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=600',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );
  } catch {
    return Response.json(
      { success: false, data: [] },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
