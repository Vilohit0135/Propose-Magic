-- ProposeMagic initial schema (PRD §4).
-- Apply with: supabase db push  (or via Supabase SQL editor).

create extension if not exists "pgcrypto";

create table if not exists orders (
  -- Core
  id                uuid primary key default gen_random_uuid(),
  short_id          varchar(12) unique not null,
  from_name         varchar(100) not null,
  to_name           varchar(100) not null,
  story             text,
  email             varchar(200) not null,
  created_at        timestamp default now(),
  completed_at      timestamp,
  status            varchar(20) default 'PENDING',
    -- PENDING | PAID | GENERATING | COMPLETED | FAILED

  -- Flow & Occasion
  flow              varchar(30) not null,
    -- propose | birthday | valentines | anniversary
  sub_flow          varchar(50) not null,

  -- Anonymous Mechanic
  is_anonymous      boolean default false,
  reveal_style      varchar(20),
  reveal_difficulty varchar(10),
  reveal_content    jsonb,
  reveal_attempts   integer default 0,
  reveal_solved     boolean default false,
  reveal_solved_at  timestamp,

  -- Package
  package_type      varchar(20) not null default 'basic',

  -- Message
  tone              varchar(30) not null,
  generated_message text,

  -- Visual
  template          varchar(30) not null default 'rose_dark',

  -- Media
  photo_urls          text[],
  photo_captions      text[],
  photo_layout        varchar(20),
  scratch_photo_index integer,
  video_url           text,
  video_clip_urls     text[],
  video_timestamps    jsonb,
  video_treatment     varchar(30),

  -- Payment
  razorpay_order_id   varchar(100),
  razorpay_payment_id varchar(100),
  amount_paid         integer,

  -- Hosting
  s3_url          text,
  cloudfront_url  text,

  -- Gamification
  love_taps         integer default 0,
  reactions         text[],
  quiz_score        integer,
  yes_time_seconds  integer,

  -- Yes moment
  yes_clicked     boolean default false,
  yes_clicked_at  timestamp,

  -- Viral Loop
  referral_short_id varchar(12),
  ref_source        varchar(30)
);

create unique index if not exists idx_orders_short_id on orders(short_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_orders_referral on orders(referral_short_id);
create index if not exists idx_orders_flow_subflow on orders(flow, sub_flow);

create table if not exists reveal_attempts (
  id uuid primary key default gen_random_uuid(),
  short_id varchar(12) references orders(short_id) on delete cascade,
  attempt_num integer,
  correct boolean,
  attempted_at timestamp default now()
);
