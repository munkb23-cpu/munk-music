import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Play, Check, ArrowRight, Music2, Users, Sparkles, Shield } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default async function HomePage() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('published', true)
    .limit(6);

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('order_index');

  const testimonials = [
    { name: 'Баярсайхан Б.', role: 'Гитарчин', text: 'Маш сайн сургалт. Онолын суурь, бодитой дасгал хоёул хослолтой. 3 сарын дотор рок бэндэд тоглох түвшинд хүрсэн.' },
    { name: 'Ариунзаяа Т.', role: 'Хөгжмийн багш', text: 'Оюутнууддаа санал болгож байна. Ноот, таб бүгд чанартай, багш нарын тайлбар тодорхой.' },
    { name: 'Мөнхбат Д.', role: 'Жаз сонирхогч', text: 'ii-V-I дасгалаас эхлээд Bill Evans-ийн voicing хүртэл шат шатаар нь заасан. Маш үр дүнтэй.' },
    { name: 'Энхжин Б.', role: 'Оюутан', text: 'Үкүлэлэ сурах гэж орсон. Чих хөгжлөөс эхлээд дуулах хүртэл бүрэн сургалт. Баярлалаа!' },
  ];

  const stats = [
    { count: '1,200+', label: 'Хичээл' },
    { count: '45+', label: 'Багш' },
    { count: '15,000+', label: 'Сурагч' },
    { count: '98%', label: 'Сэтгэл ханамж' },
  ];

  const features = [
    { icon: Music2, title: 'Бүх зэмсэг', desc: 'Гитар, басс, үкүлэлэ, морин хуур, төгөлдөр хуур — бүхэнд нь сургалт' },
    { icon: Users, title: 'Мэргэжлийн багш', desc: 'Монголын шилдэг хөгжимчид, олон улсын сургууль төгссөн багш нар' },
    { icon: Sparkles, title: 'Бодит ноот, таб', desc: 'Хамгийн сүүлийн үеийн ноот, таб, дасгалын ном — бүгд таны цахим санд' },
    { icon: Shield, title: '30 хоногийн баталгаа', desc: 'Сэтгэл хангалуун биш бол мөнгөө буцааж авна' },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-4xl">
            <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-6 fade-up">
              № 1 · Монголын онлайн хөгжмийн сургууль
            </div>
            <h1 className="display text-6xl md:text-8xl lg:text-9xl leading-[0.95] mb-8 fade-up fade-up-delay-1">
              Хөгжмөө <em className="text-accent">сайжруулах</em><br />
              бүхэн энд байна
            </h1>
            <p className="text-xl md:text-2xl text-muted max-w-2xl leading-relaxed mb-10 fade-up fade-up-delay-2">
              Монголын шилдэг хөгжимчдөөс гитар, басс, үкүлэлэ, жазз гармони сур.
              Ноот, таб, номын сангаар суралцаж, өөрийн хэв маягаа олоорой.
            </p>
            <div className="flex flex-wrap gap-4 fade-up fade-up-delay-3">
              <Link href="/login" className="group bg-ink text-paper px-8 py-4 rounded-full text-base font-medium hover:bg-accent transition-colors inline-flex items-center gap-2">
                Одоо эхлүүлэх
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/courses" className="px-8 py-4 rounded-full text-base font-medium border border-ink hover:bg-ink hover:text-paper transition-colors inline-flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" />
                Хичээл үзэх
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-line pt-10">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="display text-5xl md:text-6xl">{s.count}</div>
                <div className="mono text-xs uppercase tracking-widest text-muted mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/3 right-0 display text-[200px] italic text-ink/5 pointer-events-none select-none hidden lg:block">♪</div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-line bg-cream py-6 overflow-hidden">
        <div className="flex gap-12 mono text-sm uppercase tracking-widest whitespace-nowrap marquee">
          {[...Array(2)].flatMap((_, i) =>
            ['Гитар', '✦', 'Басс гитар', '✦', 'Үкүлэлэ', '✦', 'Морин хуур', '✦', 'Жазз гармони', '✦', 'Хөгжмийн онол', '✦', 'Төгөлдөр хуур', '✦']
              .map((word, j) => (
                <span key={`${i}-${j}`} className={word === '✦' ? 'text-accent' : ''}>{word}</span>
              ))
          )}
        </div>
      </section>

      {/* COURSES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-3">Сургалт</div>
              <h2 className="display text-5xl md:text-6xl">
                Шат шатаар <em>суралц</em>
              </h2>
            </div>
            <Link href="/courses" className="hidden md:inline-flex items-center gap-2 text-sm link-underline">
              Бүгдийг үзэх <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {courses?.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/courses/${c.slug}`} className="group block card-hover">
                <div className="aspect-[3/4] relative overflow-hidden noise" style={{ backgroundColor: c.color }}>
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="mono text-xs uppercase tracking-widest text-paper/80">{c.duration}</div>
                    <div className="display text-7xl text-paper/90 text-right">{c.icon}</div>
                    <div>
                      <div className="mono text-xs uppercase tracking-widest text-paper/70 mb-2">{c.level}</div>
                      <h3 className="display text-3xl text-paper leading-tight">{c.title}</h3>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-paper/10 backdrop-blur flex items-center justify-center text-paper group-hover:bg-accent transition-colors">
                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </div>
                <div className="pt-4 flex items-baseline justify-between">
                  <p className="text-sm text-muted italic">{c.subtitle}</p>
                  {c.price > 0 && <span className="display text-xl">₮{c.price.toLocaleString()}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-cream py-24 noise">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-3">Яагаад Munk Music?</div>
          <h2 className="display text-5xl md:text-6xl mb-16 max-w-3xl">
            Хурдан ахиж, <em>удаан</em> үргэлжлэх<br />
            хөгжмийн аялал
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="group">
                <div className="w-14 h-14 rounded-full bg-ink text-paper flex items-center justify-center mb-5 group-hover:bg-accent transition-colors">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="display text-2xl mb-2">{f.title}</h3>
                <p className="text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-3">Ноот & Таб</div>
              <h2 className="display text-5xl md:text-6xl">Номын <em>сан</em></h2>
            </div>
            <Link href="/shop" className="hidden md:inline-flex items-center gap-2 text-sm link-underline">
              Бүгдийг үзэх <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products?.map((p) => (
              <Link key={p.id} href={`/shop/${p.id}`} className="group card-hover">
                <div className="aspect-[3/4] relative overflow-hidden noise mb-3" style={{ backgroundColor: p.cover_color }}>
                  <div className="absolute top-2 left-2 mono text-[9px] uppercase tracking-widest bg-paper/90 text-ink px-1.5 py-0.5">
                    {p.type === 'tab' ? 'ТАБ' : p.type === 'sheet' ? 'НООТ' : 'НОМ'}
                  </div>
                </div>
                <h4 className="text-sm font-medium leading-tight line-clamp-2">{p.title}</h4>
                <p className="text-xs text-muted italic mt-0.5">{p.artist}</p>
                <p className="display text-base mt-1">₮{p.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-ink text-paper py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mono text-xs uppercase tracking-[0.25em] text-paper/60 mb-3">Сурагчид</div>
          <h2 className="display text-5xl md:text-6xl mb-16 max-w-3xl">
            15,000+ хөгжимчдийн<br />
            <em className="text-accent">итгэмжлэл</em>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="border border-paper/15 p-8 hover:border-accent transition-colors">
                <div className="display text-5xl text-accent leading-none mb-4">"</div>
                <p className="text-lg leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-paper/15">
                  <div className="w-10 h-10 rounded-full bg-paper/10 flex items-center justify-center display italic text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="mono text-xs uppercase tracking-widest text-paper/60">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-3">Үнийн багц</div>
            <h2 className="display text-5xl md:text-6xl">Эхлэхэд <em>бэлэн</em> үү?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-ink p-8 rounded-2xl">
              <h3 className="display text-3xl mb-1">Үнэгүй</h3>
              <p className="text-muted mb-6">Суралцаж эхлэх</p>
              <div className="display text-6xl mb-1">₮0</div>
              <p className="mono text-xs uppercase tracking-widest text-muted mb-8">Үргэлж</p>
              <Link href="/login" className="block text-center border border-ink py-3 rounded-full hover:bg-ink hover:text-paper transition-colors mb-8">
                Эхлүүлэх
              </Link>
              <ul className="space-y-3">
                {['Үнэгүй хичээлүүдэд хандах', 'Тохируулагч, метроном', 'Ноот/таб үзэх'].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-2 border-ink bg-ink text-paper p-8 rounded-2xl relative">
              <div className="absolute -top-3 left-8 bg-accent text-paper text-xs mono uppercase tracking-widest px-3 py-1 rounded-full">
                Санал болгох
              </div>
              <h3 className="display text-3xl mb-1">Pro</h3>
              <p className="text-paper/60 mb-6">Бүрэн эрхтэй хэрэглэгч</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="display text-6xl">₮39,000</span>
              </div>
              <p className="mono text-xs uppercase tracking-widest text-paper/60 mb-8">Сар бүр</p>
              <Link href="/login" className="block text-center bg-accent text-paper py-3 rounded-full hover:bg-accent-dark transition-colors mb-8">
                Сонгох
              </Link>
              <ul className="space-y-3">
                {[
                  'Бүх сургалтад хязгааргүй хандах',
                  'Шинэ хичээл долоо хоног бүр',
                  'Ноот/таб номын санд 30% хямдрал',
                  'Live Q&A, багштай холбогдох',
                  '30 хоногт буцааж өгөх баталгаа',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-3">Асуулт</div>
            <h2 className="display text-5xl md:text-6xl">Байнга асуудаг</h2>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {[
              { q: 'Munk Music гэж юу вэ?', a: 'Монголын хамгийн том онлайн хөгжмийн сургалтын платформ. Гитар, басс, үкүлэлэ, онол, жазз гармоний хичээлүүд, ноот, таб, ном — бүгд нэг газар.' },
              { q: 'Хэрхэн эхлэх вэ?', a: 'Имэйлээрээ үнэгүй бүртгүүлээд, үнэгүй хичээлүүдийг шууд үзэх боломжтой. Сэтгэл хангалуун бол Pro бүртгэлд шилжинэ.' },
              { q: 'Pro багцаас хэзээ ч татгалзаж болох уу?', a: 'Тийм. Ямар ч үед цуцалж болно. Цуцалсны дараа тухайн сарын төгсгөл хүртэл хандалттай үлдэнэ.' },
              { q: 'Төлбөрийг яаж хийх вэ?', a: 'Бүх Монголын банкны аппаар QPay-ээр төлнө — Хаан, Голомт, ХХБ, Төрийн банк гэх мэт.' },
              { q: 'Ноот, таб худалдаж авахад яах вэ?', a: 'Нэг удаа худалдаж авсан ноот, таб таны хувийн санд үүрд үлдэнэ. Хэзээ ч татаж авах, давтан харах боломжтой.' },
            ].map((item, i) => (
              <details key={i} className="group py-6 cursor-pointer">
                <summary className="flex items-center justify-between list-none">
                  <h3 className="display text-2xl pr-4">{item.q}</h3>
                  <span className="w-8 h-8 rounded-full border border-ink flex items-center justify-center flex-shrink-0 group-open:bg-ink group-open:text-paper transition-colors">
                    <span className="group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-4 text-muted leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="display text-6xl md:text-8xl leading-[0.95] mb-8">
            Өнөөдрөөс<br />
            <em className="text-accent">эхэл</em>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
            14 хоногийн үнэгүй туршилт. Картын мэдээлэл шаардахгүй.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-ink text-paper px-10 py-5 rounded-full text-lg font-medium hover:bg-accent transition-colors">
            Үнэгүй бүртгүүлэх
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
