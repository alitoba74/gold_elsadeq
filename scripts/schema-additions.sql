-- ============================================================
-- ELSADEQ - Schema Additions (Phase 2)
-- Run this AFTER schema.sql to add contact_messages table
-- and improve news with RSS support
-- ============================================================

-- 1) Contact messages (instead of using audit_logs)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  is_replied boolean not null default false,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists idx_contact_unread on public.contact_messages(is_read, created_at desc);

alter table public.contact_messages enable row level security;

-- Public can insert (no auth needed for the contact form)
drop policy if exists "contact_insert_public" on public.contact_messages;
create policy "contact_insert_public" on public.contact_messages
  for insert with check (true);

-- Only admin can read/delete
drop policy if exists "contact_admin" on public.contact_messages;
create policy "contact_admin" on public.contact_messages
  for select using (public.is_admin());

drop policy if exists "contact_admin_update" on public.contact_messages;
create policy "contact_admin_update" on public.contact_messages
  for update using (public.is_admin());

drop policy if exists "contact_admin_delete" on public.contact_messages;
create policy "contact_admin_delete" on public.contact_messages
  for delete using (public.is_admin());

-- 2) Add RSS source URL to news_articles (for tracking where the article came from)
alter table public.news_articles
  add column if not exists rss_feed_url text,
  add column if not exists rss_feed_name text,
  add column if not exists content_html text;

-- Index for deduplication (one article per source_url)
create index if not exists idx_news_source_url on public.news_articles(source_url) where source_url is not null;

-- 3) RSS feed config table (so admin can manage RSS sources from UI)
create table if not exists public.rss_feeds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null unique,
  language text not null default 'ar',
  is_active boolean not null default true,
  last_fetched_at timestamptz,
  last_status text,
  created_at timestamptz not null default now()
);

alter table public.rss_feeds enable row level security;
drop policy if exists "rss_feeds_read" on public.rss_feeds;
create policy "rss_feeds_read" on public.rss_feeds
  for select using (true);
drop policy if exists "rss_feeds_admin" on public.rss_feeds;
create policy "rss_feeds_admin" on public.rss_feeds
  for all using (public.is_admin()) with check (public.is_admin());

-- Seed default RSS feeds (gold-related Arabic + English)
insert into public.rss_feeds (name, url, language, is_active)
values
  ('Investing Gold AR', 'https://www.investing.com/rss/news_25.rss', 'ar', true),
  ('Reuters Commodities', 'https://www.reutersagency.com/feed/?best-topics=commodities&post_type=gold', 'en', true),
  ('Kitco News', 'https://www.kitco.com/rss/gold.xml', 'en', true)
on conflict (url) do nothing;

-- DONE
