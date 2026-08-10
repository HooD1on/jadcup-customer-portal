import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Boxes, PackageSearch } from 'lucide-react';
import { getShowcaseProducts, type ShowcaseProduct } from '../../services/publicCatalogApi';

const filters = ['All', 'Hot cups', 'Cold drinks', 'Clear cups', 'Dessert packaging', 'Brand accessories'];

const productArtwork: Record<number, string> = {
  36: '/img/highlight-cups.svg',
  38: '/img/cup-12oz.svg',
  94: '/img/cup-16oz.svg',
  271: '/img/highlight-accessories.svg',
  1177: '/img/bowl.svg',
  474: '/img/highlight-packaging.svg',
};

export function ProductExplorerPage() {
  const [products, setProducts] = useState<ShowcaseProduct[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    getShowcaseProducts(controller.signal).then(setProducts);
    return () => controller.abort();
  }, []);

  const visibleProducts = useMemo(
    () => filter === 'All' ? products : products.filter((product) => product.category === filter),
    [filter, products],
  );

  return (
    <main className="flex-1 bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="section-kicker">Product explorer</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl">Compare the starting options without digging through a catalogue.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">Use this page to narrow the product family. Jadcup will confirm exact size, material, quantity and production suitability with you.</p>
            </div>
            <Link to="/start" className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-jade-800 no-underline">Not sure? Use the finder <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter products">
          {filters.map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold ${filter === item ? 'bg-jade-900 text-white' : 'border border-stone-200 bg-white text-stone-600 hover:border-jade-300'}`} aria-pressed={filter === item}>{item}</button>
          ))}
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[24rem] animate-pulse rounded-[1.5rem] bg-stone-200" aria-hidden="true" />
          )) : visibleProducts.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white">
              <div className="aspect-[16/10] bg-jade-50 p-6"><img src={product.image || productArtwork[product.id] || '/img/highlight-packaging.svg'} alt="" className="h-full w-full object-contain" /></div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-4"><p className="text-xs font-bold uppercase tracking-[0.13em] text-jade-700">{product.category}</p><p className="text-[0.65rem] font-semibold text-stone-400">{product.productCode}</p></div>
                <h2 className="mt-3 text-xl font-semibold capitalize text-gray-950">{product.name}</h2>
                <dl className="mt-5 grid gap-3 text-sm">
                  <div className="flex items-start justify-between gap-4 border-t border-stone-100 pt-3"><dt className="text-stone-400">Material</dt><dd className="max-w-[65%] text-right font-semibold text-stone-700">{product.material}</dd></div>
                  <div className="flex items-start justify-between gap-4 border-t border-stone-100 pt-3"><dt className="text-stone-400">Pack format</dt><dd className="max-w-[65%] text-right font-semibold text-stone-700">{product.packSize}</dd></div>
                </dl>
                <Link to={`/sample?product=${encodeURIComponent(product.name)}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-jade-800">Ask for this product <ArrowRight size={15} /></Link>
              </div>
            </article>
          ))}
        </div>

        {products.length > 0 && visibleProducts.length === 0 && (
          <div className="mt-7 rounded-[1.5rem] border border-stone-200 bg-white px-6 py-12 text-center"><Boxes className="mx-auto text-jade-300" size={34} /><h2 className="mt-4 text-xl font-semibold text-gray-950">No preview products in this filter yet.</h2><p className="mt-2 text-sm text-stone-500">Jadcup may still have a suitable product. Prepare a request and the team can confirm.</p></div>
        )}

        <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] bg-jade-950 p-7 text-white sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-4"><PackageSearch className="mt-1 shrink-0 text-lime-300" size={24} /><div><h2 className="text-2xl font-semibold">Found the right direction?</h2><p className="mt-2 text-sm text-jade-100/65">Turn it into a useful sample and quotation brief.</p></div></div>
          <Link to="/sample" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-lime-300 px-6 py-3 text-sm font-bold text-jade-950 no-underline">Prepare a request <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
