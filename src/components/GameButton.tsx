import './GameButton.css';

interface GameButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export default function GameButton({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'primary',
  size = 'medium',
  fullWidth = false
}: GameButtonProps) {
  const buttonClass = [
    'game-button',
    `button-${type}`,
    `button-${size}`,
    fullWidth ? 'full-width' : '',
    disabled ? 'disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="button-content">{children}</span>
      <span className="button-glow"></span>
    </button>
  );
}