import React, { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { CATEGORIES } from '../context/BudgetContext';
import { exportToCSV } from '../utils/csvExport';
import {
  FiTrash2,
  FiEdit3,
  FiDownload,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiArrowUp,
  FiArrowDown,
  FiPlus,
  FiX
} from 'react-icons/fi';

export default function TransactionList() {
  const {
    transactions,
    filters,
    setFilters,
    resetFilters,
    deleteTransaction,
    setEditingTransaction,
    editingTransaction
  } = useBudget();

  // Pagination local state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  // Handle Type Filter Change
  const handleTypeChange = (type) => {
    setFilters((prev) => ({ ...prev, type }));
    setCurrentPage(1);
  };

  // Handle Category Filter Change
  const handleCategoryChange = (e) => {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
    setCurrentPage(1);
  };

  // Handle Sorting Changes
  const toggleSort = (field) => {
    setFilters((prev) => {
      const isSameField = prev.sortBy === field;
      const nextOrder = isSameField && prev.sortOrder === 'desc' ? 'asc' : 'desc';
      return {
        ...prev,
        sortBy: field,
        sortOrder: nextOrder,
      };
    });
  };

  // Apply filters and sorting
  const filteredTransactions = transactions
    .filter((tx) => {
      // 1. Search Query
      const matchesSearch = tx.title.toLowerCase().includes(filters.search.toLowerCase());
      // 2. Type Filter
      const matchesType = filters.type === 'All' || tx.type === filters.type.toLowerCase();
      // 3. Category Filter
      const matchesCategory = filters.category === 'All' || tx.category === filters.category;

      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      // Sorting
      let compare = 0;
      if (filters.sortBy === 'date') {
        compare = new Date(a.date) - new Date(b.date);
      } else if (filters.sortBy === 'amount') {
        compare = a.amount - b.amount;
      }
      return filters.sortOrder === 'asc' ? compare : -compare;
    });

  // Calculate Pagination slice
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleCSVExport = () => {
    exportToCSV(filteredTransactions);
  };

  const isFilterActive = filters.search !== '' || filters.category !== 'All' || filters.type !== 'All';

  // Format Date beautifully
  const formatDateString = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-6 shadow-sm w-full flex flex-col gap-4">
      
      {/* Header and CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transaction History</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">View, search, edit and delete ledger logs</p>
        </div>
        <button
          onClick={handleCSVExport}
          disabled={filteredTransactions.length === 0}
          className="flex items-center justify-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/40 dark:hover:bg-violet-900/40 text-violet-600 dark:text-violet-400 border border-violet-200/30 dark:border-violet-800/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FiDownload className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by title..."
            value={filters.search}
            onChange={handleSearchChange}
            className="form-input pl-10 text-sm"
          />
        </div>

        {/* Category Selector */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="form-input text-sm cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Type Segmented Control */}
        <div className="grid grid-cols-3 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          {['All', 'Income', 'Expense'].map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filters.type === type
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Summary & Reset */}
      {isFilterActive && (
        <div className="flex items-center justify-between bg-slate-100/55 dark:bg-slate-800/30 px-3 py-2 rounded-xl text-xs">
          <div className="text-slate-500 dark:text-slate-400">
            Found <span className="font-semibold text-slate-800 dark:text-slate-200">{totalItems}</span> matching records.
          </div>
          <button
            onClick={resetFilters}
            className="flex items-center gap-0.5 font-bold text-rose-500 hover:text-rose-600 transition-colors"
          >
            <FiX className="w-3.5 h-3.5" /> Clear Filters
          </button>
        </div>
      )}

      {/* List/Table Container */}
      <div className="overflow-x-auto w-full">
        {paginatedTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            <p className="text-sm font-medium">No transactions found</p>
            <p className="text-xs mt-1">Try resetting filters or adding new transactions</p>
          </div>
        ) : (
          <div className="min-w-full inline-block align-middle">
            {/* Desktop Table Layout */}
            <table className="min-w-full hidden md:table">
              <thead>
                <tr className="text-left border-b border-slate-100 dark:border-slate-800 text-xxs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="py-3 pl-2">Details</th>
                  <th
                    className="py-3 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {filters.sortBy === 'date' && (
                        filters.sortOrder === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th className="py-3">Category</th>
                  <th
                    className="py-3 text-right cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                    onClick={() => toggleSort('amount')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Amount
                      {filters.sortBy === 'amount' && (
                        filters.sortOrder === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 text-center pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {paginatedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors ${
                      editingTransaction?.id === tx.id ? 'bg-violet-50/20 dark:bg-violet-950/10' : ''
                    }`}
                  >
                    {/* Title & Type Badge */}
                    <td className="py-3.5 pl-2 font-medium">
                      <div className="flex flex-col">
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{tx.title}</span>
                        <span className={`text-[10px] w-fit font-bold uppercase px-1.5 py-0.5 rounded mt-0.5 leading-none ${
                          tx.type === 'income'
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                        }`}>
                          {tx.type}
                        </span>
                      </div>
                    </td>
                    
                    {/* Date */}
                    <td className="py-3.5 text-slate-500 dark:text-slate-400">
                      {formatDateString(tx.date)}
                    </td>
                    
                    {/* Category */}
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tx.category}
                      </span>
                    </td>
                    
                    {/* Amount */}
                    <td className={`py-3.5 text-right font-bold ${
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    
                    {/* Actions */}
                    <td className="py-3.5 text-center pr-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingTransaction(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 dark:text-slate-500 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit transaction"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete transaction"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards Layout */}
            <div className="flex flex-col gap-3 md:hidden">
              {paginatedTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3.5 relative overflow-hidden ${
                    editingTransaction?.id === tx.id ? 'bg-violet-50/20 dark:bg-violet-950/10 border-violet-200/50' : 'bg-white/40 dark:bg-slate-900/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{tx.title}</h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded leading-none ${
                          tx.type === 'income'
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                        }`}>
                          {tx.type}
                        </span>
                        <span className="text-xxs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                          {tx.category}
                        </span>
                      </div>
                    </div>
                    
                    <span className={`font-extrabold text-base ${
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <span>{formatDateString(tx.date)}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingTransaction(tx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 bg-slate-100 dark:bg-slate-800"
                      >
                        <FiEdit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Page <span className="font-semibold text-slate-800 dark:text-slate-200">{currentPage}</span> of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
