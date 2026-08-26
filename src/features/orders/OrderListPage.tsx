import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ProductImage } from '../../components/ui/ProductImage';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ordersApi } from '../../services/ordersApi';
import { PortalApiError } from '../../services/portalAccountApi';
import { formatCurrency, formatDate } from '../../lib/format';
import { ORDER_STATUS_LABELS, type OrderSummary } from '../../types';
import { useLanguage } from '../language/LanguageContext';
import { useAuth } from '../auth/AuthContext';

const PAGE_SIZE = 5;

const statusLabelsZh: Record<string, string> = {
  pending: '待确认', confirmed: '已确认', 'in-production': '生产中',
  'ready-to-ship': '待发货', shipped: '已发货', delivered: '已送达', cancelled: '已取消',
};

export function OrderListPage() {
  const { language, t } = useLanguage();
  const locale = language === 'zh' ? 'zh-CN' : 'en-NZ';
  const { session } = useAuth();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [reloadKey, setReloadKey] = useState(0);
  const statusOptions: { value: string; label: string }[] = [
    { value: '', label: t('All Statuses', '全部状态') },
    ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
      value,
      label: language === 'zh' ? statusLabelsZh[value] : label,
    })),
  ];

  // 搜索框敲字不直接触发请求,等用户停下来 400ms 之后再真正发出去,避免每敲一个字打一次接口。
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!session?.token) return;
    let cancelled = false;

    setLoading(true);
    setError(undefined);
    ordersApi.getOrders({
      page,
      pageSize: PAGE_SIZE,
      keyword: debouncedSearch || undefined,
      status: statusFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }, session.token)
      .then((result) => {
        if (cancelled) return;
        setOrders(result.items);
        setTotalCount(result.totalCount);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof PortalApiError ? err.message : t('Something went wrong.', '出错了。'));
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [page, debouncedSearch, statusFilter, dateFrom, dateTo, session?.token, reloadKey, t]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

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
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('My Orders', '我的订单')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {language === 'zh' ? `共 ${totalCount} 个订单` : `${totalCount} order${totalCount !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('Search order, PO or product...', '搜索订单、采购单或产品……')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-(--radius-button) focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none"
              aria-label={t('Search orders', '搜索订单')}
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-(--radius-button) focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none appearance-none bg-white"
              aria-label={t('Filter by status', '按状态筛选')}
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
            aria-label={t('From date', '开始日期')}
          />

          {/* Date to */}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-(--radius-button) focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none"
            aria-label={t('To date', '结束日期')}
          />
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingState />}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={() => setReloadKey((k) => k + 1)}
        />
      )}

      {!loading && !error && totalCount === 0 && (
        <EmptyState
          title={t('No orders found', '未找到订单')}
          description={t('No orders match your current filters.', '没有订单符合当前筛选条件。')}
          action={
            <Button variant="outline" onClick={clearFilters}>
              {t('Clear Filters', '清除筛选')}
            </Button>
          }
        />
      )}

      {!loading && !error && totalCount > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-(--radius-card) shadow-(--shadow-card) overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Order', '订单')}</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Your Ref', '您的参考号')}</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Order Date', '下单日期')}</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Required', '要求日期')}</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Status', '状态')}</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Total', '总计')}</th>
                  <th className="px-5 py-3"><span className="sr-only">{t('View', '查看')}</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <ProductImage src={order.firstProductImage} alt={order.orderNo} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.orderNo}</p>
                          <p className="text-xs text-gray-500">{language === 'zh' ? `${order.itemCount} 项产品` : `${order.itemCount} item${order.itemCount !== 1 ? 's' : ''}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{order.custOrderNo || '\u2014'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(order.orderDate, locale)}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(order.requiredDate, locale)}</td>
                    <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(order.priceInclGst, locale)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link to={`/orders/${order.orderId}`} className="no-underline">
                        <Button variant="ghost" size="sm">
                          {t('View', '查看')} <ArrowRight size={14} />
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
            {orders.map((order) => (
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
                      <p className="text-xs text-gray-500 mb-1">{t('Ref', '参考号')}: {order.custOrderNo}</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                      <span>{t('Ordered', '下单日期')}: {formatDate(order.orderDate, locale)}</span>
                      <span>{t('Required', '要求日期')}: {formatDate(order.requiredDate, locale)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.priceInclGst, locale)}
                      </span>
                      <span className="text-xs text-jade-600 font-medium flex items-center gap-1">
                        {t('View Order', '查看订单')} <ArrowRight size={12} />
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
                <ChevronLeft size={16} /> {t('Previous', '上一页')}
              </Button>
              <span className="text-sm text-gray-600">
                {language === 'zh' ? `第 ${page} 页，共 ${totalPages} 页` : `Page ${page} of ${totalPages}`}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                {t('Next', '下一页')} <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
