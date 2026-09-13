import React, { useState } from 'react';

export const MatchPairRenderer = ({
  options = [], // [{ label: 'Term', matchTarget: 'Definition' }]
  userPairs = {}, // { 'Term': 'Definition' }
  onChange,
  disabled = false,
  evaluation = null,
}) => {
  const [selectedLeft, setSelectedLeft] = useState(null);

  const leftItems = options.map((o) => o.label || o.optionText);
  const rightItems = options.map((o) => o.matchTarget || o.optionText);

  const handleLeftClick = (item) => {
    if (disabled) return;
    setSelectedLeft(item === selectedLeft ? null : item);
  };

  const handleRightClick = (target) => {
    if (disabled || !selectedLeft) return;
    const newPairs = { ...userPairs, [selectedLeft]: target };
    onChange(newPairs);
    setSelectedLeft(null);
  };

  const removePair = (left) => {
    if (disabled) return;
    const newPairs = { ...userPairs };
    delete newPairs[left];
    onChange(newPairs);
  };

  return (
    <div className="my-5 space-y-5">
      <div className="text-xs text-indigo-300 font-mono">
        ※ Click an item on the left, then click its matching definition on the right
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400">Terms:</h5>
          {leftItems.map((item, idx) => {
            const isMatched = !!userPairs[item];
            const isSelected = selectedLeft === item;

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => handleLeftClick(item)}
                className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/60 ring-2 ring-indigo-500/50 text-white'
                    : isMatched
                    ? 'border-indigo-500/40 bg-indigo-950/20 text-indigo-200'
                    : 'border-white/10 bg-slate-900/60 text-slate-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item}</span>
                  {isMatched && (
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      Linked
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400">Definitions:</h5>
          {rightItems.map((target, idx) => {
            const isAssigned = Object.values(userPairs).includes(target);

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled || !selectedLeft}
                onClick={() => handleRightClick(target)}
                className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all ${
                  selectedLeft
                    ? 'border-indigo-500/50 bg-slate-900 hover:bg-indigo-950/40 cursor-pointer text-white'
                    : isAssigned
                    ? 'border-indigo-500/30 bg-slate-900/40 text-slate-300'
                    : 'border-white/10 bg-slate-900/60 text-slate-300'
                }`}
              >
                {target}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Matched Pairs Display */}
      {Object.keys(userPairs).length > 0 && (
        <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2 mt-4">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Your Matches:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(userPairs).map(([left, right], idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-xs font-medium text-indigo-200"
              >
                <span><strong>{left}</strong> ➔ {right}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removePair(left)}
                    className="text-slate-400 hover:text-rose-400 font-bold ml-1"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
