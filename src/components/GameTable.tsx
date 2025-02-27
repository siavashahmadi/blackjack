import { GameState } from '../types/game';
import DealerSection from './DealerSection';
import PlayerSection from './PlayerSection';
import BettingArea from './BettingArea';
import GameControls from './GameControls';
import ResultsScreen from './ResultsScreen';
import ChipDisplay from './ChipDisplay';
import './Game.css';

interface PlacedChip {
  value: number;
  x: number;
  y: number;
  rotation: number;
}

interface GameTableProps {
  gameState: GameState;
  showDealerCard: boolean;
  placedChips: PlacedChip[];
  currentBetAmount: number;
  chipValues: number[];
  addToBet: (value: number) => void;
  clearBet: () => void;
  placeBet: () => void;
  handleSliderBetChange: (amount: number) => void;
  hit: () => void;
  stand: () => void;
  doubleDown: () => void;
  surrender: () => void;
  split: () => void;
  playAgain: () => void;
  minimumBet: number;
}

export default function GameTable({
  gameState,
  showDealerCard,
  placedChips,
  currentBetAmount,
  chipValues,
  addToBet,
  clearBet,
  placeBet,
  handleSliderBetChange,
  hit,
  stand,
  doubleDown,
  surrender,
  split,
  playAgain,
  minimumBet
}: GameTableProps) {
  return (
    <div className="game-table">
      <div className="table-felt" />
      
      <DealerSection 
        dealer={gameState.dealer}
        gameStatus={gameState.gameStatus}
        showDealerCard={showDealerCard}
      />

      <PlayerSection 
        player={gameState.player}
        gameStatus={gameState.gameStatus}
        isActive={gameState.gameStatus === 'playerTurn'}
      />
      
      {gameState.gameStatus !== 'betting' && placedChips.length > 0 && (
        <ChipDisplay placedChips={placedChips} stacked={true} />
      )}

      {gameState.gameStatus === 'betting' && (
        <BettingArea 
          placedChips={placedChips}
          currentBetAmount={currentBetAmount}
          chipValues={chipValues}
          playerChips={gameState.player.chips}
          addToBet={addToBet}
          clearBet={clearBet}
          placeBet={placeBet}
          handleSliderBetChange={handleSliderBetChange}
          minimumBet={minimumBet}
        />
      )}

      {gameState.gameStatus === 'playerTurn' && (
        <GameControls
          hit={hit}
          stand={stand}
          doubleDown={doubleDown}
          surrender={surrender}
          split={split}
          canDoubleDown={gameState.canDoubleDown}
          canSurrender={gameState.canSurrender}
          canSplit={gameState.player.canSplit}
          playerChips={gameState.player.chips}
        />
      )}

      {gameState.gameStatus === 'gameOver' && (
        <ResultsScreen
          message={gameState.message}
          playAgain={playAgain}
          playerChips={gameState.player.chips}
        />
      )}
    </div>
  );
} 