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
const FAMILY_TARGETS = {
  hot: 3,
  cold: 3,
  dessert: 2,
  food: 3,
  wrap: 2,
  bags: 2,
  bakery: 2,
  accessories: 2,
};

function cleanText(value, fallback, maxLength = 120) {
  if (typeof value !== 'string') return fallback;
  const clean = value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
  return clean ? clean.slice(0, maxLength) : fallback;
}

function imageValue(value) {
  if (!value) return null;
  if (typeof value === 'object') {
    if (Array.isArray(value)) return imageValue(value[0]);
    return imageValue(value.url || value.src || value.showImgUrl);
  }
  if (typeof value !== 'string' || !value.trim()) return null;
  const trimmed = value.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return imageValue(JSON.parse(trimmed));
    } catch {
      return null;
    }
  }
  return trimmed;
}

function safeImage(value) {
  const candidate = imageValue(value);
  if (!candidate) return null;
  try {
    const imageUrl = new URL(candidate, SHOWCASE_SOURCE);
    return imageUrl.protocol === 'https:' ? imageUrl.toString() : null;
  } catch {
    return null;
  }
}

function inferFamily(name) {
  const lowerName = name.toLowerCase();
  if (/ice cream|gelato|dessert cup/.test(lowerName)) return 'dessert';
  if (/cake box|bakery|pastry box/.test(lowerName)) return 'bakery';
  if (/greaseproof|deli paper|wrapping paper|food wrap/.test(lowerName)) return 'wrap';
  if (/paper bag|carry bag|takeaway bag/.test(lowerName)) return 'bags';
  if (/napkin|tissue/.test(lowerName)) return 'accessories';
  if (/bowl|container|takeaway box|food box|lunch box|paper tray/.test(lowerName)) return 'food';
  if (/clear cup|cold cup|milkshake|smoothie|pet cup|pla cup/.test(lowerName)) return 'cold';
  if (/paper cup|hot cup|single wall|double wall/.test(lowerName)) return 'hot';
  return '';
}

function categoryForFamily(family, sourceCategory) {
  const labels = {
    hot: 'Hot cups',
    cold: 'Cold drinks',
    dessert: 'Dessert packaging',
    food: 'Food containers',
    wrap: 'Food wrapping paper',
    bags: 'Paper bags',
    bakery: 'Bakery packaging',
    accessories: 'Brand accessories',
  };
  return labels[family] || cleanText(sourceCategory, 'Food packaging', 50);
}

function representativeScore(product) {
  const name = cleanText(product?.baseProductName, '').toLowerCase();
  let score = 0;
  if (/8oz|12oz|16oz|500ml|750ml|1000ml/.test(name)) score += 4;
  if (!/custom|printed/.test(name)) score += 2;
  if (safeImage(product?.sampleImage || product?.showImgUrl)) score += 20;
  if (cleanText(product?.rawmaterialDesc, '')) score += 1;
  if (Number(product?.packagingType?.quantity) > 0) score += 1;
  return score;
}

function isUsableProduct(product) {
  const id = Number(product?.baseProductId);
  const name = cleanText(product?.baseProductName, '').toLowerCase();
  return Number.isFinite(id)
    && Boolean(name)
    && !/obsolete|discontinued|delete|testing|test product|do not use/.test(name)
    && Boolean(inferFamily(name));
}

function publicProduct(product) {
  const name = cleanText(product?.baseProductName, 'Jadcup food packaging');
  const family = inferFamily(name);
  const quantity = Number(product?.packagingType?.quantity);
  const packageName = cleanText(product?.packagingType?.packagingTypeName, '', 50);

  return {
    id: Number(product?.baseProductId),
    name,
    productCode: cleanText(product?.productCode, 'Ask Jadcup', 50),
    family,
    category: categoryForFamily(family, product?.productType?.productTypeName),
    material: cleanText(product?.rawmaterialDesc, 'Ask about material options', 90),
    packSize: Number.isFinite(quantity) && quantity > 0
      ? `${quantity.toLocaleString('en-NZ')} per ${packageName.toLowerCase() || 'pack'}`
      : 'Ask about available pack sizes',
    image: safeImage(product?.sampleImage || product?.showImgUrl),
    source: 'live-catalogue',
  };
}

function selectRepresentativeProducts(rows) {
  const usableRows = rows.filter(isUsableProduct);
  const byId = new Map(usableRows.map((row) => [Number(row?.baseProductId), row]));
  const selected = [];
  const selectedIds = new Set();
  const familyCounts = new Map();

  const add = (row) => {
    if (!row) return;
    const id = Number(row?.baseProductId);
    const family = inferFamily(cleanText(row?.baseProductName, ''));
    const target = FAMILY_TARGETS[family] || 0;
    const current = familyCounts.get(family) || 0;
    if (!family || selectedIds.has(id) || current >= target) return;
    selected.push(row);
    selectedIds.add(id);
    familyCounts.set(family, current + 1);
  };

  PREFERRED_PRODUCT_IDS.forEach((id) => add(byId.get(id)));
  usableRows
    .slice()
    .sort((a, b) => representativeScore(b) - representativeScore(a))
    .forEach(add);

  return selected;
}

export async function getShowcaseProducts() {
  try {
    const upstream = await fetch(SHOWCASE_SOURCE, {
      headers: { Accept: 'application/json' },
      cf: { cacheTtl: 600, cacheEverything: true },
    });
    if (!upstream.ok) throw new Error(`Catalogue returned ${upstream.status}`);

    const payload = await upstream.json();
    const rows = Array.isArray(payload?.data) ? payload.data : [];
    const selected = selectRepresentativeProducts(rows);
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
