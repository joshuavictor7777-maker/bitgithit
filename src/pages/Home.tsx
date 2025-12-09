import React from 'react';
import { Spade } from 'lucide-react';
import { Page } from '../App';
import { useTheme } from '../contexts/ThemeContext';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const features = [
    {
      icon: Play,
      title: 'Play Mode',
      description: 'Practice realistic 21 gameplay with strategy hints and card counting',
      color: 'from-green-500 to-emerald-600',
      page: 'play' as Page,
    },
    {
      icon: BookOpen,
      title: 'Learn',
      description: 'Master basic strategy and card counting with interactive lessons',
      color: 'from-blue-500 to-cyan-600',
      page: 'learn' as Page,
    },
    {
      icon: Brain,
      title: 'Quiz Mode',
      description: 'Test your knowledge with strategic scenarios and counting challenges',
      color: 'from-purple-500 to-violet-600',
      page: 'quiz' as Page,
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track your progress with detailed statistics and performance metrics',
      color: 'from-amber-500 to-orange-600',
      page: 'stats' as Page,
    },
  ];

  return (
    <div className={`${themeClasses.bg} min-h-screen`}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Spade className="h-12 w-12 text-green-600 mr-3" />
            <h1 className={`text-4xl font-bold ${themeClasses.text}`}>
              Ratio
            </h1>
          </div>
          <p className={`text-lg ${themeClasses.textSecondary} max-w-2xl mx-auto`}>
            Master 21 strategy and card counting with interactive training
          </p>
        </div>

        <h1 className={`text-6xl md:text-7xl font-bold ${themeClasses.text} mb-6`}>
          Ratio
        </h1>

        <p className={`text-xl md:text-2xl ${themeClasses.textSecondary} mb-12 leading-relaxed`}>
          Master the art of blackjack strategy. Learn optimal play, master card counting, and become a calculated player with our comprehensive training platform.
        </p>

        <button
          onClick={() => onNavigate('play')}
          className={`${themeClasses.accent} text-white font-bold py-4 px-12 rounded-lg text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
        >
          Start Playing
        </button>
      </div>
    </div>
  );
};