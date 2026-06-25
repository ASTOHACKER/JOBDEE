# JOBDEE — ข้อมูลบริบทโครงการ (Project Context)

## ภาพรวม (Overview)
JOBDEE คือแอปพลิเคชันกระดานหางาน (Job Board) สไตล์มินิมอล ธีมมืด (Dark-themed) พัฒนาด้วย Next.js 16, Tailwind CSS v4 และ Supabase มีระบบจัดการสิทธิ์ผู้ใช้ตามบทบาท (ผู้สมัครงาน vs. บริษัท) ระบบแก้ไขประวัติส่วนตัว/เรซูเมแบบละเอียด ระบบลงประกาศงาน และระบบยืนยันตัวตนที่ปลอดภัย

---

## เทคโนโลยีหลัก (Tech Stack)
- **เฟรมเวิร์ก:** Next.js 16.2.9 (Turbopack, App Router)
- **การตกแต่งสไตล์:** Tailwind CSS v4
- **ฐานข้อมูลและระบบยืนยันตัวตน:** Supabase (`@supabase/ssr`, PostgreSQL, Google OAuth)
- **ฟอนต์:** Prompt (สำหรับภาษาไทยแสดงผล) & Outfit (สำหรับภาษาอังกฤษตัวเนื้อหา)
- **ธีม:** Dark-first minimal (พื้นหลังดำ, ใช้พาเนลสไตล์กระจกโปร่งแสง Glassmorphism)
- **ขนาดการอัปโหลดไฟล์:** กำหนดค่าขีดจำกัด Request Body ของ Server Actions ไว้ที่ `10mb` (ใน `next.config.ts` เพื่อรองรับการอัปโหลดไฟล์ PDF ขนาดใหญ่)
- **ระบบจัดเก็บไฟล์:** Supabase Storage (ถังเก็บ `resumes` แบบ Public พร้อมตั้งค่า RLS Policies ให้สิทธิ์บัญชีผู้ใช้ที่ผ่านการยืนยันตัวตนเป็นผู้อัปโหลดและแก้ไข)

---

## โครงสร้างโปรเจกต์ (Project Structure)
```text
my-app/
├── app/
│   ├── auth/
│   │   ├── callback/route.ts   # ตัวจัดการสิทธิ์หลังเสร็จสิ้นการล็อกอินด้วย Google OAuth
│   │   └── signout/route.ts    # POST route สำหรับการออกจากระบบ
│   ├── company/
│   │   └── dashboard/page.tsx  # หน้าแดชบอร์ดจัดการและลงประกาศงานของบริษัท
│   ├── dashboard/page.tsx      # ตัวนำทางแดชบอร์ดตามบทบาทผู้ใช้ (Role-based router)
│   ├── jobs/
│   │   └── page.tsx            # หน้ารายการงานที่เปิดรับสมัครสาธารณะ
│   ├── login/page.tsx          # ฟอร์มล็อกอินพร้อมระบบจัดการข้อผิดพลาด
│   ├── profile/
│   │   ├── layout.tsx          # โครงสร้างแบบมีเมนูด้านข้าง (Sidebar) สำหรับจัดการประวัติ
│   │   ├── page.tsx            # หน้าแสดงข้อมูลประวัติส่วนตัวออนไลน์
│   │   ├── edit/page.tsx       # หน้าแก้ไขประวัติส่วนตัวและแนบไฟล์ PDF เรซูเม
│   │   └── settings/page.tsx   # ตั้งค่าบัญชีผู้ใช้ (เปลี่ยนอีเมล, รหัสผ่าน)
│   ├── register/page.tsx       # ฟอร์มสมัครสมาชิกพร้อมปุ่มเลือกสถานะ (ผู้สมัคร / บริษัท)
│   ├── actions.ts              # Server Actions (Auth, อัปเดตประวัติ, จัดการประกาศงาน)
│   ├── globals.css             # คอนฟิก Tailwind v4 และสไตล์พาเนลกระจก .glass-panel
│   └── layout.tsx              # โครงสร้างหลัก (กำหนดฟอนต์และภาษา th)
├── components/
│   ├── Navbar.tsx              # แถบนำทางด้านบนแบบตรวจจับสถานะล็อกอิน
│   ├── ProfileEditForm.tsx     # Client Component จัดการฟอร์มแก้ไขประวัติและระบบการแจ้งเตือน Pop-up
│   └── ThemeToggle.tsx         # ปุ่มสลับธีม สว่าง / มืด / ระบบ
├── utils/
│   └── supabase/
│       ├── client.ts           # ตัวเชื่อมต่อ Supabase บนเบราว์เซอร์ (Client-side)
│       └── server.ts           # ตัวเชื่อมต่อ Supabase บนเซิร์ฟเวอร์ (Server-side พร้อมตั้งค่าคุกกี้)
├── middleware.ts               # มิดเดิลแวร์รีเฟรชเซสชันและป้องกันเส้นทางเข้าใช้โดยไม่ได้รับอนุญาต
└── context.md                  # ไฟล์บริบทโครงการไฟล์นี้
```

