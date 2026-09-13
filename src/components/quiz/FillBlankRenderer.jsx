import React from 'react';

export const FillBlankRenderer = ({
  value = '',
  onChange,
  disabled = false,
  evaluation = null,
}) => {
  return (
    <div className="my-6 space-y-4">
      <label className="block text-xs font-mono text-indigo-300 uppercase tracking-wider">
        Type Your Answer:
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g. transient, volatile, EntityManager..."
          className={`w-full px-5 py-4 rounded-xl text-base font-mono font-medium glass-input transition-all ${
            evaluation
              ? evaluation.isCorrect
                ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'border-rose-500 bg-rose-950/30 text-rose-300 ring-2 ring-rose-500/30'
              : ''
          }`}
        />
        {evaluation && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-lg">
            {evaluation.isCorrect ? (
              <span className="text-emerald-400">✓ Correct</span>
            ) : (
              <span className="text-rose-400">✗ Incorrect</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
