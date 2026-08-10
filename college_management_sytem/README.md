# CampusPulse AI - Smart Campus Management Platform 🎓

> **DevFusion 4.O Hackathon Solution** • **Problem Statement 1: Smart Campus Management Platform**

CampusPulse AI is a modern, production-ready full-stack SaaS platform connecting **Students**, **Faculty**, **Coordinators**, and **Administrators** into a unified digital ecosystem.

---

## 👥 Team & Work Division

Designed and implemented for **2 Collaborators**:
- **Developer 1 (Backend Lead)**: REST API routes (`src/app/api/`), Auth logic, JWT/Session cookies, Database models & repositories (`src/lib/db.ts`), Role middleware, Security, OpenAPI documentation (`API_DOCUMENTATION.md`), Docker containerization.
- **Developer 2 (Frontend Lead)**: React/Next.js Client pages, Tailwind CSS UI components (`src/components/`), Dashboards for 4 roles, Recharts visual analytics, QR code session generator & scanner UI, Global Search modal, AI Chatbot widget, Dark/Light mode theme engine.

---

## 🌟 Key Features

1. **Authentication & Role Access**:
   - Google OAuth & Email/Password Sign Up / Login.
   - Email verification modal with OTP generator.
   - 4-Tier Permission RBAC (`STUDENT`, `FACULTY`, `COORDINATOR`, `ADMIN`).
   - Quick "Judge 1-Click Role Switcher" bar for instant evaluator testing.

2. **Specialized Modules**:
   - 📱 **Attendance Module**: Faculty session launcher with dynamic QR generator; Student camera scanner simulator; Subject-wise attendance %, history, and CSV export.
   - 📑 **Assignment Hub**: Rubrics specification; Student submission modal (PDF, ZIP, GitHub URL); Faculty grading interface with simulated plagiarism detector.
   - 🎟️ **Event Management**: Seat capacity tracker; Automatic downloadable **Verified QR Ticket Pass** for registered students.
   - 💼 **Placement Portal**: Company listings with CTC packages, eligibility rules, 1-Click resume application, and interactive status pipeline (`Applied` &rarr; `Shortlisted` &rarr; `Interview` &rarr; `Offered`).
   - ⚙️ **Admin Security Panel**: User CRUD operations, role delegation, Recharts analytical graphs, system audit log viewer, and CSV dataset exporter.

3. **Bonus Innovations**:
   - 🤖 **Campus AI FAQ Assistant**: Floating AI chatbot for campus rules, library timings, and placement eligibility queries.
   - 🔍 **Spotlight Search (Ctrl + K / Cmd + K)**: Instant fuzzy search across students, faculty, events, assignments, and placements.
   - 🐳 **Dockerization**: Ready-to-run `Dockerfile` and `docker-compose.yml`.

---

## 🚀 Quick Setup & Installation

### Prerequisites
- Node.js (v18.x or v20.x+)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone <your-github-repo-url>
cd hackathon
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Connecting to GitHub Remote Repository

To link this local workspace to a newly created GitHub repository:

```bash
# 1. Add your remote GitHub repo
git remote add origin https://github.com/your-username/smart-campus-platform.git

# 2. Rename branch to main
git branch -M main

# 3. Push initial code commit
git push -u origin main
```

---

## 🐳 Docker Deployment

Run the containerized application with Docker Compose:
```bash
docker-compose up --build
```
The application will be live at `http://localhost:3000`.

---

## 🔑 Test Credentials & Demo Accounts

See [`TEST_CREDENTIALS.md`](file:///c:/Users/yashr/Desktop/hackathon/TEST_CREDENTIALS.md) for pre-configured judge credentials. You can also use the **Role Switcher** in the top navigation bar to test all views instantly!
