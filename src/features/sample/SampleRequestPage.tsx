import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Mail, PackageCheck, ShieldCheck } from 'lucide-react';

const businessLabels: Record<string, string> = {
  cafe: 'Café or coffee brand',
  takeaway: 'Takeaway or foodservice',
  dessert: 'Dessert or cold drinks',
  event: 'Event or campaign',
};

const needLabels: Record<string, string> = {
  hot: 'Hot drink packaging',
  cold: 'Cold drink or dessert packaging',
  food: 'Food and takeaway packaging',
  system: 'A coordinated brand system',
};

export function SampleRequestPage() {
  const [params] = useSearchParams();
  const [prepared, setPrepared] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: businessLabels[params.get('business') || ''] || '',
    product: params.get('product') || needLabels[params.get('need') || ''] || '',
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
            <p className="section-kicker">Samples and quotation</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl">Give Jadcup a useful brief—not a vague contact message.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">Prepare the details that affect the recommendation: what you serve, likely volume, timing and what you want to evaluate.</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] bg-jade-950 p-7 text-white">
              <PackageCheck className="text-lime-300" size={25} />
              <h2 className="mt-7 text-2xl font-semibold">What happens next</h2>
              <div className="mt-6 space-y-5">
                {['Jadcup checks product suitability', 'The team confirms sample and quantity options', 'Artwork and timing are aligned before production'].map((item) => (
                  <p key={item} className="flex items-start gap-3 text-sm leading-relaxed text-jade-100/70"><Check className="mt-0.5 shrink-0 text-lime-300" size={16} />{item}</p>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-5 text-sm text-stone-600"><ShieldCheck className="mt-0.5 shrink-0 text-jade-700" size={18} /><p>This preview prepares an email for your own mail app. It does not silently submit personal information.</p></div>
            <Link to="/start" className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-jade-800 no-underline"><ArrowLeft size={15} />Return to packaging finder</Link>
          </aside>

          <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={(event) => { event.preventDefault(); if (canPrepare) setPrepared(true); }}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="text-sm font-semibold text-gray-800">Business name *</span><input required value={form.businessName} onChange={(event) => update('businessName', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-jade-600" placeholder="Company or trading name" /></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">Contact name *</span><input required value={form.contactName} onChange={(event) => update('contactName', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-jade-600" placeholder="Your name" /></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">Work email *</span><input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-jade-600" placeholder="name@business.co.nz" /></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">Phone</span><input value={form.phone} onChange={(event) => update('phone', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-jade-600" placeholder="Best contact number" /></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">Business type</span><select value={form.businessType} onChange={(event) => update('businessType', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-jade-600"><option value="">Choose one</option>{Object.values(businessLabels).map((label) => <option key={label}>{label}</option>)}</select></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">Product or packaging need *</span><input required value={form.product} onChange={(event) => update('product', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-jade-600" placeholder="e.g. 12oz branded hot cup" /></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">Expected volume</span><select value={form.volume} onChange={(event) => update('volume', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-jade-600"><option value="">Not sure yet</option><option>500–1,000 units</option><option>1,000–5,000 units</option><option>5,000–20,000 units</option><option>20,000+ units</option></select></label>
                <label className="block"><span className="text-sm font-semibold text-gray-800">Required timing</span><select value={form.timing} onChange={(event) => update('timing', event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-jade-600"><option value="">Flexible</option><option>Within 2 weeks</option><option>Within 1 month</option><option>Within 2–3 months</option><option>Planning ahead</option></select></label>
              </div>
              <label className="mt-5 block"><span className="text-sm font-semibold text-gray-800">What should the team know?</span><textarea rows={5} value={form.notes} onChange={(event) => update('notes', event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-jade-600" placeholder="What you serve, artwork status, desired material, delivery location or other requirements" /></label>

              {!prepared ? (
                <button type="submit" disabled={!canPrepare} className="mt-7 inline-flex items-center gap-2 rounded-full bg-jade-900 px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Review my request <ArrowRight size={16} /></button>
              ) : (
                <div className="mt-7 rounded-2xl border border-jade-200 bg-jade-50 p-6">
                  <p className="text-sm font-semibold text-jade-950">Your brief is ready. The next button opens your email app with these details filled in so you can review and send it yourself.</p>
                  <a href={emailHref} className="mt-5 inline-flex items-center gap-2 rounded-full bg-jade-900 px-6 py-3 text-sm font-bold text-white no-underline"><Mail size={16} />Open enquiry email</a>
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
