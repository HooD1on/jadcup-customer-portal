import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  GitCompareArrows,
  LogIn,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react';
import { getShowcaseProducts, type ProductFamily, type ShowcaseProduct } from '../../services/publicCatalogApi';
import { useAuth } from '../auth/AuthContext';
import { useLanguage, type PortalLanguage } from '../language/LanguageContext';
import { AuthenticatedProductWorkspace } from './AuthenticatedProductWorkspace';

const productChinese: Record<number, { name: string; category: string; material: string; packSize: string }> = {
  36: { name: '12盎司单层可堆肥纸杯', category: '热饮杯', material: '纸张＋PLA淋膜', packSize: '每箱1,000个' },
  38: { name: '8盎司双层可堆肥纸杯', category: '热饮杯', material: '隔热纸张＋PLA淋膜', packSize: '每箱500个' },
  94: { name: '定制奶昔纸杯', category: '冷饮包装', material: '食品级印刷纸', packSize: '可咨询现有尺寸' },
  271: { name: 'PLA透明冷饮杯', category: '透明杯', material: '植物基PLA', packSize: '提供多种尺寸' },
  1177: { name: '定制冰淇淋纸杯', category: '甜品包装', material: '印刷纸＋食品级淋膜', packSize: '可咨询现有尺寸' },
  474: { name: '定制印刷餐巾纸', category: '品牌配套', material: '印刷纸', packSize: '商业供应箱装' },
};

const productArtwork: Record<number, string> = {
  36: '/img/highlight-cups.svg',
  38: '/img/cup-12oz.svg',
  94: '/img/cup-16oz.svg',
  271: '/img/highlight-accessories.svg',
  1177: '/img/bowl.svg',
  474: '/img/highlight-packaging.svg',
};

const businessLabels: Record<string, [string, string]> = {
  cafe: ['Café, coffee roastery or beverage brand', '咖啡馆、咖啡烘焙或饮品品牌'],
  foodservice: ['Restaurant, takeaway or lunch bar', '餐厅、外卖或Lunch Bar'],
  'cold-dessert': ['Bubble tea, cold drinks or ice cream', '奶茶、冷饮或冰淇淋业务'],
  bakery: ['Bakery, cake shop or dessert counter', '烘焙店、蛋糕店或甜品柜台'],
  institution: ['Institution, catering or event service', '机构、餐饮服务或活动供应'],
  trade: ['Multi-site brand, distributor or reseller', '连锁品牌、经销商或包装采购商'],
};

const needLabels: Record<string, [string, string]> = {
  hot: ['Hot cups and matching lids', '热饮纸杯与配套杯盖'],
  cold: ['Clear and cold drink cups', '透明杯与冷饮杯'],
  dessert: ['Ice cream and dessert cups', '冰淇淋杯与甜品杯'],
  food: ['Bowls, takeaway boxes and trays', '餐碗、外卖盒与纸托盘'],
  wrap: ['Deli and greaseproof paper', '食品包装纸与防油纸'],
  bags: ['Paper bags and counter essentials', '纸袋与柜台配套用品'],
  bakery: ['Cake boxes and bakery packaging', '蛋糕盒与烘焙包装'],
  system: ['A coordinated packaging range', '统一的多产品包装组合'],
};

const routeLabels: Record<string, [string, string]> = {
  standard: ['Compare standard products', '比较标准产品'],
  custom: ['Prepare custom branded packaging', '准备定制品牌包装'],
  sample: ['Compare physical samples', '比较实物样品'],
  repeat: ['Continue approved supply', '继续已确认的供货'],
};

