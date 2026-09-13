import React from 'react';

export const SequenceRenderer = ({
  items = [],
  sequence = [], // current order array of strings
  onChange,
  disabled = false,
  evaluation = null,
}) => {
  const currentItems = sequence.length > 0 ? sequence : items;

  const moveItem = (fromIdx, toIdx) => {
    if (disabled || toIdx < 0 || toIdx >= currentItems.length) return;
    const newItems = [...currentItems];
    const [moved] = newItems.splice(fromIdx, 1);
    newItems.splice(toIdx, 0, moved);
    onChange(newItems);
  };

  return (
    <div className="my-5 space-y-3">
      <div className="text-xs text-indigo-300 font-mono">
        ※ Arrange items in the correct execution or logical order:
      </div>

      <div className="space-y-2.5">
        {currentItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-sm font-medium text-slate-100">{item}</span>
            </div>

            {!disabled && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, idx - 1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800 flex items-center justify-center text-xs"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={idx === currentItems.length - 1}
                  onClick={() => moveItem(idx, idx + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800 flex items-center justify-center text-xs"
                >
                  ▼
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
