import { Package } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ProductImage } from '../../components/ui/ProductImage';

type PromotionKind = 'discount' | 'arrival' | 'clearance';

interface Promotion {
  id: string;
  kind: PromotionKind;
  badge: string;
  productCode: string;
  productName: string;
  price?: string;
  originalPrice?: string;
  detail?: string;
  action: string;
}

const promotions: Promotion[] = [
  {
    id: 'limited-time-cup',
    kind: 'discount',
    badge: '20% off — limited time',
    productCode: 'SW6-Fields',
    productName: 'Fields Cafe 6oz Single-Wall Compostable Cup - Peak-season offer',
    price: '$104.00',
    originalPrice: '$130.00',
    detail: '/ carton',
    action: 'Order now',
  },
  {
    id: 'new-arrival-cup',
    kind: 'arrival',
    badge: 'New Arrival',
    productCode: 'DW16-New',
    productName: '16oz (500ml) Extra-Thick Double-Wall Compostable Cup',
    detail: 'Launch-month contract pricing',
    action: 'Request a Quote',
  },
  {
    id: 'clearance-bag',
    kind: 'clearance',
    badge: 'Clearance',
    productCode: 'BPB-5 Brown',
    productName: '5# Kraft Paper Bag 235x275mm - Clearance stock',
    detail: 'In-stock discount',
    action: 'Request a Quote',
  },
];

const promotionStyles: Record<PromotionKind, { media: string; badge: string; button: string }> = {
  discount: {
    media: 'bg-jade-800',
    badge: 'bg-jade-950/60 text-white',
    button: 'bg-jade-800 hover:bg-jade-900 active:bg-jade-950',
  },
  arrival: {
    media: 'bg-amber-600',
    badge: 'bg-amber-900/45 text-white',
    button: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800',
  },
  clearance: {
    media: 'bg-blue-700',
    badge: 'bg-blue-950/45 text-white',
    button: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800',
  },
};

function PromotionCard({ promotion }: { promotion: Promotion }) {
  const styles = promotionStyles[promotion.kind];
  const isDiscount = promotion.kind === 'discount';

  return (
    <article className="flex min-h-[26rem] flex-col overflow-hidden rounded-(--radius-card) border border-jade-100 bg-white shadow-(--shadow-card)">
      <div className={`relative flex h-42 items-center justify-center ${styles.media}`}>
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-sm font-bold ${styles.badge}`}>
          {promotion.badge}
        </span>
        <ProductImage src={null} alt={promotion.productName} size="lg" className="border-0 bg-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-sm text-gray-500">{promotion.productCode}</p>
        <h3 className="mt-2 text-lg font-semibold leading-6 text-gray-900">{promotion.productName}</h3>
        {isDiscount ? (
          <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-2xl font-bold text-jade-800">{promotion.price}</span>
            <span className="text-base text-gray-400 line-through">{promotion.originalPrice}</span>
            <span className="text-sm font-medium text-gray-500">{promotion.detail}</span>
          </p>
        ) : (
          <p className="mt-4 text-xl font-bold text-jade-800">
            {promotion.detail}
            {promotion.kind === 'clearance' && <span className="text-sm font-medium text-gray-500"> · Limited quantity</span>}
          </p>
        )}
        <Button type="button" className={`mt-auto w-full pt-3 ${styles.button}`}>
          {promotion.action}
        </Button>
      </div>
    </article>
  );
}

export function PromotionSection() {
  return (
    <section aria-labelledby="special-offers-heading">
      <div className="mb-4 flex items-center gap-2">
        <Package size={18} className="text-jade-700" aria-hidden="true" />
        <h1 id="special-offers-heading" className="text-xl font-bold text-jade-900">Special Offers</h1>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {promotions.map((promotion) => <PromotionCard key={promotion.id} promotion={promotion} />)}
      </div>
    </section>
  );
}