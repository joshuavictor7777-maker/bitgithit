import React from 'react';
import { Crown, Gem, Shield, Sparkles, Star } from 'lucide-react';
import { useUser, getXpForLevel } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

const getLevelIcon = (level: number) => {
  if (level >= 20) return { icon: Gem, color: 'text-indigo-500', label: 'Mythic' };
  if (level >= 15) return { icon: Crown, color: 'text-amber-500', label: 'Elite' };
  if (level >= 10) return { icon: Star, color: 'text-yellow-500', label: 'Gold' };
  if (level >= 5) return { icon: Shield, color: 'text-slate-500', label: 'Steel' };
  return { icon: Sparkles, color: 'text-green-500', label: 'Rookie' };
};

export const LevelBadge: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { user, nextLevelXp } = useUser();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const { icon: Icon, color, label } = getLevelIcon(user.level);
  const progress = Math.min(100, Math.round((user.experience / nextLevelXp) * 100));
  const totalXpNeeded = getXpForLevel(user.level);

  if (compact) {
    return (
      <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg px-3 py-2 flex items-center space-x-2` }>
        <div className={`p-2 rounded-full ${themeClasses.cardBg} ${color.replace('text', 'bg')} bg-opacity-10`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div>
          <div className={`text-xs ${themeClasses.textSecondary}`}>{label}</div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-semibold ${themeClasses.text}`}>Lv {user.level}</span>
            <div className="w-20 h-1.5 bg-black/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-5` }>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full ${themeClasses.surface}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div>
            <p className={`text-sm font-medium ${themeClasses.textSecondary}`}>{label} Tier</p>
            <p className={`text-2xl font-bold ${themeClasses.text}`}>Level {user.level}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${themeClasses.surface} ${themeClasses.textSecondary}`}>
          {user.experience}/{totalXpNeeded} XP
        </span>
      </div>
      <div className="w-full h-3 rounded-full bg-black/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-green-500 via-emerald-400 to-blue-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
