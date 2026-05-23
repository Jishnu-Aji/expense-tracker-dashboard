import { useContext } from 'react';
import { BudgetContext } from '../context/BudgetContext';

/**
 * Custom hook to consume the BudgetContext safely.
 * @returns {Object} The budget context value containing global state and actions.
 */
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
