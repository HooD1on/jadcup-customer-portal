import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Coffee,
  CupSoda,
  IceCreamBowl,
  PackageCheck,
  PartyPopper,
  RefreshCcw,
  Search,
  Sparkles,
  Store,
  Utensils,
} from 'lucide-react';
import { useLanguage, type PortalLanguage } from '../language/LanguageContext';

type FinderChoice = {
  value: string;
  label: string;
  labelZh: string;
  description: string;
  descriptionZh: string;
  icon: typeof Coffee;
};

const businessChoices: FinderChoice[] = [
  {
    value: 'cafe',
    label: 'Café, coffee roastery or beverage brand',
    labelZh: '咖啡馆、咖啡烘焙或饮品品牌',
    description: 'Coffee shops, roasters and everyday hot or cold drink service.',
    descriptionZh: '咖啡门店、烘焙品牌及日常冷热饮服务。',
    icon: Coffee,
  },
  {
    value: 'foodservice',
    label: 'Restaurant, takeaway or lunch bar',
    labelZh: '餐厅、外卖或Lunch Bar',
    description: 'Food prepared for takeaway, delivery or counter service.',
    descriptionZh: '面向外带、配送或柜台交付的餐饮业务。',
    icon: Utensils,
  },
  {
    value: 'cold-dessert',
    label: 'Bubble tea, cold drinks or ice cream',
    labelZh: '奶茶、冷饮或冰淇淋业务',
    description: 'Bubble tea, juice, shakes, gelato and frozen desserts.',
    descriptionZh: '奶茶、果汁、奶昔、Gelato和冷冻甜品。',
    icon: CupSoda,
  },
  {
    value: 'bakery',
    label: 'Bakery, cake shop or dessert counter',
    labelZh: '烘焙店、蛋糕店或甜品柜台',
    description: 'Cakes, pastries and food that needs presentation and protection.',
    descriptionZh: '需要兼顾展示、保护与外带体验的蛋糕和烘焙食品。',
    icon: Store,
  },
  {
    value: 'institution',
    label: 'Institution, catering or event service',
    labelZh: '机构、餐饮服务或活动供应',
    description: 'Hospitals, churches, caterers, workplaces and organised events.',
    descriptionZh: '医院、教会、团餐、企业场所及组织活动。',
    icon: PartyPopper,
  },
  {
    value: 'trade',
    label: 'Multi-site brand, distributor or reseller',
    labelZh: '连锁品牌、经销商或包装采购商',
    description: 'Franchises, packaging companies and buyers managing several product lines.',
    descriptionZh: '连锁门店、包装公司及需要管理多条产品线的采购方。',
    icon: PackageCheck,
  },
];

const packagingCatalog: Record<string, FinderChoice> = {
  hot: {
    value: 'hot',
    label: 'Hot cups and matching lids',
    labelZh: '热饮纸杯与配套杯盖',
    description: 'Single-wall and double-wall cups, sizes, lids and insulation.',
    descriptionZh: '单层杯、双层杯、尺寸、杯盖与隔热体验。',
    icon: Coffee,
  },
  cold: {
    value: 'cold',
    label: 'Clear and cold drink cups',
    labelZh: '透明杯与冷饮杯',
    description: 'PET or PLA clear cups, milkshake cups and matching lids.',
    descriptionZh: 'PET或PLA透明杯、奶昔杯及配套杯盖。',
    icon: CupSoda,
  },
  dessert: {
    value: 'dessert',
    label: 'Ice cream and dessert cups',
    labelZh: '冰淇淋杯与甜品杯',
    description: 'Coated paper cups for gelato, ice cream and cold desserts.',
    descriptionZh: '适合Gelato、冰淇淋和冷冻甜品的淋膜纸杯。',
    icon: IceCreamBowl,
  },
  food: {
    value: 'food',
    label: 'Bowls, takeaway boxes and trays',
    labelZh: '餐碗、外卖盒与纸托盘',
    description: 'Core containers for hot, cold, wet or dry food.',
    descriptionZh: '适合热食、冷食、含汤汁或干燥食品的核心容器。',
    icon: Utensils,
  },
  wrap: {
    value: 'wrap',
    label: 'Deli and greaseproof paper',
    labelZh: '食品包装纸与防油纸',
    description: 'Wrapping paper for sandwiches, pastries and greasy food.',
    descriptionZh: '适合三明治、烘焙食品和含油食品的包装纸。',
    icon: Store,
  },
  bags: {
    value: 'bags',
    label: 'Paper bags and counter essentials',
    labelZh: '纸袋与柜台配套用品',
    description: 'Takeaway bags, napkins and supporting service packaging.',
    descriptionZh: '外带纸袋、餐巾纸及配套服务用品。',
    icon: PackageCheck,
  },
  bakery: {
    value: 'bakery',
    label: 'Cake boxes and bakery packaging',
    labelZh: '蛋糕盒与烘焙包装',
    description: 'Boxes, bags, wraps and labels for cakes and pastries.',
    descriptionZh: '适合蛋糕和烘焙食品的盒、袋、包装纸与标签。',
    icon: Store,
  },
  system: {
    value: 'system',
    label: 'A coordinated packaging range',
    labelZh: '统一的多产品包装组合',
    description: 'Several products that should look, work and replenish together.',
    descriptionZh: '让多种包装在视觉、使用和补货上形成统一体系。',
    icon: Sparkles,
  },
};

