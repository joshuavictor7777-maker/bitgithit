import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLearning } from '../contexts/LearningContext';
import { LearningModuleContent } from '../components/LearningModuleContent';

export const Learn: React.FC = () => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const { modules, currentModule, setCurrentModule, updateModuleProgress, getCompletionPercentage } = useLearning();
  const [viewingModule, setViewingModule] = useState<string | null>(null);

  const categories = [
    { id: 'basics', title: 'Basics', count: 4 },
    { id: 'strategy', title: 'Strategy', count: 4 },
    { id: 'counting', title: 'Counting', count: 4 },
    { id: 'advanced', title: 'Advanced', count: 3 }
  ];

  const handleCompleteModule = (moduleId: string) => {
    updateModuleProgress(moduleId, true, 100);
    setViewingModule(null);
  };

  if (viewingModule) {
    const module = modules.find(m => m.id === viewingModule);
    if (!module) return null;

    return (
      <div className={`${themeClasses.bg} min-h-screen`}>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={() => setViewingModule(null)}
            className={`${themeClasses.text} mb-4 font-semibold flex items-center gap-2`}
          >
            ← Back
          </button>

          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-6`}>
            <h1 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>{module.title}</h1>
            <p className={`${themeClasses.textSecondary} mb-6`}>{module.description}</p>

            <div className={`${themeClasses.surface} rounded-lg p-4 mb-6`}>
              <LearningModuleContent moduleId={module.id} themeClasses={themeClasses} />
            </div>

            {!module.completed && (
              <button
                onClick={() => handleCompleteModule(module.id)}
                className={`w-full py-3 rounded-lg font-semibold text-white ${themeClasses.accent} hover:opacity-90`}
              >
                Mark as Complete
              </button>
            )}

            {module.completed && (
              <div className={`flex items-center gap-2 py-3 px-4 rounded-lg bg-green-500/20 text-green-600 font-semibold`}>
                <CheckCircle className="h-5 w-5" />
                Completed
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeClasses.bg} min-h-screen`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-green-500" />
            <h1 className={`text-3xl font-bold ${themeClasses.text}`}>Learn</h1>
          </div>

          {/* Progress */}
          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className={themeClasses.text}>Overall Progress</span>
              <span className={`font-semibold text-green-500`}>{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categories.map(category => {
            const categoryModules = modules.filter(m => m.category === category.id);
            const completedCount = categoryModules.filter(m => m.completed).length;

            return (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-xl font-bold ${themeClasses.text}`}>{category.title}</h2>
                  <span className={`text-sm ${themeClasses.textSecondary}`}>
                    {completedCount}/{category.count}
                  </span>
                </div>

                <div className="space-y-2">
                  {categoryModules.map(module => (
                    <button
                      key={module.id}
                      onClick={() => setViewingModule(module.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        module.completed
                          ? `border-green-500 ${themeClasses.surface} bg-green-500/10`
                          : `border-transparent ${themeClasses.surface} hover:border-green-300`
                      }`}
                      disabled={!module.unlocked}
                    >
                      <div className="flex items-center gap-3 text-left">
                        {module.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 border-gray-400`} />
                        )}
                        <div>
                          <div className={`font-semibold ${themeClasses.text}`}>{module.title}</div>
                          <div className={`text-sm ${themeClasses.textSecondary}`}>{module.description}</div>
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 ${themeClasses.textSecondary}`} />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
