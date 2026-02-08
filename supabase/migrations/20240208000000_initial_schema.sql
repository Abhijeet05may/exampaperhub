
-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'student')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Hierarchical categories
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  explanation TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  image_url TEXT,
  class_id UUID REFERENCES classes(id),
  subject_id UUID REFERENCES subjects(id),
  chapter_id UUID REFERENCES chapters(id),
  topic_id UUID REFERENCES topics(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved papers
CREATE TABLE IF NOT EXISTS saved_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  question_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security policies

-- User Roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON user_roles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own role." ON user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Note: In a real app, you likely want to restrict role creation/updates to admins or system triggers.
-- For MVP/demo, allowing insertion on signup is acceptable but risky.

-- Categories (Classes, Subjects, Chapters, Topics)
-- Everyone can view, only Admins can edit
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Classes are viewable by everyone." ON classes FOR SELECT USING (true);
CREATE POLICY "Admins can insert classes." ON classes FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);
CREATE POLICY "Admins can update classes." ON classes FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);
CREATE POLICY "Admins can delete classes." ON classes FOR DELETE USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subjects are viewable by everyone." ON subjects FOR SELECT USING (true);
CREATE POLICY "Admins can insert subjects." ON subjects FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);
-- (Add Update/Delete policies similarly for subjects if needed)

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chapters are viewable by everyone." ON chapters FOR SELECT USING (true);
CREATE POLICY "Admins can insert chapters." ON chapters FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Topics are viewable by everyone." ON topics FOR SELECT USING (true);
CREATE POLICY "Admins can insert topics." ON topics FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

-- Questions
-- Everyone can view, Only Admins can edit
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are viewable by everyone." ON questions FOR SELECT USING (true);
CREATE POLICY "Admins can insert questions." ON questions FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);
CREATE POLICY "Admins can update questions." ON questions FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);
CREATE POLICY "Admins can delete questions." ON questions FOR DELETE USING (
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);

-- Saved Papers
-- Users can manage their own papers
ALTER TABLE saved_papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own papers." ON saved_papers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own papers." ON saved_papers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own papers." ON saved_papers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own papers." ON saved_papers FOR DELETE USING (auth.uid() = user_id);
