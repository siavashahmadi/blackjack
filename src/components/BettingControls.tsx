import BettingSlider from './BettingSlider';
import './Game.css';

interface BettingControlsProps {
  chipValues: number[];
  playerChips: number;
  currentBetAmount: number;
  addToBet: (value: number) => void;
  clearBet: () => void;
  placeBet: () => void;
  handleSliderBetChange: (amount: number) => void;
  minimumBet: number;
}

export default function BettingControls({
  chipValues,
  playerChips,
  currentBetAmount,
  addToBet,
  clearBet,
  placeBet,
  handleSliderBetChange,
  minimumBet
}: BettingControlsProps) {
  return (
    <div className="betting-controls-container">
      <div className="chip-stack">
        {chipValues.map((value) => (
          <button
            key={value}
            className="chip-button"
            onClick={() => addToBet(value)}
            disabled={playerChips < value || currentBetAmount + value > playerChips}
          >
            ${value}
          </button>
        ))}
      </div>
      
      <BettingSlider
        minBet={0}
        maxBet={playerChips}
        currentBet={currentBetAmount}
        onBetChange={handleSliderBetChange}
      />
      
      <div className="bet-actions">
        <button 
          onClick={clearBet} 
          disabled={currentBetAmount === 0}
        >
          Clear Bet
        </button>
        <button 
          onClick={placeBet} 
          disabled={currentBetAmount < minimumBet}
        >
          Place Bet
        </button>
      </div>
      
      <div className="player-chips-display">
        Chips: ${playerChips}
      </div>
    </div>
  );
} 