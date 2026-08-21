import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PortfolioSchema, 
  initialPortfolioData, 
  Project, 
  Experience, 
  Education, 
  PersonalInfo, 
  SkillCategory,
  Service,
  StatItem
} from '../data/portfolioData';
import { 
  verifyPasscode, 
  updatePasscode, 
  isSessionAuthenticated, 
  setSessionAuthenticated,
  generateSecureRecoveryOTP,
  verifySecureRecoveryOTP,
  dispatchOTPEmail,
  STRICT_OWNER_EMAIL
} from '../utils/security';

interface PortfolioContextType {
  data: PortfolioSchema;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  login: (passcode: string) => Promise<boolean>;
  logout: () => void;
  changePasscode: (oldPass: string, newPass: string) => Promise<boolean>;
  
  // High-Security Recovery
  requestEmailVerificationCode: () => Promise<{ success: boolean }>;
  resetPasscodeWithOTP: (code: string, newPasscode: string) => Promise<boolean>;
  ownerEmail: string;

  // Data Mutators
  updatePersonal: (info: Partial<PersonalInfo>) => void;
  updateStats: (stats: StatItem[]) => void;
  updateServices: (services: Service[]) => void;
  
  // Projects
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Skills
  updateSkillCategories: (categories: SkillCategory[]) => void;
  updateMarqueeSkills: (skills: string[]) => void;
  
  // Experience & Education
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;

  // Sync & Export
  resetToDefaults: () => void;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;
  generateTypeScriptCode: () => string;
}

const STORAGE_KEY = 'portfolio_custom_data_v1';

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioSchema>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved portfolio data:', e);
    }
    return initialPortfolioData;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isSessionAuthenticated());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving portfolio data to localStorage:', e);
    }
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const login = async (passcode: string): Promise<boolean> => {
    const isValid = await verifyPasscode(passcode);
    if (isValid) {
      setIsAuthenticated(true);
      setSessionAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setSessionAuthenticated(false);
    setIsAdminOpen(false);
  };

  const changePasscode = async (oldPass: string, newPass: string): Promise<boolean> => {
    const isValid = await verifyPasscode(oldPass);
    if (!isValid) {
      throw new Error('Current passcode is incorrect.');
    }
    await updatePasscode(newPass);
    return true;
  };

  // High-Security Email Passcode Recovery
  const requestEmailVerificationCode = async (): Promise<{ success: boolean }> => {
    const { code } = await generateSecureRecoveryOTP(STRICT_OWNER_EMAIL);
    await dispatchOTPEmail(code);
    return { success: true };
  };

  const resetPasscodeWithOTP = async (code: string, newPasscode: string): Promise<boolean> => {
    await verifySecureRecoveryOTP(code);
    await updatePasscode(newPasscode);
    setIsAuthenticated(true);
    setSessionAuthenticated(true);
    return true;
  };

  // Mutators
  const updatePersonal = (info: Partial<PersonalInfo>) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...info }
    }));
  };

  const updateStats = (stats: StatItem[]) => {
    setData((prev) => ({ ...prev, stats }));
  };

  const updateServices = (services: Service[]) => {
    setData((prev) => ({ ...prev, services }));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`
    };
    setData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }));
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p))
    }));
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  const updateSkillCategories = (skillCategories: SkillCategory[]) => {
    setData((prev) => ({ ...prev, skillCategories }));
  };

  const updateMarqueeSkills = (marqueeSkills: string[]) => {
    setData((prev) => ({ ...prev, marqueeSkills }));
  };

  const addExperience = (exp: Omit<Experience, 'id'>) => {
    const newExp: Experience = { ...exp, id: `exp-${Date.now()}` };
    setData((prev) => ({
      ...prev,
      experience: [newExp, ...prev.experience]
    }));
  };

  const updateExperience = (id: string, updated: Partial<Experience>) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, ...updated } : e))
    }));
  };

  const deleteExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id)
    }));
  };

  const addEducation = (edu: Omit<Education, 'id'>) => {
    const newEdu: Education = { ...edu, id: `edu-${Date.now()}` };
    setData((prev) => ({
      ...prev,
      education: [newEdu, ...prev.education]
    }));
  };

  const updateEducation = (id: string, updated: Partial<Education>) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...updated } : e))
    }));
  };

  const deleteEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id)
    }));
  };

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

  const generateTypeScriptCode = (): string => {
    return `export const initialPortfolioData = ${JSON.stringify(data, null, 2)};\n`;
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isAdminOpen,
        setIsAdminOpen,
        isAuthenticated,
        login,
        logout,
        changePasscode,
        requestEmailVerificationCode,
        resetPasscodeWithOTP,
        ownerEmail: STRICT_OWNER_EMAIL,
        updatePersonal,
        updateStats,
        updateServices,
        addProject,
        updateProject,
        deleteProject,
        updateSkillCategories,
        updateMarqueeSkills,
        addExperience,
        updateExperience,
        deleteExperience,
        addEducation,
        updateEducation,
        deleteEducation,
        resetToDefaults,
        exportJSON,
        importJSON,
        generateTypeScriptCode,
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
