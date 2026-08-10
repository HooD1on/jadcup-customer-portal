import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  LogIn,
  MessageSquareText,
  PackageCheck,
  RefreshCcw,
  Route,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const relationshipStages = [
  ['01', 'Packaging request'],
  ['02', 'Sample & quote'],
  ['03', 'Customer account'],
  ['04', 'Orders & supply'],
];

const customerWork = [
  { icon: ClipboardCheck, title: 'Packaging projects', text: 'Keep the brief, product direction and commercial conversation connected.' },
  { icon: FileCheck2, title: 'Samples & artwork', text: 'Know what is waiting for information, review or approval.' },
  { icon: Truck, title: 'Orders & delivery', text: 'Follow confirmed work from order through production and supply.' },
  { icon: MessageSquareText, title: 'Support & changes', text: 'Raise an issue with the customer, product or order context already attached.' },
];

export function HomePage() {
  const { session } = useAuth();

  if (session) {
    const approved = session.accountStatus === 'Approved';
    return (
      <main className="flex-1 bg-stone-50">
        <section className="border-b border-stone-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="section-kicker">Your Jadcup workspace</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl">Welcome back, {session.userName}.</h1>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
                  {approved
                    ? 'Continue the work around your account, orders, deliveries and support.'
                    : 'Your workspace is being connected to the correct Jadcup customer record.'}
                </p>
              </div>
              <span className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${approved ? 'bg-jade-100 text-jade-800' : 'bg-amber-100 text-amber-900'}`}>
                {approved ? <BadgeCheck size={17} /> : <Clock3 size={17} />}
                {approved ? 'Account connected' : `${session.accountStatus} access`}
              </span>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          {approved ? (
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <Link to="/dashboard" className="group rounded-[2rem] bg-jade-950 p-8 text-white no-underline sm:p-10">
                <BriefcaseBusiness className="text-lime-300" size={27} />
                <p className="mt-12 text-xs font-bold uppercase tracking-[0.16em] text-lime-300">Customer account</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Open your working dashboard.</h2>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white">Continue <ArrowRight className="transition group-hover:translate-x-1" size={16} /></span>
              </Link>
              <div className="grid gap-5">
                <Link to="/orders" className="rounded-[1.75rem] border border-stone-200 bg-white p-7 text-gray-950 no-underline">
                  <RefreshCcw className="text-jade-700" size={23} />
                  <h2 className="mt-7 text-2xl font-semibold">Orders and repeat supply</h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">Review recent orders and follow current activity.</p>
                </Link>
                <Link to="/help" className="rounded-[1.75rem] border border-stone-200 bg-white p-7 text-gray-950 no-underline">
                  <CircleHelp className="text-jade-700" size={23} />
                  <h2 className="mt-7 text-2xl font-semibold">Account and order help</h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">Get support with the right account context attached.</p>
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-stone-200 bg-white p-8 sm:p-10">
              <Clock3 className="text-amber-600" size={28} />
              <h2 className="mt-7 text-3xl font-semibold tracking-tight text-gray-950">Your customer workspace is not connected yet.</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-stone-600">Jadcup is confirming the business and matching the correct customer record. Private account data remains protected until that is complete.</p>
              <Link to="/application-status" className="mt-7 inline-flex items-center gap-2 rounded-full bg-jade-900 px-6 py-3 text-sm font-bold text-white no-underline">Check connection status <ArrowRight size={16} /></Link>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:gap-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-jade-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-jade-800"><ShieldCheck size={14} />Jadcup customer workspace</div>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-gray-950 sm:text-5xl lg:text-6xl">Your work with Jadcup, in one place.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">The Jadcup website introduces the company and products. This workspace is where a business starts, confirms and follows its own packaging relationship.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-jade-950 px-6 py-3.5 text-sm font-bold text-white no-underline">Existing customer sign in <LogIn size={16} /></Link>
                <Link to="/start" className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3.5 text-sm font-bold text-jade-900 no-underline">Start as a new customer <ArrowRight size={16} /></Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-jade-950 p-6 text-white shadow-xl sm:p-8">
              <div className="flex items-center justify-between gap-5">
                <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-300">Relationship workspace</p><h2 className="mt-2 text-2xl font-semibold">One customer record, changing over time.</h2></div>
                <Route className="hidden text-lime-300 sm:block" size={28} />
              </div>
              <div className="mt-7 space-y-2">
                {relationshipStages.map(([number, title], index) => (
                  <div key={number} className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 ${index === 0 ? 'bg-lime-300 text-jade-950' : 'bg-white/7 text-white'}`}>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${index === 0 ? 'bg-jade-950 text-white' : 'bg-white/10 text-jade-100'}`}>{number}</span>
                    <span className="text-sm font-semibold">{title}</span>
                    {index < relationshipStages.length - 1 && <ArrowRight className="ml-auto opacity-45" size={15} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-stone-200 bg-white p-7 sm:p-9">
            <div className="flex items-center justify-between gap-5"><span className="rounded-full bg-lime-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-jade-950">New customer</span><PackageCheck className="text-jade-700" size={25} /></div>
            <h2 className="mt-10 text-3xl font-semibold tracking-tight text-gray-950">Start a packaging relationship.</h2>
            <p className="mt-4 leading-relaxed text-stone-600">Create one project that Jadcup can work with—business details, packaging need, sample, quotation and next decision.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Create a packaging brief', 'Choose a starting product', 'Request sample or quote', 'Follow Jadcup response'].map((item) => <p key={item} className="flex items-center gap-2 text-sm font-semibold text-stone-700"><BadgeCheck className="text-jade-600" size={15} />{item}</p>)}
            </div>
            <Link to="/start" className="mt-8 inline-flex items-center gap-2 rounded-full bg-jade-900 px-5 py-3 text-sm font-bold text-white no-underline">Start new customer workspace <ArrowRight size={16} /></Link>
          </article>

          <article className="rounded-[2rem] bg-jade-950 p-7 text-white sm:p-9">
            <div className="flex items-center justify-between gap-5"><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-jade-100">Existing customer</span><BriefcaseBusiness className="text-lime-300" size={25} /></div>
            <h2 className="mt-10 text-3xl font-semibold tracking-tight">Continue the active account.</h2>
            <p className="mt-4 leading-relaxed text-jade-100/65">Open the records Jadcup already manages for your business—without calling to reconstruct the context each time.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['View active orders', 'Follow production status', 'Repeat previous supply', 'Raise account support'].map((item) => <p key={item} className="flex items-center gap-2 text-sm font-semibold text-jade-100/80"><BadgeCheck className="text-lime-300" size={15} />{item}</p>)}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-3 text-sm font-bold text-jade-950 no-underline">Sign in <ArrowRight size={16} /></Link>
              <Link to="/apply" className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white no-underline">Request portal access</Link>
            </div>
          </article>
        </div>

        <div className="mt-12 border-t border-stone-200 pt-10">
          <div className="max-w-3xl"><p className="section-kicker">What belongs in the customer workspace</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-gray-950">The same business work as the employee system—only through the customer’s view.</h2></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {customerWork.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-[1.5rem] border border-stone-200 bg-white p-6"><Icon className="text-jade-700" size={22} /><h3 className="mt-6 text-lg font-semibold text-gray-950">{title}</h3><p className="mt-2 text-sm leading-relaxed text-stone-600">{text}</p></article>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-[1.5rem] border border-stone-200 bg-white p-6 sm:flex-row sm:items-center sm:p-7">
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">Looking for general information?</p><p className="mt-2 text-sm font-semibold text-gray-950">Company story and the public product overview remain on the Jadcup website.</p></div>
          <a href="https://jadcup.co.nz/" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-jade-800">Visit Jadcup website <ArrowRight size={15} /></a>
        </div>
      </section>
    </main>
  );
}
