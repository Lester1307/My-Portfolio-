import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Code2, Database, Layout, Settings } from 'lucide-react';
import { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
  isLoading: boolean;
}

export default function Skills({ skills, isLoading }: SkillsProps) {
  // Group skills by category
  const groupedSkills = useMemo(() => {
    const groups: { [key: string]: Skill[] } = {
      'Frontend': [],
      'Backend': [],
      'Tools': []
    };

    skills.forEach(skill => {
      const cat = skill.category || 'Tools';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(skill);
    });

    // Remove empty groups if any
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0 && key !== 'Frontend' && key !== 'Backend' && key !== 'Tools') {
        delete groups[key];
      }
    });

    return groups;
  }, [skills]);

  return (
    <section id="skills" className="bg-white py-16 sm:py-24 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center md:text-left mb-12 space-y-2">
          <h2 className="font-sans font-bold text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Skills &amp; Technologies
          </h2>
          <p className="max-w-2xl text-sm text-slate-500 leading-relaxed font-normal">
            A structured breakdown of my technical stack and competency levels across frontend, backend, and build tools.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">Retrieving technical data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
            {Object.entries(groupedSkills).map(([category, rawItems]) => {
              const items = rawItems as Skill[];
              return (
                <div 
                  key={category}
                  className="border-l-2 border-slate-200 pl-6 space-y-6 flex flex-col justify-start"
                >
                  {/* Category Header */}
                  <div>
                    <h3 className="font-sans font-bold text-xl text-slate-900">{category}</h3>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mt-1">
                      {items.length} Technologies
                    </span>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-5 flex-1">
                    {items.length === 0 ? (
                      <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">No skills listed yet.</p>
                    ) : (
                      items.map((skill) => (
                        <div key={skill.id} className="group space-y-1.5">
                          <div className="flex items-baseline justify-between">
                            <span className="font-sans font-medium text-sm text-slate-700 group-hover:text-blue-600 transition-colors duration-150">
                              {skill.name}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400 group-hover:text-blue-600 transition-colors duration-150">
                              {skill.level}%
                            </span>
                          </div>
                          
                          {/* Elegant Progress Track */}
                          <div className="h-1.5 w-full bg-slate-100 rounded-full relative overflow-hidden mt-1 shadow-inner">
                            <motion.div
                              initial={{ left: '-100%' }}
                              whileInView={{ left: `${skill.level - 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="absolute inset-0 bg-blue-600 rounded-full"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
