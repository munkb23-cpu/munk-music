import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Munk Music — Хөгжмийн хичээл',
  description: 'Гитар, басс, үкүлэлэ, онол, жазз гармоний хичээл. Ноот, таб, ном.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
