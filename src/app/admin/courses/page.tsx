import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';

export default async function AdminCoursesPage() {
  const admin = createAdminClient();

  const { data: courses } = await admin
    .from('courses')
    .select('*, lessons(count)')
    .order('order_index');

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-3">Admin</div>
          <h1 className="display text-5xl">Сургалт</h1>
        </div>
        <Link
          href="/admin/courses/new"
          className="bg-ink text-paper px-5 py-3 rounded-full text-sm font-medium hover:bg-accent transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Шинэ сургалт
        </Link>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="border-2 border-dashed border-line p-20 text-center rounded-2xl">
          <p className="text-muted mb-4">Сургалт хараахан алга</p>
          <Link
            href="/admin/courses/new"
            className="bg-ink text-paper px-5 py-3 rounded-full text-sm font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Эхний сургалт нэмэх
          </Link>
        </div>
      ) : (
        <div className="border border-line rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-cream/50">
              <tr>
                <th className="text-left px-5 py-4 mono text-xs uppercase tracking-widest text-muted font-medium">Сургалт</th>
                <th className="text-left px-5 py-4 mono text-xs uppercase tracking-widest text-muted font-medium">Ангилал</th>
                <th className="text-left px-5 py-4 mono text-xs uppercase tracking-widest text-muted font-medium">Хичээл</th>
                <th className="text-left px-5 py-4 mono text-xs uppercase tracking-widest text-muted font-medium">Үнэ</th>
                <th className="text-left px-5 py-4 mono text-xs uppercase tracking-widest text-muted font-medium">Төлөв</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-cream/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-paper text-xl"
                        style={{ backgroundColor: c.color }}
                      >
                        {c.icon}
                      </div>
                      <div>
                        <div className="font-medium">{c.title}</div>
                        <div className="text-xs text-muted italic">{c.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm">{c.category}</td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/courses/${c.id}/lessons`}
                      className="text-sm link-underline"
                    >
                      {(c.lessons as any)?.[0]?.count || 0} хичээл
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    {c.price > 0 ? `₮${c.price.toLocaleString()}` : 'Үнэгүй'}
                  </td>
                  <td className="px-5 py-4">
                    {c.published ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-accent">
                        <Eye className="w-3 h-3" /> Нийтэлсэн
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                        <EyeOff className="w-3 h-3" /> Ноорог
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/courses/${c.id}/edit`}
                      className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink"
                    >
                      <Edit className="w-3 h-3" /> Засах
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
