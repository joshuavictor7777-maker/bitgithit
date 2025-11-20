import React from 'react';
import { Calculator } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useTheme } from '../contexts/ThemeContext';

export const CardCountDisplay: React.FC = () => {
  const { gameState } = useGame();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const getCountColor = (count: number) => {
    if (count > 2) return 'text-green-500';
    if (count < -2) return 'text-red-500';
    return 'text-blue-500';
  };

  return (
    <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-4`}>
      <div className="flex items-center space-x-2 mb-3">
        <Calculator className="h-5 w-5 text-green-500" />
        <h3 className={`${themeClasses.text} font-semibold`}>Card Count</h3>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className={`${themeClasses.surface} rounded-lg p-3 text-center`}>
            <div className={`text-xs ${themeClasses.textSecondary} mb-1`}>Running</div>
            <div className={`text-2xl font-bold ${getCountColor(gameState.runningCount)}`}>
              {gameState.runningCount > 0 ? '+' : ''}{gameState.runningCount}
            </div>
          </div>
          <div className={`${themeClasses.surface} rounded-lg p-3 text-center`}>
            <div className={`text-xs ${themeClasses.textSecondary} mb-1`}>True</div>
            <div className={`text-2xl font-bold ${getCountColor(gameState.trueCount)}`}>
              {gameState.trueCount > 0 ? '+' : ''}{gameState.trueCount.toFixed(1)}
            </div>
          </div>
        </div>

        <div className={`${themeClasses.surface} rounded-lg p-3`}>
          <div className={`text-xs ${themeClasses.textSecondary} mb-2`}>Deck Remaining</div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${(gameState.cardsRemaining / 312) * 100}%` }}
            />
          </div>
          <div className={`text-xs ${themeClasses.textSecondary} mt-1`}>
            {gameState.cardsRemaining}/312 cards left
          </div>
        </div>

        <div className={`text-xs ${themeClasses.text} p-2 rounded-lg ${themeClasses.surface}`}>
          {gameState.trueCount >= 2 ? '✓ Favorable' :
           gameState.trueCount <= -2 ? '✗ Unfavorable' :
           '≈ Neutral'}
        </div>
      </div>
    </div>
  );
};
