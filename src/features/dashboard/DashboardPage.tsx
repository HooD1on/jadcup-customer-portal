import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  FileCheck2,
  Headphones,
  PackageCheck,
  RefreshCcw,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ProductImage } from '../../components/ui/ProductImage';
import { useMockAuth } from '../../hooks/useMockAuth';
import { mockOrders } from '../../mocks/data';
import { formatDate } from '../../lib/format';
import { useLanguage } from '../language/LanguageContext';

const activeOrders = mockOrders
  .filter((order) => !['delivered', 'cancelled'].includes(order.status))
  .sort((left, right) => left.requiredDate.localeCompare(right.requiredDate));

const nextOrder = activeOrders[0];
const recentOrders = mockOrders.slice(0, 4);

const workspaceActions = [
  { icon: ShoppingBag, title: 'Orders', titleZh: '订单', text: 'Follow confirmed work through production and delivery.', textZh: '跟进已确认订单的生产和配送进度。', to: '/orders', action: 'View orders', actionZh: '查看订单' },
  { icon: RefreshCcw, title: 'Repeat supply', titleZh: '重复订购', text: 'Return to a previous order without rebuilding the requirement.', textZh: '从历史订单继续采购，无需重新整理需求。', to: '/orders', action: 'Find a past order', actionZh: '查找历史订单' },
  { icon: Sparkles, title: 'New packaging need', titleZh: '新的包装需求', text: 'Start a separate brief when the product or campaign changes.', textZh: '产品或活动发生变化时，创建一份新的需求说明。', to: '/start', action: 'Start a brief', actionZh: '开始填写需求' },
  { icon: Headphones, title: 'Support', titleZh: '客户支持', text: 'Ask about an order, delivery or account with the right context.', textZh: '携带相关信息咨询订单、配送或账户问题。', to: '/help', action: 'Get help', actionZh: '获取帮助' },
];

