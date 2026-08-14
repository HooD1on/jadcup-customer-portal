import {
  ArrowUpRight,
  Newspaper,
  PackageCheck,
  Recycle,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';

type InsightArticle = {
  category: string;
  categoryZh: string;
  date: string;
  dateZh: string;
  source: string;
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
  takeaway: string;
  takeawayZh: string;
  href: string;
  image: string;
  imageAlt: string;
  imageAltZh: string;
  icon: LucideIcon;
};

const featuredInsight: InsightArticle = {
  category: 'Market pulse',
  categoryZh: '市场动态',
  date: '29 Jun 2026',
  dateZh: '2026年6月29日',
  source: 'Bidfood New Zealand',
  title: 'Foodservice costs are shifting again this winter',
  titleZh: '今年冬季，新西兰餐饮成本再次出现变化',
  summary:
    'Bidfood reports continued pressure across red meat, dairy, eggs, oils and selected produce, while several other categories remain steadier. Seasonal supply and freight conditions are making flexible menu planning increasingly important.',
  summaryZh:
    'Bidfood指出，红肉、乳制品、鸡蛋、食用油及部分农产品的价格仍有压力，而其他品类相对稳定。季节性供应和运输条件让灵活的菜单规划变得更加重要。',
  takeaway:
    'Review menu formats, portion sizes and packaging quantities together. A simpler range can reduce both ingredient risk and packaging complexity.',
  takeawayZh:
    '可以同时检查菜单形式、份量与包装采购数量。更精简的产品组合，可能同时降低食材风险和包装复杂度。',
  href: 'https://www.bidfood.co.nz/post/foodservice-market-update-nz-market-bites-july-2026',
  image: '/img/insight-market-bites.jpg',
  imageAlt: 'Market Bites July 2026 foodservice report cover featuring a plated winter dish',
  imageAltZh: 'Market Bites 2026年7月餐饮市场报告封面与冬季餐点',
  icon: TrendingUp,
};

const supportingInsights: InsightArticle[] = [
  {
    category: 'Circular packaging',
    categoryZh: '循环包装',
    date: '19 May 2026',
    dateZh: '2026年5月19日',
    source: 'TRANSPORTtalk',
    title: 'Reusable crates scale across New Zealand produce supply',
    titleZh: '可重复使用周转箱正在扩大新西兰农产品供应链应用',
    summary:
      'A national reusable-crate pool shows how return, washing and recirculation can reduce single-use packaging while improving handling consistency.',
    summaryZh:
      '全国性可重复使用周转箱系统表明，回收、清洗和循环使用可以减少一次性包装，同时提高货物处理的一致性。',
    takeaway:
      'Returnable packaging works best when the collection process is designed alongside the pack itself.',
    takeawayZh:
      '可循环包装要真正有效，必须把回收流程与包装本身一起设计。',
    href: 'https://transporttalk.co.nz/news/reusable-crate-system-replaces-200-million-cardboard-boxes-in-nz-produce-sector',
    image: '/img/insight-reusable-crates.jpg',
    imageAlt: 'New Zealand grower carrying fresh produce in a reusable crate',
    imageAltZh: '新西兰种植者使用可重复使用周转箱搬运新鲜农产品',
    icon: Recycle,
  },
  {
    category: 'Customer trends',
    categoryZh: '顾客趋势',
    date: '26 Mar 2026',
    dateZh: '2026年3月26日',
    source: 'Nestlé Professional NZ',
    title: 'Value, portability and customisation shape foodservice in 2026',
    titleZh: '价值感、便携性与个性化正在塑造2026年餐饮市场',
    summary:
      'New Zealand operators are responding to tighter budgets, hybrid work and changing expectations with clearer value, portable offers and more flexible choices.',
    summaryZh:
      '面对更谨慎的消费、混合办公和不断变化的顾客预期，新西兰餐饮商家正在加强价值感、便携产品和灵活选择。',
    takeaway:
      'Packaging should support quick pickup, desk-ready meals and a consistent brand experience across more menu variations.',
    takeawayZh:
      '包装需要支持快速取餐、适合办公桌用餐，并在更多菜单组合中保持统一品牌体验。',
    href: 'https://www.nestleprofessional.co.nz/resources/foodservice-trends-2026',
    image: '/img/insight-foodservice-trends.jpg',
    imageAlt: 'Customers sharing a meal in a contemporary foodservice venue',
    imageAltZh: '顾客在现代餐饮场所共同用餐',
    icon: Newspaper,
  },
  {
    category: 'Packaging change',
    categoryZh: '包装变化',
    date: '29 Jan 2026',
    dateZh: '2026年1月29日',
    source: 'Foodstuffs New Zealand',
    title: 'Foodstuffs moves fresh departments away from PVC wrap',
    titleZh: 'Foodstuffs生鲜部门逐步停止使用PVC保鲜膜',
    summary:
      'New World and PAK’nSAVE stores are moving to recyclable LDPE wrap after in-store testing focused on performance, recyclability and cost.',
    summaryZh:
      'New World和PAK’nSAVE经过门店测试后，正转向可回收的LDPE保鲜膜，测试重点包括性能、可回收性和成本。',
    takeaway:
      'Material changes need practical trials: food contact, temperature, equipment and end-of-life routes all matter.',
    takeawayZh:
      '更换包装材料需要实际测试：食品接触、温度、设备适配和最终回收方式都很重要。',
    href: 'https://www.foodstuffs.co.nz/news-room/2026/foodstuffs-transitions-plastic-wrap-from-pvc-to-recyclable-plastic',
    image: '/img/insight-foodstuffs-wrap.jpg',
    imageAlt: 'Foodstuffs packaging specialist explaining the move away from non-recyclable plastic wrap',
    imageAltZh: 'Foodstuffs包装专家介绍停止使用不可回收塑料保鲜膜的计划',
    icon: PackageCheck,
  },
];

export function IndustryInsights() {
  const { t } = useLanguage();
  const FeaturedIcon = featuredInsight.icon;

  return (
    <section className="border-b border-stone-200 bg-stone-100/70" aria-labelledby="industry-insights-title">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="section-kicker">{t('Industry insights', '行业洞察')}</p>
            <h2 id="industry-insights-title" className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-4xl">
              {t('Useful signals for your next business decision.', '为您的下一步商业决策提供有用信号。')}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-stone-600 lg:justify-self-end">
            {t(
              'Recent reporting on foodservice, packaging and customer behaviour—selected for cafés, restaurants, bakeries and takeaway operators across New Zealand.',
              '精选与新西兰咖啡馆、餐厅、烘焙和外卖经营者相关的最新餐饮、包装及顾客趋势。',
            )}
          </p>
        </div>

        <div className="mt-9">
          <article className="relative overflow-hidden rounded-[2rem] bg-jade-950 text-white shadow-lg">
            <div className="absolute -right-16 -top-16 z-10 h-48 w-48 rounded-full border-[28px] border-lime-300/10" aria-hidden="true" />
            <div className="grid lg:min-h-[34rem] lg:grid-cols-[0.94fr_1.06fr]">
              <figure className="relative min-h-72 overflow-hidden bg-jade-900 sm:min-h-96 lg:min-h-full">
                <img
                  src={featuredInsight.image}
                  alt={t(featuredInsight.imageAlt, featuredInsight.imageAltZh)}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-jade-950/45 via-transparent to-transparent" aria-hidden="true" />
                <figcaption className="absolute bottom-4 left-4 rounded-full bg-jade-950/85 px-3 py-1.5 text-[0.65rem] font-bold text-white backdrop-blur-sm">
                  {t('Image', '图片')} · {featuredInsight.source}
                </figcaption>
              </figure>

              <div className="relative flex flex-col p-7 sm:p-9 lg:p-10">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.13em]">
                  <span className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-3 py-1.5 text-jade-950">
                    <FeaturedIcon size={14} /> {t(featuredInsight.category, featuredInsight.categoryZh)}
                  </span>
                  <span className="text-jade-100/55">{t(featuredInsight.date, featuredInsight.dateZh)}</span>
                </div>

                <p className="mt-7 text-sm font-semibold text-lime-300">{featuredInsight.source}</p>
                <h3 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
                  {t(featuredInsight.title, featuredInsight.titleZh)}
                </h3>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-jade-100/70 sm:text-base">
                  {t(featuredInsight.summary, featuredInsight.summaryZh)}
                </p>

                <div className="mt-7 rounded-2xl border border-white/10 bg-white/7 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-lime-300">
                    {t('What this could mean for your business', '这对您的业务可能意味着什么')}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-jade-50/85">
                    {t(featuredInsight.takeaway, featuredInsight.takeawayZh)}
                  </p>
                </div>

                <a
                  href={featuredInsight.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 self-start text-sm font-bold text-white no-underline transition hover:text-lime-300"
                >
                  {t('Read the original article', '阅读原文')} <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </article>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {supportingInsights.map((article) => {
              const Icon = article.icon;

              return (
                <article key={article.href} className="group flex h-full flex-col rounded-[1.5rem] border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-jade-200 hover:shadow-md sm:p-6">
                  <figure className="relative mb-5 overflow-hidden rounded-2xl bg-stone-100">
                    <img
                      src={article.image}
                      alt={t(article.imageAlt, article.imageAltZh)}
                      className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption className="absolute bottom-2 right-2 rounded-full bg-black/65 px-2.5 py-1 text-[0.6rem] font-bold text-white backdrop-blur-sm">
                      {article.source}
                    </figcaption>
                  </figure>
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-jade-100 text-jade-800">
                      <Icon size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] font-bold uppercase tracking-[0.11em] text-stone-500">
                        <span className="text-jade-700">{t(article.category, article.categoryZh)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{t(article.date, article.dateZh)}</span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-stone-500">{article.source}</p>
                      <h3 className="mt-2 text-lg font-semibold leading-snug text-gray-950">
                        {t(article.title, article.titleZh)}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-stone-600">{t(article.summary, article.summaryZh)}</p>
                  <div className="mt-4 border-l-2 border-lime-400 pl-3">
                    <p className="text-xs font-bold text-jade-900">{t('Business takeaway', '经营启示')}</p>
                    <p className="mt-1 text-xs leading-5 text-stone-600">{t(article.takeaway, article.takeawayZh)}</p>
                  </div>
                  <a
                    href={article.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t(`Read original article from ${article.source}`, `阅读${article.source}原文`)}
                    className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-bold text-jade-800 no-underline transition group-hover:text-jade-600"
                  >
                    {t('Original source', '原始来源')} <ArrowUpRight size={14} />
                  </a>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-stone-200 pt-5 text-xs leading-5 text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('Jadcup provides short editorial summaries; reporting remains with the named publishers.', 'Jadcup仅提供简短编辑摘要，新闻内容及报道归署名来源所有。')}</p>
          <p className="font-semibold text-stone-600">{t('Curated 12 Aug 2026', '精选更新于2026年8月12日')}</p>
        </div>
      </div>
    </section>
  );
}
