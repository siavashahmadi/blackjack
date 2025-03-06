import { useState, useCallback, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { dealCard } from '../utils/gameUtils';
import { PlacedChip } from '../components/PlacedChip';

export function useBlackjackGame() {
  const { gameState, dispatch } = useGameContext();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDealerCard, setShowDealerCard] = useState(false);
  const [currentBetAmount, setCurrentBetAmount] = useState(0);
  const [placedChips, setPlacedChips] = useState<PlacedChip[]>([]);
  
  // Animation states
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<'win' | 'lose' | 'push' | 'blackjack' | 'bust'>('win');
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState<'info' | 'success' | 'warning' | 'error'>('info');

  // Show dealer card when game is over
  useEffect(() => {
    if (gameState.gameStatus === 'gameOver') {
      const dealerCardTimer = setTimeout(() => {
        setShowDealerCard(true);
      }, 300);
      
      // Show appropriate game animation based on winner
      const animationTimer = setTimeout(() => {
        if (gameState.winner) {
          if (gameState.winner === 'player') {
            if (gameState.player.hand.length === 2 && gameState.player.score === 21) {
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
        }
      }, 800);
      
      return () => {
        clearTimeout(dealerCardTimer);
        clearTimeout(animationTimer);
      };
    } else {
      setShowDealerCard(false);
    }
  }, [gameState.gameStatus, gameState.winner, gameState.player.hand, gameState.player.busted, gameState.player.score]);

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

  // Betting functions
  const addToBet = useCallback((amount: number) => {
    if (gameState.player.chips < amount || currentBetAmount + amount > gameState.player.chips) return;
    
    setCurrentBetAmount(prev => prev + amount);
    
    // Add a custom CSS variable for rotation to be used in animations
    const rotation = Math.random() * 360;
    
    // Add new chip to the placed chips
    // We'll use percentage-based positioning instead of fixed pixels
    const newChip: PlacedChip = {
      value: amount,
      x: Math.random() * 70 + 15, // 15% to 85% of table width
      y: Math.random() * 70 + 15, // 15% to 85% of table height
      rotation: rotation,
    };
    
    setPlacedChips(prev => {
      // Limit the maximum number of visual chips to 30
      const MAX_VISUAL_CHIPS = 30;
      
      if (prev.length >= MAX_VISUAL_CHIPS) {
        // If we already have the maximum number of chips, replace a random one
        const updatedChips = [...prev];
        const randomIndex = Math.floor(Math.random() * updatedChips.length);
        updatedChips[randomIndex] = newChip;
        return updatedChips;
      }
      
      return [...prev, newChip];
    });
  }, [gameState.player.chips, currentBetAmount]);

  const clearBet = useCallback(() => {
    setCurrentBetAmount(0);
    setPlacedChips([]);
  }, []);

  const placeBet = useCallback(() => {
    if (currentBetAmount < 5) return; // Minimum bet
    
    setIsAnimating(true);
    
    dispatch({ type: 'PLACE_BET', amount: currentBetAmount });
    
    // Start dealing animation
    setTimeout(() => {
      dispatch({ type: 'DEAL_CARDS' });
      setIsAnimating(false);
    }, 500);
  }, [currentBetAmount, dispatch]);

  const handleSliderBetChange = useCallback((amount: number) => {
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
  }, [currentBetAmount, clearBet]);

  const addCustomBet = useCallback((amount: number) => {
    if (gameState.player.chips < amount || amount <= 0) return;
    
    setCurrentBetAmount(prev => prev + amount);
    
    // Add a custom CSS variable for rotation to be used in animations
    const rotation = Math.random() * 360;
    
    // Make chips spread widely across the entire table area
    const newChip: PlacedChip = {
      value: amount,
      x: Math.random() * 800 + 50,
      y: Math.random() * 500 + 50,
      rotation: rotation,
    };
    
    setPlacedChips(prev => [...prev, newChip]);
  }, [gameState.player.chips]);

  // Game action functions
  const hit = useCallback(() => {
    if (gameState.gameStatus !== 'playerTurn' || isAnimating) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      dispatch({ type: 'HIT' });
      setIsAnimating(false);
    }, 500);
  }, [gameState.gameStatus, dispatch, isAnimating]);

  const stand = useCallback(() => {
    if (gameState.gameStatus !== 'playerTurn' || isAnimating) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      dispatch({ type: 'STAND' });
      dealerPlay();
    }, 500);
  }, [gameState.gameStatus, dispatch, isAnimating]);

  const doubleDown = useCallback(() => {
    if (!gameState.canDoubleDown || isAnimating) return;
    
    setIsAnimating(true);

    setTimeout(() => {
      dispatch({ type: 'DOUBLE_DOWN' });
      
      // If player didn't bust, dealer plays
      if (gameState.player.score <= 21) {
        setTimeout(() => {
          dealerPlay();
        }, 700);
      } else {
        setIsAnimating(false);
      }
    }, 500);
  }, [gameState.canDoubleDown, gameState.player.score, dispatch, isAnimating]);

  const surrender = useCallback(() => {
    if (!gameState.canSurrender || isAnimating) return;
    
    setIsAnimating(true);

    setTimeout(() => {
      dispatch({ type: 'SURRENDER' });
      setIsAnimating(false);
    }, 500);
  }, [gameState.canSurrender, dispatch, isAnimating]);

  const split = useCallback(() => {
    // Implementation of split would go here
    console.log("Split feature not implemented yet");
  }, []);

  const dealerPlay = useCallback(() => {
    let currentDealerHand = [...gameState.dealer.hand];
    let currentDeck = [...gameState.deck];
    
    // Simulate dealer drawing cards with animation
    const drawDealerCards = () => {
      setTimeout(() => {
        if (calculateHandValue(currentDealerHand) < 17) {
          const [card, newDeck] = dealCard(currentDeck);
          currentDealerHand = [...currentDealerHand, card];
          currentDeck = newDeck;
          
          dispatch({ type: 'DEALER_DRAW_CARD', card });
          
          drawDealerCards();
        } else {
          // End game when dealer is done drawing
          dispatch({ type: 'END_GAME', winner: null });
          setIsAnimating(false);
        }
      }, 700);
    };
    
    drawDealerCards();
  }, [gameState.dealer.hand, gameState.deck, dispatch]);

  const playAgain = useCallback(() => {
    dispatch({ type: 'PLAY_AGAIN' });
    setPlacedChips([]);
    setShowDealerCard(false);
    setShowAnimation(false);
    setCurrentBetAmount(0);
  }, [dispatch]);

  const addMoney = useCallback(() => {
    dispatch({ type: 'ADD_MONEY', amount: 1000000 });
  }, [dispatch]);

  const resetBalance = useCallback(() => {
    dispatch({ type: 'RESET_BALANCE', amount: 1000 });
  }, [dispatch]);

  const onAnimationComplete = useCallback(() => {
    setShowAnimation(false);
  }, []);

  // Helper function for dealer play
  const calculateHandValue = (hand: any[]) => {
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

  return {
    gameState,
    isAnimating,
    showDealerCard,
    currentBetAmount,
    placedChips,
    showAnimation,
    animationType,
    showMessage,
    messageType,
    actions: {
      hit,
      stand,
      doubleDown,
      surrender,
      split,
      playAgain,
      addMoney,
      resetBalance
    },
    betting: {
      addToBet,
      clearBet,
      placeBet,
      handleSliderBetChange
    },
    animation: {
      onAnimationComplete
    }
  };
}
