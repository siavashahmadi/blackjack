import { useEffect, useState } from 'react';
import './GameAnimation.css';

type AnimationType = 'win' | 'lose' | 'push' | 'blackjack' | 'bust';

interface GameAnimationProps {
  type: AnimationType;
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

export default function GameAnimation({ type, isVisible, onAnimationComplete }: GameAnimationProps) {
  const [animationClass, setAnimationClass] = useState('');
  
  useEffect(() => {
    if (isVisible) {
      setAnimationClass('visible');
      
      // Set timeout to handle animation completion
      const timer = setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 2000); // Match this to animation duration
      
      return () => clearTimeout(timer);
    } else {
      setAnimationClass('');
    }
  }, [isVisible, onAnimationComplete]);
  
  const renderAnimationContent = () => {
    switch (type) {
      case 'win':
        return (
          <div className="win-animation">
            <div className="win-text">You Win!</div>
            <div className="confetti-container">
              {Array.from({ length: 50 }).map((_, i) => (
                <div 
                  key={i} 
                  className="confetti" 
                  style={{ 
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`
                  }}
                />
              ))}
            </div>
          </div>
        );
        
      case 'lose':
        return (
          <div className="lose-animation">
            <div className="lose-text">Dealer Wins</div>
            <div className="card-scatter">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className="scatter-card" 
                  style={{ 
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>
        );
        
      case 'blackjack':
        return (
          <div className="blackjack-animation">
            <div className="blackjack-text">Blackjack!</div>
            <div className="chips-rain">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className="chip-rain" 
                  style={{ 
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${0.5 + Math.random() * 1.5}s`,
                    backgroundColor: ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f'][Math.floor(Math.random() * 4)]
                  }}
                />
              ))}
            </div>
          </div>
        );
        
      case 'bust':
        return (
          <div className="bust-animation">
            <div className="bust-text">Bust!</div>
            <div className="explosion">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className="explosion-particle" 
                  style={{ 
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>
        );
        
      case 'push':
        return (
          <div className="push-animation">
            <div className="push-text">Push!</div>
            <div className="wave-effect">
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i} 
                  className="wave" 
                  style={{ 
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <div className={`game-animation ${type}-animation ${animationClass}`}>
      {renderAnimationContent()}
    </div>
  );
}