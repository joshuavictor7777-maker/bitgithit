import React, { useState } from 'react';
import { PlayingCard } from './PlayingCard';
import { useGame } from '../contexts/GameContext';
import { useTheme } from '../contexts/ThemeContext';
import { PlayerAction, recordStrategyDecision, StrategyFeedback } from '../utils/strategy';
import { RefreshCw } from 'lucide-react';

interface BlackjackGameProps {
  onDecisionFeedback?: (feedback: StrategyFeedback | null) => void;
}

export const BlackjackGame: React.FC<BlackjackGameProps> = ({ onDecisionFeedback }) => {
  const { gameState, dispatch } = useGame();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!user.preferences.autoAdvance) return;
    if (gameState.gamePhase !== 'finished') return;

    const timer = setTimeout(() => {
      dispatch({ type: 'NEW_GAME' });
    }, 900);

    return () => clearTimeout(timer);
  }, [dispatch, gameState.gamePhase, user.preferences.autoAdvance]);

  useEffect(() => {
    if (!user.preferences.autoAdvance) return;
    if (gameState.gamePhase !== 'ready') return;

    const currentHand = gameState.playerHands[gameState.currentHandIndex];
    const hasCards = currentHand?.cards.length > 0;
    if (hasCards) return;

    const timer = setTimeout(() => {
      dispatch({ type: 'DEAL_CARDS' });
    }, 150);

    return () => clearTimeout(timer);
  }, [dispatch, gameState.currentHandIndex, gameState.gamePhase, gameState.playerHands, user.preferences.autoAdvance]);

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
  };

  const handleHit = () => handleDecision('HIT', { type: 'HIT' });

  const handleStand = () => handleDecision('STAND', { type: 'STAND' });

  const handleDouble = () => handleDecision('DOUBLE', { type: 'DOUBLE' });

  const handleSplit = () => handleDecision('SPLIT', { type: 'SPLIT' });

  const currentPlayerHand = gameState.playerHands[gameState.currentHandIndex];
  const hasSplitHands = gameState.playerHands.length > 1;
  const showSplitLayout = hasSplitHands;
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