import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
}

export interface Session {
  date: string;
  handsPlayed: number;
  result: 'win' | 'loss' | 'push';
  netWin: number;
}

export interface QuizStats {
  basicStrategy: { correct: number; total: number };
  cardCounting: { correct: number; total: number };
}

export interface UserStats {
  gamesPlayed: number;
  handsPlayed: number;
  winRate: number;
  strategyAccuracy: number;
  strategyDecisions?: number;
  strategyCorrect?: number;
  countingAccuracy: number;
  recentSessions: Session[];
}

export interface UserPreferences {
  showStrategyHints: boolean;
  enableCardCounting: boolean;
  autoAdvance: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface User {
  name: string;
  email: string;
  level: number;
  experience: number;
  memberSince: string;
  achievements: Achievement[];
  stats: UserStats;
  quizStats: QuizStats;
  preferences: UserPreferences;
}

export interface XpGain {
  id: string;
  amount: number;
  reason?: string;
  level?: number;
  levelUp?: boolean;
}

export const getXpForLevel = (level: number) => {
  const easyStart = 30;
  const tierSize = 5;
  const tier = Math.floor((level - 1) / tierSize);
  const increment = 10 + tier * 10;

  return easyStart + (level - 1) * increment;
};

const defaultUser: User = {
  name: '21 Player',
  email: 'player@21.com',
  level: 1,
  experience: 0,
  memberSince: new Date().toISOString(),
  achievements: [],
  stats: {
    gamesPlayed: 0,
    handsPlayed: 0,
    winRate: 0,
    strategyAccuracy: 0,
    strategyDecisions: 0,
    strategyCorrect: 0,
    countingAccuracy: 0,
    recentSessions: [],
  },
  quizStats: {
    basicStrategy: { correct: 0, total: 0 },
    cardCounting: { correct: 0, total: 0 },
  },
  preferences: {
    showStrategyHints: true,
    enableCardCounting: true,
    autoAdvance: false,
    difficulty: 'beginner',
  },
};

const UserContext = createContext<{
  user: User;
  updateProfile: (data: Partial<User>) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  updateQuizStats: (type: 'basicStrategy' | 'cardCounting', correct: boolean) => void;
  addAchievement: (achievement: Omit<Achievement, 'unlockedAt'>) => void;
  addExperience: (amount: number, reason?: string) => void;
  xpGains: XpGain[];
  dismissXpGain: (id: string) => void;
  nextLevelXp: number;
} | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [xpGains, setXpGains] = useState<XpGain[]>([]);
  const nextLevelXp = getXpForLevel(user.level);

  useEffect(() => {
    const savedUser = localStorage.getItem('ratio-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ratio-user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const handleStorage = () => {
      const savedUser = localStorage.getItem('ratio-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateProfile = (data: Partial<User>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const updateStats = (stats: Partial<UserStats>) => {
    setUser(prev => ({
      ...prev,
      stats: { ...prev.stats, ...stats }
    }));
  };

  const updateQuizStats = (type: 'basicStrategy' | 'cardCounting', correct: boolean) => {
    setUser(prev => {
      const newStats = {
        ...prev.quizStats,
        [type]: {
          correct: prev.quizStats[type].correct + (correct ? 1 : 0),
          total: prev.quizStats[type].total + 1
        }
      };

      const totalCorrect = newStats.basicStrategy.correct + newStats.cardCounting.correct;
      const totalQuestions = newStats.basicStrategy.total + newStats.cardCounting.total;

      return {
        ...prev,
        quizStats: newStats,
        stats: {
          ...prev.stats,
          strategyAccuracy: totalQuestions > 0 ? totalCorrect / totalQuestions : 0
        }
      };
    });
  };

  const addAchievement = (achievement: Omit<Achievement, 'unlockedAt'>) => {
    const newAchievement: Achievement = {
      ...achievement,
      unlockedAt: new Date().toISOString()
    };
    
    setUser(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement]
    }));
  };

  const addExperience = (amount: number, reason?: string) => {
    setUser(prev => {
      let xpPool = prev.experience + amount;
      let newLevel = prev.level;
      let leveledUp = false;

      let required = getXpForLevel(newLevel);
      while (xpPool >= required) {
        xpPool -= required;
        newLevel += 1;
        required = getXpForLevel(newLevel);
        leveledUp = true;
      }

      setXpGains(current => [
        ...current,
        {
          id: crypto.randomUUID(),
          amount,
          reason,
          level: newLevel,
          levelUp: leveledUp,
        },
      ]);

      return {
        ...prev,
        level: newLevel,
        experience: xpPool,
      };
    });
  };

  const dismissXpGain = (id: string) => {
    setXpGains(prev => prev.filter(gain => gain.id !== id));
  };

  return (
    <UserContext.Provider value={{
      user,
      updateProfile,
      updateStats,
      updateQuizStats,
      addAchievement,
      addExperience,
      xpGains,
      dismissXpGain,
      nextLevelXp,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};