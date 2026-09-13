'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Code2,
  Database,
  Play,
  Copy,
  Check,
  Download,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FileJson,
  Layers,
  ArrowRight,
  LogOut,
  HelpCircle,
  BookOpen,
  Sliders,
  Terminal,
  CheckCircle2,
  ChevronRight,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/store/authContext';
import { adminApi } from '@/lib/api';
import {
  safeParseJson,
  parseQuestionBatch,
  generateSqlStatements,
  detectQuestionType,
  SAMPLE_TEMPLATES,
  ParsedQuestionResult,
} from '@/lib/admin-importer';
import { QuizQuestionItem } from '@/lib/mockData';
import { Logo } from '@/components/ui/Logo';

export default function AdminPage() {
  const { user, token, login, logout } = useAuth();
  const router = useRouter();

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Importer State
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(SAMPLE_TEMPLATES.mixedBatch, null, 2)
  );
  const [selectedTopicId, setSelectedTopicId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'import' | 'sql' | 'courses' | 'ai-guide'>('import');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Topics for dynamic question assignment
  const [topics, setTopics] = useState<Array<{ id: number; title: string }>>([
    { id: 1, title: 'Core Java — Classes & Objects' },
    { id: 2, title: 'Spring Boot — Persistence Context' },
    { id: 3, title: 'SQL & Databases — Queries' },
  ]);

  // Course Management State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSlug, setNewCourseSlug] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseDifficulty, setNewCourseDifficulty] = useState('BEGINNER');
  const [newCourseTone, setNewCourseTone] = useState<'sky' | 'mint' | 'pink' | 'yellow'>('sky');
  const [newCourseModuleTitle, setNewCourseModuleTitle] = useState('Module 1: Architecture & Fundamentals');
  const [newCourseTopicTitle, setNewCourseTopicTitle] = useState('Core Concepts & Practice');
  const [courseCreating, setCourseCreating] = useState(false);

  // Platform Stats
  const [stats, setStats] = useState<{
    totalQuestions?: number;
    totalCourses?: number;
    totalTopics?: number;
    totalUsers?: number;
  }>({ totalQuestions: 23, totalCourses: 3, totalTopics: 3, totalUsers: 3 });

  // Load topics from backend
  const loadTopics = () => {
    adminApi
      .getAllTopics()
      .then((res: any) => {
        const data = res?.data?.data || res?.data || res;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((t: any) => ({
            id: t.id,
            title: t.courseTitle ? `${t.courseTitle} — ${t.title}` : t.title,
          }));
          setTopics(mapped);
        }
      })
      .catch(() => {});
  };

  // Fetch real platform stats & topics when logged in as admin
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      loadTopics();
      adminApi
        .getStats()
        .then((res: any) => {
          const data = res?.data?.data || res?.data || res;
          if (data && typeof data === 'object') {
            setStats(data);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Handle Course Creation
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    setCourseCreating(true);

    const slug =
      newCourseSlug.trim() ||
      newCourseTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const payload = {
      title: newCourseTitle.trim(),
      slug,
      description: newCourseDesc.trim() || 'Master practical skills with interactive challenges and quizzes.',
      difficulty: newCourseDifficulty,
      iconUrl: newCourseTone,
      tone: newCourseTone,
      moduleTitle: newCourseModuleTitle.trim() || 'Module 1: Architecture & Fundamentals',
      topicTitle: newCourseTopicTitle.trim() || 'Core Concepts & Practice',
    };

    try {
      const res: any = await adminApi.createCourse(payload);
      const data = res?.data?.data || res?.data || res;
      const topicId = Number(data?.topicId || Date.now() + 1);

      // Save locally as well so Learner App picks it up immediately
      try {
        const existing = JSON.parse(localStorage.getItem('learnforge_custom_courses') || '[]');
        const courseItem = {
          id: data?.courseId || Date.now(),
          slug,
          title: payload.title,
          category: 'Engineering',
          progress: 0,
          lessons: '4 of 4 lessons',
          tone: newCourseTone,
          icon: payload.title.substring(0, 2).toUpperCase(),
          difficulty: payload.difficulty,
          description: payload.description,
        };
        localStorage.setItem('learnforge_custom_courses', JSON.stringify([...existing, courseItem]));
      } catch (e) {}

      setImportMessage({
        type: 'success',
        text: `Course "${payload.title}" created successfully with initial topic "${payload.topicTitle}"! You can now import questions into it.`,
      });

      // Update dropdown & select the new topic
      const newTopic = { id: topicId, title: `${payload.title} — ${payload.topicTitle}` };
      setTopics((prev) => [...prev, newTopic]);
      setSelectedTopicId(topicId);

      // Refresh platform stats
      adminApi
        .getStats()
        .then((sRes: any) => {
          const sData = sRes?.data?.data || sRes?.data || sRes;
          if (sData) setStats(sData);
        })
        .catch(() => {
          setStats((prev) => ({
            ...prev,
            totalCourses: (prev.totalCourses || 3) + 1,
            totalTopics: (prev.totalTopics || 3) + 1,
          }));
        });

      setNewCourseTitle('');
      setNewCourseSlug('');
      setNewCourseDesc('');
    } catch (err: any) {
      // Offline fallback: save locally
      const mockCourseId = Date.now();
      const mockTopicId = mockCourseId + 1;
      try {
        const existing = JSON.parse(localStorage.getItem('learnforge_custom_courses') || '[]');
        const courseItem = {
          id: mockCourseId,
          slug,
          title: payload.title,
          category: 'Engineering',
          progress: 0,
          lessons: '4 of 4 lessons',
          tone: newCourseTone,
          icon: payload.title.substring(0, 2).toUpperCase(),
          difficulty: payload.difficulty,
          description: payload.description,
        };
        localStorage.setItem('learnforge_custom_courses', JSON.stringify([...existing, courseItem]));

        const newTopic = { id: mockTopicId, title: `${payload.title} — ${payload.topicTitle}` };
        setTopics((prev) => [...prev, newTopic]);
        setSelectedTopicId(mockTopicId);

        setImportMessage({
          type: 'success',
          text: `Course "${payload.title}" created in local course registry! Ready for questions.`,
        });
        setNewCourseTitle('');
        setNewCourseSlug('');
        setNewCourseDesc('');
      } catch (e2) {
        setImportMessage({
          type: 'error',
          text: 'Failed to create course: ' + (err?.response?.data?.message || err.message),
        });
      }
    } finally {
      setCourseCreating(false);
    }
  };

  // Parse JSON dynamically
  const parseOutcome = useMemo(() => {
    return parseQuestionBatch(jsonInput);
  }, [jsonInput]);

  // Generate SQL dynamically
  const sqlOutcome = useMemo(() => {
    return generateSqlStatements(parseOutcome.results, selectedTopicId);
  }, [parseOutcome.results, selectedTopicId]);

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      await login({ email: adminEmail, password: adminPassword });
    } catch (err: any) {
      setLoginError(err?.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  // Prettify JSON
  const handlePrettify = () => {
    const res = safeParseJson(jsonInput);
    if (res.data) {
      setJsonInput(JSON.stringify(res.data, null, 2));
      setImportMessage({ type: 'success', text: 'JSON formatted cleanly' });
    } else {
      setImportMessage({ type: 'error', text: res.error || 'Invalid JSON syntax' });
    }
  };

  // Copy SQL to Clipboard
  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlOutcome.sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Download SQL file
  const handleDownloadSql = () => {
    const blob = new Blob([sqlOutcome.sql], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learnforge_questions_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy AI Prompt
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(SAMPLE_TEMPLATES.aiPromptTemplate);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Import directly to Database (Backend API)
  const handleImportToDatabase = async () => {
    if (parseOutcome.results.length === 0) {
      setImportMessage({ type: 'error', text: 'No valid questions to import' });
      return;
    }

    setImportLoading(true);
    setImportMessage(null);

    const payload = {
      topicId: selectedTopicId,
      questions: parseOutcome.results.map((r) => r.raw),
    };

    try {
      const res: any = await adminApi.importBatchQuestions(payload);
      const data = res?.data?.data || res?.data || res;
      const count = data?.importedCount ?? parseOutcome.results.length;
      setImportMessage({
        type: 'success',
        text: `Successfully imported ${count} question(s) into database tables (questions & question_options)!`,
      });

      // Also persist to localStorage so frontend quiz immediately includes them
      try {
        const existingLocal = JSON.parse(localStorage.getItem('learnforge_custom_questions') || '[]');
        const updated = [...existingLocal, ...parseOutcome.items];
        localStorage.setItem('learnforge_custom_questions', JSON.stringify(updated));
      } catch (e) {}

      // Refresh stats
      adminApi.getStats().then((sRes: any) => {
        const sData = sRes?.data?.data || sRes?.data || sRes;
        if (sData) setStats(sData);
      });
    } catch (err: any) {
      // Fallback: save to local active pool
      const custom = parseOutcome.items;
      try {
        const existingLocal = JSON.parse(localStorage.getItem('learnforge_custom_questions') || '[]');
        const updated = [...existingLocal, ...custom];
        localStorage.setItem('learnforge_custom_questions', JSON.stringify(updated));
        setImportMessage({
          type: 'success',
          text: `Stored ${custom.length} questions into local quiz pool. (Backend offline or network error: ${err.message})`,
        });
      } catch (e) {
        setImportMessage({
          type: 'error',
          text: 'Failed to import to database: ' + (err?.response?.data?.message || err.message),
        });
      }
    } finally {
      setImportLoading(false);
    }
  };

  // Test in Quiz: Load into questions pool and launch quiz
  const handleTestInQuiz = () => {
    if (parseOutcome.items.length === 0) {
      alert('Please enter at least one valid question first.');
      return;
    }
    // Save to active test session in sessionStorage / localStorage
    localStorage.setItem('learnforge_quiz_override', JSON.stringify(parseOutcome.items));
    router.push('/?tab=quiz');
  };

  const isAdmin = !!(user && user.role === 'ADMIN');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-card/85 border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo size="sm" showText={false} />
              <div>
                <span className="font-heading font-bold text-lg text-foreground tracking-tight">CountingCodes</span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground mr-2 border-r border-border pr-4">
                  <span>
                    Questions in DB: <strong className="text-foreground">{stats.totalQuestions ?? 23}</strong>
                  </span>
                  <span>
                    Topics: <strong className="text-foreground">{stats.totalTopics ?? 3}</strong>
                  </span>
                  <span>
                    Courses: <strong className="text-foreground">{stats.totalCourses ?? 3}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
                    {user?.email}
                  </span>
                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
                  >
                    Open Learner App
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </>
            ) : (
              <Link
                href="/"
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Home
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAdmin ? (
          /* =========================================================================
             Admin Login Screen
             ========================================================================= */
          <div className="max-w-md mx-auto my-12">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold font-heading">Admin Sign In</h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Access the question insertion engine & database tools
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors"
                    placeholder="admin@countingcodes.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loginLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Enter Admin Panel</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* =========================================================================
             Authenticated Admin Dashboard & Question Importer
             ========================================================================= */
          <div className="space-y-6">
            {/* Header banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border bg-card shadow-xs">
              <div>
                <h1 className="text-2xl font-bold font-heading text-foreground">
                  Question Insertion & SQL Converter
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Paste JSON questions generated from ChatGPT, Claude, or custom sources. The engine automatically identifies types, converts them to SQL, and saves them to tables.
                </p>
              </div>

              {/* Target Topic Selection */}
              <div className="flex items-center gap-2 shrink-0 bg-muted/40 p-2 rounded-xl border border-border">
                <span className="text-xs font-semibold text-muted-foreground pl-1">Target Topic:</span>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(Number(e.target.value))}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-card border border-border text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary max-w-[280px] truncate"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notification alert */}
            {importMessage && (
              <div
                className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
                  importMessage.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-destructive/10 border-destructive/30 text-destructive'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {importMessage.type === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 shrink-0" />
                  )}
                  <span>{importMessage.text}</span>
                </div>
                <button
                  onClick={() => setImportMessage(null)}
                  className="text-xs opacity-70 hover:opacity-100 ml-4 font-semibold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('import')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors shrink-0 ${
                  activeTab === 'import'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <FileJson className="h-4 w-4" />
                JSON Importer &amp; Live Preview
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-background/20">
                  {parseOutcome.results.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors shrink-0 ${
                  activeTab === 'courses'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Course Management
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary">
                  + Add Course
                </span>
              </button>

              <button
                onClick={() => setActiveTab('sql')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors shrink-0 ${
                  activeTab === 'sql'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <Database className="h-4 w-4" />
                Generated SQL ({sqlOutcome.questionCount} Qs / {sqlOutcome.optionCount} Opts)
              </button>

              <button
                onClick={() => setActiveTab('ai-guide')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors shrink-0 ${
                  activeTab === 'ai-guide'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                AI Prompt Generator
              </button>
            </div>

            {/* TAB 1: JSON Importer & Live Inspector */}
            {activeTab === 'import' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: JSON Editor */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-bold font-heading text-foreground">
                          Question JSON Input
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setJsonInput(JSON.stringify(SAMPLE_TEMPLATES.mixedBatch, null, 2))}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Reset Sample
                        </button>
                        <button
                          type="button"
                          onClick={handlePrettify}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border hover:bg-muted text-foreground transition-colors"
                        >
                          Format JSON
                        </button>
                        <button
                          type="button"
                          onClick={() => setJsonInput('[]')}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border hover:bg-muted text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        rows={22}
                        className="w-full font-mono text-xs p-3.5 rounded-xl border border-border bg-muted/20 text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                        placeholder="Paste question JSON array or single object here..."
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        {parseOutcome.error ? (
                          <span className="text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {parseOutcome.error}
                          </span>
                        ) : (
                          <span className="text-emerald-500 flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" />
                            Valid JSON — {parseOutcome.results.length} question(s) parsed
                          </span>
                        )}
                      </div>
                      <span>{jsonInput.length} characters</span>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 pt-4 border-t border-border flex flex-wrap gap-2.5">
                      <button
                        onClick={handleImportToDatabase}
                        disabled={importLoading || parseOutcome.results.length === 0}
                        className="flex-1 min-w-[170px] py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {importLoading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Database className="h-4 w-4" />
                            <span>Save to Database (Tables)</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleTestInQuiz}
                        disabled={parseOutcome.items.length === 0}
                        className="py-2.5 px-4 rounded-xl border border-primary/30 bg-primary/10 text-primary font-medium text-xs hover:bg-primary/20 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        <Play className="h-4 w-4" />
                        <span>Test in Quiz Engine Now</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('sql')}
                        className="py-2.5 px-3 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Code2 className="h-4 w-4" />
                        <span>View SQL</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Question Card Inspector */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      Detected Questions ({parseOutcome.results.length})
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      Auto-detected from key:value pairs
                    </span>
                  </div>

                  {parseOutcome.results.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-dashed border-border bg-card text-center text-muted-foreground">
                      <FileJson className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No questions detected.</p>
                      <p className="text-xs mt-1">Paste or reset the sample JSON to see parsed cards.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
                      {parseOutcome.results.map((res, i) => {
                        const q = res.item;
                        const detected = res.detectedType;

                        const badgeStyles: Record<string, string> = {
                          MCQ_SINGLE: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25',
                          MCQ_MULTI: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25',
                          TRUE_FALSE: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/25',
                          FILL_BLANK: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
                          MATCH_PAIR: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25',
                          ARRANGE_SEQUENCE: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
                          SEQUENCE: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
                          CODE_COMPLETION: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25',
                          COMPLETE_CODE: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25',
                          FLASHCARD: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/25',
                        };

                        const badgeClass = badgeStyles[detected] || 'bg-muted text-muted-foreground border-border';

                        return (
                          <div
                            key={i}
                            className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-primary/40 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                  {i + 1}
                                </span>
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                                  {detected}
                                </span>
                              </div>
                              <span className="text-[11px] text-muted-foreground">
                                +{q?.xpReward ?? 10} XP
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-foreground leading-snug">
                              {q?.title || 'Untitled Question'}
                            </p>

                            {/* Details by Type */}
                            <div className="mt-2.5 pt-2.5 border-t border-border/50 text-[11px] text-muted-foreground space-y-1">
                              {/* MCQ Options */}
                              {['MCQ_SINGLE', 'MCQ_MULTI'].includes(detected) && q?.options && (
                                <div className="grid grid-cols-2 gap-1.5 mt-1">
                                  {q.options.map((opt, oIdx) => (
                                    <div
                                      key={oIdx}
                                      className={`px-2 py-1 rounded-md border text-[10px] truncate ${
                                        opt.isCorrect
                                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                                          : 'border-border bg-muted/20'
                                      }`}
                                    >
                                      {opt.isCorrect ? '✓ ' : '• '}
                                      {opt.text}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Fill Blank */}
                              {detected === 'FILL_BLANK' && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-foreground">Accepted Answer(s):</span>
                                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                                    {(q?.correctAnswers || [q?.correctAnswer]).join(', ')}
                                  </span>
                                </div>
                              )}

                              {/* True/False */}
                              {detected === 'TRUE_FALSE' && (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-foreground">Correct Value:</span>
                                  <span
                                    className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                                      q?.correctAnswer === 'True'
                                        ? 'bg-emerald-500/15 text-emerald-500'
                                        : 'bg-rose-500/15 text-rose-500'
                                    }`}
                                  >
                                    {q?.correctAnswer}
                                  </span>
                                </div>
                              )}

                              {/* Match Pairs */}
                              {detected === 'MATCH_PAIR' && q?.options && (
                                <div className="space-y-1 mt-1">
                                  {q.options.map((opt, pIdx) => (
                                    <div
                                      key={pIdx}
                                      className="flex items-center justify-between px-2 py-1 rounded bg-muted/30 text-[10px]"
                                    >
                                      <span className="font-medium text-foreground">{opt.label}</span>
                                      <span className="text-muted-foreground">↔</span>
                                      <span className="text-primary font-medium">{opt.matchTarget}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Sequence */}
                              {['ARRANGE_SEQUENCE', 'SEQUENCE'].includes(detected) && q?.correctSequence && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {q.correctSequence.map((step, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-foreground flex items-center gap-1"
                                    >
                                      <span className="opacity-50">{sIdx + 1}.</span> {step}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Code Completion */}
                              {['CODE_COMPLETION', 'COMPLETE_CODE'].includes(detected) && (
                                <div>
                                  {q?.codeSnippet && (
                                    <pre className="p-1.5 rounded bg-muted/40 font-mono text-[10px] text-foreground mb-1 overflow-x-auto">
                                      {q.codeSnippet}
                                    </pre>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold text-foreground">Expected Token:</span>
                                    <code className="text-primary font-mono text-[10px] bg-primary/10 px-1 rounded">
                                      {q?.correctAnswer}
                                    </code>
                                  </div>
                                </div>
                              )}

                              {/* Flashcard */}
                              {detected === 'FLASHCARD' && q?.answerText && (
                                <div className="p-2 rounded bg-muted/20 border border-border/50 text-[10px]">
                                  <span className="font-semibold text-foreground">Answer / Explanation: </span>
                                  {q.answerText}
                                </div>
                              )}

                              {/* Explanation */}
                              {q?.explanation && detected !== 'FLASHCARD' && (
                                <p className="text-[10px] text-muted-foreground italic truncate">
                                  Note: {q.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SQL Output */}
            {activeTab === 'sql' && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                  <div>
                    <h2 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      Generated SQL Script
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Ready to execute in MySQL Workbench, CLI, or Flyway migration. Targets `questions` and `question_options` tables.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySql}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      {copiedSql ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedSql ? 'Copied to Clipboard' : 'Copy SQL'}</span>
                    </button>

                    <button
                      onClick={handleDownloadSql}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors flex items-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download .sql</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <pre className="p-4 rounded-xl border border-border bg-muted/30 font-mono text-xs text-foreground overflow-x-auto max-h-[600px] leading-relaxed">
                    {sqlOutcome.sql}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 3: AI Prompt Generator Guide */}
            {activeTab === 'ai-guide' && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                  <div>
                    <h2 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI Prompt Template for Question Generation
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Copy this prompt into ChatGPT, Claude, or DeepSeek to have it generate perfectly structured JSON ready for CountingCodes.
                    </p>
                  </div>

                  <button
                    onClick={handleCopyPrompt}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
                  >
                    {copiedPrompt ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedPrompt ? 'Prompt Copied!' : 'Copy AI Prompt'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <pre className="font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                    {SAMPLE_TEMPLATES.aiPromptTemplate}
                  </pre>
                </div>

                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    How to use with any AI tool:
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 pl-1">
                    <li>Copy the prompt template above.</li>
                    <li>Paste it into ChatGPT, Claude, Gemini, or any LLM, and append your subject topic (e.g., <em>&quot;Generate 10 questions on Java Spring Security&quot;</em>).</li>
                    <li>Copy the resulting JSON response.</li>
                    <li>Paste it directly into the <strong>JSON Importer</strong> tab and click <strong>&quot;Save to Database&quot;</strong>.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB: Course Management & Creation */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Course Creation Form */}
                  <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <PlusCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold font-heading text-foreground">
                          Create New Course &amp; Topic
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          Register a new subject in the curriculum. Creates the course, module, and initial topic in the database.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleCreateCourse} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                          Course Title <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newCourseTitle}
                          onChange={(e) => {
                            setNewCourseTitle(e.target.value);
                            if (!newCourseSlug || newCourseSlug === newCourseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) {
                              setNewCourseSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
                            }
                          }}
                          placeholder="e.g. Next.js & React 19 Fullstack"
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Course Slug (URL identifier)
                          </label>
                          <input
                            type="text"
                            value={newCourseSlug}
                            onChange={(e) => setNewCourseSlug(e.target.value)}
                            placeholder="e.g. nextjs-react-19"
                            className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-border bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Difficulty Level
                          </label>
                          <select
                            value={newCourseDifficulty}
                            onChange={(e) => setNewCourseDifficulty(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          >
                            <option value="BEGINNER">BEGINNER</option>
                            <option value="INTERMEDIATE">INTERMEDIATE</option>
                            <option value="ADVANCED">ADVANCED</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={newCourseDesc}
                          onChange={(e) => setNewCourseDesc(e.target.value)}
                          placeholder="Brief summary of what learners will master in this track..."
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                          Theme Color (Tone)
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {(['sky', 'mint', 'pink', 'yellow'] as const).map((t) => (
                            <button
                              type="button"
                              key={t}
                              onClick={() => setNewCourseTone(t)}
                              className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition flex items-center justify-center gap-1.5 ${
                                newCourseTone === t
                                  ? 'border-primary ring-2 ring-primary/30 bg-muted font-bold'
                                  : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
                              }`}
                            >
                              <span
                                className={`h-3 w-3 rounded-full ${
                                  t === 'sky'
                                    ? 'bg-sky-400'
                                    : t === 'mint'
                                    ? 'bg-emerald-400'
                                    : t === 'pink'
                                    ? 'bg-pink-400'
                                    : 'bg-amber-400'
                                }`}
                              />
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Initial Module Name
                          </label>
                          <input
                            type="text"
                            value={newCourseModuleTitle}
                            onChange={(e) => setNewCourseModuleTitle(e.target.value)}
                            placeholder="e.g. Module 1: Core Fundamentals"
                            className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Initial Topic Name (for Questions)
                          </label>
                          <input
                            type="text"
                            value={newCourseTopicTitle}
                            onChange={(e) => setNewCourseTopicTitle(e.target.value)}
                            placeholder="e.g. State & Effects"
                            className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={courseCreating || !newCourseTitle.trim()}
                          className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                          {courseCreating ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <PlusCircle className="h-4 w-4" />
                              <span>Create &amp; Register Course</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Live Preview & Guidance */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Learner Catalog Preview
                      </h3>

                      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <div
                          className={`flex h-28 items-center justify-between p-5 font-heading text-3xl font-extrabold ${
                            newCourseTone === 'sky'
                              ? 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200'
                              : newCourseTone === 'mint'
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                              : newCourseTone === 'pink'
                              ? 'bg-pink-100 text-pink-900 dark:bg-pink-950 dark:text-pink-200'
                              : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                          }`}
                        >
                          <span>{(newCourseTitle || 'New Course').substring(0, 3).toUpperCase()}</span>
                          <BookOpen className="h-8 w-8 opacity-40" />
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-primary">{newCourseDifficulty}</span>
                            <span className="text-muted-foreground">0 of 4 lessons</span>
                          </div>
                          <h4 className="font-heading font-bold text-base text-foreground">
                            {newCourseTitle || 'Untitled Course'}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {newCourseDesc || 'Master practical skills with interactive challenges and quizzes.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Workflow Integration
                      </h3>
                      <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside leading-relaxed">
                        <li>
                          Fill the title and optional details, then click <strong>&quot;Create &amp; Register Course&quot;</strong>.
                        </li>
                        <li>
                          The new topic is automatically selected in the <strong>Target Topic</strong> dropdown above.
                        </li>
                        <li>
                          Switch to the <strong>JSON Importer</strong> tab and paste your questions batch to populate the course.
                        </li>
                        <li>
                          Open the Learner App to quiz on your newly generated course!
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Existing Courses & Topics */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div>
                      <h3 className="text-base font-bold font-heading text-foreground">
                        All Registered Topics &amp; Courses ({topics.length})
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Select any topic to instantly set it as the import target for questions.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {topics.map((t) => {
                      const isSelected = selectedTopicId === t.id;
                      return (
                        <div
                          key={t.id}
                          className={`p-4 rounded-xl border transition flex items-center justify-between ${
                            isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border bg-card hover:border-border/80 hover:bg-muted/30'
                          }`}
                        >
                          <div className="min-w-0 pr-3">
                            <p className="text-xs font-bold text-foreground truncate">{t.title}</p>
                            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">Topic ID: {t.id}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTopicId(t.id);
                              setActiveTab('import');
                              setImportMessage({
                                type: 'success',
                                text: `Selected target topic: "${t.title}". Ready to import questions!`,
                              });
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border bg-card hover:bg-muted text-foreground'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Use Topic'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
