import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressApi, revisionApi } from '../../api';
import { useQuizStore } from '../../store/quizStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const RevisionPage = () => {
  const navigate = useNavigate();
  const { initSession } = useQuizStore();

  const [weakAreas, setWeakAreas] = useState({ weakTopics: [], weakQuestions: [] });
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    Promise.all([
      progressApi.getWeakAreas().catch(() => ({ data: { weakTopics: [], weakQuestions: [] } })),
      progressApi.getBookmarks('revision').catch(() => ({ data: [] })),
    ])
      .then(([weakRes, bookRes]) => {
        setWeakAreas(weakRes.data || { weakTopics: [], weakQuestions: [] });
        setBookmarks(bookRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStartSmartRevision = async () => {
    setIsStarting(true);
    try {
      const res = await revisionApi.startSmartRevision(10);
      initSession(res.data);
      navigate('/quiz');
    } catch (e) {
      console.error('Failed to start smart revision:', e);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
            <span>🧠 SM-2 SPACED REPETITION ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Smart Revision Hub
          </h1>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Personalized algorithmic review sessions that automatically adapt to your memory decay curve, weak questions, and bookmarks.
          </p>
        </div>

        <Button
          variant="success"
          size="lg"
          onClick={handleStartSmartRevision}
          isLoading={isStarting}
          icon={<span>⚡</span>}
          className="shadow-xl shadow-emerald-500/20"
        >
          Launch Smart Revision (10 Qs)
        </Button>
      </div>

      {/* Weak Topics Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <span>⚠️</span> Weak Topics Under Review
        </h2>

        {weakAreas.weakTopics && weakAreas.weakTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weakAreas.weakTopics.map((item, idx) => (
              <Card key={idx} className="border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white text-sm">{item.topic?.title || 'Core Topic'}</h4>
                  <Badge variant="warning">{item.accuracy}% Accuracy</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {item.attemptCount} attempts • {item.correctCount} correct
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 text-center text-xs text-slate-400">
            No critical weak topics identified yet. Keep practicing to build learning telemetry!
          </div>
        )}
      </div>

      {/* Bookmarked Questions */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <span>★</span> Bookmarked Questions ({bookmarks.length})
        </h2>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarks.map((b) => (
              <Card key={b.id} className="border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="brand" size="sm">{b.question?.questionType}</Badge>
                  <span className="text-xs text-amber-400 font-mono">Bookmarked</span>
                </div>
                <h4 className="text-sm font-medium text-slate-200">{b.question?.title}</h4>
                {b.note && <p className="text-xs text-slate-400 italic">"{b.note}"</p>}
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 text-center text-xs text-slate-400">
            You haven't bookmarked any questions yet. Tap the star icon on any question during a quiz to save it here.
          </div>
        )}
      </div>

    </div>
  );
};
