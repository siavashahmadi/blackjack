import { createContext, useContext, ReactNode, useReducer } from 'react';
import { GameState, Card } from '../types/game';
import {
  createDeck,
  createPlayer,
  dealCard,
  calculateHandValue,
  checkGameState,
  checkForNaturalBlackjack
} from '../utils/gameUtils';

// Constants
export const MINIMUM_BET = 5;
export const INITIAL_CHIPS = 10000;
export const CHIP_VALUES = [100, 500, 1000, 5000];

// Game Action Types
export type GameAction =
  | { type: 'PLACE_BET'; amount: number }
  | { type: 'DEAL_CARDS' }
  | { type: 'HIT' }
  | { type: 'STAND' }
  | { type: 'DOUBLE_DOWN' }
  | { type: 'SURRENDER' }
  | { type: 'DEALER_PLAY' }
  | { type: 'DEALER_DRAW_CARD'; card: Card }
  | { type: 'END_GAME'; winner: 'player' | 'dealer' | 'push' | null }
  | { type: 'PLAY_AGAIN' }
  | { type: 'ADD_MONEY'; amount: number }
  | { type: 'RESET_BALANCE'; amount: number }
  | { type: 'SET_MESSAGE'; message: string; messageType?: 'info' | 'success' | 'warning' | 'error' };