---

## โครงสร้างฐานข้อมูล (Database Schema - PostgreSQL)

```sql
-- 1. ตารางข้อมูลประวัติผู้ใช้ (Profiles)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text check (role in ('candidate', 'company')),
  full_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- 2. ตารางงานที่ประกาศ (Jobs)
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.profiles(id),
  title text not null,
  description text,
  salary numeric,
  location text,
  created_at timestamp with time zone default now()
);

-- 3. ตารางการสมัครงาน (Applications)
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade,
  candidate_id uuid references public.profiles(id) on delete cascade,
  status text default 'pending'::text check (status in ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamp with time zone default now(),
  unique(job_id, candidate_id)
);

-- 4. เปิดใช้งานความปลอดภัยระดับแถวข้อมูล (Row Level Security - RLS)
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

-- 5. นโยบาย RLS สำหรับตารางต่างๆ
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Anyone can view jobs" on public.jobs for select using (true);
create policy "Companies can insert jobs" on public.jobs for insert with check (auth.uid() = company_id);
create policy "Companies can update own jobs" on public.jobs for update using (auth.uid() = company_id);
create policy "Companies can delete own jobs" on public.jobs for delete using (auth.uid() = company_id);

-- 6. ฟังก์ชันและ Trigger สำหรับการลงทะเบียนสมาชิก (Syncing auth.users -> profiles)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## ความปลอดภัยในพื้นที่จัดเก็บไฟล์ (Supabase Storage RLS Policies)

ถังเก็บข้อมูล `resumes` ถูกตั้งค่าความปลอดภัยระดับแถว (RLS) เพื่อป้องกันการเข้าถึงและการเขียนไฟล์โดยไม่ได้รับสิทธิ์ โดยมีนโยบายดังนี้:

```sql
-- 1. อนุญาตให้ทุกคนเปิดอ่านไฟล์ในถัง resumes ได้อย่างสาธารณะ (SELECT)
CREATE POLICY "Allow public read access 1gzzvpik" ON storage.objects
    FOR SELECT USING (bucket_id = 'resumes');

-- 2. อนุญาตให้เฉพาะผู้ใช้ที่ลงชื่อเข้าใช้ระบบอัปโหลดไฟล์ใหม่ได้ (INSERT)
CREATE POLICY "Allow authenticated uploads 1gzzvpik" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes');

-- 3. อนุญาตให้ผู้ใช้ที่ลงชื่อเข้าใช้แก้ไขข้อมูลไฟล์ของตนเองได้ (UPDATE)
CREATE POLICY "Allow owners to update 1gzzvpik" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'resumes') WITH CHECK (bucket_id = 'resumes');

-- 4. อนุญาตให้ผู้ใช้ที่ลงชื่อเข้าใช้ลบไฟล์ของตนเองได้ (DELETE)
CREATE POLICY "Allow owners to delete 1gzzvpik" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'resumes');
```

---

## คุณลักษณะเด่นของระบบ (Features Implemented)
1. **การยืนยันตัวตนไร้รอยต่อ (Seamless Auth):** สมัครสมาชิก ลงชื่อเข้าใช้ด้วยบทบาทชัดเจน และรองรับ Google OAuth ลิงก์เชื่อมโยงไปยังโดเมนโปรดักชันโดยตรง
2. **ระบบอัปโหลดเรซูเมเสถียรสูง (High-stability Resume Upload):** รองรับไฟล์ PDF ขนาดใหญ่สูงสุด 10MB จัดเก็บบนคลาวด์ Supabase Storage และเข้าถึงผ่าน Public URL อัตโนมัติ
3. **การออกแบบสไตล์ Glassmorphism มินิมอล:** ออกแบบอินเทอร์เฟซด้วยพาเนลกระจก ปิดกั้นเอฟเฟกต์การโฮเวอร์ที่วุ่นวาย และจัดสรรสไตล์มินิมอลเรียบหรูสอดรับการใช้งานจริง
4. **ตัวแจ้งเตือน Pop-up (Interactive Notification):** แสดงกล่องข้อความเตือนความสำเร็จสีเขียวมรกตและเตือนข้อผิดพลาดสีแดงกุหลาบเมื่อทำการกดบันทึกข้อมูลและอัปโหลดไฟล์เรซูเม
5. **การนำทางที่ชัดเจน (Sidebar Layout):** จัดหน้าตั้งค่าบัญชี หน้าดูโปรไฟล์ และหน้าแก้ไขประวัติแยกสิทธิ์ด้วยเมนูด้านข้างที่ยืดหยุ่นและรองรับ Responsive หน้าจอมือถือ
