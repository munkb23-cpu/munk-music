import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Play, Lock, Check, Clock } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!course) notFound();

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index');

  const { data: { user } } = await supabase.auth.getUser();
  let enrolled = false;
  if (user) {
    const { data } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .maybeSingle();
    enrolled = !!data;
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Link href="/courses" className="text-sm link-underline flex items-center gap-2 mb-12">
          <ArrowLeft className="w-4 h-4" /> Бүх сургалт
        </Link>

        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          {/* Зүүн — тайлбар */}
          <div className="lg:col-span-2">
            <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-4">
              Сургалт · {course.level}
            </div>
            <h1 className="display text-5xl md:text-7xl leading-[0.95] mb-6">
              {course.title}
            </h1>
            <p className="text-xl text-muted leading-relaxed mb-8">
              {course.subtitle}
            </p>

            <div className="flex flex-wrap gap-3 mono text-xs uppercase tracking-widest mb-10">
              <span className="border border-line px-3 py-2 rounded-full flex items-center gap-2">
                <Clock className="w-3 h-3" /> {course.duration}
              </span>
              <span className="border border-line px-3 py-2 rounded-full">
                {lessons?.length || 0} хичээл
              </span>
            </div>

            {enrolled ? (
              <div className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium">
                <Check className="w-4 h-4 text-accent" /> Бүртгэгдсэн
              </div>
            ) : course.price > 0 ? (
              <div className="flex items-center gap-6">
                <div className="display text-5xl">₮{course.price.toLocaleString()}</div>
                {user ? (
                  <button className="bg-ink text-paper px-8 py-4 rounded-full text-base font-medium hover:bg-accent transition-colors">
                    Худалдаж авах
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="bg-ink text-paper px-8 py-4 rounded-full text-base font-medium hover:bg-accent transition-colors"
                  >
                    Нэвтрэх → Худалдаж авах
                  </Link>
                )}
              </div>
            ) : (
              <div className="inline-block bg-accent text-paper px-6 py-3 rounded-full text-sm font-medium">
                Үнэгүй
              </div>
            )}
          </div>

          {/* Баруун — карт */}
          <div className="lg:col-span-1">
            <div
              className="aspect-[3/4] relative overflow-hidden noise rounded-lg"
              style={{ backgroundColor: course.color }}
            >
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="mono text-xs uppercase tracking-widest text-paper/80">
                  {course.duration}
                </div>
                <div className="display text-9xl text-paper/90 text-center">{course.icon}</div>
                <div className="mono text-xs uppercase tracking-widest text-paper/70">
                  {lessons?.length || 0} хичээл
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Хичээлийн жагсаалт */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b border-line pb-3">
            <h2 className="display text-4xl md:text-5xl">
              Хичээл
            </h2>
            <span className="mono text-xs uppercase tracking-widest text-muted">
              {lessons?.length || 0} нийт
            </span>
          </div>

          {!lessons || lessons.length === 0 ? (
            <div className="text-center py-20">
              <p className="mono text-sm uppercase tracking-widest text-muted">
                Хичээл хараахан нэмэгдээгүй
              </p>
            </div>
          ) : (
            <div className="border-y border-line divide-y divide-line">
              {lessons.map((l, i) => {
                const canWatch = l.is_free || enrolled;
                return (
                  <div
                    key={l.id}
                    className="group py-6 flex items-center gap-6 hover:bg-cream/50 -mx-6 px-6 transition-colors"
                  >
                    <div className="display text-3xl text-muted w-12 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="display text-2xl">{l.title}</h3>
                        {l.is_free && (
                          <span className="mono text-[10px] uppercase tracking-widest bg-accent text-paper px-2 py-0.5 rounded-full">
                            Үнэгүй
                          </span>
                        )}
                      </div>
                      {l.description && (
                        <p className="text-muted text-sm">{l.description}</p>
                      )}
                      <div className="mono text-xs uppercase tracking-widest text-muted mt-1">
                        {l.duration}
                      </div>
                    </div>
                    {canWatch ? (
                      <Link
                        href={`/courses/${course.slug}/lesson/${l.id}`}
                        className="w-12 h-12 rounded-full bg-ink text-paper flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0"
                      >
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </Link>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-cream text-muted flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
