import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CircleHelp,
  ClipboardList,
  Clock3,
  LogIn,
  PackageSearch,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const newCustomerTasks = [
  {
    icon: PackageSearch,
    label: 'I need help choosing',
    title: 'Find the right packaging',
    description: 'Answer three practical questions and get a starting recommendation for your business.',
    action: 'Start packaging finder',
    to: '/start',
    featured: true,
  },
  {
    icon: Boxes,
    label: 'I know what I need',
    title: 'Explore product options',
    description: 'Compare product families, materials and pack formats without working through a sales catalogue.',
    action: 'Open product explorer',
    to: '/products',
  },
  {
    icon: Sparkles,
    label: 'I want to check quality',
    title: 'Request a sample or quote',
    description: 'Prepare a useful brief for the Jadcup team, including volume, timing and product requirements.',
    action: 'Prepare my request',
    to: '/sample',
  },
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
                <p className="section-kicker">Your Jadcup</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl">
                  Welcome back, {session.userName}.
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
                  {approved
                    ? 'Pick up the work around your account—orders, delivery activity and support.'
                    : 'Your portal access request is still part of the customer journey. Check its current status here.'}
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
                <ClipboardList className="text-lime-300" size={27} />
                <p className="mt-12 text-xs font-bold uppercase tracking-[0.16em] text-lime-300">Account overview</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Continue to your customer dashboard.</h2>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white">Open dashboard <ArrowRight className="transition group-hover:translate-x-1" size={16} /></span>
              </Link>
              <div className="grid gap-5">
                <Link to="/orders" className="group rounded-[1.75rem] border border-stone-200 bg-white p-7 text-gray-950 no-underline">
                  <RefreshCcw className="text-jade-700" size={23} />
                  <h2 className="mt-7 text-2xl font-semibold">Orders and repeat supply</h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">Review recent orders and follow current activity.</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-jade-800">View orders <ArrowRight size={15} /></span>
                </Link>
                <Link to="/help" className="group rounded-[1.75rem] border border-stone-200 bg-white p-7 text-gray-950 no-underline">
                  <CircleHelp className="text-jade-700" size={23} />
                  <h2 className="mt-7 text-2xl font-semibold">Need help?</h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">Find account, delivery and product answers in one place.</p>
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-stone-200 bg-white p-8 sm:p-10">
              <Clock3 className="text-amber-600" size={28} />
              <h2 className="mt-7 text-3xl font-semibold tracking-tight text-gray-950">Your access request has not opened the account yet.</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-stone-600">Customer information remains protected while Jadcup confirms the correct business record.</p>
              <Link to="/application-status" className="mt-7 inline-flex items-center gap-2 rounded-full bg-jade-900 px-6 py-3 text-sm font-bold text-white no-underline">Check application status <ArrowRight size={16} /></Link>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-18">
          <div className="max-w-3xl">
            <p className="section-kicker">Jadcup customer entry</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-gray-950 sm:text-5xl lg:text-6xl">
              What would you like to get done today?
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
              You do not need an account to explore packaging or prepare a sample request. Existing customers can go straight to their Jadcup account.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {newCustomerTasks.map(({ icon: Icon, label, title, description, action, to, featured }) => (
            <Link
              key={to}
              to={to}
              className={`group flex min-h-[22rem] flex-col rounded-[1.75rem] p-7 no-underline sm:p-8 ${featured ? 'bg-jade-950 text-white' : 'border border-stone-200 bg-white text-gray-950'}`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${featured ? 'bg-lime-300 text-jade-950' : 'bg-jade-100 text-jade-800'}`}><Icon size={23} /></div>
              <p className={`mt-8 text-xs font-bold uppercase tracking-[0.15em] ${featured ? 'text-lime-300' : 'text-jade-700'}`}>{label}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h2>
              <p className={`mt-3 text-sm leading-relaxed ${featured ? 'text-jade-100/65' : 'text-stone-600'}`}>{description}</p>
              <span className={`mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold ${featured ? 'text-white' : 'text-jade-800'}`}>{action} <ArrowRight className="transition group-hover:translate-x-1" size={16} /></span>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jade-100 text-jade-800"><LogIn size={19} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-jade-700">Existing Jadcup customer</p>
                <h2 className="mt-2 text-xl font-semibold text-gray-950">Sign in to orders and account activity.</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-jade-800">Customer sign in <ArrowRight size={14} /></Link>
                  <Link to="/apply" className="text-sm font-semibold text-stone-600">Request portal access</Link>
                </div>
              </div>
            </div>
          </div>

          <Link to="/help" className="rounded-[1.5rem] border border-stone-200 bg-white p-6 text-gray-950 no-underline sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700"><CircleHelp size={19} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">Not sure where to begin?</p>
                <h2 className="mt-2 text-xl font-semibold">Open the help centre or contact Jadcup.</h2>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-jade-800">Get help <ArrowRight size={14} /></span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-stone-200 pt-8 text-xs font-semibold text-stone-500">
          <span>NZ made</span><span>Free sample support</span><span>Selected custom runs from 500</span><span>No account required to explore</span>
        </div>
      </section>
    </main>
  );
}
