import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
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
const ResumeModal = lazy(() => import('./components/ResumeModal').then((module) => ({ default: module.ResumeModal })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then((module) => ({ default: module.AdminLayout })));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin').then((module) => ({ default: module.AdminLogin })));

// Router wrapper that consumes PortfolioContext (must be outside the provider)
const AppRouter: React.FC = () => {
  const { isAuthenticated } = usePortfolio();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPortfolio />} />
        <Route path="/admin/login" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><AdminLogin /></Suspense>} />
        <Route
          path="/admin"
          element={
            isAuthenticated ? <Suspense fallback={<div className="min-h-screen bg-background" />}><AdminLayout /></Suspense> : <Navigate to="/admin/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export const PublicPortfolio: React.FC = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { data } = usePortfolio();

  useEffect(() => {
    const title = data.settings?.siteTitle || `${data.personal.fullName} | Portfolio`;
    const description = data.settings?.metaDescription || data.personal.summary;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
  }, [data.settings?.siteTitle, data.settings?.metaDescription, data.personal.fullName, data.personal.summary]);

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
      {isResumeOpen && <Suspense fallback={null}><ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} /></Suspense>}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <PortfolioProvider>
        <AppRouter />
      </PortfolioProvider>
    </MotionConfig>
  );
};

export default App;
