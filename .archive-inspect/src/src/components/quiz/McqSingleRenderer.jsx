import React from 'react';

export const McqSingleRenderer = ({
  options = [],
  selectedAnswer,
  onSelectAnswer,
  disabled = false,
  evaluation = null,
}) => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="grid grid-cols-1 gap-3.5 my-4">
      {options.map((opt, idx) => {
        const optionVal = opt.label || opt.optionText;
        const isSelected = selectedAnswer === optionVal || selectedAnswer === String(opt.id);

        let cardStyle = 'border-white/10 bg-slate-900/60 hover:border-indigo-500/40 hover:bg-slate-800/60';
        let badgeStyle = 'bg-slate-800 text-slate-300 border-white/10';

        if (isSelected && !evaluation) {
          cardStyle = 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-500/15 ring-1 ring-indigo-500/50';
          badgeStyle = 'bg-indigo-600 text-white border-indigo-400';
        }

        const isThisOptionCorrect = evaluation && (
          opt.optionText === evaluation.correctAnswer ||
          opt.label === evaluation.correctAnswer ||
          (opt.id && String(opt.id) === String(evaluation.correctAnswer)) ||
          opt.isCorrect
        );

        // Post-evaluation styling
        if (evaluation) {
          if (isThisOptionCorrect) {
            cardStyle = 'border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-500/15 ring-1 ring-emerald-500/50';
            badgeStyle = 'bg-emerald-600 text-white border-emerald-400';
          } else if (isSelected && !evaluation.isCorrect) {
            cardStyle = 'border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-500/15 ring-1 ring-rose-500/50';
            badgeStyle = 'bg-rose-600 text-white border-rose-400';
          } else {
            cardStyle = 'border-slate-800/60 bg-slate-950/40 opacity-50';
          }
        }

        return (
          <button
            key={opt.id || idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectAnswer(optionVal)}
            className={`w-full text-left p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${cardStyle}`}
          >
            <div className="flex items-center gap-3.5 flex-1">
              <span className={`w-8 h-8 rounded-lg border font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 transition-colors ${badgeStyle}`}>
                {letters[idx] || idx + 1}
              </span>
              <span className="text-sm font-medium text-slate-100 leading-relaxed">
                {opt.optionText}
              </span>
            </div>

            {/* Indicator Icon */}
            {evaluation && isThisOptionCorrect && (
              <span className="text-emerald-400 font-bold text-lg flex-shrink-0">✓</span>
            )}
            {evaluation && isSelected && !evaluation.isCorrect && (
              <span className="text-rose-400 font-bold text-lg flex-shrink-0">✗</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
