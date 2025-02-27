import './Game.css';

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
        <button onClick={hit}>Hit</button>
        <button onClick={stand}>Stand</button>
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
      <div className="player-info">
        Chips: ${playerChips}
      </div>
    </div>
  );
} 