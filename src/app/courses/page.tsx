import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowRight } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default async function CoursesPage() {
  const supabase = createClient();

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('order_index');

  const grouped: Record<string, typeof courses> = {};
  courses?.forEach((c) => {
    if (!grouped[c.category]) grouped[c.category] = [];
    grouped[c.category]!.push(c);
  });

  const categoryNames: Record<string, string> = {
    guitar: 'Гитар',
    bass: 'Басс гитар',
    ukulele: 'Үкүлэлэ',
    theory: 'Хөгжмийн онол',
    jazz: 'Жазз гармони',
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />

      <section className="border-b border-line">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-4">Сургалт</div>
          <h1 className="display text-6xl md:text-8xl leading-[0.95] mb-6">
            Бүх <em className="text-accent">сургалт</em>
          </h1>
          <p className="text-xl text-muted max-w-2xl">
            Гитар, басс, үкүлэлэ, хөгжмийн онол, жазз гармони — анхан шатнаас ахисан түвшин хүртэл.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {!courses || courses.length === 0 ? (
          <div className="text-center py-32">
            <p className="mono text-sm uppercase tracking-widest text-muted">
              Хараахан сургалт алга
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, list]) => (
            <div key={category} className="mb-20">
              <div className="flex items-end justify-between mb-8 border-b border-line pb-3">
                <h2 className="display text-4xl md:text-5xl">
                  {categoryNames[category] || category}
                </h2>
                <span className="mono text-xs uppercase tracking-widest text-muted">
                  {list?.length} сургалт
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list?.map((c) => (
                  <Link
                    key={c.id}
                    href={`/courses/${c.slug}`}
                    className="group block card-hover"
                  >
                    <div
                      className="aspect-[3/4] relative overflow-hidden noise"
                      style={{ backgroundColor: c.color }}
                    >
                      <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        <div className="mono text-xs uppercase tracking-widest text-paper/80">
                          {c.duration}
                        </div>
                        <div className="display text-7xl text-paper/90 text-right">
                          {c.icon}
                        </div>
                        <div>
                          <div className="mono text-xs uppercase tracking-widest text-paper/70 mb-2">
                            {c.level}
                          </div>
                          <h3 className="display text-3xl text-paper leading-tight">
                            {c.title}
                          </h3>
                        </div>
                      </div>
                      <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-paper/10 backdrop-blur flex items-center justify-center text-paper group-hover:bg-accent transition-colors">
                        <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                      </div>
                    </div>
                    <div className="pt-4 flex items-baseline justify-between">
                      <p className="text-sm text-muted italic">{c.subtitle}</p>
                      {c.price > 0 ? (
                        <span className="display text-xl">₮{c.price.toLocaleString()}</span>
                      ) : (
                        <span className="mono text-xs uppercase tracking-widest text-accent">Үнэгүй</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
