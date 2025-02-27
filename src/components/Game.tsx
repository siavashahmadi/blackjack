import { useState, useEffect } from 'react';
import { GameState, Player } from '../types/game';
import {
  createDeck,
  createPlayer,
  dealCard,
  calculateHandValue,
  checkGameState,
  canSplitHand,
  checkForNaturalBlackjack
} from '../utils/gameUtils';
import GameMessage from './GameMessage';
import GameAnimation from './GameAnimation';
import GameTable from './GameTable';
import { PlacedChip } from './PlacedChip';
import './Game.css';

const MINIMUM_BET = 5;
const INITIAL_CHIPS = 500;
const CHIP_VALUES = [5, 25, 100, 500];

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
  const [showDealerCard, setShowDealerCard] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // State for animation and message components
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<'win' | 'lose' | 'push' | 'blackjack' | 'bust'>('win');
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState<'info' | 'success' | 'warning' | 'error'>('info');

  // Show dealer card when game is over
  useEffect(() => {
    if (gameState.gameStatus === 'gameOver') {
      setTimeout(() => {
        setShowDealerCard(true);
      }, 300);
      
      // Show appropriate game animation based on winner
      if (gameState.winner) {
        setTimeout(() => {
          if (gameState.winner === 'player') {
            if (checkForNaturalBlackjack(gameState.player.hand)) {
              setAnimationType('blackjack');
            } else {
              setAnimationType('win');
            }
          } else if (gameState.winner === 'dealer') {
            if (gameState.player.busted) {
              setAnimationType('bust');
            } else {
              setAnimationType('lose');
            }
          } else if (gameState.winner === 'push') {
            setAnimationType('push');
          }
          setShowAnimation(true);
        }, 800);
      }
    } else {
      setShowDealerCard(false);
    }
  }, [gameState.gameStatus, gameState.winner, gameState.player.hand, gameState.player.busted]);

  // Display game messages when status changes
  useEffect(() => {
    if (gameState.message) {
      // Determine message type based on game state
      let type: 'info' | 'success' | 'warning' | 'error' = 'info';
      
      if (gameState.winner === 'player') {
        type = 'success';
      } else if (gameState.winner === 'dealer') {
        type = 'error';
      } else if (gameState.winner === 'push') {
        type = 'warning';
      }
      
      setMessageType(type);
      setShowMessage(true);
      
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.message, gameState.winner]);

  const addToBet = (amount: number) => {
    if (gameState.player.chips < amount || currentBetAmount + amount > gameState.player.chips) return;
    setCurrentBetAmount(prev => prev + amount);
    
    // Add a custom CSS variable for rotation to be used in animations
    const rotation = Math.random() * 360;
    
    // Make chips spread widely across the entire table area, including behind controls
    const newChip: PlacedChip = {
      value: amount,
      x: Math.random() * 800 + 50, // Wider spread across table width (50-850px)
      y: Math.random() * 500 + 50, // Deeper spread across table height (50-550px)
      rotation: rotation,
    };
    setPlacedChips(prev => [...prev, newChip]);
  };

  const clearBet = () => {
    setCurrentBetAmount(0);
    setPlacedChips([]);
  };

  const placeBet = () => {
    if (currentBetAmount < MINIMUM_BET) return;
    
    const player = {
      ...gameState.player,
      chips: gameState.player.chips - currentBetAmount,
      bet: currentBetAmount,
    };
    
    setIsAnimating(true);
    
    // Start dealing animation
    setTimeout(() => {
      startNewGame(player);
      setIsAnimating(false);
    }, 500);
  };

  const addMoney = () => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        chips: prev.player.chips + 100000
      },
      message: '$100,000 added to your balance!'
    }));
  };

  const resetBalance = () => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        chips: 1000
      },
      message: 'Balance reset to $1000!'
    }));
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

    // Check for player blackjack or ability to split
    player.canSplit = canSplitHand(player.hand);

    const naturalBlackjack = checkForNaturalBlackjack(player.hand);
    
    const newGameState = {
      deck: newDeck4,
      player: player,
      dealer: dealer,
      gameStatus: naturalBlackjack ? 'gameOver' as const : 'playerTurn' as const,
      winner: naturalBlackjack ? 'player' as const : null,
      canDoubleDown: player.chips >= player.bet,
      canSurrender: true,
      currentBet: player.bet,
      message: naturalBlackjack ? 'Blackjack! You win!' : 'Your turn',
    };
    
    // If player has blackjack, calculate winnings
    if (naturalBlackjack) {
      // Blackjack pays 3:2
      const winAmount = player.bet + Math.floor(player.bet * 1.5);
      newGameState.player.chips += winAmount;
    }
    
    setGameState(newGameState);
  };

  const hit = () => {
    if (gameState.gameStatus !== 'playerTurn' || isAnimating) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      const [card, newDeck] = dealCard(gameState.deck);
      const newHand = [...gameState.player.hand, card];
      const newScore = calculateHandValue(newHand);
      const busted = newScore > 21;
      
      const newGameState = {
        ...gameState,
        deck: newDeck,
        player: {
          ...gameState.player,
          hand: newHand,
          score: newScore,
          busted,
        },
      };
      
      const checkedState = checkGameState(newGameState);
      
      if (busted) {
        checkedState.gameStatus = 'gameOver' as const;
        checkedState.winner = 'dealer';
        checkedState.message = 'Busted! You went over 21.';
      }
      
      setGameState(checkedState);
      setIsAnimating(false);
      
      if (busted) {
        setShowDealerCard(true);
      }
    }, 500);
  };

  const stand = () => {
    if (gameState.gameStatus !== 'playerTurn' || isAnimating) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      setGameState({
        ...gameState,
        gameStatus: 'dealerTurn' as const,
      });
      
      dealerPlay();
      setIsAnimating(false);
    }, 500);
  };

  const split = () => {
    // Implementation of split would go here
    console.log("Split feature not implemented yet");
  };

  const doubleDown = () => {
    if (!gameState.canDoubleDown || isAnimating) return;
    
    setIsAnimating(true);

    const additionalBet = gameState.currentBet;
    const player = {
      ...gameState.player,
      chips: gameState.player.chips - additionalBet,
      bet: gameState.player.bet + additionalBet,
    };

    setTimeout(() => {
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
      };

      const checkedState = checkGameState(newGameState);
      
      if (busted) {
        checkedState.gameStatus = 'gameOver' as const;
        setGameState(checkedState);
        setIsAnimating(false);
      } else {
        // If not busted, dealer plays
        setTimeout(() => {
          setGameState(checkedState);
          dealerPlay();
          setIsAnimating(false);
        }, 700);
      }
    }, 500);
  };

  const surrender = () => {
    if (!gameState.canSurrender || isAnimating) return;
    
    setIsAnimating(true);

    setTimeout(() => {
      const refundAmount = Math.floor(gameState.player.bet / 2);
      setGameState({
        ...gameState,
        player: {
          ...gameState.player,
          chips: gameState.player.chips + refundAmount,
        },
        gameStatus: 'gameOver' as const,
        winner: 'dealer',
        message: 'Surrendered - Half bet returned',
      });
      setIsAnimating(false);
    }, 500);
  };

  const dealerPlay = () => {
    let currentDealerHand = [...gameState.dealer.hand];
    let currentDeck = [...gameState.deck];
    
    // Simulate dealer drawing cards with animation
    const drawDealerCards = (callback: () => void) => {
      setTimeout(() => {
        if (calculateHandValue(currentDealerHand) < 17) {
          const [card, newDeck] = dealCard(currentDeck);
          currentDealerHand = [...currentDealerHand, card];
          currentDeck = newDeck;
          
          setGameState(prev => ({
            ...prev,
            dealer: {
              ...prev.dealer,
              hand: currentDealerHand,
              score: calculateHandValue(currentDealerHand)
            },
            deck: currentDeck
          }));
          
          drawDealerCards(callback);
        } else {
          callback();
        }
      }, 700);
    };
    
    drawDealerCards(() => {
      const checkFinalGameState = () => {
        const dealerScore = calculateHandValue(currentDealerHand);
        const playerScore = gameState.player.score;
        const dealerHasBlackjack = checkForNaturalBlackjack(currentDealerHand);
        const playerHasBlackjack = checkForNaturalBlackjack(gameState.player.hand);
        
        let winner: "player" | "dealer" | "push" | null = null;
        let message = '';
        
        // First check for blackjack
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
        }
        // If no blackjack, check scores
        else if (gameState.player.busted) {
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
        
        // Calculate final state with correct winnings
        const finalState = {
          ...gameState,
          dealer: {
            ...gameState.dealer,
            hand: currentDealerHand,
            score: dealerScore,
            busted: dealerScore > 21
          },
          deck: currentDeck,
          gameStatus: 'gameOver' as const,
          winner,
          message
        };
        
        // Update chips based on the outcome with correct blackjack payout
        if (finalState.winner === 'player') {
          // Calculate the correct payout amount
          let winAmount;
          if (playerHasBlackjack) {
            // Blackjack pays 3:2, so bet + (bet * 1.5)
            winAmount = gameState.currentBet + Math.floor(gameState.currentBet * 1.5);
          } else {
            // Regular win pays 1:1, so bet + bet
            winAmount = gameState.currentBet * 2;
          }
          
          finalState.player.chips += winAmount;
          
          console.log("Player wins:", {
            bet: gameState.currentBet,
            hasBlackjack: playerHasBlackjack,
            winAmount: winAmount,
            finalChips: finalState.player.chips
          });
        } else if (finalState.winner === 'push') {
          finalState.player.chips += gameState.currentBet;  // Return bet
        }
        
        return finalState;
      };
      
      setGameState(checkFinalGameState());
    });
  };

  const playAgain = () => {
    setGameState({
      ...gameState,
      gameStatus: 'betting' as const,
      message: 'Place your bet!',
      winner: null,
      player: {
        ...gameState.player,
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
    });
    setPlacedChips([]);
    setShowDealerCard(false);
    setShowAnimation(false);
  };

  const onAnimationComplete = () => {
    setShowAnimation(false);
  };

  const handleSliderBetChange = (amount: number) => {
    // If existing bet is smaller, add the difference
    if (currentBetAmount < amount) {
      // Calculate what chip to add based on the difference
      const difference = amount - currentBetAmount;
      addCustomBet(difference);
    } 
    // If existing bet is larger, clear and set to new value
    else if (currentBetAmount > amount) {
      clearBet();
      if (amount > 0) {
        addCustomBet(amount);
      }
    }
  };

  const addCustomBet = (amount: number) => {
    if (gameState.player.chips < amount || amount <= 0) return;
    
    setCurrentBetAmount(prev => prev + amount);
    
    // Add a custom CSS variable for rotation to be used in animations
    const rotation = Math.random() * 360;
    
    // Make chips spread widely across the entire table area, including behind controls
    const newChip: PlacedChip = {
      value: amount,
      x: Math.random() * 800 + 50, // Wider spread across table width (50-850px)
      y: Math.random() * 500 + 50, // Deeper spread across table height (50-550px)
      rotation: rotation,
    };
    setPlacedChips(prev => [...prev, newChip]);
  };

  return (
    <div className="game-container">
      <button onClick={addMoney} className="add-money-button">Add $100K</button>
      <button onClick={resetBalance} className="reset-balance-button">Reset $1K</button>
      <h1>BlackJack</h1>
      
      <GameMessage
        message={gameState.message}
        type={messageType}
        isVisible={showMessage}
      />
      
      <GameAnimation
        type={animationType}
        isVisible={showAnimation}
        onAnimationComplete={onAnimationComplete}
      />

      <GameTable
        gameState={gameState}
        showDealerCard={showDealerCard}
        placedChips={placedChips}
        currentBetAmount={currentBetAmount}
        chipValues={CHIP_VALUES}
        addToBet={addToBet}
        clearBet={clearBet}
        placeBet={placeBet}
        handleSliderBetChange={handleSliderBetChange}
        hit={hit}
        stand={stand}
        doubleDown={doubleDown}
        surrender={surrender}
        split={split}
        playAgain={playAgain}
        minimumBet={MINIMUM_BET}
      />
    </div>
  );
}