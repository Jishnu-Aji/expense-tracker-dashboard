import React from 'react';
import { useBudget } from '../hooks/useBudget';
import { FiSun, FiMoon, FiDollarSign, FiActivity } from 'react-icons/fi';

export default function Navbar() {
  const { darkMode, toggleDarkMode, transactions } = useBudget();

  // Simple stats for the navbar
  const balance = transactions.reduce((acc, tx) => {
    return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
  }, 0);

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b px-4 py-3 md:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Branding & Logo */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl text-white shadow-md shadow-violet-500/20">
            <FiActivity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent leading-none">
              FinGuard
            </h1>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Budget & Expense Hub
            </span>
          </div>
        </div>

        {/* Action Panel (Stats & Dark Mode) */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Mini Balance Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400">Balance:</span>
            <span className={balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <FiSun className="w-5 h-5 text-amber-400 animate-[spin_12s_linear_infinite]" />
            ) : (
              <FiMoon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
