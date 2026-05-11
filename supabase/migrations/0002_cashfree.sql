-- ProposeMagic Cashfree payment integration (PRD §5 superseded).
-- Adds:
--   1. Persistent end-user identity on orders (user_uuid from browser localStorage)
--   2. Append-only transaction event log (one row per lifecycle event)
--   3. Cashfree-shaped columns on orders (replacing the unused Razorpay placeholders)
--
-- Idempotent: safe to re-run.

-- 1. End-user identity (one user_uuid -> many orders)
alter table orders add column if not exists user_uuid varchar(64);
create index if not exists idx_orders_user_uuid on orders(user_uuid);

-- 2. Swap Razorpay placeholder columns for Cashfree ones
alter table orders drop column if exists razorpay_order_id;
alter table orders drop column if exists razorpay_payment_id;
alter table orders add column if not exists cashfree_order_id   varchar(100);
alter table orders add column if not exists cashfree_payment_id varchar(100);
create index if not exists idx_orders_cashfree_order_id on orders(cashfree_order_id);

-- 3. Append-only transaction event log
create table if not exists transactions (
  id              uuid primary key default gen_random_uuid(),
  user_uuid       varchar(64) not null,
  order_id        uuid references orders(id) on delete set null,
  cf_order_id     varchar(100) not null,
  cf_payment_id   varchar(100),
  event           varchar(20) not null,           -- 'initiated' | 'success' | 'failed'
  amount          integer not null,               -- paise
  currency        varchar(8) not null default 'INR',
  payload         jsonb,                          -- raw CF response/webhook for debugging
  created_at      timestamp default now()
);
create index if not exists idx_tx_user_uuid    on transactions(user_uuid);
create index if not exists idx_tx_cf_order_id  on transactions(cf_order_id);
create index if not exists idx_tx_event        on transactions(event);
create index if not exists idx_tx_order_id     on transactions(order_id);

-- 4. Idempotency guard: a single Cashfree order can have many 'initiated'
-- rows (retries, refreshes), but only one terminal event. The partial unique
-- index lets webhook + verify-route both insert with ON CONFLICT DO NOTHING
-- and rely on the DB to dedupe.
create unique index if not exists uq_tx_terminal
  on transactions(cf_order_id, event)
  where event in ('success', 'failed');
