import React, { useState, useEffect } from 'react';
import { useBudget } from '../hooks/useBudget';
import { CATEGORIES } from '../context/BudgetContext';
import { FiPlus, FiSave, FiX } from 'react-icons/fi';

export default function TransactionForm() {
  const { addTransaction, updateTransaction, editingTransaction, setEditingTransaction } = useBudget();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  // Prefill the form if in edit mode
  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount.toString());
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setError('');
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setType('expense');
    setCategory(CATEGORIES[0]);
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic Validations
    if (!title.trim()) {
      setError('Please enter a transaction title.');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!date) {
      setError('Please select a transaction date.');
      return;
    }

    const txData = {
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date,
    };

    if (editingTransaction) {
      updateTransaction({
        ...txData,
        id: editingTransaction.id,
      });
    } else {
      addTransaction(txData);
      resetForm();
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-sm w-full">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </h3>
        {editingTransaction && (
          <button
            onClick={handleCancelEdit}
            className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-0.5"
          >
            <FiX className="w-3.5 h-3.5" /> Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Transaction Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Groceries, Freelance, rent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Amount & Type Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Amount (₹)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Type
            </label>
            <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  type === 'income'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  type === 'expense'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Expense
              </button>
            </div>
          </div>
        </div>

        {/* Category & Date Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-200/50 dark:border-rose-900/50">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2.5 rounded-xl text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-95 cursor-pointer ${
            editingTransaction
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10'
              : 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/10'
          }`}
        >
          {editingTransaction ? (
            <>
              <FiSave className="w-4 h-4" /> Update Transaction
            </>
          ) : (
            <>
              <FiPlus className="w-4 h-4" /> Add Transaction
            </>
          )}
        </button>

      </form>
    </div>
  );
}
