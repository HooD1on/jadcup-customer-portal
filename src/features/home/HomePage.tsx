import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  Coffee,
  Factory,
  HeartHandshake,
  IceCreamBowl,
  Leaf,
  LogIn,
  Palette,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Store,
  Timer,
  Truck,
  Utensils,
} from 'lucide-react';
import {
  getShowcaseProducts,
  type ShowcaseProduct,
} from '../../services/publicCatalogApi';

const businessSolutions = [
  {
    icon: Coffee,
    label: 'Cafés & coffee roasters',
    title: 'Turn every takeaway cup into a repeat brand impression.',
    products: 'Single wall, double wall, lids and custom print',
    outcome: 'A recognisable cup system that works across the daily rush.',
  },
  {
    icon: Utensils,
    label: 'Takeaway & foodservice',
    title: 'Make the whole handover feel like one brand.',
    products: 'Cups, bowls, paper bags, napkins and food packaging',
    outcome: 'A coordinated range that is easier for teams to order and use.',
  },
  {
    icon: IceCreamBowl,
    label: 'Dessert & cold drinks',
    title: 'Let colour, product and packaging do the selling together.',
    products: 'Clear cups, milkshake cups and ice cream cups',
    outcome: 'Packaging designed for visual products and social sharing.',
  },
  {
    icon: PartyPopper,
    label: 'Events & campaigns',
    title: 'Put a launch, sponsor or moment directly in people’s hands.',
    products: 'Short-run branded cups and event food packaging',
    outcome: 'A physical brand touchpoint without committing to excess stock.',
  },
];

const customerBrands = ['KFC', 'THE COFFEE CLUB', 'TIP TOP', 'COOKIE TIME', 'MAJESTIC TEA', 'KŌWHAI'];

const firstOrderAdvantages = [
  {
    icon: Sparkles,
    eyebrow: 'Feel it first',
    title: 'Free samples before the order',
    description: 'Check the size, finish and feel with your own team before committing to production.',
  },
  {
    icon: ShieldCheck,
    eyebrow: 'Start sensibly',
    title: 'Selected custom runs from 500',
    description: 'A lower entry point helps independent businesses test branded packaging without overbuying.',
  },
  {
    icon: Timer,
    eyebrow: 'Move while it matters',
    title: 'Selected products from 5 working days',
    description: 'Local manufacturing can support launches, seasonal changes and growing demand more responsively.',
  },
];

const productionSteps = [
  {
    icon: Building2,
    step: '01',
    title: 'Share the business need',
    description: 'Tell us what you serve, expected volume, timing and what the packaging should achieve.',
  },
  {
    icon: Palette,
    step: '02',
    title: 'Choose and sample',
    description: 'Align the format, material and artwork, then check a sample before the production decision.',
  },
  {
    icon: Factory,
    step: '03',
    title: 'Make it locally',
    description: 'Jadcup manufactures in Auckland, reducing distance between the conversation and the factory floor.',
  },
  {
    icon: Truck,
    step: '04',
    title: 'Deliver and keep supplying',
    description: 'Once the relationship is active, the Customer Portal supports ongoing orders and account visibility.',
  },
];

const productArtwork: Record<number, string> = {
  36: '/img/highlight-cups.svg',
  38: '/img/cup-12oz.svg',
  94: '/img/cup-16oz.svg',
  271: '/img/highlight-accessories.svg',
  1177: '/img/bowl.svg',
  474: '/img/highlight-packaging.svg',
};

const productOutcomes: Record<number, string> = {
  36: 'A versatile everyday format for branded coffee service.',
  38: 'Extra insulation and a more substantial hand feel for hot drinks.',
  94: 'A bright branded surface for shakes, smoothies and cold drinks.',
  271: 'Clear presentation for colourful cold beverages and display-led menus.',
  1177: 'A custom format for gelato, ice cream and dessert brands.',
  474: 'Carry the identity through the small details of the customer experience.',
};

