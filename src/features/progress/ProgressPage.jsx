import React, { useEffect, useState } from 'react';
import { progressApi } from '../../api';
import { BadgeCard } from '../../components/gamification/BadgeCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';

export const ProgressPage = () => {
  const [badgeData, setBadgeData] = useState({ allBadges: [], earnedBadges: [] });
  const [topicProgress, setTopicProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      progressApi.getBadges().catch(() => ({ data: { allBadges: [], earnedBadges: [] } })),
      progressApi.getTopicProgress().catch(() => ({ data: [] })),
    ])
      .then(([bRes, tRes]) => {
        setBadgeData(bRes.data || { allBadges: [], earnedBadges: [] });
        setTopicProgress(tRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const earnedBadgeIds = new Set(badgeData.earnedBadges.map((ub) => ub.badge?.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
          Progress & Achievements
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed metrics of your topic mastery, study telemetry, and badge collection
        </p>
      </div>

      {/* Badges Trophy Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <span>🏆</span> Achievement Badges ({badgeData.earnedBadges.length} / {badgeData.allBadges.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badgeData.allBadges.map((b) => (
            <BadgeCard
              key={b.id || b.slug}
              badge={b}
              isEarned={earnedBadgeIds.has(b.id)}
            />
          ))}
        </div>
      </div>

      {/* Topic Mastery Telemetry */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <span>📊</span> Topic Mastery Breakdown
        </h2>

        {topicProgress.length > 0 ? (
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
            {topicProgress.map((tp) => (
              <div key={tp.id} className="space-y-2 pb-4 border-b border-white/5 last:border-none last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{tp.topic?.title}</span>
                    <Badge
                      variant={
                        tp.masteryLevel === 'MASTERED' ? 'success' :
                        tp.masteryLevel === 'PRACTICED' ? 'brand' : 'warning'
                      }
                      size="sm"
                    >
                      {tp.masteryLevel}
                    </Badge>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {tp.correctCount} / {tp.attemptCount} correct ({tp.accuracy}%)
                  </span>
                </div>
                <ProgressBar progress={Number(tp.accuracy) || 0} height="h-2" color="indigo" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 text-center text-xs text-slate-400">
            Start taking topic quizzes to generate your mastery telemetry breakdown.
          </div>
        )}
      </div>

    </div>
  );
};
