import { Player } from '../types/game';
import Card from './Card';
import './Game.css';

interface PlayerSectionProps {
  player: Player;
  gameStatus: string;
  isActive: boolean;
}

export default function PlayerSection({ player, gameStatus, isActive }: PlayerSectionProps) {
  const playerSectionClass = `player-section${isActive ? ' active' : ''}`;

  return (
    <div className={playerSectionClass}>
      <div className="cards">
        {player.hand.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
      {gameStatus !== 'betting' && (
        <div className="player-info">
          Score: {player.score}
        </div>
      )}
    </div>
  );
} 