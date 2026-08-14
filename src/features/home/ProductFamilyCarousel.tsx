import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  CupSoda,
  IceCreamBowl,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Utensils,
} from 'lucide-react';
import { CatalogueProductImage } from '../../components/ui/CatalogueProductImage';
import { getShowcaseProducts, type ProductFamily, type ShowcaseProduct } from '../../services/publicCatalogApi';
import { useLanguage } from '../language/LanguageContext';

const productChinese: Record<number, { name: string; category: string; packSize: string }> = {
  36: { name: '12盎司单层可堆肥纸杯', category: '热饮杯', packSize: '每箱1,000个' },
  38: { name: '8盎司双层可堆肥纸杯', category: '热饮杯', packSize: '每箱500个' },
  94: { name: '定制奶昔纸杯', category: '冷饮包装', packSize: '可咨询现有尺寸' },
  271: { name: 'PLA透明冷饮杯', category: '透明杯', packSize: '提供多种尺寸' },
  1177: { name: '定制冰淇淋纸杯', category: '甜品包装', packSize: '可咨询现有尺寸' },
  474: { name: '定制印刷餐巾纸', category: '品牌配套', packSize: '商业供应箱装' },
};

const productFamilyShowcase: Array<{
  family: ProductFamily;
  need: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  decisions: [string, string][];
  icon: typeof Coffee;
}> = [
  {
    family: 'hot',
    need: 'hot',
    title: 'Hot cups and lids',
    titleZh: '热饮纸杯与杯盖',
    description: 'Single-wall and double-wall paper cups for everyday hot drink service.',
    descriptionZh: '适合日常热饮服务的单层杯、双层杯与配套杯盖。',
    decisions: [['Capacity and wall construction', '容量与杯壁结构'], ['Lid compatibility', '杯盖适配性'], ['Plain or custom print', '普通款或定制印刷']],
    icon: Coffee,
  },
  {
    family: 'cold',
    need: 'cold',
    title: 'Cold and clear drink cups',
    titleZh: '冷饮杯与透明杯',
    description: 'Clear and paper formats for iced drinks, milkshakes, smoothies and bubble tea.',
    descriptionZh: '适合冰饮、奶昔、思慕雪和奶茶的透明杯与纸杯。',
    decisions: [['Material and clarity', '材质与透明度'], ['Capacity and rim size', '容量与杯口尺寸'], ['Lid and straw format', '杯盖与吸管形式']],
    icon: CupSoda,
  },
  {
    family: 'dessert',
    need: 'dessert',
    title: 'Ice cream and dessert cups',
    titleZh: '冰淇淋杯与甜品杯',
    description: 'Coated paper formats for gelato, ice cream and cold desserts.',
    descriptionZh: '适合Gelato、冰淇淋和冷冻甜品的淋膜纸杯。',
    decisions: [['Capacity and coating', '容量与淋膜'], ['Spoon or lid fit', '勺子或杯盖适配'], ['Brand presentation', '品牌呈现']],
    icon: IceCreamBowl,
  },
  {
    family: 'food',
    need: 'food',
    title: 'Food containers and takeaway boxes',
    titleZh: '食品容器与外卖盒',
    description: 'Bowls, boxes and trays for hot, cold, wet or dry takeaway food.',
    descriptionZh: '适合热食、冷食、含汤汁或干燥外带食品的碗、盒与托盘。',
    decisions: [['Portion and temperature', '份量与温度'], ['Grease and leak resistance', '防油与防漏'], ['Closure and delivery handling', '封合与配送操作']],
    icon: Utensils,
  },
  {
    family: 'wrap',
    need: 'wrap',
    title: 'Food wrapping and greaseproof paper',
    titleZh: '食品包装纸与防油纸',
    description: 'Paper for sandwiches, pastries and food that needs flexible wrapping.',
    descriptionZh: '适合三明治、烘焙食品与需要灵活包裹的食品。',
    decisions: [['Sheet size', '纸张尺寸'], ['Grease resistance', '防油性'], ['Plain or repeating print', '素色或循环印刷']],
    icon: ScrollText,
  },
  {
    family: 'bags',
    need: 'bags',
    title: 'Paper bags',
    titleZh: '纸袋',
    description: 'Carry formats supporting takeaway, counter handover and branded presentation.',
    descriptionZh: '支持外带、柜台交付与品牌呈现的携带包装。',
    decisions: [['Bag size and strength', '纸袋尺寸与承重'], ['Handle format', '提手形式'], ['Print coverage', '印刷范围']],
    icon: ShoppingBag,
  },
  {
    family: 'bakery',
    need: 'bakery',
    title: 'Bakery and cake packaging',
    titleZh: '烘焙与蛋糕包装',
    description: 'Boxes, bags and wraps balancing protection, transport and presentation.',
    descriptionZh: '兼顾保护、运输与展示的盒、袋与包装纸。',
    decisions: [['Product dimensions', '产品尺寸'], ['Protection and closure', '保护与封合'], ['Carry and display', '携带与展示']],
    icon: Store,
  },
  {
    family: 'accessories',
    need: 'system',
    title: 'Napkins and brand accessories',
    titleZh: '餐巾纸与品牌配套',
    description: 'Supporting touchpoints that help several packaging products feel like one brand system.',
    descriptionZh: '让多种包装产品形成统一品牌体验的配套接触点。',
    decisions: [['Customer touchpoints', '顾客接触点'], ['Artwork consistency', '设计稿一致性'], ['Supply coordination', '供货协调']],
    icon: Sparkles,
  },
];

