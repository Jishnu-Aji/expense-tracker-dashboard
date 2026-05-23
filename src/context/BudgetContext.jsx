import React, { createContext, useState, useEffect } from 'react';

export const BudgetContext = createContext();

const DEFAULT_TRANSACTIONS = [
  { id: '1', title: 'Monthly Salary', amount: 85000, type: 'income', category: 'Salary', date: '2026-05-01' },
  { id: '2', title: 'Grocery Shopping', amount: 4500, type: 'expense', category: 'Food', date: '2026-05-12' },
  { id: '3', title: 'Electric Bill', amount: 3200, type: 'expense', category: 'Bills', date: '2026-05-15' },
  { id: '4', title: 'Movie Night', amount: 1200, type: 'expense', category: 'Entertainment', date: '2026-05-18' },
  { id: '5', title: 'Uber Ride', amount: 850, type: 'expense', category: 'Travel', date: '2026-05-20' },
  { id: '6', title: 'Freelance Design', amount: 15000, type: 'income', category: 'Others', date: '2026-05-22' },
];

export const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Salary',
  'Others'
];

export const BudgetProvider = ({ children }) => {
  // Load initial data from localStorage
  const [transactions, setTransactions] = useState(() => {
    const localData = localStorage.getItem('budget_tracker_transactions');
    return localData ? JSON.parse(localData) : DEFAULT_TRANSACTIONS;
  });

  const [budgetGoal, setBudgetGoal] = useState(() => {
    const localGoal = localStorage.getItem('budget_tracker_goal');
    return localGoal ? parseFloat(localGoal) : 30000;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const localTheme = localStorage.getItem('budget_tracker_theme');
    if (localTheme) {
      return localTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    type: 'All',
    sortBy: 'date', // 'date' or 'amount'
    sortOrder: 'desc', // 'asc' or 'desc'
  });

  // State to hold the transaction currently being edited
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Sync transactions to localStorage
  useEffect(() => {
    localStorage.setItem('budget_tracker_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Sync budget goal to localStorage
  useEffect(() => {
    localStorage.setItem('budget_tracker_goal', budgetGoal.toString());
  }, [budgetGoal]);

  // Sync dark mode class and preference to localStorage
  useEffect(() => {
    localStorage.setItem('budget_tracker_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Add a new transaction
  const addTransaction = (newTx) => {
    const txWithId = {
      ...newTx,
      id: Date.now().toString(),
      amount: parseFloat(newTx.amount),
    };
    setTransactions((prev) => [txWithId, ...prev]);
  };

  // Update an existing transaction
  const updateTransaction = (updatedTx) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updatedTx.id ? { ...updatedTx, amount: parseFloat(updatedTx.amount) } : tx))
    );
    setEditingTransaction(null); // Clear editing state after update
  };

  // Delete a transaction
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    // If the transaction being deleted is currently being edited, cancel edit
    if (editingTransaction?.id === id) {
      setEditingTransaction(null);
    }
  };

  // Update budget goal
  const updateBudgetGoal = (goal) => {
    setBudgetGoal(Math.max(0, parseFloat(goal) || 0));
  };

  // Toggle theme
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      type: 'All',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        budgetGoal,
        darkMode,
        filters,
        editingTransaction,
        setEditingTransaction,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudgetGoal,
        toggleDarkMode,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
