-- SmartMemory admin role support.
-- Run this once in Supabase SQL Editor if these columns do not exist yet.

alter table public.users
  add column if not exists role text not null default 'user',
  add column if not exists is_admin boolean not null default false;

update public.users
set role = 'admin',
    is_admin = true
where lower(email) = 'smartmemoryapp@gmail.com';
