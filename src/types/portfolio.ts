export interface Project {
  id: string;
  title: string;
  year: string;
  category: 'Game Dev' | 'Desktop App' | 'AI & ML' | 'Database System' | 'Software Arch' | string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnailUrl?: string;
  screenshots?: string[];
  status?: 'Completed' | 'In Progress' | 'Production' | 'Prototype';
  featured: boolean;
  highlights: string[];
  gradient: string;
  displayOrder?: number;
  isPublished?: boolean;
  createdAt?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location: string;
  description?: string;
  badge: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
  tags: string[];
  displayOrder?: number;
  isVisible?: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
  description?: string;
  skills: string[];
  displayOrder?: number;
  isVisible?: boolean;
}

export interface SkillItem {
  id?: string;
  name: string;
  level: number;
  icon: string;
  displayOrder?: number;
}

export interface SkillCategory {
  id?: string;
  title: string;
  skills: SkillItem[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  gradient: string;
  borderColor: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface PersonalInfo {
  fullName: string;
  firstName: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  address: string;
  timeZone: string;
  avatarImg: string;
  avatarDigitalImg: string;
  profilePhoto: string;
  resumeUrl?: string;
  availability: string;
  summary: string;
}

export type PortfolioProfile = PersonalInfo;

export interface StatItem {
  label: string;
  value: string;
  suffix: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  label: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SectionsVisibility {
  hero: boolean;
  about: boolean;
  services: boolean;
  skills: boolean;
  projects: boolean;
  certifications: boolean;
  experience: boolean;
  contact: boolean;
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  logoText: string;
  themeAccent: string;
  sectionsVisibility: SectionsVisibility;
}

export interface PortfolioSchema {
  personal: PersonalInfo;
  stats: StatItem[];
  services: Service[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  skillCategories: SkillCategory[];
  marqueeSkills: string[];
  socialLinks: SocialLink[];
  settings: SiteSettings;
}
