import React from 'react';
import { Briefcase, Code, Mail, ShieldAlert, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'portfolio' | 'admin';
  setActiveTab: (tab: 'portfolio' | 'admin') => void;
  scrollToSection: (id: string) => void;
}

export default function Header({ activeTab, setActiveTab, scrollToSection }: HeaderProps) {
  const navItems = [
    { id: 'hero', label: 'About', icon: Sparkles },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab('portfolio');
    setTimeout(() => {
      scrollToSection(id);
    }, 50);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Initials */}
        <button 
          onClick={() => handleNavClick('hero')}
          className="flex items-center space-x-3 text-left group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 group-hover:border-accent/50 group-hover:bg-slate-100 transition-all duration-300">
            <span className="font-sans font-bold text-base text-slate-800 group-hover:text-accent transition-colors">DP</span>
          </div>
          <div>
            <span className="block font-sans font-semibold text-slate-800 group-hover:text-accent transition-colors duration-200">
              Dhruvesh Patel
            </span>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 leading-none">
              Web Developer Intern
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {activeTab === 'portfolio' && navItems.map((item) => {
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex items-center space-x-1.5 rounded-lg px-3.5 py-1.5 text-xs uppercase tracking-widest font-mono font-medium text-slate-600 hover:text-accent hover:bg-slate-50 transition-all duration-200"
              >
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>

          <button
            onClick={() => setActiveTab(activeTab === 'admin' ? 'portfolio' : 'admin')}
            className={`flex items-center space-x-1.5 rounded-lg px-4 py-1.5 text-xs uppercase tracking-widest font-mono font-semibold border transition-all duration-200 ${
              activeTab === 'admin'
                ? 'bg-accent text-white border-accent'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-accent hover:text-accent hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{activeTab === 'admin' ? 'Exit Admin' : 'Admin Area'}</span>
          </button>
        </nav>

        {/* Mobile Navigation Buttons */}
        <div className="flex md:hidden items-center space-x-2">
          {activeTab === 'portfolio' && (
            <div className="flex space-x-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="p-2 text-slate-500 hover:text-accent rounded-lg hover:bg-slate-100"
                    title={item.label}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setActiveTab(activeTab === 'admin' ? 'portfolio' : 'admin')}
            className={`p-2 border rounded-lg ${
              activeTab === 'admin'
                ? 'bg-accent/10 text-accent border-accent/20'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
            }`}
            title="Admin Dashboard"
          >
            <ShieldAlert className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
