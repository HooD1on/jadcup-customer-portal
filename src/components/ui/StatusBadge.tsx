import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../types';
import type { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const colors = ORDER_STATUS_COLORS[status];
  const label = ORDER_STATUS_LABELS[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-(--radius-badge) ${colors.bg} ${colors.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}
