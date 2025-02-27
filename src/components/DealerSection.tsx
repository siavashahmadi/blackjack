import { Player } from '../types/game';
import Card from './Card';
import './Game.css';

interface DealerSectionProps {
  dealer: Player;
  gameStatus: string;
  showDealerCard: boolean;
}

export default function DealerSection({ dealer, gameStatus, showDealerCard }: DealerSectionProps) {
  return (
    <div className="dealer-section">
      <h2>Dealer</h2>
      <div className="cards">
        {dealer.hand.map((card, index) => (
          <Card 
            key={index} 
            card={card} 
            hidden={index === 1 && !showDealerCard && gameStatus !== 'gameOver'}
            revealed={index === 1 && showDealerCard}
          />
        ))}
      </div>
      {(gameStatus === 'gameOver' || showDealerCard) && (
        <div className="player-info">
          Score: {dealer.score}
        </div>
      )}
    </div>
  );
} 