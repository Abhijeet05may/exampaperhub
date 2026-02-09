-- Create docx_uploads table
CREATE TABLE IF NOT EXISTS docx_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  status TEXT CHECK (status IN ('processing', 'pending_review', 'approved', 'rejected')) DEFAULT 'processing',
  uploaded_by UUID REFERENCES auth.users(id),
  questions_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS for docx_uploads
ALTER TABLE docx_uploads ENABLE ROW LEVEL SECURITY;

-- Create policies for docx_uploads
CREATE POLICY "Enable read access for authenticated users" ON docx_uploads
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON docx_uploads
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Enable update access for admins" ON docx_uploads
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Add tracking columns to questions table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'status') THEN
        ALTER TABLE questions ADD COLUMN status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'approved';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'upload_id') THEN
        ALTER TABLE questions ADD COLUMN upload_id UUID REFERENCES docx_uploads(id);
    END IF;
END $$;
