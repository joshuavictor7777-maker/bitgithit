import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Award, Clock, Target, TrendingUp } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { generateQuizQuestion, QuizQuestion } from '../utils/quizGenerator';

export const Quiz: React.FC = () => {
  const { user, updateQuizStats } = useUser();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [quizType, setQuizType] = useState<'basic-strategy' | 'card-counting'>('basic-strategy');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Load saved quiz state
  useEffect(() => {
    const savedState = localStorage.getItem('ratio-quiz-state');
    if (savedState) {
      const state = JSON.parse(savedState);
      setScore(state.score || 0);
      setQuestionsAnswered(state.questionsAnswered || 0);
      setStreak(state.streak || 0);
      setBestStreak(state.bestStreak || 0);
    }
  }, []);

  // Save quiz state
  useEffect(() => {
    const state = { score, questionsAnswered, streak, bestStreak };
    localStorage.setItem('ratio-quiz-state', JSON.stringify(state));
  }, [score, questionsAnswered, streak, bestStreak]);

  useEffect(() => {
    loadNewQuestion();
  }, []);

  useEffect(() => {
    loadNewQuestion(quizType, difficulty);
  }, [difficulty]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult && selectedAnswer) {
      handleAnswerSubmit();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, showResult, selectedAnswer]);

  const loadNewQuestion = (
    type: QuizQuestion['category'] = quizType,
    level: QuizQuestion['difficulty'] = difficulty
  ) => {
    const question = generateQuizQuestion(type, level);
    setCurrentQuestion(question);
    setSelectedAnswer('');
    setShowResult(false);
    setTimeLeft(level === 'easy' ? 45 : level === 'medium' ? 30 : 15);
    setIsTimerActive(true);
  };

  const handleQuizTypeChange = (newType: QuizQuestion['category']) => {
    if (newType === quizType) return;

    setQuizType(newType);
    loadNewQuestion(newType, difficulty);
  };

  const handleAnswerSubmit = () => {
    if (!currentQuestion || !selectedAnswer) return;

    setIsTimerActive(false);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setShowResult(true);
    
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1);
      }
    } else {
      setStreak(0);
    }
    
    setQuestionsAnswered(questionsAnswered + 1);
    updateQuizStats(quizType, isCorrect);
  };

  const handleNextQuestion = () => {
    loadNewQuestion();
  };

  const resetQuiz = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setStreak(0);
    loadNewQuestion();
  };

  if (!currentQuestion) {
    return (
      <div className={`max-w-4xl mx-auto px-6 py-8 ${themeClasses.bg} min-h-screen`}>
        <div className={`${themeClasses.cardBg} backdrop-blur-sm border ${themeClasses.border} rounded-xl p-8 shadow-lg`}>
          <div className={`${themeClasses.text} text-center`}>Loading quiz...</div>
        </div>
      </div>
    );
  }

  const accuracy = questionsAnswered > 0 ? ((score / questionsAnswered) * 100).toFixed(1) : '0.0';

  return (
    <div className={`max-w-4xl mx-auto px-6 py-8 ${themeClasses.bg} min-h-screen`}>
      <div className={`${themeClasses.cardBg} backdrop-blur-sm border ${themeClasses.border} rounded-xl p-8 shadow-lg`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${themeClasses.text}`}>Quiz Mode</h1>
          <div className="flex items-center space-x-4">
            <select
              value={quizType}
              onChange={(e) => handleQuizTypeChange(e.target.value as QuizQuestion['category'])}
              className={`${themeClasses.cardBg} border ${themeClasses.border} ${themeClasses.text} rounded-lg px-4 py-2`}
            >
              <option value="basic-strategy">Basic Strategy</option>
              <option value="card-counting">Card Counting</option>
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className={`${themeClasses.cardBg} border ${themeClasses.border} ${themeClasses.text} rounded-lg px-4 py-2`}
            >
              <option value="easy">Easy (45s)</option>
              <option value="medium">Medium (30s)</option>
              <option value="hard">Hard (15s)</option>
            </select>
            <div className="text-green-500 font-semibold">
              Score: {score}/{questionsAnswered} ({accuracy}%)
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`${themeClasses.surface} rounded-lg p-4 text-center`}>
            <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">{accuracy}%</div>
            <div className={`text-sm ${themeClasses.textSecondary}`}>Accuracy</div>
          </div>
          <div className={`${themeClasses.surface} rounded-lg p-4 text-center`}>
            <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-500">{streak}</div>
            <div className={`text-sm ${themeClasses.textSecondary}`}>Current Streak</div>
          </div>
          <div className={`${themeClasses.surface} rounded-lg p-4 text-center`}>
            <Award className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-500">{bestStreak}</div>
            <div className={`text-sm ${themeClasses.textSecondary}`}>Best Streak</div>
          </div>
          <div className={`${themeClasses.surface} rounded-lg p-4 text-center`}>
            <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-orange-600'}`}>
              {timeLeft}s
            </div>
            <div className={`text-sm ${themeClasses.textSecondary}`}>Time Left</div>
          </div>
        </div>
        <div className="mb-8">
          <div className={`${themeClasses.surface} rounded-lg p-6 mb-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${themeClasses.text}`}>Question {questionsAnswered + 1}</h2>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(timeLeft / (difficulty === 'easy' ? 45 : difficulty === 'medium' ? 30 : 15)) * 100}%` }}
                />
              </div>
            </div>
            <p className={`text-lg ${themeClasses.text} mb-4`}>{currentQuestion.question}</p>
            {currentQuestion.context && (
              <div className={`${themeClasses.textSecondary} mb-4 p-4 ${themeClasses.cardBg} rounded-lg border ${themeClasses.border}`}>
                {currentQuestion.context}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? showResult
                      ? option === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500/20 text-green-700'
                        : 'border-red-500 bg-red-500/20 text-red-700'
                      : `border-blue-500 ${themeClasses.surface} text-blue-700`
                    : showResult && option === currentQuestion.correctAnswer
                    ? `border-green-500 ${themeClasses.surface} text-green-700`
                    : `${themeClasses.border} ${themeClasses.cardBg} ${themeClasses.text} ${themeClasses.surfaceHover}`
                }`}
              >
                <div className="flex items-center space-x-3">
                  {showResult && option === currentQuestion.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className={`${themeClasses.surface} rounded-lg p-6 mb-6`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>Explanation</h3>
              <p className={`${themeClasses.textSecondary}`}>{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-center space-x-4 mb-6">
            {!showResult ? (
              <button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
                className={`flex items-center space-x-2 ${themeClasses.accent} ${themeClasses.accentHover} disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all`}
              >
                <span>Submit Answer</span>
              </button>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={handleNextQuestion}
                  className={`flex items-center space-x-2 ${themeClasses.accent} ${themeClasses.accentHover} text-white px-6 py-3 rounded-lg font-semibold transition-all`}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Next Question</span>
                </button>
                <button
                  onClick={resetQuiz}
                  className={`flex items-center space-x-2 ${themeClasses.surface} hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all`}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset Quiz</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {questionsAnswered >= 10 && (
          <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6 text-center`}>
            <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>Great Job!</h3>
            <p className={`${themeClasses.textSecondary}`}>
              You've answered {questionsAnswered} questions with {accuracy}% accuracy.
              Keep practicing to improve your skills!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};