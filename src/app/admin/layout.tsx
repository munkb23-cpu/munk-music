import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, GraduationCap, BookOpen, LogOut, ExternalLink } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-line bg-cream/30 flex flex-col">
        <div className="p-6 border-b border-line">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-ink text-paper flex items-center justify-center rounded-full display italic">M</div>
            <div>
              <div className="display text-lg italic leading-none">Munk Music</div>
              <div className="mono text-[9px] uppercase tracking-widest text-muted mt-1">admin</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cream transition-colors text-sm">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cream transition-colors text-sm">
            <GraduationCap className="w-4 h-4" />
            Сургалт
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cream transition-colors text-sm">
            <BookOpen className="w-4 h-4" />
            Ноот & Таб
          </Link>
        </nav>

        <div className="p-4 border-t border-line">
          <div className="text-sm font-medium truncate">{profile.full_name || 'Admin'}</div>
          <div className="text-xs text-muted truncate mb-3">{profile.email}</div>
          <div className="flex gap-2">
            <Link href="/" target="_blank" className="flex items-center gap-1.5 text-xs text-muted hover:text-ink">
              <ExternalLink className="w-3 h-3" /> Сайт үзэх
            </Link>
            <form action="/api/auth/signout" method="post" className="ml-auto">
              <button type="submit" className="flex items-center gap-1.5 text-xs text-muted hover:text-accent">
                <LogOut className="w-3 h-3" /> Гарах
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
