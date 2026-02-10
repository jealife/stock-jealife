-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extended User Profile)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  first_name text,
  last_name text,
  full_name text generated always as (first_name || ' ' || last_name) stored,
  avatar_url text,
  website text,
  bio text,
  location text,
  available_for_hire boolean default false,
  twitter_handle text,
  instagram_handle text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint username_length check (char_length(username) >= 3)
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- 2. PHOTOS (Main Content)
create table public.photos (
  id uuid default uuid_generate_v4() primary key,
  title text,
  description text,
  url_thumbnail text not null, -- Public URL for thumbnail
  url_full text not null,      -- Public URL for full/HD image (or private if premium)
  width int,
  height int,
  location text,
  camera_model text,
  is_premium boolean default false,
  photographer_id uuid references public.profiles(id) not null,
  tags text[],                 -- Array of tags e.g. ['Nature', 'Gabon']
  views_count int default 0,
  downloads_count int default 0,
  likes_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for Photos
alter table public.photos enable row level security;

create policy "Public photos are viewable by everyone."
  on public.photos for select
  using ( true );

create policy "Users can insert their own photos."
  on public.photos for insert
  with check ( auth.uid() = photographer_id );

create policy "Users can update their own photos."
  on public.photos for update
  using ( auth.uid() = photographer_id );

create policy "Users can delete their own photos."
  on public.photos for delete
  using ( auth.uid() = photographer_id );

-- 3. LIKES (User <-> Photo)
create table public.likes (
  user_id uuid references public.profiles(id) on delete cascade not null,
  photo_id uuid references public.photos(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, photo_id)
);

-- RLS for Likes
alter table public.likes enable row level security;

create policy "Public likes are viewable by everyone."
  on public.likes for select
  using ( true );

create policy "Users can insert their own likes."
  on public.likes for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own likes."
  on public.likes for delete
  using ( auth.uid() = user_id );

-- 4. COLLECTIONS (User Collections)
create table public.collections (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  user_id uuid references public.profiles(id) on delete cascade not null,
  is_private boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for Collections
alter table public.collections enable row level security;

create policy "Public collections are viewable by everyone."
  on public.collections for select
  using ( is_private = false );

create policy "Users can view their own private collections."
  on public.collections for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own collections."
  on public.collections for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own collections."
  on public.collections for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own collections."
  on public.collections for delete
  using ( auth.uid() = user_id );

-- 5. COLLECTION_PHOTOS (Photos in Collections)
create table public.collection_photos (
  collection_id uuid references public.collections(id) on delete cascade not null,
  photo_id uuid references public.photos(id) on delete cascade not null,
  added_at timestamptz default now(),
  primary key (collection_id, photo_id)
);

-- RLS for Collection Photos
alter table public.collection_photos enable row level security;

create policy "Public collection photos are viewable by everyone."
  on public.collection_photos for select
  using ( exists ( select 1 from public.collections where id = collection_id and is_private = false ) );

create policy "Users can view their own private collection photos."
  on public.collection_photos for select
  using ( exists ( select 1 from public.collections where id = collection_id and user_id = auth.uid() ) );

create policy "Users can insert photos into their own collections."
  on public.collection_photos for insert
  with check ( exists ( select 1 from public.collections where id = collection_id and user_id = auth.uid() ) );

create policy "Users can delete photos from their own collections."
  on public.collection_photos for delete
  using ( exists ( select 1 from public.collections where id = collection_id and user_id = auth.uid() ) );

-- 6. FUNCTIONS & TRIGGERS

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, first_name, last_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'firstName',
    new.raw_user_meta_data->>'lastName',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute the function on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update likes count on photos
create or replace function public.handle_like()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.photos set likes_count = likes_count + 1 where id = new.photo_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.photos set likes_count = likes_count - 1 where id = old.photo_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_like_change
  after insert or delete on public.likes
  for each row execute procedure public.handle_like();

-- STORAGE BUCKETS SETUP (To be done in Dashboard, but described here)
-- Bucket: 'photos' (Public), 'avatars' (Public)
-- Policy: 'Give public read access to everyone', 'Give insert access to authenticated users', etc.
