import { useBlackjackGame } from '../hooks/useBlackjackGame';
import GameMessage from './GameMessage';
import GameAnimation from './GameAnimation';
import GameTable from './GameTable';
import { CHIP_VALUES, MINIMUM_BET } from '../context/GameContext';
import './Game.css';

export default function Game() {
  const {
    gameState,
    showDealerCard,
    placedChips,
    currentBetAmount,
    showAnimation,
    animationType,
    showMessage,
    messageType,
    actions,
    betting,
    animation
  } = useBlackjackGame();

  return (
    <div className="game-container">
      {/* Fixed position overlay elements */}
      <div className="game-overlays">
        <GameMessage
          message={gameState.message}
          type={messageType}
          isVisible={showMessage}
        />
        
        <GameAnimation
          type={animationType}
          isVisible={showAnimation}
          onAnimationComplete={animation.onAnimationComplete}
        />
      </div>

      {/* Main game content */}
      <div className="game-content">
        <GameTable
          gameState={gameState}
          showDealerCard={showDealerCard}
          placedChips={placedChips}
          currentBetAmount={currentBetAmount}
          chipValues={CHIP_VALUES}
          addToBet={betting.addToBet}
          clearBet={betting.clearBet}
          placeBet={betting.placeBet}
          handleSliderBetChange={betting.handleSliderBetChange}
          hit={actions.hit}
          stand={actions.stand}
          doubleDown={actions.doubleDown}
          surrender={actions.surrender}
          split={actions.split}
          playAgain={actions.playAgain}
          minimumBet={MINIMUM_BET}
        />
      </div>
    </div>
  );
}
