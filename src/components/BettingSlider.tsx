import { useState, useEffect } from 'react';
import './BettingSlider.css';

interface BettingSliderProps {
  minBet: number;
  maxBet: number;
  currentBet: number;
  onBetChange: (amount: number) => void;
}

export default function BettingSlider({ 
  minBet = 0, 
  maxBet, 
  currentBet, 
  onBetChange 
}: BettingSliderProps) {
  const [localValue, setLocalValue] = useState(currentBet);

  // Update local value when currentBet changes from outside
  useEffect(() => {
    setLocalValue(currentBet);
  }, [currentBet]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    setLocalValue(newValue);
    onBetChange(newValue);
  };
  
  // Handle quick shortcuts - 25%, 50%, 75%, MAX
  const handleQuickBet = (percentage: number) => {
    const amount = percentage < 100 
      ? Math.floor(maxBet * (percentage / 100)) 
      : maxBet;
    
    setLocalValue(amount);
    onBetChange(amount);
  };

  return (
    <div className="betting-slider-container">
      <div className="slider-wrapper">
        <input
          type="range"
          min={minBet}
          max={maxBet}
          value={localValue}
          onChange={handleSliderChange}
          className="bet-slider"
        />
      </div>
      
      <div className="slider-controls">
        <div className="slider-labels">
          <span>${minBet}</span>
          <span>${maxBet}</span>
        </div>
        
        <div className="quick-bet-buttons">
          <button onClick={() => handleQuickBet(25)}>25%</button>
          <button onClick={() => handleQuickBet(50)}>50%</button>
          <button onClick={() => handleQuickBet(75)}>75%</button>
          <button onClick={() => handleQuickBet(100)}>MAX</button>
        </div>
      </div>
    </div>
  );
}
