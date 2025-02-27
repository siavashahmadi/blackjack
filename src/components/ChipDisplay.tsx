import Chip from './Chip';
import './Game.css';

interface PlacedChip {
  value: number;
  x: number;
  y: number;
  rotation: number;
}

interface ChipDisplayProps {
  placedChips: PlacedChip[];
  stacked?: boolean;
}

export default function ChipDisplay({ placedChips, stacked = false }: ChipDisplayProps) {
  if (stacked) {
    return (
      <div className="stacked-bet">
        {placedChips.map((chip, index) => (
          <Chip
            key={index}
            value={chip.value}
            stacked={true}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className="placed-chips">
      {placedChips.map((chip, index) => (
        <Chip
          key={index}
          value={chip.value}
          x={chip.x}
          y={chip.y}
          rotation={chip.rotation}
        />
      ))}
    </div>
  );
} 