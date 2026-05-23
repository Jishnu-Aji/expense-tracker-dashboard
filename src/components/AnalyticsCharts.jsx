import React from 'react';
import { useBudget } from '../hooks/useBudget';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

// Colors for category slices
const COLORS = {
  Food: '#f43f5e',         // Rose
  Travel: '#0ea5e9',       // Sky
  Shopping: '#ec4899',     // Pink
  Bills: '#eab308',        // Amber
  Entertainment: '#a855f7', // Purple
  Health: '#10b981',       // Emerald
  Education: '#3b82f6',    // Blue
  Salary: '#22c55e',       // Green
  Others: '#64748b'        // Slate
};

const DEFAULT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#eab308', '#10b981'];

export default function AnalyticsCharts() {
  const { transactions, darkMode } = useBudget();

  // 1. Prepare Pie Chart Data (Expenses by Category)
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  
  const categoryTotals = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const pieData = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: parseFloat(categoryTotals[cat].toFixed(2))
  }));

  // 2. Prepare Bar Chart Data (Monthly Income vs Expense Trend)
  // We'll group transactions by Month-Year, e.g. "May 2026"
  const monthlyTotals = transactions.reduce((acc, t) => {
    if (!t.date) return acc;
    const dateObj = new Date(t.date);
    const monthName = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear();
    const key = `${monthName} ${year}`;

    if (!acc[key]) {
      acc[key] = { month: key, income: 0, expense: 0 };
    }

    if (t.type === 'income') {
      acc[key].income += t.amount;
    } else {
      acc[key].expense += t.amount;
    }

    return acc;
  }, {});

  // Sort monthly data chronologically
  const barData = Object.values(monthlyTotals).sort((a, b) => {
    return new Date(a.month) - new Date(b.month);
  });

  // Recharts styling helpers based on theme
  const textColor = darkMode ? '#94a3b8' : '#64748b';
  const gridColor = darkMode ? '#334155' : '#f1f5f9';
  const tooltipBg = darkMode ? '#1e293b' : '#ffffff';
  const tooltipBorder = darkMode ? '#475569' : '#e2e8f0';

  // Custom tooltips for nice styling
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="p-3 shadow-md rounded-xl text-xs font-semibold"
          style={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            borderWidth: '1px',
            color: darkMode ? '#f8fafc' : '#0f172a'
          }}
        >
          <p className="mb-0.5">{data.name}</p>
          <p className="text-violet-600 dark:text-violet-400 font-bold">
            ₹{data.value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3.5 shadow-md rounded-xl text-xs font-semibold flex flex-col gap-1"
          style={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            borderWidth: '1px',
            color: darkMode ? '#f8fafc' : '#0f172a'
          }}
        >
          <p className="border-b pb-1 mb-1 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-emerald-600 dark:text-emerald-400 flex justify-between gap-4">
            <span>Income:</span>
            <span className="font-extrabold">₹{payload[0].value.toLocaleString('en-IN')}</span>
          </p>
          <p className="text-rose-600 dark:text-rose-400 flex justify-between gap-4">
            <span>Expense:</span>
            <span className="font-extrabold">₹{payload[1].value.toLocaleString('en-IN')}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      
      {/* 1. Bar Chart: Income vs Expense Trend */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-sm flex flex-col h-[380px]">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Cash Flow Comparison</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Monthly breakdown of income and expenses</p>
        </div>
        
        <div className="flex-1 w-full min-h-0">
          {barData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
              Add transactions to view comparison trends
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: textColor, fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }} />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. Pie Chart: Expenses by Category */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-sm flex flex-col h-[380px]">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Expense Categories</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Distribution of expenses across categories</p>
        </div>

        <div className="flex-1 w-full min-h-0 flex flex-col sm:flex-row items-center justify-center">
          {pieData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
              No expense data recorded to build visual chart
            </div>
          ) : (
            <>
              <div className="w-full sm:w-[55%] h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom detailed legend to look gorgeous */}
              <div className="w-full sm:w-[45%] max-h-full overflow-y-auto px-2 flex flex-col gap-1.5 scrollbar-thin">
                {pieData.map((entry, index) => {
                  const total = pieData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
                  const color = COLORS[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                  
                  return (
                    <div key={entry.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{entry.name}</span>
                      </div>
                      <div className="flex gap-2 font-medium">
                        <span className="text-slate-400">{percentage}%</span>
                        <span className="text-slate-800 dark:text-slate-200">₹{entry.value.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
