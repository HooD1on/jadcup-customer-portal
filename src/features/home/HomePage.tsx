import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  Factory,
  Leaf,
  LogIn,
  Package,
  Palette,
  Sparkles,
  Timer,
  Truck,
} from 'lucide-react';
import { mockProductHighlights } from '../../mocks/data';

const proofPoints = [
  { value: 'Since 2013', label: 'Packaging experience' },
  { value: 'Auckland made', label: 'Local manufacturing' },
  { value: 'From 500', label: 'Selected custom runs' },
  { value: 'NZ wide', label: 'Business delivery' },
];

const productionSteps = [
  {
    icon: Building2,
    step: '01',
    title: 'Tell us what the business needs',
    description: 'Product, volume, timing and what the packaging needs to say about your brand.',
  },
  {
    icon: Palette,
    step: '02',
    title: 'Shape the right solution',
    description: 'Our team helps align the format, artwork and practical requirements before production.',
  },
  {
    icon: Factory,
    step: '03',
    title: 'Make it locally',
    description: 'Local manufacturing gives your team clearer communication and more responsive lead times.',
  },
  {
    icon: Truck,
    step: '04',
    title: 'Deliver and keep supplying',
    description: 'From the first branded run to ongoing supply, the relationship continues through your account.',
  },
];

