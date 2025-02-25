export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

export interface Player {
  hand: Card[];
  score: number;
  busted: boolean;
  bet: number;
  chips: number;
  canSplit: boolean;
  splitHand?: Player;
}

export interface GameState {
  deck: Card[];
  player: Player;
  dealer: Player;
  gameStatus: 'betting' | 'playing' | 'playerTurn' | 'dealerTurn' | 'gameOver';
  winner: 'player' | 'dealer' | 'push' | null;
  canDoubleDown: boolean;
  canSurrender: boolean;
  currentBet: number;
  message: string;
  splitHand?: Player;
} 