import React from 'react';
import { Spade, Brain, BookOpen, BarChart3, Play } from 'lucide-react';
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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${themeClasses.cardBg} backdrop-blur-sm border ${themeClasses.border} rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
              onClick={() => onNavigate(feature.page)}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>{feature.title}</h3>
              <p className={`${themeClasses.textSecondary} text-sm`}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className={`${themeClasses.cardBg} backdrop-blur-sm border ${themeClasses.border} rounded-xl p-6`}>
          <h2 className={`text-xl font-bold ${themeClasses.text} mb-6 text-center`}>Training Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">Hi-Lo</div>
              <p className={`${themeClasses.textSecondary} text-sm`}>Card Counting System</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">Basic Strategy</div>
              <p className={`${themeClasses.textSecondary} text-sm`}>Optimal Play Engine</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">Analytics</div>
              <p className={`${themeClasses.textSecondary} text-sm`}>Performance Tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};