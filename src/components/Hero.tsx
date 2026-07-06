import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Code, Database, Server, ExternalLink, GraduationCap } from 'lucide-react';

interface HeroProps {
  scrollToSection: (id: string) => void;
}

export default function Hero({ scrollToSection }: HeroProps) {
  return (
    <section id="hero" className="relative overflow-hidden bg-white py-16 sm:py-24 border-b border-slate-200">
      {/* Soft background warm gradient circles */}
      <div className="absolute top-10 left-10 h-[250px] w-[250px] rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-[300px] w-[300px] rounded-full bg-indigo-50/50 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          {/* Hero text content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full w-fit bg-slate-50"
            >
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-600 font-mono">
                Web Development Internship Project
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-6xl font-sans font-bold leading-tight text-slate-950 tracking-tight">
                Dhruvesh Patel
              </h1>
              <p className="text-lg font-medium text-blue-600">
                Full-Stack Developer Intern
              </p>
              <p className="max-w-xl text-base text-slate-600 leading-relaxed font-sans">
                Welcome to my personal project hub! I build responsive, hand-crafted web applications combining modern frontend frameworks like <strong className="text-slate-900 font-medium">React.js (HTML & CSS/Tailwind)</strong> with reliable <strong className="text-slate-900 font-medium">Node.js / Express</strong> backends. I design clean database schemas with <strong className="text-slate-900 font-medium">PostgreSQL, MySQL, and MongoDB</strong>, and deploy my projects on reliable hosting environments like <strong className="text-slate-900 font-medium">Vercel, Heroku, and Netlify</strong>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button
                onClick={() => scrollToSection('projects')}
                className="group flex items-center space-x-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-sans font-semibold text-white shadow-sm transition-all duration-200 cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="group flex items-center space-x-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-sans font-semibold text-slate-700 shadow-xs transition-all duration-200 cursor-pointer"
              >
                <span>Contact Details</span>
              </button>
            </motion.div>

            {/* Core Tech Stack Icons / Labels */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 max-w-lg"
            >
              <div>
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-sm">
                  <Code className="h-4 w-4 text-blue-600" />
                  <span>Frontend</span>
                </div>
                <span className="block text-xs text-slate-500 mt-1">HTML, CSS, JS, React.js</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-sm">
                  <Server className="h-4 w-4 text-indigo-600" />
                  <span>Backend</span>
                </div>
                <span className="block text-xs text-slate-500 mt-1">Node.js / Express</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-sm">
                  <Database className="h-4 w-4 text-emerald-600" />
                  <span>Databases</span>
                </div>
                <span className="block text-xs text-slate-500 mt-1">MySQL, Postgres, MongoDB</span>
              </div>
            </motion.div>
          </div>

          {/* Graphic / Visual Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 h-20 w-20 bg-blue-100/50 rounded-full blur-2xl -mr-5 -mt-5" />
              
              <h3 className="font-sans font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                Internship Project Frameworks
              </h3>

              <div className="space-y-4">
                {/* Tech Bar 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-medium text-slate-700">
                    <span>Frontend (HTML/CSS/React)</span>
                    <span>Highly Proficient</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>

                {/* Tech Bar 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-medium text-slate-700">
                    <span>Backend (Node.js/Express)</span>
                    <span>Proficient</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                {/* Tech Bar 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-medium text-slate-700">
                    <span>Database (MySQL/MongoDB/Postgres)</span>
                    <span>Solid Understanding</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                {/* Tech Bar 4 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-medium text-slate-700">
                    <span>Deployment (Vercel/Heroku/Netlify)</span>
                    <span>Configured</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1 text-slate-700">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Active Internship Hub
                </span>
                <span className="text-slate-400">Ver 1.1.0</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
