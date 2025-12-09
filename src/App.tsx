import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Stats } from './pages/Stats';
import { Learn } from './pages/Learn';
import { Quiz } from './pages/Quiz';
import { Play } from './pages/Play';
import { GameProvider } from './contexts/GameContext';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LearningProvider } from './contexts/LearningContext';
import { XpToastStack } from './components/XpToastStack';

export type Page = 'home' | 'profile' | 'stats' | 'learn' | 'quiz' | 'play';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'profile':
        return <Profile />;
      case 'stats':
        return <Stats />;
      case 'learn':
        return <Learn />;
      case 'quiz':
        return <Quiz />;
      case 'play':
        return <Play />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      <UserProvider>
        <GameProvider>
          <LearningProvider>
            <div className="min-h-screen">
              <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
              <XpToastStack />
              <main className="pt-16">
                {renderPage()}
              </main>
            </div>
          </LearningProvider>
        </GameProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;