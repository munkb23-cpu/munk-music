import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PlayCircle, Lock, Clock } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!course) {
    notFound();
  }

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .eq('published', true)
    .order('order_index');

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-paper">
        <section className="border-b border-line">
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
            <Link href="/courses" className="mono text-xs uppercase tracking-widest text-muted hover:text-ink mb-8 inline-block">
              ← Бүх сургалт
            </Link>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-4">
                  {course.category} · {course.level}
                </div>
                <h1 className="display text-5xl md:text-7xl leading-[0.95] mb-6">
                  {course.title}
                </h1>
                {course.subtitle && (
                  <p className="text-xl text-muted leading-relaxed mb-8">
                    {course.subtitle}
                  </p>
                )}
                <div className="flex flex-wrap gap-6 text-sm">
                  {course.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted" />
                      <span>{course.duration}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted">Хичээл:</span>{' '}
                    <span className="font-medium">{lessons?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted">Үнэ:</span>{' '}
                    <span className="font-medium">
                      {course.price === 0 ? 'Үнэгүй' : `₮${course.price.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="aspect-[3/4] relative overflow-hidden rounded-2xl noise"
                style={{ backgroundColor: course.color }}
              >
                {course.image_url ? (
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="display text-9xl text-paper/40">
                      {course.icon}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="display text-3xl mb-8">Хичээлүүд</h2>
            {!lessons || lessons.length === 0 ? (
              <p className="text-muted">Хичээлүүд удахгүй нэмэгдэнэ.</p>
            ) : (
              <div className="space-y-2">
                {lessons.map((l, i) => (
                  <Link
                    key={l.id}
                    href={`/courses/${course.slug}/lesson/${l.id}`}
                    className="block border border-line rounded-xl p-5 hover:border-ink transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="mono text-xs text-muted w-8">{String(i + 1).padStart(2, '0')}</div>
                      <div className="flex-1">
                        <div className="font-medium group-hover:text-accent transition-colors">
                          {l.title}
                        </div>
                        {l.duration && (
                          <div className="text-xs text-muted mt-1">{l.duration}</div>
                        )}
                      </div>
                      {l.is_free ? (
                        <PlayCircle className="w-5 h-5 text-accent" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted" />
                      )}
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
