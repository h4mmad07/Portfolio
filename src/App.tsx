import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { CustomCursor } from './components/ui/CustomCursor';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { WhatIDo } from './components/WhatIDo';
import { TechStack } from './components/TechStack';
import { Projects } from './components/Projects';
import { Certifications } from './components/Certifications';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';

// Router wrapper that consumes PortfolioContext (must be outside the provider)
const AppRouter: React.FC = () => {
  const { isAuthenticated } = usePortfolio();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPortfolio />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export const PublicPortfolio: React.FC = () => {
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
        <Certifications />
        <Experience />
        <Contact />
      </main>

      <Footer onOpenResume={() => setIsResumeOpen(true)} />

      {/* Resume ATS & PDF Export Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <AppRouter />
    </PortfolioProvider>
  );
};

export default App;
