import React, { useState } from 'react';

interface BasicRulesQuizProps {
  themeClasses: {
    text: string;
    textSecondary: string;
    surface: string;
    border: string;
    accent?: string;
    cardBg?: string;
  };
  onComplete: () => void;
}

interface BasicRulesQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const questionBank: BasicRulesQuestion[] = [
  {
    id: 'br-1',
    question: 'What is the primary objective in 21?',
    options: ['Beat the dealer without busting', 'Make exactly 21', 'Draw five cards', 'Finish with fewer cards'],
    answer: 'Beat the dealer without busting',
    explanation: 'Your goal is to finish with a total higher than the dealer without going over 21.'
  },
  {
    id: 'br-2',
    question: 'What value can an Ace have?',
    options: ['Always 11', 'Always 1', '1 or 11', '0 or 10'],
    answer: '1 or 11',
    explanation: 'Aces flex between 1 and 11, whichever keeps you under or at 21.'
  },
  {
    id: 'br-3',
    question: 'What is a natural 21 (often called a natural)?',
    options: ['Any hand totaling 21', 'A 10-value card plus an Ace on the initial deal', 'Three sevens', '21 made after hitting'],
    answer: 'A 10-value card plus an Ace on the initial deal',
    explanation: 'A natural occurs when your first two cards are an Ace and any 10-value card.'
  },
  {
    id: 'br-4',
    question: 'If your hand goes over 21, what happens?',
    options: ['You automatically lose', 'The dealer must hit again', 'You push', 'The hand restarts'],
    answer: 'You automatically lose',
    explanation: 'Going over 21 is a bust, which ends your hand with a loss regardless of the dealer outcome.'
  },
  {
    id: 'br-5',
    question: 'When does the dealer reveal their hole card?',
    options: ['Immediately', 'After all players complete their turns', 'Only if you stand', 'Only when you double'],
    answer: 'After all players complete their turns',
    explanation: 'The dealer waits for every player to finish before turning over the hidden card.'
  },
  {
    id: 'br-6',
    question: 'Which hands are considered "soft"?',
    options: ['Hands with only even cards', 'Hands containing an Ace counted as 11', 'Hands totaling under 12', 'Hands without face cards'],
    answer: 'Hands containing an Ace counted as 11',
    explanation: 'A soft hand uses an Ace as 11, giving flexibility because one hit cannot bust the hand.'
  },
  {
    id: 'br-7',
    question: 'What is the usual rule for the dealer on 17?',
    options: ['Must hit all 17s', 'Must stand on 17 or higher', 'May choose to hit or stand', 'Must double on 17'],
    answer: 'Must stand on 17 or higher',
    explanation: 'Standard rules require the dealer to stand on totals of 17 or more.'
  },
  {
    id: 'br-8',
    question: 'What action lets you match your bet to play two separate hands?',
    options: ['Double down', 'Split a pair', 'Surrender', 'Insurance'],
    answer: 'Split a pair',
    explanation: 'Splitting pairs duplicates your bet and lets you play each card as a new starting hand.'
  },
  {
    id: 'br-9',
    question: 'What does it mean to "double down"?',
    options: ['Take one more card for double the bet', 'Double your bet and finish the round', 'Split your hand and double the bet', 'Place a side wager on the dealer'],
    answer: 'Take one more card for double the bet',
    explanation: 'Doubling down commits an extra bet in exchange for exactly one additional card.'
  },
  {
    id: 'br-10',
    question: 'When the dealer shows an Ace, what optional bet may be offered?',
    options: ['Split bet', 'Side wager', 'Insurance', 'Backline'],
    answer: 'Insurance',
    explanation: 'Insurance is a side bet that the dealer has a natural; it pays 2:1 if the dealer does.'
  },
  {
    id: 'br-11',
    question: 'How many cards make up the dealer\'s starting hand?',
    options: ['One face-up card', 'Two cards, one face-up and one face-down', 'Two face-up cards', 'Three cards with one hidden'],
    answer: 'Two cards, one face-up and one face-down',
    explanation: 'The dealer starts with one visible card and one hidden hole card.'
  },
  {
    id: 'br-12',
    question: 'What happens when you and the dealer have the same total without busting?',
    options: ['You win', 'Dealer wins', 'Push (tie)', 'Both lose'],
    answer: 'Push (tie)',
    explanation: 'Equal totals result in a push, and your original wager is returned.'
  },
  {
    id: 'br-13',
    question: 'Which totals are most at risk of busting if you hit?',
    options: ['4–8', '9–11', '12–16', 'Soft 18'],
    answer: '12–16',
    explanation: 'Mid totals from 12 to 16 risk busting with many card draws, so decisions are more situational.'
  },
  {
    id: 'br-14',
    question: 'What is the typical value of face cards (J, Q, K)?',
    options: ['5', '10', '11', 'Face value'],
    answer: '10',
    explanation: 'All face cards count as 10 toward your total.'
  },
  {
    id: 'br-15',
    question: 'When are you allowed to surrender a hand?',
    options: ['After hitting once', 'Only before any cards are dealt', 'Typically only as your first decision', 'After the dealer plays'],
    answer: 'Typically only as your first decision',
    explanation: 'Surrender, when offered, must be chosen as the first action before taking any cards beyond the original two.'
  },
  {
    id: 'br-16',
    question: 'If you split Aces, how many cards does each Ace usually receive?',
    options: ['Unlimited hits', 'Exactly one additional card', 'Two cards', 'No additional cards'],
    answer: 'Exactly one additional card',
    explanation: 'Most rules allow only one card per split Ace hand.'
  },
  {
    id: 'br-17',
    question: 'Which starting totals are considered hard hands?',
    options: ['Hands with no Ace counted as 11', 'Hands with an Ace counted as 11', 'Hands of five or more cards', 'Any total under 12'],
    answer: 'Hands with no Ace counted as 11',
    explanation: 'Hard hands lack an Ace valued at 11, so they can bust with a single high card.'
  },
  {
    id: 'br-18',
    question: 'What is the safest action on a total of 8 or less?',
    options: ['Stand', 'Hit', 'Double down', 'Surrender'],
    answer: 'Hit',
    explanation: 'Totals of 8 or less cannot bust with one hit, so taking another card is safe.'
  },
  {
    id: 'br-19',
    question: 'When can you usually buy insurance?',
    options: ['Any time before hitting', 'Only when the dealer shows an Ace', 'Only after seeing the dealer\'s hole card', 'After splitting'],
    answer: 'Only when the dealer shows an Ace',
    explanation: 'Insurance is offered exclusively when the dealer\'s up-card is an Ace.'
  },
  {
    id: 'br-20',
    question: 'What outcome happens if the dealer busts and you have not?',
    options: ['Dealer wins ties', 'You lose unless you have 21', 'You win your hand', 'Hand is a push'],
    answer: 'You win your hand',
    explanation: 'Any non-busted player hand wins automatically when the dealer busts.'
  }
];

