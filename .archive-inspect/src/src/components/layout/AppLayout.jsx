import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { AnimatedBackground } from './AnimatedBackground';

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 relative selection:bg-indigo-500/30 selection:text-indigo-200">
      <AnimatedBackground />
      <NavBar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
