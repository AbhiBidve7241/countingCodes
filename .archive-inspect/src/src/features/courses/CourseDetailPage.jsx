import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseApi, quizApi } from '../../api';
import { useQuizStore } from '../../store/quizStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const CourseDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { initSession } = useQuizStore();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingMode, setStartingMode] = useState(null);

  useEffect(() => {
    courseApi.getCourseDetails(slug)
      .then((res) => setCourseData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleStartQuiz = async (options = {}) => {
    const modeKey = options.sessionType || 'PRACTICE';
    setStartingMode(modeKey);
    try {
      const res = await quizApi.startQuiz({
        courseId: courseData?.course?.id,
        topicId: options.topicId || null,
        sessionType: options.sessionType || 'PRACTICE',
        interviewOnly: options.interviewOnly || false,
        count: options.count || 10,
      });
      initSession(res.data);
      navigate('/quiz');
    } catch (err) {
      console.error('Quiz start error:', err);
    } finally {
      setStartingMode(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 font-mono">
        Loading syllabus tree...
      </div>
    );
  }

  const { course, modules } = courseData || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Course Header Banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 border border-indigo-500/30 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="brand">{course?.difficulty || 'BEGINNER'}</Badge>
              <span className="text-xs font-mono text-slate-400">
                {modules?.length || 0} Modules Available
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              {course?.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {course?.description}
            </p>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleStartQuiz({ sessionType: 'PRACTICE', count: 10 })}
              isLoading={startingMode === 'PRACTICE'}
              icon={<span>⚡</span>}
            >
              Practice Course
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleStartQuiz({ sessionType: 'INTERVIEW', interviewOnly: true, count: 10 })}
              isLoading={startingMode === 'INTERVIEW'}
              icon={<span>🎯</span>}
            >
              Interview Mode
            </Button>
          </div>
        </div>
      </div>

      {/* Modules & Topics Tree */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-white">
          Syllabus & Topics
        </h2>

        <div className="space-y-4">
          {modules && modules.map((m) => (
            <div
              key={m.id}
              className="glass-card rounded-2xl p-6 border border-white/10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{m.description}</p>
                </div>
                <Badge variant="neutral" size="sm">Module</Badge>
              </div>

              {/* Topics List */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {m.topics && m.topics.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col justify-between hover:border-indigo-500/30 transition-all gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{t.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{t.description}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartQuiz({ topicId: t.id, sessionType: 'PRACTICE' })}
                        className="text-indigo-400 hover:text-white text-xs px-2 py-1"
                      >
                        Practice Topic →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
