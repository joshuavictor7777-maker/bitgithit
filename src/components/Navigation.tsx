import React from 'react';
import { Home, User, BarChart3, BookOpen, Brain, Spade, Moon, Sun } from 'lucide-react';
import { Page } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { LevelBadge } from './LevelBadge';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { theme, toggleTheme, getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const navItems = [
    { id: 'home' as Page, icon: Home, label: 'Home' },
    { id: 'play' as Page, icon: Spade, label: 'Play' },
    { id: 'learn' as Page, icon: BookOpen, label: 'Learn' },
    { id: 'quiz' as Page, icon: Brain, label: 'Quiz' },
    { id: 'stats' as Page, icon: BarChart3, label: 'Stats' },
    { id: 'profile' as Page, icon: User, label: 'Profile' },
  ];

  return (
    <nav className={`fixed top-0 w-full ${themeClasses.cardBg} backdrop-blur-sm border-b ${themeClasses.border} shadow-sm z-50`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Spade className={`h-8 w-8 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
            <h1 className={`text-xl font-bold ${themeClasses.text}`}>Ratio</h1>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="hidden md:block mr-3">
              <LevelBadge compact />
            </div>
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? `${themeClasses.accent} text-white shadow-lg`
                      : `${themeClasses.textSecondary} ${themeClasses.surfaceHover} ${theme === 'light' ? 'hover:text-green-700' : 'hover:text-green-300'}`
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={toggleTheme}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${themeClasses.textSecondary} ${themeClasses.surfaceHover}`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};