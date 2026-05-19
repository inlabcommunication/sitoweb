-- ════════════════════════════════════════════════════════════════
-- INLAB COMMUNICATION — SUPABASE SCHEMA
-- Copia tutto questo file e incollalo nel SQL Editor di Supabase
-- (Dashboard → SQL Editor → New Query → Paste → Run)
-- ════════════════════════════════════════════════════════════════

-- ─── 1. CONTENUTI SITO (editor stile Shopify) ───────────────────
-- Un solo record con tutto il JSON dei contenuti.
-- Quando salvi dall'editor, sovrascrive la riga "current".
create table if not exists site_content (
  id text primary key default 'current',
  data jsonb not null,
  updated_at timestamptz default now(),
  updated_by text
);

-- Lettura pubblica (il sito deve poter leggere i contenuti)
alter table site_content enable row level security;
drop policy if exists "public read content" on site_content;
create policy "public read content" on site_content
  for select using (true);

-- Scrittura solo da chi è autenticato come admin
drop policy if exists "admin write content" on site_content;
create policy "admin write content" on site_content
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ─── 2. ANALYTICS — Sessioni e Pageview ─────────────────────────
create table if not exists analytics_events (
  id bigserial primary key,
  session_id text not null,
  event_type text not null, -- 'pageview', 'scroll', 'click', 'session_start', 'session_end'
  path text,
  referrer text,
  user_agent text,
  device text, -- 'mobile', 'tablet', 'desktop'
  country text,
  -- per scroll: % massima raggiunta, sezione corrente
  scroll_depth int,
  section text,
  -- per click: target dell'evento
  target text,
  -- durata in secondi (per session_end)
  duration int,
  created_at timestamptz default now()
);

create index if not exists idx_events_session on analytics_events(session_id);
create index if not exists idx_events_type on analytics_events(event_type);
create index if not exists idx_events_created on analytics_events(created_at desc);
create index if not exists idx_events_path on analytics_events(path);

-- Tutti possono inserire eventi (il sito traccia i visitatori)
alter table analytics_events enable row level security;
drop policy if exists "public insert events" on analytics_events;
create policy "public insert events" on analytics_events
  for insert with check (true);

-- Solo admin può leggere gli analytics
drop policy if exists "admin read events" on analytics_events;
create policy "admin read events" on analytics_events
  for select using (auth.role() = 'authenticated');


-- ─── 3. LEAD / CONTATTI dal chatbot ─────────────────────────────
create table if not exists leads (
  id bigserial primary key,
  email text not null,
  name text,
  phone text,
  conversation jsonb, -- array di {role, content, timestamp}
  intent text, -- es: "preventivo sito web", "social media", "info generica"
  source text default 'chatbot', -- 'chatbot', 'form', 'manual'
  status text default 'new', -- 'new', 'contacted', 'qualified', 'closed'
  notes text,
  session_id text, -- collega ai dati analytics
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_leads_email on leads(email);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_created on leads(created_at desc);

alter table leads enable row level security;

-- Chiunque può creare un lead (chatbot pubblico)
drop policy if exists "public insert leads" on leads;
create policy "public insert leads" on leads
  for insert with check (true);

-- Solo admin legge e gestisce i lead
drop policy if exists "admin manage leads" on leads;
create policy "admin manage leads" on leads
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ─── 4. VISTE AGGREGATE (per dashboard veloce) ──────────────────
-- Vista che pre-calcola le statistiche giornaliere
create or replace view analytics_daily as
select
  date_trunc('day', created_at)::date as day,
  count(distinct session_id) filter (where event_type = 'pageview') as unique_visitors,
  count(*) filter (where event_type = 'pageview') as pageviews,
  count(distinct path) filter (where event_type = 'pageview') as unique_pages,
  avg(duration) filter (where event_type = 'session_end') as avg_session_duration,
  avg(scroll_depth) filter (where event_type = 'scroll') as avg_scroll_depth
from analytics_events
group by date_trunc('day', created_at)::date
order by day desc;

-- Vista pagine più viste
create or replace view analytics_top_pages as
select
  path,
  count(*) as views,
  count(distinct session_id) as unique_visitors
from analytics_events
where event_type = 'pageview' and path is not null
group by path
order by views desc;

-- Vista dispositivi
create or replace view analytics_devices as
select
  device,
  count(distinct session_id) as sessions
from analytics_events
where event_type = 'pageview' and device is not null
group by device;

-- Vista referrer (provenienza)
create or replace view analytics_referrers as
select
  coalesce(nullif(referrer, ''), 'diretto') as source,
  count(distinct session_id) as sessions
from analytics_events
where event_type = 'pageview'
group by source
order by sessions desc;


-- ─── 5. SEED — contenuto iniziale (vuoto, lo carica l'app al primo avvio) ─
-- Lasciamo che sia l'app a inizializzare il record con i contenuti
-- correnti da constants.ts la prima volta che apri /admin.
