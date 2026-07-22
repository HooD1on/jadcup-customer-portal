import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, TrendingUp, Clock, Package } from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ProductImage } from '../../components/ui/ProductImage';
import { useMockAuth } from '../../hooks/useMockAuth';
import { mockOrders, mockCredit, mockProductHighlights } from '../../mocks/data';
import { formatCurrency, formatDate, formatRelativeDate } from '../../lib/format';

const statusCounts = mockOrders.reduce(
  (acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  },
  {} as Record<string, number>,
);

const inProgressCount =
  (statusCounts['confirmed'] || 0) +
  (statusCounts['in-production'] || 0) +
  (statusCounts['ready-to-ship'] || 0);

const summaryCards = [
  { label: 'Total Orders', value: mockOrders.length.toString(), icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
  { label: 'In Progress', value: inProgressCount.toString(), icon: Clock, color: 'bg-amber-50 text-amber-600' },
  { label: 'Delivered', value: (statusCounts['delivered'] || 0).toString(), icon: TrendingUp, color: 'bg-jade-50 text-jade-600' },
];

export function DashboardPage() {
  const { customer } = useMockAuth();
  const recentOrders = mockOrders.slice(0, 4);

  return (
    <PageShell>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Welcome back, {customer.contactPerson.split(' ')[0]}
        </h1>
        <p className="text-gray-500">{customer.company}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card)">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/orders" className="no-underline">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <Link
                  key={order.orderId}
                  to={`/orders/${order.orderId}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors no-underline"
                >
                  <ProductImage src={order.firstProductImage} alt={order.orderNo} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gray-900">{order.orderNo}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.orderDate)} &middot; {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900 hidden sm:block">
                    {formatCurrency(order.priceInclGst)}
                  </span>
                  <ArrowRight size={16} className="text-gray-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Credit summary */}
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Balance</h2>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-jade-700">{formatCurrency(mockCredit.credit)}</p>
              <p className="text-xs text-gray-400 mt-1">
                Updated {formatRelativeDate(mockCredit.updatedAt)}
              </p>
            </div>
          </div>

          {/* Quick promo */}
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Products</h2>
            <div className="space-y-3">
              {mockProductHighlights.slice(0, 2).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-jade-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <Package className="text-jade-300" size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 truncate">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
