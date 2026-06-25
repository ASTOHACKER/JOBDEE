# JOBDEE — Project Context

## Overview
JOBDEE is a minimalist, dark-themed job board application built with Next.js 16, Tailwind CSS v4, and Supabase. It features role-based access (candidate vs. company), a comprehensive profile/resume editor, job posting capabilities, and secure authentication.

---

## Tech Stack
- **Framework:** Next.js 16.2.9 (Turbopack, App Router)
- **Styling:** Tailwind CSS v4
- **Database & Auth:** Supabase (`@supabase/ssr`, PostgreSQL, Google OAuth)
- **Fonts:** Prompt (Thai display) & Outfit (Latin body)
- **Theme:** Dark-first minimal (Black background, custom glassmorphic panels)

---

## Project Structure
```text
my-app/
├── app/
│   ├── auth/
│   │   ├── callback/route.ts   # Google OAuth callback handler
│   │   └── signout/route.ts    # POST route to sign out
│   ├── company/
│   │   └── dashboard/page.tsx  # Company job posting & management
│   ├── dashboard/page.tsx      # Role-based dashboard router
│   ├── jobs/
│   │   └── page.tsx            # Public job listing board
│   ├── login/page.tsx          # Login form with error handling
│   ├── profile/
│   │   ├── layout.tsx          # Sidebar layout for profile section
│   │   ├── page.tsx            # View profile data
│   │   ├── edit/page.tsx       # Comprehensive 5-section resume form
│   │   └── settings/page.tsx   # Account settings (email, password)
│   ├── register/page.tsx       # Signup form with role selection
│   ├── actions.ts              # Server Actions (Auth, Profile, Jobs)
│   ├── globals.css             # Tailwind v4 configuration & glass-panel style
│   └── layout.tsx              # Root Layout (fonts, lang="th")
├── components/
│   └── Navbar.tsx              # Auth-aware navigation bar
├── utils/
│   └── supabase/
│       ├── client.ts           # Browser Supabase client
│       └── server.ts           # Server-side Supabase client with cookie settings
├── middleware.ts               # Auth session refresh & routing protection
└── context.md                  # This file
```

---

## Database Schema (PostgreSQL)

```sql
-- Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text check (role in ('candidate', 'company')),
  full_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- Jobs Table
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.profiles(id),
  title text not null,
  description text,
  salary numeric,
  location text,
  created_at timestamp with time zone default now()
);

-- Row Level Security (RLS) Policies
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Anyone can view jobs" on public.jobs for select using (true);
create policy "Companies can insert jobs" on public.jobs for insert with check (auth.uid() = company_id);

-- User Sync Trigger (Triggered when auth.users is populated on signup)
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

## Features Implemented
1. **Auth Flow:** Complete login, logout, and registration with role mapping (`candidate`/`company`). Integrated Google OAuth option.
2. **Dashboard Routing:** Auto-detects user role and serves correct panels or redirects.
3. **Glassmorphism Theme:** Applied custom `.glass-panel` utilities with elegant border blurs to resist standard "AI UI" look.
4. **Interactive Profile Form:** Massive single-submit form updating everything from desired salary, education history, to skills and portfolio links directly into a robust `jsonb` object.
5. **Job Board:** Live database pulling for all postings, with company dashboard enabling creation of new job entries.
