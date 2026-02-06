-- Run this in Supabase Dashboard → SQL Editor to create the orders table.

create table orders (
  id uuid primary key default gen_random_uuid(),
  items jsonb not null,
  total numeric not null,
  status text not null default 'new',
  created_at timestamp with time zone default now()
);
