import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'quiz' | 'practice';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  completed: boolean;
  score?: number;
  unlocked: boolean;
  xpReward: number;
  category: 'basics' | 'strategy' | 'counting' | 'advanced';
}

interface LearningContextType {
  modules: LearningModule[];
  currentModule: string | null;
  totalXP: number;
  completedModules: number;
  updateModuleProgress: (moduleId: string, completed: boolean, score?: number) => void;
  unlockModule: (moduleId: string) => void;
  setCurrentModule: (moduleId: string | null) => void;
  getModulesByCategory: (category: string) => LearningModule[];
  getCompletionPercentage: () => number;
}

const defaultModules: LearningModule[] = [
  // Basics Category
  {
    id: 'basics-intro',
    title: 'Welcome to 21',
    description: 'Learn the fundamental rules and objectives',
    type: 'lesson',
    difficulty: 'beginner',
    prerequisites: [],
    completed: false,
    unlocked: true,
    xpReward: 50,
    category: 'basics'
  },
  {
    id: 'card-values',
    title: 'Card Values & Hand Totals',
    description: 'Understanding how cards are valued',
    type: 'lesson',
    difficulty: 'beginner',
    prerequisites: ['basics-intro'],
    completed: false,
    unlocked: false,
    xpReward: 75,
    category: 'basics'
  },
  {
    id: 'basic-rules-quiz',
    title: 'Basic Rules Quiz',
    description: 'Test your knowledge of basic 21 rules',
    type: 'quiz',
    difficulty: 'beginner',
    prerequisites: ['card-values'],
    completed: false,
    unlocked: false,
    xpReward: 100,
    category: 'basics'
  },
  {
    id: 'dealer-rules',
    title: 'Dealer Rules & Procedures',
    description: 'Learn how the dealer plays their hand',
    type: 'lesson',
    difficulty: 'beginner',
    prerequisites: ['basic-rules-quiz'],
    completed: false,
    unlocked: false,
    xpReward: 75,
    category: 'basics'
  },

  // Strategy Category
  {
    id: 'basic-strategy-intro',
    title: 'Introduction to Basic Strategy',
    description: 'Why basic strategy is mathematically optimal',
    type: 'lesson',
    difficulty: 'intermediate',
    prerequisites: ['dealer-rules'],
    completed: false,
    unlocked: false,
    xpReward: 100,
    category: 'strategy'
  },
  {
    id: 'hard-hands',
    title: 'Playing Hard Hands',
    description: 'Optimal strategy for hands without aces',
    type: 'lesson',
    difficulty: 'intermediate',
    prerequisites: ['basic-strategy-intro'],
    completed: false,
    unlocked: false,
    xpReward: 125,
    category: 'strategy'
  },
  {
    id: 'hard-hands-quiz',
    title: 'Hard Hands Quiz',
    description: 'Test your hard hand strategy knowledge',
    type: 'quiz',
    difficulty: 'intermediate',
    prerequisites: ['hard-hands'],
    completed: false,
    unlocked: false,
    xpReward: 150,
    category: 'strategy'
  },
  {
    id: 'soft-hands',
    title: 'Playing Soft Hands',
    description: 'Strategy for hands containing aces',
    type: 'lesson',
    difficulty: 'intermediate',
    prerequisites: ['hard-hands-quiz'],
    completed: false,
    unlocked: false,
    xpReward: 125,
    category: 'strategy'
  },
  {
    id: 'pairs',
    title: 'Splitting Pairs',
    description: 'When and how to split pairs',
    type: 'lesson',
    difficulty: 'intermediate',
    prerequisites: ['soft-hands'],
    completed: false,
    unlocked: false,
    xpReward: 125,
    category: 'strategy'
  },
  {
    id: 'strategy-practice',
    title: 'Strategy Practice',
    description: 'Practice basic strategy decisions',
    type: 'practice',
    difficulty: 'intermediate',
    prerequisites: ['pairs'],
    completed: false,
    unlocked: false,
    xpReward: 200,
    category: 'strategy'
  },

  // Counting Category
  {
    id: 'counting-intro',
    title: 'Introduction to Card Counting',
    description: 'Learn the theory behind card counting',
    type: 'lesson',
    difficulty: 'advanced',
    prerequisites: ['strategy-practice'],
    completed: false,
    unlocked: false,
    xpReward: 150,
    category: 'counting'
  },
  {
    id: 'hi-lo-system',
    title: 'Hi-Lo Counting System',
    description: 'Master the most popular counting system',
    type: 'lesson',
    difficulty: 'advanced',
    prerequisites: ['counting-intro'],
    completed: false,
    unlocked: false,
    xpReward: 175,
    category: 'counting'
  },
  {
    id: 'running-count',
    title: 'Running Count Practice',
    description: 'Practice maintaining the running count',
    type: 'practice',
    difficulty: 'advanced',
    prerequisites: ['hi-lo-system'],
    completed: false,
    unlocked: false,
    xpReward: 200,
    category: 'counting'
  },
  {
    id: 'true-count',
    title: 'True Count Conversion',
    description: 'Learn to convert running count to true count',
    type: 'lesson',
    difficulty: 'advanced',
    prerequisites: ['running-count'],
    completed: false,
    unlocked: false,
    xpReward: 175,
    category: 'counting'
  },
  {
    id: 'counting-quiz',
    title: 'Card Counting Quiz',
    description: 'Test your counting skills',
    type: 'quiz',
    difficulty: 'advanced',
    prerequisites: ['true-count'],
    completed: false,
    unlocked: false,
    xpReward: 250,
    category: 'counting'
  },

  // Advanced Category
  {
    id: 'deviations',
    title: 'Basic Strategy Deviations',
    description: 'When to deviate from basic strategy',
    type: 'lesson',
    difficulty: 'advanced',
    prerequisites: ['counting-quiz'],
    completed: false,
    unlocked: false,
    xpReward: 200,
    category: 'advanced'
  },
  {
    id: 'bankroll-management',
    title: 'Bankroll Management',
    description: 'Managing your practice sessions effectively',
    type: 'lesson',
    difficulty: 'advanced',
    prerequisites: ['deviations'],
    completed: false,
    unlocked: false,
    xpReward: 150,
    category: 'advanced'
  },
  {
    id: 'final-exam',
    title: 'Final Mastery Exam',
    description: 'Comprehensive test of all skills',
    type: 'quiz',
    difficulty: 'advanced',
    prerequisites: ['bankroll-management'],
    completed: false,
    unlocked: false,
    xpReward: 500,
    category: 'advanced'
  }
];

