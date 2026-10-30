# Delivery Documentation — Muhammad Hammad Portfolio

**Owner:** Muhammad Hammad (`h4mmad07`, `mh9456605@gmail.com`)  
**Local path:** `E:\Workspace\02_Web_Development\Portfolio_Website\muhammad-hammad-portfolio`  
**Live site:** https://h4mmad07-portfolio.vercel.app/  
**Stack:** React 18 + Vite + Tailwind + Three.js + Supabase Cloud (PostgreSQL + RLS + Object Storage)

---

## 1. Supabase Setup

### 1.1 Create the database
1. Log in to [Supabase](https://supabase.com/dashboard) and create a new project.
2. Open **SQL Editor** from the left sidebar.
3. Paste the entire contents of `supabase/schema.sql` and click **Run**.

This creates:
- Tables: `portfolio_profile`, `portfolio_services`, `portfolio_projects`, `portfolio_skills`, `portfolio_marquee_skills`, `portfolio_experience`, `portfolio_education`, `portfolio_certifications`, `portfolio_contact_messages`, `portfolio_site_settings`.
- Row Level Security (RLS) enabled on all tables (public read for published items, authenticated-only write).
- Storage buckets: `portfolio-media` (images, avatars, screenshots) and `portfolio-documents` (master PDF resumes).

### 1.2 Create the admin user
1. In Supabase Dashboard → **Authentication → Users**, click **Add user**.
2. Enter an email and password for the admin account.
3. Confirm the email (or disable email confirmations in **Authentication → Settings** for testing).

The Admin Dashboard at `/admin` requires an authenticated Supabase session. `AdminLogin.tsx` also supports a master passcode fallback if configured.

---

## 2. Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Retrieve these values from **Supabase Dashboard → Project Settings → API**.

### Vercel deployment
In your Vercel project settings:
1. Go to **Settings → Environment Variables**.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Set environment to **Production**, **Preview**, and **Development**.
4. Redeploy.

`vercel.json` is already configured with SPA rewrite rules for `/` and `/admin`.

---

## 3. Admin Dashboard Usage

### Access
- Public portfolio: `http://localhost:3000/` (or your deployed domain)
- Admin login: `http://localhost:3000/admin/login`
- Admin dashboard: `http://localhost:3000/admin`

### Login
Use the Supabase Auth email/password created in step 1.2, or the master passcode fallback defined in `src/components/admin/AdminLogin.tsx`.

### Tabs available
| Tab | Purpose |
|-----|---------|
| Overview | System metrics, sync status, quick shortcuts |
| Profile | Avatar/profile photo upload, bio, contact info |
| Projects | Full CRUD, thumbnails, multi-screenshot gallery, category/status selectors, draft/published toggle |
| Certifications | CRUD for technical credentials and badges |
| Media | Resume PDF upload & replacement |
| Inquiries | Contact messages inbox (read/reply/delete) |
| Settings | Section visibility switches, SEO metadata |
| Skills | Skills & categories management |
| Services | What I Do services management |
| Experience | Work history management |
| Security | Auth and passcode settings |

---

## 4. Local Development

```powershell
# Prepend Node to PATH (required on this Windows machine)
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

# Install dependencies (first time only)
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build (tsc + vite build)
npm run build

# Preview production build locally
npm run preview
```

---

## 5. Feature Checklist (Verified)

- [x] TypeScript build passes with zero errors (`tsc && vite build`)
- [x] Public portfolio at `/`
- [x] Admin login at `/admin/login`
- [x] Admin dashboard at `/admin`
- [x] Legacy `AdminAuthModal.tsx` and `AdminDashboard.tsx` removed
- [x] Supabase schema with RLS and storage buckets
- [x] Environment template (`.env.example`)
- [x] Vercel SPA rewrites (`vercel.json`)

---

## 6. Support

Report issues at: https://github.com/Kilo-Org/kilocode/issues  
Portfolio owner contact: `mh9456605@gmail.com`
