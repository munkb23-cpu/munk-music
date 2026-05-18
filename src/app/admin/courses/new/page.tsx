'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Upload, X } from 'lucide-react';

const COLORS = ['#c97b4a', '#8b4a2f', '#4a2f1f', '#d4a574', '#2c3e2d', '#6b4423', '#3a2819', '#1c4d3e', '#5c2d2d'];
const ICONS = ['🎸', '🪕', '🎷', '🎹', '🥁', '🎺', '🎻', '🎼', '♪', '♫'];

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    subtitle: '',
    category: 'guitar',
    level: 'Анхан',
    color: COLORS[0],
    icon: ICONS[0],
    duration: '',
    price: 0,
    published: false,
    image_url: '',
  });

  const updateTitle = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setForm({ ...form, title, slug });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (file.size > 5 * 1024 * 1024) {
      setError('Зураг хэт том байна (хамгийн ихдээ 5MB)');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Зураг файл сонгоно уу');
      return;
    }

    setUploading(true);
    setError('');

    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('course-images')
      .upload(fileName, file);

    if (uploadError) {
      setError('Upload алдаа: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('course-images')
      .getPublicUrl(fileName);

    setForm({ ...form, image_url: publicUrl });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.from('courses').insert({
      ...form,
      order_index: 0,
    });

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
        <ArrowLeft className="w-4 h-4" /> Сургалтын жагсаалт
      </Link>

      <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-3">Шинэ</div>
      <h1 className="display text-5xl mb-12">Сургалт үүсгэх</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Зураг upload */}
        <div>
          <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">
            Зураг
          </label>
          {form.image_url ? (
            <div className="relative">
              <img
                src={form.image_url}
                alt="Сургалтын зураг"
                className="w-full aspect-[3/4] object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, image_url: '' })}
                className="absolute top-2 right-2 bg-ink text-paper rounded-full p-2 hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-line p-12 rounded-xl text-center cursor-pointer hover:border-ink transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              <Upload className="w-8 h-8 mx-auto text-muted mb-3" />
              <p className="font-medium mb-1">
                {uploading ? 'Хуулж байна...' : 'Зураг сонгох'}
              </p>
              <p className="text-xs text-muted">JPG, PNG · Хамгийн ихдээ 5MB</p>
            </label>
          )}
        </div>

        <div>
          <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Гарчиг *</label>
          <input
            required
            value={form.title}
            onChange={(e) => updateTitle(e.target.value)}
            placeholder="Гитар · Анхан шат"
            className="w-full bg-cream border border-line px-4 py-3 rounded-xl text-base focus:outline-none focus:border-ink"
          />
        </div>

        <div>
          <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">URL slug *</label>
          <input
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="guitar-beginner"
            className="w-full bg-cream border border-line px-4 py-3 rounded-xl text-base focus:outline-none focus:border-ink mono"
          />
          <p className="text-xs text-muted mt-1">URL-д ашиглах. Зөвхөн англи үсэг, тоо, зураас.</p>
        </div>

        <div>
          <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Тайлбар</label>
          <input
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Эхлэгчдэд зориулсан үндсэн суурь"
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
              value={form.level}
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
            <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Үргэлжлэх хугацаа</label>
            <input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="24 цаг · 8 долоо хоног"
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
            <p className="text-xs text-muted mt-1">0 — үнэгүй</p>
          </div>
        </div>

        <div>
          <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">
            Дэвсгэр өнгө {form.image_url && '(зураггүй үед ашиглана)'}
          </label>
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
            <span className="font-medium">Нийтлэх</span>
            <span className="text-sm text-muted ml-2">Сайт дээр харагдана</span>
          </span>
        </label>

        {error && (
          <div className="text-sm text-accent border border-accent/30 bg-accent/5 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? 'Хадгалж байна...' : 'Үүсгэх'}
          </button>
          <Link href="/admin/courses" className="text-sm text-muted hover:text-ink">
            Цуцлах
          </Link>
        </div>
      </form>
    </div>
  );
}
