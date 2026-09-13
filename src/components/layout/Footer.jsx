import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 py-8 mt-auto relative z-10 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-slate-400">LearnForge</span>
          <span>•</span>
          <span>Production-Ready Gamified Learning & Revision Engine</span>
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <span className="hover:text-indigo-400 transition-colors cursor-pointer">Core Java</span>
          <span className="hover:text-indigo-400 transition-colors cursor-pointer">Spring Boot</span>
          <span className="hover:text-indigo-400 transition-colors cursor-pointer">SQL</span>
          <span className="hover:text-indigo-400 transition-colors cursor-pointer">SM-2 Spaced Repetition</span>
        </div>
      </div>
    </footer>
  );
};
