import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ProductImage } from '../../components/ui/ProductImage';
import { LoadingState } from '../../components/feedback/LoadingState';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { mockOrders } from '../../mocks/data';
import { formatCurrency, formatDate } from '../../lib/format';
import { ORDER_STATUS_LABELS } from '../../types';
import type { OrderStatus } from '../../types';

type ViewMode = 'normal' | 'loading' | 'empty' | 'error';

const PAGE_SIZE = 5;

const statusOptions: { value: string; label: string }[] = [
  { value: '', label: 'All Statuses' },
  ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

export function OrderListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('normal');

  const filtered = useMemo(() => {
    if (viewMode !== 'normal') return [];
    return mockOrders.filter((o) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !o.orderNo.toLowerCase().includes(q) &&
          !(o.custOrderNo?.toLowerCase().includes(q))
        )
          return false;
      }
      if (statusFilter && o.status !== statusFilter) return false;
      if (dateFrom && o.orderDate < dateFrom) return false;
      if (dateTo && o.orderDate > dateTo) return false;
      return true;
    });
  }, [search, statusFilter, dateFrom, dateTo, viewMode]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  return (
    <PageShell>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} order{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Demo mode switcher */}
        <div className="flex gap-2 flex-wrap">
          {(['normal', 'loading', 'empty', 'error'] as const).map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => { setViewMode(mode); setPage(1); }}
            >
              {mode === 'normal' ? 'Orders' : mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Filters */}
      {viewMode === 'normal' && (
        <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search order or PO number..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-(--radius-button) focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none"
                aria-label="Search orders"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-(--radius-button) focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none appearance-none bg-white"
                aria-label="Filter by status"
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Date from */}
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-(--radius-button) focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none"
              aria-label="From date"
            />

            {/* Date to */}
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-(--radius-button) focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none"
              aria-label="To date"
            />
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'loading' && <LoadingState message="Loading your orders..." />}
      {viewMode === 'error' && <ErrorState onRetry={() => setViewMode('normal')} />}
      {viewMode === 'empty' && (
        <EmptyState
          icon={<ShoppingBag className="text-gray-400" size={24} />}
          title="No orders yet"
          description="You don't have any orders yet. Once your orders are placed, they'll appear here."
        />
      )}

      {viewMode === 'normal' && filtered.length === 0 && (
        <EmptyState
          title="No orders found"
          description="No orders match your current filters."
          action={
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          }
        />
      )}

      {viewMode === 'normal' && filtered.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-(--radius-card) shadow-(--shadow-card) overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Your Ref</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <ProductImage src={order.firstProductImage} alt={order.orderNo} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.orderNo}</p>
                          <p className="text-xs text-gray-500">{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{order.custOrderNo || '\u2014'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(order.orderDate)}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(order.requiredDate)}</td>
                    <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(order.priceInclGst)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link to={`/orders/${order.orderId}`} className="no-underline">
                        <Button variant="ghost" size="sm">
                          View <ArrowRight size={14} />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paginated.map((order) => (
              <Link
                key={order.orderId}
                to={`/orders/${order.orderId}`}
                className="block bg-white rounded-(--radius-card) shadow-(--shadow-card) p-4 hover:shadow-(--shadow-card-hover) transition-shadow no-underline"
              >
                <div className="flex items-start gap-3">
                  <ProductImage src={order.firstProductImage} alt={order.orderNo} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{order.orderNo}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    {order.custOrderNo && (
                      <p className="text-xs text-gray-500 mb-1">Ref: {order.custOrderNo}</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                      <span>Ordered: {formatDate(order.orderDate)}</span>
                      <span>Required: {formatDate(order.requiredDate)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.priceInclGst)}
                      </span>
                      <span className="text-xs text-jade-600 font-medium flex items-center gap-1">
                        View Order <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-white rounded-(--radius-card) shadow-(--shadow-card) px-4 py-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} /> Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
