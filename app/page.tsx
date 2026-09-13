'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Flame,
  Home as HomeIcon,
  LayoutDashboard,
  Library,
  LineChart,
  LogOut,
  Menu,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  X,
  Zap,
} from 'lucide-react'
import { Logo } from '../components/ui/Logo'
import { useAuth } from '../lib/store/authContext'
import { courseApi, progressApi, quizApi } from '../lib/api'
import {
  CourseItem,
  mockCourses,
  mockActivities,
  mockDashboardStats,
  mockWeeklyActivity,
  mockBadges,
  mockSkillBreakdown,
  mockQuizQuestions,
  QuizQuestionItem,
} from '../lib/mockData'

type View = 'home' | 'dashboard' | 'courses' | 'progress' | 'profile' | 'quiz'

export default function Page() {
  const [view, setView] = useState<View>('home')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auth context
  const { user, isAuthenticated, openAuthModal, logout, updateUserXpAndStreak } = useAuth()

  // App Data State
  const [courses, setCourses] = useState<CourseItem[]>(mockCourses)
  const [dashboardStats, setDashboardStats] = useState(mockDashboardStats)
  const [activities, setActivities] = useState(mockActivities)
  const [activeCourseSlug, setActiveCourseSlug] = useState<string>('javascript-fundamentals')
  const [activeCourseTitle, setActiveCourseTitle] = useState<string>('JavaScript Fundamentals')
  const [activeLessonTitle, setActiveLessonTitle] = useState<string>('JavaScript Arrays')
  const [activeLessonNumber, setActiveLessonNumber] = useState<number>(18)
  const [totalLessonsCount, setTotalLessonsCount] = useState<number>(25)

  // Navigation helper — guards protected views for unauthenticated users
  const navigate = (next: View) => {
    const protectedViews: View[] = ['dashboard', 'courses', 'progress', 'profile']
    // Valid authenticated user required for protected pages
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('countingcodes_token') || localStorage.getItem('learnforge_token')
        : null
    const isReallyAuthenticated = isAuthenticated && !!user && token !== 'demo-token-alex-morgan'
    if (protectedViews.includes(next) && !isReallyAuthenticated) {
      openAuthModal('login')
      return
    }
    setView(next)
    setMobileOpen(false)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Support direct ?tab=quiz URL navigation (e.g. from Admin panel)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('tab') === 'quiz') {
        setView('quiz')
      }
    }
  }, [])

  // Load courses & stats from Spring Boot backend (with resilient mock fallback)
  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      // 1. Fetch Courses
      try {
        const coursesData: any = await courseApi.getAllCourses()
        let mappedCourses: CourseItem[] = []
        if (Array.isArray(coursesData) && coursesData.length > 0) {
          mappedCourses = coursesData.map((c: any, index: number) => {
            const toneList: ('sky' | 'mint' | 'pink' | 'yellow')[] = ['sky', 'mint', 'pink', 'yellow']
            const iconMap: Record<string, string> = {
              'core-java': 'JAVA',
              'spring-boot': 'SB',
              sql: 'SQL',
              'javascript-fundamentals': 'JS',
              'ui-ux-design-basics': 'UX',
              'product-strategy': 'PS',
            }
            return {
              id: c.id || index + 1,
              slug: c.slug || `course-${c.id}`,
              title: c.title || 'Course',
              category: c.tags ? 'Engineering' : 'Development',
              progress: index === 0 ? 72 : index === 1 ? 45 : 20,
              lessons: `${c.modules?.length ? c.modules.length * 4 : 18} of 25 lessons`,
              tone: (c.iconUrl && ['sky', 'mint', 'pink', 'yellow'].includes(c.iconUrl) ? c.iconUrl : toneList[index % toneList.length]) as 'sky' | 'mint' | 'pink' | 'yellow',
              icon: iconMap[c.slug] || c.title.substring(0, 2).toUpperCase(),
              difficulty: c.difficulty || 'BEGINNER',
              description: c.description,
            }
          })
        }

        // Merge custom created courses from local storage
        if (typeof window !== 'undefined') {
          const localCourses: CourseItem[] = JSON.parse(localStorage.getItem('learnforge_custom_courses') || '[]')
          if (Array.isArray(localCourses) && localCourses.length > 0) {
            const baseList = mappedCourses.length > 0 ? mappedCourses : mockCourses
            const slugs = new Set(baseList.map((c) => c.slug))
            const uniqueCustom = localCourses.filter((c) => !slugs.has(c.slug))
            mappedCourses = [...baseList, ...uniqueCustom]
          }
        }

        if (isMounted && mappedCourses.length > 0) {
          setCourses(mappedCourses)
        }
      } catch (err) {
        if (typeof window !== 'undefined') {
          const localCourses: CourseItem[] = JSON.parse(localStorage.getItem('learnforge_custom_courses') || '[]')
          if (Array.isArray(localCourses) && localCourses.length > 0) {
            const slugs = new Set(mockCourses.map((c) => c.slug))
            const uniqueCustom = localCourses.filter((c) => !slugs.has(c.slug))
            setCourses([...mockCourses, ...uniqueCustom])
          }
        }
      }

      // 2. Fetch Progress / Dashboard Stats
      try {
        if (isAuthenticated) {
          const statsRes: any = await progressApi.getDashboardStats()
          if (isMounted && statsRes && typeof statsRes === 'object') {
            setDashboardStats({
              streak: statsRes.currentStreak ?? 7,
              longestStreak: statsRes.longestStreak ?? 14,
              xp: statsRes.xp ?? 1240,
              level: statsRes.level ?? 4,
              accuracyPct: statsRes.accuracyPct ?? 68,
              totalAnswered: statsRes.totalAnswered ?? 125,
              correctAnswered: statsRes.correctAnswered ?? 85,
              badgeCount: statsRes.badgeCount ?? 12,
              dueReviewsCount: statsRes.dueReviewsCount ?? 3,
              weeklyGoal: {
                completedDays: 4,
                targetDays: 5,
                percentage: 80,
              },
            })
          }
        }
      } catch (err) {
        // Smoothly keep mockDashboardStats
      }

      // 3. Fetch Quiz History for Recent Activity
      try {
        if (isAuthenticated) {
          const historyRes: any = await quizApi.getHistory()
          if (isMounted && Array.isArray(historyRes) && historyRes.length > 0) {
            const mappedActivities = historyRes.slice(0, 4).map((item: any, i: number) => {
              const toneList = ['sky', 'pink', 'mint', 'yellow']
              return [
                'Completed',
                item.sessionType ? `${item.sessionType} Quiz` : 'Quiz Session',
                `Score: ${item.score || 100}%`,
                i === 0 ? '10 min ago' : i === 1 ? 'Yesterday' : `${i + 1} days ago`,
                toneList[i % toneList.length],
              ]
            })
            setActivities(mappedActivities)
          }
        }
      } catch (err) {
        // Keep mockActivities
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  // Get user initials
  const initials = useMemo(() => {
    if (!user?.displayName) return 'AM'
    const parts = user.displayName.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return parts[0].substring(0, 2).toUpperCase()
  }, [user])

  // Start specific course quiz
  const handleStartCourseQuiz = (course: CourseItem) => {
    setActiveCourseSlug(course.slug)
    setActiveCourseTitle(course.title)
    setActiveLessonTitle(`${course.title} Essentials`)
    setActiveLessonNumber(1)
    setTotalLessonsCount(20)
    navigate('quiz')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <button onClick={() => navigate('home')} className="flex items-center" aria-label="CountingCodes home">
            <Logo size="md" />
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {(
              [
                ['home', 'Home', HomeIcon],
                ['dashboard', 'Dashboard', LayoutDashboard],
                ['courses', 'My courses', Library],
                ['progress', 'Progress', LineChart],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => navigate(key)}
                className={`nav-link ${view === key ? 'nav-link-active' : ''}`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted hover:border-primary/40"
              title="Open Admin Panel"
            >
              <ShieldCheck size={14} className="text-primary" />
              <span>Admin</span>
            </Link>

            <div className="flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-sm font-semibold text-mint-foreground">
              <Flame size={16} /> {dashboardStats.streak || user?.streak || 7} day streak
            </div>

            {isAuthenticated && user ? (
              <button
                onClick={() => navigate('profile')}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sky text-sm font-bold text-sky-foreground transition hover:opacity-90"
                aria-label="Open profile"
                title={user.displayName}
              >
                {initials}
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground transition hover:bg-muted"
              >
                Sign in
              </button>
            )}
          </div>

          <button
            className="rounded-lg p-2 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="border-t border-border bg-background px-5 py-3 md:hidden">
            {(['home', 'dashboard', 'courses', 'progress', 'profile'] as View[]).map((key) => (
              <button
                key={key}
                onClick={() => navigate(key)}
                className="block w-full py-3 text-left font-medium capitalize text-foreground"
              >
                {key === 'home' ? 'Home' : key}
              </button>
            ))}
            <Link
              href="/admin"
              className="flex items-center gap-2 w-full py-3 text-left font-medium text-foreground"
            >
              <ShieldCheck size={16} className="text-primary" />
              Admin Panel
            </Link>
            {!isAuthenticated && (
              <button
                onClick={() => {
                  setMobileOpen(false)
                  openAuthModal('login')
                }}
                className="button-primary mt-2 w-full justify-center"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>

      {/* Screen Views */}
      {view === 'home' && (
        <Home
          navigate={navigate}
          courses={courses}
          streak={dashboardStats.streak || 7}
          level={dashboardStats.level || 4}
          onStartCourse={handleStartCourseQuiz}
        />
      )}
      {view === 'dashboard' && (
        <Dashboard
          navigate={navigate}
          courses={courses}
          stats={dashboardStats}
          activities={activities}
          user={user}
          onStartCourse={handleStartCourseQuiz}
        />
      )}
      {view === 'courses' && (
        <Courses navigate={navigate} courses={courses} onSelectCourse={handleStartCourseQuiz} />
      )}
      {view === 'progress' && <Progress stats={dashboardStats} />}
      {view === 'profile' && (
        <Profile
          user={user}
          stats={dashboardStats}
          initials={initials}
          onLogout={() => {
            logout()
            navigate('home')
          }}
          onOpenAuth={() => openAuthModal('login')}
        />
      )}
      {view === 'quiz' && (
        <Quiz
          navigate={navigate}
          courseSlug={activeCourseSlug}
          courseTitle={activeCourseTitle}
          lessonTitle={activeLessonTitle}
          lessonNumber={activeLessonNumber}
          totalLessons={totalLessonsCount}
          onCompleted={(xpGained) => updateUserXpAndStreak(xpGained)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Logo size="sm" />
          <span>Build your skills. Shape your future.</span>
          <span>© 2026 CountingCodes</span>
        </div>
      </footer>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   1. HOME SCREEN
───────────────────────────────────────────────────────────── */
function Home({
  navigate,
  courses,
  streak,
  level,
  onStartCourse,
}: {
  navigate: (v: View) => void
  courses: CourseItem[]
  streak: number
  level: number
  onStartCourse: (c: CourseItem) => void
}) {
  const topCourse = courses[0] || mockCourses[0]

  return (
    <main>
      <section className="hero-grid mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="max-w-2xl">
          <div className="eyebrow">
            <Sparkles size={14} /> Learning that moves with you
          </div>
          <h1 className="mt-6 font-heading text-5xl font-extrabold leading-[1.04] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Learn something new.
            <br />
            <span className="text-primary">Every single day.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            CountingCodes turns ambitious goals into small, satisfying wins. Learn at your pace, keep your streak alive, and
            become the engineer you want to be.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button className="button-primary" onClick={() => navigate('dashboard')}>
              Start learning <ChevronRight size={18} />
            </button>
            <button className="button-secondary" onClick={() => navigate('courses')}>
              Explore courses
            </button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary" /> Free to get started
            </span>
            <span className="flex items-center gap-2">
              <Target size={16} className="text-primary" /> Learn your way
            </span>
          </div>
        </div>

        <div className="relative mt-14 lg:mt-0">
          <div className="learning-card mx-auto max-w-md rotate-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today&apos;s focus</p>
                <h2 className="mt-1 font-heading text-2xl font-bold">{topCourse.title}</h2>
              </div>
              <div className="icon-box bg-sky text-sky-foreground">
                <Brain size={21} />
              </div>
            </div>
            <div className="mt-8 flex items-end justify-between">
              <div>
                <p className="text-5xl font-extrabold tracking-tight">
                  {topCourse.progress}
                  <span className="text-2xl text-muted-foreground">%</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">course progress</p>
              </div>
              <div className="rounded-2xl bg-mint px-3 py-2 text-center">
                <Zap size={17} className="mx-auto text-mint-foreground" />
                <p className="mt-1 text-xs font-bold text-mint-foreground">+120 XP</p>
              </div>
            </div>
            <div className="progress-track mt-7">
              <div className="progress-fill" style={{ width: `${topCourse.progress}%` }} />
            </div>
            <button
              onClick={() => onStartCourse(topCourse)}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3.5 font-semibold text-background transition hover:opacity-90"
            >
              Continue learning <Play size={16} fill="currentColor" />
            </button>
          </div>
          <div className="float-chip float-chip-one">
            <Flame size={17} className="text-pink-foreground" /> {streak} day streak
          </div>
          <div className="float-chip float-chip-two">
            <Trophy size={17} className="text-primary" /> Level {level} learner
          </div>
        </div>
      </section>

      {/* Platform Capabilities Row */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-3 lg:px-8">
          <Stat value="9" label="question types" />
          <Stat value="SM-2" label="spaced repetition" />
          <Stat value="AI" label="answer evaluation" />
        </div>
      </section>

      {/* Course Highlights Grid */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="eyebrow">Your learning universe</div>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Find your next obsession.
            </h2>
          </div>
          <button className="text-sm font-bold text-primary" onClick={() => navigate('courses')}>
            View all courses <ChevronRight className="inline" size={16} />
          </button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.title} course={course} onClick={() => onStartCourse(course)} />
          ))}
        </div>
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────────────────────
   2. DASHBOARD SCREEN
───────────────────────────────────────────────────────────── */
function Dashboard({
  navigate,
  courses,
  stats,
  activities,
  user,
  onStartCourse,
}: {
  navigate: (v: View) => void
  courses: CourseItem[]
  stats: typeof mockDashboardStats
  activities: string[][]
  user: any
  onStartCourse: (c: CourseItem) => void
}) {
  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Alex'

  return (
    <main className="page-wrap">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Tuesday, September 12</p>
          <h1 className="page-title">Good morning, {firstName}.</h1>
          <p className="mt-2 text-muted-foreground">Small steps today, big changes tomorrow.</p>
        </div>
        <button
          className="button-primary"
          onClick={() => (courses.length > 0 ? onStartCourse(courses[0]) : navigate('quiz'))}
        >
          <Play size={17} fill="currentColor" /> Resume learning
        </button>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <Metric icon={Flame} value={String(stats.streak || 7)} label="day streak" color="pink" />
        <Metric icon={Zap} value={stats.xp.toLocaleString()} label="total XP" color="mint" />
        <Metric icon={Trophy} value={`Level ${stats.level}`} label="current level" color="sky" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="panel">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-title">Continue learning</h2>
              <p className="text-sm text-muted-foreground">Pick up where you left off.</p>
            </div>
            <button onClick={() => navigate('courses')} className="text-sm font-bold text-primary">
              See all
            </button>
          </div>
          <div className="mt-6 space-y-4">
            {courses.slice(0, 2).map((c) => (
              <CourseRow key={c.title} course={c} onClick={() => onStartCourse(c)} />
            ))}
          </div>
        </section>

        <section className="panel">
          <h2 className="section-title">Weekly goal</h2>
          <p className="mt-1 text-sm text-muted-foreground">You&apos;re doing great this week.</p>
          <div className="goal-ring mt-7">
            <span>
              {stats.weeklyGoal.completedDays}
              <span className="text-base text-muted-foreground">/{stats.weeklyGoal.targetDays}</span>
            </span>
            <small>days</small>
          </div>
          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Weekly progress</span>
            <b>{stats.weeklyGoal.percentage}%</b>
          </div>
          <div className="progress-track mt-2">
            <div className="progress-fill" style={{ width: `${stats.weeklyGoal.percentage}%` }} />
          </div>
        </section>
      </div>

      <section className="panel mt-8">
        <h2 className="section-title">Recent activity</h2>
        <div className="mt-5 divide-y divide-border">
          {activities.map(([type, title, sub, time, tone]) => (
            <div key={title} className="flex items-center gap-4 py-4">
              <div className={`activity-dot ${tone}`}>
                {type === 'Earned' ? <Trophy size={16} /> : <CheckCircle2 size={16} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {type} <span className="font-bold">{title}</span>
                </p>
                <p className="text-sm text-muted-foreground">{sub}</p>
              </div>
              <time className="text-xs text-muted-foreground">{time}</time>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────────────────────
   3. COURSES SCREEN
───────────────────────────────────────────────────────────── */
function Courses({
  navigate,
  courses,
  onSelectCourse,
}: {
  navigate: (v: View) => void
  courses: CourseItem[]
  onSelectCourse: (c: CourseItem) => void
}) {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all')
  const [search, setSearch] = useState('')

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
      if (!matchSearch) return false

      if (filter === 'in_progress') return c.progress > 0 && c.progress < 100
      if (filter === 'completed') return c.progress === 100
      return true
    })
  }, [courses, filter, search])

  return (
    <main className="page-wrap">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Your library</p>
          <h1 className="page-title">My courses</h1>
        </div>
        <div className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses"
            aria-label="Search courses"
          />
        </div>
      </div>

      <div className="mt-10 flex gap-2 overflow-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'filter-active' : 'filter'}
        >
          All courses
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={filter === 'in_progress' ? 'filter-active' : 'filter'}
        >
          In progress
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'filter-active' : 'filter'}
        >
          Completed
        </button>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((c) => (
          <CourseCard key={c.title} course={c} onClick={() => onSelectCourse(c)} />
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            No courses found matching &ldquo;{search}&rdquo;.
          </div>
        )}
      </div>
    </main>
  )
}

/* ─────────────────────────────────────────────────────────────
   4. PROGRESS SCREEN
───────────────────────────────────────────────────────────── */
function Progress({ stats }: { stats: typeof mockDashboardStats }) {
  return (
    <main className="page-wrap">
      <p className="eyebrow">Keep going</p>
      <h1 className="page-title">Your progress</h1>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <Metric icon={Target} value={`${stats.accuracyPct}%`} label="average completion" color="sky" />
        <Metric icon={Flame} value={`${stats.longestStreak} days`} label="longest streak" color="pink" />
        <Metric icon={Trophy} value={String(stats.badgeCount)} label="badges earned" color="mint" />
      </div>

      <section className="panel mt-8">
        <h2 className="section-title">Learning activity</h2>
        <div className="mt-8 flex h-48 items-end gap-2 sm:gap-4">
          {mockWeeklyActivity.map((height, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-3">
              <div
                className="w-full rounded-t-lg bg-sky transition-all hover:bg-primary"
                style={{ height }}
                title={`Activity: ${height}`}
              />
              <span className="text-xs text-muted-foreground">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="panel">
          <h2 className="section-title">Badges</h2>
          <div className="mt-5 flex flex-wrap gap-4">
            {mockBadges.map((b) => (
              <Badge key={b.id} icon={b.icon === 'Flame' ? Flame : b.icon === 'Zap' ? Zap : Target} label={b.label} />
            ))}
          </div>
        </div>

        <div className="panel">
          <h2 className="section-title">Skill breakdown</h2>
          {mockSkillBreakdown.map(([label, value]) => (
            <div key={label} className="mt-5">
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <b>{value}%</b>
              </div>
              <div className="progress-track mt-2">
                <div className="progress-fill" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────────────────────
   5. PROFILE SCREEN
───────────────────────────────────────────────────────────── */
function Profile({
  user,
  stats,
  initials,
  onLogout,
  onOpenAuth,
}: {
  user: any
  stats: typeof mockDashboardStats
  initials: string
  onLogout: () => void
  onOpenAuth: () => void
}) {
  return (
    <main className="page-wrap">
      <p className="eyebrow">Your space</p>
      <h1 className="page-title">Profile</h1>

      <section className="panel mt-10 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-sky text-2xl font-bold text-sky-foreground">
          {initials}
        </div>
        <div>
          <h2 className="font-heading text-2xl font-bold">{user?.displayName || 'Learner'}</h2>
          <p className="mt-1 text-muted-foreground">
            {user?.email || 'learner@countingcodes.com'} &bull; {user?.joinedDate || 'Learning since September 2025'}
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-sm sm:justify-start">
            <span className="font-semibold text-primary">{stats.xp.toLocaleString()} XP</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Flame size={15} /> {stats.streak} day streak
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground">
              Level {stats.level}
            </span>
          </div>
        </div>
      </section>

      <section className="panel mt-6">
        <h2 className="section-title">Account settings</h2>
        <div className="mt-5 divide-y divide-border">
          <button className="settings-row">
            Personal information <ChevronRight size={17} />
          </button>
          <button className="settings-row">
            Notifications <ChevronRight size={17} />
          </button>
          <button className="settings-row">
            Learning preferences <ChevronRight size={17} />
          </button>
          {user ? (
            <button
              onClick={onLogout}
              className="settings-row text-pink-foreground hover:text-pink-foreground/80 font-bold"
            >
              Sign out <LogOut size={17} />
            </button>
          ) : (
            <button onClick={onOpenAuth} className="settings-row text-primary font-bold">
              Sign In to Save Progress <ChevronRight size={17} />
            </button>
          )}
        </div>
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────────────────────
   6. QUIZ SCREEN — Full Multi-Type Engine
───────────────────────────────────────────────────────────── */
function Quiz({
  navigate,
  courseSlug,
  courseTitle,
  lessonTitle,
  lessonNumber,
  totalLessons,
  onCompleted,
}: {
  navigate: (v: View) => void
  courseSlug: string
  courseTitle: string
  lessonTitle: string
  lessonNumber: number
  totalLessons: number
  onCompleted: (xpGained: number) => void
}) {
  const OBJECTIVE_MOCKS = useMemo(() => {
    return mockQuizQuestions.filter(
      (q) =>
        q.evaluationMode !== 'SUBJECTIVE' &&
        !['DESCRIPTIVE', 'CASE_STUDY', 'EXPLAIN_CONCEPT'].includes(q.questionType)
    )
  }, [])

  const [started, setStarted] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestionItem[]>(OBJECTIVE_MOCKS)
  const [currentIndex, setCurrentIndex] = useState(0)
  // userAnswer is flexible: string | string[] | Record<string,string>
  const [userAnswer, setUserAnswer] = useState<unknown>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<{
    isCorrect: boolean
    explanation: string
    xpEarned: number
    correctAnswer?: string
    skipped?: boolean
  } | null>(null)
  const [totalXpGained, setTotalXpGained] = useState(0)
  const [backendSessionId, setBackendSessionId] = useState<number | null>(null)
  // For MATCH_PAIR state tracking
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [selectedDef, setSelectedDef] = useState<string | null>(null)

  // Load override questions from Admin panel test button or custom imported questions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const override = localStorage.getItem('learnforge_quiz_override')
      if (override) {
        try {
          const parsed = JSON.parse(override)
          if (Array.isArray(parsed) && parsed.length > 0) {
            const filtered = parsed.filter(
              (q: any) =>
                q.evaluationMode !== 'SUBJECTIVE' &&
                !['DESCRIPTIVE', 'CASE_STUDY', 'EXPLAIN_CONCEPT'].includes(q.questionType)
            )
            if (filtered.length > 0) {
              setQuestions(filtered)
              localStorage.removeItem('learnforge_quiz_override')
              setStarted(true)
              return
            }
          }
        } catch (e) {}
      }

      const custom = localStorage.getItem('learnforge_custom_questions')
      if (custom) {
        try {
          const parsed = JSON.parse(custom)
          if (Array.isArray(parsed) && parsed.length > 0) {
            const filtered = parsed.filter(
              (q: any) =>
                q.evaluationMode !== 'SUBJECTIVE' &&
                !['DESCRIPTIVE', 'CASE_STUDY', 'EXPLAIN_CONCEPT'].includes(q.questionType)
            )
            setQuestions([...OBJECTIVE_MOCKS, ...filtered])
          }
        } catch (e) {}
      }
    }
  }, [OBJECTIVE_MOCKS])

  // ── Local evaluation helper (mock fallback when backend is offline) ──
  const evaluateLocally = (q: QuizQuestionItem, answer: unknown): { isCorrect: boolean; xpEarned: number; correctAnswer: string } => {
    const type = q.questionType
    let isCorrect = false
    let correctAnswer = q.correctAnswer || ''

    if (type === 'MCQ_SINGLE' || type === 'TRUE_FALSE') {
      const a = (answer as string) || ''
      const opt = q.options.find((o) => o.text.trim().toLowerCase() === a.trim().toLowerCase())
      isCorrect = opt?.isCorrect ?? (q.correctAnswer ? a.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() : false)
      if (!correctAnswer) {
        const correctOpt = q.options.find((o) => o.isCorrect)
        if (correctOpt) correctAnswer = correctOpt.text
      }
    } else if (type === 'MCQ_MULTI') {
      const selected = new Set(((answer as string[]) || []).map((s) => s.trim().toLowerCase()))
      const correctOpts = q.options.filter((o) => o.isCorrect).map((o) => o.text.trim().toLowerCase())
      const correctSet = new Set(q.correctAnswers ? q.correctAnswers.map((s) => s.trim().toLowerCase()) : correctOpts)
      isCorrect = selected.size === correctSet.size && [...selected].every((s) => correctSet.has(s))
      correctAnswer = (q.correctAnswers || q.options.filter((o) => o.isCorrect).map((o) => o.text)).join(', ')
    } else if (type === 'FILL_BLANK' || type === 'CODE_COMPLETION') {
      const a = ((answer as string) || '').trim().toLowerCase()
      const validAnswers = q.correctAnswers
        ? q.correctAnswers.map((c) => c.trim().toLowerCase())
        : [q.correctAnswer ? q.correctAnswer.trim().toLowerCase() : '']
      isCorrect = validAnswers.includes(a)
      correctAnswer = q.correctAnswer || (q.correctAnswers && q.correctAnswers[0]) || ''
    } else if (type === 'MATCH_PAIR') {
      const pairs = (answer as Record<string, string>) || {}
      isCorrect = q.options.length > 0 && q.options.every((o) => pairs[o.text] === o.matchTarget)
      correctAnswer = q.options.map((o) => `${o.text} → ${o.matchTarget}`).join('; ')
    } else if (type === 'ARRANGE_SEQUENCE') {
      const seq = (answer as string[]) || []
      const correct = q.correctSequence || q.options.map((o) => o.text)
      isCorrect = seq.length === correct.length && seq.every((s, i) => s === correct[i])
      correctAnswer = correct.join(' → ')
    }

    return { isCorrect, xpEarned: isCorrect ? q.xpReward : 0, correctAnswer }
  }

  // ── Serialize answer for backend (all types → string) ──
  const serializeAnswer = (answer: unknown, type: string): string => {
    if (type === 'MCQ_MULTI' || type === 'ARRANGE_SEQUENCE' || type === 'MATCH_PAIR') {
      return JSON.stringify(answer)
    }
    if (answer === null || answer === undefined) return ''
    return String(answer)
  }

  // Start the quiz (requests backend session or initializes mock questions)
  const handleStartQuiz = async () => {
    try {
      const sessionRes: any = await quizApi.startQuiz({
        sessionType: 'PRACTICE',
        count: 10,
      })

      if (sessionRes?.sessionId && Array.isArray(sessionRes.questions) && sessionRes.questions.length > 0) {
        setBackendSessionId(sessionRes.sessionId)
        const mappedQuestions: QuizQuestionItem[] = sessionRes.questions
          .filter(
            (q: any) =>
              q.evaluationMode !== 'SUBJECTIVE' &&
              !['DESCRIPTIVE', 'CASE_STUDY', 'EXPLAIN_CONCEPT'].includes(q.questionType)
          )
          .map((q: any) => {
            const rawOpts = (q.options || []).map((o: any, idx: number) => ({
              id: o.id || idx + 1,
              label: o.label || String.fromCharCode(65 + idx),
              text: (o.optionText || o.text || '').trim(),
              isCorrect: Boolean(o.isCorrect),
              matchTarget: (o.matchTarget || o.pairValue || '').trim(),
            }))

            // Strict de-duplication so options NEVER render 3 times
            const seen = new Set<string>()
            const uniqueOpts = rawOpts.filter((opt: any) => {
              const k = (opt.text || '').toLowerCase()
              if (!k || seen.has(k)) return false
              seen.add(k)
              return true
            })

            return {
              id: q.id,
              questionType: q.questionType || 'MCQ_SINGLE',
              title: q.title,
              codeSnippet: q.codeSnippet,
              codeLanguage: q.codeLanguage,
              answerText: q.explanation,
              correctAnswer: q.correctAnswer,
              correctAnswers: q.correctAnswers,
              correctSequence: q.correctSequence,
              evaluationMode: q.evaluationMode,
              options: uniqueOpts,
              explanation: q.explanation || 'Review the core concepts of this lesson.',
              hint: q.hint,
              xpReward: q.xpReward || 20,
            }
          })

        setQuestions(mappedQuestions.length > 0 ? mappedQuestions : OBJECTIVE_MOCKS)
      } else {
        setQuestions(OBJECTIVE_MOCKS)
      }
    } catch (e) {
      setQuestions(OBJECTIVE_MOCKS)
    }

    setCurrentIndex(0)
    setUserAnswer(null)
    setEvaluation(null)
    setTotalXpGained(0)
    setSelectedTerm(null)
    setSelectedDef(null)
    setStarted(true)
    setCompleted(false)
  }

  const currentQ = questions[currentIndex] || OBJECTIVE_MOCKS[0]

  // Unique options for the current question (prevents duplicate rendering)
  const currentOptions = useMemo(() => {
    const seen = new Set<string>()
    return (currentQ.options || []).filter((opt) => {
      const k = (opt.text || '').trim().toLowerCase()
      if (!k || seen.has(k)) return false
      seen.add(k)
      return true
    })
  }, [currentQ.id, currentQ.options])

  // Shuffled definitions for MATCH_PAIR
  const shuffledDefinitions = useMemo(() => {
    if (currentQ.questionType !== 'MATCH_PAIR') return []
    const defs = currentOptions
      .map((o) => (o.matchTarget || '').trim())
      .filter((d): d is string => Boolean(d))
    const unique = Array.from(new Set(defs))
    return [...unique].reverse()
  }, [currentQ.id, currentOptions])

  // Check if the user has provided any answer yet
  const hasAnswer = (): boolean => {
    if (userAnswer === null || userAnswer === undefined) return false
    if (Array.isArray(userAnswer)) return (userAnswer as unknown[]).length > 0
    if (typeof userAnswer === 'object') return Object.keys(userAnswer as object).length > 0
    return String(userAnswer).trim().length > 0
  }

  // Skip question & reveal answer
  const handleSkip = () => {
    let revealed = currentQ.correctAnswer || ''
    if (!revealed) {
      if (currentQ.questionType === 'MCQ_SINGLE' || currentQ.questionType === 'TRUE_FALSE') {
        const correctOpt = currentOptions.find((o) => o.isCorrect)
        revealed = correctOpt ? correctOpt.text : currentOptions[0]?.text || ''
      } else if (currentQ.questionType === 'MCQ_MULTI') {
        revealed = (currentQ.correctAnswers || currentOptions.filter((o) => o.isCorrect).map((o) => o.text)).join(', ')
      } else if (currentQ.questionType === 'MATCH_PAIR') {
        revealed = currentOptions.map((o) => `${o.text} → ${o.matchTarget}`).join('; ')
      } else if (currentQ.questionType === 'ARRANGE_SEQUENCE') {
        revealed = (currentQ.correctSequence || currentOptions.map((o) => o.text)).join(' → ')
      }
    }

    setEvaluation({
      isCorrect: false,
      explanation: currentQ.explanation || 'Question skipped. Review the solution above to master this concept.',
      xpEarned: 0,
      correctAnswer: revealed,
      skipped: true,
    })
  }

  // Submit and evaluate answer
  const handleCheckAnswer = async () => {
    if (!hasAnswer()) return
    setIsEvaluating(true)

    try {
      if (backendSessionId) {
        const evalRes: any = await quizApi.submitAnswer({
          quizSessionId: backendSessionId,
          questionId: currentQ.id,
          userAnswer: serializeAnswer(userAnswer, currentQ.questionType),
        })
        const isCorrect = !!evalRes.isCorrect
        const xpEarned = isCorrect ? (evalRes.xpEarned ?? currentQ.xpReward) : 0
        const correctAns =
          evalRes.correctAnswer ||
          currentQ.correctAnswer ||
          currentOptions.find((o) => o.isCorrect)?.text
        setEvaluation({
          isCorrect,
          explanation: evalRes.explanation || currentQ.explanation,
          xpEarned,
          correctAnswer: correctAns,
          skipped: false,
        })
        setTotalXpGained((prev) => prev + xpEarned)
      } else {
        const { isCorrect, xpEarned, correctAnswer } = evaluateLocally(currentQ, userAnswer)
        setEvaluation({
          isCorrect,
          explanation: currentQ.explanation,
          xpEarned,
          correctAnswer,
          skipped: false,
        })
        setTotalXpGained((prev) => prev + xpEarned)
      }
    } catch (err) {
      const { isCorrect, xpEarned, correctAnswer } = evaluateLocally(currentQ, userAnswer)
      setEvaluation({
        isCorrect,
        explanation: currentQ.explanation,
        xpEarned,
        correctAnswer,
        skipped: false,
      })
      setTotalXpGained((prev) => prev + xpEarned)
    } finally {
      setIsEvaluating(false)
    }
  }

  // Next question or complete
  const handleNext = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
      setUserAnswer(null)
      setEvaluation(null)
      setSelectedTerm(null)
      setSelectedDef(null)
    } else {
      if (backendSessionId) {
        try {
          await quizApi.completeQuiz(backendSessionId)
        } catch (e) {
          /* noop */
        }
      }
      onCompleted(totalXpGained)
      setCompleted(true)
    }
  }

  return (
    <main className="page-wrap max-w-3xl">
      {!started && (
        <section className="panel text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky text-sky-foreground">
            <Brain size={30} />
          </div>
          <p className="eyebrow mt-7 justify-center">
            Lesson {lessonNumber} of {totalLessons} &bull; {courseTitle}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold">{lessonTitle}</h1>
          <p className="mx-auto mt-4 max-w-lg leading-7 text-muted-foreground">
            Test your understanding with real interactive challenges. You&apos;ll earn XP for every correct answer to
            grow your streak and rank up.
          </p>
          <button className="button-primary mx-auto mt-8" onClick={handleStartQuiz}>
            Start quiz <ChevronRight size={18} />
          </button>
        </section>
      )}

      {started && !completed && (
        <section className="panel">
          {/* Progress header */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                {currentQ.questionType.replace(/_/g, ' ')}
              </span>
              <span className="text-primary font-bold">+{currentQ.xpReward} XP</span>
            </div>
          </div>

          <div className="progress-track mt-4">
            <div
              className="progress-fill"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <h1 className="mt-10 font-heading text-2xl font-bold leading-snug sm:text-3xl">
            {currentQ.title}
          </h1>

          {/* Code snippet (CODE_COMPLETION) */}
          {currentQ.codeSnippet && (
            <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 font-mono text-sm">
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                {currentQ.codeLanguage || 'code'}
              </p>
              <pre className="whitespace-pre-wrap text-foreground leading-6">{currentQ.codeSnippet}</pre>
            </div>
          )}

          {/* ── ANSWER RENDERER (routed by questionType) ── */}
          <div className="mt-7">
            {/* MCQ_SINGLE */}
            {currentQ.questionType === 'MCQ_SINGLE' && (
              <div className="space-y-3">
                {currentOptions.map((opt, i) => {
                  const isSelected = userAnswer === opt.text
                  const isCorrectVal =
                    opt.isCorrect ||
                    (evaluation?.correctAnswer &&
                      (opt.text.toLowerCase() === evaluation.correctAnswer.toLowerCase() ||
                        opt.label.toLowerCase() === evaluation.correctAnswer.toLowerCase())) ||
                    (currentQ.correctAnswer &&
                      opt.text.toLowerCase() === currentQ.correctAnswer.toLowerCase())

                  let cls = 'answer'
                  if (evaluation) {
                    if (isCorrectVal) {
                      cls = 'answer border-emerald-500 bg-emerald-500/15 text-foreground font-semibold shadow-xs'
                    } else if (isSelected && !evaluation.isCorrect) {
                      cls = 'answer border-rose-500 bg-rose-500/15 text-foreground font-medium opacity-90'
                    } else {
                      cls = 'answer opacity-60 border-border'
                    }
                  } else if (isSelected) {
                    cls = 'answer answer-selected'
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={!!evaluation}
                      onClick={() => setUserAnswer(opt.text)}
                      className={cls}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs border transition ${
                          evaluation
                            ? isCorrectVal
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : isSelected
                              ? 'bg-rose-500 text-white border-rose-500'
                              : 'bg-muted text-muted-foreground border-border/50'
                            : isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground border-border/50'
                        }`}
                      >
                        {evaluation && isCorrectVal ? '✓' : evaluation && isSelected ? '✗' : opt.label || String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1 text-left text-foreground">{opt.text}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* MCQ_MULTI */}
            {currentQ.questionType === 'MCQ_MULTI' && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground mb-1">Select all that apply</p>
                {currentOptions.map((opt, i) => {
                  const selected = (userAnswer as string[] | null) || []
                  const isSelected = selected.includes(opt.text)
                  const correctOpts = currentOptions.filter((o) => o.isCorrect).map((o) => o.text.toLowerCase())
                  const correctAnswersList = (currentQ.correctAnswers || []).map((a) => a.toLowerCase())
                  const isCorrectVal =
                    opt.isCorrect ||
                    correctOpts.includes(opt.text.toLowerCase()) ||
                    correctAnswersList.includes(opt.text.toLowerCase())

                  let cls = 'answer'
                  if (evaluation) {
                    if (isCorrectVal) {
                      cls = 'answer border-emerald-500 bg-emerald-500/15 text-foreground font-semibold shadow-xs'
                    } else if (isSelected && !isCorrectVal) {
                      cls = 'answer border-rose-500 bg-rose-500/15 text-foreground font-medium opacity-90'
                    } else {
                      cls = 'answer opacity-60 border-border'
                    }
                  } else if (isSelected) {
                    cls = 'answer answer-selected'
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={!!evaluation}
                      onClick={() => {
                        const cur: string[] = [...((userAnswer as string[]) || [])]
                        const idx = cur.indexOf(opt.text)
                        if (idx >= 0) cur.splice(idx, 1)
                        else cur.push(opt.text)
                        setUserAnswer(cur)
                      }}
                      className={cls}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs border transition ${
                          evaluation
                            ? isCorrectVal
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : isSelected
                              ? 'bg-rose-500 text-white border-rose-500'
                              : 'bg-muted text-muted-foreground border-border/50'
                            : isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground border-border/50'
                        }`}
                      >
                        {isSelected ? (evaluation && !isCorrectVal ? '✗' : '✓') : opt.label || String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1 text-left text-foreground">{opt.text}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* TRUE_FALSE */}
            {currentQ.questionType === 'TRUE_FALSE' && (
              <div className="grid grid-cols-2 gap-4">
                {(['True', 'False'] as const).map((val) => {
                  const isSelected = userAnswer === val
                  const isCorrectVal =
                    currentQ.correctAnswer === val ||
                    evaluation?.correctAnswer === val ||
                    (evaluation?.correctAnswer && evaluation.correctAnswer.toLowerCase() === val.toLowerCase())

                  const cls = `flex flex-col items-center justify-center rounded-2xl border-2 py-8 text-lg font-bold transition cursor-pointer ${
                    evaluation
                      ? isCorrectVal
                        ? 'border-emerald-500 bg-emerald-500/15 text-foreground'
                        : isSelected
                        ? 'border-rose-500 bg-rose-500/15 text-foreground'
                        : 'border-border opacity-50'
                      : isSelected
                      ? 'border-primary bg-sky/50 text-foreground shadow-xs'
                      : 'border-border bg-card hover:border-primary/60 hover:bg-sky/30'
                  }`
                  return (
                    <button
                      key={val}
                      disabled={!!evaluation}
                      onClick={() => setUserAnswer(val)}
                      className={cls}
                    >
                      <span className="text-3xl mb-2">
                        {evaluation
                          ? isCorrectVal
                            ? '✓'
                            : isSelected
                            ? '✗'
                            : val === 'True'
                            ? '✓'
                            : '✗'
                          : val === 'True'
                          ? '✓'
                          : '✗'}
                      </span>
                      {val}
                    </button>
                  )
                })}
              </div>
            )}

            {/* FILL_BLANK */}
            {currentQ.questionType === 'FILL_BLANK' && (
              <div className="space-y-4">
                <input
                  type="text"
                  disabled={!!evaluation}
                  value={(userAnswer as string) || ''}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !evaluation && hasAnswer()) {
                      handleCheckAnswer()
                    }
                  }}
                  placeholder="Type your answer here and press Enter…"
                  className={`w-full rounded-xl border-2 bg-card px-4 py-3.5 text-base outline-hidden transition ${
                    evaluation
                      ? evaluation.isCorrect
                        ? 'border-emerald-500 bg-emerald-500/10 text-foreground'
                        : 'border-rose-500 bg-rose-500/10 text-foreground'
                      : 'border-border focus:border-primary'
                  }`}
                />
                {evaluation && (
                  <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-muted/60 border border-border">
                    <span className="text-muted-foreground">Correct answer:</span>
                    <strong className="text-foreground font-semibold">
                      {evaluation.correctAnswer || currentQ.correctAnswer || 'Not available'}
                    </strong>
                  </div>
                )}
              </div>
            )}

            {/* MATCH_PAIR */}
            {currentQ.questionType === 'MATCH_PAIR' && (() => {
              const pairs = (userAnswer as Record<string, string>) || {}

              const handleTermClick = (term: string) => {
                if (evaluation) return
                if (selectedDef) {
                  setUserAnswer({ ...pairs, [term]: selectedDef })
                  setSelectedDef(null)
                  setSelectedTerm(null)
                } else {
                  setSelectedTerm(selectedTerm === term ? null : term)
                }
              }

              const handleDefClick = (def: string) => {
                if (evaluation) return
                if (selectedTerm) {
                  setUserAnswer({ ...pairs, [selectedTerm]: def })
                  setSelectedTerm(null)
                  setSelectedDef(null)
                } else {
                  setSelectedDef(selectedDef === def ? null : def)
                }
              }

              return (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Click a term on the left, then its match on the right (or vice versa).
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left — Terms */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Terms
                      </p>
                      {currentOptions.map((opt) => {
                        const isSelected = selectedTerm === opt.text
                        const isMatched = !!pairs[opt.text]
                        const isCorrectPair = evaluation && pairs[opt.text] === opt.matchTarget
                        const isWrongPair = evaluation && pairs[opt.text] && pairs[opt.text] !== opt.matchTarget

                        return (
                          <button
                            key={opt.id}
                            disabled={!!evaluation}
                            onClick={() => handleTermClick(opt.text)}
                            className={`w-full rounded-xl border-2 px-3.5 py-3 text-left text-sm font-medium transition ${
                              evaluation
                                ? isCorrectPair
                                  ? 'border-emerald-500 bg-emerald-500/15 text-foreground font-semibold'
                                  : isWrongPair
                                  ? 'border-rose-500 bg-rose-500/15 text-foreground font-medium'
                                  : 'border-border opacity-60'
                                : isSelected
                                ? 'border-primary bg-sky/50 text-foreground shadow-xs'
                                : isMatched
                                ? 'border-primary/50 bg-sky/20'
                                : 'border-border bg-card hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{opt.text}</span>
                              {isMatched && !evaluation && (
                                <span className="text-xs text-primary font-semibold">✓</span>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Right — Definitions */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Definitions
                      </p>
                      {shuffledDefinitions.map((def, idx) => {
                        const isSelected = selectedDef === def
                        const isAssigned = Object.values(pairs).includes(def)

                        return (
                          <button
                            key={`def-${idx}`}
                            disabled={!!evaluation}
                            onClick={() => handleDefClick(def)}
                            className={`w-full rounded-xl border-2 px-3.5 py-3 text-left text-sm transition ${
                              evaluation
                                ? 'border-border opacity-60'
                                : isSelected
                                ? 'border-primary bg-sky/50 text-foreground shadow-xs'
                                : isAssigned
                                ? 'border-primary/40 bg-sky/20 text-foreground'
                                : selectedTerm
                                ? 'border-dashed border-primary/50 bg-card hover:bg-sky/20 cursor-pointer'
                                : 'border-dashed border-border bg-card hover:border-primary/30'
                            }`}
                          >
                            {def}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Active Links / Pairs Display */}
                  {Object.keys(pairs).length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Connected Pairs:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(pairs).map(([term, def]) => {
                          const targetOpt = currentOptions.find((o) => o.text === term)
                          const isRight = evaluation && targetOpt && targetOpt.matchTarget === def
                          const isWrong = evaluation && targetOpt && targetOpt.matchTarget !== def

                          return (
                            <span
                              key={term}
                              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                                isRight
                                  ? 'border-emerald-500/50 bg-emerald-500/10 text-foreground'
                                  : isWrong
                                  ? 'border-rose-500/50 bg-rose-500/10 text-foreground'
                                  : 'border-border bg-muted text-foreground'
                              }`}
                            >
                              <strong>{term}</strong> ↔ {def}
                              {!evaluation && (
                                <button
                                  onClick={() => {
                                    const p = { ...pairs }
                                    delete p[term]
                                    setUserAnswer(p)
                                  }}
                                  className="ml-1 text-muted-foreground hover:text-rose-500 font-bold"
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Complete Solution Revealed */}
                  {evaluation && (
                    <div className="p-3.5 rounded-xl bg-muted/60 border border-border text-xs space-y-1">
                      <p className="font-semibold text-foreground">All Correct Pairings:</p>
                      {currentOptions.map((o) => (
                        <p key={o.id} className="text-muted-foreground">
                          • <strong className="text-foreground">{o.text}</strong> → {o.matchTarget}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}

            {/* ARRANGE_SEQUENCE */}
            {currentQ.questionType === 'ARRANGE_SEQUENCE' && (() => {
              const seq: string[] = (userAnswer as string[]) || currentOptions.map((o) => o.text)
              const correct = currentQ.correctSequence || currentOptions.map((o) => o.text)
              return (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Use the arrows to arrange items in the correct order.</p>
                  {seq.map((item, idx) => {
                    const isCorrectPos = !!evaluation && item === correct[idx]
                    const isWrongPos = !!evaluation && item !== correct[idx]
                    return (
                      <div
                        key={item}
                        className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition ${
                          evaluation
                            ? isCorrectPos
                              ? 'border-emerald-500 bg-emerald-500/10 text-foreground'
                              : isWrongPos
                              ? 'border-rose-500 bg-rose-500/10 text-foreground'
                              : 'border-border'
                            : 'border-border bg-card'
                        }`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                          {idx + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium">{item}</span>
                        {!evaluation && (
                          <div className="flex flex-col gap-0.5">
                            <button
                              disabled={idx === 0}
                              onClick={() => {
                                const s = [...seq]
                                ;[s[idx - 1], s[idx]] = [s[idx], s[idx - 1]]
                                setUserAnswer(s)
                              }}
                              className="flex h-6 w-6 items-center justify-center rounded text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
                            >
                              ▲
                            </button>
                            <button
                              disabled={idx === seq.length - 1}
                              onClick={() => {
                                const s = [...seq]
                                ;[s[idx], s[idx + 1]] = [s[idx + 1], s[idx]]
                                setUserAnswer(s)
                              }}
                              className="flex h-6 w-6 items-center justify-center rounded text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
                            >
                              ▼
                            </button>
                          </div>
                        )}
                        {evaluation && <span className="text-sm font-bold">{isCorrectPos ? '✓' : '✗'}</span>}
                      </div>
                    )
                  })}
                </div>
              )
            })()}

            {/* CODE_COMPLETION */}
            {currentQ.questionType === 'CODE_COMPLETION' && (
              <div className="space-y-3">
                <textarea
                  disabled={!!evaluation}
                  value={(userAnswer as string) || ''}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="// Write your answer here…"
                  rows={4}
                  className={`w-full resize-none rounded-xl border-2 bg-muted/30 px-4 py-3 font-mono text-sm outline-hidden transition ${
                    evaluation
                      ? evaluation.isCorrect
                        ? 'border-emerald-500 bg-emerald-500/10 text-foreground'
                        : 'border-rose-500 bg-rose-500/10 text-foreground'
                      : 'border-border focus:border-primary'
                  }`}
                />
                {evaluation && (
                  <p className="text-xs text-muted-foreground">
                    Expected:{' '}
                    <code className="rounded bg-muted px-1.5 py-0.5 text-foreground font-mono font-bold">
                      {evaluation.correctAnswer || currentQ.correctAnswer}
                    </code>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Hint */}
          {currentQ.hint && !evaluation && <QuizHint hint={currentQ.hint} />}

          {/* Feedback & Answer Reveal panel */}
          {evaluation && (
            <div
              className={`mt-6 rounded-2xl border p-5 animate-in fade-in duration-200 ${
                evaluation.skipped
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-200'
                  : evaluation.isCorrect
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-950 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-heading font-bold text-base">
                {evaluation.skipped ? (
                  <>
                    <RotateCcw size={19} className="text-amber-500" />
                    <span>Skipped — Answer Revealed (+0 XP)</span>
                  </>
                ) : evaluation.isCorrect ? (
                  <>
                    <CheckCircle2 size={19} className="text-emerald-500" />
                    <span>Correct! +{evaluation.xpEarned} XP</span>
                  </>
                ) : (
                  <>
                    <X size={19} className="text-rose-500" />
                    <span>Incorrect (+0 XP)</span>
                  </>
                )}
              </div>
              {evaluation.correctAnswer && !evaluation.isCorrect && (
                <div className="mt-2 text-sm">
                  <span className="opacity-75">Correct answer: </span>
                  <span className="font-bold underline decoration-current underline-offset-2">
                    {evaluation.correctAnswer}
                  </span>
                </div>
              )}
              <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{evaluation.explanation}</p>
            </div>
          )}

          {/* Action row with Skip button and Submit/Next */}
          <div className="mt-8 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {evaluation ? 'Ready to advance' : 'Answer or skip to continue'}
            </span>

            {!evaluation ? (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted text-sm font-semibold transition"
                  title="Skip this question and reveal the answer"
                >
                  <RotateCcw size={16} />
                  <span>Skip question</span>
                </button>
                <button
                  disabled={!hasAnswer() || isEvaluating}
                  className="button-primary disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={handleCheckAnswer}
                >
                  {isEvaluating ? 'Checking…' : 'Check answer'} <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <button className="button-primary" onClick={handleNext}>
                {currentIndex + 1 < questions.length ? (
                  <>
                    Next question <ChevronRight size={18} />
                  </>
                ) : (
                  <>
                    Complete quiz <Trophy size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </section>
      )}

      {/* Quiz Completed Summary */}
      {completed && (
        <section className="panel text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-mint text-mint-foreground">
            <Trophy size={32} />
          </div>
          <p className="eyebrow mt-7 justify-center">Well done!</p>
          <h1 className="mt-3 font-heading text-3xl font-bold">Quiz Completed</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            You finished all {questions.length} questions and earned{' '}
            <span className="font-bold text-primary">+{totalXpGained} XP</span> for your progress!
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="button-primary" onClick={() => navigate('dashboard')}>
              Go to Dashboard <ChevronRight size={18} />
            </button>
            <button className="button-secondary" onClick={handleStartQuiz}>
              <RotateCcw size={16} /> Practice again
            </button>
          </div>
        </section>
      )}
    </main>
  )
}

/* ─────────────────────────────────────────────────────────────
   QUIZ HELPER COMPONENTS
───────────────────────────────────────────────────────────── */
function FlashcardWidget({
  question,
  onRate,
  evaluated,
}: {
  question: QuizQuestionItem
  onRate: (r: number) => void
  evaluated: boolean
}) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="space-y-5">
      <button
        onClick={() => setFlipped(!flipped)}
        className="w-full rounded-2xl border-2 border-border bg-card p-8 text-center transition hover:border-primary hover:bg-sky/10"
      >
        {!flipped ? (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Question (tap to flip)</p>
            <p className="font-heading text-xl font-bold">{question.title}</p>
          </>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-mint-foreground mb-3">Answer ✓</p>
            <p className="text-base leading-7 text-foreground">{question.answerText || question.explanation}</p>
          </>
        )}
      </button>
      {flipped && !evaluated && (
        <div className="space-y-2">
          <p className="text-xs text-center text-muted-foreground">How well did you know this?</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {[
              { rating: 1, label: 'Forgot', cls: 'border-pink bg-pink/10 text-pink-foreground hover:bg-pink/20' },
              { rating: 2, label: 'Hard', cls: 'border-yellow bg-yellow/10 text-yellow-foreground hover:bg-yellow/20' },
              { rating: 3, label: 'Good', cls: 'border-sky bg-sky/10 text-sky-foreground hover:bg-sky/20' },
              { rating: 4, label: 'Easy', cls: 'border-mint bg-mint/10 text-mint-foreground hover:bg-mint/20' },
              { rating: 5, label: 'Perfect', cls: 'border-mint bg-mint/20 text-mint-foreground hover:bg-mint/30 font-bold' },
            ].map(({ rating, label, cls }) => (
              <button
                key={rating}
                onClick={() => onRate(rating)}
                className={`rounded-xl border-2 px-4 py-2 text-sm transition ${cls}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function QuizHint({ hint }: { hint: string }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="mt-5">
      {!shown ? (
        <button onClick={() => setShown(true)} className="text-xs text-primary hover:underline">💡 Need a hint?</button>
      ) : (
        <div className="rounded-xl border border-sky bg-sky/10 px-4 py-3 text-sm text-sky-foreground">
          <span className="font-semibold">Hint: </span>{hint}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   REUSABLE PRESENTATIONAL COMPONENTS (100% v0 Styling)
───────────────────────────────────────────────────────────── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <p className="font-heading text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function Metric({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Flame
  value: string
  label: string
  color: string
}) {
  return (
    <div className="panel flex items-center gap-4">
      <div className={`metric-icon ${color}`}>
        <Icon size={21} />
      </div>
      <div>
        <p className="font-heading text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function CourseCard({ course, onClick }: { course: CourseItem; onClick: () => void }) {
  return (
    <button onClick={onClick} className="course-card text-left">
      <div className={`course-art ${course.tone}`}>
        <span>{course.icon}</span>
        <BookOpen size={22} />
      </div>
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{course.category}</p>
        <h3 className="mt-2 font-heading text-lg font-bold">{course.title}</h3>
        <div className="mt-5 flex justify-between text-xs text-muted-foreground">
          <span>{course.lessons}</span>
          <span className="font-bold text-foreground">{course.progress}%</span>
        </div>
        <div className="progress-track mt-2">
          <div className="progress-fill" style={{ width: `${course.progress}%` }} />
        </div>
      </div>
    </button>
  )
}

function CourseRow({ course, onClick }: { course: CourseItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition hover:bg-muted"
    >
      <div className={`mini-art ${course.tone}`}>{course.icon}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{course.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{course.lessons}</p>
        <div className="progress-track mt-2">
          <div className="progress-fill" style={{ width: `${course.progress}%` }} />
        </div>
      </div>
      <ChevronRight size={18} className="text-muted-foreground" />
    </button>
  )
}

function Badge({ icon: Icon, label }: { icon: typeof Flame; label: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-mint-foreground">
        <Icon size={21} />
      </div>
      <p className="mt-2 text-xs font-semibold">{label}</p>
    </div>
  )
}
