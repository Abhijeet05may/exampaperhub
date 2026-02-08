# ExamPaperHub - Implementation Plan

A web platform for MCQ exam paper management with DOCX parsing, question banking, and PDF generation.

## User Review Required

> [!IMPORTANT]
> **Technology Stack Confirmation**
> - **Frontend**: Next.js 14 (App Router) with TypeScript
> - **Styling**: Tailwind CSS (modern, responsive design per requirements)
> - **Backend**: Supabase (Auth, PostgreSQL, Storage, Edge Functions)
> - **PDF Generation**: jsPDF or @react-pdf/renderer in Edge Function
> - **DOCX Parsing**: mammoth.js for server-side DOCX parsing

> [!WARNING]
> **Supabase Setup Required**
> You'll need to create a Supabase project at [supabase.com](https://supabase.com) and provide the project URL and anon key before implementation.

---

## Proposed Changes

### Phase 1: Project Foundation & Authentication

#### [NEW] Project Structure
```
exampaperhub/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Auth routes (login, signup)
│   │   ├── (admin)/            # Admin routes
│   │   ├── (student)/          # Student routes
│   │   ├── api/                # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI components
│   │   ├── admin/              # Admin-specific components
│   │   └── student/            # Student-specific components
│   ├── lib/                    # Utilities and configurations
│   │   ├── supabase/           # Supabase client setup
│   │   └── utils.ts
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript type definitions
├── supabase/
│   ├── migrations/             # Database migrations
│   └── functions/              # Edge Functions
├── public/
└── package.json
```

#### [NEW] [package.json](file:///d:/Antigravity/exampaperhub/package.json)
Initialize with dependencies: Next.js, React, TypeScript, Supabase, Tailwind CSS

#### [NEW] [src/lib/supabase/client.ts](file:///d:/Antigravity/exampaperhub/src/lib/supabase/client.ts)
Browser-side Supabase client initialization

#### [NEW] [src/lib/supabase/server.ts](file:///d:/Antigravity/exampaperhub/src/lib/supabase/server.ts)
Server-side Supabase client for API routes

#### [NEW] [src/app/(auth)/login/page.tsx](file:///d:/Antigravity/exampaperhub/src/app/(auth)/login/page.tsx)
Email/password login form with Supabase Auth

#### [NEW] [src/app/(auth)/signup/page.tsx](file:///d:/Antigravity/exampaperhub/src/app/(auth)/signup/page.tsx)
Signup form with role selection (default: student)

---

### Phase 2: Database Schema

#### [NEW] [supabase/migrations/001_initial_schema.sql](file:///d:/Antigravity/exampaperhub/supabase/migrations/001_initial_schema.sql)

```sql
-- User roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'student')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Hierarchical categories
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
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
CREATE TABLE saved_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  question_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_papers ENABLE ROW LEVEL SECURITY;
```

---

### Phase 3: Admin Category & Question Management

#### [NEW] [src/app/(admin)/admin/categories/page.tsx](file:///d:/Antigravity/exampaperhub/src/app/(admin)/admin/categories/page.tsx)
CRUD interface for classes, subjects, chapters, topics with cascading dropdowns

#### [NEW] [src/app/(admin)/admin/questions/page.tsx](file:///d:/Antigravity/exampaperhub/src/app/(admin)/admin/questions/page.tsx)
Table view of all questions with edit/delete actions

#### [NEW] [src/components/admin/QuestionForm.tsx](file:///d:/Antigravity/exampaperhub/src/components/admin/QuestionForm.tsx)
Form for creating/editing questions with image upload

---

### Phase 4: DOCX Upload & Parsing

#### [NEW] [src/app/(admin)/admin/upload/page.tsx](file:///d:/Antigravity/exampaperhub/src/app/(admin)/admin/upload/page.tsx)
DOCX file upload interface with drag-and-drop

#### [NEW] [supabase/functions/parse-docx/index.ts](file:///d:/Antigravity/exampaperhub/supabase/functions/parse-docx/index.ts)
Edge Function using mammoth.js to:
- Parse DOCX file structure
- Extract questions, options, answers, explanations
- Extract and upload images to Storage
- Return structured question data for review

#### [NEW] [src/components/admin/QuestionReview.tsx](file:///d:/Antigravity/exampaperhub/src/components/admin/QuestionReview.tsx)
Review parsed questions before saving to database

---

### Phase 5: Student Browse & Filter

#### [NEW] [src/app/(student)/browse/page.tsx](file:///d:/Antigravity/exampaperhub/src/app/(student)/browse/page.tsx)
Question browser with filter sidebar (class, subject, chapter, topic)

#### [NEW] [src/components/student/QuestionCard.tsx](file:///d:/Antigravity/exampaperhub/src/components/student/QuestionCard.tsx)
Card component showing question preview with add-to-bucket button

#### [NEW] [src/components/student/FilterSidebar.tsx](file:///d:/Antigravity/exampaperhub/src/components/student/FilterSidebar.tsx)
Cascading filter dropdowns with search

---

### Phase 6: Paper Builder

#### [NEW] [src/hooks/usePaperBucket.ts](file:///d:/Antigravity/exampaperhub/src/hooks/usePaperBucket.ts)
Zustand store for managing paper bucket state

#### [NEW] [src/components/student/PaperBucket.tsx](file:///d:/Antigravity/exampaperhub/src/components/student/PaperBucket.tsx)
Sidebar panel showing selected questions with:
- Question count and list
- Drag-and-drop reordering
- Remove individual questions
- Save paper configuration

#### [NEW] [src/app/(student)/paper/page.tsx](file:///d:/Antigravity/exampaperhub/src/app/(student)/paper/page.tsx)
Full paper review page before PDF generation

---

### Phase 7: PDF Generation

#### [NEW] [supabase/functions/generate-pdf/index.ts](file:///d:/Antigravity/exampaperhub/supabase/functions/generate-pdf/index.ts)
Edge Function to generate:
- **Question Paper**: Questions only with proper numbering
- **Answer Key**: With correct answers and explanations
- Professional formatting with image placement

---

### Phase 8: Admin Dashboard

#### [NEW] [src/app/(admin)/admin/page.tsx](file:///d:/Antigravity/exampaperhub/src/app/(admin)/admin/page.tsx)
Dashboard with:
- Total questions stat
- Questions per category breakdown
- Recent uploads list
- Paper generation activity

---

## Verification Plan

### Automated Tests

Since this is a new project, I'll set up:

1. **Jest + React Testing Library** for component tests
2. **Playwright** for E2E browser tests

```bash
# Run unit tests
npm test

# Run E2E tests
npx playwright test
```

### Manual Verification

After each phase, I'll use the browser tool to:

1. **Phase 1**: Navigate to login/signup → Create account → Verify role assignment → Test protected routes
2. **Phase 2**: Login as admin → Add class → Add subject → Verify cascading works
3. **Phase 3**: Add questions manually → Verify they appear in list → Edit/delete test
4. **Phase 4**: Upload sample DOCX → Verify parsing → Confirm saving
5. **Phase 5**: Login as student → Browse questions → Test filters
6. **Phase 6**: Add questions to bucket → Reorder → Save paper
7. **Phase 7**: Generate PDFs → Verify download works → Check formatting
8. **Phase 8**: View dashboard stats → Verify accuracy

### User Verification Needed

- **Supabase Credentials**: You need to provide project URL and anon key
- **Sample DOCX**: To test the parsing functionality, please provide a sample DOCX file with your question format
- **Design Review**: I'll share screenshots at key milestones for UI approval
