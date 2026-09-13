import React from 'react';

export const DescriptiveRenderer = ({
  value = '',
  onChange,
  disabled = false,
  evaluation = null,
}) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="my-5 space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-indigo-300 uppercase tracking-wider">
        <span>Write Your Answer (Free-text / Conceptual):</span>
        <span className="text-slate-400">{wordCount} words</span>
      </div>

      <textarea
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Explain your approach or provide a detailed technical answer..."
        className="w-full p-4 rounded-xl font-sans text-sm leading-relaxed glass-input resize-y min-h-[140px]"
      />

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>💡 Be concise, name key classes/methods, and explain why.</span>
        <span>AI Evaluation will evaluate conceptual correctness.</span>
      </div>
    </div>
  );
};