const faqItems = [
  {
    question: 'Can a smaller business start with custom packaging?',
    answer: 'Yes. Selected custom products can start from 500 units, which gives cafés, pop-ups and growing food brands a more practical way to begin. Product-specific terms still apply.',
  },
  {
    question: 'Can we see the product before placing a production order?',
    answer: 'Jadcup offers free samples so your team can check the format and physical quality before moving forward.',
  },
  {
    question: 'What if our artwork is not production-ready?',
    answer: 'Start with the idea and business requirements. The Jadcup team can help align the product, artwork and practical print requirements before manufacturing.',
  },
  {
    question: 'Is the Customer Portal where a new buyer starts?',
    answer: 'No. New buyers should begin with the packaging team. The portal is for existing customers who need account access, order visibility and ongoing service.',
  },
];

export function HomePage() {
  const [products, setProducts] = useState<ShowcaseProduct[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    getShowcaseProducts(controller.signal).then(setProducts);
    return () => controller.abort();
  }, []);

  return (
    <main className="flex-1 overflow-hidden bg-stone-50">
      <section className="relative isolate bg-jade-950 text-white">
        <div className="absolute inset-0 -z-10 portal-hero-texture" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-jade-100">
                <Leaf size={14} /> New Zealand made food packaging
              </div>
              <h1 className="mt-7 max-w-4xl text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-[-0.045em] leading-[0.98]">
                Make the packaging people leave with worth remembering.
              </h1>
              <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-jade-100/80">
                Jadcup helps New Zealand food businesses turn cups and takeaway packaging into a useful brand asset—with local manufacturing, practical first runs and a team close enough to respond.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://jadcup.co.nz/contact/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3 text-sm font-bold text-jade-950 no-underline transition hover:bg-lime-200"
                >
                  Request a free sample <ArrowRight size={17} />
                </a>
                <a
                  href="#solutions"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white no-underline transition hover:bg-white/10"
                >
                  Find my packaging route
                </a>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-jade-100/50">Free samples and minimum quantities are subject to product suitability and Jadcup terms.</p>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-8 rounded-full bg-lime-300/10 blur-3xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-6 sm:p-8 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">A lower-risk first order</p>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">See it. Start sensibly. Scale when it works.</h2>
                  </div>
                  <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-300 text-jade-950">
                    <HeartHandshake size={24} />
                  </div>
                </div>
                <div className="mt-8 divide-y divide-white/12 border-y border-white/12">
                  {[
                    ['Free samples', 'Check the physical product'],
                    ['From 500 units', 'On selected custom ranges'],
                    ['From 5 working days', 'On selected custom products'],
                  ].map(([value, label]) => (
                    <div key={value} className="flex items-center justify-between gap-5 py-4">
                      <p className="font-semibold text-white">{value}</p>
                      <p className="text-right text-xs text-jade-100/55">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-jade-100/65">
                  <Factory className="mt-0.5 shrink-0 text-lime-300" size={18} />
                  <p>Made in Auckland, so your sales conversation, artwork and manufacturing decision stay closer together.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 lg:mt-18 border-y border-white/12 py-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-jade-100/45">Customers publicly featured by Jadcup</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/80">
                {customerBrands.slice(0, 5).map((brand) => <span key={brand}>{brand}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="bg-stone-50 py-16 sm:py-20 lg:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div className="max-w-xl">
              <p className="section-kicker">Start with your business</p>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] text-gray-950">
                People do not need a catalogue first. They need to recognise their situation.
              </h2>
              <p className="mt-5 leading-relaxed text-gray-600">
                Choose the closest business type and see the role packaging can play—not just the products available.
              </p>
              <a href="https://jadcup.co.nz/contact/" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-jade-800 hover:text-jade-950">
                Tell us about your business <ArrowRight size={16} />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {businessSolutions.map(({ icon: Icon, label, title, products: productList, outcome }, index) => (
                <article key={label} className={`rounded-[1.75rem] border p-6 sm:p-7 ${index === 0 ? 'border-jade-900 bg-jade-900 text-white' : 'border-stone-200 bg-white text-gray-950'}`}>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${index === 0 ? 'bg-lime-300 text-jade-950' : 'bg-jade-100 text-jade-800'}`}><Icon size={21} /></div>
                  <p className={`mt-6 text-xs font-bold uppercase tracking-[0.14em] ${index === 0 ? 'text-lime-300' : 'text-jade-700'}`}>{label}</p>
                  <h3 className="mt-3 text-xl font-semibold leading-snug">{title}</h3>
                  <p className={`mt-5 text-xs font-semibold ${index === 0 ? 'text-jade-100/70' : 'text-stone-500'}`}>{productList}</p>
                  <p className={`mt-3 text-sm leading-relaxed ${index === 0 ? 'text-jade-100/65' : 'text-gray-600'}`}>{outcome}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="bg-white py-16 sm:py-20 lg:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <p className="section-kicker">A useful place to begin</p>
                <span className="rounded-full bg-jade-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-jade-700">Prepared for live catalogue data</span>
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] text-gray-950">Real product families, shown around the job they need to do.</h2>
            </div>
            <a href="https://jadcup.co.nz/our-products/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-jade-800 hover:text-jade-950">
              View the full range <ArrowRight size={16} />
            </a>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.length === 0
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[25rem] animate-pulse rounded-[1.5rem] bg-stone-100" aria-hidden="true" />
                ))
              : products.map((product, index) => {
                const artwork = product.image || productArtwork[product.id] || '/img/highlight-packaging.svg';
                return (
                  <article key={product.id} className="group overflow-hidden rounded-[1.5rem] border border-stone-200 bg-stone-50">
                    <div className={`aspect-[16/10] flex items-center justify-center overflow-hidden p-6 ${index % 2 === 0 ? 'bg-jade-50' : 'bg-lime-50'}`}>
                      <img src={artwork} alt="" className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-bold uppercase tracking-[0.13em] text-jade-700">{product.category}</p>
                        <p className="text-[0.65rem] font-semibold text-stone-400">{product.productCode}</p>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold capitalize text-gray-950">{product.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">{productOutcomes[product.id] || 'A practical food-packaging format ready to be matched to your business and brand.'}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1.5 text-[0.7rem] font-semibold text-stone-600">{product.material}</span>
                        <span className="rounded-full bg-white px-3 py-1.5 text-[0.7rem] font-semibold text-stone-600">{product.packSize}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      </section>

      <section id="why-jadcup" className="bg-lime-200 py-16 sm:py-20 lg:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker text-jade-900">Why a first-time buyer stays</p>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] text-jade-950">The real offer is not just a printed cup. It is less risk around the decision.</h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {firstOrderAdvantages.map(({ icon: Icon, eyebrow, title, description }) => (
              <article key={title} className="rounded-[1.75rem] bg-white/75 p-7 backdrop-blur-sm sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-jade-900 text-lime-300"><Icon size={21} /></div>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-jade-800/55">{eyebrow}</span>
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-tight text-jade-950">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-jade-950/65">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[1.75rem] bg-jade-950 p-7 text-white sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-300">A concrete next step</p>
              <h3 className="mt-2 text-2xl font-semibold">Ask for a sample matched to what your business serves.</h3>
            </div>
            <a href="https://jadcup.co.nz/contact/" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3 text-sm font-bold text-jade-950 no-underline hover:bg-lime-200">
              Request a sample <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section id="customer-proof" className="bg-jade-950 py-16 text-white sm:py-20 lg:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div>
              <p className="section-kicker text-lime-300">Customer proof, without invented reviews</p>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em]">Recognition is stronger than generic five-star copy.</h2>
              <p className="mt-5 max-w-xl leading-relaxed text-jade-100/65">
                Until Jadcup has approved customer quotes or a verified review feed, the honest proof is the customer relationships the company already publishes and documented real-world use.
              </p>
              <a href="https://jadcup.co.nz/custom-branding/" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-lime-300 hover:text-lime-200">
                See Jadcup’s custom-branding work <ArrowRight size={16} />
              </a>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {customerBrands.map((brand, index) => (
                  <div key={brand} className={`flex min-h-28 items-center justify-center rounded-2xl border px-4 text-center text-sm font-black tracking-[0.05em] ${index === 0 ? 'border-lime-300 bg-lime-300 text-jade-950' : 'border-white/12 bg-white/7 text-white'}`}>
                    {brand}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-white/12 bg-white/7 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jade-800 text-lime-300"><BadgeCheck size={19} /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-jade-100/45">Documented real-world use</p>
                    <p className="mt-2 text-sm leading-relaxed text-jade-100/75">A Diocesan School community event documented Jadcup compostable products being used with WooZoo Group to support a zero-waste event.</p>
                    <a href="https://www.diocesan.school.nz/assets/uploads/Dio-Today_June-2023.pdf" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-lime-300 hover:text-lime-200">View the published example <ArrowRight size={14} /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.78fr_1.22fr] gap-10 lg:gap-16">
            <div>
              <p className="section-kicker">A local production relationship</p>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] text-gray-950">One clear path from first idea to ongoing supply.</h2>
              <p className="mt-5 text-gray-600 leading-relaxed">The sales relationship earns the first order. The portal supports the customer after that relationship exists.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {productionSteps.map(({ icon: Icon, step, title, description }) => (
                <div key={step} className="border-t border-stone-300 pt-5">
                  <div className="flex items-center justify-between">
                    <Icon size={21} className="text-jade-800" />
                    <span className="text-xs font-bold tracking-[0.15em] text-stone-400">{step}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="new-customers" className="bg-white py-16 sm:py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-[2rem] bg-jade-900 p-7 text-white sm:p-9">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-lime-300 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-jade-950">New to Jadcup</span>
                <Store className="text-lime-300" size={26} />
              </div>
              <h2 className="mt-12 text-3xl sm:text-4xl font-semibold tracking-tight">Start with your business, sample and packaging brief.</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-jade-100/75">The team will help identify the right product path, entry volume and artwork requirements before you need any portal access.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="https://jadcup.co.nz/contact/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-jade-950 no-underline hover:bg-jade-50">Start a packaging enquiry <ArrowRight size={16} /></a>
                <a href="https://jadcup.co.nz/our-products/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-white/10">Explore products</a>
              </div>
            </article>

            <article className="rounded-[2rem] border border-stone-200 bg-stone-50 p-7 shadow-sm sm:p-9">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-jade-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-jade-800">Already a customer</span>
                <LogIn className="text-jade-700" size={26} />
              </div>
              <h2 className="mt-12 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-950">Bring the ongoing account into one place.</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-gray-600">Sign in to the Customer Portal, or request portal access if your business already purchases from Jadcup and does not yet have an online login.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-jade-800 px-5 py-3 text-sm font-bold text-white no-underline hover:bg-jade-900">Customer sign in <ArrowRight size={16} /></Link>
                <Link to="/apply" className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 no-underline hover:bg-gray-50">Request portal access</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="section-kicker">Before you contact us</p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-gray-950">The first questions, answered plainly.</h2>
          </div>
          <div className="mt-9 divide-y divide-stone-200 border-y border-stone-200">
            {faqItems.map(({ question, answer }) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-lg font-semibold text-gray-950">
                  {question}
                  <ChevronDown className="shrink-0 text-jade-700 transition group-open:rotate-180" size={20} />
                </summary>
                <p className="max-w-3xl pt-3 text-sm leading-relaxed text-gray-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-jade-950 p-7 text-white sm:p-10 lg:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-lime-300">Make the first decision tangible</p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">Tell Jadcup what you serve. Ask for the right sample.</h2>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-jade-100/65">
                  {['NZ made and owned', 'Selected custom runs from 500', 'Free sample support'].map((item) => (
                    <span key={item} className="flex items-center gap-2"><Check size={15} className="text-lime-300" />{item}</span>
                  ))}
                </div>
              </div>
              <a href="https://jadcup.co.nz/contact/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-7 py-3.5 text-sm font-bold text-jade-950 no-underline hover:bg-lime-200">
                Request a free sample <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
