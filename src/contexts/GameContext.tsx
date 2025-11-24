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
  handResults: ('win' | 'loss' | 'push')[];
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

const getHandOptions = (hand: Hand) => ({
  canDouble: hand.cards.length === 2,
  canSplit: hand.cards.length === 2 && hand.cards[0].rank === hand.cards[1].rank,
  canSurrender: hand.cards.length === 2,
});

interface FinalizeRoundArgs {
  state: GameState;
  updatedHands: Hand[];
  deck: Card[];
  countState: { runningCount: number; cardsRemaining: number; trueCount: number };
  endMessage: string;
}

const finalizeRound = ({ state, updatedHands, deck, countState, endMessage }: FinalizeRoundArgs): GameState => {
  let dealerCards = [...state.dealerHand.cards];
  let dealerDeck = [...deck];
  let dealerHandValue = calculateHandValue(dealerCards);
  const dealerDrawnCards: Card[] = [];
  let roundCounts = countState;

  while (dealerHandValue < 17 && dealerDeck.length > 0) {
    const newCard = dealerDeck[0];
    dealerCards.push(newCard);
    dealerDeck = dealerDeck.slice(1);
    dealerHandValue = calculateHandValue(dealerCards);
    dealerDrawnCards.push(newCard);
  }

  if (dealerDrawnCards.length > 0) {
    roundCounts = updateCounts(countState.runningCount, countState.cardsRemaining, dealerDrawnCards);
  }

  const handResults = updatedHands.map(hand => {
    if (hand.value > 21) return 'loss';
    if (dealerHandValue > 21) return 'win';
    if (hand.value > dealerHandValue) return 'win';
    if (hand.value < dealerHandValue) return 'loss';
    return 'push';
  });

  const resultSummary = handResults
    .map((result, idx) => {
      const label = result === 'win' ? 'Win' : result === 'loss' ? 'Lose' : 'Push';
      return `Hand ${idx + 1}: ${label}`;
    })
    .join(' • ');

  return {
    ...state,
    playerHands: updatedHands,
    dealerHand: {
      cards: dealerCards,
      value: dealerHandValue,
      isSoft: dealerCards.some(card => card.rank === 'A') && dealerHandValue <= 21,
    },
    deck: dealerDeck,
    gamePhase: 'finished',
    lastAction: `${endMessage}. ${resultSummary}`.trim(),
    runningCount: roundCounts.runningCount,
    trueCount: roundCounts.trueCount,
    cardsRemaining: roundCounts.cardsRemaining,
    handResults,
    currentHandIndex: 0,
    canDouble: false,
    canSplit: false,
    canSurrender: false,
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
  handResults: [],
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
        handResults: [],
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
        ...getHandOptions(newPlayerHand),
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
      
      if (newValue > 21) {
        if (state.currentHandIndex < state.playerHands.length - 1) {
          const nextIndex = state.currentHandIndex + 1;
          const nextHand = state.playerHands[nextIndex];

          return {
            ...state,
            playerHands: updatedHands,
            deck: state.deck.slice(1),
            currentHandIndex: nextIndex,
            gamePhase: 'playing',
            lastAction: `Hand ${state.currentHandIndex + 1} busts. Playing hand ${nextIndex + 1}.`,
            runningCount: hitCounts.runningCount,
            trueCount: hitCounts.trueCount,
            cardsRemaining: hitCounts.cardsRemaining,
            ...getHandOptions(nextHand),
          };
        }

        return finalizeRound({
          state,
          updatedHands,
          deck: state.deck.slice(1),
          countState: hitCounts,
          endMessage: 'Bust! Evaluating results.',
        });
      }

      return {
        ...state,
        playerHands: updatedHands,
        deck: state.deck.slice(1),
        canDouble: false,
        canSplit: false,
        canSurrender: false,
        gamePhase: 'playing',
        lastAction: 'Hit',
        runningCount: hitCounts.runningCount,
        trueCount: hitCounts.trueCount,
        cardsRemaining: hitCounts.cardsRemaining,
      };
    
    case 'STAND':
      if (state.currentHandIndex < state.playerHands.length - 1) {
        const nextIndex = state.currentHandIndex + 1;
        const nextHand = state.playerHands[nextIndex];

        return {
          ...state,
          currentHandIndex: nextIndex,
          gamePhase: 'playing',
          lastAction: `Hand ${state.currentHandIndex + 1} stands. Playing hand ${nextIndex + 1}.`,
          ...getHandOptions(nextHand),
        };
      }

      return finalizeRound({
        state,
        updatedHands: state.playerHands,
        deck: state.deck,
        countState: {
          runningCount: state.runningCount,
          cardsRemaining: state.cardsRemaining,
          trueCount: state.trueCount,
        },
        endMessage: 'Stand',
      });
    
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

      const doubledBust = doubleValue > 21;

      let afterDoubleDeck = state.deck.slice(1);
      const doubleBaseState = {
        ...state,
        playerHands: doubleUpdatedHands,
        deck: afterDoubleDeck,
        runningCount: doubleCountsAfterPlayer.runningCount,
        trueCount: doubleCountsAfterPlayer.trueCount,
        cardsRemaining: doubleCountsAfterPlayer.cardsRemaining,
      };

      if (state.currentHandIndex < state.playerHands.length - 1) {
        const nextIndex = state.currentHandIndex + 1;
        const nextHand = state.playerHands[nextIndex];

        return {
          ...doubleBaseState,
          currentHandIndex: nextIndex,
          gamePhase: 'playing',
          lastAction: `Hand ${state.currentHandIndex + 1} ${doubledBust ? 'busts after doubling' : 'doubles'}. Playing hand ${nextIndex + 1}.`,
          ...getHandOptions(nextHand),
        };
      }

      return finalizeRound({
        state: doubleBaseState,
        updatedHands: doubleUpdatedHands,
        deck: afterDoubleDeck,
        countState: doubleCountsAfterPlayer,
        endMessage: doubledBust ? 'Bust after double down' : 'Double Down',
      });

    case 'SPLIT':
      const handToSplit = state.playerHands[state.currentHandIndex];
      if (handToSplit.cards.length !== 2 || handToSplit.cards[0].rank !== handToSplit.cards[1].rank || state.deck.length < 2) {
        return state;
      }

      const [firstCard, secondCard] = handToSplit.cards;
      const splitCard1 = state.deck[0];
      const splitCard2 = state.deck[1];

      const firstHand: Hand = {
        cards: [firstCard, splitCard1],
        value: calculateHandValue([firstCard, splitCard1]),
        isSoft: [firstCard, splitCard1].some(card => card.rank === 'A')
      };

      const secondHand: Hand = {
        cards: [secondCard, splitCard2],
        value: calculateHandValue([secondCard, splitCard2]),
        isSoft: [secondCard, splitCard2].some(card => card.rank === 'A')
      };

      const postSplitCounts = updateCounts(state.runningCount, state.cardsRemaining, [splitCard1, splitCard2]);

      const newHands = [firstHand, secondHand];
      const firstHandOptions = getHandOptions(firstHand);

      return {
        ...state,
        playerHands: newHands,
        deck: state.deck.slice(2),
        currentHandIndex: 0,
        gamePhase: 'playing',
        lastAction: `Split! Playing hand 1 of ${newHands.length}.`,
        runningCount: postSplitCounts.runningCount,
        trueCount: postSplitCounts.trueCount,
        cardsRemaining: postSplitCounts.cardsRemaining,
        ...firstHandOptions,
        handResults: [],
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
    if (gameState.gamePhase === 'finished' && gameState.handResults.length > 0) {
      const statsData = JSON.parse(localStorage.getItem('ratio-user') || '{}');

      if (statsData.stats) {
        const winsThisRound = gameState.handResults.filter(result => result === 'win').length;
        const lossesThisRound = gameState.handResults.filter(result => result === 'loss').length;
        const handsThisRound = gameState.handResults.length;

        const prevHandsPlayed = statsData.stats.handsPlayed || 0;
        const prevWinRate = statsData.stats.winRate || 0;
        const prevWins = Math.round(prevHandsPlayed * prevWinRate);

        const updatedHandsPlayed = prevHandsPlayed + handsThisRound;
        const updatedWins = prevWins + winsThisRound;

        statsData.stats.gamesPlayed = (statsData.stats.gamesPlayed || 0) + 1;
        statsData.stats.handsPlayed = updatedHandsPlayed;
        statsData.stats.winRate = updatedHandsPlayed > 0 ? updatedWins / updatedHandsPlayed : 0;

        const sessionResult = winsThisRound > lossesThisRound ? 'win' : lossesThisRound > winsThisRound ? 'loss' : 'push';

        const newSession = {
          date: new Date().toISOString(),
          handsPlayed: handsThisRound,
          result: sessionResult,
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
  }, [gameState.gamePhase, gameState.handResults]);

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