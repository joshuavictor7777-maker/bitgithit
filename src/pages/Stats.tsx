import React, { useMemo } from 'react';
import { Target, Calculator, Award, History, BarChart } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

export const Stats: React.FC = () => {
  const { user } = useUser();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatNumber = (value: number) => value.toLocaleString();

  const sessionHistory = user.stats.recentSessions;
  const totalHandsTracked = sessionHistory.reduce((total, session) => total + session.handsPlayed, 0);
  const recentWinRate = sessionHistory.length
    ? sessionHistory.filter(session => session.result === 'win').length / sessionHistory.length
    : 0;
  const recentPushRate = sessionHistory.length
    ? sessionHistory.filter(session => session.result === 'push').length / sessionHistory.length
    : 0;
  const lifetimeWins = Math.round(user.stats.gamesPlayed * user.stats.winRate);
  const lifetimePushes = Math.round(user.stats.gamesPlayed * recentPushRate);
  const lifetimeLosses = Math.max(user.stats.gamesPlayed - lifetimeWins - lifetimePushes, 0);
  const averageHandsPerSession = sessionHistory.length ? totalHandsTracked / sessionHistory.length : 0;
  const lastPlayedDate = sessionHistory[0]?.date;
  const longestWinStreak = useMemo(() => {
    return sessionHistory.reduce(
      (acc, session) => {
        const current = session.result === 'win' ? acc.current + 1 : 0;
        return {
          current,
          best: Math.max(acc.best, current)
        };
      },
      { current: 0, best: 0 }
    ).best;
  }, [sessionHistory]);

  return (
    <div className={`${themeClasses.bg} min-h-screen`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className={`text-3xl font-bold ${themeClasses.text} mb-8`}>Performance Analytics</h1>
        <p className={`${themeClasses.textSecondary} max-w-3xl mb-10`}>
          Every time you complete a hand in the Play tab, the game reducer records the outcome in local storage. The Stats page
          reads that shared record through <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10">UserContext</code>,
          then summarizes the data into quick metrics, history, and insights so you can track whether the strategies you practice
          are trending upward over time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Games Played</p>
                <p className={`text-2xl font-bold ${themeClasses.text}`}>{formatNumber(user.stats.gamesPlayed)}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Win Rate</p>
                <p className={`text-2xl font-bold ${themeClasses.text}`}>{formatPercentage(user.stats.winRate)}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Strategy Accuracy</p>
                <p className={`text-2xl font-bold ${themeClasses.text}`}>{formatPercentage(user.stats.strategyAccuracy)}</p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Counting Accuracy</p>
                <p className={`text-2xl font-bold ${themeClasses.text}`}>{formatPercentage(user.stats.countingAccuracy)}</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Lifetime record</p>
                <p className={`text-2xl font-bold ${themeClasses.text}`}>{formatNumber(user.stats.gamesPlayed)} sessions</p>
              </div>
              <History className="h-8 w-8 text-purple-500" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className={`text-lg font-semibold text-green-500`}>{formatNumber(lifetimeWins)}</p>
                <p className={`${themeClasses.textSecondary} text-xs uppercase tracking-wide`}>Wins</p>
              </div>
              <div>
                <p className={`text-lg font-semibold text-red-500`}>{formatNumber(lifetimeLosses)}</p>
                <p className={`${themeClasses.textSecondary} text-xs uppercase tracking-wide`}>Losses</p>
              </div>
              <div>
                <p className={`text-lg font-semibold ${themeClasses.textSecondary}`}>{formatNumber(lifetimePushes)}</p>
                <p className={`${themeClasses.textSecondary} text-xs uppercase tracking-wide`}>Pushes</p>
              </div>
            </div>
          </div>
          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Recent sample (last {sessionHistory.length || 0} hands)</p>
                <p className={`text-2xl font-bold ${themeClasses.text}`}>{formatPercentage(recentWinRate)}</p>
              </div>
              <BarChart className="h-8 w-8 text-sky-500" />
            </div>
            <p className={`${themeClasses.textSecondary} text-sm`}>
              Averaging {(averageHandsPerSession || 0).toFixed(1)} hands per session with a {formatPercentage(recentPushRate)} push rate and a
              best win streak of {longestWinStreak}.
            </p>
          </div>
          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-6 shadow-sm`}>
            <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>What you're seeing</h3>
            <p className={`${themeClasses.textSecondary} text-sm`}>
              The Play tab dispatches session summaries to the shared user store. Stats subscribes to those updates, hydrates the
              data into cards, and keeps the derived percentages synchronized with your stored history so the insights mirror your
              actual gameplay.
            </p>
            {lastPlayedDate && (
              <p className={`${themeClasses.textSecondary} text-xs mt-3`}>Last recorded hand: {new Date(lastPlayedDate).toLocaleString()}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className={`${themeClasses.cardBg} backdrop-blur-sm border ${themeClasses.border} rounded-xl p-6 shadow-lg`}>
            <h2 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Recent Sessions</h2>
            <div className="space-y-4">
              {sessionHistory.slice(0, 5).map((session, index) => (
                <div key={index} className={`flex items-center justify-between p-4 ${themeClasses.surface} rounded-lg`}>
                  <div>
                    <p className={`${themeClasses.text} font-medium`}>
                      {session.result === 'win' ? 'Win' : session.result === 'loss' ? 'Loss' : 'Push'}
                    </p>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{session.handsPlayed} hands</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
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
          </div>

          <div className={`${themeClasses.cardBg} backdrop-blur-sm border ${themeClasses.border} rounded-xl p-6 shadow-lg`}>
            <h2 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Quiz Performance</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={themeClasses.text}>Basic Strategy</span>
                  <span className={`${themeClasses.text} font-semibold`}>
                    {user.quizStats.basicStrategy.correct}/{user.quizStats.basicStrategy.total}
                  </span>
                </div>
                <div className={`w-full ${themeClasses.surface} rounded-full h-2`}>
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${user.quizStats.basicStrategy.total > 0 ?
                        (user.quizStats.basicStrategy.correct / user.quizStats.basicStrategy.total * 100) : 0}%`
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={themeClasses.text}>Card Counting</span>
                  <span className={`${themeClasses.text} font-semibold`}>
                    {user.quizStats.cardCounting.correct}/{user.quizStats.cardCounting.total}
                  </span>
                </div>
                <div className={`w-full ${themeClasses.surface} rounded-full h-2`}>
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${user.quizStats.cardCounting.total > 0 ?
                        (user.quizStats.cardCounting.correct / user.quizStats.cardCounting.total * 100) : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-6 shadow-sm mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${themeClasses.text}`}>Session History</h2>
            <span className={`${themeClasses.textSecondary} text-sm`}>
              Showing {sessionHistory.length > 0 ? Math.min(sessionHistory.length, 10) : 0} of {sessionHistory.length} stored sessions
            </span>
          </div>
          {sessionHistory.length === 0 ? (
            <p className={`${themeClasses.textSecondary} text-center py-4`}>Play a hand to start building your history.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className={`${themeClasses.surface}`}>
                  <tr>
                    <th className={`text-left py-3 px-4 font-medium ${themeClasses.textSecondary}`}>Date</th>
                    <th className={`text-left py-3 px-4 font-medium ${themeClasses.textSecondary}`}>Result</th>
                    <th className={`text-left py-3 px-4 font-medium ${themeClasses.textSecondary}`}>Hands</th>
                    <th className={`text-left py-3 px-4 font-medium ${themeClasses.textSecondary}`}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionHistory.slice(0, 10).map((session, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className={`py-3 px-4 ${themeClasses.text}`}>{new Date(session.date).toLocaleString()}</td>
                      <td className={`py-3 px-4 font-semibold ${
                        session.result === 'win'
                          ? 'text-green-500'
                          : session.result === 'loss'
                            ? 'text-red-500'
                            : themeClasses.textSecondary
                      }`}>
                        {session.result.toUpperCase()}
                      </td>
                      <td className={`py-3 px-4 ${themeClasses.text}`}>{session.handsPlayed}</td>
                      <td className={`${themeClasses.textSecondary} py-3 px-4`}>
                        Running total calculated via Hi-Lo after each draw
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={`${themeClasses.cardBg} backdrop-blur-sm border ${themeClasses.border} rounded-xl p-6 shadow-lg`}>
          <h2 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.achievements.map((achievement, index) => (
              <div key={index} className={`flex items-center space-x-4 p-4 ${themeClasses.surface} rounded-lg`}>
                <div className="flex-shrink-0">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className={`${themeClasses.text} font-medium`}>{achievement.title}</h3>
                  <p className={`${themeClasses.textSecondary} text-sm`}>{achievement.description}</p>
                  <p className={`${themeClasses.textSecondary} text-xs mt-1`}>
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {user.achievements.length === 0 && (
              <div className={`col-span-3 text-center ${themeClasses.textSecondary} py-8`}>
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No achievements yet. Keep playing to unlock your first achievement!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
