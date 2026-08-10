import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, CircleHelp, KeyRound, Mail, PackageSearch, Phone, Truck } from 'lucide-react';

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

export function HelpPage() {
  return (
    <main className="flex-1 bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker">Help centre</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl">Answers for both sides of the Jadcup relationship.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">New customers can get help choosing and sampling. Existing customers can find portal, order and account guidance.</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-start">
          <div className="space-y-6">
            {helpGroups.map(({ icon: Icon, title, items }) => (
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
              <h2 className="mt-7 text-2xl font-semibold">Still need a person?</h2>
              <p className="mt-3 text-sm leading-relaxed text-jade-100/65">Contact the Jadcup team with your business name, product or order number where possible.</p>
              <div className="mt-6 space-y-3">
                <a href="tel:+6492823988" className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3 text-sm font-semibold text-white no-underline"><Phone size={16} />09 282 3988</a>
                <a href="mailto:Info@jadcup.co.nz" className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3 text-sm font-semibold text-white no-underline"><Mail size={16} />Info@jadcup.co.nz</a>
              </div>
            </div>
            <Link to="/start" className="block rounded-[1.5rem] border border-stone-200 bg-white p-6 text-gray-950 no-underline"><p className="text-xs font-bold uppercase tracking-[0.14em] text-jade-700">New customer</p><h2 className="mt-2 text-lg font-semibold">Use the packaging finder</h2><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-jade-800">Start now <ArrowRight size={14} /></span></Link>
            <Link to="/login" className="block rounded-[1.5rem] border border-stone-200 bg-white p-6 text-gray-950 no-underline"><p className="text-xs font-bold uppercase tracking-[0.14em] text-jade-700">Existing customer</p><h2 className="mt-2 text-lg font-semibold">Go to customer sign in</h2><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-jade-800">Sign in <ArrowRight size={14} /></span></Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
