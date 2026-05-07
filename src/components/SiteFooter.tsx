import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-ink text-paper flex items-center justify-center rounded-full display italic">M</div>
              <span className="display text-xl italic">Munk Music</span>
            </div>
            <p className="text-sm text-muted">
              Монголын онлайн хөгжмийн сургууль. Хөгжмөө олж нээ.
            </p>
          </div>
          <div>
            <div className="mono text-xs uppercase tracking-widest text-muted mb-4">Хичээл</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="link-underline">Гитар</Link></li>
              <li><Link href="/courses" className="link-underline">Басс</Link></li>
              <li><Link href="/courses" className="link-underline">Үкүлэлэ</Link></li>
              <li><Link href="/courses" className="link-underline">Жазз гармони</Link></li>
            </ul>
          </div>
          <div>
            <div className="mono text-xs uppercase tracking-widest text-muted mb-4">Дэлгүүр</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="link-underline">Ноот</Link></li>
              <li><Link href="/shop" className="link-underline">Таб</Link></li>
              <li><Link href="/shop" className="link-underline">Ном</Link></li>
            </ul>
          </div>
          <div>
            <div className="mono text-xs uppercase tracking-widest text-muted mb-4">Холбоо</div>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:hello@munkmusic.mn" className="link-underline">hello@munkmusic.mn</a></li>
              <li><a href="#" className="link-underline">Instagram</a></li>
              <li><a href="#" className="link-underline">Facebook</a></li>
              <li><a href="#" className="link-underline">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-line flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <div>© 2026 Munk Music. Бүх эрх хуулиар хамгаалагдсан.</div>
          <div className="mono text-xs uppercase tracking-widest">Монголд бүтээв · est. 2026</div>
        </div>
      </div>
    </footer>
  );
}
