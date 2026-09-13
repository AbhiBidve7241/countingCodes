import React from 'react';

export const TrueFalseRenderer = ({
  selectedAnswer, // 'true' | 'false' or boolean
  onSelectAnswer,
  disabled = false,
  evaluation = null,
}) => {
  const isTrueSelected = selectedAnswer === 'true' || selectedAnswer === true;
  const isFalseSelected = selectedAnswer === 'false' || selectedAnswer === false;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
      {/* TRUE Card */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelectAnswer('true')}
        className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer disabled:cursor-not-allowed ${
          isTrueSelected && !evaluation
            ? 'border-indigo-500 bg-indigo-950/50 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-500/60 scale-[1.02]'
            : 'border-white/10 bg-slate-900/60 hover:border-indigo-500/40 hover:bg-slate-800/60'
        } ${
          evaluation
            ? evaluation.isCorrect && isTrueSelected
              ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/60'
              : !evaluation.isCorrect && isTrueSelected
              ? 'border-rose-500 bg-rose-950/40 ring-2 ring-rose-500/60'
              : 'opacity-50'
            : ''
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-bold">
          ✓
        </div>
        <span className="font-display font-bold text-xl text-white">TRUE</span>
      </button>

      {/* FALSE Card */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelectAnswer('false')}
        className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer disabled:cursor-not-allowed ${
          isFalseSelected && !evaluation
            ? 'border-indigo-500 bg-indigo-950/50 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-500/60 scale-[1.02]'
            : 'border-white/10 bg-slate-900/60 hover:border-indigo-500/40 hover:bg-slate-800/60'
        } ${
          evaluation
            ? evaluation.isCorrect && isFalseSelected
              ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/60'
              : !evaluation.isCorrect && isFalseSelected
              ? 'border-rose-500 bg-rose-950/40 ring-2 ring-rose-500/60'
              : 'opacity-50'
            : ''
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 text-2xl font-bold">
          ✗
        </div>
        <span className="font-display font-bold text-xl text-white">FALSE</span>
      </button>
    </div>
  );
};
