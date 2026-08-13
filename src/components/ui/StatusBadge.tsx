import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../types';
import type { OrderStatus } from '../../types';
import { useLanguage } from '../../features/language/LanguageContext';

const ORDER_STATUS_LABELS_ZH: Record<OrderStatus, string> = {
  pending: '待确认',
  confirmed: '已确认',
  'in-production': '生产中',
  'ready-to-ship': '待发货',
  shipped: '已发货',
  delivered: '已送达',
  cancelled: '已取消',
};

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { language } = useLanguage();
  const colors = ORDER_STATUS_COLORS[status];
  const label = language === 'zh' ? ORDER_STATUS_LABELS_ZH[status] : ORDER_STATUS_LABELS[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-(--radius-badge) ${colors.bg} ${colors.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}
