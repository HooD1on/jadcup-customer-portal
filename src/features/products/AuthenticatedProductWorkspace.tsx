import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CalendarDays,
  PackagePlus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CatalogueProductImage } from '../../components/ui/CatalogueProductImage';
import { ProductImage } from '../../components/ui/ProductImage';
import { mockCustomer, mockOrderDetails, mockOrders } from '../../mocks/data';
import type { OrderProduct } from '../../types';
import { formatDate } from '../../lib/format';
import type { ProductFamily, ShowcaseProduct } from '../../services/publicCatalogApi';
import { useLanguage } from '../language/LanguageContext';

interface AccountProduct extends OrderProduct {
  lastOrderDate: string;
  orderCount: number;
  totalQuantity: number;
}

const productChinese: Record<number, { name: string; category: string; packSize: string }> = {
  36: { name: '12盎司单层可堆肥纸杯', category: '热饮杯', packSize: '每箱1,000个' },
  38: { name: '8盎司双层可堆肥纸杯', category: '热饮杯', packSize: '每箱500个' },
  94: { name: '定制奶昔纸杯', category: '冷饮包装', packSize: '可咨询现有尺寸' },
  271: { name: 'PLA透明冷饮杯', category: '透明杯', packSize: '提供多种尺寸' },
  1177: { name: '定制冰淇淋纸杯', category: '甜品包装', packSize: '可咨询现有尺寸' },
  474: { name: '定制印刷餐巾纸', category: '品牌配套', packSize: '商业供应箱装' },
};

const familyPriority: ProductFamily[] = ['accessories', 'cold', 'dessert', 'wrap', 'bags', 'bakery', 'food', 'hot'];

function familyFromOrderProduct(product: OrderProduct): ProductFamily {
  const text = `${product.productName} ${product.productCode}`.toLowerCase();
  if (/napkin|sleeve|straw|cutlery/.test(text)) return 'accessories';
  if (/ice cream|gelato|dessert/.test(text)) return 'dessert';
  if (/cold|clear|milkshake|smoothie/.test(text)) return 'cold';
  if (/wrap|greaseproof|deli paper/.test(text)) return 'wrap';
  if (/bag/.test(text)) return 'bags';
  if (/cake|bakery|pastry/.test(text)) return 'bakery';
  if (/bowl|box|tray|container/.test(text)) return 'food';
  return 'hot';
}

function buildAccountProducts(): AccountProduct[] {
  const aggregated = new Map<string, AccountProduct>();

  Object.values(mockOrderDetails)
    .filter((order) => order.status !== 'cancelled')
    .forEach((order) => {
      order.products.forEach((product) => {
        const current = aggregated.get(product.productCode);
        if (current) {
          current.orderCount += 1;
          current.totalQuantity += product.quantity;
          if (order.orderDate > current.lastOrderDate) current.lastOrderDate = order.orderDate;
          return;
        }

        aggregated.set(product.productCode, {
          ...product,
          lastOrderDate: order.orderDate,
          orderCount: 1,
          totalQuantity: product.quantity,
        });
      });
    });

  return Array.from(aggregated.values()).sort((left, right) =>
    right.orderCount - left.orderCount || right.totalQuantity - left.totalQuantity,
  );
}

function recommendationReason(family: ProductFamily, seedProduct: string): [string, string] {
  const reasons: Record<ProductFamily, [string, string]> = {
    hot: [`Customers ordering ${seedProduct} also compare another hot-cup format when planning different serving sizes.`, `采购${seedProduct}的相似客户，也会比较其他热饮杯型来覆盖不同容量。`],
    cold: ['Customers buying takeaway drinkware often add a cold-drink format for another service occasion.', '采购外带饮品包装的相似客户，通常还会补充冷饮杯型以覆盖更多消费场景。'],
    dessert: ['Foodservice customers with cups and bowls often extend the range into dessert service.', '同时采购杯具和餐碗的餐饮客户，通常还会把产品组合延伸到甜品服务。'],
    food: ['Customers with drinkware frequently add a food container to build a more complete takeaway handover.', '采购饮品包装的客户经常补充食品容器，形成更完整的外带交付组合。'],
    wrap: ['Takeaway customers often pair rigid containers with flexible food wrapping.', '外带客户通常会将硬质容器与食品包装纸搭配使用。'],
    bags: ['Customers ordering takeaway packaging often add a carry format for the final handover.', '采购外带包装的客户通常还会增加纸袋，用于最后的顾客交付。'],
    bakery: ['Foodservice accounts often add a bakery format when the menu expands into pastries or desserts.', '餐饮客户在扩展烘焙或甜品菜单时，通常会增加相应的烘焙包装。'],
    accessories: ['Customers ordering branded cups often add a printed touchpoint such as napkins to complete the brand system.', '采购品牌杯具的相似客户，经常增加定制餐巾纸等接触点，完善整体品牌包装。'],
  };
  return reasons[family];
}

