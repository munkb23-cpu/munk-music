import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function SiteHeader() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-ink text-paper flex items-center justify-center rounded-full display text-xl italic">M</div>
          <span className="display text-2xl italic">Munk Music</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/courses" className="link-underline">Хичээл</Link>
          <Link href="/shop" className="link-underline">Ноот & Таб</Link>
          <Link href="/#pricing" className="link-underline">Үнэ</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/library" className="text-sm link-underline">Миний сан</Link>
          ) : (
            <Link href="/login" className="text-sm link-underline">Нэвтрэх</Link>
          )}
          <Link
            href={user ? '/library' : '/login'}
            className="bg-ink text-paper px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors rounded-full"
          >
            {user ? 'Миний сан' : 'Үнэгүй эхлүүлэх'}
          </Link>
        </div>
      </div>
    </header>
  );
}
