import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Award, Clock, Target } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { generateQuizQuestion, QuizQuestion } from '../utils/quizGenerator';

export const Quiz: React.FC = () => {
  const { user, updateQuizStats } = useUser();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const [quizType, setQuizType] = useState<'basic-strategy' | 'card-counting'>('basic-strategy');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    loadQuestion();
  }, []);

  useEffect(() => {
    if (showResult) return;

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showResult]);

  const loadQuestion = () => {
    const q = generateQuizQuestion(quizType, difficulty);
    setCurrentQuestion(q);
    setSelectedAnswer('');
    setShowResult(false);
    setTimeLeft(difficulty === 'easy' ? 45 : difficulty === 'medium' ? 30 : 15);
  };

  const handleSubmit = () => {
    if (!currentQuestion || !selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setShowResult(true);

    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setAnswered(answered + 1);
    const statsType = quizType === 'basic-strategy' ? 'basicStrategy' : 'cardCounting';
    updateQuizStats(statsType as any, isCorrect);
  };

  const handleNext = () => {
    loadQuestion();
  };

  const handleChangeType = (newType: 'basic-strategy' | 'card-counting') => {
    setQuizType(newType);
    setScore(0);
    setAnswered(0);
    setStreak(0);
    loadQuestion();
  };

  if (!currentQuestion) {
    return (
      <div className={`${themeClasses.bg} min-h-screen flex items-center justify-center`}>
        <div className={`${themeClasses.cardBg} rounded-xl p-8`}>
          <p className={themeClasses.text}>Loading...</p>
        </div>
      </div>
    );
  }

  const accuracy = answered > 0 ? ((score / answered) * 100).toFixed(0) : 0;

  return (
    <div className={`${themeClasses.bg} min-h-screen`}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-4 mb-4`}>
          <div className="flex items-center justify-between mb-3">
            <h1 className={`text-2xl font-bold ${themeClasses.text}`}>Quiz</h1>
            <div className={`flex items-center space-x-2 ${themeClasses.text}`}>
              <Clock className="h-5 w-5" />
              <span className="font-semibold">{timeLeft}s</span>
            </div>
          </div>

          {/* Quiz Type Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleChangeType('basic-strategy')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                quizType === 'basic-strategy'
                  ? `${themeClasses.accent} text-white`
                  : `${themeClasses.surface} ${themeClasses.text}`
              }`}
            >
              Strategy
            </button>
            <button
              onClick={() => handleChangeType('card-counting')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                quizType === 'card-counting'
                  ? `${themeClasses.accent} text-white`
                  : `${themeClasses.surface} ${themeClasses.text}`
              }`}
            >
              Counting
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className={`${themeClasses.surface} rounded-lg p-3 text-center`}>
            <div className={`text-sm ${themeClasses.textSecondary}`}>Score</div>
            <div className={`text-2xl font-bold ${themeClasses.text}`}>{score}/{answered}</div>
          </div>
          <div className={`${themeClasses.surface} rounded-lg p-3 text-center`}>
            <div className={`text-sm ${themeClasses.textSecondary}`}>Accuracy</div>
            <div className={`text-2xl font-bold text-green-500`}>{accuracy}%</div>
          </div>
          <div className={`${themeClasses.surface} rounded-lg p-3 text-center`}>
            <div className={`text-sm ${themeClasses.textSecondary}`}>Streak</div>
            <div className={`text-2xl font-bold text-blue-500`}>{streak}</div>
          </div>
        </div>

        {/* Question */}
        <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-5 mb-4`}>
          <div className={`text-sm ${themeClasses.textSecondary} mb-3`}>
            Question {answered + 1}
          </div>
          <h2 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>
            {currentQuestion.question}
          </h2>
          {currentQuestion.context && (
            <div className={`${themeClasses.surface} rounded-lg p-3 mb-4 text-sm ${themeClasses.textSecondary}`}>
              {currentQuestion.context}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 mb-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !showResult && setSelectedAnswer(option)}
              disabled={showResult}
              className={`w-full p-4 rounded-lg border-2 font-semibold transition-all text-left ${
                selectedAnswer === option
                  ? showResult
                    ? option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-500/20 text-green-600'
                      : 'border-red-500 bg-red-500/20 text-red-600'
                    : `border-blue-500 ${themeClasses.surface} text-blue-600`
                  : showResult && option === currentQuestion.correctAnswer
                  ? `border-green-500 ${themeClasses.surface} text-green-600`
                  : `border-transparent ${themeClasses.surface} ${themeClasses.text} hover:border-gray-400`
              }`}
            >
              <div className="flex items-center space-x-3">
                {showResult && option === currentQuestion.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
                {showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className={`${themeClasses.surface} rounded-lg p-4 mb-4`}>
            <h3 className={`font-semibold ${themeClasses.text} mb-2`}>Explanation</h3>
            <p className={`text-sm ${themeClasses.textSecondary}`}>{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                selectedAnswer
                  ? `${themeClasses.accent} text-white hover:opacity-90`
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          ) : (
            <>
              <button
                onClick={handleNext}
                className={`flex-1 py-3 rounded-lg font-semibold text-white ${themeClasses.accent} hover:opacity-90`}
              >
                Next
              </button>
              <button
                onClick={() => {
                  setScore(0);
                  setAnswered(0);
                  setStreak(0);
                  loadQuestion();
                }}
                className={`px-4 py-3 rounded-lg font-semibold ${themeClasses.surface} ${themeClasses.text}`}
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
