import { useEffect, useState } from 'react';
import './GameMessage.css';

interface GameMessageProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  isVisible: boolean;
}

export default function GameMessage({ message, type = 'info', isVisible }: GameMessageProps) {
  const [animation, setAnimation] = useState('');

  useEffect(() => {
    if (isVisible) {
      setAnimation('message-enter');
    } else {
      setAnimation('message-exit');
    }
  }, [isVisible, message]);

  const getIconForType = () => {
    switch (type) {
      case 'success':
        return '🎉';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '💬';
    }
  };

  if (!message) return null;

  return (
    <div className={`game-message ${type} ${animation}`}>
      <div className="message-icon">{getIconForType()}</div>
      <div className="message-text">{message}</div>
    </div>
  );
}