import { GameState } from '../contexts/GameContext';

export type PlayerAction = 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER' | 'DEAL';

export interface StrategyFeedback {
  playerAction: PlayerAction;
  optimalAction: PlayerAction;
  isOptimal: boolean;
  message: string;
  recommendationReason: string;
}

interface StrategyRecommendation {
  action: PlayerAction;
  reason: string;
  confidence: 'High' | 'Medium' | 'Low' | 'N/A';
  color: string;
}

export const getStrategyRecommendation = (gameState: GameState): StrategyRecommendation => {
  const playerHand = gameState.playerHands[gameState.currentHandIndex];
  const dealerUpcard = gameState.dealerHand.cards[0];

  if (!playerHand || !dealerUpcard || gameState.gamePhase !== 'playing') {
    return {
      action: 'DEAL',
      reason: 'Start a new hand to get strategy recommendations.',
      confidence: 'N/A',
      color: 'text-blue-500'
    };
  }

  const playerValue = playerHand.value;
  const dealerValue = dealerUpcard.value === 11 ? 1 : dealerUpcard.value; // Treat dealer Ace as 1 for upcard
  const isPlayerSoft = playerHand.isSoft && playerValue <= 21;
  const isPair = playerHand.cards.length === 2 && playerHand.cards[0].rank === playerHand.cards[1].rank;

  // Basic Strategy Logic
  if (isPair && gameState.canSplit) {
    const pairRank = playerHand.cards[0].rank;
    if (pairRank === 'A' || pairRank === '8') {
      return {
        action: 'SPLIT',
        reason: `Always split ${pairRank}s. This is a fundamental rule.`,
        confidence: 'High',
        color: 'text-purple-500'
      };
    }
    if (pairRank === '10' || pairRank === 'J' || pairRank === 'Q' || pairRank === 'K') {
      return {
        action: 'STAND',
        reason: 'Never split 10-value cards. 20 is an excellent hand.',
        confidence: 'High',
        color: 'text-green-500'
      };
    }
  }

  if (isPlayerSoft) {
    if (playerValue >= 19) {
      return {
        action: 'STAND',
        reason: `Soft ${playerValue} is a strong hand.`,
        confidence: 'High',
        color: 'text-green-500'
      };
    }
    if (playerValue === 18 && dealerValue >= 9) {
      return {
        action: 'HIT',
        reason: 'Soft 18 vs 9/10/A should be hit to improve.',
        confidence: 'High',
        color: 'text-orange-500'
      };
    }
    if (playerValue <= 17 && dealerValue >= 4 && dealerValue <= 6 && gameState.canDouble) {
      return {
        action: 'DOUBLE',
        reason: `Double soft ${playerValue} vs weak dealer card.`,
        confidence: 'High',
        color: 'text-blue-500'
      };
    }
  } else {
    // Hard hands
    if (playerValue >= 17) {
      return {
        action: 'STAND',
        reason: `Hard ${playerValue} is strong enough to stand.`,
        confidence: 'High',
        color: 'text-green-500'
      };
    }
    if (playerValue === 11 && gameState.canDouble) {
      return {
        action: 'DOUBLE',
        reason: 'Always double 11 when possible.',
        confidence: 'High',
        color: 'text-blue-500'
      };
    }
    if (playerValue === 10 && dealerValue <= 9 && gameState.canDouble) {
      return {
        action: 'DOUBLE',
        reason: 'Double 10 vs 2-9.',
        confidence: 'High',
        color: 'text-blue-500'
      };
    }
    if (playerValue >= 12 && playerValue <= 16) {
      if (dealerValue >= 2 && dealerValue <= 6) {
        return {
          action: 'STAND',
          reason: `Stand ${playerValue} vs weak dealer card (${dealerUpcard.rank}).`,
          confidence: 'Medium',
          color: 'text-green-500'
        };
      } else {
        return {
          action: 'HIT',
          reason: `Hit ${playerValue} vs strong dealer card (${dealerUpcard.rank}).`,
          confidence: 'Medium',
          color: 'text-orange-500'
        };
      }
    }
  }

  return {
    action: 'HIT',
    reason: `With ${playerValue}, you should hit to improve your hand.`,
    confidence: 'Medium',
    color: 'text-orange-500'
  };
};

export const recordStrategyDecision = (
  gameState: GameState,
  playerAction: PlayerAction
): StrategyFeedback | null => {
  if (gameState.gamePhase !== 'playing') return null;

  const recommendation = getStrategyRecommendation(gameState);
  const optimalAction = recommendation.action;
  const storedUser = JSON.parse(localStorage.getItem('ratio-user') || '{}');
  const stats = storedUser.stats || {};

  const strategyDecisions = (stats.strategyDecisions || 0) + 1;
  const isOptimal = playerAction === optimalAction;
  const strategyCorrect = (stats.strategyCorrect || 0) + (isOptimal ? 1 : 0);
  const strategyAccuracy = strategyDecisions > 0 ? strategyCorrect / strategyDecisions : 0;

  storedUser.stats = {
    ...stats,
    strategyDecisions,
    strategyCorrect,
    strategyAccuracy
  };

  localStorage.setItem('ratio-user', JSON.stringify(storedUser));
  window.dispatchEvent(new Event('storage'));

  return {
    playerAction,
    optimalAction,
    isOptimal,
    message: isOptimal
      ? `${playerAction} was the optimal play for this hand.`
      : `${optimalAction} was the better play here.`,
    recommendationReason: recommendation.reason,
  };
};
