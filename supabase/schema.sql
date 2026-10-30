-- ==============================================================================
-- Muhammad Hammad Portfolio - Production Database & Storage Schema
-- Run this migration in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- PASSWORD RESET OTP TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS password_reset_otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '10 minutes'),
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE password_reset_otps ENABLE ROW LEVEL SECURITY;

-- SERVICE ROLE CAN ACCESS OTP TABLE (handled by edge functions)
-- ------------------------------------------------------------------------------
-- 1. PORTFOLIO PROFILE
-- ------------------------------------------------------------------------------
create table if not exists public.portfolio_profile (
  id text primary key default 'main',
  full_name text not null default 'Muhammad Hammad',
  first_name text not null default 'Hammad',
  title text not null default 'Software Engineer & AI Enthusiast',
  tagline text not null default 'Crafting High-Performance Systems, AI Solutions & 3D Interactive Experiences',
  email text not null default 'mh9456605@gmail.com',
  phone text default '+92 308 4098287',
  whatsapp text default '+923084098287',
  location text default 'Multan, Punjab, Pakistan',
  address text default 'Chak No. 2/KMR P/O Kot Abbas Shaheed, Multan',
  time_zone text default 'Asia/Karachi',
  avatar_url text default '/images/avatar.png',
  avatar_digital_url text default '/images/avatar-digital.png',
  profile_photo_url text default '/images/profile-photo.jpg',
  resume_url text default '',
  availability text default 'Open to Opportunities & Collaborations',
  summary text default 'An enthusiastic Computer Science undergraduate at MNS University of Agriculture, Multan, passionate about software development, AI, and problem-solving. Skilled in C++, Python, C#, SQL, and video editing, with a strong interest in exploring new technologies and contributing to impactful projects.',
  stats jsonb default '[
    {"label": "Core Projects Completed", "value": "5+", "suffix": "Built"},
    {"label": "Core Languages", "value": "4+", "suffix": "Languages"},
    {"label": "Undergraduate Degree", "value": "BSCS", "suffix": "2023-27"},
    {"label": "Creative Media Experience", "value": "Nov 2025", "suffix": "Present"}
  ]'::jsonb,
  social_links jsonb default '[
    {"name": "GitHub", "url": "https://github.com/h4mmad07", "icon": "github", "label": "github.com/h4mmad07"},
    {"name": "LinkedIn", "url": "https://www.linkedin.com/in/muhammad-hammad-5b233a2a0/", "icon": "linkedin", "label": "LinkedIn Profile"},
    {"name": "Email", "url": "mailto:mh9456605@gmail.com", "icon": "mail", "label": "mh9456605@gmail.com"},
    {"name": "WhatsApp", "url": "https://wa.me/923084098287", "icon": "phone", "label": "+92 308 4098287"}
  ]'::jsonb,
  updated_at timestamptz default now()
);

