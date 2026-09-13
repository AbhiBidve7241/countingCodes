import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🧠',
    title: 'SM-2 Spaced Repetition',
    desc: 'Algorithmic review scheduling adapts to your memory decay curve, ensuring maximum retention with minimum study time.',
    color: 'indigo',
  },
  {
    icon: '🎯',
    title: 'Interview-Mode Questions',
    desc: 'CS-focused question bank covering Java, Spring Boot, SQL, System Design, and algorithms — curated for interview prep.',
    color: 'purple',
  },
  {
    icon: '⚡',
    title: 'XP & Gamification',
    desc: 'Level up, earn achievement badges, maintain daily streaks, and climb the mastery ladder as you learn.',
    color: 'amber',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Evaluation',
    desc: 'Descriptive and case-study answers are evaluated by Groq LLM with actionable architectural feedback.',
    color: 'emerald',
  },
  {
    icon: '📊',
    title: 'Progress Analytics',
    desc: 'Detailed telemetry on topic mastery, accuracy trends, weak areas, and due-review forecasts.',
    color: 'cyan',
  },
  {
    icon: '★',
    title: 'Smart Bookmarks',
    desc: 'Bookmark challenging questions during quizzes and revisit them in focused revision sessions.',
    color: 'rose',
  },
];

const STATS = [
  { value: '10+', label: 'Question Types' },
  { value: '2', label: 'Course Tracks' },
  { value: 'SM-2', label: 'Algorithm' },
  { value: 'AI', label: 'Evaluation' },
];

const colorMap = {
  indigo: { bg: 'bg-indigo-500/15', border: 'border-indigo-500/30', text: 'text-indigo-300' },
  purple: { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-300' },
  amber:  { bg: 'bg-amber-500/15',  border: 'border-amber-500/30',  text: 'text-amber-300' },
  emerald:{ bg: 'bg-emerald-500/15',border: 'border-emerald-500/30',text: 'text-emerald-300'},
  cyan:   { bg: 'bg-cyan-500/15',   border: 'border-cyan-500/30',   text: 'text-cyan-300' },
  rose:   { bg: 'bg-rose-500/15',   border: 'border-rose-500/30',   text: 'text-rose-300' },
};

export const HomePage = () => {
  return (
    <div className="relative overflow-hidden">

      {/* ── Hero Section ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 text-center py-24">
        {/* Background ambient orbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-fuchsia-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in-up">

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/12 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-semibold tracking-wider uppercase shadow-lg">
            <span className="pulse-dot" />
            SM-2 Spaced Repetition + AI Evaluation
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-tight">
            <span className="text-white">Master CS Engineering</span>
            <br />
            <span className="gradient-text-brand">One Quiz at a Time</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Gamified active revision with adaptive spaced repetition, AI-powered answer evaluation,
            and a curated Java · Spring Boot · SQL question bank built for technical interviews.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="group px-8 py-3.5 rounded-xl text-base font-display font-bold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                Start for Free →
              </span>
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl text-base font-semibold text-slate-300 border border-white/10 bg-slate-900/60 hover:bg-slate-800/70 hover:border-white/20 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>

          {/* Floating stats row */}
          <div className="flex items-center justify-center gap-6 pt-6 flex-wrap">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-display font-extrabold gradient-text-brand">{s.value}</div>
                <div className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-500 animate-bounce">
          <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
          <span className="text-lg">↓</span>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="page-container py-20">
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-white/8 text-slate-400 text-[11px] font-mono uppercase tracking-wider">
            Why LearnForge
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Everything you need to <span className="gradient-text-brand">crack the interview</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Built by engineers, for engineers. No fluff — just focused, adaptive learning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const c = colorMap[f.color];
            return (
              <div
                key={f.title}
                className={`glass-card glass-card-hover rounded-2xl p-6 space-y-4 animate-fade-in-up`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center text-2xl`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className={`text-base font-display font-bold text-white mb-1.5`}>{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Course Preview ── */}
      <section className="page-container py-16">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-950/80 to-slate-950 relative overflow-hidden">
          {/* BG decoration */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono uppercase tracking-wider">
                📚 Available Now
              </div>
              <h2 className="text-3xl font-display font-extrabold text-white">
                2 Engineering Tracks Ready
              </h2>
              <div className="space-y-3">
                {[
                  { icon: '☕', name: 'Core Java', desc: 'OOP, Collections, Streams, Concurrency, Generics' },
                  { icon: '🗄️', name: 'SQL & Relational Databases', desc: 'Joins, Indexes, Transactions, Normalization, ACID' },
                ].map((course) => (
                  <div key={course.name} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/20 transition-colors">
                    <span className="text-2xl">{course.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{course.name}</div>
                      <div className="text-xs text-slate-400">{course.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 border border-indigo-500/30 flex items-center justify-center text-6xl float-anim">
                ⚡
              </div>
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl text-sm font-display font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
              >
                Start Learning Free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="page-container py-20 text-center">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Ready to level up your <span className="gradient-text-gold">interview game?</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Join and start mastering CS fundamentals with LearnForge's adaptive learning engine. Free to start.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-display font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
          >
            🚀 Create Free Account
          </Link>
        </div>
      </section>

    </div>
  );
};
