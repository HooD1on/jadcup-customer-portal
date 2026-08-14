import { ArrowRight, CalendarDays, Package, Tag } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../lib/format';
import type { Quotation, QuotationStatus } from './quotationData';

const statusStyles: Record<QuotationStatus, { label: string; badge: string }> = {
  'pending-review': { label: 'Pending Review', badge: 'bg-amber-50 text-amber-700' },
  'quote-ready': { label: 'Quote Ready', badge: 'bg-blue-50 text-blue-700' },
  approved: { label: 'Approved', badge: 'bg-jade-50 text-jade-700' },
  expired: { label: 'Expired', badge: 'bg-gray-100 text-gray-600' },
};

export function QuotationCard({ quotation }: { quotation: Quotation }) {
  const status = statusStyles[quotation.status];
  const hasQuote = quotation.pricePerCarton !== undefined;

  return (
    <article className="flex flex-col gap-5 rounded-(--radius-card) border border-gray-200 bg-white p-5 shadow-(--shadow-card) sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-sm font-medium text-gray-500">{quotation.quotationNumber}</p>
          <span className={`inline-flex items-center gap-1.5 rounded-(--radius-badge) px-2.5 py-1 text-xs font-medium ${status.badge}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            {status.label}
          </span>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-gray-900">{quotation.productName}</h2>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5"><Tag size={14} aria-hidden="true" />{quotation.productCode}</span>
          <span className="inline-flex items-center gap-1.5"><Package size={14} aria-hidden="true" />{quotation.requestedQuantity} cartons</span>
          <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} aria-hidden="true" />Requested {formatDate(quotation.requestDate)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:min-w-44 sm:items-end">
        <div className="text-left sm:text-right">
          {quotation.pricePerCarton !== undefined ? (
            <p className="text-xl font-bold text-jade-800">{formatCurrency(quotation.pricePerCarton)} <span className="text-sm font-medium text-gray-500">/ carton</span></p>
          ) : (
            <p className="text-sm font-medium text-gray-500">Pricing pending</p>
          )}
          {quotation.expiryDate && <p className="mt-1 text-xs text-gray-500">Valid until {formatDate(quotation.expiryDate)}</p>}
        </div>
        <Button type="button" variant={hasQuote ? 'primary' : 'outline'} size="sm">
          {hasQuote ? 'View Quote' : 'View Details'} <ArrowRight size={14} />
        </Button>
      </div>
    </article>
  );
}