const packagingByBusiness: Record<string, string[]> = {
  cafe: ['hot', 'cold', 'bags', 'system'],
  foodservice: ['food', 'wrap', 'bags', 'system'],
  'cold-dessert': ['cold', 'dessert', 'bags', 'system'],
  bakery: ['bakery', 'wrap', 'bags', 'system'],
  institution: ['hot', 'food', 'bags', 'system'],
  trade: ['hot', 'cold', 'food', 'system'],
};

function routeChoice(
  value: string,
  label: string,
  labelZh: string,
  description: string,
  descriptionZh: string,
  icon: FinderChoice['icon'],
): FinderChoice {
  return { value, label, labelZh, description, descriptionZh, icon };
}

const decisionsByPackaging: Record<string, FinderChoice[]> = {
  hot: [
    routeChoice('standard', 'Match a standard cup and lid', '匹配标准杯型与杯盖', 'Choose a plain single- or double-wall cup, size, lid and carton quantity.', '选择普通单层或双层杯、尺寸、杯盖和整箱数量。', PackageCheck),
    routeChoice('custom', 'Create a branded paper cup', '开始定制品牌纸杯', 'Confirm print direction, artwork, minimum quantity, sample and production timing.', '确认印刷方向、设计稿、最低订购量、样品和生产周期。', Sparkles),
    routeChoice('sample', 'Compare cup construction and samples', '比较杯型结构与样品', 'Evaluate wall construction, hand feel, capacity and lid fit before quoting.', '报价前比较杯壁结构、手感、容量和杯盖适配性。', Search),
    routeChoice('repeat', 'Continue an approved cup', '继续已确认的杯型', 'Begin from a customer product code or a previous Jadcup order.', '从客户产品代码或历史Jadcup订单继续采购。', RefreshCcw),
  ],
  cold: [
    routeChoice('standard', 'Match a clear cup and lid', '匹配透明杯与杯盖', 'Choose the material, capacity, rim size, lid and carton quantity.', '选择材质、容量、杯口尺寸、杯盖和整箱数量。', PackageCheck),
    routeChoice('custom', 'Create a branded cold cup', '开始定制品牌冷饮杯', 'Confirm the visible product, print area, artwork, quantity and timing.', '确认内容物展示、印刷区域、设计稿、数量和时间。', Sparkles),
    routeChoice('sample', 'Compare material and physical samples', '比较材质与实物样品', 'Evaluate PET or PLA clarity, rigidity, capacity and lid fit.', '比较PET或PLA的透明度、硬度、容量和杯盖适配性。', Search),
    routeChoice('repeat', 'Continue an approved cold cup', '继续已确认的冷饮杯', 'Return to an approved cup, lid combination or previous order.', '从已确认的杯盖组合或历史订单继续采购。', RefreshCcw),
  ],
  dessert: [
    routeChoice('standard', 'Match a dessert cup and size', '匹配甜品杯型与尺寸', 'Choose capacity, coating, lid needs and carton quantity.', '选择容量、淋膜、杯盖需求和整箱数量。', PackageCheck),
    routeChoice('custom', 'Create a branded ice cream cup', '开始定制品牌冰淇淋杯', 'Confirm artwork, print coverage, minimum quantity, sample and lead time.', '确认设计稿、印刷范围、最低订购量、样品和交期。', Sparkles),
    routeChoice('sample', 'Test coating, fit and presentation', '测试淋膜、适配与展示效果', 'Compare moisture resistance, capacity, spoon or lid fit and print quality.', '比较防潮性、容量、勺盖适配与印刷效果。', Search),
    routeChoice('repeat', 'Continue an approved dessert cup', '继续已确认的甜品杯', 'Begin from an existing cup specification or previous Jadcup order.', '从现有杯型规格或历史Jadcup订单继续采购。', RefreshCcw),
  ],
  food: [
    routeChoice('standard', 'Match the food container and lid', '匹配食品容器与盖型', 'Choose the format around portion, temperature, liquid and carton quantity.', '根据份量、温度、汤汁和整箱数量选择包装形式。', PackageCheck),
    routeChoice('custom', 'Create a branded takeaway range', '开始定制品牌外卖包装', 'Confirm the core container, artwork, quantity, accessories and timing.', '确认核心容器、设计稿、数量、配套用品和时间。', Sparkles),
    routeChoice('sample', 'Test heat, grease and leak performance', '测试耐热、防油与防漏表现', 'Use physical samples to check fit, closure, handling and food presentation.', '通过实物样品检查适配、封合、拿取与食品展示。', Search),
    routeChoice('repeat', 'Continue an approved food pack', '继续已确认的食品包装', 'Return to a customer product code, container set or previous order.', '从客户产品代码、容器组合或历史订单继续采购。', RefreshCcw),
  ],
  wrap: [
    routeChoice('standard', 'Choose a stock paper and size', '选择标准包装纸与尺寸', 'Match the food, sheet size, grease resistance and pack quantity.', '匹配食品类型、纸张尺寸、防油要求和包装数量。', PackageCheck),
    routeChoice('custom', 'Create custom printed wrapping paper', '开始定制印刷包装纸', 'Confirm artwork repeat, sheet size, material, quantity and timing.', '确认图案循环、纸张尺寸、材质、数量和时间。', Sparkles),
    routeChoice('sample', 'Compare grease resistance and handling', '比较防油性与使用手感', 'Test folding, food contact, print result and counter workflow.', '测试折叠、食品接触、印刷效果和柜台操作。', Search),
    routeChoice('repeat', 'Continue an approved paper', '继续已确认的包装纸', 'Begin from an existing size, print specification or previous order.', '从现有尺寸、印刷规格或历史订单继续采购。', RefreshCcw),
  ],
  bags: [
    routeChoice('standard', 'Choose a practical bag and essentials', '选择合适的纸袋与配套用品', 'Match bag size, handle, strength, napkins and carton quantity.', '匹配纸袋尺寸、提手、承重、餐巾纸和整箱数量。', PackageCheck),
    routeChoice('custom', 'Create printed bags or napkins', '开始定制印刷纸袋或餐巾纸', 'Confirm artwork, print area, material, quantity and production timing.', '确认设计稿、印刷区域、材质、数量和生产周期。', Sparkles),
    routeChoice('sample', 'Compare size, strength and presentation', '比较尺寸、承重与展示效果', 'Use samples to check carry comfort, counter fit and brand appearance.', '通过样品检查携带体验、柜台适配与品牌呈现。', Search),
    routeChoice('repeat', 'Continue approved counter supplies', '继续已确认的柜台用品', 'Return to an approved bag, napkin or previous supply order.', '从已确认的纸袋、餐巾纸或历史供货订单继续采购。', RefreshCcw),
  ],
  bakery: [
    routeChoice('standard', 'Match a cake box or bakery pack', '匹配蛋糕盒或烘焙包装', 'Choose product dimensions, protection, carry format and carton quantity.', '根据产品尺寸、保护需求、携带方式和整箱数量选择。', PackageCheck),
    routeChoice('custom', 'Create branded bakery packaging', '开始定制品牌烘焙包装', 'Confirm box or bag format, artwork, quantity, sample and timing.', '确认盒袋形式、设计稿、数量、样品和时间。', Sparkles),
    routeChoice('sample', 'Test fit, protection and presentation', '测试适配、保护与展示效果', 'Use samples to check pastry fit, grease contact, closure and transport.', '通过样品检查烘焙食品适配、防油、封合与运输。', Search),
    routeChoice('repeat', 'Continue an approved bakery pack', '继续已确认的烘焙包装', 'Begin from an existing box, bag, wrap or previous order.', '从现有盒、袋、包装纸或历史订单继续采购。', RefreshCcw),
  ],
  system: [
    routeChoice('standard', 'Build a practical standard range', '建立实用的标准产品组合', 'Start with the highest-use items, then match accessories and replenishment.', '从使用量最高的产品开始，再匹配配套用品与补货方式。', PackageCheck),
    routeChoice('custom', 'Create a coordinated brand system', '建立统一品牌包装系统', 'Align artwork across the main packaging touchpoints, quantities and rollout timing.', '统一主要包装接触点的设计稿、数量与上线时间。', Sparkles),
    routeChoice('sample', 'Sample the key customer touchpoints', '先测试关键顾客接触点', 'Compare the core products together before committing to the full range.', '在确定整套产品前，先组合比较核心包装样品。', Search),
    routeChoice('repeat', 'Continue an approved product range', '继续已确认的产品组合', 'Use approved customer products and previous orders to plan the next supply cycle.', '使用已确认的客户产品和历史订单规划下一轮供货。', RefreshCcw),
  ],
};

