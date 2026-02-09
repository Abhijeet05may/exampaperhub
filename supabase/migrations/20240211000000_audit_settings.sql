-- Audit Logs Table
create table if not exists audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  action text not null, -- e.g., 'CREATE_QUESTION', 'DELETE_USER'
  resource_type text not null, -- e.g., 'question', 'user'
  resource_id text,
  details jsonb, -- Store minimal details about the change
  created_at timestamp with time zone default now()
);

-- System Settings Table
create table if not exists system_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default now(),
  updated_by uuid references auth.users(id)
);

-- RLS for Audit Logs
alter table audit_logs enable row level security;

-- Only Admins can view audit logs
create policy "Admins can view audit logs"
  on audit_logs for select
  using (
    auth.uid() in (select user_id from user_roles where role = 'admin')
  );

-- System can insert logs (via functions or backend), or Admins/Editors if we log from client
-- Ideally, logs should be created via database triggers or secure server actions.
-- For MVP, allow authenticated users to insert logs if they performed the action.
create policy "Authenticated users can insert audit logs"
  on audit_logs for insert
  with check ( auth.uid() = user_id );


-- RLS for System Settings
alter table system_settings enable row level security;

-- Everyone can read settings (e.g., student needs to know 'max_questions_per_paper')
create policy "Everyone can view system settings"
  on system_settings for select
  using ( true );

-- Only Admins can update settings
create policy "Admins can update system settings"
  on system_settings for update
  using (
    auth.uid() in (select user_id from user_roles where role = 'admin')
  );

create policy "Admins can insert system settings"
  on system_settings for insert
  with check (
    auth.uid() in (select user_id from user_roles where role = 'admin')
  );

-- Seed default settings
insert into system_settings (key, value, description)
values 
('site_name', '"ExamPaperHub"', 'The name of the application'),
('maintenance_mode', 'false', 'Put the site in maintenance mode'),
('default_paper_questions', '20', 'Default number of questions in a generated paper')
on conflict (key) do nothing;
