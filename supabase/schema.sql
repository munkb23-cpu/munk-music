-- ============================================
-- АЯНГА — Хөгжмийн апп Database Schema
-- ============================================
-- Supabase SQL Editor дээр бүрэн хуулж RUN хий

-- 1. USERS (Supabase auth.users-тэй холбогдоно)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin', 'teacher')),
  created_at timestamptz default now()
);

-- 2. PRODUCTS (ноот, таб, ном)
create table products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist text,
  description text,
  type text not null check (type in ('tab', 'sheet', 'book')),
  instrument text,
  difficulty text check (difficulty in ('Анхан', 'Дунд', 'Ахисан')),
  price integer not null, -- төгрөгөөр
  cover_color text default '#c97b4a',
  cover_image text, -- storage URL
  file_path text not null, -- storage path (private)
  preview_path text, -- жишээ хуудас (public)
  created_at timestamptz default now(),
  published boolean default false
);

-- 3. COURSES (сургалт)
create table courses (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  subtitle text,
  category text not null, -- guitar, bass, ukulele, theory, jazz
  level text check (level in ('Анхан', 'Дунд', 'Ахисан')),
  color text default '#c97b4a',
  icon text,
  duration text,
  price integer default 0,
  order_index integer default 0,
  published boolean default false,
  created_at timestamptz default now()
);

-- 4. LESSONS (хичээл)
create table lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses on delete cascade,
  title text not null,
  description text,
  video_path text, -- storage path
  duration text,
  order_index integer default 0,
  is_free boolean default false, -- анхны хичээл үнэгүй үзэх эсэх
  created_at timestamptz default now()
);

-- 5. ORDERS (захиалга, QPay invoice)
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles on delete set null,
  total_amount integer not null,
  status text default 'pending' check (status in ('pending', 'paid', 'failed', 'expired')),
  qpay_invoice_id text,
  qpay_qr_text text,
  items jsonb, -- захиалсан зүйлс
  created_at timestamptz default now(),
  paid_at timestamptz
);

-- 6. LIBRARY (худалдаж авсан контент)
create table library (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles on delete cascade,
  product_id uuid references products on delete cascade,
  order_id uuid references orders on delete set null,
  acquired_at timestamptz default now(),
  unique(user_id, product_id)
);

-- 7. ENROLLMENTS (сургалтад бүртгэгдсэн)
create table enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles on delete cascade,
  course_id uuid references courses on delete cascade,
  order_id uuid references orders on delete set null,
  enrolled_at timestamptz default now(),
  unique(user_id, course_id)
);

-- 8. PROGRESS (хичээлийн ахиц)
create table progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles on delete cascade,
  lesson_id uuid references lessons on delete cascade,
  completed boolean default false,
  watched_seconds integer default 0,
  updated_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) — аюулгүй байдал
-- ============================================

alter table profiles enable row level security;
alter table products enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table orders enable row level security;
alter table library enable row level security;
alter table enrollments enable row level security;
alter table progress enable row level security;

-- Profiles: хэрэглэгч өөрийнхөө мэдээллийг үзнэ
create policy "Users see own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- Products: бүх хүн published бүтээлийг үзнэ
create policy "Anyone can view published products" on products for select using (published = true);

-- Courses, Lessons: бүх хүн үзнэ (хэсгийг нь)
create policy "Anyone can view published courses" on courses for select using (published = true);
create policy "Anyone can view lessons metadata" on lessons for select using (true);

-- Orders: зөвхөн өөрийнх
create policy "Users see own orders" on orders for select using (auth.uid() = user_id);
create policy "Users create own orders" on orders for insert with check (auth.uid() = user_id);

-- Library: зөвхөн худалдаж авсан хэрэглэгч
create policy "Users see own library" on library for select using (auth.uid() = user_id);

-- Enrollments: зөвхөн өөрийнх
create policy "Users see own enrollments" on enrollments for select using (auth.uid() = user_id);

-- Progress: зөвхөн өөрийнх
create policy "Users manage own progress" on progress for all using (auth.uid() = user_id);

-- ============================================
-- AUTO PROFILE CREATION
-- ============================================
-- Шинэ хэрэглэгч бүртгүүлэхэд profile автомат үүсгэх

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- ЖИШЭЭ ДАТА
-- ============================================

insert into products (title, artist, type, instrument, difficulty, price, cover_color, file_path, published) values
('Blackbird', 'The Beatles (tribute)', 'tab', 'guitar', 'Дунд', 3900, '#2c3e2d', 'samples/blackbird.pdf', true),
('Сонатина No.1', 'М. Клементи', 'sheet', 'piano', 'Анхан', 6900, '#8b6f47', 'samples/clementi.pdf', true),
('Гитарын Үндэс', 'Д. Баяраа', 'book', 'guitar', 'Анхан', 19900, '#d4a574', 'samples/guitar-basics.pdf', true);

insert into courses (slug, title, subtitle, category, level, color, icon, duration, price, published) values
('guitar-beginner', 'Гитар · Анхан шат', 'Эхлэгчдэд зориулсан үндсэн суурь', 'guitar', 'Анхан', '#c97b4a', '🎸', '24 цаг · 8 долоо хоног', 49000, true),
('guitar-intermediate', 'Гитар · Дунд шат', 'Техник, аккорд өргөжүүлэх', 'guitar', 'Дунд', '#8b4a2f', '🎸', '36 цаг · 12 долоо хоног', 79000, true),
('jazz-harmony', 'Жазз гармони', 'ii–V–I, voicing, substitution', 'jazz', 'Ахисан', '#3a2819', '🎷', '50 цаг · 18 долоо хоног', 149000, true);
