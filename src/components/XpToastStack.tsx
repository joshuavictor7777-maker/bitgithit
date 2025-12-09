import React, { useEffect } from 'react';
import { ArrowBigUp, Sparkles } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

export const XpToastStack: React.FC = () => {
  const { xpGains, dismissXpGain } = useUser();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  useEffect(() => {
    if (xpGains.length === 0) return;
    const timers = xpGains.map(gain => setTimeout(() => dismissXpGain(gain.id), 2200));
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [xpGains, dismissXpGain]);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 w-60">
      {xpGains.map(gain => (
        <div
          key={gain.id}
          className={`${themeClasses.cardBg} border ${themeClasses.border} shadow-xl rounded-lg px-3 py-2 flex items-center space-x-3 animate-slide-up`}
        >
          <div className="relative">
            <div className="absolute inset-0 blur-lg bg-emerald-400 opacity-30" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600">
              {gain.levelUp ? <ArrowBigUp className="h-6 w-6" /> : <Sparkles className="h-5 w-5" />}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-emerald-600">+{gain.amount} XP</div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              {gain.levelUp ? 'Level Up!' : gain.reason || 'Progress earned'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
