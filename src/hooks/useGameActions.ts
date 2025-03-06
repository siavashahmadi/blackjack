import { useGameContext } from '../context/GameContext';

export function useGameActions() {
  const { dispatch } = useGameContext();
  
  const addMoney = () => {
    dispatch({ type: 'ADD_MONEY', amount: 1000000 });
  };
  
  const resetBalance = () => {
    dispatch({ type: 'RESET_BALANCE', amount: 1000 });
  };
  
  return {
    addMoney,
    resetBalance
  };
}
