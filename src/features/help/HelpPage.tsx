import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, CircleHelp, KeyRound, Mail, PackageSearch, Phone, Truck } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';

const helpGroups = [
  {
    icon: PackageSearch,
    title: 'Choosing packaging',
    items: [
      ['Can a smaller business start with custom packaging?', 'Yes. Selected custom products can start from 500 units, giving cafés, pop-ups and growing food brands a more practical way to begin. Product-specific terms still apply.'],
      ['Can we see a product before placing a production order?', 'Jadcup offers free sample support so your team can check the format and physical quality before moving forward.'],
      ['What if our artwork is not production-ready?', 'Start with the idea and business requirement. Jadcup can help align the product, artwork and practical print requirements before manufacturing.'],
      ['How do I know which product to ask for?', 'Use the Packaging Finder for a starting route, or prepare a request describing what you serve, volume and timing. Jadcup will confirm exact product suitability.'],
    ],
  },
  {
    icon: KeyRound,
    title: 'Portal access',
    items: [
      ['Is the Customer Portal where a new buyer starts?', 'No. New buyers can explore products and prepare a sample request without an account. Portal access is for businesses that already have a Jadcup customer relationship.'],
      ['I already buy from Jadcup but do not have a login. What should I do?', 'Use Request portal access and enter the business details Jadcup already knows. The team will match your login to the correct customer record.'],
      ['Why is my application still pending?', 'Jadcup needs to confirm the business and connect the right customer record before any private account information becomes visible.'],
      ['I forgot my portal password. What should I do?', 'Online password reset is not available yet. Contact Jadcup on 09 282 3988 for account help.'],
    ],
  },
  {
    icon: Truck,
    title: 'Orders and supply',
    items: [
      ['Where can I see an existing order?', 'Approved portal customers can open Orders from their customer dashboard to review current and recent activity.'],
      ['Can I use this page to repeat an order?', 'The portal keeps prior order information visible. Reorder functionality should use the confirmed customer product and commercial terms connected to your account.'],
      ['Who should I contact about an urgent delivery question?', 'Call Jadcup on 09 282 3988 and have your order number or business name ready.'],
    ],
  },
];

const helpGroupsZh = [
  {
    icon: PackageSearch,
    title: '选择包装',
    items: [
      ['小型企业也可以开始定制包装吗？', '可以。部分定制产品可从500个起订，为咖啡馆、快闪店和成长中的食品品牌提供更实际的起点。具体条件仍以产品为准。'],
      ['正式生产前可以先看实物吗？', 'Jadcup提供免费样品支持，让您的团队在继续推进前确认杯型和实物质量。'],
      ['如果设计稿还没达到生产要求怎么办？', '您可以先提供想法和业务需求。Jadcup会在生产前协助确认产品、设计稿和实际印刷要求。'],
      ['怎样知道该咨询哪个产品？', '可以使用包装选择器获得起始方向，或提交包含产品用途、数量和时间的需求，Jadcup会确认具体产品适配性。'],
    ],
  },
  {
    icon: KeyRound,
    title: '门户访问权限',
    items: [
      ['新客户需要先申请客户门户账户吗？', '不需要。新客户无需账户即可浏览产品并准备样品申请。门户访问权限主要面向已经与Jadcup建立客户关系的企业。'],
      ['我们已经向Jadcup采购，但没有登录账户，应该怎么办？', '请选择申请门户访问权限，并填写Jadcup已经掌握的企业资料。团队会把登录账户与正确的客户记录进行匹配。'],
      ['为什么申请仍在审核中？', '在显示任何私密账户信息前，Jadcup需要确认企业身份并连接正确的客户记录。'],
      ['忘记门户密码怎么办？', '目前暂不支持在线重置密码。请致电09 282 3988联系Jadcup获取账户帮助。'],
    ],
  },
  {
    icon: Truck,
    title: '订单与供货',
    items: [
      ['在哪里查看现有订单？', '已批准的门户客户可以从客户工作台进入订单页面，查看当前和近期业务。'],
      ['可以通过门户重复订购吗？', '门户会保留以往订单信息。重复订购应使用与账户关联的已确认客户产品和商务条件。'],
      ['紧急配送问题应该联系谁？', '请致电09 282 3988联系Jadcup，并准备好订单号或企业名称。'],
    ],
  },
];

export function HelpPage() {
  const { language, t } = useLanguage();
  const groups = language === 'zh' ? helpGroupsZh : helpGroups;
  return (
    <main className="flex-1 bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker">{t('Help centre', '帮助中心')}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl">{t('Answers for both sides of the Jadcup relationship.', '为新客户和老客户提供清晰答案。')}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">{t('New customers can get help choosing and sampling. Existing customers can find portal, order and account guidance.', '新客户可以获得选品和样品帮助；老客户可以查找门户、订单和账户指引。')}</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-start">
          <div className="space-y-6">
            {groups.map(({ icon: Icon, title, items }) => (
              <section key={title} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 sm:p-8">
                <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-jade-100 text-jade-800"><Icon size={21} /></div><h2 className="text-2xl font-semibold text-gray-950">{title}</h2></div>
                <div className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
                  {items.map(([question, answer]) => (
                    <details key={question} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-semibold text-gray-950">{question}<ChevronDown className="shrink-0 text-jade-700 transition group-open:rotate-180" size={19} /></summary>
                      <p className="max-w-3xl pt-3 text-sm leading-relaxed text-stone-600">{answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="rounded-[1.75rem] bg-jade-950 p-7 text-white">
              <CircleHelp className="text-lime-300" size={24} />
              <h2 className="mt-7 text-2xl font-semibold">{t('Still need a person?', '仍需要人工协助？')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-jade-100/65">{t('Contact the Jadcup team with your business name, product or order number where possible.', '请联系Jadcup团队，并尽量准备好企业名称、产品或订单编号。')}</p>
              <div className="mt-6 space-y-3">
                <a href="tel:+6492823988" className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3 text-sm font-semibold text-white no-underline"><Phone size={16} />09 282 3988</a>
                <a href="mailto:Info@jadcup.co.nz" className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3 text-sm font-semibold text-white no-underline"><Mail size={16} />Info@jadcup.co.nz</a>
              </div>
            </div>
            <Link to="/start" className="block rounded-[1.5rem] border border-stone-200 bg-white p-6 text-gray-950 no-underline"><p className="text-xs font-bold uppercase tracking-[0.14em] text-jade-700">{t('New customer', '新客户')}</p><h2 className="mt-2 text-lg font-semibold">{t('Use the packaging finder', '使用包装选择器')}</h2><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-jade-800">{t('Start now', '立即开始')} <ArrowRight size={14} /></span></Link>
            <Link to="/login" className="block rounded-[1.5rem] border border-stone-200 bg-white p-6 text-gray-950 no-underline"><p className="text-xs font-bold uppercase tracking-[0.14em] text-jade-700">{t('Existing customer', '老客户')}</p><h2 className="mt-2 text-lg font-semibold">{t('Go to customer sign in', '前往客户登录')}</h2><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-jade-800">{t('Sign in', '登录')} <ArrowRight size={14} /></span></Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
