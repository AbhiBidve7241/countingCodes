import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseApi } from '../../api';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    courseApi.getAllCourses()
      .then((res) => setCourses(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter((c) => {
    if (filter === 'ALL') return true;
    return c.difficulty === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Engineering Tracks
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Comprehensive computer science and software engineering syllabi
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-white/10 self-start">
          {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((c) => (
          <Card
            key={c.slug}
            onClick={() => navigate(`/courses/${c.slug}`)}
            className="flex flex-col justify-between group border-white/10 hover:border-indigo-500/50"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {c.slug.includes('java') ? '☕' : c.slug.includes('spring') ? '🍃' : '🗄️'}
                </div>
                <Badge variant={c.difficulty === 'ADVANCED' ? 'danger' : 'brand'}>
                  {c.difficulty || 'BEGINNER'}
                </Badge>
              </div>

              <div>
                <h3 className="text-xl font-display font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {c.description}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400">● Interactive Bank</span>
              <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                Explore Modules →
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
