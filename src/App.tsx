import React, { useState } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { CustomCursor } from './components/ui/CustomCursor';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { WhatIDo } from './components/WhatIDo';
import { TechStack } from './components/TechStack';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ResumeModal } from './components/ResumeModal';

export const AppContent: React.FC = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      <CustomCursor />
      <ParticleBackground />
      <Navbar onOpenResume={() => setIsResumeOpen(true)} />

      <main className="relative z-10 flex-grow">
        <Hero onOpenResume={() => setIsResumeOpen(true)} />
        <About />
        <WhatIDo />
        <TechStack />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer onOpenResume={() => setIsResumeOpen(true)} />

      {/* Resume ATS & PDF Export Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />

      {/* Admin Protected Modals */}
      <AdminAuthModal />
      <AdminDashboard />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
};

export default App;
