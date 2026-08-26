import type {
  OrderSummary,
  OrderDetail,
  OrderProduct,
  CreditSummary,
  CustomerAccount,
  ProductHighlight,
} from '../types';

// ─── Customer ────────────────────────────────────────────────────────

export const mockCustomer: CustomerAccount = {
  customerId: 1,
  company: 'Pacific Fresh Foods Ltd',
  contactPerson: 'Sarah Chen',
  email: 'sarah@pacificfresh.co.nz',
  phone: '09 555 0123',
  mobile: '021 555 0456',
};

// ─── Credit ──────────────────────────────────────────────────────────

export const mockCredit: CreditSummary = {
  credit: 2450.0,
  updatedAt: '2026-07-18T10:30:00Z',
};

// ─── Products for orders ─────────────────────────────────────────────

const productPool: OrderProduct[] = [
  {
    productImage: '/img/cup-16oz.svg',
    customerProductCode: 'PF-CUP-16',
    productCode: 'JC-CUP-016',
    productName: '16oz Single Wall Paper Cup',
    unitPrice: 0.12,
    quantity: 5000,
    price: 600.0,
  },
  {
    productImage: '/img/cup-12oz.svg',
    customerProductCode: 'PF-CUP-12',
    productCode: 'JC-CUP-012',
    productName: '12oz Double Wall Ripple Cup',
    unitPrice: 0.18,
    quantity: 3000,
    price: 540.0,
  },
  {
    productImage: '/img/lid.svg',
    customerProductCode: null,
    productCode: 'JC-LID-080',
    productName: '80mm Sip Lid \u2013 White',
    unitPrice: 0.04,
    quantity: 5000,
    price: 200.0,
  },
  {
    productImage: '/img/box.svg',
    customerProductCode: 'PF-BOX-M',
    productCode: 'JC-BOX-MED',
    productName: 'Medium Corrugated Shipping Box \u2013 Custom Print',
    unitPrice: 1.85,
    quantity: 500,
    price: 925.0,
  },
  {
    productImage: null,
    customerProductCode: 'PF-SLEEVE',
    productCode: 'JC-SLV-012',
    productName: '12oz Cup Sleeve \u2013 Kraft with Pacific Fresh Full Colour Print and Extended Branding Area',
    unitPrice: 0.06,
    quantity: 3000,
    price: 180.0,
  },
  {
    productImage: '/img/bowl.svg',
    customerProductCode: null,
    productCode: 'JC-BWL-032',
    productName: '32oz Salad Bowl with Lid',
    unitPrice: 0.35,
    quantity: 2000,
    price: 700.0,
  },
  {
    productImage: '/img/tray.svg',
    customerProductCode: 'PF-TRAY-L',
    productCode: 'JC-TRY-LRG',
    productName: 'Large Food Tray \u2013 Printed',
    unitPrice: 0.45,
    quantity: 1000,
    price: 450.0,
  },
];

// ─── Order summaries ─────────────────────────────────────────────────

export const mockOrders: OrderSummary[] = [
  {
    orderId: 'ORD-2026-0098',
    orderNo: 'SO-20260098',
    custOrderNo: 'PO-4521',
    orderDate: '2026-07-15',
    requiredDate: '2026-08-10',
    deliveryDate: null,
    status: 'confirmed',
    isDraft: false,
    totalPrice: 1340.0,
    priceInclGst: 1541.0,
    itemCount: 3,
    firstProductImage: productPool[0].productImage,
  },
  {
    orderId: 'ORD-2026-0091',
    orderNo: 'SO-20260091',
    custOrderNo: 'PO-4490',
    orderDate: '2026-07-08',
    requiredDate: '2026-07-28',
    deliveryDate: null,
    status: 'in-production',
    isDraft: false,
    totalPrice: 925.0,
    priceInclGst: 1063.75,
    itemCount: 1,
    firstProductImage: productPool[3].productImage,
  },
  {
    orderId: 'ORD-2026-0085',
    orderNo: 'SO-20260085',
    custOrderNo: null,
    orderDate: '2026-06-28',
    requiredDate: '2026-07-20',
    deliveryDate: null,
    status: 'ready-to-ship',
    isDraft: false,
    totalPrice: 700.0,
    priceInclGst: 805.0,
    itemCount: 1,
    firstProductImage: productPool[5].productImage,
  },
  {
    orderId: 'ORD-2026-0072',
    orderNo: 'SO-20260072',
    custOrderNo: 'PO-4401',
    orderDate: '2026-06-15',
    requiredDate: '2026-07-10',
    deliveryDate: '2026-07-09',
    status: 'delivered',
    isDraft: false,
    totalPrice: 1550.0,
    priceInclGst: 1782.5,
    itemCount: 4,
    firstProductImage: productPool[1].productImage,
  },
  {
    orderId: 'ORD-2026-0065',
    orderNo: 'SO-20260065',
    custOrderNo: 'PO-4380',
    orderDate: '2026-06-02',
    requiredDate: '2026-06-25',
    deliveryDate: '2026-06-24',
    status: 'delivered',
    isDraft: false,
    totalPrice: 600.0,
    priceInclGst: 690.0,
    itemCount: 1,
    firstProductImage: productPool[0].productImage,
  },
  {
    orderId: 'ORD-2026-0058',
    orderNo: 'SO-20260058',
    custOrderNo: null,
    orderDate: '2026-05-20',
    requiredDate: '2026-06-15',
    deliveryDate: '2026-06-14',
    status: 'delivered',
    isDraft: false,
    totalPrice: 450.0,
    priceInclGst: 517.5,
    itemCount: 1,
    firstProductImage: productPool[6].productImage,
  },
  {
    orderId: 'ORD-2026-0042',
    orderNo: 'SO-20260042',
    custOrderNo: 'PO-4310',
    orderDate: '2026-05-05',
    requiredDate: '2026-05-30',
    deliveryDate: null,
    status: 'cancelled',
    isDraft: false,
    totalPrice: 180.0,
    priceInclGst: 207.0,
    itemCount: 1,
    firstProductImage: null,
  },
  {
    orderId: 'ORD-2026-0030',
    orderNo: 'SO-20260030',
    custOrderNo: 'PO-4285',
    orderDate: '2026-04-18',
    requiredDate: '2026-05-15',
    deliveryDate: '2026-05-14',
    status: 'delivered',
    isDraft: false,
    totalPrice: 1265.0,
    priceInclGst: 1454.75,
    itemCount: 3,
    firstProductImage: productPool[2].productImage,
  },
];

