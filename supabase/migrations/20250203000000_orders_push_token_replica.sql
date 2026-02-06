-- push_token für Expo Push; REPLICA IDENTITY FULL damit Webhook old_record bekommt
alter table orders add column if not exists push_token text;
alter table orders replica identity full;
