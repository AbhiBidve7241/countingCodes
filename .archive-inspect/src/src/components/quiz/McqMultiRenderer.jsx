import React from 'react';

export const McqMultiRenderer = ({
  options = [],
  selectedAnswer = [], // array of selected labels or strings
  onSelectAnswer,
  disabled = false,
  evaluation = null,
}) => {
  const currentSelections = Array.isArray(selectedAnswer) ? selectedAnswer : [];

  const handleToggle = (optVal) => {
    if (disabled) return;
    if (currentSelections.includes(optVal)) {
      onSelectAnswer(currentSelections.filter((v) => v !== optVal));
    } else {
      onSelectAnswer([...currentSelections, optVal]);
    }
  };

  return (
    <div className="space-y-3 my-4">
      <div className="text-xs text-indigo-300/80 font-mono mb-2">
        ※ Select all matching options
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((opt, idx) => {
          const optionVal = opt.label || opt.optionText;
          const isSelected = currentSelections.includes(optionVal);

          let cardStyle = 'border-white/10 bg-slate-900/60 hover:border-indigo-500/40 hover:bg-slate-800/60';
          let checkStyle = 'border-white/20 bg-slate-800 text-transparent';

          if (isSelected && !evaluation) {
            cardStyle = 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500/50';
            checkStyle = 'border-indigo-500 bg-indigo-600 text-white';
          }

          const correctAnswersList = evaluation?.correctAnswer
            ? evaluation.correctAnswer.split(',').map((s) => s.trim().toLowerCase())
            : [];

          const isThisOptionCorrect = evaluation && (
            correctAnswersList.includes(opt.optionText.trim().toLowerCase()) ||
            (opt.label && correctAnswersList.includes(opt.label.trim().toLowerCase())) ||
            (opt.id && correctAnswersList.includes(String(opt.id))) ||
            opt.isCorrect
          );

          if (evaluation) {
            if (isThisOptionCorrect) {
              cardStyle = 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/50';
              checkStyle = 'border-emerald-500 bg-emerald-600 text-white';
            } else if (isSelected && !isThisOptionCorrect) {
              cardStyle = 'border-rose-500 bg-rose-950/40 ring-1 ring-rose-500/50';
              checkStyle = 'border-rose-500 bg-rose-600 text-white';
            } else {
              cardStyle = 'border-slate-800/60 bg-slate-950/40 opacity-50';
            }
          }

          return (
            <button
              key={opt.id || idx}
              type="button"
              disabled={disabled}
              onClick={() => handleToggle(optionVal)}
              className={`w-full text-left p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${cardStyle}`}
            >
              <div className="flex items-center gap-3.5 flex-1">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${checkStyle}`}>
                  ✓
                </div>
                <span className="text-sm font-medium text-slate-100 leading-relaxed">
                  {opt.optionText}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
