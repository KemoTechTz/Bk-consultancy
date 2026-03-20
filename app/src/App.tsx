import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import WhyChooseUs from './sections/WhyChooseUs';
import Projects from './sections/Projects';
import Testimonials from './sections/Testimonials';
import Blog from './sections/Blog';
import CTA from './sections/CTA';
import Footer from './sections/Footer';
import ClientPortal from './sections/portal/ClientPortal';
import AIReportGenerator from './sections/portal/AIReportGenerator';
import ComplianceTracker from './sections/portal/ComplianceTracker';
import AirQualityDashboard from './sections/portal/AirQualityDashboard';
import AdminDashboard from './sections/portal/AdminDashboard';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'home' | 'portal' | 'ai-report' | 'compliance' | 'air-quality' | 'admin'>('home');

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();
    }, mainRef);

    return () => ctx.revert();
  }, []);

  // Check URL hash for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      switch (hash) {
        case 'portal':
          setCurrentView('portal');
          break;
        case 'ai-report':
          setCurrentView('ai-report');
          break;
        case 'compliance':
          setCurrentView('compliance');
          break;
        case 'air-quality':
          setCurrentView('air-quality');
          break;
        case 'admin':
          setCurrentView('admin');
          break;
        default:
          setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'portal':
        return <ClientPortal />;
      case 'ai-report':
        return <AIReportGenerator />;
      case 'compliance':
        return <ComplianceTracker />;
      case 'air-quality':
        return <AirQualityDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <>
            <Navbar />
            <main>
              <Hero />
              <About />
              <Services />
              <WhyChooseUs />
              <Projects />
              <Testimonials />
              <Blog />
              <CTA />
            </main>
            <Footer />
          </>
        );
    }
  };

  return (
    <div ref={mainRef} className="relative min-h-screen bg-[#0a1f12]">
      {/* Noise overlay for texture - only on home page */}
      {currentView === 'home' && <div className="noise-overlay" />}
      
      {renderContent()}
    </div>
  );
}

export default App;
