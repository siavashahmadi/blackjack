import { useState, useCallback, useEffect } from 'react';

type AnimationType = 'win' | 'lose' | 'push' | 'blackjack' | 'bust';
type MessageType = 'info' | 'success' | 'warning' | 'error';

interface AnimationState {
  showAnimation: boolean;
  animationType: AnimationType;
  showMessage: boolean;
  messageType: MessageType;
}

export function useGameAnimation(message: string, winner: 'player' | 'dealer' | 'push' | null, playerBusted: boolean, isBlackjack: boolean) {
  const [animationState, setAnimationState] = useState<AnimationState>({
    showAnimation: false,
    animationType: 'win',
    showMessage: false,
    messageType: 'info'
  });

  // Update animation state based on game state
  useEffect(() => {
    if (message) {
      // Determine message type based on game state
      let messageType: MessageType = 'info';
      
      if (winner === 'player') {
        messageType = 'success';
      } else if (winner === 'dealer') {
        messageType = 'error';
      } else if (winner === 'push') {
        messageType = 'warning';
      }
      
      setAnimationState(prev => ({
        ...prev,
        messageType,
        showMessage: true
      }));
      
      const timer = setTimeout(() => {
        setAnimationState(prev => ({
          ...prev,
          showMessage: false
        }));
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message, winner]);

  // Show appropriate game animation based on winner
  useEffect(() => {
    if (winner) {
      const timer = setTimeout(() => {
        let animationType: AnimationType = 'win';
        
        if (winner === 'player') {
          animationType = isBlackjack ? 'blackjack' : 'win';
        } else if (winner === 'dealer') {
          animationType = playerBusted ? 'bust' : 'lose';
        } else if (winner === 'push') {
          animationType = 'push';
        }
        
        setAnimationState(prev => ({
          ...prev,
          animationType,
          showAnimation: true
        }));
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [winner, isBlackjack, playerBusted]);

  const hideAnimation = useCallback(() => {
    setAnimationState(prev => ({
      ...prev,
      showAnimation: false
    }));
  }, []);

  return {
    ...animationState,
    hideAnimation
  };
}
