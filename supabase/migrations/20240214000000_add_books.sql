-- Create books table
create table if not exists books (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  subject_id uuid references subjects(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Add book_id to chapters (optional, if we want strict hierarchy: Subject -> Book -> Chapter)
-- Currently chapters link to subjects. We can keep that or migrate.
-- For now, let's make Book an optional organizational layer or a strict one.
-- User said: "Add and manage book names".
-- Let's add book_id to chapters and make it nullable for backward compatibility, 
-- or just link chapters to books instead of subjects if we want strict hierarchy.
-- Strict hierarchy is cleaner: Class -> Subject -> Book -> Chapter -> Topic.
-- I'll add book_id to chapters.

alter table chapters add column if not exists book_id uuid references books(id) on delete cascade;

-- If we enforce Book -> Chapter, we should eventually remove subject_id from chapters or keep it for denomalization.
-- For this "Refinement" phase, I'll add book_id and update the UI to use it if selected.

-- RLS
alter table books enable row level security;

create policy "Books are viewable by everyone" on books for select using (true);
create policy "Admins can insert books" on books for insert with check (auth.uid() in (select user_id from user_roles where role = 'admin'));
create policy "Admins can update books" on books for update using (auth.uid() in (select user_id from user_roles where role = 'admin'));
create policy "Admins can delete books" on books for delete using (auth.uid() in (select user_id from user_roles where role = 'admin'));