const familyReasons: Record<ProductFamily, [string, string]> = {
  hot: ['Representative core format for everyday hot drink service.', '代表日常热饮服务的核心杯型。'],
  cold: ['Representative visibility, capacity and lid-fit decisions for cold drinks.', '代表冷饮在透明度、容量和杯盖适配上的决策。'],
  dessert: ['Representative coated format for ice cream and cold desserts.', '代表冰淇淋和冷冻甜品的淋膜杯型。'],
  food: ['Representative container direction for takeaway food.', '代表外带食品的容器方向。'],
  wrap: ['Representative material direction for wrapping and grease resistance.', '代表包裹和防油性能的材料方向。'],
  bags: ['Representative carry format supporting the takeaway handover.', '代表支持外带交付的携带包装。'],
  bakery: ['Representative protection and presentation format for baked goods.', '代表烘焙食品的保护与展示方式。'],
  accessories: ['Representative supporting touchpoint for a coordinated brand range.', '代表统一品牌包装组合的配套接触点。'],
};

const needFamilies: Record<string, ProductFamily[]> = {
  hot: ['hot', 'accessories'],
  cold: ['cold', 'accessories'],
  dessert: ['dessert', 'cold', 'accessories'],
  food: ['food', 'wrap', 'bags', 'accessories'],
  wrap: ['wrap', 'bags', 'accessories'],
  bags: ['bags', 'accessories'],
  bakery: ['bakery', 'wrap', 'bags', 'accessories'],
  system: ['hot', 'cold', 'food', 'accessories'],
};

const businessFamilies: Record<string, ProductFamily[]> = {
  cafe: ['hot', 'cold', 'accessories'],
  foodservice: ['food', 'wrap', 'bags', 'accessories'],
  'cold-dessert': ['cold', 'dessert', 'accessories'],
  bakery: ['bakery', 'wrap', 'bags', 'accessories'],
  institution: ['hot', 'food', 'accessories'],
  trade: ['hot', 'cold', 'food', 'accessories'],
};

const primaryFamily: Record<string, ProductFamily | undefined> = {
  hot: 'hot',
  cold: 'cold',
  dessert: 'dessert',
  food: 'food',
  wrap: 'wrap',
  bags: 'bags',
  bakery: 'bakery',
};


interface PurchaseContext {
  business: string;
  need: string;
  route: string;
}

const FINDER_KEY = 'jadcup.portal.packaging-finder';

function readSavedContext(): PurchaseContext {
  try {
    const saved = JSON.parse(localStorage.getItem(FINDER_KEY) || '') as Partial<PurchaseContext>;
    return {
      business: typeof saved.business === 'string' ? saved.business : '',
      need: typeof saved.need === 'string' ? saved.need : '',
      route: typeof saved.route === 'string' ? saved.route : '',
    };
  } catch {
    return { business: '', need: '', route: '' };
  }
}

function localizedLabel(labels: Record<string, [string, string]>, value: string, language: PortalLanguage, fallback: [string, string]) {
  const pair = labels[value] || fallback;
  return language === 'zh' ? pair[1] : pair[0];
}

function representativeShortlist(products: ShowcaseProduct[], families: ProductFamily[], requiredPrimary?: ProductFamily) {
  if (requiredPrimary && !products.some((product) => product.family === requiredPrimary)) return [];
  const selected: ShowcaseProduct[] = [];
  const selectedIds = new Set<number>();

  families.forEach((family) => {
    const product = products.find((item) => item.family === family && !selectedIds.has(item.id));
    if (product && selected.length < 4) {
      selected.push(product);
      selectedIds.add(product.id);
    }
  });

  products.forEach((product) => {
    if (selected.length < 4 && families.includes(product.family) && !selectedIds.has(product.id)) {
      selected.push(product);
      selectedIds.add(product.id);
    }
  });

  return selected;
}

