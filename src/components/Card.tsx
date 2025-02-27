import { Card as CardType } from '../types/game';
import './Card.css';

interface CardProps {
  card: CardType;
  hidden?: boolean;
  revealed?: boolean;
}

const getSuitSymbol = (suit: string): string => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
    default: return '';
  }
};

const getSuitColor = (suit: string): string => {
  return ['hearts', 'diamonds'].includes(suit) ? 'red' : 'black';
};

export default function Card({ card, hidden = false, revealed = false }: CardProps) {
  const suitSymbol = getSuitSymbol(card.suit);
  const color = getSuitColor(card.suit);
  
  const cardClasses = [
    'playing-card',
    hidden ? 'hidden' : '',
    revealed ? 'reveal' : '',
    `suit-${card.suit}`
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} data-value={card.rank} data-suit={card.suit}>
      {!hidden && (
        <>
          <div className="card-corner top-left">
            <div className="card-rank">{card.rank}</div>
            <div className="card-suit" style={{ color }}>{suitSymbol}</div>
          </div>
          
          <div className="card-center" style={{ color }}>
            {card.rank === '10' || ['J', 'Q', 'K', 'A'].includes(card.rank) ? (
              <div className="card-face">
                {card.rank === 'A' && <div className="big-suit">{suitSymbol}</div>}
                {card.rank === 'K' && <div className="face-icon">♚</div>}
                {card.rank === 'Q' && <div className="face-icon">♛</div>}
                {card.rank === 'J' && <div className="face-icon">♞</div>}
                {card.rank === '10' && Array(10).fill(null).map((_, i) => (
                  <div key={i} className="small-suit">{suitSymbol}</div>
                ))}
              </div>
            ) : (
              <div className="card-pips">
                {Array(parseInt(card.rank as string) || 0).fill(null).map((_, i) => (
                  <div key={i} className="pip">{suitSymbol}</div>
                ))}
              </div>
            )}
          </div>
          
          <div className="card-corner bottom-right">
            <div className="card-rank">{card.rank}</div>
            <div className="card-suit" style={{ color }}>{suitSymbol}</div>
          </div>
        </>
      )}
    </div>
  );
}