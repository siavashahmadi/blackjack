import './Chip.css';

interface ChipProps {
  value: number;
  onClick?: () => void;
  disabled?: boolean;
  stacked?: boolean;
  x?: number;
  y?: number;
  rotation?: number;
}

const getChipColor = (value: number): string => {
  switch (value) {
    case 5: return 'red';
    case 25: return 'blue';
    case 100: return 'green';
    case 500: return 'gold';
    default: return 'red';
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
    style.left = `${x}px`;
    style.top = `${y}px`;
  }
  
  if (rotation !== undefined) {
    style.transform = `rotate(${rotation}deg)`;
    style.transform = `rotate(${rotation}deg)`;  }
  
  return (
    <div 
      className={chipClasses} 
      onClick={disabled ? undefined : onClick} 
      style={style}
      data-value={value}
    >
      <div className="chip-inner">
        <div className="chip-center">${value}</div>
        <div className="chip-border"></div>
        <div className="chip-highlight"></div>
      </div>
    </div>
  );
}