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
        <div className="slider-controls">
        </div>
      </div>
    </div>
  );
}
