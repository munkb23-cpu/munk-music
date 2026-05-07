'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';

export default function CourseLessonsPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    duration: '',
    is_free: false,
  });

  const load = async () => {
    const supabase = createClient();
    const [{ data: c }, { data: l }] = await Promise.all([
      supabase.from('courses').select('*').eq('id', params.id).single(),
      supabase.from('lessons').select('*').eq('course_id', params.id).order('order_index'),
    ]);
    setCourse(c);
    setLessons(l || []);
  };

  useEffect(() => { load(); }, [params.id]);

  const addLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('lessons').insert({
      ...newLesson,
      course_id: params.id,
      order_index: lessons.length,
    });
    if (!error) {
      setNewLesson({ title: '', description: '', duration: '', is_free: false });
      setShowForm(false);
      await load();
    }
    setLoading(false);
  };

  const deleteLesson = async (id: string) => {
    if (!confirm('Энэ хичээлийг устгах уу?')) return;
    const supabase = createClient();
    await supabase.from('lessons').delete().eq('id', id);
    await load();
  };

  const toggleFree = async (lesson: any) => {
    const supabase = createClient();
    await supabase.from('lessons').update({ is_free: !lesson.is_free }).eq('id', lesson.id);
    await load();
  };

  if (!course) return <div className="text-muted">Уншиж байна...</div>;

  return (
    <div>
      <Link href="/admin/courses" className="text-sm text-muted hover:text-ink flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" /> Сургалтын жагсаалт
      </Link>

      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-3">{course.title}</div>
          <h1 className="display text-5xl">Хичээлүүд</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-ink text-paper px-5 py-3 rounded-full text-sm font-medium hover:bg-accent transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Хаах' : 'Хичээл нэмэх'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addLesson} className="border border-ink p-6 rounded-2xl mb-8 bg-cream/30 space-y-4">
          <div>
            <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Гарчиг *</label>
            <input
              required
              value={newLesson.title}
              onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
              placeholder="Эхний аккордууд: Em, Am, C"
              className="w-full bg-paper border border-line px-4 py-3 rounded-xl"
            />
          </div>
          <div>
            <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Тайлбар</label>
            <textarea
              value={newLesson.description}
              onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
              rows={3}
              className="w-full bg-paper border border-line px-4 py-3 rounded-xl"
            />
          </div>
          <div>
            <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">Хугацаа</label>
            <input
              value={newLesson.duration}
              onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
              placeholder="15 мин"
              className="w-full bg-paper border border-line px-4 py-3 rounded-xl"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={newLesson.is_free}
              onChange={(e) => setNewLesson({ ...newLesson, is_free: e.target.checked })}
              className="w-5 h-5 accent-accent"
            />
            <span>Үнэгүй хичээл (бүгдэд харагдана)</span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Нэмэгдэж байна...' : 'Нэмэх'}
          </button>
        </form>
      )}

      {lessons.length === 0 ? (
        <div className="border-2 border-dashed border-line p-20 text-center rounded-2xl">
          <p className="text-muted">Хичээл хараахан алга</p>
        </div>
      ) : (
        <div className="border border-line rounded-2xl divide-y divide-line">
          {lessons.map((l, i) => (
            <div key={l.id} className="p-5 flex items-center gap-4 hover:bg-cream/30 transition-colors">
              <GripVertical className="w-4 h-4 text-muted/50" />
              <div className="display text-2xl text-muted w-10 tabular-nums">{String(i + 1).padStart(2, '0')}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{l.title}</div>
                {l.description && <div className="text-sm text-muted truncate">{l.description}</div>}
                <div className="mono text-xs text-muted mt-1">{l.duration}</div>
              </div>
              <button
                onClick={() => toggleFree(l)}
                className={`text-xs px-3 py-1 rounded-full ${
                  l.is_free
                    ? 'bg-accent text-paper'
                    : 'border border-line text-muted hover:border-ink'
                }`}
              >
                {l.is_free ? 'Үнэгүй' : 'Төлбөртэй'}
              </button>
              <button
                onClick={() => deleteLesson(l.id)}
                className="text-muted hover:text-accent p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
