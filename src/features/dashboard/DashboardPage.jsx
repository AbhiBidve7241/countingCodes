import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuizStore } from '../../store/quizStore';
import { courseApi, progressApi, revisionApi } from '../../api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { XpBar } from '../../components/gamification/XpBar';
import { StreakWidget } from '../../components/gamification/StreakWidget';

const STAT_DEFS = [
  {
    key: 'accuracy',
    label: 'Accuracy',
    icon: '🎯',
    color: 'indigo',
    getValue: (s) => `${s?.accuracyPct || 0}%`,
    getSub: (s) => `${s?.correctAnswered || 0} of ${s?.totalAnswered || 0} correct`,
  },
  {
    key: 'badges',
    label: 'Badges',
    icon: '🏆',
    color: 'purple',
    getValue: (s) => s?.badgeCount || 0,
    getSub: () => 'Earned achievements',
    link: '/progress',
  },
  {
    key: 'reviews',
    label: 'Due Reviews',
    icon: '📚',
    color: 'emerald',
    getValue: (s) => s?.dueReviewsCount || 0,
    getSub: () => 'Ready to practice',
    link: '/revision',
  },
];

const COURSE_ICONS = {
  'java': '☕',
  'spring': '🍃',
  'sql': '🗄️',
  'db': '🗄️',
  'web': '🌐',
  'default': '💻',
};

function getCourseIcon(slug = '') {
  for (const [key, icon] of Object.entries(COURSE_ICONS)) {
    if (slug.toLowerCase().includes(key)) return icon;
  }
  return COURSE_ICONS.default;
}

