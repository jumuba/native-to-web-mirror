-- Stripe compatibility fixes for the deployed SmartMemory schema.
-- Safe to run in Supabase SQL Editor.

alter type public.subscription_plan add value if not exists 'basic';

alter table public.subscriptions
  add column if not exists provider text,
  add column if not exists provider_customer_id text,
  add column if not exists provider_subscription_id text,
  add column if not exists current_period_start timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.subscriptions'::regclass
      and contype = 'u'
      and conkey = array[
        (
          select attnum
          from pg_attribute
          where attrelid = 'public.subscriptions'::regclass
            and attname = 'user_id'
        )
      ]::smallint[]
  ) then
    alter table public.subscriptions
      add constraint subscriptions_user_id_unique unique (user_id);
  end if;
end;
$$;

create unique index if not exists subscriptions_provider_subscription_unique
  on public.subscriptions(provider, provider_subscription_id)
  where provider is not null and provider_subscription_id is not null;
