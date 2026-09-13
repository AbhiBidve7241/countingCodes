import React, { useState } from 'react';

export const FlashcardRenderer = ({
  questionTitle,
  explanation,
  onRateAnswer,
  disabled = false,
  evaluation = null,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const ratings = [
    { score: 1, label: 'Again', desc: 'Forgot completely', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30' },
    { score: 2, label: 'Hard', desc: 'Recalled with effort', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' },
    { score: 3, label: 'Good', desc: 'Recalled with slight delay', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30' },
    { score: 4, label: 'Easy', desc: 'Instant recall', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' },
  ];

  return (
    <div className="my-6 space-y-6">
      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[260px] rounded-2xl glass-card border border-indigo-500/30 p-8 flex flex-col justify-between cursor-pointer hover:border-indigo-500/60 transition-all shadow-xl shadow-indigo-500/10 group select-none relative"
      >
        <div className="flex items-center justify-between text-xs font-mono text-indigo-400 pb-3 border-b border-white/10">
          <span>{isFlipped ? '💡 ANSWER / EXPLANATION' : '❓ FLASHCARD FRONT'}</span>
          <span className="text-slate-400 group-hover:text-white transition-colors">Click to flip 🔄</span>
        </div>

        <div className="my-auto py-6">
          {!isFlipped ? (
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-white leading-relaxed text-center">
              {questionTitle}
            </h3>
          ) : (
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-slate-100 leading-relaxed text-center font-medium">
                {explanation || 'Review the core concept thoroughly.'}
              </p>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-white/5">
          {!isFlipped ? 'Tap to reveal answer and rate memory retention' : 'Select retention difficulty below'}
        </div>
      </div>

      {/* SM-2 Rating Controls (shown after flip or when submitted) */}
      {isFlipped && !disabled && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <div className="text-xs font-mono text-center text-slate-400 uppercase tracking-wider">
            Rate Your Recall (SM-2 Spaced Repetition):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ratings.map((r) => (
              <button
                key={r.score}
                type="button"
                onClick={() => onRateAnswer(r.score)}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${r.color}`}
              >
                <div className="font-display font-bold text-base mb-0.5">{r.label}</div>
                <div className="text-[11px] opacity-80">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
