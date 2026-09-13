import React from 'react';
import { Badge } from '../common/Badge';

export const BadgeCard = ({
  badge,
  isEarned = false,
  earnedAt = null,
}) => {
  const rarityVariants = {
    LEGENDARY: 'legendary',
    EPIC: 'epic',
    RARE: 'rare',
    COMMON: 'common',
  };

  const rarityBorders = {
    LEGENDARY: 'border-amber-400/40 bg-gradient-to-br from-amber-500/10 to-purple-500/10 shadow-amber-500/15',
    EPIC: 'border-purple-400/40 bg-purple-500/10 shadow-purple-500/15',
    RARE: 'border-sky-400/40 bg-sky-500/10 shadow-sky-500/15',
    COMMON: 'border-slate-700 bg-slate-800/40',
  };

  return (
    <div
      className={`glass-card rounded-2xl p-5 border relative overflow-hidden transition-all duration-300 ${
        isEarned
          ? `${rarityBorders[badge.rarity] || rarityBorders.COMMON} shadow-lg hover:scale-[1.02]`
          : 'opacity-40 grayscale border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
          {badge.iconUrl || '🎖️'}
        </div>
        <Badge variant={rarityVariants[badge.rarity] || 'neutral'} size="sm">
          {badge.rarity}
        </Badge>
      </div>

      <h4 className="font-display font-bold text-base text-white mb-1">{badge.title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed mb-3">{badge.description}</p>

      <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
        <span className="text-amber-300 font-mono font-semibold">+{badge.xpReward} XP</span>
        {isEarned && (
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span>✓</span> Unlocked
          </span>
        )}
      </div>
    </div>
  );
};