const stepLabels = [['Business', '业务'], ['Packaging', '包装'], ['Decision', '决策']];

interface FinderState {
  business: string;
  need: string;
  route: string;
}

const emptyFinder: FinderState = { business: '', need: '', route: '' };
const FINDER_KEY = 'jadcup.portal.packaging-finder';

function packagingChoicesForBusiness(business: string): FinderChoice[] {
  return (packagingByBusiness[business] || []).map((value) => packagingCatalog[value]).filter(Boolean);
}

function readFinder(): FinderState {
  try {
    const parsed = JSON.parse(localStorage.getItem(FINDER_KEY) || '') as Partial<FinderState>;
    const business = typeof parsed.business === 'string' && businessChoices.some((choice) => choice.value === parsed.business)
      ? parsed.business
      : '';
    const allowedNeeds = packagingChoicesForBusiness(business);
    const need = typeof parsed.need === 'string' && allowedNeeds.some((choice) => choice.value === parsed.need)
      ? parsed.need
      : '';
    const route = typeof parsed.route === 'string' && decisionsByPackaging[need]?.some((choice) => choice.value === parsed.route)
      ? parsed.route
      : '';
    return { business, need, route };
  } catch {
    return emptyFinder;
  }
}

function selectedLabel(choice: FinderChoice | undefined, language: PortalLanguage, fallback: string) {
  if (!choice) return fallback;
  return language === 'zh' ? choice.labelZh : choice.label;
}

