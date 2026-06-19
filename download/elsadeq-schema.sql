-- ============================================================
-- ELSADEQ - Gold Prices Schema for Supabase
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- 1) USERS PROFILE
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  preferred_currency text not null default 'EGP',
  preferred_language text not null default 'ar',
  theme text not null default 'dark',
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 2) PRICE CURRENT (cached latest price for each item)
-- ============================================================
create table if not exists public.price_current (
  id uuid primary key default gen_random_uuid(),
  item_key text not null unique,
  item_type text not null,
  karat smallint,
  weight_grams numeric(12,4),
  label_ar text not null,
  label_en text not null,
  buy_price_egp numeric(14,2) not null default 0,
  sell_price_egp numeric(14,2) not null default 0,
  prev_buy_price_egp numeric(14,2) default 0,
  prev_sell_price_egp numeric(14,2) default 0,
  change_pct numeric(8,4) default 0,
  source text not null default 'gold-api',
  last_updated timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ============================================================
-- 3) PRICE HISTORY (audit + charts)
-- ============================================================
create table if not exists public.price_history (
  id bigserial primary key,
  item_key text not null,
  item_type text not null,
  karat smallint,
  weight_grams numeric(12,4),
  buy_price_egp numeric(14,2) not null,
  sell_price_egp numeric(14,2) not null,
  source text,
  recorded_at timestamptz not null default now()
);
create index if not exists idx_price_history_item_key on public.price_history(item_key);
create index if not exists idx_price_history_recorded_at on public.price_history(recorded_at desc);
create index if not exists idx_price_history_item_time on public.price_history(item_key, recorded_at desc);

-- ============================================================
-- 4) API SOURCES
-- ============================================================
create table if not exists public.api_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null,
  base_url text not null,
  priority int not null default 10,
  enabled boolean not null default true,
  api_key text,
  last_success_at timestamptz,
  last_failure_at timestamptz,
  failure_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 5) MANUAL OVERRIDES
-- ============================================================
create table if not exists public.manual_overrides (
  id uuid primary key default gen_random_uuid(),
  item_key text not null,
  buy_price_egp numeric(14,2),
  sell_price_egp numeric(14,2),
  note text,
  active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

-- ============================================================
-- 6) NEWS ARTICLES
-- ============================================================
create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  title_ar text,
  title_en text,
  summary_ar text,
  summary_en text,
  content_ar text,
  content_en text,
  image_url text,
  source_url text,
  source_name text,
  is_published boolean not null default true,
  is_featured boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_news_published on public.news_articles(is_published, published_at desc);

-- ============================================================
-- 7) ANNOUNCEMENTS / BANNERS
-- ============================================================
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title_ar text,
  title_en text,
  body_ar text,
  body_en text,
  cta_ar text,
  cta_en text,
  cta_url text,
  bg_color text default '#D4AF37',
  active boolean not null default true,
  starts_at timestamptz default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 8) USER ALERTS
-- ============================================================
create table if not exists public.user_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_key text not null,
  direction text not null check (direction in ('above','below')),
  threshold numeric(14,2) not null,
  triggered boolean not null default false,
  triggered_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_user_alerts_user on public.user_alerts(user_id);

-- ============================================================
-- 9) USER FAVORITES
-- ============================================================
create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_key)
);

-- ============================================================
-- 10) SITE SETTINGS
-- ============================================================
create table if not exists public.site_settings (
  id int primary key default 1,
  site_name_ar text default 'ELSADEQ',
  site_name_en text default 'ELSADEQ',
  tagline_ar text default 'أسعار الذهب والسبائك لحظة بلحظة',
  tagline_en text default 'Live Gold & Bullion Prices',
  contact_email text default 'alielsadeq4@gmail.com',
  whatsapp text,
  telegram text,
  disclaimer_ar text default 'هذه الأسعار استرشادية للاطلاع فقط وليست لغرض التداول.',
  disclaimer_en text default 'These prices are indicative for reference only and not for trading purposes.',
  maintenance_mode boolean default false,
  updated_at timestamptz not null default now(),
  constraint only_one_row check (id = 1)
);

-- ============================================================
-- 11) AUDIT LOGS
-- ============================================================
create table if not exists public.audit_logs (
  id bigserial primary key,
  actor uuid,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb,
  ip text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 12) UPDATED_AT TRIGGERS
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_api_sources_touch on public.api_sources;
create trigger trg_api_sources_touch before update on public.api_sources
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_news_touch on public.news_articles;
create trigger trg_news_touch before update on public.news_articles
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_settings_touch on public.site_settings;
create trigger trg_settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 13) AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  admin_email text;
  is_admin_user boolean := false;
begin
  select coalesce(nullif(current_setting('app.admin_email', true), ''), '') into admin_email;
  if new.email = admin_email or new.email = 'alielsadeq4@gmail.com' then
    is_admin_user := true;
  end if;

  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, is_admin_user)
  on conflict (id) do nothing;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Make sure existing users get a profile + admin flag if applicable
insert into public.profiles (id, email, is_admin)
select u.id, u.email, (u.email = 'alielsadeq4@gmail.com') as is_admin
from auth.users u
on conflict (id) do update set is_admin = excluded.is_admin;

-- ============================================================
-- 14) ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.price_current enable row level security;
alter table public.price_history enable row level security;
alter table public.api_sources enable row level security;
alter table public.manual_overrides enable row level security;
alter table public.news_articles enable row level security;
alter table public.announcements enable row level security;
alter table public.user_alerts enable row level security;
alter table public.user_favorites enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

-- helper: is current user admin
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- profiles
drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);

