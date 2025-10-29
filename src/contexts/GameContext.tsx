import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  value: number;
  hiLoValue: number;
}

export interface Hand {
  cards: Card[];
  value: number;
  isSoft: boolean;
}

export interface GameState {
  deck: Card[];
  playerHands: Hand[];
  dealerHand: Hand;
  currentHandIndex: number;
  gamePhase: 'ready' | 'dealing' | 'playing' | 'dealer' | 'finished';
  runningCount: number;
  trueCount: number;
  cardsRemaining: number;
  lastAction: string;
  canDouble: boolean;
  canSplit: boolean;
  canSurrender: boolean;
}

type GameAction =
  | { type: 'NEW_GAME' }
  | { type: 'DEAL_CARDS' }
  | { type: 'HIT' }
  | { type: 'STAND' }
  | { type: 'DOUBLE' }
  | { type: 'SPLIT' }
  | { type: 'SURRENDER' };

const calculateTrueCount = (runningCount: number, cardsRemaining: number) => {
  if (cardsRemaining <= 0) return runningCount;
  const decksRemaining = Math.max(cardsRemaining / 52, 0.25);
  return parseFloat((runningCount / decksRemaining).toFixed(1));
};

const updateCounts = (
  runningCount: number,
  cardsRemaining: number,
  cards: Card[]
) => {
  const newRunningCount = cards.reduce((total, card) => total + card.hiLoValue, runningCount);
  const newCardsRemaining = Math.max(cardsRemaining - cards.length, 0);
  const newTrueCount = calculateTrueCount(newRunningCount, newCardsRemaining);

  return {
    runningCount: newRunningCount,
    cardsRemaining: newCardsRemaining,
    trueCount: newTrueCount,
  };
};

const initialState: GameState = {
  deck: [],
  playerHands: [{ cards: [], value: 0, isSoft: false }],
  dealerHand: { cards: [], value: 0, isSoft: false },
  currentHandIndex: 0,
  gamePhase: 'ready',
  runningCount: 0,
  trueCount: 0,
  cardsRemaining: 312, // 6 decks
  lastAction: '',
  canDouble: false,
  canSplit: false,
  canSurrender: false,
};

