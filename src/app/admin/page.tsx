import Link from 'next/link';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { GraduationCap, BookOpen, Users, ShoppingBag, Plus, ArrowRight } from 'lucide-react';

export default async function AdminDashboard() {
  const admin = createAdminClient();

  // Статистик
  const [
    { count: courseCount },
    { count: lessonCount },
    { count: productCount },
    { count: userCount },
    { count: orderCount },
  ] = await Promise.all([
    admin.from('courses').select('*', { count: 'exact', head: true }),
    admin.from('lessons').select('*', { count: 'exact', head: true }),
    admin.from('products').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'paid'),
  ]);

  const stats = [
    { label: 'Сургалт', count: courseCount || 0, icon: GraduationCap, href: '/admin/courses' },
    { label: 'Хичээл', count: lessonCount || 0, icon: GraduationCap, href: '/admin/courses' },
    { label: 'Бүтээгдэхүүн', count: productCount || 0, icon: BookOpen, href: '/admin/products' },
    { label: 'Хэрэглэгч', count: userCount || 0, icon: Users, href: '/admin' },
    { label: 'Захиалга', count: orderCount || 0, icon: ShoppingBag, href: '/admin' },
  ];

  return (
    <div>
      <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-3">Admin</div>
      <h1 className="display text-5xl mb-12">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {stats.map((s, i) => (
          <Link key={i} href={s.href} className="border border-line bg-paper hover:border-ink transition p-5 rounded-2xl card-hover">
            <s.icon className="w-5 h-5 text-muted mb-3" />
            <div className="display text-4xl mb-1">{s.count}</div>
            <div className="mono text-[10px] uppercase tracking-widest text-muted">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="display text-2xl mb-4">Шуурхай үйлдэл</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/admin/courses/new"
            className="group border border-ink bg-ink text-paper p-6 rounded-2xl hover:bg-accent transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <Plus className="w-6 h-6 mb-3" />
                <div className="display text-2xl mb-1">Шинэ сургалт</div>
                <div className="text-sm text-paper/70">Гитар, басс, онол г.м.</div>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <Link
            href="/admin/products/new"
            className="group border border-ink p-6 rounded-2xl hover:bg-cream transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <Plus className="w-6 h-6 mb-3 text-accent" />
                <div className="display text-2xl mb-1">Шинэ бүтээгдэхүүн</div>
                <div className="text-sm text-muted">Ноот, таб, ном</div>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
