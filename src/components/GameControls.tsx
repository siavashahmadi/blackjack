import './Game.css';
import { formatWithCommas } from '../utils/formatters';

interface GameControlsProps {
  hit: () => void;
  stand: () => void;
  doubleDown: () => void;
  surrender: () => void;
  split: () => void;
  canDoubleDown: boolean;
  canSurrender: boolean;
  canSplit: boolean;
  playerChips: number;
}

export default function GameControls({
  hit,
  stand,
  doubleDown,
  surrender,
  split,
  canDoubleDown,
  canSurrender,
  canSplit,
  playerChips
}: GameControlsProps) {
  return (
    <div className="controls-container">
      <div className="action-controls">
        <div className="primary-controls">
          <button onClick={hit}>Hit</button>
          <button onClick={stand}>Stand</button>
        </div>
        <div className="secondary-controls">
          {canDoubleDown && (
            <button onClick={doubleDown}>Double Down</button>
          )}
          {canSurrender && (
            <button onClick={surrender}>Surrender</button>
          )}
          {canSplit && (
            <button onClick={split}>Split</button>
          )}
        </div>
      </div>
      <div className="player-info">
        Balance: ${formatWithCommas(playerChips)}
      </div>
    </div>
  );
} 