const LearningContext = createContext<LearningContextType | null>(null);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<LearningModule[]>(defaultModules);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    const savedData = localStorage.getItem('ratio-learning-progress');
    if (savedData) {
      const { modules: savedModules, totalXP: savedXP } = JSON.parse(savedData);
      setModules(savedModules);
      setTotalXP(savedXP);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ratio-learning-progress', JSON.stringify({ modules, totalXP }));
  }, [modules, totalXP]);

  const updateModuleProgress = (moduleId: string, completed: boolean, score?: number) => {
    setModules(prev => {
      const updated = prev.map(module => {
        if (module.id === moduleId) {
          const wasCompleted = module.completed;
          const updatedModule = { ...module, completed, score };
          
          // Award XP only if newly completed
          if (completed && !wasCompleted) {
            setTotalXP(prevXP => prevXP + module.xpReward);
          }
          
          return updatedModule;
        }
        return module;
      });

      // Unlock next modules
      if (completed) {
        return updated.map(module => {
          if (module.prerequisites.includes(moduleId)) {
            return { ...module, unlocked: true };
          }
          return module;
        });
      }

      return updated;
    });
  };

  const unlockModule = (moduleId: string) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, unlocked: true } : module
    ));
  };

  const getModulesByCategory = (category: string) => {
    return modules.filter(module => module.category === category);
  };

  const completedModules = modules.filter(m => m.completed).length;

  const getCompletionPercentage = () => {
    return Math.round((completedModules / modules.length) * 100);
  };

  return (
    <LearningContext.Provider value={{
      modules,
      currentModule,
      totalXP,
      completedModules,
      updateModuleProgress,
      unlockModule,
      setCurrentModule,
      getModulesByCategory,
      getCompletionPercentage
    }}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