export function ProductFamilyCarousel() {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<ShowcaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [pointerInside, setPointerInside] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getShowcaseProducts(controller.signal).then(setProducts).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (pointerInside || document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => {
      setCarouselIndex((current) => (current + 1) % productFamilyShowcase.length);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [carouselIndex, pointerInside]);

  const activeFamily = productFamilyShowcase[carouselIndex];
  const ActiveFamilyIcon = activeFamily.icon;
  const activeFamilyProducts = products
    .filter((product) => product.family === activeFamily.family)
    .sort((left, right) => Number(Boolean(right.image)) - Number(Boolean(left.image)))
    .slice(0, 3);
  const liveCatalogue = products.length > 0;
  const showPreviousFamily = () => setCarouselIndex((current) => (current - 1 + productFamilyShowcase.length) % productFamilyShowcase.length);
  const showNextFamily = () => setCarouselIndex((current) => (current + 1) % productFamilyShowcase.length);

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const distance = clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 45) return;
    if (distance < 0) showNextFamily();
    else showPreviousFamily();
  };

  return (
    <section id="product-families" className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="section-kicker">{t('Jadcup product families', 'Jadcup产品类型')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-gray-950 sm:text-4xl">{t('Browse the full range of packaging directions.', '浏览完整的包装产品方向。')}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">{t('Each slide explains one product family and shows only real representative items currently available in the portal data.', '每一页介绍一个产品类型，并且只展示当前门户数据中真实的代表性货品。')}</p>
        </div>
        <div className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-bold sm:self-auto ${liveCatalogue ? 'bg-jade-100 text-jade-800' : 'bg-amber-100 text-amber-800'}`}>
          <ShieldCheck size={14} />
          {liveCatalogue ? t('Live Jadcup catalogue records', 'Jadcup实时产品记录') : t('Live catalogue unavailable', '实时产品目录暂不可用')}
        </div>
      </div>

      <div
        className="mt-7 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm"
        aria-live="polite"
        onMouseEnter={() => setPointerInside(true)}
        onMouseLeave={() => setPointerInside(false)}
        onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
        onTouchCancel={() => { touchStartX.current = null; }}
      >
        <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
          <div className="bg-jade-950 p-7 text-white sm:p-9 lg:p-10">
            <div className="flex items-center justify-between gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300 text-jade-950"><ActiveFamilyIcon size={23} /></div>
              <span className="text-xs font-bold tracking-[0.14em] text-jade-100/45">{String(carouselIndex + 1).padStart(2, '0')} / {String(productFamilyShowcase.length).padStart(2, '0')}</span>
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.15em] text-lime-300">{t('Product family', '产品类型')}</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">{t(activeFamily.title, activeFamily.titleZh)}</h3>
            <p className="mt-4 text-sm leading-relaxed text-jade-100/65">{t(activeFamily.description, activeFamily.descriptionZh)}</p>
            <div className="mt-7 space-y-3">
              {activeFamily.decisions.map(([en, zh]) => <p key={en} className="flex items-center gap-3 text-sm font-semibold text-jade-100/80"><Check className="shrink-0 text-lime-300" size={15} />{t(en, zh)}</p>)}
            </div>
            <Link to={`/start?need=${activeFamily.need}`} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white no-underline">{t('Choose this product direction', '选择这个产品方向')} <ArrowRight className="text-lime-300" size={15} /></Link>
          </div>

          <div className="p-6 sm:p-8 lg:p-9">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-jade-700">{t('Representative real products', '真实代表性产品')}</p>
              <h3 className="mt-2 text-xl font-semibold text-gray-950">{t('Examples currently loaded for this family', '当前已加载的该类产品示例')}</h3>
            </div>

            {loading ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-2xl bg-stone-100" aria-hidden="true" />)}</div>
            ) : activeFamilyProducts.length > 0 ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {activeFamilyProducts.map((product) => {
                  const localized = language === 'zh' ? productChinese[product.id] : undefined;
                  return (
                    <article key={product.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
                      <CatalogueProductImage src={product.image} alt={localized?.name || product.name} className="h-44 p-3" />
                      <div className="p-4"><p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-jade-700">#{product.id} · {localized?.category || product.category}</p><h4 className="mt-2 text-sm font-semibold capitalize leading-snug text-gray-950">{localized?.name || product.name}</h4><p className="mt-2 text-xs leading-relaxed text-stone-500">{localized?.packSize || product.packSize}</p></div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
                <ActiveFamilyIcon className="text-jade-300" size={36} />
                <h4 className="mt-4 text-lg font-semibold text-gray-950">{t('No verified item from this family is loaded in the local preview.', '本地预览中尚未加载该类型的已验证货品。')}</h4>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-500">{t('The category remains visible, but the portal will not invent a product. Live catalogue data or Jadcup confirmation is required.', '产品类型仍会展示，但门户不会虚构货品；需要实时产品数据或由Jadcup确认。')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-stone-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2">
            <button type="button" onClick={showPreviousFamily} aria-label={t('Previous product family', '上一个产品类型')} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-jade-900 hover:border-jade-500"><ChevronLeft size={18} /></button>
            <button type="button" onClick={showNextFamily} aria-label={t('Next product family', '下一个产品类型')} className="flex h-10 w-10 items-center justify-center rounded-full bg-jade-950 text-white"><ChevronRight size={18} /></button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2" aria-label={t('Choose product family slide', '选择产品类型页')}>
            {productFamilyShowcase.map((family, index) => <button key={family.family} type="button" onClick={() => setCarouselIndex(index)} aria-label={t(family.title, family.titleZh)} aria-current={index === carouselIndex ? 'true' : undefined} className={`h-2.5 rounded-full transition ${index === carouselIndex ? 'w-8 bg-jade-900' : 'w-2.5 bg-stone-300 hover:bg-jade-300'}`} />)}
          </div>
          <p className="hidden items-center gap-2 text-xs font-semibold text-stone-400 sm:flex"><ArrowLeft size={13} />{t('Auto-rotates every 4s · swipe or use arrows', '每4秒自动轮转 · 可滑动或使用箭头')}<ArrowRight size={13} /></p>
        </div>
      </div>
    </section>
  );
}
