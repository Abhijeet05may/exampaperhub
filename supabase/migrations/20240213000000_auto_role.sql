-- Function to handle new user setup (Profile + Role)
create or replace function public.handle_new_user_setup()
returns trigger as $$
begin
  -- 1. Create Profile
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  -- 2. Assign Default Role (Student)
  insert into public.user_roles (user_id, role)
  values (new.id, 'student');

  return new;
end;
$$ language plpgsql security definer;

-- Drop the old trigger if it exists (from profiles migration) to avoid double execution
drop trigger if exists on_auth_user_created on auth.users;

-- Re-create trigger with the new function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user_setup();

-- Security hardening: Remove ability for users to insert their own roles manually via API
drop policy if exists "Users can insert their own role." on user_roles;