const GameContext = createContext<{
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'NEW_GAME':
      const newDeck = createDeck();
      return {
        ...initialState,
        deck: newDeck,
        playerHands: [{ cards: [], value: 0, isSoft: false }],
        dealerHand: { cards: [], value: 0, isSoft: false },
        gamePhase: 'ready',
        runningCount: 0,
        trueCount: 0,
        cardsRemaining: newDeck.length,
      };
    
    case 'DEAL_CARDS':
      // Deal initial cards
      const playerCard1 = state.deck[0];
      const dealerCard1 = state.deck[1];
      const playerCard2 = state.deck[2];
      const dealerCard2 = state.deck[3];

      const dealCounts = updateCounts(state.runningCount, state.cardsRemaining, [
        playerCard1,
        dealerCard1,
        playerCard2,
        dealerCard2,
      ]);

      const newPlayerHand = {
        cards: [playerCard1, playerCard2],
        value: calculateHandValue([playerCard1, playerCard2]),
        isSoft: [playerCard1, playerCard2].some(card => card.rank === 'A')
      };
      
      const newDealerHand = {
        cards: [dealerCard1, dealerCard2],
        value: calculateHandValue([dealerCard1]),
        isSoft: dealerCard1.rank === 'A'
      };
      
      return {
        ...state,
        playerHands: [newPlayerHand],
        dealerHand: newDealerHand,
        deck: state.deck.slice(4),
        gamePhase: 'playing',
        canDouble: true,
        canSplit: playerCard1.rank === playerCard2.rank,
        canSurrender: true,
        runningCount: dealCounts.runningCount,
        trueCount: dealCounts.trueCount,
        cardsRemaining: dealCounts.cardsRemaining,
      };
    
    case 'HIT':
      const hitCard = state.deck[0];
      const currentHand = state.playerHands[state.currentHandIndex];
      const newCards = [...currentHand.cards, hitCard];
      const newValue = calculateHandValue(newCards);

      const hitCounts = updateCounts(state.runningCount, state.cardsRemaining, [hitCard]);

      const updatedHands = state.playerHands.map((hand, index) =>
        index === state.currentHandIndex
          ? { ...hand, cards: newCards, value: newValue, isSoft: newCards.some(card => card.rank === 'A') && newValue <= 21 }
          : hand
      );
      
      return {
        ...state,
        playerHands: updatedHands,
        deck: state.deck.slice(1),
        canDouble: false,
        canSplit: false,
        canSurrender: false,
        gamePhase: newValue > 21 ? 'finished' : 'playing',
        lastAction: newValue > 21 ? 'Bust!' : 'Hit',
        runningCount: hitCounts.runningCount,
        trueCount: hitCounts.trueCount,
        cardsRemaining: hitCounts.cardsRemaining,
      };
    
    case 'STAND':
      let dealerState = { ...state, gamePhase: 'dealer' as const, lastAction: 'Stand' };
      let dealerHandValue = calculateHandValue(dealerState.dealerHand.cards);
      let dealerCards = [...dealerState.dealerHand.cards];
      let dealerDeck = [...dealerState.deck];
      let standCounts = {
        runningCount: state.runningCount,
        cardsRemaining: state.cardsRemaining,
        trueCount: state.trueCount,
      };
      const dealerDrawnCards: Card[] = [];

      while (dealerHandValue < 17 && dealerDeck.length > 0) {
        const newCard = dealerDeck[0];
        dealerCards.push(newCard);
        dealerDeck = dealerDeck.slice(1);
        dealerHandValue = calculateHandValue(dealerCards);
        dealerDrawnCards.push(newCard);
      }

      if (dealerDrawnCards.length > 0) {
        standCounts = updateCounts(standCounts.runningCount, standCounts.cardsRemaining, dealerDrawnCards);
      }

      const playerValue = state.playerHands[state.currentHandIndex].value;
      let result = '';

      if (playerValue > 21) {
        result = 'Bust! You lose.';
      } else if (dealerHandValue > 21) {
        result = 'Dealer busts! You win!';
      } else if (playerValue > dealerHandValue) {
        result = 'You win!';
      } else if (playerValue < dealerHandValue) {
        result = 'Dealer wins.';
      } else {
        result = 'Push! It\'s a tie.';
      }

      return {
        ...dealerState,
        dealerHand: {
          cards: dealerCards,
          value: dealerHandValue,
          isSoft: dealerCards.some(card => card.rank === 'A') && dealerHandValue <= 21
        },
        deck: dealerDeck,
        gamePhase: 'finished',
        lastAction: result,
        runningCount: standCounts.runningCount,
        trueCount: standCounts.trueCount,
        cardsRemaining: standCounts.cardsRemaining,
      };
    
    case 'DOUBLE':
      const doubleCard = state.deck[0];
      const doubleHand = state.playerHands[state.currentHandIndex];
      const doubleCards = [...doubleHand.cards, doubleCard];
      const doubleValue = calculateHandValue(doubleCards);

      const doubleCountsAfterPlayer = updateCounts(state.runningCount, state.cardsRemaining, [doubleCard]);

      const doubleUpdatedHands = state.playerHands.map((hand, index) =>
        index === state.currentHandIndex
          ? { ...hand, cards: doubleCards, value: doubleValue, isSoft: doubleCards.some(card => card.rank === 'A') && doubleValue <= 21 }
          : hand
      );

      let afterDoubleDeck = state.deck.slice(1);
      let afterDoubleState = {
        ...state,
        playerHands: doubleUpdatedHands,
        deck: afterDoubleDeck,
        gamePhase: 'dealer' as const,
        lastAction: 'Double Down',
        runningCount: doubleCountsAfterPlayer.runningCount,
        trueCount: doubleCountsAfterPlayer.trueCount,
        cardsRemaining: doubleCountsAfterPlayer.cardsRemaining,
      };

      if (doubleValue > 21) {
        return {
          ...afterDoubleState,
          gamePhase: 'finished',
          lastAction: 'Bust! You lose.'
        };
      }

      let doubleDealerHandValue = calculateHandValue(afterDoubleState.dealerHand.cards);
      let doubleDealerCards = [...afterDoubleState.dealerHand.cards];
      const doubleDealerDrawnCards: Card[] = [];

      while (doubleDealerHandValue < 17 && afterDoubleDeck.length > 0) {
        const newCard = afterDoubleDeck[0];
        doubleDealerCards.push(newCard);
        afterDoubleDeck = afterDoubleDeck.slice(1);
        doubleDealerHandValue = calculateHandValue(doubleDealerCards);
        doubleDealerDrawnCards.push(newCard);
      }

      let doubleCountsFinal = {
        runningCount: afterDoubleState.runningCount,
        cardsRemaining: afterDoubleState.cardsRemaining,
        trueCount: afterDoubleState.trueCount,
      };

      if (doubleDealerDrawnCards.length > 0) {
        doubleCountsFinal = updateCounts(
          doubleCountsFinal.runningCount,
          doubleCountsFinal.cardsRemaining,
          doubleDealerDrawnCards
        );
      }

      let doubleResult = '';
      if (doubleDealerHandValue > 21) {
        doubleResult = 'Dealer busts! You win!';
      } else if (doubleValue > doubleDealerHandValue) {
        doubleResult = 'You win!';
      } else if (doubleValue < doubleDealerHandValue) {
        doubleResult = 'Dealer wins.';
      } else {
        doubleResult = 'Push! It\'s a tie.';
      }

      return {
        ...afterDoubleState,
        dealerHand: {
          cards: doubleDealerCards,
          value: doubleDealerHandValue,
          isSoft: doubleDealerCards.some(card => card.rank === 'A') && doubleDealerHandValue <= 21
        },
        deck: afterDoubleDeck,
        gamePhase: 'finished',
        lastAction: doubleResult,
        runningCount: doubleCountsFinal.runningCount,
        trueCount: doubleCountsFinal.trueCount,
        cardsRemaining: doubleCountsFinal.cardsRemaining,
      };
    
    default:
      return state;
  }
};