function recommendation(state: FinderState, language: PortalLanguage) {
  const chinese = language === 'zh';
  const businessChoice = businessChoices.find((choice) => choice.value === state.business);
  const needChoice = packagingCatalog[state.need];
  const routeChoiceItem = decisionsByPackaging[state.need]?.find((choice) => choice.value === state.route);
  const business = selectedLabel(businessChoice, language, chinese ? '您的业务' : 'Your business');
  const need = selectedLabel(needChoice, language, chinese ? '食品包装' : 'Food packaging');
  const route = selectedLabel(routeChoiceItem, language, chinese ? '实用的采购起点' : 'A practical purchasing route');

  const nextSteps: Record<string, { en: string; zh: string }> = {
    standard: {
      en: 'Compare suitable standard products, then confirm size, carton quantity and required delivery date.',
      zh: '比较适合的标准产品，再确认尺寸、整箱数量和要求交付日期。',
    },
    custom: {
      en: 'Prepare a sample and quotation request so Jadcup can confirm artwork, minimum quantity and production timing.',
      zh: '准备样品与报价需求，由Jadcup确认设计稿、最低订购量和生产时间。',
    },
    sample: {
      en: 'Request physical samples so the team can compare product fit, material performance and matching accessories.',
      zh: '申请实物样品，让团队比较产品适配性、材料表现和配套用品。',
    },
    repeat: {
      en: 'Sign in and begin from an approved customer product code or a previous order instead of rebuilding the requirement.',
      zh: '登录后从已确认的客户产品代码或历史订单开始，无需重新整理需求。',
    },
  };

  return {
    title: chinese ? `${business}的${need}` : `${need} for ${business}`,
    description: chinese
      ? routeChoiceItem?.descriptionZh || '从实物样品和简短包装需求开始。'
      : routeChoiceItem?.description || 'Start with a physical sample and a short packaging brief.',
    route,
    nextStep: chinese ? nextSteps[state.route]?.zh : nextSteps[state.route]?.en,
  };
}

