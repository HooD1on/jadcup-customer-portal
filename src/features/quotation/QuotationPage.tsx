import { useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { EmptyState } from '../../components/feedback/EmptyState';
import { QuotationCard } from './QuotationCard';
import { mockQuotations, type QuotationStatus } from './quotationData';

type QuotationFilter = 'all' | QuotationStatus;

const filters: { value: QuotationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending-review', label: 'Pending Review' },
  { value: 'quote-ready', label: 'Quote Ready' },
  { value: 'approved', label: 'Approved' },
  { value: 'expired', label: 'Expired' },
];

export function QuotationPage() {
  const [filter, setFilter] = useState<QuotationFilter>('all');
  const quotations = useMemo(
    () => filter === 'all' ? mockQuotations : mockQuotations.filter((quotation) => quotation.status === filter),
    [filter],
  );

  return (
    <PageShell>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-jade-700" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Quotations</h1>
        </div>
        <p className="mt-2 text-sm text-gray-500">Review your quote requests, pricing and quotation status.</p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-200 pb-px" role="tablist" aria-label="Quotation status">
        {filters.map((item) => {
          const active = filter === item.value;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(item.value)}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${active ? 'border-jade-700 text-jade-800' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {quotations.length > 0 ? (
        <div className="space-y-4">
          {quotations.map((quotation) => <QuotationCard key={quotation.quotationNumber} quotation={quotation} />)}
        </div>
      ) : (
        <EmptyState title="No quotations found" description="No quotation requests match this status." />
      )}
    </PageShell>
  );
}