-- Apply this migration to an existing Supabase project.
-- The sole portfolio administrator is the verified owner email in the signed JWT.

alter table public.password_reset_otps
  add column if not exists attempt_count integer not null default 0;
create index if not exists password_reset_otps_email_created_idx
  on public.password_reset_otps (email, created_at desc);

create table if not exists public.password_reset_grants (
  id uuid primary key default gen_random_uuid(), email text not null,
  token_hash text not null unique, expires_at timestamptz not null,
  used boolean not null default false, created_at timestamptz not null default now()
);
alter table public.password_reset_grants enable row level security;
create table if not exists public.contact_submission_events (
  id bigint generated always as identity primary key, ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists contact_submission_events_ip_created_idx
  on public.contact_submission_events (ip_hash, created_at desc);
alter table public.contact_submission_events enable row level security;
create or replace function public.allow_contact_submission(p_ip_hash text)
returns boolean language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare recent_count integer;
begin
  perform pg_advisory_xact_lock(hashtext(p_ip_hash));
  select count(*) into recent_count from public.contact_submission_events
    where ip_hash = p_ip_hash and created_at >= now() - interval '1 hour';
  if recent_count >= 5 then return false; end if;
  delete from public.contact_submission_events where created_at < now() - interval '24 hours';
  insert into public.contact_submission_events (ip_hash) values (p_ip_hash);
  return true;
end;
$$;
revoke all on function public.allow_contact_submission(text) from public, anon, authenticated;
grant execute on function public.allow_contact_submission(text) to service_role;
create table if not exists public.password_reset_request_events (
  id bigint generated always as identity primary key, email text not null,
  created_at timestamptz not null default now()
);
create index if not exists password_reset_request_events_email_created_idx
  on public.password_reset_request_events (email, created_at desc);
alter table public.password_reset_request_events enable row level security;
create or replace function public.allow_password_reset_request(p_email text)
returns boolean language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare recent_count integer; latest_request timestamptz;
begin
  perform pg_advisory_xact_lock(hashtext(p_email));
  select count(*), max(created_at) into recent_count, latest_request
    from public.password_reset_request_events where email = p_email and created_at >= now() - interval '1 hour';
  if recent_count >= 5 or latest_request >= now() - interval '60 seconds' then return false; end if;
  delete from public.password_reset_request_events where created_at < now() - interval '24 hours';
  insert into public.password_reset_request_events (email) values (p_email);
  return true;
end;
$$;
revoke all on function public.allow_password_reset_request(text) from public, anon, authenticated;
grant execute on function public.allow_password_reset_request(text) to service_role;
create or replace function public.record_password_reset_attempt(p_id uuid)
returns integer language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare next_attempt integer;
begin
  update public.password_reset_otps
    set attempt_count = least(attempt_count + 1, 5), used = (attempt_count + 1 >= 5)
    where id = p_id and used = false
    returning attempt_count into next_attempt;
  return coalesce(next_attempt, 5);
end;
$$;
revoke all on function public.record_password_reset_attempt(uuid) from public, anon, authenticated;
grant execute on function public.record_password_reset_attempt(uuid) to service_role;

drop policy if exists "Public can read visible services" on public.portfolio_services;
create policy "Public can read visible services" on public.portfolio_services for select using (is_visible = true);
drop policy if exists "Public can read published projects" on public.portfolio_projects;
create policy "Public can read published projects" on public.portfolio_projects for select using (is_published = true);
drop policy if exists "Public can read visible experience" on public.portfolio_experience;
create policy "Public can read visible experience" on public.portfolio_experience for select using (is_visible = true);
drop policy if exists "Public can read visible education" on public.portfolio_education;
create policy "Public can read visible education" on public.portfolio_education for select using (is_visible = true);
drop policy if exists "Public can read visible certifications" on public.portfolio_certifications;
create policy "Public can read visible certifications" on public.portfolio_certifications for select using (is_visible = true);
drop policy if exists "Public can submit contact messages" on public.portfolio_contact_messages;

drop policy if exists "Admin full access profile" on public.portfolio_profile;
drop policy if exists "Admin full access services" on public.portfolio_services;
drop policy if exists "Admin full access projects" on public.portfolio_projects;
drop policy if exists "Admin full access skills" on public.portfolio_skills;
drop policy if exists "Admin full access marquee" on public.portfolio_marquee_skills;
drop policy if exists "Admin full access experience" on public.portfolio_experience;
drop policy if exists "Admin full access education" on public.portfolio_education;
drop policy if exists "Admin full access certifications" on public.portfolio_certifications;
drop policy if exists "Admin full access contact messages" on public.portfolio_contact_messages;
drop policy if exists "Admin full access site settings" on public.portfolio_site_settings;

drop policy if exists "Owner full access profile" on public.portfolio_profile;
create policy "Owner full access profile" on public.portfolio_profile for all using (auth.jwt() ->> 'email' = 'mh9456605@gmail.com') with check (auth.jwt() ->> 'email' = 'mh9456605@gmail.com');
drop policy if exists "Owner full access services" on public.portfolio_services;
create policy "Owner full access services" on public.portfolio_services for all using (auth.jwt() ->> 'email' = 'mh9456605@gmail.com') with check (auth.jwt() ->> 'email' = 'mh9456605@gmail.com');
drop policy if exists "Owner full access projects" on public.portfolio_projects;
create policy "Owner full access projects" on public.portfolio_projects for all using (auth.jwt() ->> 'email' = 'mh9456605@gmail.com') with check (auth.jwt() ->> 'email' = 'mh9456605@gmail.com');
drop policy if exists "Owner full access skills" on public.portfolio_skills;
create policy "Owner full access skills" on public.portfolio_skills for all using (auth.jwt() ->> 'email' = 'mh9456605@gmail.com') with check (auth.jwt() ->> 'email' = 'mh9456605@gmail.com');
drop policy if exists "Owner full access marquee" on public.portfolio_marquee_skills;
create policy "Owner full access marquee" on public.portfolio_marquee_skills for all using (auth.jwt() ->> 'email' = 'mh9456605@gmail.com') with check (auth.jwt() ->> 'email' = 'mh9456605@gmail.com');
drop policy if exists "Owner full access experience" on public.portfolio_experience;
create policy "Owner full access experience" on public.portfolio_experience for all using (auth.jwt() ->> 'email' = 'mh9456605@gmail.com') with check (auth.jwt() ->> 'email' = 'mh9456605@gmail.com');
drop policy if exists "Owner full access education" on public.portfolio_education;
create policy "Owner full access education" on public.portfolio_education for all using (auth.jwt() ->> 'email' = 'mh9456605@gmail.com') with check (auth.jwt() ->> 'email' = 'mh9456605@gmail.com');
drop policy if exists "Owner full access certifications" on public.portfolio_certifications;
create policy "Owner full access certifications" on public.portfolio_certifications for all using (auth.jwt() ->> 'email' = 'mh9456605@gmail.com') with check (auth.jwt() ->> 'email' = 'mh9456605@gmail.com');
drop policy if exists "Owner full access contact messages" on public.portfolio_contact_messages;
create policy "Owner full access contact messages" on public.portfolio_contact_messages for all using (auth.jwt() ->> 'email' = 'mh9456605@gmail.com') with check (auth.jwt() ->> 'email' = 'mh9456605@gmail.com');
drop policy if exists "Owner full access site settings" on public.portfolio_site_settings;
create policy "Owner full access site settings" on public.portfolio_site_settings for all using (auth.jwt() ->> 'email' = 'mh9456605@gmail.com') with check (auth.jwt() ->> 'email' = 'mh9456605@gmail.com');

drop policy if exists "Admin can insert portfolio media" on storage.objects;
drop policy if exists "Admin can update portfolio media" on storage.objects;
drop policy if exists "Admin can delete portfolio media" on storage.objects;
drop policy if exists "Owner can insert portfolio media" on storage.objects;
drop policy if exists "Owner can update portfolio media" on storage.objects;
drop policy if exists "Owner can delete portfolio media" on storage.objects;
create policy "Owner can insert portfolio media" on storage.objects for insert with check (bucket_id in ('portfolio-media', 'portfolio-documents') and auth.jwt() ->> 'email' = 'mh9456605@gmail.com');
create policy "Owner can update portfolio media" on storage.objects for update using (bucket_id in ('portfolio-media', 'portfolio-documents') and auth.jwt() ->> 'email' = 'mh9456605@gmail.com');
create policy "Owner can delete portfolio media" on storage.objects for delete using (bucket_id in ('portfolio-media', 'portfolio-documents') and auth.jwt() ->> 'email' = 'mh9456605@gmail.com');
