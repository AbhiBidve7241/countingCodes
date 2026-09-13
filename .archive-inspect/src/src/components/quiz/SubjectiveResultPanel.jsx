import React from 'react';

export const SubjectiveResultPanel = ({ evaluation }) => {
  if (!evaluation) return null;

  const {
    aiAvailable,
    correctnessPct,
    missingConcepts,
    improvedAnswer,
    interviewVersion,
    briefFeedback,
    modelAnswer,
    selfAssessPrompt,
    xpEarned,
  } = evaluation;

  return (
    <div className="rounded-2xl p-6 border border-indigo-500/30 bg-slate-900/80 my-6 space-y-6 shadow-xl shadow-indigo-500/10 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
            ✨
          </div>
          <div>
            <h4 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <span>{aiAvailable ? 'AI Conceptual Evaluation' : 'Model Answer & Self Assessment'}</span>
              {aiAvailable ? (
                <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-normal">
                  Groq LLM Active
                </span>
              ) : (
                <span className="text-[11px] font-mono bg-slate-800 text-slate-400 border border-white/10 px-2 py-0.5 rounded-full font-normal">
                  Standby Mode
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400">
              {aiAvailable
                ? 'Automated feedback generated for descriptive mastery.'
                : 'Compare your thoughts with the reference answer below.'}
            </p>
          </div>
        </div>

        {xpEarned > 0 && (
          <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs">
            ⚡ +{xpEarned} XP
          </div>
        )}
      </div>

      {/* When AI is available */}
      {aiAvailable && (
        <div className="space-y-5">
          {/* Score & Brief Feedback */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center bg-slate-950/60 p-4 rounded-xl border border-white/5">
            <div className="text-center sm:border-r border-white/10 sm:pr-4">
              <div className="text-xs font-mono text-slate-400 uppercase">Coverage</div>
              <div className="text-3xl font-display font-extrabold gradient-text-brand">
                {correctnessPct !== null ? `${correctnessPct}%` : 'N/A'}
              </div>
            </div>
            <div className="sm:col-span-3 text-sm text-slate-200 leading-relaxed">
              {briefFeedback || 'Solid foundational understanding demonstrated.'}
            </div>
          </div>

          {/* Missing Concepts */}
          {missingConcepts && missingConcepts.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-300">
                Key Concepts to Include:
              </div>
              <div className="flex flex-wrap gap-2">
                {missingConcepts.map((c, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-medium"
                  >
                    + {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interview-Ready Polished Answer */}
          {interviewVersion && (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-semibold flex items-center gap-1.5">
                <span>🎯</span> Interview-Ready Delivery:
              </div>
              <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                "{interviewVersion}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Model Answer (always shown or fallback) */}
      {(modelAnswer || (!aiAvailable && selfAssessPrompt)) && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Reference Answer & Benchmark:
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-slate-200 leading-relaxed font-sans">
            {modelAnswer || selfAssessPrompt}
          </div>
        </div>
      )}
    </div>
  );
};
