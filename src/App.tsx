import Game from './components/Game'
import { GameProvider } from './context/GameContext'
import { useGameActions } from './hooks/useGameActions'
import './App.css'

function AppContent() {
  const { addMoney, resetBalance } = useGameActions();
  
  return (
    <>
      <h1 className="game-title">BlackJack</h1>
      <button onClick={addMoney} className="add-money-button">+ $1m</button>
      <button onClick={resetBalance} className="reset-balance-button">Reset</button>
      <Game />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <GameProvider>
        <AppContent />
      </GameProvider>
    </div>
  )
}

export default App
