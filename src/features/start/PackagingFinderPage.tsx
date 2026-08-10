import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Coffee,
  CupSoda,
  IceCreamBowl,
  Leaf,
  PackageCheck,
  PartyPopper,
  Sparkles,
  Store,
  Timer,
  Utensils,
} from 'lucide-react';

type FinderChoice = { value: string; label: string; description: string; icon: typeof Coffee };

const businessChoices: FinderChoice[] = [
  { value: 'cafe', label: 'Café or coffee brand', description: 'Hot drinks, takeaway service and repeat daily trade.', icon: Coffee },
  { value: 'takeaway', label: 'Takeaway or foodservice', description: 'Food, drinks and a coordinated handover experience.', icon: Utensils },
  { value: 'dessert', label: 'Dessert or cold drinks', description: 'Visual products such as shakes, gelato and iced drinks.', icon: IceCreamBowl },
  { value: 'event', label: 'Event or campaign', description: 'A launch, activation, sponsor or seasonal moment.', icon: PartyPopper },
];

const needChoices: FinderChoice[] = [
  { value: 'hot', label: 'Hot drink packaging', description: 'Single wall, double wall, lids and related formats.', icon: Coffee },
  { value: 'cold', label: 'Cold drink or dessert packaging', description: 'Clear cups, milkshake cups and ice cream cups.', icon: CupSoda },
  { value: 'food', label: 'Food and takeaway packaging', description: 'Bowls, bags, napkins and service packaging.', icon: Store },
  { value: 'system', label: 'A coordinated brand system', description: 'Several products that should look and work together.', icon: Sparkles },
];

const priorityChoices: FinderChoice[] = [
  { value: 'small', label: 'Start with a practical quantity', description: 'Test branded packaging without unnecessary stock.', icon: PackageCheck },
  { value: 'fast', label: 'Move quickly', description: 'Support a launch, changeover or time-sensitive need.', icon: Timer },
  { value: 'sustainable', label: 'Prioritise material choices', description: 'Explore compostable and lower-impact options.', icon: Leaf },
  { value: 'consistent', label: 'Build repeat supply', description: 'Create a dependable packaging system for ongoing trade.', icon: Check },
];

const steps = [
  { title: 'What kind of business is this?', description: 'This shapes the customer moment your packaging needs to support.', choices: businessChoices, field: 'business' as const },
  { title: 'What do you need help with first?', description: 'Choose the closest starting point. It does not lock you into one product.', choices: needChoices, field: 'need' as const },
  { title: 'What matters most for the first decision?', description: 'Jadcup can use this priority to shape the most useful sample and conversation.', choices: priorityChoices, field: 'priority' as const },
];

interface FinderState {
  business: string;
  need: string;
  priority: string;
}

const emptyFinder: FinderState = { business: '', need: '', priority: '' };
const FINDER_KEY = 'jadcup.portal.packaging-finder';

function readFinder(): FinderState {
  try {
    const parsed = JSON.parse(localStorage.getItem(FINDER_KEY) || '') as Partial<FinderState>;
    return {
      business: typeof parsed.business === 'string' ? parsed.business : '',
      need: typeof parsed.need === 'string' ? parsed.need : '',
      priority: typeof parsed.priority === 'string' ? parsed.priority : '',
    };
  } catch {
    return emptyFinder;
  }
}

function recommendation(state: FinderState) {
  const business = businessChoices.find((choice) => choice.value === state.business)?.label || 'your business';
  const need = needChoices.find((choice) => choice.value === state.need)?.label || 'food packaging';
  const priority = priorityChoices.find((choice) => choice.value === state.priority)?.label || 'a practical first step';

  const productRoute: Record<string, string> = {
    hot: 'Start with a single-wall or double-wall cup sample, then match lids and print requirements.',
    cold: 'Start with a clear, milkshake or ice cream cup sample suited to what customers will see and hold.',
    food: 'Start with the core takeaway format, then coordinate bags, napkins and supporting packaging.',
    system: 'Begin with the highest-volume customer touchpoint and build a coordinated product family around it.',
  };

  return {
    title: `${need} for ${business}`,
    description: productRoute[state.need] || 'Start with a physical sample and a short packaging brief.',
    priority,
  };
}

