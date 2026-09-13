import React from 'react';

export const CodeCompletionRenderer = ({
  codeSnippet = '',
  codeLanguage = 'java',
  value = '',
  onChange,
  disabled = false,
  evaluation = null,
}) => {
  return (
    <div className="my-5 space-y-4">
      {/* Code Snippet Box */}
      {codeSnippet && (
        <div className="rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-sm overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 mb-2 border-b border-white/5">
            <span className="uppercase font-semibold text-indigo-400">{codeLanguage}</span>
            <span>Snippet</span>
          </div>
          <pre className="text-slate-200 leading-relaxed whitespace-pre-wrap font-mono">
            {codeSnippet}
          </pre>
        </div>
      )}

      {/* Input Slot */}
      <div className="space-y-2">
        <label className="block text-xs font-mono text-indigo-300 uppercase tracking-wider">
          Complete the Missing Code / Token:
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Type the missing code snippet..."
          className="w-full px-4 py-3 rounded-xl font-mono text-sm glass-input"
        />
      </div>
    </div>
  );
};
