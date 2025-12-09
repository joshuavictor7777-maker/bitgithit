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

  return (
    <div className={`${themeClasses.bg} min-h-screen flex items-center justify-center px-6`}>
      <div className="text-center max-w-2xl">
        <div className="mb-6 flex justify-center">
          <Spade className="h-20 w-20 text-green-600" />
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