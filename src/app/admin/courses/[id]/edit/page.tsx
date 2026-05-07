'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Trash2 } from 'lucide-react';

const COLORS = ['#c97b4a', '#8b4a2f', '#4a2f1f', '#d4a574', '#2c3e2d', '#6b4423', '#3a2819', '#1c4d3e', '#5c2d2d'];
const ICONS = ['🎸', '🪕', '🎷', '🎹', '🥁', '🎺', '🎻', '🎼', '♪', '♫'];

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('courses')
      .select('*')
      .eq('id', params.id)
      .single()
      .then(({ data }) => setForm(data));
  }, [params.id]);

  if (!form) {
    return <div className="text-muted">Уншиж байна...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase
      .from('courses')
      .update({
        title: form.title,
        slug: form.slug,
        subtitle: form.subtitle,
        category: form.category,
        level: form.level,
        color: form.color,
        icon: form.icon,
        duration: form.duration,
        price: form.price,
        published: form.published,
      })
      .eq('id', params.id);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/courses');
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirm('Энэ сургалтыг устгах уу? Бүх хичээл устана.')) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('courses').delete().eq('id', params.id);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/courses');
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/courses" className="text-sm text-muted hover:text-ink flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" /> Жагсаалт
      </Link>

      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-3">Засах</div>
          <h1 className="display text-5xl">{form.title}</h1>
        </div>
      </div>

      <div className="mb-8 p-5 border border-line rounded-2xl bg-cream/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="mono text-xs uppercase tracking-widest text-muted mb-1">Хичээлүүд</div>
            <div className="display text-2xl">Энэ сургалтын хичээлүүдийг удирдах</div>
          </div>
          <Link
            href={`/admin/courses/${params.id}/lessons`}
            className="bg-ink text-paper px-5 py-3 rounded-full text-sm font-medium hover:bg-accent transition-colors"
          >
            Хичээл удирдах →
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Гарчиг *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-cream border border-line px-4 py-3 rounded-xl text-base focus:outline-none focus:border-ink"
          />
        </div>

        <div>
          <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">URL slug *</label>
          <input
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full bg-cream border border-line px-4 py-3 rounded-xl text-base focus:outline-none focus:border-ink mono"
          />
        </div>

        <div>
          <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Тайлбар</label>
          <input
            value={form.subtitle || ''}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="w-full bg-cream border border-line px-4 py-3 rounded-xl text-base focus:outline-none focus:border-ink"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Ангилал</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-cream border border-line px-4 py-3 rounded-xl text-base focus:outline-none focus:border-ink"
            >
              <option value="guitar">Гитар</option>
              <option value="bass">Басс гитар</option>
              <option value="ukulele">Үкүлэлэ</option>
              <option value="theory">Хөгжмийн онол</option>
              <option value="jazz">Жазз гармони</option>
              <option value="piano">Төгөлдөр хуур</option>
              <option value="other">Бусад</option>
            </select>
          </div>
          <div>
            <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Түвшин</label>
            <select
              value={form.level || 'Анхан'}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full bg-cream border border-line px-4 py-3 rounded-xl text-base focus:outline-none focus:border-ink"
            >
              <option value="Анхан">Анхан</option>
              <option value="Дунд">Дунд</option>
              <option value="Ахисан">Ахисан</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Хугацаа</label>
            <input
              value={form.duration || ''}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full bg-cream border border-line px-4 py-3 rounded-xl text-base focus:outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Үнэ (₮)</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
              className="w-full bg-cream border border-line px-4 py-3 rounded-xl text-base focus:outline-none focus:border-ink"
            />
          </div>
        </div>

        <div>
          <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Өнгө</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm({ ...form, color: c })}
                className={`w-10 h-10 rounded-lg ${form.color === c ? 'ring-2 ring-ink ring-offset-2' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Дүрс</label>
          <div className="flex gap-2 flex-wrap">
            {ICONS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setForm({ ...form, icon: i })}
                className={`w-10 h-10 rounded-lg border bg-cream text-2xl flex items-center justify-center ${
                  form.icon === i ? 'border-ink ring-2 ring-ink ring-offset-2' : 'border-line'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer pt-4 border-t border-line">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="w-5 h-5 accent-accent"
          />
          <span>
            <span className="font-medium">Нийтлэгдсэн</span>
            <span className="text-sm text-muted ml-2">Сайтад харагдана</span>
          </span>
        </label>

        {error && (
          <div className="text-sm text-accent border border-accent/30 bg-accent/5 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
            >
              {loading ? 'Хадгалж байна...' : 'Хадгалах'}
            </button>
            <Link href="/admin/courses" className="text-sm text-muted hover:text-ink">
              Цуцлах
            </Link>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-accent hover:text-accent-dark inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-3 h-3" /> Устгах
          </button>
        </div>
      </form>
    </div>
  );
}
