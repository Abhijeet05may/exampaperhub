-- Create storage bucket for question images
insert into storage.buckets (id, name, public)
values ('question_images', 'question_images', true);

-- Policy: Give public access to view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'question_images' );

-- Policy: Allow authenticated users to upload images
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check ( bucket_id = 'question_images' and auth.role() = 'authenticated' );

-- Policy: Allow authenticated users to update their own images
create policy "Authenticated users can update own images"
  on storage.objects for update
  using ( bucket_id = 'question_images' and auth.uid() = owner );

-- Policy: Allow authenticated users to delete their own images
create policy "Authenticated users can delete own images"
  on storage.objects for delete
  using ( bucket_id = 'question_images' and auth.uid() = owner );
