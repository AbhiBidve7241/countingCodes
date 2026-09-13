import React from 'react';

export const ObjectiveResultPanel = ({ evaluation, explanation }) => {
  if (!evaluation) return null;

  const isCorrect = evaluation.isCorrect;

  return (
    <div
      className={`rounded-2xl p-6 border transition-all my-6 animate-in fade-in slide-in-from-bottom-3 duration-300 ${
        isCorrect
          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100 shadow-lg shadow-emerald-500/10'
          : 'bg-rose-950/40 border-rose-500/40 text-rose-100 shadow-lg shadow-rose-500/10'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl ${
              isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
            }`}
          >
            {isCorrect ? '✓' : '✗'}
          </div>
          <div>
            <h4 className="font-display font-bold text-lg text-white">
              {isCorrect ? 'Correct Solution!' : 'Not Quite Right'}
            </h4>
            <p className="text-xs opacity-80">
              {isCorrect ? 'Great job analyzing this problem.' : 'Review the breakdown below to reinforce your understanding.'}
            </p>
          </div>
        </div>

        {evaluation.xpEarned > 0 && (
          <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs flex items-center gap-1">
            ⚡ +{evaluation.xpEarned} XP
          </div>
        )}
      </div>

      {/* Explanation Section */}
      {explanation && (
        <div className="pt-4 border-t border-white/10 mt-2 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-70">
            Explanation:
          </span>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};
