import { useState, useEffect } from 'react';
import { GameState, Card, Player } from '../types/game';
import {
  createDeck,
  createPlayer,
  dealCard,
  calculateHandValue,
  checkGameState,
  canSplitHand,
  checkForNaturalBlackjack
} from '../utils/gameUtils';
import './Game.css';

const MINIMUM_BET = 5;
const INITIAL_CHIPS = 500;
const CHIP_VALUES = [5, 25, 100, 500];

interface PlacedChip {
  value: number;
  x: number;
  y: number;
  rotation: number;
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    player: { ...createPlayer(), chips: INITIAL_CHIPS },
    dealer: createPlayer(true),
    gameStatus: 'betting',
    winner: null,
    canDoubleDown: false,
    canSurrender: false,
    currentBet: 0,
    message: 'Place your bet!',
  });

  const [currentBetAmount, setCurrentBetAmount] = useState(0);
  const [placedChips, setPlacedChips] = useState<PlacedChip[]>([]);

  const addToBet = (amount: number) => {
    if (gameState.player.chips < amount || currentBetAmount + amount > gameState.player.chips) return;
    setCurrentBetAmount(prev => prev + amount);
    
    // Add a new chip with random position within the betting area
    const newChip: PlacedChip = {
      value: amount,
      x: Math.random() * 220 + 40,
      y: Math.random() * 120 + 40,
      rotation: Math.random() * 360,
    };
    setPlacedChips(prev => [...prev, newChip]);
  };

  const clearBet = () => {
    setCurrentBetAmount(0);
    setPlacedChips([]);
  };

  const placeBet = () => {
    if (currentBetAmount < MINIMUM_BET || gameState.player.chips < currentBetAmount) return;
    
    const player = { 
      ...gameState.player, 
      bet: currentBetAmount, 
      chips: gameState.player.chips - currentBetAmount 
    };
    setGameState(prev => ({
      ...prev,
      player,
      currentBet: currentBetAmount,
      gameStatus: 'playing',
    }));
    startNewGame(player);
    setCurrentBetAmount(0);
  };

  const startNewGame = (player: Player) => {
    const deck = createDeck();
    const dealer = createPlayer(true);
    
    // Deal initial cards
    let [card1, newDeck1] = dealCard(deck);
    let [card2, newDeck2] = dealCard(newDeck1);
    let [card3, newDeck3] = dealCard(newDeck2);
    let [card4, newDeck4] = dealCard(newDeck3);
    
    player.hand = [card1, card3];
    dealer.hand = [card2, card4];
    
    player.score = calculateHandValue(player.hand);
    dealer.score = calculateHandValue(dealer.hand);
    player.canSplit = canSplitHand(player.hand);

    const newGameState: GameState = {
      deck: newDeck4,
      player,
      dealer,
      gameStatus: 'playerTurn',
      winner: null,
      canDoubleDown: player.chips >= player.bet,
      canSurrender: true,
      currentBet: player.bet,
      message: '',
    };

    const checkedState = checkGameState(newGameState);
    setGameState(checkedState);
  };

  const split = () => {
    if (!gameState.player.canSplit || gameState.player.chips < gameState.currentBet) return;

    const [newCard1, newDeck1] = dealCard(gameState.deck);
    const [newCard2, newDeck2] = dealCard(newDeck1);

    const firstHand: Player = {
      ...gameState.player,
      hand: [gameState.player.hand[0], newCard1],
      score: calculateHandValue([gameState.player.hand[0], newCard1]),
      chips: gameState.player.chips - gameState.currentBet,
      canSplit: false,
    };

    const secondHand: Player = {
      ...gameState.player,
      hand: [gameState.player.hand[1], newCard2],
      score: calculateHandValue([gameState.player.hand[1], newCard2]),
      bet: gameState.currentBet,
      canSplit: false,
    };

    firstHand.splitHand = secondHand;

    setGameState({
      ...gameState,
      deck: newDeck2,
      player: firstHand,
      canDoubleDown: firstHand.chips >= firstHand.bet,
      canSurrender: false,
      message: 'Playing first hand',
    });
  };

  const hit = () => {
    if (gameState.gameStatus !== 'playerTurn') return;

    const [card, newDeck] = dealCard(gameState.deck);
    const newHand = [...gameState.player.hand, card];
    const newScore = calculateHandValue(newHand);
    const busted = newScore > 21;

    if (gameState.player.splitHand) {
      // If this is the first hand of a split
      if (busted) {
        // Move to second hand if first hand busts
        const secondHand = gameState.player.splitHand;
        setGameState({
          ...gameState,
          deck: newDeck,
          player: {
            ...gameState.player,
            hand: newHand,
            score: newScore,
            busted,
            splitHand: undefined,
          },
          message: 'Playing second hand',
        });
        // Start playing the second hand
        setGameState(prev => ({
          ...prev,
          player: secondHand,
          canDoubleDown: secondHand.chips >= secondHand.bet,
          message: 'Playing second hand',
        }));
      } else {
        setGameState({
          ...gameState,
          deck: newDeck,
          player: {
            ...gameState.player,
            hand: newHand,
            score: newScore,
            busted,
          },
          canDoubleDown: false,
        });
      }
    } else {
      // Normal hit or second hand of split
      const newGameState = {
        ...gameState,
        deck: newDeck,
        player: {
          ...gameState.player,
          hand: newHand,
          score: newScore,
          busted,
          canSplit: false,
        },
        canDoubleDown: false,
        canSurrender: false,
      };

      setGameState(checkGameState(newGameState));
    }
  };

  const stand = () => {
    if (gameState.gameStatus !== 'playerTurn') return;

    if (gameState.player.splitHand) {
      // If this is the first hand of a split
      const secondHand = gameState.player.splitHand;
      const firstHand = { ...gameState.player, splitHand: undefined };
      
      // Store the first hand's final state
      setGameState(prev => ({
        ...prev,
        player: secondHand,
        canDoubleDown: secondHand.chips >= secondHand.bet,
        message: 'Playing second hand',
        // Store the first hand for later comparison
        splitHand: firstHand,
      }));
    } else if (gameState.splitHand) {
      // If this is the second hand of a split
      const firstHand = gameState.splitHand;
      dealerPlayWithSplit(firstHand, gameState.player);
    } else {
      // Normal stand
      dealerPlay();
    }
  };

  const dealerPlayWithSplit = (firstHand: Player, secondHand: Player) => {
    let currentDealerHand = [...gameState.dealer.hand];
    let currentDeck = [...gameState.deck];
    
    while (calculateHandValue(currentDealerHand) < 17) {
      const [card, newDeck] = dealCard(currentDeck);
      currentDealerHand = [...currentDealerHand, card];
      currentDeck = newDeck;
    }

    const dealerScore = calculateHandValue(currentDealerHand);
    const dealerBusted = dealerScore > 21;

    const dealer = {
      ...gameState.dealer,
      hand: currentDealerHand,
      score: dealerScore,
      busted: dealerBusted,
    };

    // Compare dealer's hand with both split hands
    let totalWinnings = 0;
    let message = '';

    // First hand result
    if (!firstHand.busted) {
      if (dealerBusted || firstHand.score > dealerScore) {
        totalWinnings += firstHand.bet * 2;
        message += 'First hand wins! ';
      } else if (firstHand.score === dealerScore) {
        totalWinnings += firstHand.bet;
        message += 'First hand push. ';
      } else {
        message += 'First hand loses. ';
      }
    }

    // Second hand result
    if (!secondHand.busted) {
      if (dealerBusted || secondHand.score > dealerScore) {
        totalWinnings += secondHand.bet * 2;
        message += 'Second hand wins!';
      } else if (secondHand.score === dealerScore) {
        totalWinnings += secondHand.bet;
        message += 'Second hand push.';
      } else {
        message += 'Second hand loses.';
      }
    }

    setGameState({
      ...gameState,
      deck: currentDeck,
      dealer,
      player: {
        ...secondHand,
        chips: firstHand.chips + totalWinnings,
      },
      gameStatus: 'gameOver' as const,
      message,
      splitHand: undefined,
    });
  };

  const doubleDown = () => {
    if (!gameState.canDoubleDown) return;

    const additionalBet = gameState.currentBet;
    const player = {
      ...gameState.player,
      chips: gameState.player.chips - additionalBet,
      bet: gameState.player.bet + additionalBet,
    };

    const [card, newDeck] = dealCard(gameState.deck);
    const newHand = [...player.hand, card];
    const newScore = calculateHandValue(newHand);
    const busted = newScore > 21;

    const newGameState = {
      ...gameState,
      deck: newDeck,
      player: {
        ...player,
        hand: newHand,
        score: newScore,
        busted,
      },
      currentBet: player.bet,
      gameStatus: 'gameOver' as const,
    };

    setGameState(checkGameState(newGameState));
    if (!busted) {
      dealerPlay();
    }
  };

  const surrender = () => {
    if (!gameState.canSurrender) return;

    const refundAmount = Math.floor(gameState.player.bet / 2);
    setGameState({
      ...gameState,
      player: {
        ...gameState.player,
        chips: gameState.player.chips + refundAmount,
      },
      gameStatus: 'gameOver',
      winner: 'dealer',
      message: 'Surrendered - Half bet returned',
    });
  };

  const dealerPlay = () => {
    let currentDealerHand = [...gameState.dealer.hand];
    let currentDeck = [...gameState.deck];
    
    while (calculateHandValue(currentDealerHand) < 17) {
      const [card, newDeck] = dealCard(currentDeck);
      currentDealerHand = [...currentDealerHand, card];
      currentDeck = newDeck;
    }

    const dealerScore = calculateHandValue(currentDealerHand);
    const dealerBusted = dealerScore > 21;

    const newGameState = {
      ...gameState,
      deck: currentDeck,
      dealer: {
        ...gameState.dealer,
        hand: currentDealerHand,
        score: dealerScore,
        busted: dealerBusted,
      },
      gameStatus: 'gameOver' as const,
    };

    const finalState = checkGameState(newGameState);
    
    // Update chips based on the outcome
    if (finalState.winner === 'player') {
      const winAmount = checkForNaturalBlackjack(gameState.player.hand) 
        ? Math.floor(gameState.currentBet * 2.5)  // 3:2 payout for blackjack
        : gameState.currentBet * 2;  // Regular win
      finalState.player.chips += winAmount;
    } else if (finalState.winner === 'push') {
      finalState.player.chips += gameState.currentBet;  // Return bet
    }

    setGameState(finalState);
  };

  return (
    <div className="game-container">
      <h1>BlackJack</h1>
      
      <div className="game-table">
        <div className="table-felt" />
        
        <div className="dealer-section">
          <h2>Dealer</h2>
          <div className="cards">
            {gameState.dealer.hand.map((card, index) => (
              <div key={index} className="card">
                {gameState.gameStatus === 'gameOver' || index !== 1 ? (
                  `${card.rank}${card.suit.charAt(0).toUpperCase()}`
                ) : (
                  '🂠'
                )}
              </div>
            ))}
          </div>
          {gameState.gameStatus === 'gameOver' && (
            <div className="player-info">
              Score: {gameState.dealer.score}
            </div>
          )}
        </div>

        <div className="player-section">
          <div className="cards">
            {gameState.player.hand.map((card, index) => (
              <div key={index} className="card">
                {`${card.rank}${card.suit.charAt(0).toUpperCase()}`}
              </div>
            ))}
          </div>
        </div>

        {gameState.gameStatus !== 'betting' && placedChips.length > 0 && (
          <div className="stacked-bet">
            {placedChips.map((chip, index) => (
              <div
                key={index}
                className="placed-chip"
                style={{
                  background: 
                    chip.value === 5 ? '#e74c3c' : 
                    chip.value === 25 ? '#3498db' : 
                    chip.value === 100 ? '#2ecc71' :
                    '#f1c40f',
                }}
              >
                ${chip.value}
              </div>
            ))}
          </div>
        )}

        {gameState.gameStatus === 'betting' && (
          <div className="betting-area">
            <div className="current-bet">
              Current Bet: ${currentBetAmount}
            </div>
            <div className="placed-chips">
              {placedChips.map((chip, index) => (
                <div
                  key={index}
                  className="placed-chip"
                  style={{
                    left: `${chip.x}px`,
                    top: `${chip.y}px`,
                    background: 
                      chip.value === 5 ? '#e74c3c' : 
                      chip.value === 25 ? '#3498db' : 
                      chip.value === 100 ? '#2ecc71' :
                      '#f1c40f',
                    '--rotation': `${chip.rotation}deg`,
                  } as React.CSSProperties}
                >
                  ${chip.value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="player-info">
        Player - Score: {gameState.player.score} | Chips: ${gameState.player.chips}
      </div>

      <div className="message">{gameState.message}</div>

      <div className="controls-container">
        {gameState.gameStatus === 'betting' && (
          <>
            <div className="chip-stack">
              {CHIP_VALUES.map(value => (
                <button
                  key={value}
                  onClick={() => addToBet(value)}
                  disabled={gameState.player.chips < value}
                  className="chip-button"
                >
                  ${value}
                </button>
              ))}
            </div>
            <div className="controls">
              <div className="bet-actions">
                <button onClick={clearBet}>Clear</button>
                <button 
                  onClick={placeBet}
                  disabled={currentBetAmount < MINIMUM_BET}
                >
                  Place Bet
                </button>
              </div>
            </div>
          </>
        )}
        
        {gameState.gameStatus === 'playerTurn' && (
          <div className="controls">
            <div className="action-controls">
              <button onClick={hit}>Hit</button>
              <button onClick={stand}>Stand</button>
              {gameState.canDoubleDown && (
                <button onClick={doubleDown}>Double Down</button>
              )}
              {gameState.canSurrender && (
                <button onClick={surrender}>Surrender</button>
              )}
              {gameState.player.canSplit && (
                <button onClick={split}>Split</button>
              )}
            </div>
          </div>
        )}
        
        {gameState.gameStatus === 'gameOver' && (
          <div className="controls">
            <div className="result">
              {gameState.message}
            </div>
            <button 
              onClick={() => {
                setGameState({
                  ...gameState,
                  gameStatus: 'betting',
                  message: 'Place your bet!',
                  winner: null,
                  player: {
                    ...gameState.player,
                    hand: [],
                    score: 0,
                    busted: false,
                    bet: 0,
                  },
                  dealer: createPlayer(true),
                  currentBet: 0,
                });
                setPlacedChips([]);
              }}
              disabled={gameState.player.chips < MINIMUM_BET}
            >
              {gameState.player.chips < MINIMUM_BET ? 'Game Over - No Chips Left!' : 'Play Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 