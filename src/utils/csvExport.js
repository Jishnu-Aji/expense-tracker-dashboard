/**
 * Exports a list of transactions to a CSV file.
 * @param {Array} transactions - List of transaction objects
 * @param {string} filename - Output file name
 */
export const exportToCSV = (transactions, filename = 'expense_tracker_transactions.csv') => {
  if (!transactions || !transactions.length) {
    return;
  }

  const headers = ['Title', 'Amount (INR)', 'Type', 'Category', 'Date'];
  
  const rows = transactions.map(t => {
    // Escape double quotes in title
    const escapedTitle = (t.title || '').replace(/"/g, '""');
    return [
      `"${escapedTitle}"`,
      t.amount,
      t.type,
      t.category,
      t.date
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