const colorMap = {
  indigo: { bg: 'bg-indigo-500/12', border: 'border-indigo-500/20', text: 'text-indigo-300', glow: 'shadow-indigo-500/10' },
  purple: { bg: 'bg-purple-500/12', border: 'border-purple-500/20', text: 'text-purple-300', glow: 'shadow-purple-500/10' },
  emerald: { bg: 'bg-emerald-500/12', border: 'border-emerald-500/20', text: 'text-emerald-300', glow: 'shadow-emerald-500/10' },
};

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { initSession } = useQuizStore();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStartingSmart, setIsStartingSmart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, statsRes] = await Promise.all([
          courseApi.getAllCourses().catch(() => ({ data: [] })),
          progressApi.getDashboardStats().catch(() => ({ data: {} })),
        ]);
        setCourses(coursesRes.data || []);
        setDashboardStats(statsRes.data || {});
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartSmartRevision = async () => {
    setIsStartingSmart(true);
    try {
      const res = await revisionApi.startSmartRevision(10);
      initSession(res.data);
      navigate('/quiz');
    } catch (e) {
      console.error('Smart revision launch failed:', e);
      if (courses.length > 0) {
        navigate(`/courses/${courses[0].slug}`);
      }
    } finally {
      setIsStartingSmart(false);
    }
  };

  return (
    <div className="page-container py-8 space-y-8">

      {/* ── Hero Welcome Banner ── */}
      <div className="relative glass-card rounded-3xl p-8 sm:p-10 border border-indigo-500/25 overflow-hidden animate-fade-in-up">
        {/* BG Decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/50 via-transparent to-fuchsia-950/20 pointer-events-none" />
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/12 border border-indigo-500/25 text-indigo-300 text-[11px] font-mono font-semibold uppercase tracking-wider">
              <span className="pulse-dot" />
              ACTIVE REVISION ENGINE
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Ready to code,{' '}
              <span className="gradient-text-brand">
                {user?.displayName || user?.username || 'Engineer'}
              </span>?
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Target weak concepts with SM-2 spaced repetition and earn XP with every correct answer.
              {dashboardStats?.dueReviewsCount > 0 && (
                <span className="ml-1 text-emerald-400 font-medium">
                  {dashboardStats.dueReviewsCount} reviews due now!
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartSmartRevision}
              isLoading={isStartingSmart}
              className="shadow-xl shadow-indigo-500/25 font-display"
              icon={<span>🎯</span>}
            >
              Start Smart Revision
            </Button>
            <Link to="/courses">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Gamification Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up animate-delay-100">

        {/* Streak Widget */}
        <StreakWidget
          currentStreak={dashboardStats?.currentStreak || 0}
          longestStreak={dashboardStats?.longestStreak || 0}
        />

        {/* Dynamic Stat Cards */}
        {STAT_DEFS.map((stat) => {
          const c = colorMap[stat.color];
          const content = (
            <div className={`glass-card rounded-2xl p-5 border ${c.border} flex items-center justify-between shadow-lg ${c.glow} transition-all hover:shadow-xl hover:-translate-y-0.5`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center text-xl`}>
                  {stat.icon}
                </div>
                <div>
                  <div className={`text-[11px] font-mono uppercase tracking-wider ${c.text} font-semibold`}>
                    {stat.label}
                  </div>
                  <div className="text-2xl font-display font-extrabold text-white">
                    {loading ? <span className="skeleton w-12 h-6 inline-block" /> : stat.getValue(dashboardStats)}
                  </div>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-500 font-mono">
                {stat.link && <div className={`${c.text} font-semibold text-xs`}>View →</div>}
                <div className="mt-0.5">{stat.getSub(dashboardStats)}</div>
              </div>
            </div>
          );
          return stat.link ? (
            <Link key={stat.key} to={stat.link}>{content}</Link>
          ) : (
            <div key={stat.key}>{content}</div>
          );
        })}
      </div>

      {/* ── XP Progression Bar ── */}
      <div className="animate-fade-in-up animate-delay-200">
        <XpBar
          xp={user?.xp ?? dashboardStats?.xp ?? 0}
          level={user?.level ?? dashboardStats?.level ?? 1}
          xpToNext={dashboardStats?.xpToNextLevel ?? 200}
        />
      </div>

      {/* ── Course Tracks ── */}
      <div className="space-y-5 animate-fade-in-up animate-delay-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-white">Course Tracks</h2>
            <p className="text-xs text-slate-400 mt-0.5">Interactive question banks with topic-level practice</p>
          </div>
          <Link to="/courses" className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
            All Courses ({courses.length}) →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6 border border-white/8 space-y-4">
                <div className="skeleton w-12 h-12 rounded-2xl" />
                <div className="skeleton w-3/4 h-5" />
                <div className="skeleton w-full h-3" />
                <div className="skeleton w-2/3 h-3" />
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c) => (
              <Card
                key={c.id || c.slug}
                onClick={() => navigate(`/courses/${c.slug}`)}
                className="flex flex-col justify-between h-full group border-white/8 hover:border-indigo-500/40 cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/12 border border-indigo-500/25 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {getCourseIcon(c.slug)}
                    </div>
                    <Badge variant={c.difficulty === 'ADVANCED' ? 'danger' : c.difficulty === 'INTERMEDIATE' ? 'warning' : 'brand'}>
                      {c.difficulty || 'BEGINNER'}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-display font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                      {c.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="pulse-dot w-1.5 h-1.5" />
                    Live Bank
                  </span>
                  <span className="text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Start Track →
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-10 border border-white/8 text-center">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-slate-400 text-sm">No courses available yet.</p>
            <p className="text-slate-500 text-xs mt-1">Courses are loaded from the content directory.</p>
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div className="glass-card rounded-2xl p-6 border border-white/8 animate-fade-in-up animate-delay-300">
        <h3 className="text-sm font-display font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/quiz', icon: '⚡', label: 'Quick Quiz', color: 'text-indigo-400' },
            { to: '/revision', icon: '🧠', label: 'Smart Revision', color: 'text-emerald-400' },
            { to: '/progress', icon: '🏆', label: 'My Badges', color: 'text-amber-400' },
            { to: '/profile', icon: '⚙️', label: 'Settings', color: 'text-slate-400' },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/20 hover:bg-slate-800/50 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{action.icon}</span>
              <span className={`text-xs font-medium ${action.color}`}>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};
