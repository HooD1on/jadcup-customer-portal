import { Link, Navigate } from 'react-router-dom';
import {
  ArrowRight,
  Boxes,
  Coffee,
  CupSoda,
  LogIn,
  SearchCheck,
  Store,
  Utensils,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../language/LanguageContext';
import { IndustryInsights } from './IndustryInsights';
import { ProductFamilyCarousel } from './ProductFamilyCarousel';

const businessStarts = [
  { icon: Coffee, title: 'Café & coffee brand', titleZh: '咖啡馆与咖啡品牌', text: 'Cafés, roasteries and beverage service', textZh: '咖啡门店、烘焙品牌与饮品服务', business: 'cafe' },
  { icon: Utensils, title: 'Restaurant & takeaway', titleZh: '餐厅、外卖与Lunch Bar', text: 'Prepared food, delivery and counter service', textZh: '餐食制作、外卖配送与柜台交付', business: 'foodservice' },
  { icon: CupSoda, title: 'Cold drinks & ice cream', titleZh: '奶茶、冷饮与冰淇淋', text: 'Bubble tea, shakes, gelato and desserts', textZh: '奶茶、奶昔、Gelato与冷冻甜品', business: 'cold-dessert' },
  { icon: Store, title: 'Bakery & cake shop', titleZh: '烘焙店与蛋糕店', text: 'Cakes, pastries and dessert counters', textZh: '蛋糕、烘焙食品与甜品柜台', business: 'bakery' },
];

const orderProcess = [
  {
    number: '01',
    owner: 'Your requirement',
    ownerZh: '您的需求',
    title: 'Define the need',
    titleZh: '明确包装需求',
    text: 'Product use, format, quantity, delivery timing and the result the packaging must support.',
    textZh: '说明产品用途、包装形式、数量、交付时间，以及包装需要实现的效果。',
  },
  {
    number: '02',
    owner: 'Choose together',
    ownerZh: '共同选择',
    title: 'Select the product direction',
    titleZh: '选择产品方向',
    text: 'New customers compare suitable formats. Existing customers can begin from previous supply.',
    textZh: '新客户比较适合的杯型与包装；老客户也可以从以往采购记录开始。',
  },
  {
    number: '03',
    owner: 'Jadcup confirms',
    ownerZh: 'Jadcup确认',
    title: 'Sample and quotation',
    titleZh: '样品与报价',
    text: 'Confirm product fit, volume, pricing direction, timing and any physical samples required.',
    textZh: '确认产品适配性、采购数量、报价方向、时间安排和所需实物样品。',
  },
  {
    number: '04',
    owner: 'Your approval',
    ownerZh: '您的确认',
    title: 'Approve the final order',
    titleZh: '确认最终订单',
    text: 'Confirm artwork, quantity, commercial details and delivery information before production.',
    textZh: '生产前确认设计稿、数量、商务信息和配送资料。',
  },
  {
    number: '05',
    owner: 'Jadcup produces',
    ownerZh: 'Jadcup生产',
    title: 'Production and quality',
    titleZh: '生产与质量检查',
    text: 'The approved order moves through manufacturing, quality checks and dispatch preparation.',
    textZh: '已确认订单进入制造、质量检查和发货准备阶段。',
  },
  {
    number: '06',
    owner: 'Continue supply',
    ownerZh: '持续供货',
    title: 'Delivery and repeat ordering',
    titleZh: '配送与重复订购',
    text: 'Follow delivery, keep the approved product history and make the next order easier.',
    textZh: '跟踪配送、保留已确认产品记录，让下一次订购更快速。',
  },
];

export function HomePage() {
  const { session, isInitializing } = useAuth();
  const { t } = useLanguage();

  if (!isInitializing && session) {
    return <Navigate to={session.accountStatus === 'Approved' ? '/dashboard' : '/application-status'} replace />;
  }

  return (
    <main className="flex-1 bg-stone-50">
      <section className="overflow-hidden border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
            <div>
              <p className="section-kicker">{t('Jadcup Customer Portal', 'Jadcup 客户门户')}</p>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-gray-950 sm:text-5xl lg:text-6xl">
                {t('Move your packaging forward.', '让您的包装项目继续向前。')}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
                {t('Find a practical product direction, request a sample, or continue the orders and supply already connected to your Jadcup account.', '找到合适的产品方向、申请样品，或继续处理已关联到您Jadcup账户的订单与供货。')}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/start" className="inline-flex items-center justify-center gap-2 rounded-full bg-jade-950 px-6 py-3.5 text-sm font-bold text-white no-underline">{t('Start a packaging project', '开始包装项目')} <ArrowRight size={16} /></Link>
                <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3.5 text-sm font-bold text-jade-900 no-underline">{t('Customer sign in', '客户登录')} <LogIn size={16} /></Link>
              </div>
              <a href="#product-families" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 no-underline hover:text-jade-800">{t('Or browse product starting points', '或先浏览产品方向')} <ArrowRight size={14} /></a>
            </div>

            <div className="rounded-[2rem] bg-jade-950 p-6 text-white shadow-xl sm:p-8">
              <div className="flex items-center justify-between gap-5">
                <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-300">{t('Start with your business', '从您的业务开始')}</p><h2 className="mt-2 text-2xl font-semibold">{t('What kind of business needs packaging?', '哪种业务需要包装？')}</h2></div>
                <Boxes className="hidden text-lime-300 sm:block" size={27} />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {businessStarts.map(({ icon: Icon, title, titleZh, text, textZh, business }) => (
                  <Link key={business} to={`/start?business=${business}`} className="group rounded-2xl border border-white/12 bg-white/7 p-4 text-white no-underline transition hover:border-lime-300/50 hover:bg-white/10">
                    <div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lime-300"><Icon size={19} /></span><ArrowRight className="mt-2 text-jade-100/50 transition group-hover:translate-x-1 group-hover:text-lime-300" size={15} /></div>
                    <h3 className="mt-4 text-sm font-semibold">{t(title, titleZh)}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-jade-100/55">{t(text, textZh)}</p>
                  </Link>
                ))}
              </div>
              <Link to="/start?view=business" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold leading-relaxed text-jade-100/55 no-underline transition hover:text-lime-300">{t('Institution, catering, multi-site brand or reseller? View all business types.', '机构、团餐、连锁品牌或经销采购？查看全部业务类型。')} <ArrowRight size={13} /></Link>
            </div>
          </div>
        </div>
      </section>

      <ProductFamilyCarousel />

      <section className="border-y border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div><p className="section-kicker">{t('How ordering with Jadcup works', '如何向Jadcup订购')}</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-4xl">{t('One purchasing journey, from the first brief to repeat supply.', '从首次需求到持续供货，一套清晰的采购流程。')}</h2></div>
            <p className="max-w-2xl text-base leading-relaxed text-stone-600 lg:justify-self-end">{t('New customers begin by defining the need. Existing customers can begin from an approved product or previous order—but confirmation, production and delivery follow the same clear path.', '新客户从明确需求开始；老客户可以从已确认产品或历史订单开始。但确认、生产和配送都会遵循同一套清晰流程。')}</p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orderProcess.map((item, index) => {
              const isStart = index === 0;
              const isFinish = index === orderProcess.length - 1;
              return (
                <article key={item.number} className={`flex min-h-64 flex-col rounded-[1.5rem] border p-6 sm:p-7 ${isStart ? 'border-jade-950 bg-jade-950 text-white' : isFinish ? 'border-lime-300 bg-lime-200 text-jade-950' : 'border-stone-200 bg-stone-50 text-gray-950'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-black ${isStart ? 'bg-lime-300 text-jade-950' : isFinish ? 'bg-jade-950 text-white' : 'bg-jade-100 text-jade-800'}`}>{item.number}</span>
                    <span className={`rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] ${isStart ? 'bg-white/10 text-jade-100' : isFinish ? 'bg-jade-950/10 text-jade-900' : 'bg-white text-stone-500'}`}>{t(item.owner, item.ownerZh)}</span>
                  </div>
                  <h3 className="mt-7 text-xl font-semibold">{t(item.title, item.titleZh)}</h3>
                  <p className={`mt-3 text-sm leading-relaxed ${isStart ? 'text-jade-100/65' : isFinish ? 'text-jade-900/70' : 'text-stone-600'}`}>{t(item.text, item.textZh)}</p>
                  {index < orderProcess.length - 1 && <div className="mt-auto pt-6"><ArrowRight className={isStart ? 'text-lime-300' : 'text-jade-600'} size={20} /></div>}
                  {isFinish && <p className="mt-auto pt-6 text-xs font-bold uppercase tracking-[0.14em] text-jade-900">{t('Ready for the next order', '为下一次订购做好准备')}</p>}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <IndustryInsights />

      <section className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[1.5rem] border border-stone-200 bg-white p-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3"><SearchCheck className="mt-0.5 shrink-0 text-jade-700" size={19} /><div><p className="text-sm font-semibold text-gray-950">{t('Looking for general company information?', '需要了解Jadcup公司信息？')}</p><p className="mt-1 text-sm text-stone-500">{t('Company background and the full public overview remain on the Jadcup website.', '公司背景和完整公开介绍仍在Jadcup官网提供。')}</p></div></div>
          <a href="https://jadcup.co.nz/" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-jade-800">{t('Visit Jadcup website', '访问Jadcup官网')} <ArrowRight size={14} /></a>
        </div>
      </section>
    </main>
  );
}