export function HomePage() {
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
                Packaging that puts your brand in people&rsquo;s hands.
              </h1>
              <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-jade-100/80">
                Jadcup designs, manufactures and supplies custom cups and food packaging for New Zealand businesses—locally made, easier to manage and built to make your brand visible every day.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://jadcup.co.nz/contact/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3 text-sm font-bold text-jade-950 no-underline transition hover:bg-lime-200"
                >
                  Start a packaging conversation <ArrowRight size={17} />
                </a>
                <Link
                  to="/login"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white no-underline transition hover:bg-white/10"
                >
                  <LogIn size={17} /> Customer sign in
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-8 rounded-full bg-lime-300/10 blur-3xl" aria-hidden="true" />
              <div className="relative grid grid-cols-2 gap-3 sm:gap-4 rotate-[-1deg]">
                <div className="col-span-2 rounded-[2rem] border border-white/15 bg-white/10 p-5 sm:p-7 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">Made close to your business</p>
                      <p className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">From brief to branded packaging, without the offshore distance.</p>
                    </div>
                    <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-300 text-jade-950">
                      <Factory size={24} />
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.75rem] bg-lime-300 p-5 sm:p-6 text-jade-950">
                  <Timer size={24} />
                  <p className="mt-8 text-2xl font-semibold">Responsive by design</p>
                  <p className="mt-2 text-sm leading-relaxed text-jade-950/70">Local production helps teams move from artwork to supply with fewer handovers.</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/15 bg-white p-5 sm:p-6 text-jade-950">
                  <Package size={24} className="text-jade-700" />
                  <p className="mt-8 text-2xl font-semibold">Built for foodservice</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">Cups, bowls, wraps, bags, takeaway packaging and custom print.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 lg:mt-18 grid grid-cols-2 lg:grid-cols-4 border-y border-white/12">
            {proofPoints.map((item) => (
              <div key={item.value} className="px-3 py-5 sm:px-6 lg:border-r lg:last:border-r-0 border-white/12 first:pl-0">
                <p className="text-lg sm:text-xl font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-xs sm:text-sm text-jade-100/60">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="choose-your-path" className="bg-stone-50 py-16 sm:py-20 lg:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker">Choose the right starting point</p>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] text-gray-950">
              New relationship or existing account—each needs a different next step.
            </h2>
          </div>

          <div className="mt-10 grid lg:grid-cols-2 gap-5">
            <article id="new-customers" className="group rounded-[2rem] bg-jade-900 p-7 sm:p-9 text-white scroll-mt-24">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-lime-300 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-jade-950">New to Jadcup</span>
                <Sparkles className="text-lime-300" size={26} />
              </div>
              <h3 className="mt-12 text-3xl sm:text-4xl font-semibold tracking-tight">Start with the packaging, not a portal form.</h3>
              <p className="mt-4 max-w-xl leading-relaxed text-jade-100/75">
                If you are exploring a new cup, takeaway range or custom brand project, speak with the team first. We will help define the product, volume and production path.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://jadcup.co.nz/contact/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-jade-950 no-underline hover:bg-jade-50"
                >
                  Talk to the packaging team <ArrowRight size={16} />
                </a>
                <a
                  href="https://jadcup.co.nz/our-products/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-white/10"
                >
                  Explore products
                </a>
              </div>
            </article>

            <article className="rounded-[2rem] border border-stone-200 bg-white p-7 sm:p-9 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-jade-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-jade-800">Already a Jadcup customer</span>
                <BadgeCheck className="text-jade-700" size={26} />
              </div>
              <h3 className="mt-12 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-950">Bring the ongoing account into one place.</h3>
              <p className="mt-4 max-w-xl leading-relaxed text-gray-600">
                Sign in to your Customer Portal, or request portal access if your business already purchases from Jadcup and does not yet have an online account.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-jade-800 px-5 py-3 text-sm font-bold text-white no-underline hover:bg-jade-900">
                  Customer sign in <ArrowRight size={16} />
                </Link>
                <Link to="/apply" className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 no-underline hover:bg-gray-50">
                  Request portal access
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="products" className="bg-white py-16 sm:py-20 lg:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <p className="section-kicker">Food packaging, made useful</p>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] text-gray-950">The product is packaging. The outcome is a stronger brand.</h2>
            </div>
            <a href="https://jadcup.co.nz/our-products/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-jade-800 hover:text-jade-950">
              View the full product range <ArrowRight size={16} />
            </a>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockProductHighlights.map((product, index) => (
              <article key={product.id} className="group overflow-hidden rounded-[1.5rem] border border-stone-200 bg-stone-50">
                <div className={`aspect-[4/3] flex items-center justify-center overflow-hidden ${index % 2 === 0 ? 'bg-jade-50' : 'bg-lime-50'}`}>
                  {product.image ? (
                    <img src={product.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" />
                  ) : (
                    <Package className="text-jade-300" size={54} />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-jade-700">0{index + 1}</p>
                  <h3 className="mt-2 text-lg font-semibold text-gray-950">{product.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{product.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lime-200 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.78fr_1.22fr] gap-10 lg:gap-16">
            <div>
              <p className="section-kicker text-jade-900">A local production relationship</p>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] text-jade-950">One clear path from idea to ongoing supply.</h2>
              <p className="mt-5 text-jade-950/70 leading-relaxed">
                Jadcup works best as a packaging partner: the first conversation shapes the solution, local manufacturing brings it to life, and the portal supports the relationship once you are a customer.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {productionSteps.map(({ icon: Icon, step, title, description }) => (
                <div key={step} className="border-t border-jade-950/20 pt-5">
                  <div className="flex items-center justify-between">
                    <Icon size={21} className="text-jade-900" />
                    <span className="text-xs font-bold tracking-[0.15em] text-jade-950/45">{step}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-jade-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-jade-950/65">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-white border border-stone-200 p-7 sm:p-10 lg:p-12 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="section-kicker">The simple decision</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-950">Need packaging? Talk to us. Already a customer? Use the portal.</h2>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                {['NZ made and owned', 'Sustainable food packaging', 'Custom branding support'].map((item) => (
                  <span key={item} className="flex items-center gap-2"><Check size={15} className="text-jade-700" />{item}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-60">
              <a href="https://jadcup.co.nz/contact/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-jade-800 px-6 py-3 text-sm font-bold text-white no-underline hover:bg-jade-900">
                Contact Jadcup <ArrowRight size={16} />
              </a>
              <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 no-underline hover:bg-gray-50">
                Customer sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
