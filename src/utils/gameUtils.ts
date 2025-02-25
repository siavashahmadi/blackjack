import { Card, Rank, Suit, Player, GameState } from '../types/game';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const INITIAL_CHIPS = 500;

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        value: calculateCardValue(rank),
      });
    }
  }
  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const calculateCardValue = (rank: Rank): number => {
  if (rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(rank)) return 10;
  return parseInt(rank);
};

export const calculateHandValue = (hand: Card[]): number => {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.rank === 'A') {
      aces += 1;
    }
    value += card.value;
  }

  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
};

export const createPlayer = (isDealer = false): Player => ({
  hand: [],
  score: 0,
  busted: false,
  bet: 0,
  chips: isDealer ? 0 : INITIAL_CHIPS,
  canSplit: false,
});

export const dealCard = (deck: Card[]): [Card, Card[]] => {
  const newDeck = [...deck];
  const card = newDeck.pop();
  if (!card) throw new Error('Deck is empty');
  return [card, newDeck];
};

export const checkForNaturalBlackjack = (hand: Card[]): boolean => {
  return hand.length === 2 && calculateHandValue(hand) === 21;
};

export const canSplitHand = (hand: Card[]): boolean => {
  return hand.length === 2 && hand[0].rank === hand[1].rank;
};

export const checkGameState = (gameState: GameState): GameState => {
  const playerScore = gameState.player.score;
  const dealerScore = gameState.dealer.score;
  const playerHasBlackjack = checkForNaturalBlackjack(gameState.player.hand);
  const dealerHasBlackjack = checkForNaturalBlackjack(gameState.dealer.hand);

  // Check for natural blackjacks
  if (playerHasBlackjack || dealerHasBlackjack) {
    if (playerHasBlackjack && dealerHasBlackjack) {
      return {
        ...gameState,
        gameStatus: 'gameOver',
        winner: 'push',
        message: "Both have Blackjack - It's a Push!"
      };
    } else if (playerHasBlackjack) {
      return {
        ...gameState,
        gameStatus: 'gameOver',
        winner: 'player',
        message: 'Blackjack! You win 3:2!'
      };
    } else {
      return {
        ...gameState,
        gameStatus: 'gameOver',
        winner: 'dealer',
        message: 'Dealer has Blackjack!'
      };
    }
  }

  // Check for busts
  if (playerScore > 21) {
    return {
      ...gameState,
      gameStatus: 'gameOver',
      winner: 'dealer',
      message: 'Bust! You lose!'
    };
  }

  if (dealerScore > 21) {
    return {
      ...gameState,
      gameStatus: 'gameOver',
      winner: 'player',
      message: 'Dealer busts! You win!'
    };
  }

  // Compare scores if neither busted
  if (gameState.gameStatus === 'gameOver') {
    if (playerScore === dealerScore) {
      return {
        ...gameState,
        winner: 'push',
        message: "It's a Push!"
      };
    } else if (playerScore > dealerScore) {
      return {
        ...gameState,
        winner: 'player',
        message: 'You win!'
      };
    } else {
      return {
        ...gameState,
        winner: 'dealer',
        message: 'Dealer wins!'
      };
    }
  }

  return gameState;
}; 