import './Game.css';
import { formatWithCommas } from '../utils/formatters';

interface ResultsScreenProps {
  message: string;
  playAgain: () => void;
  playerChips: number;
}

export default function ResultsScreen({ message, playAgain, playerChips }: ResultsScreenProps) {
  return (
    <div className="controls-container">
      <div className="result">
        {message}
      </div>
      <button onClick={playAgain}>Play Again</button>
      <div className="player-info">
        Chips: ${formatWithCommas(playerChips)}
      </div>
    </div>
  );
} 