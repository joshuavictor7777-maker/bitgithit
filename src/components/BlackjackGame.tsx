import React, { useEffect, useRef, useState } from 'react';
import { PlayingCard } from './PlayingCard';
import { useGame } from '../contexts/GameContext';
import { useTheme } from '../contexts/ThemeContext';
import { PlayerAction, recordStrategyDecision, StrategyFeedback } from '../utils/strategy';
import { RefreshCw } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface BlackjackGameProps {
  onDecisionFeedback?: (feedback: StrategyFeedback | null) => void;
}

export const BlackjackGame: React.FC<BlackjackGameProps> = ({ onDecisionFeedback }) => {
  const { gameState, dispatch } = useGame();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const { addExperience } = useUser();
  const [showResults, setShowResults] = useState(false);
  const lastRoundSignature = useRef<string>('');

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
    setShowResults(false);
  };


  const handleDealCards = () => {
    dispatch({ type: 'DEAL_CARDS' });
  };

  const handleDecision = (action: PlayerAction, dispatchAction: Parameters<typeof dispatch>[0]) => {
    const feedback = recordStrategyDecision(gameState, action);
    onDecisionFeedback?.(feedback);
    dispatch(dispatchAction);
    if (action !== 'DEAL' && feedback?.isOptimal) {
      addExperience(14, 'Optimal play');
    }
  };

  const handleHit = () => handleDecision('HIT', { type: 'HIT' });

  const handleStand = () => handleDecision('STAND', { type: 'STAND' });

  const handleDouble = () => handleDecision('DOUBLE', { type: 'DOUBLE' });

  const handleSplit = () => handleDecision('SPLIT', { type: 'SPLIT' });

  useEffect(() => {
    if (gameState.gamePhase !== 'finished' || gameState.handResults.length === 0) return;
    const signature = `${gameState.handResults.join('-')}-${gameState.dealerHand.cards.length}-${gameState.playerHands.length}`;
    if (signature === lastRoundSignature.current) return;
    lastRoundSignature.current = signature;

    const wins = gameState.handResults.filter(result => result === 'win').length;
    if (wins > 0) {
      addExperience(wins * 20, 'Winning hand');
    }
  }, [addExperience, gameState.dealerHand.cards.length, gameState.gamePhase, gameState.handResults, gameState.playerHands.length]);

  const currentPlayerHand = gameState.playerHands[gameState.currentHandIndex];
  const hasSplitHands = gameState.playerHands.length > 1;
  const showSplitLayout = hasSplitHands || gameState.canSplit;
  const showDealerSecondCard = gameState.gamePhase === 'dealer' || gameState.gamePhase === 'finished';

  return (
    <div className={`${themeClasses.cardBg} backdrop-blur-sm border ${themeClasses.border} rounded-xl p-8 shadow-lg`}>
      {/* Dealer Section */}
      <div className="mb-12">
        <h3 className={`${themeClasses.text} text-lg font-semibold mb-4`}>Dealer</h3>
        <div className="flex space-x-4 mb-4">
          {gameState.dealerHand.cards.map((card, index) => (
            <div key={index}>
              <PlayingCard card={card} hidden={index === 1 && !showDealerSecondCard} />
            </div>
          ))}
        </div>
        <div className={`${themeClasses.text} font-semibold`}>
          Total: {showDealerSecondCard ? gameState.dealerHand.value : gameState.dealerHand.cards[0]?.value || '?'}
        </div>
      </div>

      {/* Player Section */}
      <div className="mb-6">
        <h3 className={`${themeClasses.text} text-base font-semibold mb-3`}>
          {showSplitLayout ? 'Your Hands' : 'Your Hand'}
        </h3>
        {showSplitLayout ? (
          <>
            <div className="flex flex-wrap gap-4 mb-2">
              {gameState.playerHands.map((hand, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-3 ${themeClasses.border} ${
                    index === gameState.currentHandIndex ? 'ring-2 ring-offset-2 ring-indigo-500' : 'opacity-80'
                  } ${themeClasses.cardBg}`}
                >
                  <div className={`flex items-center justify-between mb-2 ${themeClasses.text}`}>
                    <span className="text-sm font-semibold">Hand {index + 1}</span>
                    {index === gameState.currentHandIndex && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500 text-white">Playing</span>
                    )}
                  </div>
                  <div className="flex space-x-2 mb-2">
                    {hand.cards.map((card, idx) => (
                      <div key={idx} className="transform scale-90">
                        <PlayingCard card={card} />
                      </div>
                    ))}
                  </div>
                  <div className={`${themeClasses.text} font-semibold text-sm`}>
                    Total: {hand.value}
                    {hand.isSoft && hand.value <= 21 && ' (Soft)'}
                  </div>
                </div>
              ))}
            </div>
            <div className={`${themeClasses.text} font-semibold text-lg`}>
              Playing Hand {gameState.currentHandIndex + 1}: {currentPlayerHand.value}
              {currentPlayerHand.isSoft && currentPlayerHand.value <= 21 && ' (Soft)'}
            </div>
          </>
        ) : (
          <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-4`}> 
            <div className="flex space-x-2 mb-3">
              {currentPlayerHand.cards.length > 0 ? (
                currentPlayerHand.cards.map((card, idx) => (
                  <div key={idx} className="transform scale-95">
                    <PlayingCard card={card} />
                  </div>
                ))
              ) : (
                <span className={`${themeClasses.textSecondary} text-sm`}>No cards dealt yet</span>
              )}
            </div>
            <div className={`${themeClasses.text} font-semibold`}>
              Total: {currentPlayerHand.cards.length > 0 ? currentPlayerHand.value : '--'}
              {currentPlayerHand.isSoft && currentPlayerHand.value <= 21 && currentPlayerHand.cards.length > 0 && ' (Soft)'}
            </div>
          </div>
        )}
      </div>

      {/* Game Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        {gameState.gamePhase === 'ready' && (
          <button
            onClick={handleDealCards}
            className={`${themeClasses.accent} ${themeClasses.accentHover} text-white px-5 py-2 rounded-lg font-semibold transition-all`}
          >
            Deal Cards
          </button>
        )}

        {gameState.gamePhase === 'playing' && (
          <>
            <button
              onClick={handleHit}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold transition-all"
            >
              Hit
            </button>
            <button
              onClick={handleStand}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition-all"
            >
              Stand
            </button>
            {gameState.canDouble && (
              <button
                onClick={handleDouble}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold transition-all"
              >
                Double
              </button>
            )}
            {gameState.canSplit && (
              <button
                onClick={handleSplit}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold transition-all"
              >
                Split
              </button>
            )}
          </>
        )}
      </div>

      {/* Game Status */}
      {gameState.lastAction && (
        <div className={`text-center mb-3 text-base font-semibold ${themeClasses.text}`}>
          {gameState.lastAction}
        </div>
      )}

      {/* New Game Button */}
      {(gameState.gamePhase === 'finished' || gameState.gamePhase === 'ready') && (
        <div className="text-center mt-4">
          <button
            onClick={handleNewGame}
            className={`flex items-center space-x-2 ${themeClasses.cardBg} ${themeClasses.text} ${themeClasses.surfaceHover} px-5 py-2 rounded-lg font-semibold transition-all mx-auto border ${themeClasses.border}`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>New Game</span>
          </button>
        </div>
      )}
    </div>
  );
};