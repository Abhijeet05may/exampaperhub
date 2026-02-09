# 🧠 ExamPaperHub

ExamPaperHub is a scalable, role-based examination management and question paper generation platform.

It enables institutions to ingest questions, organize curriculum, review quality, and generate exam-ready papers with full control over templates, scoring rules, and branding.

Built for reliability, collaboration, and automation.

---

## 🚀 Key Capabilities

- 📥 Content ingestion from structured files
- 🧠 Centralized question bank
- 🗂 Curriculum hierarchy (Class → Subject → Chapter → Topic)
- ✍️ Question editing & validation
- 🧾 Configurable paper templates
- 🧮 Flexible marking rules
- 🖼 Diagram & media management
- 👥 Multi-role access control
- 📊 Analytics & operational visibility
- 📜 Complete audit logs

---

## 🏗 System Modules

### Admin Control Plane
Manage the full lifecycle of questions and papers.

### Content Management
Upload → process → review → approve → publish.

### Curriculum Engine
Maintain academic taxonomy powering search and generation.

### Paper Assembly
Generate papers using difficulty, tags, and distribution rules.

### Governance Layer
User permissions, logs, and approvals.

---

## 🧭 Admin Workflow

1. Upload questions  
2. Validate extraction  
3. Edit & enrich  
4. Map curriculum  
5. Approve  
6. Generate papers  
7. Monitor activity  

---

## 🧑‍💻 Tech Stack

- **Frontend:** Next.js / React / Tailwind
- **Backend:** API-driven architecture
- **Database:** Structured relational models
- **Auth:** Role-based access
- **Storage:** Media library for assets
- **Deployment:** Cloud-ready

---

## 📁 Core Routes

### Dashboard
`/admin/dashboard`

### Content
`/admin/content/upload`  
`/admin/content/processing`  
`/admin/content/review`  
`/admin/content/questions`

### Question Editor
`/admin/questions/[id]`

### Curriculum
`/admin/categories`

### Paper Configuration
`/admin/templates`  
`/admin/rules`  
`/admin/branding`

### Resources
`/admin/library`

### Governance
`/admin/users`  
`/admin/analytics`  
`/admin/logs`  
`/admin/settings`

---

## 🔐 Roles Supported

- Super Admin
- Content Manager
- Reviewer
- Operator

Each role has scoped permissions.

---

## 🧪 Current Status

Active development.  
Core modules are being implemented iteratively.

---

## 🛠 Local Setup

```bash
git clone <repo>
cd exampaperhub
npm install
npm run dev
