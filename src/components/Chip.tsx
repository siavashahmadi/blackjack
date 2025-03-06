import './Chip.css';
import { formatCompact } from '../utils/formatters';

interface ChipProps {
  value: number;
  onClick?: () => void;
  disabled?: boolean;
  stacked?: boolean;
  x?: number;
  y?: number;
  rotation?: number;
}

// Array of available chip colors
const CHIP_COLORS = ['red', 'blue', 'green', 'gold', 'purple'];

const getChipColor = (value: number): string => {
  // Assign specific colors based on chip value
  switch (value) {
    case 100:
      return 'red';
    case 500:
      return 'green';
    case 1000:
      return 'gold';
    case 5000:
      return 'blue';
    default:
      // For other values, use a consistent color based on the value
      if (value > 0) {
        const index = Math.abs(value) % CHIP_COLORS.length;
        return CHIP_COLORS[index];
      }
      // Fallback to red
      return 'red';
  }
};

export default function Chip({ 
  value, 
  onClick, 
  disabled = false, 
  stacked = false,
  x, 
  y, 
  rotation 
}: ChipProps) {
  const chipColor = getChipColor(value);
  
  const chipClasses = [
    'chip',
    chipColor,
    stacked ? 'stacked' : '',
    disabled ? 'disabled' : '',
    onClick ? 'clickable' : ''
  ].filter(Boolean).join(' ');
  
  const style: React.CSSProperties = {};
  
  if (x !== undefined && y !== undefined) {
    style.position = 'absolute';
    style.left = `${x}px`;
    style.top = `${y}px`;
  }
  
  if (rotation !== undefined) {
    style.transform = `rotate(${rotation}deg)`;
  }
  
  return (
    <div 
      className={chipClasses} 
      onClick={disabled ? undefined : onClick} 
      style={style}
      data-value={value}
    >
      <div className="chip-inner">
        <div className="chip-center">{formatCompact(value)}</div>
        <div className="chip-border"></div>
        <div className="chip-highlight"></div>
      </div>
    </div>
  );
}