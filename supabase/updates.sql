-- Function to increment photo views
create or replace function public.increment_photo_views(photo_id uuid)
returns void as $$
begin
  update public.photos
  set views_count = views_count + 1
  where id = photo_id;
end;
$$ language plpgsql security definer;

-- Function to increment photo downloads
create or replace function public.increment_photo_downloads(photo_id uuid)
returns void as $$
begin
  update public.photos
  set downloads_count = downloads_count + 1
  where id = photo_id;
end;
$$ language plpgsql security definer;

-- Function to toggle photo likes
create or replace function public.toggle_photo_like(p_photo_id uuid, p_user_id uuid)
returns boolean as $$
declare
  is_liked boolean;
begin
  select exists (
    select 1 from public.likes
    where photo_id = p_photo_id and user_id = p_user_id
  ) into is_liked;

  if is_liked then
    delete from public.likes
    where photo_id = p_photo_id and user_id = p_user_id;
    
    update public.photos
    set likes_count = likes_count - 1
    where id = p_photo_id;
    
    return false;
  else
    insert into public.likes (photo_id, user_id)
    values (p_photo_id, p_user_id);
    
    update public.photos
    set likes_count = likes_count + 1
    where id = p_photo_id;
    
    return true;
  end if;
end;
$$ language plpgsql security definer;
