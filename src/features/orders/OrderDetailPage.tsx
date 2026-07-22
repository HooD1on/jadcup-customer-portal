import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  Package as PackageIcon,
  FileText,
} from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ProductImage } from '../../components/ui/ProductImage';
import { ErrorState } from '../../components/feedback/ErrorState';
import { mockOrderDetails } from '../../mocks/data';
import { formatCurrency, formatDate } from '../../lib/format';
import type { OrderStatus, OrderDetail } from '../../types';

// Timeline step configuration
const timelineSteps: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: 'pending', label: 'Order Placed', icon: FileText },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { status: 'in-production', label: 'In Production', icon: PackageIcon },
  { status: 'ready-to-ship', label: 'Ready to Ship', icon: Truck },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const statusIndex: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  'in-production': 2,
  'ready-to-ship': 3,
  shipped: 4,
  delivered: 5,
  cancelled: -1,
};

function getActiveStep(status: OrderStatus): number {
  return statusIndex[status] ?? -1;
}

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const order: OrderDetail | undefined = orderId ? mockOrderDetails[orderId] : undefined;

  if (!order) {
    return (
      <PageShell>
        <ErrorState
          title="Order not found"
          message="We couldn't find this order. It may have been removed or the link is incorrect."
        />
        <div className="text-center mt-4">
          <Link to="/orders" className="no-underline">
            <Button variant="outline">
              <ArrowLeft size={16} /> Back to Orders
            </Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  const activeStep = getActiveStep(order.status);
  const subtotal = order.totalPrice;
  const gst = order.priceInclGst - order.totalPrice;

  return (
    <PageShell>
      {/* Back link */}
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-jade-700 no-underline mb-4">
        <ArrowLeft size={14} />
        Back to Orders
      </Link>

      {/* Order header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{order.orderNo}</h1>
            <StatusBadge status={order.status} />
          </div>
          {order.custOrderNo && (
            <p className="text-sm text-gray-500">Your Reference: {order.custOrderNo}</p>
          )}
        </div>
      </div>

      {/* Progress timeline — not shown for cancelled orders */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5 mb-6 overflow-x-auto">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Progress</h2>
          <div className="flex items-center min-w-[500px]">
            {timelineSteps.map((step, i) => {
              const isComplete = i <= activeStep;
              const isCurrent = i === activeStep;
              const Icon = step.icon;
              return (
                <div key={step.status} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isComplete
                          ? 'bg-jade-600 border-jade-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      } ${isCurrent ? 'ring-2 ring-jade-200' : ''}`}
                    >
                      <Icon size={14} />
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-1.5 text-center whitespace-nowrap ${
                        isComplete ? 'text-jade-700 font-medium' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 ${
                        i < activeStep ? 'bg-jade-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — order info + products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order summary card */}
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Order Date</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                  <Calendar size={13} className="text-gray-400" />
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Required Date</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                  <Clock size={13} className="text-gray-400" />
                  {formatDate(order.requiredDate)}
                </p>
              </div>
              {order.deliveryDate && (
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Delivery Date</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <Truck size={13} className="text-gray-400" />
                    {formatDate(order.deliveryDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card)">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                Products ({order.products.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.products.map((product, idx) => (
                <div key={idx} className="p-4 sm:p-5">
                  <div className="flex gap-4">
                    <ProductImage
                      src={product.productImage}
                      alt={product.productName}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-0.5 break-words">
                        {product.productName}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3">
                        {product.customerProductCode
                          ? `${product.customerProductCode} (${product.productCode})`
                          : product.productCode}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">Unit Price</p>
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(product.unitPrice)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">QTY</p>
                          <p className="text-sm font-medium text-gray-900">{product.quantity.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">Price</p>
                          <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — delivery + totals */}
        <div className="space-y-6">
          {/* Delivery info */}
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" />
              Delivery Information
            </h2>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Delivery Name</p>
                <p className="text-sm text-gray-900">{order.deliveryName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm text-gray-900">{order.deliveryAddress}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Postal Code</p>
                <p className="text-sm text-gray-900">{order.postalCode}</p>
              </div>
            </div>
          </div>

          {/* Price summary */}
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">GST (15%)</span>
                <span className="text-gray-900">{formatCurrency(gst)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between">
                <span className="text-sm font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-jade-700">{formatCurrency(order.priceInclGst)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