export function AuthenticatedProductWorkspace({
  products,
  loading,
}: {
  products: ShowcaseProduct[];
  loading: boolean;
}) {
  const { language, t } = useLanguage();
  const locale = language === 'zh' ? 'zh-CN' : 'en-NZ';
  const accountProducts = useMemo(buildAccountProducts, []);
  const purchasedFamilies = useMemo(
    () => new Set(accountProducts.map(familyFromOrderProduct)),
    [accountProducts],
  );
  const recommendations = useMemo(() => products
    .filter((product) => !purchasedFamilies.has(product.family))
    .sort((left, right) => familyPriority.indexOf(left.family) - familyPriority.indexOf(right.family))
    .slice(0, 3), [products, purchasedFamilies]);
  const activeOrders = mockOrders.filter((order) => !['delivered', 'cancelled'].includes(order.status));
  const validOrders = mockOrders.filter((order) => order.status !== 'cancelled');
  const latestOrder = [...validOrders].sort((left, right) => right.orderDate.localeCompare(left.orderDate))[0];
  const seedProduct = language === 'zh' ? '热饮杯和相关产品' : accountProducts[0]?.productName || 'your core products';
  const liveCatalogue = products.length > 0;

  return (
    <main className="flex-1 bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-jade-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-jade-800"><BadgeCheck size={14} />{t('Signed-in product workspace', '登录后的产品工作台')}</div>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl">{t('Build on the products your business already buys.', '从企业已经采购的产品继续拓展。')}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">{t('See current supply first, then consider a small number of related products supported by compatibility and aggregated purchase patterns.', '先查看现有供货，再根据产品兼容性与汇总采购规律考虑少量关联产品。')}</p>
            </div>
            <Link to="/orders" className="inline-flex w-fit items-center gap-2 rounded-full bg-jade-950 px-6 py-3 text-sm font-bold text-white no-underline">{t('Open order history', '查看订单历史')} <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-jade-950 text-white">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="p-7 sm:p-9 lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300 text-jade-950"><RefreshCcw size={23} /></div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.15em] text-lime-300">{t('Your current supply', '您的现有供货')}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">{mockCustomer.company}</h2>
              <p className="mt-4 text-sm leading-relaxed text-jade-100/65">{t('This view uses the same account and order context as the Dashboard, but keeps only the information needed for product and repeat-purchase decisions.', '这里使用与Dashboard相同的账户和订单背景，但只保留产品选择与重复采购所需要的信息。')}</p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/8 p-4"><p className="text-2xl font-semibold text-white">{accountProducts.length}</p><p className="mt-1 text-xs text-jade-100/55">{t('Products ordered', '采购过的产品')}</p></div>
                <div className="rounded-2xl bg-white/8 p-4"><p className="text-2xl font-semibold text-white">{activeOrders.length}</p><p className="mt-1 text-xs text-jade-100/55">{t('Orders in progress', '进行中的订单')}</p></div>
                <div className="col-span-2 rounded-2xl bg-white/8 p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-jade-100/45">{t('Most recent order', '最近一次订单')}</p><p className="mt-2 text-sm font-semibold text-white">{latestOrder?.orderNo} · {latestOrder ? formatDate(latestOrder.orderDate, locale) : '—'}</p></div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/6 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-9">
              <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-lime-300">{t('Frequently ordered', '常购产品')}</p><h3 className="mt-2 text-xl font-semibold">{t('Your strongest repeat-supply signals', '最明确的重复供货产品')}</h3></div><Boxes className="text-jade-100/35" size={25} /></div>
              <div className="mt-6 space-y-3">
                {accountProducts.slice(0, 3).map((product) => (
                  <article key={product.productCode} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/7 p-4">
                    <ProductImage src={product.productImage} alt={product.productName} size="md" className="border-white/10 bg-white/10" />
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{product.productName}</p><p className="mt-1 text-xs text-jade-100/50">{product.customerProductCode || product.productCode} · {language === 'zh' ? `${product.orderCount} 次订单` : `${product.orderCount} order${product.orderCount === 1 ? '' : 's'}`}</p></div>
                    <div className="shrink-0 text-right"><p className="text-sm font-semibold text-lime-300">{product.totalQuantity.toLocaleString(locale)}</p><p className="mt-1 text-[0.65rem] text-jade-100/45">{t('units ordered', '累计数量')}</p></div>
                  </article>
                ))}
              </div>
              <Link to="/orders" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white no-underline">{t('Repeat from an order', '从历史订单再次采购')} <ArrowRight className="text-lime-300" size={14} /></Link>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="section-kicker">{t('Complete your product range', '完善您的产品组合')}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-gray-950 sm:text-4xl">{t('Customers buying similar products also add these.', '采购相似产品的客户还会搭配这些。')}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">{t('Recommendations combine account purchase patterns with product-family compatibility. They are starting points for a quote—not automatic additions to your account.', '推荐同时考虑账户采购规律与产品类别兼容性，只作为询价起点，不会自动加入您的账户。')}</p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-jade-100 px-3 py-1.5 text-xs font-bold text-jade-800 sm:self-auto"><ShieldCheck size={14} />{t('Account-gated recommendations', '账户专属推荐')}</div>
          </div>

          {loading ? (
            <div className="mt-7 grid gap-5 md:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-[28rem] animate-pulse rounded-[1.5rem] bg-stone-200" aria-hidden="true" />)}</div>
          ) : recommendations.length > 0 ? (
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {recommendations.map((product) => {
                const localized = language === 'zh' ? productChinese[product.id] : undefined;
                const [reasonEn, reasonZh] = recommendationReason(product.family, seedProduct);
                const quoteQuery = new URLSearchParams({ route: 'repeat', product: product.name, source: 'account-recommendation' }).toString();
                return (
                  <article key={product.id} className="flex min-h-[28rem] flex-col overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white">
                    <CatalogueProductImage src={product.image} alt={localized?.name || product.name} className="h-48 p-5" />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between gap-3"><p className="text-[0.65rem] font-bold uppercase tracking-[0.11em] text-jade-700">{localized?.category || product.category}</p><span className="rounded-full bg-lime-200 px-2.5 py-1 text-[0.62rem] font-bold text-jade-950">{t('Related purchase', '关联采购')}</span></div>
                      <h3 className="mt-3 text-lg font-semibold capitalize leading-snug text-gray-950">{localized?.name || product.name}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-stone-500">{localized?.packSize || product.packSize}</p>
                      <div className="mt-5 rounded-2xl bg-stone-50 p-4"><p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.11em] text-jade-700"><Sparkles size={13} />{t('Why this appears', '为什么推荐')}</p><p className="mt-2 text-xs leading-relaxed text-stone-600">{t(reasonEn, reasonZh)}</p></div>
                      <Link to={`/sample?${quoteQuery}`} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-jade-800 no-underline">{t('Add to a quote brief', '加入询价需求')} <ArrowRight size={14} /></Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-7 rounded-[1.5rem] border border-stone-200 bg-white p-8 text-center"><PackagePlus className="mx-auto text-jade-500" size={28} /><h3 className="mt-4 text-xl font-semibold text-gray-950">{t('No suitable related product is available in the current portal dataset.', '当前门户数据中暂时没有合适的关联产品。')}</h3><p className="mt-2 text-sm text-stone-500">{t('The portal will not invent a recommendation when product evidence is missing.', '缺少真实产品依据时，门户不会虚构推荐。')}</p></div>
          )}

          <div className="mt-7 flex flex-col gap-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3"><CalendarDays className="mt-0.5 shrink-0 text-amber-700" size={18} /><p className="max-w-3xl text-xs leading-relaxed text-amber-900/75">{t('Prototype note: this preview uses the portal’s current sample account orders and approved product records. Production recommendations should be calculated from aggregated real orders, compatibility and live availability.', '样品说明：当前预览使用门户现有的示例账户订单与已确认产品记录。正式推荐应根据汇总真实订单、规格兼容性和实时可售状态计算。')}</p></div>
            <span className={`shrink-0 rounded-full px-3 py-1.5 text-[0.65rem] font-bold ${liveCatalogue ? 'bg-jade-100 text-jade-800' : 'bg-white text-amber-800'}`}>{liveCatalogue ? t('Live catalogue products', '实时目录产品') : t('Live catalogue unavailable', '实时产品目录暂不可用')}</span>
          </div>
        </section>
      </section>
    </main>
  );
}