// ─── Order details ───────────────────────────────────────────────────

export const mockOrderDetails: Record<string, OrderDetail> = {
  'ORD-2026-0098': {
    ...mockOrders[0],
    deliveryName: 'Sarah Chen',
    deliveryAddress: '42 Harbour View Road, Auckland CBD',
    postalCode: '1010',
    products: [productPool[0], productPool[2], productPool[4]],
  },
  'ORD-2026-0091': {
    ...mockOrders[1],
    deliveryName: 'Pacific Fresh Warehouse',
    deliveryAddress: '15 Industrial Place, East Tamaki',
    postalCode: '2013',
    products: [productPool[3]],
  },
  'ORD-2026-0085': {
    ...mockOrders[2],
    deliveryName: 'Sarah Chen',
    deliveryAddress: '42 Harbour View Road, Auckland CBD',
    postalCode: '1010',
    products: [productPool[5]],
  },
  'ORD-2026-0072': {
    ...mockOrders[3],
    deliveryName: 'Pacific Fresh Warehouse',
    deliveryAddress: '15 Industrial Place, East Tamaki',
    postalCode: '2013',
    products: [productPool[1], productPool[2], productPool[4], productPool[6]],
  },
  'ORD-2026-0065': {
    ...mockOrders[4],
    deliveryName: 'Sarah Chen',
    deliveryAddress: '42 Harbour View Road, Auckland CBD',
    postalCode: '1010',
    products: [productPool[0]],
  },
  'ORD-2026-0058': {
    ...mockOrders[5],
    deliveryName: 'Sarah Chen',
    deliveryAddress: '42 Harbour View Road, Auckland CBD',
    postalCode: '1010',
    products: [productPool[6]],
  },
  'ORD-2026-0042': {
    ...mockOrders[6],
    deliveryName: 'Pacific Fresh Warehouse',
    deliveryAddress: '15 Industrial Place, East Tamaki',
    postalCode: '2013',
    products: [productPool[4]],
  },
  'ORD-2026-0030': {
    ...mockOrders[7],
    deliveryName: 'Sarah Chen',
    deliveryAddress: '42 Harbour View Road, Auckland CBD',
    postalCode: '1010',
    products: [productPool[0], productPool[2], productPool[1]],
  },
};

// ─── Product highlights (for home page) ──────────────────────────────

export const mockProductHighlights: ProductHighlight[] = [
  {
    id: 1,
    name: 'Custom Printed Cups',
    description: 'Single wall, double wall and cold cups made to carry your brand into every customer moment.',
    image: '/img/highlight-cups.svg',
    productCode: 'JC-CUP',
  },
  {
    id: 2,
    name: 'Takeaway Packaging',
    description: 'Paper bowls, food containers and takeaway boxes designed for busy foodservice teams.',
    image: '/img/highlight-packaging.svg',
    productCode: 'JC-PKG',
  },
  {
    id: 3,
    name: 'Bags & Wraps',
    description: 'Paper bags, deli paper and greaseproof wraps in plain or custom-branded formats.',
    image: '/img/highlight-boxes.svg',
    productCode: 'JC-BOX',
  },
  {
    id: 4,
    name: 'Finishing Essentials',
    description: 'Lids, napkins and supporting items that complete a consistent food packaging range.',
    image: '/img/highlight-accessories.svg',
    productCode: 'JC-ACC',
  },
];

// ─── Product name lookup for order search ────────────────────────────

/** Maps orderId to a searchable string of all product names in that order. */
export const orderProductNames: Record<string, string> = Object.fromEntries(
  Object.entries(mockOrderDetails).map(([id, detail]) => [
    id,
    detail.products.map((p) => p.productName.toLowerCase()).join(' '),
  ]),
);