export function ProductExplorerPage() {
  const { session } = useAuth();
  const { language, t } = useLanguage();
  const [params] = useSearchParams();
  const savedContext = useMemo(readSavedContext, []);
  const forceExplore = params.get('view') === 'all';
  const context = useMemo<PurchaseContext>(() => ({
    business: forceExplore ? '' : params.get('business') || savedContext.business,
    need: forceExplore ? '' : params.get('need') || savedContext.need,
    route: forceExplore ? '' : params.get('route') || savedContext.route,
  }), [forceExplore, params, savedContext]);
  const [audience, setAudience] = useState<'new' | 'existing'>(() => context.route === 'repeat' ? 'existing' : 'new');
  const [products, setProducts] = useState<ShowcaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<number[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    getShowcaseProducts(controller.signal).then(setProducts).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const relevantFamilies = useMemo(
    () => needFamilies[context.need] || businessFamilies[context.business] || ['hot', 'cold', 'dessert', 'accessories'],
    [context.business, context.need],
  );
  const recommendations = useMemo(
    () => representativeShortlist(products, relevantFamilies, primaryFamily[context.need]),
    [context.need, products, relevantFamilies],
  );

  useEffect(() => {
    setCompareIds(recommendations.slice(0, 2).map((product) => product.id));
  }, [recommendations]);

  const comparisonProducts = recommendations.filter((product) => compareIds.includes(product.id));
  const liveCatalogue = products.length > 0 && products.every((product) => product.source === 'live-catalogue');
  const hasContext = Boolean(context.business || context.need || context.route);
  const hasCompletedDecision = Boolean(context.business && context.need && context.route);
  const continueDecisionTo = context.business
    ? `/start?${new URLSearchParams({ business: context.business, ...(context.need ? { need: context.need } : {}) }).toString()}`
    : context.need
      ? `/start?need=${context.need}`
      : '/start?view=business';
  const query = new URLSearchParams({
    business: context.business,
    need: context.need,
    route: context.route || 'sample',
    product: comparisonProducts.map((product) => product.name).join(', '),
  }).toString();

  const toggleCompare = (id: number) => {
    setCompareIds((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : current.length < 3 ? [...current, id] : current);
  };

  if (session?.accountStatus === 'Approved') {
    return <AuthenticatedProductWorkspace products={products} loading={loading} />;
  }

  if (audience === 'existing') {
    return (
      <main className="flex-1 bg-stone-50">
        <section className="border-b border-stone-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="section-kicker">{t('Customer product workspace', '客户产品工作台')}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl">{t('Existing customers should begin with their approved products.', '老客户应该从自己已确认的产品开始。')}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">{t('Public products are not a substitute for your customer codes, approved specifications and order history.', '公开产品无法代替您的客户产品代码、已确认规格和历史订单。')}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-7 inline-grid grid-cols-2 rounded-2xl bg-stone-200 p-1">
            <button type="button" onClick={() => setAudience('new')} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-500">{t('New packaging', '新包装需求')}</button>
            <button type="button" className="rounded-xl bg-jade-950 px-4 py-2.5 text-sm font-bold text-white">{t('Existing supply', '现有供货')}</button>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-jade-950 p-8 text-white sm:p-10 lg:p-12">
            <div className="grid gap-9 lg:grid-cols-[1fr_0.9fr] lg:items-end">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300 text-jade-950"><RefreshCcw size={23} /></div>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.15em] text-lime-300">{t('Secure account data', '安全的账户数据')}</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{t('Continue without rebuilding the product decision.', '无需重新建立产品决策，直接继续。')}</h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-jade-100/65">{t('After sign-in, begin from the products and orders already connected to your account. This public page will not guess or expose them.', '登录后可从已关联到账户的产品和订单开始。公开页面不会猜测或暴露这些信息。')}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/12 bg-white/7 p-6">
                <div className="space-y-4">
                  {[["Approved customer products", "已确认的客户产品"], ["Previous orders and quantities", "历史订单与数量"], ["Repeat supply and delivery progress", "重复供货与配送进度"]].map(([en, zh]) => <p key={en} className="flex items-center gap-3 text-sm font-semibold text-jade-100/80"><Check className="shrink-0 text-lime-300" size={16} />{t(en, zh)}</p>)}
                </div>
                <Link to="/login" className="mt-7 inline-flex items-center gap-2 rounded-full bg-lime-300 px-6 py-3 text-sm font-bold text-jade-950 no-underline"><LogIn size={16} />{t('Sign in to my products', '登录查看我的产品')}</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!hasCompletedDecision) {
    return (
      <main className="flex-1 bg-stone-50">
        <section className="border-b border-stone-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-4xl">
                <p className="section-kicker">{t('Product decision workspace', '产品决策工作台')}</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl">{t('Complete the brief before comparing real products.', '先完成需求决策，再比较真实产品。')}</h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">{t('This page now focuses on narrowing the decision. Complete the business, packaging family and purchase route so the portal can prepare a responsible shortlist.', '这个页面现在专注于缩小采购范围。请先完成业务类型、包装类别和采购路线，门户才能准备负责任的候选产品。')}</p>
              </div>
              <div className="inline-grid grid-cols-2 rounded-2xl bg-stone-200 p-1">
                <button type="button" className="rounded-xl bg-jade-950 px-4 py-2.5 text-sm font-bold text-white">{t('New packaging', '新包装需求')}</button>
                <button type="button" onClick={() => setAudience('existing')} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-500">{t('Existing supply', '现有供货')}</button>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-lime-200 text-jade-950">
            <div className="grid lg:grid-cols-[1fr_0.9fr]">
              <div className="p-7 sm:p-9 lg:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-jade-950 text-lime-300"><PackageCheck size={23} /></div>
                <p className="mt-7 text-xs font-bold uppercase tracking-[0.15em] text-jade-800">{t('Product decision not complete', '产品决策尚未完成')}</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{t('Complete three choices to receive a useful shortlist.', '完成三项选择，再获得有用的候选产品。')}</h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-jade-900/70">{t('The portal needs your business type, packaging family and preferred starting route before it can narrow real Jadcup products responsibly.', '客户门户需要先了解您的业务类型、包装类别和希望的起始路线，才能负责任地缩小真实Jadcup产品范围。')}</p>
                <Link to={continueDecisionTo} className="mt-7 inline-flex items-center gap-2 rounded-full bg-jade-950 px-6 py-3 text-sm font-bold text-white no-underline">{hasContext ? t('Continue my product decision', '继续我的产品决策') : t('Start my product decision', '开始我的产品决策')} <ArrowRight size={15} /></Link>
              </div>
              <div className="border-t border-jade-900/10 bg-white/35 p-7 sm:p-9 lg:border-l lg:border-t-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-jade-800">{t('Your progress', '您的进度')}</p>
                <div className="mt-5 space-y-3">
                  {[
                    [t('Business type', '业务类型'), Boolean(context.business), localizedLabel(businessLabels, context.business, language, ['Choose the closest operation', '选择最接近的经营场景'])],
                    [t('Packaging family', '包装类别'), Boolean(context.need), localizedLabel(needLabels, context.need, language, ['Choose a product direction', '选择产品方向'])],
                    [t('Starting route', '起始路线'), Boolean(context.route), localizedLabel(routeLabels, context.route, language, ['Choose standard, custom, sample or repeat', '选择标准、定制、样品或继续供货'])],
                  ].map(([label, complete, value], index) => (
                    <div key={label as string} className="flex items-start gap-4 rounded-2xl border border-jade-900/10 bg-white/55 p-4">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black ${complete ? 'bg-jade-950 text-lime-300' : 'bg-white text-stone-400'}`}>{complete ? <Check size={16} /> : `0${index + 1}`}</span>
                      <div><p className="text-sm font-bold text-jade-950">{label as string}</p><p className="mt-1 text-xs leading-relaxed text-jade-900/60">{value as string}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-4xl">
              <p className="section-kicker">{t('Packaging selection workspace', '包装选择工作台')}</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl">{t('Make a product decision—not another catalogue search.', '完成产品决策，而不是再浏览一次目录。')}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">{t('The shortlist uses representative products currently approved for portal display from Jadcup product data, then keeps only the families relevant to your brief.', '候选列表来自Jadcup产品数据中当前允许在门户展示的代表性产品，并只保留与您需求相关的品类。')}</p>
            </div>
            <div className="inline-grid grid-cols-2 rounded-2xl bg-stone-200 p-1">
              <button type="button" className="rounded-xl bg-jade-950 px-4 py-2.5 text-sm font-bold text-white">{t('New packaging', '新包装需求')}</button>
              <button type="button" onClick={() => setAudience('existing')} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-500">{t('Existing supply', '现有供货')}</button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-jade-700">{t('Current purchasing context', '当前采购背景')}</p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-950">{hasContext ? t('Your earlier choices are shaping this shortlist.', '您之前的选择正在缩小候选范围。') : t('Choose a business context for a tailored shortlist.', '选择业务背景，获得更有针对性的候选列表。')}</h2>
            </div>
            <Link to="/start?view=business" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-jade-800 no-underline">{t('Change the brief', '修改需求')} <ArrowRight size={14} /></Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              [t('Business', '业务类型'), localizedLabel(businessLabels, context.business, language, ['Not selected', '未选择'])],
              [t('Packaging family', '包装类别'), localizedLabel(needLabels, context.need, language, ['Representative range', '代表性产品组合'])],
              [t('Purchase route', '采购路线'), localizedLabel(routeLabels, context.route, language, ['Compare and narrow', '比较并缩小范围'])],
            ].map(([label, value]) => <div key={label} className="rounded-2xl bg-stone-50 p-4"><p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-stone-400">{label}</p><p className="mt-2 text-sm font-semibold text-gray-950">{value}</p></div>)}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">{t('Representative shortlist', '代表性候选产品')}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-gray-950">{t('Compare a few useful options, not every SKU.', '比较少量有用选项，而不是所有SKU。')}</h2>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${liveCatalogue ? 'bg-jade-100 text-jade-800' : 'bg-amber-100 text-amber-800'}`}><ShieldCheck size={14} />{liveCatalogue ? t('Live Jadcup catalogue records', 'Jadcup实时产品记录') : t('Verified catalogue snapshot', '已验证的产品快照')}</div>
        </div>

        {loading ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-96 animate-pulse rounded-[1.5rem] bg-stone-200" aria-hidden="true" />)}</div>
        ) : recommendations.length > 0 ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {recommendations.map((product) => {
              const localized = language === 'zh' ? productChinese[product.id] : undefined;
              const comparing = compareIds.includes(product.id);
              return (
                <article key={product.id} className={`overflow-hidden rounded-[1.5rem] border bg-white transition ${comparing ? 'border-jade-700 shadow-md' : 'border-stone-200'}`}>
                  <div className="grid sm:grid-cols-[0.8fr_1.2fr]">
                    <div className="min-h-56 bg-jade-50 p-5"><img src={product.image || productArtwork[product.id] || '/img/highlight-packaging.svg'} alt="" className="h-full w-full object-contain" /></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-jade-700">{localized?.category || product.category}</p><span className="text-[0.65rem] font-semibold text-stone-400">#{product.id}</span></div>
                      <h3 className="mt-3 text-xl font-semibold capitalize text-gray-950">{localized?.name || product.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-stone-600">{t(familyReasons[product.family][0], familyReasons[product.family][1])}</p>
                      <dl className="mt-5 space-y-3 text-xs">
                        <div className="flex items-start justify-between gap-4 border-t border-stone-100 pt-3"><dt className="text-stone-400">{t('Material', '材质')}</dt><dd className="max-w-[65%] text-right font-semibold text-stone-700">{localized?.material || product.material}</dd></div>
                        <div className="flex items-start justify-between gap-4 border-t border-stone-100 pt-3"><dt className="text-stone-400">{t('Pack format', '包装规格')}</dt><dd className="max-w-[65%] text-right font-semibold text-stone-700">{localized?.packSize || product.packSize}</dd></div>
                      </dl>
                      <button type="button" onClick={() => toggleCompare(product.id)} className={`mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${comparing ? 'bg-jade-950 text-white' : 'border border-stone-300 text-jade-900'}`}><GitCompareArrows size={14} />{comparing ? t('Added to comparison', '已加入比较') : t('Add to comparison', '加入比较')}</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-7 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-7 sm:p-8">
            <PackageCheck className="text-amber-700" size={25} />
            <h2 className="mt-5 text-2xl font-semibold text-gray-950">{t('No verified representative is available for this family in the portal dataset yet.', '当前门户数据中暂时没有该品类的已验证代表产品。')}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">{t('The portal will not substitute an unrelated product. Send the business need to Jadcup so the team can confirm an actual item.', '门户不会用无关产品替代推荐。请将业务需求发给Jadcup，由团队确认真实货品。')}</p>
            <Link to={`/sample?${new URLSearchParams({ business: context.business, need: context.need, route: 'sample' }).toString()}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-jade-950 px-6 py-3 text-sm font-bold text-white no-underline">{t('Ask Jadcup to confirm', '请Jadcup确认')} <ArrowRight size={15} /></Link>
          </div>
        )}

        {comparisonProducts.length > 0 && (
          <section className="mt-12 overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white">
            <div className="border-b border-stone-200 p-6 sm:p-7">
              <p className="section-kicker">{t('Comparison workspace', '产品比较工作区')}</p>
              <h2 className="mt-3 text-2xl font-semibold text-gray-950">{t('Compare the details that affect the next decision.', '比较会影响下一步决策的信息。')}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
                <thead><tr className="bg-stone-50"><th className="w-40 px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-stone-400">{t('Decision point', '决策项')}</th>{comparisonProducts.map((product) => <th key={product.id} className="px-5 py-4 font-semibold text-gray-950">{language === 'zh' ? productChinese[product.id]?.name || product.name : product.name}</th>)}</tr></thead>
                <tbody>
                  {[
                    [t('Role in the range', '在产品组合中的作用'), (product: ShowcaseProduct) => t(familyReasons[product.family][0], familyReasons[product.family][1])],
                    [t('Material', '材质'), (product: ShowcaseProduct) => language === 'zh' ? productChinese[product.id]?.material || product.material : product.material],
                    [t('Pack format', '包装规格'), (product: ShowcaseProduct) => language === 'zh' ? productChinese[product.id]?.packSize || product.packSize : product.packSize],
                    [t('Catalogue record', '产品数据记录'), (product: ShowcaseProduct) => product.source === 'live-catalogue' ? t('Live public record', '实时公开记录') : t('Verified snapshot', '已验证快照')],
                  ].map(([label, getter]) => (
                    <tr key={label as string} className="border-t border-stone-100"><th className="px-6 py-4 text-xs font-semibold text-stone-500">{label as string}</th>{comparisonProducts.map((product) => <td key={product.id} className="max-w-xs px-5 py-4 text-sm leading-relaxed text-stone-700">{(getter as (item: ShowcaseProduct) => string)(product)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-4 border-t border-stone-200 bg-jade-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div><h3 className="text-xl font-semibold">{t('Ready to validate the shortlist?', '准备验证候选产品了吗？')}</h3><p className="mt-1 text-sm text-jade-100/65">{t('Carry these real product references into a sample and quotation brief.', '将这些真实产品参考带入样品与报价需求。')}</p></div>
              <Link to={`/sample?${query}`} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-lime-300 px-6 py-3 text-sm font-bold text-jade-950 no-underline">{t('Prepare sample or quote', '准备样品或报价')} <ArrowRight size={15} /></Link>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