-- price_current
drop policy if exists "price_current_read" on public.price_current;
create policy "price_current_read" on public.price_current
  for select using (true);

drop policy if exists "price_current_write_admin" on public.price_current;
create policy "price_current_write_admin" on public.price_current
  for all using (public.is_admin()) with check (public.is_admin());

-- price_history
drop policy if exists "price_history_read" on public.price_history;
create policy "price_history_read" on public.price_history
  for select using (true);

drop policy if exists "price_history_write_admin" on public.price_history;
create policy "price_history_write_admin" on public.price_history
  for insert with check (public.is_admin());

-- api_sources
drop policy if exists "api_sources_admin" on public.api_sources;
create policy "api_sources_admin" on public.api_sources
  for all using (public.is_admin()) with check (public.is_admin());

-- manual_overrides
drop policy if exists "manual_overrides_read" on public.manual_overrides;
create policy "manual_overrides_read" on public.manual_overrides
  for select using (true);

drop policy if exists "manual_overrides_write_admin" on public.manual_overrides;
create policy "manual_overrides_write_admin" on public.manual_overrides
  for all using (public.is_admin()) with check (public.is_admin());

-- news
drop policy if exists "news_read" on public.news_articles;
create policy "news_read" on public.news_articles
  for select using (is_published = true or public.is_admin());

drop policy if exists "news_admin" on public.news_articles;
create policy "news_admin" on public.news_articles
  for all using (public.is_admin()) with check (public.is_admin());

-- announcements
drop policy if exists "ann_read" on public.announcements;
create policy "ann_read" on public.announcements
  for select using (active = true or public.is_admin());

drop policy if exists "ann_admin" on public.announcements;
create policy "ann_admin" on public.announcements
  for all using (public.is_admin()) with check (public.is_admin());

-- user_alerts
drop policy if exists "alerts_owner" on public.user_alerts;
create policy "alerts_owner" on public.user_alerts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user_favorites
drop policy if exists "fav_owner" on public.user_favorites;
create policy "fav_owner" on public.user_favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- site_settings
drop policy if exists "settings_read" on public.site_settings;
create policy "settings_read" on public.site_settings
  for select using (true);

drop policy if exists "settings_admin" on public.site_settings;
create policy "settings_admin" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- audit_logs
drop policy if exists "audit_admin" on public.audit_logs;
create policy "audit_admin" on public.audit_logs
  for select using (public.is_admin());

-- ============================================================
-- 15) SEED DATA
-- ============================================================
insert into public.site_settings (id) values (1) on conflict do nothing;

insert into public.api_sources (name, type, base_url, priority, enabled)
values
  ('gold-api.com', 'gold', 'https://www.gold-api.com/api', 1, true),
  ('open.er-api.com', 'exchange', 'https://open.er-api.com/v6', 1, true),
  ('metals.dev', 'gold', 'https://api.metals.dev/v1', 5, true),
  ('exchangerate.host', 'exchange', 'https://api.exchangerate.host', 5, true)
on conflict (name) do nothing;

insert into public.price_current (item_key, item_type, karat, weight_grams, label_ar, label_en)
values
  ('gold_24k', 'gold', 24, null, 'ذهب عيار 24', 'Gold 24K'),
  ('gold_22k', 'gold', 22, null, 'ذهب عيار 22', 'Gold 22K'),
  ('gold_21k', 'gold', 21, null, 'ذهب عيار 21', 'Gold 21K'),
  ('gold_18k', 'gold', 18, null, 'ذهب عيار 18', 'Gold 18K'),
  ('gold_14k', 'gold', 14, null, 'ذهب عيار 14', 'Gold 14K'),
  ('pound', 'coin', null, 8.0, 'جنيه الذهب', 'Gold Pound'),
  ('half_pound', 'coin', null, 4.0, 'نصف جنيه', 'Half Pound'),
  ('quarter_pound', 'coin', null, 2.0, 'ربع جنيه', 'Quarter Pound'),
  ('bar_1g', 'bar', null, 1.0, 'سبيكة 1 جرام', '1g Bar'),
  ('bar_5g', 'bar', null, 5.0, 'سبيكة 5 جرام', '5g Bar'),
  ('bar_10g', 'bar', null, 10.0, 'سبيكة 10 جرام', '10g Bar'),
  ('bar_20g', 'bar', null, 20.0, 'سبيكة 20 جرام', '20g Bar'),
  ('bar_50g', 'bar', null, 50.0, 'سبيكة 50 جرام', '50g Bar'),
  ('bar_100g', 'bar', null, 100.0, 'سبيكة 100 جرام', '100g Bar'),
  ('bar_250g', 'bar', null, 250.0, 'سبيكة 250 جرام', '250g Bar'),
  ('bar_500g', 'bar', null, 500.0, 'سبيكة 500 جرام', '500g Bar'),
  ('bar_1kg', 'bar', null, 1000.0, 'سبيكة 1 كيلو', '1kg Bar')
on conflict (item_key) do nothing;

insert into public.announcements (title_ar, title_en, body_ar, body_en, cta_ar, cta_en, cta_url, bg_color, active)
values (
  'مرحبًا بكم في ELSADEQ',
  'Welcome to ELSADEQ',
  'أسعار الذهب والسبائك لحظة بلحظة - تحديث تلقائي عند كل زيارة.',
  'Live gold & bullion prices - auto-refresh on every visit.',
  'اعرف أكثر',
  'Learn more',
  '/about',
  '#D4AF37',
  true
) on conflict do nothing;

-- ============================================================
-- DONE
-- ============================================================