export function PackagingFinderPage() {
  const [finder, setFinder] = useState<FinderState>(readFinder);
  const [step, setStep] = useState(() => finder.business ? (finder.need ? (finder.priority ? 3 : 2) : 1) : 0);
  const result = useMemo(() => recommendation(finder), [finder]);

  useEffect(() => {
    localStorage.setItem(FINDER_KEY, JSON.stringify(finder));
  }, [finder]);

  const reset = () => {
    setFinder(emptyFinder);
    setStep(0);
    localStorage.removeItem(FINDER_KEY);
  };

  if (step === 3) {
    const query = new URLSearchParams({
      business: finder.business,
      need: finder.need,
      priority: finder.priority,
    }).toString();
    return (
      <main className="flex-1 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-jade-900"><ArrowLeft size={15} />Change an answer</button>
          <div className="mt-6 overflow-hidden rounded-[2rem] border border-stone-200 bg-white">
            <div className="bg-jade-950 p-8 text-white sm:p-10 lg:p-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300 text-jade-950"><PackageCheck size={23} /></div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-lime-300">Your starting route</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">{result.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-jade-100/70">{result.description}</p>
            </div>
            <div className="p-7 sm:p-10">
              <div className="grid gap-5 sm:grid-cols-3">
                {[
                  ['Business', businessChoices.find((choice) => choice.value === finder.business)?.label],
                  ['Starting need', needChoices.find((choice) => choice.value === finder.need)?.label],
                  ['First priority', result.priority],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-stone-50 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-2 text-sm font-semibold text-gray-950">{value}</p></div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-jade-200 bg-jade-50 p-6">
                <p className="text-sm font-semibold text-jade-950">Best next step: request a physical sample and let Jadcup confirm product suitability, quantity and timing.</p>
                <p className="mt-2 text-xs leading-relaxed text-jade-800/70">This recommendation is a starting brief, not an automated production specification.</p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to={`/sample?${query}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-jade-900 px-6 py-3 text-sm font-bold text-white no-underline">Prepare sample request <ArrowRight size={16} /></Link>
                <Link to="/products" className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-gray-800 no-underline">Compare products</Link>
                <button type="button" onClick={reset} className="px-4 py-3 text-sm font-semibold text-stone-500 hover:text-jade-900">Start again</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const current = steps[step];
  const selected = finder[current.field];

  return (
    <main className="flex-1 bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex items-center justify-between gap-5">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 no-underline hover:text-jade-900"><ArrowLeft size={15} />Customer home</Link>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">Step {step + 1} of 3</p>
        </div>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-stone-200"><div className="h-full rounded-full bg-jade-700 transition-all" style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>

        <div className="mt-10 max-w-3xl">
          <p className="section-kicker">Packaging finder</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-gray-950 sm:text-4xl lg:text-5xl">{current.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">{current.description}</p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {current.choices.map(({ value, label, description, icon: Icon }) => {
            const active = selected === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFinder((previous) => ({ ...previous, [current.field]: value }))}
                className={`rounded-[1.5rem] border p-6 text-left transition sm:p-7 ${active ? 'border-jade-800 bg-jade-950 text-white shadow-lg' : 'border-stone-200 bg-white text-gray-950 hover:border-jade-300'}`}
                aria-pressed={active}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${active ? 'bg-lime-300 text-jade-950' : 'bg-jade-100 text-jade-800'}`}><Icon size={21} /></div>
                  {active && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-jade-900"><Check size={15} /></span>}
                </div>
                <h2 className="mt-6 text-xl font-semibold">{label}</h2>
                <p className={`mt-2 text-sm leading-relaxed ${active ? 'text-jade-100/65' : 'text-stone-600'}`}>{description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-9 flex items-center justify-between gap-4 border-t border-stone-200 pt-6">
          <button type="button" onClick={() => setStep((currentStep) => Math.max(0, currentStep - 1))} disabled={step === 0} className="inline-flex items-center gap-2 px-3 py-3 text-sm font-semibold text-stone-600 disabled:invisible"><ArrowLeft size={15} />Back</button>
          <button type="button" onClick={() => setStep((currentStep) => currentStep + 1)} disabled={!selected} className="inline-flex items-center gap-2 rounded-full bg-jade-900 px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{step === 2 ? 'See my starting route' : 'Continue'} <ArrowRight size={16} /></button>
        </div>
      </div>
    </main>
  );
}
