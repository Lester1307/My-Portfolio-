import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Admin from './components/Admin';
import { Project, Skill } from './types';
import { ChevronUp, Github, Heart, Linkedin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'admin'>('portfolio');
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'default-sports-club',
      title: 'Sports Club Management',
      description: 'A beautifully designed booking and scheduling workspace for tennis, swimming, and athletics clubs. Features dynamic member profiles, interactive court reservations with real-time slot conflict resolution, multi-tier automated dues, and clean tournament bracket visualizations.',
      category: 'Full-Stack',
      technologies: ['React', 'Node.js', 'Express', 'Firebase Firestore', 'Tailwind CSS', 'Motion'],
      imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&auto=format&fit=crop&q=60',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      featured: true,
      order: 1
    },
    {
      id: 'default-cinemax',
      title: 'Cinemax',
      description: 'A dark, highly immersive cinematic directory designed for dedicated movie buffs. Integrates full TMDB multi-threaded API endpoints, customizable personal movie lounges, hyper-fluid custom slider carousels, and an elegant micro-blogging review layer.',
      category: 'Frontend',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'TMDB API'],
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=60',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      featured: true,
      order: 2
    },
    {
      id: 'default-freshwalls',
      title: 'Freshwalls',
      description: 'A pristine, minimalist wall-art and mobile background collection showcasing professional aesthetic landscape photography. Features a tailored image-palette hex color extractor, an organic masonry layout, and smooth custom slide-up image drawers.',
      category: 'UI / Design',
      technologies: ['React', 'Vite', 'Tailwind CSS', 'Palette Extractor', 'Motion'],
      imageUrl: 'https://images.unsplash.com/photo-1500462969772-60dc59ffd11a?w=800&auto=format&fit=crop&q=60',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      featured: true,
      order: 3
    }
  ]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch portfolio data from database via server APIs
  const fetchData = async () => {
    try {
      setLoadingProjects(true);
      const projRes = await fetch('/api/projects');
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData);
      }
    } catch (e) {
      console.error('Error fetching projects:', e);
    } finally {
      setLoadingProjects(false);
    }

    try {
      setLoadingSkills(true);
      const skillRes = await fetch('/api/skills');
      if (skillRes.ok) {
        const skillData = await skillRes.json();
        setSkills(skillData);
      }
    } catch (e) {
      console.error('Error fetching skills:', e);
    } finally {
      setLoadingSkills(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Scroll top visibility
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // offset for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-blue-100 selection:text-blue-700 relative overflow-hidden">
      {/* Absolute Decorative Watermark Backdrops */}
      <div className="absolute -top-40 -left-40 text-[500px] md:text-[600px] font-sans font-bold text-slate-900/[0.01] leading-none pointer-events-none select-none z-0">
        D
      </div>
      <div className="absolute -bottom-40 -right-40 text-[400px] md:text-[500px] font-sans font-bold text-slate-900/[0.012] leading-none pointer-events-none select-none z-0">
        P
      </div>

      <div className="w-full relative z-10">
        {/* Sticky Header */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          scrollToSection={scrollToSection} 
        />

        {/* Core content with fade animations */}
        <main className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'portfolio' ? (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Hero scrollToSection={scrollToSection} />
                
                <Projects 
                  projects={projects} 
                  isLoading={loadingProjects} 
                />
                
                <Skills 
                  skills={skills} 
                  isLoading={loadingSkills} 
                />
                
                <Contact />
              </motion.div>
            ) : (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Admin 
                  projects={projects} 
                  skills={skills} 
                  fetchData={fetchData} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-12 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center md:flex md:items-center md:justify-between md:text-left space-y-6 md:space-y-0">
          <div className="space-y-1.5">
            <span className="font-sans font-bold text-xl text-slate-900 block">Dhruvesh Patel</span>
            <p className="text-xs text-slate-500 max-w-sm font-normal">
              Designing modular full-stack web applications and interactive architectures with precision and standards.
            </p>
          </div>

          {/* Social Profiles */}
          <div className="flex justify-center md:justify-end space-x-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-blue-600 transition-colors"
              title="GitHub"
            >
              <div className="w-6 h-[1px] bg-slate-200 group-hover:bg-blue-600 transition-all group-hover:w-8"></div>
              <span>GitHub</span>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-blue-600 transition-colors"
              title="LinkedIn"
            >
              <div className="w-6 h-[1px] bg-slate-200 group-hover:bg-blue-600 transition-all group-hover:w-8"></div>
              <span>LinkedIn</span>
            </a>
            <a 
              href="mailto:dhruveshpatel2003@gmail.com" 
              className="group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-blue-600 transition-colors"
              title="Email"
            >
              <div className="w-6 h-[1px] bg-slate-200 group-hover:bg-blue-600 transition-all group-hover:w-8"></div>
              <span>Email</span>
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            <span>&copy; {new Date().getFullYear()} Dhruvesh Patel. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleScrollToTop}
            className="fixed bottom-6 right-6 z-40 p-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-500 hover:text-blue-600 border border-slate-200 shadow-md cursor-pointer transition-all"
            title="Scroll to Top"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
