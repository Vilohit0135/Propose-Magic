-- 0003_orders_missing_columns.sql
-- Backfills columns the application code (lib/order.ts, lib/db.ts) has
-- always expected but that 0001_init.sql never created. Without this,
-- every insert through createOrder() crashes with "Could not find the
-- 'from_phone' column of 'orders' in the schema cache".
--
-- Idempotent — safe to re-run.

-- Sender pronoun for AI message generation. Defaults to 'they' so older
-- rows (and any insert that omits it) get a sane neutral value.
alter table orders add column if not exists from_gender varchar(10) not null default 'they';

-- Sender's WhatsApp number for the "they said yes" notification. Optional.
alter table orders add column if not exists from_phone varchar(20);

-- YouTube video id (11 chars) used as the background song on the
-- receiver page. Nullable — most orders won't have one.
alter table orders add column if not exists music_video_id varchar(20);
alter table orders add column if not exists music_start_seconds integer;

-- Receiver-link TTL. We need expires_at NOT NULL because the cron sweep
-- and is-expired check both call Date.parse() on it. Backfill existing
-- rows from created_at so they age out on the same 48h schedule new
-- rows do.
alter table orders add column if not exists expires_at timestamp;
update orders set expires_at = created_at + interval '48 hours' where expires_at is null;
alter table orders alter column expires_at set not null;
alter table orders alter column expires_at set default (now() + interval '48 hours');

-- When the cron sweep / receiver visit wiped the row's PII.
alter table orders add column if not exists expired_at timestamp;
