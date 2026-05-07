'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        router.push('/');
        router.refresh();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      {/* Header */}
      <header className="border-b border-line">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-ink text-paper flex items-center justify-center rounded-full display text-xl italic">M</div>
            <span className="display text-2xl italic">Munk Music</span>
          </Link>
          <Link href="/" className="text-sm link-underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Нүүр
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="mono text-xs uppercase tracking-[0.25em] text-muted mb-3">
              {mode === 'login' ? 'Нэвтрэх' : 'Бүртгэл'}
            </div>
            <h1 className="display text-5xl md:text-6xl">
              {mode === 'login' ? (
                <>Дахин <em className="text-accent">тавтай</em></>
              ) : (
                <>Эхлэхэд <em className="text-accent">бэлэн</em> үү</>
              )}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">
                  Нэр
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-cream border border-line px-4 py-3 rounded-full text-base focus:outline-none focus:border-ink transition"
                  placeholder="Таны нэр"
                />
              </div>
            )}
            <div>
              <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">
                Имэйл
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-cream border border-line px-4 py-3 rounded-full text-base focus:outline-none focus:border-ink transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mono text-xs uppercase tracking-widest text-muted block mb-2">
                Нууц үг
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-cream border border-line px-4 py-3 rounded-full text-base focus:outline-none focus:border-ink transition"
                placeholder="Хамгийн багадаа 6 тэмдэгт"
              />
            </div>

            {error && (
              <div className="text-sm text-accent border border-accent/30 bg-accent/5 px-4 py-3 rounded-2xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper py-3 rounded-full text-base font-medium hover:bg-accent transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? 'Уншиж байна...' : mode === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center mt-8 text-sm text-muted">
            {mode === 'login' ? 'Шинэ хэрэглэгч үү?' : 'Бүртгэлтэй юу?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="text-ink link-underline font-medium"
            >
              {mode === 'login' ? 'Бүртгүүлэх' : 'Нэвтрэх'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
