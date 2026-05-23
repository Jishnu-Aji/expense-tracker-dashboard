import React from 'react';
import { useBudget } from '../hooks/useBudget';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart } from 'react-icons/fi';

export default function DashboardCards() {
  const { transactions } = useBudget();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
      
      {/* Total Balance Card */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-violet-500/10 transition-transform duration-300 hover:scale-[1.02]">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
          <FiDollarSign className="w-32 h-32" />
        </div>
        <div className="flex flex-col h-full justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-violet-100 uppercase tracking-wider">Total Balance</p>
            <h3 className="text-3xl font-extrabold mt-1 tracking-tight">
              ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-violet-200">
            {totalBalance >= 0 ? (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white/20">
                <FiTrendingUp /> Net Positive
              </span>
            ) : (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200">
                <FiTrendingDown /> Net Deficit
              </span>
            )}
            <span>Current Month</span>
          </div>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm transition-transform duration-300 hover:scale-[1.02] flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Income</p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            ₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1 mt-1">
            <FiTrendingUp className="w-3.5 h-3.5" /> Added to budget
          </p>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl">
          <FiTrendingUp className="w-6 h-6" />
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm transition-transform duration-300 hover:scale-[1.02] flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Expenses</p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            ₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
            <FiTrendingDown className="w-3.5 h-3.5" /> Out of pocket
          </p>
        </div>
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-2xl">
          <FiTrendingDown className="w-6 h-6" />
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm transition-transform duration-300 hover:scale-[1.02] flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Savings Rate</p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {savingsRate >= 0 ? `${savingsRate.toFixed(1)}%` : '0%'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {savingsRate > 20 ? 'Solid saving habits' : 'Try setting a lower goal'}
          </p>
        </div>
        <div className="p-4 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-2xl">
          <FiPieChart className="w-6 h-6" />
        </div>
      </div>

    </div>
  );
}
