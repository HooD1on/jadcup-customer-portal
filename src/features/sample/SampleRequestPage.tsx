import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Mail, PackageCheck, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';

const businessLabels: Record<string, string> = {
  cafe: 'Café, coffee roastery or beverage brand',
  foodservice: 'Restaurant, takeaway or lunch bar',
  'cold-dessert': 'Bubble tea, cold drinks or ice cream',
  bakery: 'Bakery, cake shop or dessert counter',
  institution: 'Institution, catering or event service',
  trade: 'Multi-site brand, distributor or reseller',
};

const needLabels: Record<string, string> = {
  hot: 'Hot cups and matching lids',
  cold: 'Clear and cold drink cups',
  dessert: 'Ice cream and dessert cups',
  food: 'Bowls, takeaway boxes and trays',
  wrap: 'Deli and greaseproof paper',
  bags: 'Paper bags and counter essentials',
  bakery: 'Cake boxes and bakery packaging',
  system: 'A coordinated packaging range',
};

const businessChinese: Record<string, string> = {
  'Café, coffee roastery or beverage brand': '咖啡馆、咖啡烘焙或饮品品牌',
  'Restaurant, takeaway or lunch bar': '餐厅、外卖或Lunch Bar',
  'Bubble tea, cold drinks or ice cream': '奶茶、冷饮或冰淇淋业务',
  'Bakery, cake shop or dessert counter': '烘焙店、蛋糕店或甜品柜台',
  'Institution, catering or event service': '机构、餐饮服务或活动供应',
  'Multi-site brand, distributor or reseller': '连锁品牌、经销商或包装采购商',
};

const routeLabels: Record<string, string> = {
  standard: 'Standard or ready-to-order packaging',
  custom: 'Custom branded packaging',
  sample: 'Physical sample comparison',
  repeat: 'Repeat approved supply',
};

const routeChinese: Record<string, string> = {
  'Standard or ready-to-order packaging': '标准或现货包装',
  'Custom branded packaging': '定制品牌包装',
  'Physical sample comparison': '实物样品比较',
  'Repeat approved supply': '继续已确认的供货',
};

const volumeOptions = [['500–1,000 units', '500–1,000个'], ['1,000–5,000 units', '1,000–5,000个'], ['5,000–20,000 units', '5,000–20,000个'], ['20,000+ units', '20,000个以上']];
const timingOptions = [['Within 2 weeks', '两周内'], ['Within 1 month', '一个月内'], ['Within 2–3 months', '两到三个月内'], ['Planning ahead', '提前规划中']];

