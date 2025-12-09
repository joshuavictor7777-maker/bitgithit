import React from 'react';
import { Target, Award } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { LevelBadge } from '../components/LevelBadge';

export const Stats: React.FC = () => {
  const { user } = useUser();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatNumber = (value: number) => value.toLocaleString();
  const sessionHistory = user.stats.recentSessions;

  return (
    <div className={`${themeClasses.bg} min-h-screen pb-12`}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className={`text-4xl font-bold ${themeClasses.text} mb-3`}>Your Performance</h1>
        <p className={`${themeClasses.textSecondary} mb-10`}>Track your progress and mastery across all training modes</p>

        <div className="mb-6">
          <LevelBadge />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-6`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm font-medium mb-1`}>Games Played</p>
                <p className={`text-3xl font-bold ${themeClasses.text}`}>{formatNumber(user.stats.gamesPlayed)}</p>
              </div>
              <Target className="h-6 w-6 text-blue-500 opacity-70" />
            </div>
          </div>

          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-6`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm font-medium mb-1`}>Win Rate</p>
                <p className={`text-3xl font-bold ${themeClasses.text}`}>{formatPercentage(user.stats.winRate)}</p>
              </div>
              <Award className="h-6 w-6 text-green-500 opacity-70" />
            </div>
          </div>

          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-6`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm font-medium mb-1`}>Strategy Accuracy</p>
                <p className={`text-3xl font-bold ${themeClasses.text}`}>{formatPercentage(user.stats.strategyAccuracy)}</p>
              </div>
              <Award className="h-6 w-6 text-orange-500 opacity-70" />
            </div>
          </div>
        </div>

        <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>Recent Sessions</h2>

        <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-6 mb-10`}>
          {sessionHistory.length === 0 ? (
            <p className={`${themeClasses.textSecondary} text-center py-8`}>Play a hand to start building your history.</p>
          ) : (
            <div className="space-y-3">
              {sessionHistory.slice(0, 8).map((session, index) => (
                <div key={index} className={`flex items-center justify-between p-4 ${themeClasses.surface} rounded-lg`}>
                  <div>
                    <p className={`${themeClasses.text} font-medium`}>
                      {session.result === 'win' ? 'Win' : session.result === 'loss' ? 'Loss' : 'Push'}
                    </p>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{session.handsPlayed} hands</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${
                      session.result === 'win' ? 'text-green-500' :
                      session.result === 'loss' ? 'text-red-500' : themeClasses.textSecondary
                    }`}>
                      {session.result === 'win' ? 'W' : session.result === 'loss' ? 'L' : 'P'}
                    </p>
                    <p className={`${themeClasses.textSecondary} text-sm`}>
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>Quiz Performance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-6`}>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`${themeClasses.text} font-medium`}>Basic Strategy</span>
                <span className={`${themeClasses.text} font-semibold`}>
                  {user.quizStats.basicStrategy.correct}/{user.quizStats.basicStrategy.total}
                </span>
              </div>
              <div className={`w-full ${themeClasses.surface} rounded-full h-3`}>
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${user.quizStats.basicStrategy.total > 0 ?
                      (user.quizStats.basicStrategy.correct / user.quizStats.basicStrategy.total * 100) : 0}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-6`}>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`${themeClasses.text} font-medium`}>Card Counting</span>
                <span className={`${themeClasses.text} font-semibold`}>
                  {user.quizStats.cardCounting.correct}/{user.quizStats.cardCounting.total}
                </span>
              </div>
              <div className={`w-full ${themeClasses.surface} rounded-full h-3`}>
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${user.quizStats.cardCounting.total > 0 ?
                      (user.quizStats.cardCounting.correct / user.quizStats.cardCounting.total * 100) : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {user.achievements.length > 0 && (
          <>
            <h2 className={`text-2xl font-bold ${themeClasses.text} mt-10 mb-6`}>Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.achievements.map((achievement, index) => (
                <div key={index} className={`flex items-start space-x-3 p-4 ${themeClasses.surface} rounded-lg`}>
                  <Award className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className={`${themeClasses.text} font-medium`}>{achievement.title}</h3>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
