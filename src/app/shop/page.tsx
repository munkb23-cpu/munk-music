import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from('products')
    .select('*')
    .eq('published', true);

  if (searchParams.type && ['tab', 'sheet', 'book'].includes(searchParams.type)) {
    query = query.eq('type', searchParams.type);
  }

  const { data: products } = await query.order('created_at', { ascending: false });

  const filters = [
    { id: 'all', label: 'Бүгд', href: '/shop' },
    { id: 'tab', label: 'Таб', href: '/shop?type=tab' },
    { id: 'sheet', label: 'Ноот', href: '/shop?type=sheet' },
    { id: 'book', label: 'Ном', href: '/shop?type=book' },
  ];
  const currentFilter = searchParams.type || 'all';

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />

      <section className="border-b border-line">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-4">Дэлгүүр</div>
          <h1 className="display text-6xl md:text-8xl leading-[0.95] mb-6">
            Ноот, таб, <em className="text-accent">ном</em>
          </h1>
          <p className="text-xl text-muted max-w-2xl mb-10">
            Хамгийн сүүлийн үеийн хөгжмийн ноот, гитарын таб, дасгалын номын сан.
          </p>

          {/* Шүүлт */}
          <div className="flex flex-wrap gap-2 mono text-xs uppercase tracking-widest">
            {filters.map((f) => (
              <Link
                key={f.id}
                href={f.href}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  currentFilter === f.id
                    ? 'bg-ink text-paper border-ink'
                    : 'border-line hover:border-ink'
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {!products || products.length === 0 ? (
          <div className="text-center py-32">
            <p className="mono text-sm uppercase tracking-widest text-muted">
              Бүтээгдэхүүн олдсонгүй
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link key={p.id} href={`/shop/${p.id}`} className="group card-hover">
                <div
                  className="aspect-[3/4] relative overflow-hidden noise mb-4"
                  style={{ backgroundColor: p.cover_color }}
                >
                  <div className="absolute top-3 left-3 mono text-[10px] uppercase tracking-widest bg-paper/90 text-ink px-2 py-1 rounded-full">
                    {p.type === 'tab' ? 'ТАБ' : p.type === 'sheet' ? 'НООТ' : 'НОМ'}
                  </div>
                  {p.difficulty && (
                    <div className="absolute bottom-3 right-3 mono text-[10px] uppercase tracking-widest text-paper/80">
                      {p.difficulty}
                    </div>
                  )}
                </div>
                <h3 className="display text-xl leading-tight mb-1">{p.title}</h3>
                <p className="text-sm text-muted italic mb-2">{p.artist}</p>
                <p className="display text-lg">₮{p.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
