# Munk Music — Хөгжмийн апп

Next.js + Supabase + QPay дээр бүтээсэн хөгжмийн хичээл, ноот, таб зардаг платформ.

---

## 📋 Бүрэн эхлэх заавар (0-гоос deploy хүртэл)

### 1. Шаардагдах хэрэгслүүд

Дараах зүйлсийг суулгасан байх ёстой:
- **Node.js 18+** → https://nodejs.org
- **Git** → https://git-scm.com
- **GitHub account** → https://github.com
- **Code editor** — VS Code санал болгоё → https://code.visualstudio.com

### 2. Бүртгэл үүсгэх (бүгд үнэгүй эхлэх боломжтой)

Эдгээр үйлчилгээнд бүртгүүл:
- **Supabase** (database + auth + storage) → https://supabase.com
- **Vercel** (hosting) → https://vercel.com
- **Cloudflare** (домэйн, CDN) → https://cloudflare.com
- **QPay Merchant** (төлбөр) → https://merchant.qpay.mn

---

## 🚀 Алхам 1: Төслийг суулгах

Терминал нээж:

```bash
# Төслийн фолдерт ор
cd munk-music

# Хамаарал суулгах
npm install

# Орчны хувьсагч бэлдэх
cp .env.example .env.local
```

---

## 🗄 Алхам 2: Supabase тохируулах

### 2.1 Шинэ төсөл үүсгэх
1. https://supabase.com/dashboard орж "New Project"
2. Нэр: `munk-music`
3. Database password — **хадгал**
4. Region — `Southeast Asia (Singapore)` (Монголд хамгийн ойр)
5. "Create" дар

### 2.2 API түлхүүр авах
`Settings → API` хэсгээс:
- `Project URL` хуул
- `anon public` түлхүүр хуул
- `service_role` түлхүүр хуул (нууц!)

`.env.local` файлд:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...
```

### 2.3 Database schema суулгах
1. Supabase dashboard → `SQL Editor`
2. `supabase/schema.sql` файлын агуулгыг хуулж, paste хийж RUN
3. Энэ нь users, products, orders, library, courses хүснэгтүүдийг үүсгэнэ

### 2.4 Storage үүсгэх
`Storage → New bucket`:
- `covers` — public (бүтээлийн хавтас зураг)
- `sheets` — **private** (ноот/таб PDF)
- `videos` — **private** (видео хичээл)

---

## 💳 Алхам 3: QPay тохируулах

### 3.1 Merchant бүртгэл
1. https://merchant.qpay.mn → бүртгүүл
2. ААН-ын бүртгэлийн дугаар, банкны данс оруулах
3. Баталгаажуулалт 1-3 өдөр

### 3.2 Credentials авах
Баталгаажсаны дараа:
- `username`
- `password`
- `invoice_code`

`.env.local`:
```
QPAY_USERNAME=MUNKMUSIC
QPAY_PASSWORD=xxx
QPAY_INVOICE_CODE=MUNKMUSIC_INVOICE
QPAY_BASE_URL=https://merchant.qpay.mn/v2
```

---

## 🧪 Алхам 4: Локал орчинд туршах

```bash
npm run dev
```

Хөтчөөр `http://localhost:3000` нээ.

---

## 🌍 Алхам 5: Vercel руу deploy хийх

### 5.1 GitHub-д түлх
```bash
git init
git add .
git commit -m "Initial commit"
# GitHub дээр шинэ repo үүсгэ, дараа нь:
git remote add origin https://github.com/USERNAME/munk-music.git
git push -u origin main
```

### 5.2 Vercel-д холбох
1. https://vercel.com/new
2. GitHub repo сонго
3. Environment Variables хэсэгт `.env.local`-ын бүх хувьсагчаа оруул
4. "Deploy" дар

5-10 минутын дараа live URL гарна: `munk-music.vercel.app`

### 5.3 Өөрийн домэйн залгах
1. Домэйн худалдаж ав (.mn — https://domain.mn, ~40,000₮/жил)
2. Vercel → Project → Settings → Domains → `munkmusic.mn` нэмнэ
3. DNS тохиргоог Vercel-ийн заавраар хийнэ

---

## 📦 Алхам 6: Контент оруулах

### 6.1 Admin хэрэглэгч болгох
Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'chiniimeil@example.com';
```

### 6.2 Бүтээгдэхүүн нэмэх
`/admin` хуудсаар орж:
- Шинэ ноот/таб/ном
- Видео хичээл
- Сургалт үүсгэх

---

## ⚠️ Чухал анхаарах зүйлс

### Зохиогчийн эрх
- Өөрийн бүтээл эсвэл лицензтэй контент л ашигла
- Олон нийтийн өмч (public domain — Бах, Моцарт) асуудалгүй
- Орчин үеийн дууг зарахдаа МЗЭХ-той холбогд: https://mca.mn

### Хуулийн бүтэц
- ХХК бүртгүүл (Татварын ерөнхий газар)
- QPay merchant бүртгэхэд ААН-ын гэрчилгээ хэрэгтэй
- Нөхцөл, нууцлалын бодлого (Terms, Privacy Policy) бичих

### Аюулгүй байдал
- `service_role` түлхүүр хэзээ ч frontend код руу бүү тавь
- PDF, видеог **signed URL** ашиглан дамжуул
- Хэрэглэгчийн нууц үгийг Supabase өөрөө hash-лана

---

## 🛠 Гарах алдааг шийдэх

### "Supabase connection failed"
- `.env.local` файл байгаа эсэхийг шалга
- Хувьсагчийн нэр зөв бичигдсэн үү
- Dev server дахин эхлүүл (`npm run dev`)

### "QPay invoice failed"
- Merchant бүртгэл баталгаажсан уу?
- Username/password зөв үү?
- Invoice code тохирч байна уу?

---

## 📞 Дэмжлэг

Асуудал тулгарвал:
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- QPay: https://developer.qpay.mn
