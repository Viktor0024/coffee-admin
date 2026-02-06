-- updated_at для сортировки: при смене статуса заказ поднимается вверх колонки
alter table orders add column if not exists updated_at timestamptz default now();

create or replace function orders_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_updated_at_trigger on orders;
create trigger orders_updated_at_trigger
  before update on orders
  for each row
  execute function orders_set_updated_at();

-- заполнить updated_at у существующих строк
update orders set updated_at = created_at where updated_at is null;
