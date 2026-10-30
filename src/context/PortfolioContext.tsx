import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  PortfolioSchema, 
  Project, 
  Experience, 
  Education, 
  Certification,
  PersonalInfo, 
  SkillCategory,
  Service, 
  StatItem,
  SiteSettings,
  ContactMessage
} from '../types/portfolio';
import { initialPortfolioData } from '../data/portfolioData';
import { 
  supabase, 
  isSupabaseConfigured, 
  uploadPortfolioFile,
  sendContactInquiry 
} from '../lib/supabase';
import { verifyPasscode, updatePasscode } from '../utils/security';

interface PortfolioContextType {
  data: PortfolioSchema;
  isLoading: boolean;
  isCloudSynced: boolean;
  isConfigured: boolean;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  
  // Auth
  isAuthenticated: boolean;
  adminUserEmail: string | null;
  login: (passwordOrPasscode: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  changePasscode: (oldPass: string, newPass: string) => Promise<boolean>;
  generateTypeScriptCode: () => string;
  
  // Storage & Media
  uploadFile: (file: File, bucket: 'portfolio-media' | 'portfolio-documents', prefix?: string) => Promise<{ url: string; error?: string }>;
  
  // Data Mutators
  updatePersonal: (info: Partial<PersonalInfo>) => Promise<void>;
  updateStats: (stats: StatItem[]) => Promise<void>;
  updateServices: (services: Service[]) => Promise<void>;
  
  // Projects CRUD
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  reorderProjects: (orderedProjects: Project[]) => Promise<void>;
  
  // Certifications CRUD
  addCertification: (cert: Omit<Certification, 'id'>) => Promise<void>;
  updateCertification: (id: string, cert: Partial<Certification>) => Promise<void>;
  deleteCertification: (id: string) => Promise<void>;
  
  // Skills
  updateSkillCategories: (categories: SkillCategory[]) => Promise<void>;
  updateMarqueeSkills: (skills: string[]) => Promise<void>;
  
  // Experience & Education
  addExperience: (exp: Omit<Experience, 'id'>) => Promise<void>;
  updateExperience: (id: string, exp: Partial<Experience>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  
  addEducation: (edu: Omit<Education, 'id'>) => Promise<void>;
  updateEducation: (id: string, edu: Partial<Education>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  
  // Settings
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  toggleSectionVisibility: (section: keyof SiteSettings['sectionsVisibility']) => Promise<void>;
  
  // Inquiries / Messages
  inquiries: ContactMessage[];
  refreshInquiries: () => Promise<void>;
  markInquiryRead: (id: string) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  submitContact: (inquiry: { name: string; email: string; subject?: string; message: string }) => Promise<{ success: boolean; error?: string }>;
  
  // Backup & Reset
  resetToDefaults: () => void;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;

  // GitHub Sync
  syncFromGitHub: (repoFullName: string, autoPublish?: boolean) => Promise<{ success: boolean; message: string }>;
  syncMultipleRepos: (repoFullNames: string[], autoPublish?: boolean) => Promise<{ success: number; failed: number; messages: string[] }>;
}

const STORAGE_KEY = 'portfolio_custom_data_v2';
const AUTH_KEY = 'portfolio_admin_auth_v2';

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioSchema>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with initialPortfolioData to ensure newly added properties (e.g. certifications, settings) exist
        return {
          ...initialPortfolioData,
          ...parsed,
          settings: {
            ...initialPortfolioData.settings,
            ...(parsed.settings || {}),
            sectionsVisibility: {
              ...initialPortfolioData.settings.sectionsVisibility,
              ...(parsed.settings?.sectionsVisibility || {})
            }
          },
          certifications: parsed.certifications || initialPortfolioData.certifications
        };
      }
    } catch (e) {
      console.error('Error loading localStorage portfolio data:', e);
    }
    return initialPortfolioData;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'authenticated_active_session';
  });
  const [adminUserEmail, setAdminUserEmail] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const isConfigured = isSupabaseConfigured();

  // Save to localStorage as local fast-cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving portfolio data to localStorage:', e);
    }
  }, [data]);

  // Supabase Auth listener
  useEffect(() => {
    if (!isConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setAdminUserEmail(session.user.email || 'Admin');
        sessionStorage.setItem(AUTH_KEY, 'authenticated_active_session');
      }
    });

    const { data: authSubscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setAdminUserEmail(session.user.email || 'Admin');
        sessionStorage.setItem(AUTH_KEY, 'authenticated_active_session');
      } else {
        // Only clear if not in fallback local auth mode
        if (sessionStorage.getItem(AUTH_KEY) !== 'local_authenticated') {
          setIsAuthenticated(false);
          setAdminUserEmail(null);
          sessionStorage.removeItem(AUTH_KEY);
        }
      }
    });

    return () => {
      authSubscription?.subscription?.unsubscribe();
    };
  }, [isConfigured]);

  // Fetch all portfolio data from Supabase
  const loadCloudData = useCallback(async () => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const [
        profileRes,
        projectsRes,
        servicesRes,
        certificationsRes,
        experienceRes,
        educationRes,
        settingsRes,
        marqueeRes
      ] = await Promise.all([
        supabase.from('portfolio_profile').select('*').eq('id', 'main').single(),
        supabase.from('portfolio_projects').select('*').order('display_order', { ascending: true }),
        supabase.from('portfolio_services').select('*').order('display_order', { ascending: true }),
        supabase.from('portfolio_certifications').select('*').order('display_order', { ascending: true }),
        supabase.from('portfolio_experience').select('*').order('display_order', { ascending: true }),
        supabase.from('portfolio_education').select('*').order('display_order', { ascending: true }),
        supabase.from('portfolio_site_settings').select('*').eq('id', 'settings').single(),
        supabase.from('portfolio_marquee_skills').select('*').order('display_order', { ascending: true })
      ]);

      setData((prev) => {
        const next: PortfolioSchema = { ...prev };

        if (profileRes.data) {
          const p = profileRes.data;
          next.personal = {
            fullName: p.full_name || prev.personal.fullName,
            firstName: p.first_name || prev.personal.firstName,
            title: p.title || prev.personal.title,
            tagline: p.tagline || prev.personal.tagline,
            email: p.email || prev.personal.email,
            phone: p.phone || prev.personal.phone,
            whatsapp: p.whatsapp || prev.personal.whatsapp,
            location: p.location || prev.personal.location,
            address: p.address || prev.personal.address,
            timeZone: p.time_zone || prev.personal.timeZone,
            avatarImg: p.avatar_url || prev.personal.avatarImg,
            avatarDigitalImg: p.avatar_digital_url || prev.personal.avatarDigitalImg,
            profilePhoto: p.profile_photo_url || prev.personal.profilePhoto,
            resumeUrl: p.resume_url || prev.personal.resumeUrl,
            availability: p.availability || prev.personal.availability,
            summary: p.summary || prev.personal.summary,
          };
          if (p.stats) next.stats = p.stats;
          if (p.social_links) next.socialLinks = p.social_links;
        }

        if (projectsRes.data && projectsRes.data.length > 0) {
          next.projects = projectsRes.data.map((row: any) => ({
            id: row.id,
            title: row.title,
            year: row.year,
            category: row.category,
            description: row.description,
            technologies: row.technologies || [],
            githubUrl: row.github_url || '',
            liveUrl: row.live_url || '',
            thumbnailUrl: row.thumbnail_url || '',
            screenshots: row.screenshots || [],
            status: row.status || 'Completed',
            featured: row.featured ?? false,
            highlights: row.highlights || [],
            gradient: row.gradient || 'from-cyan-600/30 to-blue-600/20',
            displayOrder: row.display_order ?? 0,
            isPublished: row.is_published ?? true,
            createdAt: row.created_at
          }));
        }

        if (servicesRes.data && servicesRes.data.length > 0) {
          next.services = servicesRes.data.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            technologies: row.technologies || [],
            gradient: row.gradient || 'from-cyan-500/20 via-blue-500/10 to-transparent',
            borderColor: row.border_color || 'group-hover:border-cyan-500/50',
            displayOrder: row.display_order ?? 0,
            isVisible: row.is_visible ?? true
          }));
        }

        if (certificationsRes.data && certificationsRes.data.length > 0) {
          next.certifications = certificationsRes.data.map((row: any) => ({
            id: row.id,
            title: row.title,
            issuer: row.issuer,
            issueDate: row.issue_date,
            credentialId: row.credential_id || '',
            credentialUrl: row.credential_url || '',
            badgeUrl: row.badge_url || '',
            description: row.description || '',
            skills: row.skills || [],
            displayOrder: row.display_order ?? 0,
            isVisible: row.is_visible ?? true
          }));
        }

        if (experienceRes.data && experienceRes.data.length > 0) {
          next.experience = experienceRes.data.map((row: any) => ({
            id: row.id,
            role: row.role,
            company: row.company,
            period: row.period,
            location: row.location || '',
            responsibilities: row.responsibilities || [],
            tags: row.tags || [],
            displayOrder: row.display_order ?? 0,
            isVisible: row.is_visible ?? true
          }));
        }

        if (educationRes.data && educationRes.data.length > 0) {
          next.education = educationRes.data.map((row: any) => ({
            id: row.id,
            degree: row.degree,
            institution: row.institution,
            period: row.period,
            location: row.location || '',
            badge: row.badge || 'In Progress',
            description: row.description || '',
            displayOrder: row.display_order ?? 0,
            isVisible: row.is_visible ?? true
          }));
        }

        if (marqueeRes.data && marqueeRes.data.length > 0) {
          next.marqueeSkills = marqueeRes.data.map((r: any) => r.name);
        }

        if (settingsRes.data) {
          const s = settingsRes.data;
          next.settings = {
            siteTitle: s.site_title || prev.settings.siteTitle,
            metaDescription: s.meta_description || prev.settings.metaDescription,
            logoText: s.logo_text || prev.settings.logoText,
            themeAccent: s.theme_accent || prev.settings.themeAccent,
            sectionsVisibility: {
              ...prev.settings.sectionsVisibility,
              ...(s.sections_visibility || {})
            }
          };
        }

        return next;
      });

      setIsCloudSynced(true);
    } catch (err) {
      console.warn('Could not sync with Supabase cloud. Using local cache:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured]);

  // Initial load
  useEffect(() => {
    loadCloudData();
  }, [loadCloudData]);

  // Real-time synchronization subscription
  useEffect(() => {
    if (!isConfigured) return;

    const channel = supabase
      .channel('portfolio_realtime_sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        loadCloudData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isConfigured, loadCloudData]);

  // Inquiries fetch
  const refreshInquiries = useCallback(async () => {
    if (!isConfigured) {
      try {
        const local = JSON.parse(localStorage.getItem('portfolio_local_messages') || '[]');
        setInquiries(local);
      } catch (e) {
        setInquiries([]);
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('portfolio_contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setInquiries(data.map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          subject: row.subject,
          message: row.message,
          isRead: row.is_read,
          createdAt: row.created_at
        })));
      }
    } catch (err) {
      console.error('Failed to fetch contact inquiries:', err);
    }
  }, [isConfigured]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshInquiries();
    }
  }, [isAuthenticated, refreshInquiries]);

  // ----------------------------------------------------------------------------
  // AUTHENTICATION
  // ----------------------------------------------------------------------------
  const login = async (passwordOrPasscode: string, email?: string): Promise<{ success: boolean; error?: string }> => {
    // 1. If Supabase is configured and an email is provided or default owner email
    if (isConfigured && (email || passwordOrPasscode.length > 5)) {
      const targetEmail = email || 'mh9456605@gmail.com';
      try {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password: passwordOrPasscode,
        });

        if (!error && authData.user) {
          setIsAuthenticated(true);
          setAdminUserEmail(authData.user.email || targetEmail);
          sessionStorage.setItem(AUTH_KEY, 'authenticated_active_session');
          return { success: true };
        }
      } catch (err) {
        // Fall through to check local passcode
      }
    }

    // 2. Master Passcode verification (supports offline & standalone setup)
    const isPasscodeValid = await verifyPasscode(passwordOrPasscode);
    if (isPasscodeValid) {
      setIsAuthenticated(true);
      setAdminUserEmail('Portfolio Owner');
      sessionStorage.setItem(AUTH_KEY, 'local_authenticated');
      return { success: true };
    }

    return { success: false, error: 'Invalid admin credentials or passcode.' };
  };

  const logout = async () => {
    if (isConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // Silent error
      }
    }
    setIsAuthenticated(false);
    setAdminUserEmail(null);
    sessionStorage.removeItem(AUTH_KEY);
  };

  // ----------------------------------------------------------------------------
  // DATA MUTATORS (Cloud-First with Optimistic UI & Local Cache)
  // ----------------------------------------------------------------------------
  const updatePersonal = async (info: Partial<PersonalInfo>) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...info }
    }));

    if (isConfigured) {
      try {
        await supabase.from('portfolio_profile').update({
          full_name: info.fullName,
          first_name: info.firstName,
          title: info.title,
          tagline: info.tagline,
          email: info.email,
          phone: info.phone,
          whatsapp: info.whatsapp,
          location: info.location,
          address: info.address,
          time_zone: info.timeZone,
          avatar_url: info.avatarImg,
          avatar_digital_url: info.avatarDigitalImg,
          profile_photo_url: info.profilePhoto,
          resume_url: info.resumeUrl,
          availability: info.availability,
          summary: info.summary,
          updated_at: new Date().toISOString()
        }).eq('id', 'main');
      } catch (err) {
        console.error('Failed to sync personal info with Supabase:', err);
      }
    }
  };

  const updateStats = async (stats: StatItem[]) => {
    setData((prev) => ({ ...prev, stats }));
    if (isConfigured) {
      try {
        await supabase.from('portfolio_profile').update({
          stats,
          updated_at: new Date().toISOString()
        }).eq('id', 'main');
      } catch (err) {
        console.error('Failed to sync stats with Supabase:', err);
      }
    }
  };

  const updateServices = async (services: Service[]) => {
    setData((prev) => ({ ...prev, services }));
    if (isConfigured) {
      try {
        for (const s of services) {
          await supabase.from('portfolio_services').upsert({
            id: s.id,
            title: s.title,
            description: s.description,
            technologies: s.technologies,
            gradient: s.gradient,
            border_color: s.borderColor,
            display_order: s.displayOrder ?? 0,
            is_visible: s.isVisible ?? true
          });
        }
      } catch (err) {
        console.error('Failed to sync services with Supabase:', err);
      }
    }
  };

  // Projects CRUD
  const addProject = async (project: Omit<Project, 'id'>) => {
    const id = `project-${Date.now()}`;
    const newProject: Project = {
      ...project,
      id,
      displayOrder: (data.projects.length + 1),
      isPublished: project.isPublished ?? true,
      createdAt: new Date().toISOString()
    };

    setData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }));

    if (isConfigured) {
      try {
        await supabase.from('portfolio_projects').insert([{
          id,
          title: newProject.title,
          year: newProject.year,
          category: newProject.category,
          description: newProject.description,
          technologies: newProject.technologies,
          github_url: newProject.githubUrl || '',
          live_url: newProject.liveUrl || '',
          thumbnail_url: newProject.thumbnailUrl || '',
          screenshots: newProject.screenshots || [],
          status: newProject.status || 'Completed',
          featured: newProject.featured,
          highlights: newProject.highlights,
          gradient: newProject.gradient,
          display_order: newProject.displayOrder,
          is_published: newProject.isPublished
        }]);
      } catch (err) {
        console.error('Failed to insert project in Supabase:', err);
      }
    }
  };

  const updateProject = async (id: string, updated: Partial<Project>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p))
    }));

    if (isConfigured) {
      try {
        const updatePayload: any = { updated_at: new Date().toISOString() };
        if (updated.title !== undefined) updatePayload.title = updated.title;
        if (updated.year !== undefined) updatePayload.year = updated.year;
        if (updated.category !== undefined) updatePayload.category = updated.category;
        if (updated.description !== undefined) updatePayload.description = updated.description;
        if (updated.technologies !== undefined) updatePayload.technologies = updated.technologies;
        if (updated.githubUrl !== undefined) updatePayload.github_url = updated.githubUrl;
        if (updated.liveUrl !== undefined) updatePayload.live_url = updated.liveUrl;
        if (updated.thumbnailUrl !== undefined) updatePayload.thumbnail_url = updated.thumbnailUrl;
        if (updated.screenshots !== undefined) updatePayload.screenshots = updated.screenshots;
        if (updated.status !== undefined) updatePayload.status = updated.status;
        if (updated.featured !== undefined) updatePayload.featured = updated.featured;
        if (updated.highlights !== undefined) updatePayload.highlights = updated.highlights;
        if (updated.gradient !== undefined) updatePayload.gradient = updated.gradient;
        if (updated.displayOrder !== undefined) updatePayload.display_order = updated.displayOrder;
        if (updated.isPublished !== undefined) updatePayload.is_published = updated.isPublished;

        await supabase.from('portfolio_projects').update(updatePayload).eq('id', id);
      } catch (err) {
        console.error('Failed to update project in Supabase:', err);
      }
    }
  };

  const deleteProject = async (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));

    if (isConfigured) {
      try {
        await supabase.from('portfolio_projects').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete project from Supabase:', err);
      }
    }
  };

  const reorderProjects = async (orderedProjects: Project[]) => {
    const updated = orderedProjects.map((p, idx) => ({ ...p, displayOrder: idx + 1 }));
    setData((prev) => ({ ...prev, projects: updated }));

    if (isConfigured) {
      try {
        for (const p of updated) {
          await supabase.from('portfolio_projects').update({ display_order: p.displayOrder }).eq('id', p.id);
        }
      } catch (err) {
        console.error('Failed to reorder projects in Supabase:', err);
      }
    }
  };

  // Certifications CRUD
  const addCertification = async (cert: Omit<Certification, 'id'>) => {
    const id = `cert-${Date.now()}`;
    const newCert: Certification = {
      ...cert,
      id,
      displayOrder: (data.certifications?.length || 0) + 1,
      isVisible: cert.isVisible ?? true
    };

    setData((prev) => ({
      ...prev,
      certifications: [...(prev.certifications || []), newCert]
    }));

    if (isConfigured) {
      try {
        await supabase.from('portfolio_certifications').insert([{
          id,
          title: newCert.title,
          issuer: newCert.issuer,
          issue_date: newCert.issueDate,
          credential_id: newCert.credentialId || '',
          credential_url: newCert.credentialUrl || '',
          badge_url: newCert.badgeUrl || '',
          description: newCert.description || '',
          skills: newCert.skills || [],
          display_order: newCert.displayOrder,
          is_visible: newCert.isVisible
        }]);
      } catch (err) {
        console.error('Failed to insert certification in Supabase:', err);
      }
    }
  };

  const updateCertification = async (id: string, updated: Partial<Certification>) => {
    setData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((c) => (c.id === id ? { ...c, ...updated } : c))
    }));

    if (isConfigured) {
      try {
        const payload: any = {};
        if (updated.title !== undefined) payload.title = updated.title;
        if (updated.issuer !== undefined) payload.issuer = updated.issuer;
        if (updated.issueDate !== undefined) payload.issue_date = updated.issueDate;
        if (updated.credentialId !== undefined) payload.credential_id = updated.credentialId;
        if (updated.credentialUrl !== undefined) payload.credential_url = updated.credentialUrl;
        if (updated.badgeUrl !== undefined) payload.badge_url = updated.badgeUrl;
        if (updated.description !== undefined) payload.description = updated.description;
        if (updated.skills !== undefined) payload.skills = updated.skills;
        if (updated.displayOrder !== undefined) payload.display_order = updated.displayOrder;
        if (updated.isVisible !== undefined) payload.is_visible = updated.isVisible;

        await supabase.from('portfolio_certifications').update(payload).eq('id', id);
      } catch (err) {
        console.error('Failed to update certification in Supabase:', err);
      }
    }
  };

  const deleteCertification = async (id: string) => {
    setData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((c) => c.id !== id)
    }));

    if (isConfigured) {
      try {
        await supabase.from('portfolio_certifications').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete certification from Supabase:', err);
      }
    }
  };

  // Skills
  const updateSkillCategories = async (skillCategories: SkillCategory[]) => {
    setData((prev) => ({ ...prev, skillCategories }));
  };

  const updateMarqueeSkills = async (marqueeSkills: string[]) => {
    setData((prev) => ({ ...prev, marqueeSkills }));
    if (isConfigured) {
      try {
        // Clear and re-insert marquee skills
        await supabase.from('portfolio_marquee_skills').delete().neq('id', 0);
        const rows = marqueeSkills.map((name, idx) => ({ name, display_order: idx + 1 }));
        await supabase.from('portfolio_marquee_skills').insert(rows);
      } catch (err) {
        console.error('Failed to update marquee skills in Supabase:', err);
      }
    }
  };

  // Experience
  const addExperience = async (exp: Omit<Experience, 'id'>) => {
    const id = `exp-${Date.now()}`;
    const newExp: Experience = { ...exp, id, isVisible: exp.isVisible ?? true };
    setData((prev) => ({ ...prev, experience: [newExp, ...prev.experience] }));

    if (isConfigured) {
      try {
        await supabase.from('portfolio_experience').insert([{
          id,
          role: newExp.role,
          company: newExp.company,
          period: newExp.period,
          location: newExp.location,
          responsibilities: newExp.responsibilities,
          tags: newExp.tags,
          display_order: (data.experience.length + 1),
          is_visible: newExp.isVisible
        }]);
      } catch (err) {
        console.error('Failed to add experience in Supabase:', err);
      }
    }
  };

  const updateExperience = async (id: string, updated: Partial<Experience>) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, ...updated } : e))
    }));

    if (isConfigured) {
      try {
        const payload: any = {};
        if (updated.role !== undefined) payload.role = updated.role;
        if (updated.company !== undefined) payload.company = updated.company;
        if (updated.period !== undefined) payload.period = updated.period;
        if (updated.location !== undefined) payload.location = updated.location;
        if (updated.responsibilities !== undefined) payload.responsibilities = updated.responsibilities;
        if (updated.tags !== undefined) payload.tags = updated.tags;
        if (updated.isVisible !== undefined) payload.is_visible = updated.isVisible;

        await supabase.from('portfolio_experience').update(payload).eq('id', id);
      } catch (err) {
        console.error('Failed to update experience in Supabase:', err);
      }
    }
  };

  const deleteExperience = async (id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id)
    }));

    if (isConfigured) {
      try {
        await supabase.from('portfolio_experience').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete experience in Supabase:', err);
      }
    }
  };

  // Education
  const addEducation = async (edu: Omit<Education, 'id'>) => {
    const id = `edu-${Date.now()}`;
    const newEdu: Education = { ...edu, id, isVisible: edu.isVisible ?? true };
    setData((prev) => ({ ...prev, education: [newEdu, ...prev.education] }));

    if (isConfigured) {
      try {
        await supabase.from('portfolio_education').insert([{
          id,
          degree: newEdu.degree,
          institution: newEdu.institution,
          period: newEdu.period,
          location: newEdu.location,
          badge: newEdu.badge,
          description: newEdu.description || '',
          display_order: (data.education.length + 1),
          is_visible: newEdu.isVisible
        }]);
      } catch (err) {
        console.error('Failed to add education in Supabase:', err);
      }
    }
  };

  const updateEducation = async (id: string, updated: Partial<Education>) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...updated } : e))
    }));

    if (isConfigured) {
      try {
        const payload: any = {};
        if (updated.degree !== undefined) payload.degree = updated.degree;
        if (updated.institution !== undefined) payload.institution = updated.institution;
        if (updated.period !== undefined) payload.period = updated.period;
        if (updated.location !== undefined) payload.location = updated.location;
        if (updated.badge !== undefined) payload.badge = updated.badge;
        if (updated.description !== undefined) payload.description = updated.description;
        if (updated.isVisible !== undefined) payload.is_visible = updated.isVisible;

        await supabase.from('portfolio_education').update(payload).eq('id', id);
      } catch (err) {
        console.error('Failed to update education in Supabase:', err);
      }
    }
  };

  const deleteEducation = async (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id)
    }));

    if (isConfigured) {
      try {
        await supabase.from('portfolio_education').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete education in Supabase:', err);
      }
    }
  };

  // Settings
  const updateSettings = async (settings: Partial<SiteSettings>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));

    if (isConfigured) {
      try {
        const payload: any = { updated_at: new Date().toISOString() };
        if (settings.siteTitle) payload.site_title = settings.siteTitle;
        if (settings.metaDescription) payload.meta_description = settings.metaDescription;
        if (settings.logoText) payload.logo_text = settings.logoText;
        if (settings.themeAccent) payload.theme_accent = settings.themeAccent;
        if (settings.sectionsVisibility) payload.sections_visibility = settings.sectionsVisibility;

        await supabase.from('portfolio_site_settings').update(payload).eq('id', 'settings');
      } catch (err) {
        console.error('Failed to update site settings in Supabase:', err);
      }
    }
  };

  const toggleSectionVisibility = async (section: keyof SiteSettings['sectionsVisibility']) => {
    const updated = {
      ...data.settings.sectionsVisibility,
      [section]: !data.settings.sectionsVisibility[section]
    };
    await updateSettings({ sectionsVisibility: updated });
  };

  // Contact Inquiries
  const submitContact = async (inquiry: { name: string; email: string; subject?: string; message: string }) => {
    return await sendContactInquiry(inquiry);
  };

  const markInquiryRead = async (id: string) => {
    setInquiries((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    if (isConfigured) {
      try {
        await supabase.from('portfolio_contact_messages').update({ is_read: true }).eq('id', id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiries((prev) => prev.filter((m) => m.id !== id));
    if (isConfigured) {
      try {
        await supabase.from('portfolio_contact_messages').delete().eq('id', id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Storage
  const uploadFile = async (file: File, bucket: 'portfolio-media' | 'portfolio-documents', prefix = '') => {
    return await uploadPortfolioFile(file, bucket, prefix);
  };

  // GitHub Sync
  const syncFromGitHub = async (repoFullName: string, autoPublish = true): Promise<{ success: boolean; message: string }> => {
    if (!isConfigured) {
      return { success: false, message: 'Supabase not configured.' };
    }

    try {
      // Fetch repo details from GitHub API
      const repoResponse = await fetch(`https://api.github.com/repos/${repoFullName}`, {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'h4mmad07-portfolio-sync'
        }
      });

      if (!repoResponse.ok) {
        return { success: false, message: `Failed to fetch ${repoFullName} from GitHub.` };
      }

      const repo = await repoResponse.json();

      // Fetch languages
      const languagesResponse = await fetch(repo.languages_url, {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'h4mmad07-portfolio-sync'
        }
      });
      const languages = languagesResponse.ok ? await languagesResponse.json() : {};
      const techStack = Object.keys(languages);

      const category = determineCategory(techStack, repo.name, repo.description || '');

      const projectId = `gh-${repo.id}`;

      const projectPayload = {
        id: projectId,
        title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        year: new Date(repo.pushed_at || repo.updated_at).getFullYear().toString(),
        category: category,
        description: repo.description || 'No description provided.',
        technologies: techStack.length > 0 ? techStack : ['GitHub'],
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || '',
        thumbnailUrl: '',
        screenshots: [],
        status: 'Completed' as const,
        featured: false,
        highlights: [
          `Stars: ${repo.stargazers_count}`,
          `Forks: ${repo.forks_count}`,
          `Last updated: ${new Date(repo.pushed_at || repo.updated_at).toLocaleDateString()}`
        ],
        gradient: 'from-cyan-600/30 to-blue-600/20',
        displayOrder: 999,
        isPublished: autoPublish
      };

      // Optimistic update
      setData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => !p.id.startsWith('gh-') || p.id !== projectId)
      }));
      setData((prev) => ({
        ...prev,
        projects: [
          {
            id: projectId,
            ...projectPayload,
            createdAt: new Date().toISOString()
          },
          ...prev.projects.filter((p) => !p.id.startsWith('gh-') || p.id !== projectId)
        ]
      }));

      if (isConfigured) {
        try {
          await supabase.from('portfolio_projects').upsert({
            id: projectId,
            title: projectPayload.title,
            year: projectPayload.year,
            category: projectPayload.category,
            description: projectPayload.description,
            technologies: projectPayload.technologies,
            github_url: projectPayload.githubUrl,
            live_url: projectPayload.liveUrl,
            thumbnail_url: projectPayload.thumbnailUrl,
            screenshots: projectPayload.screenshots,
            status: projectPayload.status,
            featured: projectPayload.featured,
            highlights: projectPayload.highlights,
            gradient: projectPayload.gradient,
            display_order: projectPayload.displayOrder,
            is_published: projectPayload.isPublished,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
        } catch (err) {
          console.error('Failed to sync to Supabase:', err);
          return { success: false, message: 'Synced locally but failed to save to cloud.' };
        }
      }

      return { success: true, message: `Synced ${repoFullName} successfully.` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Sync failed.' };
    }
  };

  // Sync multiple repos
  const syncMultipleRepos = async (repoFullNames: string[], autoPublish = true): Promise<{ success: number; failed: number; messages: string[] }> => {
    let success = 0;
    let failed = 0;
    const messages: string[] = [];

    for (const repo of repoFullNames) {
      const result = await syncFromGitHub(repo, autoPublish);
      if (result.success) {
        success++;
        messages.push(`✓ ${result.message}`);
      } else {
        failed++;
        messages.push(`✗ ${repo}: ${result.message}`);
      }
    }

    return { success, failed, messages };
  };

  // Reset & Backup
  const resetToDefaults = () => {
    setData(initialPortfolioData);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportJSON = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.personal && Array.isArray(parsed.projects)) {
        setData(parsed);
        return true;
      }
    } catch (e) {
      console.error('Import error:', e);
    }
    return false;
  };

  const changePasscode = async (oldPass: string, newPass: string): Promise<boolean> => {
    const isValid = await verifyPasscode(oldPass);
    if (!isValid) throw new Error('Current passcode is incorrect.');
    await updatePasscode(newPass);
    return true;
  };

  const generateTypeScriptCode = (): string => {
    return `export const initialPortfolioData = ${JSON.stringify(data, null, 2)};\n`;
  };

  // Category helper for GitHub sync
  const determineCategory = (techStack: string[], repoName: string, description: string): string => {
    const text = `${techStack.join(' ')} ${repoName} ${description}`.toLowerCase();

    if (text.includes('unity') || text.includes('c#') || text.includes('game')) return 'Game Dev';
    if (text.includes('python') || text.includes('ml') || text.includes('ai') || text.includes('tensorflow') || text.includes('pytorch')) return 'AI & ML';
    if (text.includes('sql') || text.includes('database') || text.includes('postgres') || text.includes('mysql')) return 'Database System';
    if (text.includes('c++') || text.includes('cpp') || text.includes('windows') || text.includes('.net')) return 'Desktop App';
    if (text.includes('react') || text.includes('vue') || text.includes('web') || text.includes('javascript') || text.includes('typescript')) return 'Software Arch';

    return 'Software Arch';
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isCloudSynced,
        isConfigured,
        isAdminOpen,
        setIsAdminOpen,
        isAuthenticated,
        adminUserEmail,
        login,
        logout,
        changePasscode,
        generateTypeScriptCode,
        uploadFile,
        updatePersonal,
        updateStats,
        updateServices,
        addProject,
        updateProject,
        deleteProject,
        reorderProjects,
        addCertification,
        updateCertification,
        deleteCertification,
        updateSkillCategories,
        updateMarqueeSkills,
        addExperience,
        updateExperience,
        deleteExperience,
        addEducation,
        updateEducation,
        deleteEducation,
        updateSettings,
        toggleSectionVisibility,
        inquiries,
        refreshInquiries,
        markInquiryRead,
        deleteInquiry,
        submitContact,
        resetToDefaults,
        exportJSON,
        importJSON,
        syncFromGitHub,
        syncMultipleRepos,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