export function PackagingFinderPage() {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const browseAllBusinesses = searchParams.get('view') === 'business';
  const presetBusiness = searchParams.get('business');
  const presetNeed = searchParams.get('need');
  const [finder, setFinder] = useState<FinderState>(() => {
    if (browseAllBusinesses) return emptyFinder;
    if (presetBusiness && businessChoices.some((choice) => choice.value === presetBusiness)) {
      const allowedNeeds = packagingChoicesForBusiness(presetBusiness);
      const need = presetNeed && allowedNeeds.some((choice) => choice.value === presetNeed) ? presetNeed : '';
      return { business: presetBusiness, need, route: '' };
    }
    if (presetNeed && packagingCatalog[presetNeed]) return { business: '', need: presetNeed, route: '' };
    return readFinder();
  });
  const [step, setStep] = useState(() => finder.business ? (finder.need ? (finder.route ? 3 : 2) : 1) : 0);
  const packagingChoices = useMemo(() => packagingChoicesForBusiness(finder.business), [finder.business]);
  const decisionChoices = useMemo(() => decisionsByPackaging[finder.need] || [], [finder.need]);
  const result = useMemo(() => recommendation(finder, language), [finder, language]);

  const steps = useMemo(() => [
    {
      title: 'What kind of operation is this packaging for?',
      titleZh: '这次包装服务于哪类业务？',
      description: 'Jadcup serves different foodservice businesses in different ways. Choose the closest operating context.',
      descriptionZh: 'Jadcup为不同餐饮业务提供不同的包装组合，请选择最接近的经营场景。',
      choices: businessChoices,
      field: 'business' as const,
    },
    {
      title: 'Which packaging family should we start with?',
      titleZh: '先从哪一类包装开始？',
      description: 'These options are matched to the business you selected. You can still discuss other products with Jadcup.',
      descriptionZh: '以下选项已根据您的业务筛选；您仍可以与Jadcup讨论其他产品。',
      choices: packagingChoices,
      field: 'need' as const,
    },
    {
      title: `How would you like to start with ${packagingCatalog[finder.need]?.label?.toLowerCase() || 'this packaging'}?`,
      titleZh: `这次${packagingCatalog[finder.need]?.labelZh || '包装采购'}您想从哪里开始？`,
      description: 'This chooses the most useful next action—not a final production specification.',
      descriptionZh: '这一步用于确定最合适的下一动作，并不会直接生成最终生产规格。',
      choices: decisionChoices,
      field: 'route' as const,
    },
  ], [decisionChoices, finder.need, packagingChoices]);

  useEffect(() => {
    localStorage.setItem(FINDER_KEY, JSON.stringify(finder));
  }, [finder]);

  const choose = (field: keyof FinderState, value: string) => {
    setFinder((previous) => {
      if (field === 'business') {
        const allowedNeeds = packagingChoicesForBusiness(value);
        const need = allowedNeeds.some((choice) => choice.value === previous.need) ? previous.need : '';
        return { business: value, need, route: '' };
      }
      if (field === 'need') return { ...previous, need: value, route: '' };
      return { ...previous, route: value };
    });
  };

  const reset = () => {
    setFinder(emptyFinder);
    setStep(0);
    localStorage.removeItem(FINDER_KEY);
  };

  if (step === 3) {
    const query = new URLSearchParams({
      business: finder.business,
      need: finder.need,
      route: finder.route,
      product: language === 'zh' ? packagingCatalog[finder.need]?.labelZh || '' : packagingCatalog[finder.need]?.label || '',
    }).toString();
    const isRepeat = finder.route === 'repeat';
    const primaryTo = isRepeat ? '/login' : finder.route === 'standard' ? `/products?${query}` : `/sample?${query}`;
    const primaryLabel = isRepeat
      ? t('Sign in to continue', '登录后继续')
      : finder.route === 'standard'
        ? t('Compare suitable products', '比较适合的产品')
        : finder.route === 'custom'
          ? t('Prepare custom quote', '准备定制报价')
          : t('Prepare sample request', '准备样品申请');

    return (
      <main className="flex-1 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-jade-900"><ArrowLeft size={15} />{t('Change an answer', '修改答案')}</button>
          <div className="mt-6 overflow-hidden rounded-[2rem] border border-stone-200 bg-white">
            <div className="bg-jade-950 p-8 text-white sm:p-10 lg:p-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300 text-jade-950"><PackageCheck size={23} /></div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-lime-300">{t('Your starting route', '您的起始方案')}</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">{result.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-jade-100/70">{result.description}</p>
            </div>
            <div className="p-7 sm:p-10">
              <div className="grid gap-5 sm:grid-cols-3">
                {[
                  [t('Business', '业务类型'), selectedLabel(businessChoices.find((choice) => choice.value === finder.business), language, '')],
                  [t('Packaging family', '包装类别'), selectedLabel(packagingCatalog[finder.need], language, '')],
                  [t('Purchase route', '采购起点'), result.route],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-stone-50 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-2 text-sm font-semibold text-gray-950">{value}</p></div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-jade-200 bg-jade-50 p-6">
                <p className="text-sm font-semibold text-jade-950">{t('Best next step', '建议下一步')}：{result.nextStep}</p>
                <p className="mt-2 text-xs leading-relaxed text-jade-800/70">{t('This recommendation is a starting brief, not an automated production specification.', '此建议仅作为初始需求方向，并非自动生成的生产规格。')}</p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to={primaryTo} className="inline-flex items-center justify-center gap-2 rounded-full bg-jade-900 px-6 py-3 text-sm font-bold text-white no-underline">{primaryLabel} <ArrowRight size={16} /></Link>
                {!isRepeat && <Link to={finder.route === 'standard' ? `/sample?${query}` : `/products?${query}`} className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-gray-800 no-underline">{finder.route === 'standard' ? t('Ask for a sample or quote', '申请样品或报价') : t('Compare products', '比较产品')}</Link>}
                <button type="button" onClick={reset} className="px-4 py-3 text-sm font-semibold text-stone-500 hover:text-jade-900">{t('Start again', '重新开始')}</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const current = steps[step];
  const selected = finder[current.field];

  return (
    <main className="flex-1 bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex items-center justify-between gap-5">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 no-underline hover:text-jade-900"><ArrowLeft size={15} />{t('Customer home', '客户首页')}</Link>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{t('About one minute', '大约一分钟')}</p>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2" aria-label={t(`Step ${step + 1} of 3`, `第 ${step + 1} 步，共 3 步`)}>
          {stepLabels.map(([en, zh], index) => (
            <div key={en} className={`rounded-xl px-3 py-3 text-center text-xs font-bold transition ${index === step ? 'bg-jade-950 text-white' : index < step ? 'bg-jade-100 text-jade-800' : 'bg-stone-200 text-stone-500'}`}>
              <span className="mr-1.5 opacity-60">0{index + 1}</span>{t(en, zh)}
            </div>
          ))}
        </div>

        <div className="mt-10 max-w-3xl">
          <p className="section-kicker">{t(`Packaging finder · Step ${step + 1}`, `包装选择器 · 第${step + 1}步`)}</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-gray-950 sm:text-4xl lg:text-5xl">{t(current.title, current.titleZh)}</h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">{t(current.description, current.descriptionZh)}</p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {current.choices.map(({ value, label, labelZh, description, descriptionZh, icon: Icon }) => {
            const active = selected === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => choose(current.field, value)}
                className={`rounded-[1.5rem] border p-6 text-left transition sm:p-7 ${active ? 'border-jade-800 bg-jade-950 text-white shadow-lg' : 'border-stone-200 bg-white text-gray-950 hover:border-jade-300'}`}
                aria-pressed={active}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${active ? 'bg-lime-300 text-jade-950' : 'bg-jade-100 text-jade-800'}`}><Icon size={21} /></div>
                  {active && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-jade-900"><Check size={15} /></span>}
                </div>
                <h2 className="mt-6 text-xl font-semibold">{t(label, labelZh)}</h2>
                <p className={`mt-2 text-sm leading-relaxed ${active ? 'text-jade-100/65' : 'text-stone-600'}`}>{t(description, descriptionZh)}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-9 flex items-center justify-between gap-4 border-t border-stone-200 pt-6">
          <button type="button" onClick={() => setStep((currentStep) => Math.max(0, currentStep - 1))} disabled={step === 0} className="inline-flex items-center gap-2 px-3 py-3 text-sm font-semibold text-stone-600 disabled:invisible"><ArrowLeft size={15} />{t('Back', '返回')}</button>
          <button type="button" onClick={() => setStep((currentStep) => currentStep + 1)} disabled={!selected} className="inline-flex items-center gap-2 rounded-full bg-jade-900 px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{step === 2 ? t('See my starting route', '查看我的起始方案') : t('Continue', '继续')} <ArrowRight size={16} /></button>
        </div>
      </div>
    </main>
  );
}