-- Seed initial row if empty
insert into public.portfolio_profile (id)
values ('main')
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 2. PORTFOLIO SERVICES / WHAT I DO
-- ------------------------------------------------------------------------------
create table if not exists public.portfolio_services (
  id text primary key,
  title text not null,
  description text not null,
  technologies text[] default '{}',
  gradient text default 'from-cyan-500/20 via-blue-500/10 to-transparent',
  border_color text default 'group-hover:border-cyan-500/50',
  display_order integer default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

-- Seed default services
insert into public.portfolio_services (id, title, description, technologies, gradient, border_color, display_order)
values
(
  'software-eng',
  'Software Engineering & OOP',
  'Architecting clean, modular desktop and systems software using Object-Oriented Principles, robust file handling, and scalable design patterns.',
  array['C++', 'C#', 'OOP', 'Software Architecture', 'Data Structures'],
  'from-cyan-500/20 via-blue-500/10 to-transparent',
  'group-hover:border-cyan-500/50',
  1
),
(
  'ai-ml',
  'AI & Machine Learning Systems',
  'Building intelligent systems with Python, OpenCV, and modern ML algorithms for predictive modeling, computer vision, and automation pipelines.',
  array['Python', 'Machine Learning', 'OpenCV', 'Data Analysis', 'Algorithms'],
  'from-purple-500/20 via-pink-500/10 to-transparent',
  'group-hover:border-purple-500/50',
  2
),
(
  'game-dev',
  'Interactive 3D & Game Development',
  'Creating immersive interactive simulations and games leveraging Unity Engine, Blender 3D modeling, C# scripting, and optimized render pipelines.',
  array['Unity 3D', 'C# Scripting', 'Blender', 'Physics Simulation', 'Game Design'],
  'from-emerald-500/20 via-teal-500/10 to-transparent',
  'group-hover:border-emerald-500/50',
  3
),
(
  'database-systems',
  'Database Architecture & Systems',
  'Designing normalized relational databases, transactional schemas, and high-performance SQL queries for mission-critical record management.',
  array['SQL Server', 'MySQL', 'Database Design', 'Schema Architecture', 'Data Integrity'],
  'from-amber-500/20 via-orange-500/10 to-transparent',
  'group-hover:border-amber-500/50',
  4
)
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 3. PORTFOLIO PROJECTS
-- ------------------------------------------------------------------------------
create table if not exists public.portfolio_projects (
  id text primary key,
  title text not null,
  year text not null default '2026',
  category text not null default 'Game Dev',
  description text not null,
  technologies text[] default '{}',
  github_url text default '',
  live_url text default '',
  thumbnail_url text default '',
  screenshots text[] default '{}',
  status text default 'Completed',
  featured boolean default false,
  highlights text[] default '{}',
  gradient text default 'from-cyan-600/30 to-blue-600/20',
  display_order integer default 0,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Seed existing projects
insert into public.portfolio_projects (id, title, year, category, description, technologies, github_url, live_url, featured, highlights, gradient, display_order)
values
(
  'blood-pressure-app',
  'Blood Pressure Management System',
  '2026',
  'Desktop App',
  'A desktop software for tracking cardiovascular health metrics, calculating mean arterial pressure, and providing health trend alerts with robust local file storage.',
  array['C#', 'Windows Forms', '.NET Framework', 'Data Persistence', 'Medical Logic'],
  'https://github.com/h4mmad07',
  '',
  true,
  array['Structured file-based persistence engine', 'Dynamic MAP & heart-rate trend calculators', 'Color-coded systolic/diastolic risk zone classification'],
  'from-cyan-600/30 to-blue-600/20',
  1
),
(
  'supermarket-system',
  'Supermarket Management System',
  '2025',
  'Desktop App',
  'A point-of-sale inventory and transaction suite built with C++ and OOP, featuring customer invoicing, product cataloging, and sales reporting.',
  array['C++', 'Object-Oriented Programming', 'File Handling', 'Data Structures'],
  'https://github.com/h4mmad07',
  '',
  true,
  array['Modular inventory state synchronization', 'Fast binary file serialization for inventory items', 'Automated bill calculation with tax algorithms'],
  'from-blue-600/30 to-indigo-600/20',
  2
),
(
  'portfolio-interactive',
  'Interactive 3D Developer Portfolio',
  '2026',
  'Game Dev',
  'High-performance personal web platform integrating real-time 3D Three.js visualizers, cloud CMS data administration, and ATS-compliant PDF generation.',
  array['React 18', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Framer Motion'],
  'https://github.com/h4mmad07/Portfolio',
  'https://h4mmad07-portfolio.vercel.app/',
  true,
  array['Real-time dynamic 3D lighting shaders & mouse tracking', 'Cloud-synchronized private administration panel', 'Native ATS-compliant PDF generator without text slicing'],
  'from-purple-600/30 to-cyan-600/20',
  3
),
(
  'database-university',
  'University Academic Portal DB',
  '2025',
  'Database System',
  'Relational database architecture designed for managing student enrollment, faculty workloads, grading cycles, and departmental prerequisites.',
  array['SQL Server', 'Relational Schemas', 'Database Normalization', 'Stored Procedures'],
  'https://github.com/h4mmad07',
  '',
  false,
  array['3NF normalized tables eliminating update anomalies', 'Complex stored procedures for GPA & prerequisite validation', 'Optimized foreign key indices for sub-second report queries'],
  'from-emerald-600/30 to-teal-600/20',
  4
),
(
  'ai-prediction-model',
  'Predictive Analytics Pipeline',
  '2025',
  'AI & ML',
  'Machine learning pipeline for data preprocessing, feature engineering, and predictive classification modeling utilizing Python data science libraries.',
  array['Python', 'NumPy', 'Pandas', 'Scikit-Learn', 'Matplotlib'],
  'https://github.com/h4mmad07',
  '',
  false,
  array['Automated missing-value imputation & feature scaling', 'Cross-validated classification models with ROC metrics', 'Interactive visualization dashboard for model evaluation'],
  'from-pink-600/30 to-purple-600/20',
  5
)
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 4. PORTFOLIO SKILLS & MARQUEE
-- ------------------------------------------------------------------------------
create table if not exists public.portfolio_skills (
  id text primary key,
  category_id text not null,
  category_title text not null,
  name text not null,
  level integer default 80,
  icon text default 'code',
  display_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.portfolio_marquee_skills (
  id serial primary key,
  name text not null unique,
  display_order integer default 0
);

-- Seed marquee skills
insert into public.portfolio_marquee_skills (name, display_order)
values
  ('C++', 1), ('Python', 2), ('C#', 3), ('Unity 3D', 4), ('SQL', 5),
  ('Blender', 6), ('Three.js', 7), ('Machine Learning', 8), ('React', 9),
  ('TypeScript', 10), ('OOP Design', 11), ('Git & GitHub', 12)
on conflict (name) do nothing;

-- ------------------------------------------------------------------------------
-- 5. PORTFOLIO EXPERIENCE
-- ------------------------------------------------------------------------------
create table if not exists public.portfolio_experience (
  id text primary key,
  role text not null,
  company text not null,
  period text not null,
  location text default '',
  responsibilities text[] default '{}',
  tags text[] default '{}',
  employment_type text default 'Full-time',
  company_logo text default '',
  company_website text default '',
  start_date date,
  end_date date,
  currently_working boolean default false,
  display_order integer default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

insert into public.portfolio_experience (id, role, company, period, location, responsibilities, tags, display_order)
values
(
  'exp-lead-editor',
  'Lead Video Editor & Content Creator',
  'Directorate of Student Affairs, MNSUAM',
  'Nov 2025 – Present',
  'Multan, Pakistan',
  array[
    'Directing and producing official institutional multimedia broadcasts, event highlights, and documentary reels.',
    'Managing post-production workflows including 4K video editing, color grading, motion graphics, and audio mastering.',
    'Collaborating with faculty and student leadership to elevate digital campus outreach and engagement.'
  ],
  array['Premiere Pro', 'Video Production', 'Creative Direction', 'Storyboarding', 'Motion Graphics'],
  1
)
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 6. PORTFOLIO EDUCATION
-- ------------------------------------------------------------------------------
create table if not exists public.portfolio_education (
  id text primary key,
  degree text not null,
  institution text not null,
  period text not null,
  location text default '',
  badge text default 'In Progress',
  description text default '',
  qualification text default '',
  board_university text default '',
  grade_cgpa text default '',
  total_marks_scale text default '',
  achievements text default '',
  institution_website text default '',
  display_order integer default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

insert into public.portfolio_education (id, degree, institution, period, location, badge, description, display_order)
values
(
  'edu-bscs',
  'Bachelor of Science in Computer Science (BSCS)',
  'MNS University of Agriculture, Multan (MNSUAM)',
  '2023 – 2027',
  'Multan, Punjab, Pakistan',
  'In Progress',
  'Rigorous study across Data Structures, Algorithms, Object-Oriented Software Design, Artificial Intelligence, Database Management Systems, and Computer Networks.',
  1
)
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 7. PORTFOLIO CERTIFICATIONS
-- ------------------------------------------------------------------------------
create table if not exists public.portfolio_certifications (
  id text primary key,
  title text not null,
  issuer text not null,
  issue_date text not null,
  credential_id text default '',
  credential_url text default '',
  badge_url text default '',
  description text default '',
  skills text[] default '{}',
  display_order integer default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

-- Seed example certifications relevant to Computer Science & Development
insert into public.portfolio_certifications (id, title, issuer, issue_date, credential_id, credential_url, description, skills, display_order)
values
(
  'cert-cs50-ai',
  'CS & AI Architecture Specialist',
  'Academic Honors & Development',
  '2025',
  'MNSUAM-CS-2025',
  'https://github.com/h4mmad07',
  'Demonstrated mastery in core computing algorithms, OOP system design, and AI model implementations.',
  array['C++', 'Python', 'Algorithms', 'AI'],
  1
),
(
  'cert-unity-foundations',
  'Interactive Simulation & 3D Realtime Systems',
  'Game Dev & Creative Systems',
  '2025',
  'UNITY-3D-DEV-2025',
  'https://github.com/h4mmad07',
  'Certified proficiency in real-time interactive simulation, C# scripting, and 3D asset integration with Blender.',
  array['Unity 3D', 'C#', 'Blender', 'Physics'],
  2
)
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 8. CONTACT INQUIRIES & MESSAGES
-- ------------------------------------------------------------------------------
create table if not exists public.portfolio_contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text default '',
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 9. WEBSITE SETTINGS
-- ------------------------------------------------------------------------------
create table if not exists public.portfolio_site_settings (
  id text primary key default 'settings',
  site_title text not null default 'Muhammad Hammad | Software Engineer & AI Enthusiast',
  meta_description text not null default 'Personal Portfolio & Cloud CMS of Muhammad Hammad — Systems, AI & 3D Experiences.',
  logo_text text default 'MH',
  theme_accent text default 'cyan',
  sections_visibility jsonb default '{
    "hero": true,
    "about": true,
    "services": true,
    "skills": true,
    "projects": true,
    "certifications": true,
    "experience": true,
    "contact": true
  }'::jsonb,
  updated_at timestamptz default now()
);

insert into public.portfolio_site_settings (id)
values ('settings')
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.portfolio_profile enable row level security;
alter table public.portfolio_services enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_skills enable row level security;
alter table public.portfolio_marquee_skills enable row level security;
alter table public.portfolio_experience enable row level security;
alter table public.portfolio_education enable row level security;
alter table public.portfolio_certifications enable row level security;
alter table public.portfolio_contact_messages enable row level security;
alter table public.portfolio_site_settings enable row level security;

-- PUBLIC READ POLICIES (Anyone can view published content)
create policy "Public can read profile" on public.portfolio_profile for select using (true);
create policy "Public can read visible services" on public.portfolio_services for select using (is_visible = true or auth.role() = 'authenticated');
create policy "Public can read published projects" on public.portfolio_projects for select using (is_published = true or auth.role() = 'authenticated');
create policy "Public can read skills" on public.portfolio_skills for select using (true);
create policy "Public can read marquee skills" on public.portfolio_marquee_skills for select using (true);
create policy "Public can read visible experience" on public.portfolio_experience for select using (is_visible = true or auth.role() = 'authenticated');
create policy "Public can read visible education" on public.portfolio_education for select using (is_visible = true or auth.role() = 'authenticated');
create policy "Public can read visible certifications" on public.portfolio_certifications for select using (is_visible = true or auth.role() = 'authenticated');
create policy "Public can read site settings" on public.portfolio_site_settings for select using (true);

-- PUBLIC SUBMIT FOR CONTACT MESSAGES
create policy "Public can submit contact messages" on public.portfolio_contact_messages for insert with check (true);

-- AUTHENTICATED ADMIN FULL ACCESS (Owner only)
create policy "Admin full access profile" on public.portfolio_profile for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access services" on public.portfolio_services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access projects" on public.portfolio_projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access skills" on public.portfolio_skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access marquee" on public.portfolio_marquee_skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access experience" on public.portfolio_experience for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access education" on public.portfolio_education for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access certifications" on public.portfolio_certifications for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access contact messages" on public.portfolio_contact_messages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access site settings" on public.portfolio_site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 11. SUPABASE STORAGE BUCKETS SETUP
-- ------------------------------------------------------------------------------
-- Create storage buckets for media (images) and documents (resumes/PDFs)
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-documents', 'portfolio-documents', true)
on conflict (id) do nothing;

-- Storage Policies: Public can view assets, Authenticated user can upload/modify/delete
create policy "Public can view portfolio media" on storage.objects for select using (bucket_id in ('portfolio-media', 'portfolio-documents'));
create policy "Admin can insert portfolio media" on storage.objects for insert with check (bucket_id in ('portfolio-media', 'portfolio-documents') and auth.role() = 'authenticated');
create policy "Admin can update portfolio media" on storage.objects for update using (bucket_id in ('portfolio-media', 'portfolio-documents') and auth.role() = 'authenticated');
create policy "Admin can delete portfolio media" on storage.objects for delete using (bucket_id in ('portfolio-media', 'portfolio-documents') and auth.role() = 'authenticated');