// Initial state
const initialGameState: GameState = {
  deck: [],
  player: { ...createPlayer(), chips: INITIAL_CHIPS },
  dealer: createPlayer(true),
  gameStatus: 'betting',
  winner: null,
  canDoubleDown: false,
  canSurrender: false,
  currentBet: 0,
  message: 'Place your bet!',
};

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLACE_BET':
      return {
        ...state,
        currentBet: action.amount,
        player: {
          ...state.player,
          chips: state.player.chips - action.amount,
          bet: action.amount
        }
      };

    case 'DEAL_CARDS': {
      const deck = createDeck();
      const dealer = createPlayer(true);

      // Deal initial cards
      let [card1, newDeck1] = dealCard(deck);
      let [card2, newDeck2] = dealCard(newDeck1);
      let [card3, newDeck3] = dealCard(newDeck2);
      let [card4, newDeck4] = dealCard(newDeck3);

      const player = {
        ...state.player,
        hand: [card1, card3],
        score: calculateHandValue([card1, card3]),
        canSplit: card1.rank === card3.rank
      };

      dealer.hand = [card2, card4];
      dealer.score = calculateHandValue(dealer.hand);

      const naturalBlackjack = checkForNaturalBlackjack(player.hand);

      const newState = {
        ...state,
        deck: newDeck4,
        player,
        dealer,
        gameStatus: naturalBlackjack ? 'gameOver' as const : 'playerTurn' as const,
        winner: naturalBlackjack ? 'player' as const : null,
        canDoubleDown: player.chips >= player.bet,
        canSurrender: true,
        message: naturalBlackjack ? 'Blackjack! You win!' : 'Your turn',
      };

      // If player has blackjack, calculate winnings
      if (naturalBlackjack) {
        // Blackjack pays 3:2
        const winAmount = player.bet + Math.floor(player.bet * 1.5);
        newState.player.chips += winAmount;
      }

      return newState;
    }

    case 'HIT': {
      const [card, newDeck] = dealCard(state.deck);
      const newHand = [...state.player.hand, card];
      const newScore = calculateHandValue(newHand);
      const busted = newScore > 21;

      const newState = {
        ...state,
        deck: newDeck,
        player: {
          ...state.player,
          hand: newHand,
          score: newScore,
          busted,
        },
      };

      if (busted) {
        newState.gameStatus = 'gameOver';
        newState.winner = 'dealer';
        newState.message = 'Busted! You went over 21.';
      }

      return checkGameState(newState);
    }

    case 'STAND':
      return {
        ...state,
        gameStatus: 'dealerTurn',
      };

    case 'DOUBLE_DOWN': {
      const additionalBet = state.currentBet;
      const [card, newDeck] = dealCard(state.deck);
      const newHand = [...state.player.hand, card];
      const newScore = calculateHandValue(newHand);
      const busted = newScore > 21;

      // Explicitly type the gameStatus to ensure it's one of the allowed values
      const gameStatus: GameState['gameStatus'] = busted ? 'gameOver' : 'dealerTurn';

      const newState: GameState = {
        ...state,
        deck: newDeck,
        player: {
          ...state.player,
          hand: newHand,
          score: newScore,
          busted,
          chips: state.player.chips - additionalBet,
          bet: state.player.bet + additionalBet,
        },
        currentBet: state.player.bet + additionalBet,
        gameStatus, // Use the properly typed variable
        winner: busted ? 'dealer' : null,
        message: busted ? 'Busted! You went over 21.' : 'Dealer\'s turn',
      };

      return checkGameState(newState);
    }

    case 'SURRENDER': {
      const refundAmount = Math.floor(state.player.bet / 2);
      return {
        ...state,
        player: {
          ...state.player,
          chips: state.player.chips + refundAmount,
        },
        gameStatus: 'gameOver',
        winner: 'dealer',
        message: 'Surrendered - Half bet returned',
      };
    }

    case 'DEALER_DRAW_CARD': {
      const newHand = [...state.dealer.hand, action.card];
      return {
        ...state,
        dealer: {
          ...state.dealer,
          hand: newHand,
          score: calculateHandValue(newHand),
          busted: calculateHandValue(newHand) > 21
        }
      };
    }

    case 'END_GAME': {
      const dealerScore = calculateHandValue(state.dealer.hand);
      const playerScore = state.player.score;
      const dealerHasBlackjack = checkForNaturalBlackjack(state.dealer.hand);
      const playerHasBlackjack = checkForNaturalBlackjack(state.player.hand);

      let winner = action.winner;
      let message = '';

      // Determine winner and message
      if (playerHasBlackjack) {
        if (dealerHasBlackjack) {
          winner = 'push';
          message = 'Push! Both have Blackjack.';
        } else {
          winner = 'player';
          message = 'Blackjack! You win with a natural 21!';
        }
      } else if (dealerHasBlackjack) {
        winner = 'dealer';
        message = 'Dealer has Blackjack! You lose.';
      } else if (state.player.busted) {
        winner = 'dealer';
        message = 'Busted! You went over 21.';
      } else if (dealerScore > 21) {
        winner = 'player';
        message = 'Dealer busts! You win!';
      } else if (dealerScore > playerScore) {
        winner = 'dealer';
        message = 'Dealer wins with ' + dealerScore + '.';
      } else if (playerScore > dealerScore) {
        winner = 'player';
        message = 'You win with ' + playerScore + '!';
      } else {
        winner = 'push';
        message = 'Push! It\'s a tie.';
      }

      // Calculate final state with player chips updated
      let updatedPlayerChips = state.player.chips;

      if (winner === 'player') {
        // Calculate the correct payout amount
        let winAmount;
        if (playerHasBlackjack) {
          // Blackjack pays 3:2, so bet + (bet * 1.5)
          winAmount = state.currentBet + Math.floor(state.currentBet * 1.5);
        } else {
          // Regular win pays 1:1, so bet + bet
          winAmount = state.currentBet * 2;
        }

        updatedPlayerChips += winAmount;
      } else if (winner === 'push') {
        updatedPlayerChips += state.currentBet;  // Return bet
      }

      return {
        ...state,
        player: {
          ...state.player,
          chips: updatedPlayerChips
        },
        gameStatus: 'gameOver',
        winner,
        message
      };
    }

    case 'PLAY_AGAIN':
      return {
        ...state,
        gameStatus: 'betting',
        message: 'Place your bet!',
        winner: null,
        player: {
          ...state.player,
          hand: [],
          score: 0,
          busted: false,
          bet: 0,
          canSplit: false,
        },
        dealer: createPlayer(true),
        currentBet: 0,
        canDoubleDown: false,
        canSurrender: false,
      };

    case 'ADD_MONEY':
      return {
        ...state,
        player: {
          ...state.player,
          chips: state.player.chips + action.amount
        },
        message: `$${action.amount.toLocaleString()} added to your balance!`
      };

    case 'RESET_BALANCE':
      return {
        ...state,
        player: {
          ...state.player,
          chips: action.amount
        },
        message: `Balance reset to $${action.amount.toLocaleString()}!`
      };

    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.message
      };

    default:
      return state;
  }
}

// Context type
interface GameContextType {
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
}

// Create context
const GameContext = createContext<GameContextType | null>(null);

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameContext.Provider value={{ gameState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
