import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowRight } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const supabase = createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('order_index');

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-paper">
        <section className="border-b border-line">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-6">
              Сургалт · {courses?.length || 0}
            </div>
            <h1 className="display text-6xl md:text-8xl leading-[0.95] max-w-4xl">
              Бүх <em className="text-accent">сургалт</em>
            </h1>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            {!courses || courses.length === 0 ? (
              <div className="text-center py-20 text-muted">
                Удахгүй гарна
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((c) => (
                  <Link
                    key={c.id}
                    href={`/courses/${c.slug}`}
                    className="group block card-hover"
                  >
                    <div
                      className="aspect-[3/4] relative overflow-hidden noise"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.image_url && (
                        <img
                          src={c.image_url}
                          alt={c.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <div className={`absolute inset-0 p-6 flex flex-col justify-between ${c.image_url ? 'bg-gradient-to-b from-black/20 via-transparent to-black/70' : ''}`}>
                        <div className="mono text-xs uppercase tracking-widest text-paper/80">
                          {c.duration}
                        </div>
                        {!c.image_url && (
                          <div className="display text-7xl text-paper/90 text-right">
                            {c.icon}
                          </div>
                        )}
                        <div>
                          <div className="mono text-xs uppercase tracking-widest text-paper/70 mb-2">
                            {c.level}
                          </div>
                          <h3 className="display text-3xl text-paper leading-tight">
                            {c.title}
                          </h3>
                          {c.subtitle && (
                            <p className="text-paper/80 text-sm mt-2 line-clamp-2">
                              {c.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-paper/10 backdrop-blur flex items-center justify-center text-paper group-hover:bg-accent transition-colors">
                        <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                      </div>
                    </div>
                    <div className="pt-4 flex items-center justify-between">
                      <span className="mono text-xs uppercase tracking-widest text-muted">
                        {c.category}
                      </span>
                      <span className="text-sm font-medium">
                        {c.price === 0 ? 'Үнэгүй' : `₮${c.price.toLocaleString()}`}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
