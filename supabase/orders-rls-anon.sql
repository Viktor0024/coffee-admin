-- Run in Supabase Dashboard → SQL Editor after creating the orders table.
-- Allows the app (anon key) to insert orders and read them for the Orders screen.

alter table public.orders enable row level security;

create policy "Allow anon to insert orders"
  on public.orders
  for insert
  to anon
  with check (true);

create policy "Allow anon to select orders"
  on public.orders
  for select
  to anon
  using (true);