const shuffle = <T,>(array: T[]) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const createQuestionSet = () => shuffle(questionBank).slice(0, 8);

export const BasicRulesQuiz: React.FC<BasicRulesQuizProps> = ({ themeClasses, onComplete }) => {
  const [questions, setQuestions] = useState<BasicRulesQuestion[]>(createQuestionSet());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [hasMistake, setHasMistake] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const resetQuiz = () => {
    const freshSet = createQuestionSet();
    setQuestions(freshSet);
    setCurrentIndex(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setCorrectCount(0);
    setHasMistake(false);
    setFinished(false);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || showFeedback || !currentQuestion) return;
    const isCorrect = selectedAnswer === currentQuestion.answer;
    setShowFeedback(true);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setHasMistake(true);
    }
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      setFinished(true);
      if (!hasMistake && selectedAnswer === currentQuestion.answer) {
        onComplete();
      }
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  const totalQuestions = questions.length;
  const accentColor = themeClasses.accent ?? 'bg-green-600';
  const scorePreview = correctCount + (showFeedback && selectedAnswer === currentQuestion?.answer ? 1 : 0);
  const perfectSoFar = !hasMistake && scorePreview === currentIndex + (showFeedback ? 1 : 0);

  return (
    <div className={`space-y-4 ${themeClasses.cardBg ?? ''}`}>
      <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-4 flex items-center justify-between`}>
        <div>
          <p className={`${themeClasses.textSecondary} text-sm`}>Question {currentIndex + 1} of {totalQuestions}</p>
          <h3 className={`text-lg font-semibold ${themeClasses.text}`}>{currentQuestion.question}</h3>
        </div>
        <div className="text-right">
          <p className={`${themeClasses.textSecondary} text-sm`}>Score</p>
          <p className={`text-xl font-bold ${perfectSoFar ? 'text-green-600' : themeClasses.text}`}>{scorePreview}/{totalQuestions}</p>
        </div>
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map(option => {
          const isCorrect = option === currentQuestion.answer;
          const isSelected = option === selectedAnswer;
          const showCorrect = showFeedback && isCorrect;
          const showIncorrect = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={option}
              onClick={() => !showFeedback && setSelectedAnswer(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all font-semibold ${
                showCorrect
                  ? 'border-green-500 bg-green-500/10 text-green-700'
                  : showIncorrect
                  ? 'border-red-500 bg-red-500/10 text-red-700'
                  : isSelected
                  ? `border-blue-500 ${themeClasses.surface} text-blue-600`
                  : `border-transparent ${themeClasses.surface} ${themeClasses.text}`
              }`}
              disabled={showFeedback}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-3`}>
          <p className={`text-sm font-semibold ${themeClasses.text}`}>
            {selectedAnswer === currentQuestion.answer ? 'Correct!' : 'Not quite.'}
          </p>
          <p className={`text-sm ${themeClasses.textSecondary}`}>{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className={`flex-1 py-3 rounded-lg font-semibold text-white ${
              selectedAnswer ? accentColor : 'bg-gray-400'
            }`}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className={`flex-1 py-3 rounded-lg font-semibold text-white ${accentColor}`}
          >
            {currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
          </button>
        )}
        <button
          onClick={resetQuiz}
          className={`px-4 py-3 rounded-lg font-semibold ${themeClasses.surface} ${themeClasses.text}`}
        >
          Start Over
        </button>
      </div>

      {finished && (
        <div
          className={`border ${hasMistake ? 'border-yellow-400 bg-yellow-50 text-yellow-800' : 'border-green-400 bg-green-50 text-green-800'} rounded-lg p-4`}
        >
          <p className="font-semibold text-lg mb-1">{hasMistake ? 'Almost there' : 'Perfect score!'}</p>
          <p className="text-sm">
            {hasMistake
              ? 'You need to answer every question correctly to complete this module. Try again with a fresh set of questions!'
              : 'Great work! You aced every question and completed the module.'}
          </p>
          {hasMistake && (
            <p className="text-sm mt-2">Fresh questions are pulled from a larger bank each time to keep practice varied.</p>
          )}
        </div>
      )}
    </div>
  );
};

