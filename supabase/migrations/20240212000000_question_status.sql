-- Create status enum
create type question_status as enum ('draft', 'review', 'approved', 'rejected');

-- Add columns to questions table
alter table questions 
add column if not exists status question_status default 'draft',
add column if not exists reviewer_id uuid references auth.users(id),
add column if not exists reviewer_comment text;

-- Index for faster filtering by status
create index if not exists idx_questions_status on questions(status);

-- Update RLS policies to allow reviewers to see 'review' status questions
-- (Existing policies might be 'true' for select, but good to be explicit if we lock it down later)
-- For now, ensuring row level security doesn't block updates for reviewers
create policy "Reviewers can update questions in review"
  on questions for update
  using (
    auth.uid() in (select user_id from user_roles where role in ('admin', 'reviewer'))
  );