export function DashboardPage() {
  const { customer } = useMockAuth();
  const { language, t } = useLanguage();
  const locale = language === 'zh' ? 'zh-CN' : 'en-NZ';

  return (
    <PageShell>
      <section className="overflow-hidden rounded-[2rem] bg-jade-950 p-7 text-white sm:p-9 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-lime-300"><BadgeCheck size={14} /> {t('Customer workspace', '客户工作台')}</div>
            <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">{t(`Welcome back, ${customer.contactPerson.split(' ')[0]}.`, `${customer.contactPerson.split(' ')[0]}，欢迎回来。`)}</h1>
            <p className="mt-3 text-base text-jade-100/65">{customer.company}</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-jade-100/70">{t('See what is moving, what needs attention and the fastest way to continue supply.', '查看当前进度、待处理事项，以及继续供货的最快路径。')}</p>
          </div>
          <Link to="/orders" className="inline-flex w-fit items-center gap-2 rounded-full bg-lime-300 px-6 py-3 text-sm font-bold text-jade-950 no-underline">{t('Open all orders', '查看全部订单')} <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
        {nextOrder ? (
          <Link to={`/orders/${nextOrder.orderId}`} className="group rounded-[1.75rem] border border-stone-200 bg-white p-7 text-gray-950 no-underline sm:p-8">
            <div className="flex items-start justify-between gap-5"><div><p className="section-kicker">{t('Next supply milestone', '下一项供货进度')}</p><h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{nextOrder.orderNo}</h2></div><CalendarClock className="text-jade-700" size={25} /></div>
            <div className="mt-7 flex flex-wrap items-center gap-3"><StatusBadge status={nextOrder.status} /><span className="text-sm text-stone-500">{t('Required', '要求日期')} {formatDate(nextOrder.requiredDate, locale)}</span></div>
            <p className="mt-5 text-sm leading-relaxed text-stone-600">{language === 'zh' ? `该订单包含 ${nextOrder.itemCount} 项产品${nextOrder.custOrderNo ? ` · 您的参考号 ${nextOrder.custOrderNo}` : ''}。` : `${nextOrder.itemCount} item${nextOrder.itemCount === 1 ? '' : 's'} in this order${nextOrder.custOrderNo ? ` · Your reference ${nextOrder.custOrderNo}` : ''}.`}</p>
            <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-jade-800">{t('View order progress', '查看订单进度')} <ArrowRight className="transition group-hover:translate-x-1" size={15} /></span>
          </Link>
        ) : (
          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-7 sm:p-8"><PackageCheck className="text-jade-700" size={24} /><h2 className="mt-6 text-2xl font-semibold text-gray-950">{t('No active orders right now.', '目前没有进行中的订单。')}</h2><p className="mt-3 text-sm text-stone-600">{t('Return to order history when you are ready to repeat supply.', '需要再次采购时，可从历史订单继续。')}</p></div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <Link to="/orders" className="flex items-center gap-5 rounded-[1.5rem] border border-stone-200 bg-white p-6 text-gray-950 no-underline"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-jade-100 text-jade-800"><Truck size={21} /></span><div><p className="text-2xl font-semibold">{activeOrders.length}</p><p className="mt-1 text-sm text-stone-500">{t('Orders in progress', '进行中的订单')}</p></div><ArrowRight className="ml-auto text-stone-400" size={16} /></Link>
          <Link to="/orders" className="flex items-center gap-5 rounded-[1.5rem] border border-stone-200 bg-white p-6 text-gray-950 no-underline"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-200 text-jade-950"><RefreshCcw size={21} /></span><div><p className="text-sm font-semibold">{t('Need the same supply again?', '需要再次采购相同产品？')}</p><p className="mt-1 text-xs text-stone-500">{t('Start from a previous order', '从历史订单开始')}</p></div><ArrowRight className="ml-auto text-stone-400" size={16} /></Link>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white">
          <div className="flex items-center justify-between gap-5 border-b border-stone-100 px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{t('Recent activity', '近期动态')}</p><h2 className="mt-1 text-xl font-semibold text-gray-950">{t('Orders', '订单')}</h2></div><Link to="/orders" className="text-sm font-bold text-jade-800 no-underline">{t('View all', '查看全部')}</Link></div>
          <div className="divide-y divide-stone-100">
            {recentOrders.map((order) => (
              <Link key={order.orderId} to={`/orders/${order.orderId}`} className="flex items-center gap-4 p-4 text-gray-950 no-underline transition hover:bg-stone-50 sm:px-6">
                <ProductImage src={order.firstProductImage} alt={order.orderNo} size="sm" />
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold">{order.orderNo}</p><StatusBadge status={order.status} /></div><p className="mt-1 text-xs text-stone-500">{formatDate(order.orderDate, locale)} · {language === 'zh' ? `${order.itemCount} 项产品` : `${order.itemCount} item${order.itemCount === 1 ? '' : 's'}`}</p></div>
                <ArrowRight className="shrink-0 text-stone-400" size={15} />
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-[1.75rem] border border-jade-200 bg-jade-50 p-7">
          <FileCheck2 className="text-jade-700" size={24} />
          <h2 className="mt-6 text-xl font-semibold text-jade-950">{t('Approvals belong here too.', '待确认事项也会集中在这里。')}</h2>
          <p className="mt-3 text-sm leading-relaxed text-jade-900/70">{t('Artwork, samples and other customer decisions should surface ahead of general account information when action is needed.', '当设计稿、样品或其他事项需要您确认时，它们会优先显示在普通账户信息之前。')}</p>
          <Link to="/help" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-jade-800 no-underline">{t('Need help now?', '现在需要帮助？')} <ArrowRight size={14} /></Link>
        </aside>
      </section>

      <section className="mt-10">
        <p className="section-kicker">{t('Choose what you need today', '选择您今天要处理的事项')}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workspaceActions.map(({ icon: Icon, title, titleZh, text, textZh, to, action, actionZh }) => (
            <Link key={title} to={to} className="group flex min-h-60 flex-col rounded-[1.5rem] border border-stone-200 bg-white p-6 text-gray-950 no-underline transition hover:-translate-y-0.5 hover:border-jade-300 hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-jade-100 text-jade-800"><Icon size={20} /></span>
              <h2 className="mt-6 text-lg font-semibold">{t(title, titleZh)}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{t(text, textZh)}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-jade-800">{t(action, actionZh)} <ArrowRight className="transition group-hover:translate-x-1" size={14} /></span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
