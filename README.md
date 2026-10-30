<div align="center">

# 🚀 Muhammad Hammad — Interactive 3D Portfolio & CMS

<p align="center">
  <strong>A cloud-synchronized developer portfolio with Supabase-backed admin dashboard, photo/video project galleries, and GitHub auto-sync.</strong>
</p>

[![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.168-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[🌐 Live Preview](#) • [📄 Features](#-key-features) • [⚡ Tech Stack](#-tech-stack) • [🚀 Quick Start](#-quick-start) • [🔐 Admin](#-admin-portal) • [📫 Contact](#-contact)

---

</div>

## 📖 Overview

This repository powers **Muhammad Hammad's** official personal portfolio website. Built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Three.js**, it bridges high-performance system engineering with immersive 3D web interactive design.

The site is backed by **Supabase** (PostgreSQL + Row Level Security + Object Storage) for cloud-synced content, and includes a **private Admin Dashboard** at `/admin` for full CRUD management of projects, certifications, skills, services, experience, education, and site settings.

---

## ✨ Key Features

### 🎮 1. Interactive 3D Hero Section
- Dynamic 3D interactive viewport powered by `@react-three/fiber` and `@react-three/drei`.
- Real-time mouse tracking, lighting shaders, and geometry physics.

### 💼 2. Cloud-Synchronized Projects Gallery
- Project cards with category filtering (Game Dev, Desktop App, AI & ML, Database System, Software Architecture).
- **Photo & video support** — upload screenshots and videos per project via Admin Dashboard.
- Multi-screenshot modal gallery with image/video rendering.
- Project status indicators (Completed, In Progress, Production, Prototype).
- Draft/published toggle per project.

### 📄 3. ATS-Compliant Resume PDF Generator
- One-click PDF resume export with `html2pdf.js`.
- Print mode with `@media print` rules.

### 🔐 4. Private Admin Dashboard (`/admin`)
- Secure login via Supabase Auth or master passcode.
- Full CRUD for: Profile, Projects, Certifications, Skills, Services, Experience, Education, Settings.
- Section visibility toggles (show/hide sections on public site).
- Contact inquiries inbox (read/reply/delete).
- Resume PDF upload & replacement in cloud storage.

### 🔄 5. GitHub Auto-Sync
- Push to any `h4mmad07/*` GitHub repo → project auto-adds to portfolio via webhook.
- Manual sync from Admin → Security tab with repo selection and checkboxes.
- Choose which synced repos publish publicly vs. stay as drafts.

### 📊 6. Additional Sections
- Certifications with badge image/PDF upload and credential verification links.
- Skills matrix and marquee scrolling skills.
- Services ("What I Do") with technology tags.
- Experience & Education timeline.
- Contact form with real message storage to Supabase.
- Social links (GitHub, LinkedIn, Email, WhatsApp).

---

## 🛠️ Tech Stack

### Frontend & Framework
- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations**: Framer Motion
- **Icons**: Lucide React Icons
- **Routing**: react-router-dom

### Backend & Cloud
- **Database**: Supabase PostgreSQL with Row Level Security
- **Storage**: Supabase Object Storage (portfolio-media, portfolio-documents buckets)
- **Authentication**: Supabase Auth

### PDF & Document Engine
- `html2pdf.js`, `jsPDF`, `html2canvas`

---

## 📁 Project Structure

```
muhammad-hammad-portfolio/
├── public/                  # Public static assets & images
├── src/
│   ├── components/          # UI Components
│   │   ├── admin/           # Admin Dashboard (Login, Layout, Tabs)
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── tabs/        # Overview, Profile, Projects, Certifications, etc.
│   │   ├── ui/              # Custom Cursor, Particle Background, SectionHeader
│   │   ├── Certifications.tsx
│   │   ├── Contact.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProjectModal.tsx
│   │   ├── Projects.tsx
│   │   ├── ResumeModal.tsx
│   │   └── TechStack.tsx
│   ├── context/             # PortfolioContext (global state + Supabase sync)
│   ├── data/                # Initial portfolio data
│   ├── lib/                 # supabase.ts (Supabase client + file upload)
│   ├── types/               # portfolio.ts (TypeScript master schema)
│   ├── utils/               # security.ts (passcode verification)
│   ├── App.tsx              # Application root + routing
│   ├── index.css            # Base styles
│   └── main.tsx             # React DOM entrypoint
├── api/
│   └── webhook/
│       └── github.ts        # Vercel serverless function for GitHub webhook
├── supabase/
│   └── schema.sql           # Database & storage schema (RLS policies + buckets)
├── .env                     # Environment variables (NOT committed)
├── vercel.json              # Vercel SPA rewrite rules
├── package.json             # Dependencies & build scripts
├── tailwind.config.js       # Theme tokens
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite bundler setup
```

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have **Node.js** (v18.0.0 or higher) and **npm** installed.

### 2. Clone Repository
```bash
git clone https://github.com/h4mmad07/portfolio.git
cd portfolio
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Set Environment Variables
Create `.env` in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
GITHUB_WEBHOOK_SECRET=your-webhook-secret
```

### 5. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000/`.

### 6. Build for Production
```bash
npm run build
```
Output goes to `dist/`.

---

## 🔐 Admin Portal

1. Navigate to `http://localhost:3000/admin/login`
2. Login with Supabase Auth credentials or master passcode
3. Access dashboard at `/admin`
4. Manage projects, certifications, skills, services, experience, education, settings, media, and inquiries

---

## 🔄 GitHub Auto-Sync Setup

1. Add `GITHUB_WEBHOOK_SECRET` to `.env` and Vercel Environment Variables
2. Deploy to Vercel
3. In GitHub repo → Settings → Webhooks → Add webhook:
   - **Payload URL:** `https://your-app.vercel.app/api/webhook/github`
   - **Content type:** `application/json`
   - **Secret:** your webhook secret
   - **Events:** Push, Create
4. Or manually sync via Admin → Security tab → "Load My GitHub Repos"

---

## ☁️ Supabase Setup

1. Run `supabase/schema.sql` in Supabase SQL Editor
2. Create admin user in Supabase Authentication → Users
3. Confirm storage buckets `portfolio-media` and `portfolio-documents` exist
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Vercel env vars

---

## 📫 Contact & Connect

- **Email**: [mh9456605@gmail.com](mailto:mh9456605@gmail.com)
- **WhatsApp**: [+92 308 4098287](https://wa.me/923084098287)
- **GitHub**: [github.com/h4mmad07](https://github.com/h4mmad07)
- **Location**: Multan, Punjab, Pakistan

---

<div align="center">

Designed & Engineered with ❤️ by **Muhammad Hammad**  
*© 2026 All Rights Reserved.*

</div>
