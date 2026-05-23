import React, { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { FiCheckCircle, FiAlertTriangle, FiEdit3, FiSave, FiCheck, FiX } from 'react-icons/fi';

export default function BudgetGoalTracker() {
  const { transactions, budgetGoal, updateBudgetGoal } = useBudget();
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(budgetGoal);

  // Sum of all active expense transactions
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const percentSpent = budgetGoal > 0 ? (totalExpense / budgetGoal) * 100 : 0;
  const remaining = budgetGoal - totalExpense;

  const handleSave = () => {
    updateBudgetGoal(newGoal);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewGoal(budgetGoal);
    setIsEditing(false);
  };

  // Determine progress bar and alert color scheme
  let barColorClass = "bg-violet-600";
  let statusText = "You are well within your budget limit.";
  let statusColorClass = "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20";
  let statusIcon = <FiCheckCircle className="w-5 h-5" />;

  if (percentSpent > 100) {
    barColorClass = "bg-rose-500";
    statusText = `Over budget by ₹${Math.abs(remaining).toLocaleString('en-IN', { minimumFractionDigits: 2 })}! Consider pausing non-essential expenses.`;
    statusColorClass = "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20";
    statusIcon = <FiAlertTriangle className="w-5 h-5 text-rose-500 animate-bounce" />;
  } else if (percentSpent > 80) {
    barColorClass = "bg-amber-500";
    statusText = `Approaching budget limit. Spent ${percentSpent.toFixed(0)}% of your monthly goal.`;
    statusColorClass = "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20";
    statusIcon = <FiAlertTriangle className="w-5 h-5 text-amber-500" />;
  } else if (percentSpent > 50) {
    barColorClass = "bg-indigo-500";
  } else {
    barColorClass = "bg-emerald-500";
  }

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-sm w-full">
      <div className="flex flex-col gap-4">
        
        {/* Header and Editor Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Budget Goal Tracker</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track spending limit relative to your goal</p>
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                min="0"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 transition-colors"
                title="Save Goal"
              >
                <FiCheck className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 transition-colors"
                title="Cancel"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <FiEdit3 className="w-3.5 h-3.5" /> Edit Goal
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800">
          <div className="text-center">
            <p className="text-xxs uppercase tracking-wider text-slate-400 font-semibold">Goal</p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              ₹{budgetGoal.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-center border-x border-slate-100 dark:border-slate-800">
            <p className="text-xxs uppercase tracking-wider text-slate-400 font-semibold">Spent</p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              ₹{totalExpense.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xxs uppercase tracking-wider text-slate-400 font-semibold">Remaining</p>
            <p className={`text-base font-bold ${remaining >= 0 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-500'}`}>
              ₹{remaining.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-slate-500 dark:text-slate-400">Spending Progress</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              {percentSpent.toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${barColorClass}`}
              style={{ width: `${Math.min(100, percentSpent)}%` }}
            ></div>
          </div>
        </div>

        {/* Status Message */}
        <div className={`flex items-start gap-2.5 p-3 rounded-xl ${statusColorClass} transition-all duration-300`}>
          <div className="mt-0.5">{statusIcon}</div>
          <p className="text-xs font-medium leading-relaxed">{statusText}</p>
        </div>

      </div>
    </div>
  );
}