export function SampleRequestPage() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [prepared, setPrepared] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: businessLabels[params.get('business') || ''] || '',
    product: params.get('product') || needLabels[params.get('need') || ''] || '',
    startingRoute: routeLabels[params.get('route') || ''] || '',
    volume: '',
    timing: '',
    notes: '',
  });

  const update = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setPrepared(false);
  };

  const emailHref = useMemo(() => {
    const body = [
      'Jadcup sample / quotation request',
      '',
      `Business: ${form.businessName}`,
      `Contact: ${form.contactName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || 'Not provided'}`,
      `Business type: ${form.businessType || 'Not specified'}`,
      `Product or need: ${form.product}`,
      `Starting route: ${form.startingRoute || 'Not specified'}`,
      `Expected volume: ${form.volume || 'Not specified'}`,
      `Required timing: ${form.timing || 'Not specified'}`,
      '',
      `Additional notes: ${form.notes || 'None'}`,
    ].join('\n');
    return `mailto:Info@jadcup.co.nz?subject=${encodeURIComponent(`Sample / quote request — ${form.businessName || 'new customer'}`)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const canPrepare = form.businessName.trim() && form.contactName.trim() && form.email.trim() && form.product.trim();

  return (
    <main className="flex-1 bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker">{t('Samples and quotation', '样品与报价')}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl">{t('Give Jadcup a useful brief—not a vague contact message.', '向Jadcup提供清晰需求，而不只是一条模糊留言。')}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">{t('Prepare the details that affect the recommendation: what you serve, likely volume, timing and what you want to evaluate.', '请准备会影响建议的信息：您提供什么产品、预计数量、所需时间，以及希望评估的重点。')}</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] bg-jade-950 p-7 text-white">
              <PackageCheck className="text-lime-300" size={25} />
              <h2 className="mt-7 text-2xl font-semibold">{t('What happens next', '接下来会发生什么')}</h2>
              <div className="mt-6 space-y-5">
                {[["Jadcup checks product suitability", "Jadcup检查产品适配性"], ["The team confirms sample and quantity options", "团队确认样品与数量选择"], ["Artwork and timing are aligned before production", "生产前确认设计稿和时间安排"]].map(([en, zh]) => (
                  <p key={en} className="flex items-start gap-3 text-sm leading-relaxed text-jade-100/70"><Check className="mt-0.5 shrink-0 text-lime-300" size={16} />{t(en, zh)}</p>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-5 text-sm text-stone-600"><ShieldCheck className="mt-0.5 shrink-0 text-jade-700" size={18} /><p>{t('This preview prepares an email for your own mail app. It does not silently submit personal information.', '此页面会在您的邮件程序中准备申请内容，不会在未确认的情况下提交个人信息。')}</p></div>
            <Link to="/start" className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-jade-800 no-underline"><ArrowLeft size={15} />{t('Return to packaging finder', '返回包装选择器')}</Link>
          </aside>

          <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={(event) => { event.preventDefault(); if (canPrepare) setPrepared(true); }}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="text-sm font-semibold text-gray-800">{t('Business name *', '企业名称 *')}</span><input required value={form.businessName} onChange={(event) => update('businessName', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-jade-600" placeholder={t('Company or trading name', '公司或经营名称')} /></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">{t('Contact name *', '联系人姓名 *')}</span><input required value={form.contactName} onChange={(event) => update('contactName', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-jade-600" placeholder={t('Your name', '您的姓名')} /></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">{t('Work email *', '工作邮箱 *')}</span><input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-jade-600" placeholder="name@business.co.nz" /></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">{t('Phone', '电话')}</span><input value={form.phone} onChange={(event) => update('phone', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-jade-600" placeholder={t('Best contact number', '最方便联系的号码')} /></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">{t('Business type', '业务类型')}</span><select value={form.businessType} onChange={(event) => update('businessType', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-jade-600"><option value="">{t('Choose one', '请选择')}</option>{Object.values(businessLabels).map((label) => <option key={label} value={label}>{t(label, businessChinese[label])}</option>)}</select></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">{t('Product or packaging need *', '产品或包装需求 *')}</span><input required value={form.product} onChange={(event) => update('product', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-jade-600" placeholder={t('e.g. 12oz branded hot cup', '例如：12盎司定制热饮杯')} /></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">{t('Preferred starting route', '希望的采购起点')}</span><select value={form.startingRoute} onChange={(event) => update('startingRoute', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-jade-600"><option value="">{t('Let Jadcup recommend', '由Jadcup推荐')}</option>{Object.values(routeLabels).map((label) => <option key={label} value={label}>{t(label, routeChinese[label])}</option>)}</select></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">{t('Expected volume', '预计数量')}</span><select value={form.volume} onChange={(event) => update('volume', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-jade-600"><option value="">{t('Not sure yet', '暂时不确定')}</option>{volumeOptions.map(([en, zh]) => <option key={en} value={en}>{t(en, zh)}</option>)}</select></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">{t('Required timing', '需要时间')}</span><select value={form.timing} onChange={(event) => update('timing', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-jade-600"><option value="">{t('Flexible', '时间灵活')}</option>{timingOptions.map(([en, zh]) => <option key={en} value={en}>{t(en, zh)}</option>)}</select></label>
              </div>
              <label className="mt-5 block"><span className="text-sm font-semibold text-gray-800">{t('What should the team know?', '团队还需要了解什么？')}</span><textarea rows={5} value={form.notes} onChange={(event) => update('notes', event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-jade-600" placeholder={t('What you serve, artwork status, desired material, delivery location or other requirements', '您提供的产品、设计稿状态、期望材质、配送地点或其他要求')} /></label>

              {!prepared ? (
                <button type="submit" disabled={!canPrepare} className="mt-7 inline-flex items-center gap-2 rounded-full bg-jade-900 px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{t('Review my request', '检查我的申请')} <ArrowRight size={16} /></button>
              ) : (
                <div className="mt-7 rounded-2xl border border-jade-200 bg-jade-50 p-6">
                  <p className="text-sm font-semibold text-jade-950">{t('Your brief is ready. The next button opens your email app with these details filled in so you can review and send it yourself.', '您的需求内容已准备好。下一步会打开邮件程序并自动填入信息，您可以检查后自行发送。')}</p>
                  <a href={emailHref} className="mt-5 inline-flex items-center gap-2 rounded-full bg-jade-900 px-6 py-3 text-sm font-bold text-white no-underline"><Mail size={16} />{t('Open enquiry email', '打开咨询邮件')}</a>
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
