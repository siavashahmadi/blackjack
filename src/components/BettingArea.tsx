import BettingControls from './BettingControls';
import './Game.css';
import { formatWithCommas } from '../utils/formatters';

interface PlacedChip {
  value: number;
  x: number;
  y: number;
  rotation: number;
}

interface BettingAreaProps {
  placedChips: PlacedChip[];
  currentBetAmount: number;
  chipValues: number[];
  playerChips: number;
  addToBet: (value: number) => void;
  clearBet: () => void;
  placeBet: () => void;
  handleSliderBetChange: (amount: number) => void;
  minimumBet: number;
}

export default function BettingArea({
  placedChips,
  currentBetAmount,
  chipValues,
  playerChips,
  addToBet,
  clearBet,
  placeBet,
  handleSliderBetChange,
  minimumBet
}: BettingAreaProps) {
  return (
    <div className="betting-section">
      <div className="betting-area">
        {/* Remove ChipDisplay from here since it's now in GameTable */}
        
        {currentBetAmount > 0 && (
          <div className="current-bet">
            Current Bet: ${formatWithCommas(currentBetAmount)}
          </div>
        )}
      </div>
      
      <BettingControls
        chipValues={chipValues}
        playerChips={playerChips}
        currentBetAmount={currentBetAmount}
        addToBet={addToBet}
        clearBet={clearBet}
        placeBet={placeBet}
        handleSliderBetChange={handleSliderBetChange}
        minimumBet={minimumBet}
      />
    </div>
  );
} 