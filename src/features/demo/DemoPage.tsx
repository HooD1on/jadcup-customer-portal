import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/feedback/LoadingState';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { Modal } from '../../components/ui/Modal';

type DemoView = 'loading' | 'empty' | 'error';

export function DemoPage() {
  const [view, setView] = useState<DemoView>('loading');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <PageShell>
      <div className="mb-6">
        <p className="text-xs font-mono text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 inline-block mb-3">
          Development Only
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Component State Demos</h1>
        <p className="text-sm text-gray-500">
          Preview loading, empty, and error feedback states used across the portal.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['loading', 'empty', 'error'] as const).map((mode) => (
          <Button
            key={mode}
            variant={view === mode ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView(mode)}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        ))}
      </div>

      <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-6">
        {view === 'loading' && <LoadingState message="Loading your orders..." />}
        {view === 'empty' && (
          <EmptyState
            icon={<ShoppingBag className="text-gray-400" size={24} />}
            title="No orders yet"
            description="You don't have any orders yet. Once your orders are placed, they'll appear here."
          />
        )}
        {view === 'error' && (
          <ErrorState
            onRetry={() => setView('loading')}
          />
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Modal</h2>
        <Button variant="outline" onClick={() => setModalOpen(true)}>
          Open Modal
        </Button>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Reorder"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          This is a preview of the shared Modal component — overlay click, Esc key, and the
          footer action buttons should all close it.
        </p>
      </Modal>
    </PageShell>
  );
}