const createDeck = (): Card[] => {
  const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Card['rank'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  // Create 6 decks
  for (let deckNum = 0; deckNum < 6; deckNum++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        let value = 10;
        let hiLoValue = 0;

        if (rank === 'A') value = 11;
        else if (['2', '3', '4', '5', '6', '7', '8', '9'].includes(rank)) {
          value = parseInt(rank);
        }

        // Hi-Lo values
        if (['2', '3', '4', '5', '6'].includes(rank)) hiLoValue = 1;
        else if (['10', 'J', 'Q', 'K', 'A'].includes(rank)) hiLoValue = -1;

        deck.push({ suit, rank, value, hiLoValue });
      }
    }
  }

  // Shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

const calculateHandValue = (cards: Card[]): number => {
  let value = 0;
  let aces = 0;
  
  for (const card of cards) {
    if (card.rank === 'A') {
      aces++;
      value += 11;
    } else {
      value += card.value;
    }
  }
  
  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
};
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, {
    ...initialState,
    deck: createDeck(),
  });

  useEffect(() => {
    if (gameState.gamePhase === 'finished' && gameState.lastAction) {
      const statsData = JSON.parse(localStorage.getItem('ratio-user') || '{}');
      if (statsData.stats) {
        const isWin = gameState.lastAction.includes('win') && !gameState.lastAction.includes('Dealer wins');
        const isLoss = gameState.lastAction.includes('lose') || gameState.lastAction.includes('Bust') || gameState.lastAction.includes('Dealer wins');

        statsData.stats.gamesPlayed = (statsData.stats.gamesPlayed || 0) + 1;
        statsData.stats.handsPlayed = (statsData.stats.handsPlayed || 0) + 1;

        if (isWin) {
          const wins = ((statsData.stats.gamesPlayed - 1) * (statsData.stats.winRate || 0)) + 1;
          statsData.stats.winRate = wins / statsData.stats.gamesPlayed;
        } else if (isLoss) {
          const wins = (statsData.stats.gamesPlayed - 1) * (statsData.stats.winRate || 0);
          statsData.stats.winRate = wins / statsData.stats.gamesPlayed;
        }

        const newSession = {
          date: new Date().toISOString(),
          handsPlayed: 1,
          result: isWin ? 'win' : isLoss ? 'loss' : 'push',
          netWin: 0
        };

        statsData.stats.recentSessions = [
          newSession,
          ...(statsData.stats.recentSessions || []).slice(0, 9)
        ];

        localStorage.setItem('ratio-user', JSON.stringify(statsData));
        window.dispatchEvent(new Event('storage'));
      }
    }
  }, [gameState.gamePhase, gameState.lastAction]);

  return (
    <GameContext.Provider value={{ gameState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};