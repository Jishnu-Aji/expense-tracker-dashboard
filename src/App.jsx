import React from 'react';
import { BudgetProvider } from './context/BudgetContext';
import Navbar from './components/Navbar';
import DashboardCards from './components/DashboardCards';
import BudgetGoalTracker from './components/BudgetGoalTracker';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import AnalyticsCharts from './components/AnalyticsCharts';
import { FiTrendingUp, FiHeart } from 'react-icons/fi';

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-6 flex flex-col gap-6 md:gap-8 animate-fade-in">
        
        {/* Title and Intro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Financial Control Center
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Add transactions, track expense ratios, keep tabs on monthly spending limits, and download report CSVs.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border border-violet-200/20">
            <FiTrendingUp className="w-4 h-4" /> Live Tracking Active
          </div>
        </div>

        {/* 1. Dashboard summary cards */}
        <DashboardCards />

        {/* 2. Form, Limit Tracker and Transaction list grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
          {/* Form and Limit Tracker Left Side (4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <TransactionForm />
            <BudgetGoalTracker />
          </div>

          {/* Transaction Ledger List Right Side (8 columns) */}
          <div className="lg:col-span-8 h-full">
            <TransactionList />
          </div>
        </div>

        {/* 3. Recharts Analytics Visualizers */}
        <AnalyticsCharts />

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/50 dark:border-slate-800/50 py-6 mt-12 bg-white/40 dark:bg-slate-950/40 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between px-6 md:px-12 gap-3 max-w-7xl mx-auto">
        <p>&copy; {new Date().getFullYear()} FinGuard. All Rights Reserved.</p>
        <p className="flex items-center gap-1.5">
          Crafted with <FiHeart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> for Personal Finance Mastery
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BudgetProvider>
      <AppContent />
    </BudgetProvider>
  );
}
