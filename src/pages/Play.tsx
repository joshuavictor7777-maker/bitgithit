import React, { useEffect, useState } from 'react';
import { BlackjackGame } from '../components/BlackjackGame';
import { StrategyCheat } from '../components/StrategyCheat';
import { CardCountDisplay } from '../components/CardCountDisplay';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff } from 'lucide-react';
import { ActionFeedback } from '../components/ActionFeedback';
import { StrategyFeedback } from '../utils/strategy';
import { BasicStrategyModal } from '../components/BasicStrategyModal';

export const Play: React.FC = () => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [showStrategy, setShowStrategy] = useState(true);
  const [showCounting, setShowCounting] = useState(false);
  const [decisionFeedback, setDecisionFeedback] = useState<StrategyFeedback | null>(null);
  const [showStrategyChart, setShowStrategyChart] = useState(false);

  useEffect(() => {
    if (!decisionFeedback) return;

    const timer = setTimeout(() => setDecisionFeedback(null), 3200);
    return () => clearTimeout(timer);
  }, [decisionFeedback]);

  return (
    <div className={`${themeClasses.bg} min-h-screen`}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-2xl font-bold ${themeClasses.text}`}>Practice Mode</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowStrategy(!showStrategy)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all text-sm ${
                showStrategy
                  ? `${themeClasses.accent} text-white`
                  : `${themeClasses.cardBg} border ${themeClasses.border} ${themeClasses.textSecondary} ${themeClasses.surfaceHover}`
              }`}
            >
              {showStrategy ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>Strategy</span>
            </button>
            <button
              onClick={() => setShowCounting(!showCounting)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all text-sm ${
                showCounting
                  ? `${themeClasses.accent} text-white`
                  : `${themeClasses.cardBg} border ${themeClasses.border} ${themeClasses.textSecondary} ${themeClasses.surfaceHover}`
              }`}
            >
              {showCounting ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>Count</span>
            </button>
            <button
              onClick={() => setShowStrategyChart(true)}
              className={`${themeClasses.cardBg} border ${themeClasses.border} ${themeClasses.text} px-3 py-1.5 rounded-lg text-sm hover:shadow-md transition`}
            >
              View Full Chart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 relative">
            <BlackjackGame onDecisionFeedback={setDecisionFeedback} />
            <div className="hidden lg:block absolute top-4 right-4 w-full max-w-sm">
              <ActionFeedback feedback={decisionFeedback} />
            </div>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <div className="lg:hidden">
              <ActionFeedback feedback={decisionFeedback} />
            </div>
            {showCounting && <CardCountDisplay />}
            {showStrategy && <StrategyCheat />}
          </div>
        </div>

        <BasicStrategyModal open={showStrategyChart} onClose={() => setShowStrategyChart(false)} />
      </div>
    </div>
  );
};