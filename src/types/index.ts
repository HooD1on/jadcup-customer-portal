export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in-production'
  | 'ready-to-ship'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderProduct {
  productImage: string | null;
  customerProductCode: string | null;
  productCode: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  price: number;
}

export interface OrderSummary {
  orderId: string;
  orderNo: string;
  custOrderNo: string | null;
  orderDate: string;
  requiredDate: string;
  deliveryDate: string | null;
  status: OrderStatus;
  totalPrice: number;
  priceInclGst: number;
  itemCount: number;
  firstProductImage: string | null;
}

export interface OrderDetail extends OrderSummary {
  deliveryName: string;
  deliveryAddress: string;
  postalCode: string;
  products: OrderProduct[];
}

export interface CreditSummary {
  credit: number;
  updatedAt: string;
}

export interface CustomerAccount {
  customerId: number;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  mobile: string;
}

export interface ProductHighlight {
  id: number;
  name: string;
  description: string;
  image: string | null;
  productCode: string;
}

export interface CatalogProduct {
  baseProductId: number;
  baseProductName: string;
  productCode: string;
  sampleImage: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  'in-production': 'In Production',
  'ready-to-ship': 'Ready to Ship',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'in-production': { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  'ready-to-ship': { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  shipped: { bg: 'bg-jade-50', text: 'text-jade-700', dot: 'bg-jade-500' },
  delivered: { bg: 'bg-jade-100', text: 'text-jade-800', dot: 'bg-jade-600' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
};
