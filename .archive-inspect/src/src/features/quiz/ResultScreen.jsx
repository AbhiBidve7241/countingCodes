import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../../store/quizStore';
import { Button } from '../../components/common/Button';

export const ResultScreen = ({ summary }) => {
  const navigate = useNavigate();
  const { resetQuiz } = useQuizStore();

  const handleReturnDashboard = () => {
    resetQuiz();
    navigate('/dashboard');
  };

  const handleExploreCourses = () => {
    resetQuiz();
    navigate('/courses');
  };

  const isPerfect = summary.accuracyPct === 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-indigo-500/30 text-center space-y-8 shadow-2xl relative overflow-hidden">
        
        {/* Trophy / Medal Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-1 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-bounce">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-4xl">
              {isPerfect ? '🏆' : '⭐'}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            {isPerfect ? 'Perfect Score!' : 'Session Complete!'}
          </h2>
          <p className="text-sm text-slate-300">
            {isPerfect
              ? 'Flawless execution! All engineering concepts answered correctly.'
              : 'Consistent practice cements deep knowledge and mastery.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
            <div className="text-xs font-mono text-slate-400 uppercase">Accuracy</div>
            <div className="text-2xl font-display font-black text-emerald-400">
              {summary.accuracyPct}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
            <div className="text-xs font-mono text-slate-400 uppercase">Score</div>
            <div className="text-2xl font-display font-black text-white">
              {summary.score} / {summary.totalQuestions}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
            <div className="text-xs font-mono text-slate-400 uppercase">XP Gained</div>
            <div className="text-2xl font-display font-black text-amber-400 flex items-center justify-center gap-1">
              <span>⚡</span> +{summary.xpEarned}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
            <div className="text-xs font-mono text-slate-400 uppercase">Streak</div>
            <div className="text-2xl font-display font-black text-orange-400 flex items-center justify-center gap-1">
              <span>🔥</span> {summary.currentStreak}d
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/10">
          <Button
            variant="primary"
            size="lg"
            onClick={handleReturnDashboard}
            className="w-full sm:w-auto font-display"
          >
            Return to Dashboard
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleExploreCourses}
            className="w-full sm:w-auto font-display"
          >
            Explore Next Topic
          </Button>
        </div>

      </div>
    </div>
  );
};
