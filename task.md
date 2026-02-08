# ExamPaperHub - Task Breakdown

## Phase 1: Foundation & Auth
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Supabase project and environment variables
- [ ] Configure Supabase client
- [ ] Implement authentication (login, signup, logout)
- [ ] Create `user_roles` table and role management
- [ ] Build protected routes with role-based access

## Phase 2: Database & Categories
- [ ] Create database schema: `classes`, `subjects`, `chapters`, `topics`
- [ ] Build Admin Category Management UI (CRUD)
- [ ] Implement cascading category selectors

## Phase 3: Question Bank
- [ ] Create `questions` table with all required fields
- [ ] Set up Supabase Storage bucket for images
- [ ] Build Admin Question Management UI (view, edit, delete)

## Phase 4: DOCX Upload & Parsing
- [ ] Create DOCX upload UI for Admin
- [ ] Develop Supabase Edge Function for DOCX parsing
- [ ] Build question review/confirmation screen
- [ ] Handle image extraction and storage

## Phase 5: Browse & Filter (Student View)
- [ ] Build student question browser with filters
- [ ] Implement search functionality
- [ ] Create question preview cards

## Phase 6: Paper Builder (Bucket System)
- [ ] Implement paper bucket state management
- [ ] Build bucket sidebar/panel UI
- [ ] Add reorder, remove, and review functionality
- [ ] Implement saved paper configurations

## Phase 7: PDF Generation
- [ ] Create Supabase Edge Function for PDF generation
- [ ] Generate Question Paper PDF
- [ ] Generate Answer Key PDF
- [ ] Implement download functionality

## Phase 8: Admin Dashboard
- [ ] Build dashboard with stats overview
- [ ] Display questions per category analytics
- [ ] Show recent uploads and activity
