import React from 'react';
import { Target, AlertCircle } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useTheme } from '../contexts/ThemeContext';
import { getStrategyRecommendation } from '../utils/strategy';

export const StrategyCheat: React.FC = () => {
  const { gameState } = useGame();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const recommendation = getStrategyRecommendation(gameState);

  return (
    <div className={`${themeClasses.cardBg} backdrop-blur-sm border ${themeClasses.border} rounded-xl p-6 shadow-lg`}>
      <h3 className={`${themeClasses.text} text-lg font-semibold mb-4 flex items-center`}>
        <Target className="h-5 w-5 mr-2 text-green-500" />
        Strategy Recommendation
      </h3>
      
      <div className="space-y-4">
        <div className={`${themeClasses.surface} rounded-lg p-4`}>
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <span className={`${themeClasses.text} font-medium`}>Optimal Play</span>
          </div>
          <div className={`text-2xl font-bold ${recommendation.color} mb-2`}>
            {recommendation.action}
          </div>
          <p className={`${themeClasses.textSecondary} text-sm`}>{recommendation.reason}</p>
          <div className="mt-2">
            <span className={`text-xs ${themeClasses.surface} text-green-700 px-2 py-1 rounded`}>
              Confidence: {recommendation.confidence}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className={`${themeClasses.text} font-medium text-sm`}>Action Legend</h4>
          <div className={`text-xs ${themeClasses.textSecondary}`}>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div className="bg-orange-500/20 p-1 rounded text-orange-700">Hit</div>
              <div className="bg-green-500/20 p-1 rounded text-green-700">Stand</div>
              <div className="bg-blue-500/20 p-1 rounded text-blue-700">Double</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};