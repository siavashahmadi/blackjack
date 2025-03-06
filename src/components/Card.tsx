import { Card as CardType } from '../types/game';
import styles from '../styles/Card.module.css';

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

export default function Card({ card, hidden = false, revealed = false }: CardProps) {
  const suitSymbol = getSuitSymbol(card.suit);
  const suitClass = styles[card.suit] || '';
  
  const cardClasses = [
    styles.card,
    hidden ? styles.hidden : '',
    revealed ? styles.reveal : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} data-value={card.rank} data-suit={card.suit}>
      <div className={styles.cardFront}>
        <div className={`${styles.cardCorner} ${styles.topLeft}`}>
          <div className={`${styles.cardRank} ${suitClass}`}>{card.rank}</div>
          <div className={`${styles.cardSuit} ${suitClass}`}>{suitSymbol}</div>
        </div>
        
        <div className={`${styles.cardCenter} ${suitClass}`}>
          {card.rank === '10' || ['J', 'Q', 'K', 'A'].includes(card.rank) ? (
            <div className={styles.cardFace}>
              {card.rank === 'A' && <div className={styles.bigSuit}>{suitSymbol}</div>}
              {card.rank === 'K' && <div className={styles.faceIcon}>♚</div>}
              {card.rank === 'Q' && <div className={styles.faceIcon}>♛</div>}
              {card.rank === 'J' && <div className={styles.faceIcon}>♞</div>}
              {card.rank === '10' && (
                <div className={styles.compactPips}>
                  {[...Array(10)].map((_, i) => (
                    <span key={i} className={styles.smallSuit}>{suitSymbol}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.cardPips}>
              {Array(parseInt(card.rank as string) || 0).fill(null).map((_, i) => (
                <div key={i} className={styles.pip}>{suitSymbol}</div>
              ))}
            </div>
          )}
        </div>
        
        <div className={`${styles.cardCorner} ${styles.bottomRight}`}>
          <div className={`${styles.cardRank} ${suitClass}`}>{card.rank}</div>
          <div className={`${styles.cardSuit} ${suitClass}`}>{suitSymbol}</div>
        </div>
      </div>
      
      <div className={styles.cardBack}></div>
    </div>
  );
}