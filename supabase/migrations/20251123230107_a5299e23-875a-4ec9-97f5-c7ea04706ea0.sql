-- Create friends table for managing friend relationships
create table public.friends (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  friend_id uuid references auth.users(id) on delete cascade not null,
  status text not null check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique (user_id, friend_id)
);

-- Enable RLS
alter table public.friends enable row level security;

-- RLS Policies for friends table
create policy "Users can view their own friend requests"
on public.friends
for select
using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can send friend requests"
on public.friends
for insert
with check (auth.uid() = user_id);

create policy "Users can update friend requests they received"
on public.friends
for update
using (auth.uid() = friend_id);

create policy "Users can delete their own friend connections"
on public.friends
for delete
using (auth.uid() = user_id or auth.uid() = friend_id);

-- Trigger for updated_at
create trigger handle_friends_updated_at
before update on public.friends
for each row
execute function public.handle_updated_at();