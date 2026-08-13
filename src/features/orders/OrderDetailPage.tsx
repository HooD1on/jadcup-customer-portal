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
import { useLanguage } from '../language/LanguageContext';

const timelineSteps: { status: OrderStatus; label: string; labelZh: string; icon: typeof Clock }[] = [
  { status: 'pending', label: 'Order Placed', labelZh: '订单已提交', icon: FileText },
  { status: 'confirmed', label: 'Confirmed', labelZh: '已确认', icon: CheckCircle2 },
  { status: 'in-production', label: 'In Production', labelZh: '生产中', icon: PackageIcon },
  { status: 'ready-to-ship', label: 'Ready to Ship', labelZh: '待发货', icon: Truck },
  { status: 'shipped', label: 'Shipped', labelZh: '已发货', icon: Truck },
  { status: 'delivered', label: 'Delivered', labelZh: '已送达', icon: CheckCircle2 },
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

function HorizontalTimeline({ activeStep }: { activeStep: number }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center">
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
                className={`text-xs mt-1.5 text-center whitespace-nowrap ${
                  isComplete ? 'text-jade-700 font-medium' : 'text-gray-400'
                }`}
              >
                {t(step.label, step.labelZh)}
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
  );
}

function VerticalTimeline({ activeStep }: { activeStep: number }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col">
      {timelineSteps.map((step, i) => {
        const isComplete = i <= activeStep;
        const isCurrent = i === activeStep;
        const Icon = step.icon;
        return (
          <div key={step.status} className="flex items-start">
            <div className="flex flex-col items-center mr-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                  isComplete
                    ? 'bg-jade-600 border-jade-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                } ${isCurrent ? 'ring-2 ring-jade-200' : ''}`}
              >
                <Icon size={14} />
              </div>
              {i < timelineSteps.length - 1 && (
                <div
                  className={`w-0.5 h-6 ${
                    i < activeStep ? 'bg-jade-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
            <span
              className={`text-sm pt-1.5 ${
                isComplete ? 'text-jade-700 font-medium' : 'text-gray-400'
              }`}
            >
              {t(step.label, step.labelZh)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function OrderDetailPage() {
  const { language, t } = useLanguage();
  const locale = language === 'zh' ? 'zh-CN' : 'en-NZ';
  const { orderId } = useParams<{ orderId: string }>();
  const order: OrderDetail | undefined = orderId ? mockOrderDetails[orderId] : undefined;

  if (!order) {
    return (
      <PageShell>
        <ErrorState
          title={t('Order not found', '未找到订单')}
          message={t("We couldn't find this order. It may have been removed or the link is incorrect.", '无法找到该订单。订单可能已被移除，或链接有误。')}
        />
        <div className="text-center mt-4">
          <Link to="/orders" className="no-underline">
            <Button variant="outline">
              <ArrowLeft size={16} /> {t('Back to Orders', '返回订单列表')}
            </Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  const activeStep = getActiveStep(order.status);

  return (
    <PageShell>
      {/* Back link */}
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-jade-700 no-underline mb-4">
        <ArrowLeft size={14} />
        {t('Back to Orders', '返回订单列表')}
      </Link>

      {/* Order header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{order.orderNo}</h1>
            <StatusBadge status={order.status} />
          </div>
          {order.custOrderNo && (
            <p className="text-sm text-gray-500">{t('Your Reference', '您的参考号')}: {order.custOrderNo}</p>
          )}
        </div>
      </div>

      {/* Progress timeline — not shown for cancelled orders */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">{t('Order Progress', '订单进度')}</h2>
          {/* Vertical on mobile, horizontal on md+ */}
          <div className="md:hidden">
            <VerticalTimeline activeStep={activeStep} />
          </div>
          <div className="hidden md:block">
            <HorizontalTimeline activeStep={activeStep} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — order info + products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order summary card */}
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">{t('Order Details', '订单详情')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{t('Order Date', '下单日期')}</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                  <Calendar size={13} className="text-gray-400" />
                  {formatDate(order.orderDate, locale)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{t('Required Date', '要求日期')}</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                  <Clock size={13} className="text-gray-400" />
                  {formatDate(order.requiredDate, locale)}
                </p>
              </div>
              {order.deliveryDate && (
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{t('Delivery Date', '配送日期')}</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <Truck size={13} className="text-gray-400" />
                    {formatDate(order.deliveryDate, locale)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card)">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                {t('Products', '产品')} ({order.products.length})
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
                        {product.customerProductCode || product.productCode}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">{t('Unit Price', '单价')}</p>
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(product.unitPrice, locale)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">{t('QTY', '数量')}</p>
                          <p className="text-sm font-medium text-gray-900">{product.quantity.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">{t('Price', '金额')}</p>
                          <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.price, locale)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — delivery + total */}
        <div className="space-y-6">
          {/* Delivery info */}
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" />
              {t('Delivery Information', '配送信息')}
            </h2>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">{t('Delivery Name', '收货名称')}</p>
                <p className="text-sm text-gray-900">{order.deliveryName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('Address', '地址')}</p>
                <p className="text-sm text-gray-900">{order.deliveryAddress}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('Postal Code', '邮编')}</p>
                <p className="text-sm text-gray-900">{order.postalCode}</p>
              </div>
            </div>
          </div>

          {/* Order total — no subtotal/GST breakdown (unverified) */}
          <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">{t('Order Total', '订单总计')}</h2>
            <div className="text-center py-2">
              <p className="text-2xl font-bold text-jade-700">{formatCurrency(order.priceInclGst, locale)}</p>
              <p className="text-xs text-gray-400 mt-1">{t('Including GST', '含 GST')}</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
