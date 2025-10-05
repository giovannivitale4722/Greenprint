'use client';

import React, { useState, useMemo } from 'react';

type SortField = 'date' | 'merchant' | 'category' | 'amount' | 'emissions';
type SortDirection = 'asc' | 'desc';

export default function TransactionsDemoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [syncError, setSyncError] = useState('');

  const allTransactions = [
    { id: 1, date: '2025-10-03', merchant: 'Uber', amount: 15.50, category: 'Transportation', emissions: 3.2 },
    { id: 2, date: '2025-10-02', merchant: 'Whole Foods', amount: 67.89, category: 'Food & Dining', emissions: 5.1 },
    { id: 3, date: '2025-10-01', merchant: 'Shell Gas Station', amount: 45.00, category: 'Transportation', emissions: 12.5 },
    { id: 4, date: '2025-09-30', merchant: 'Amazon', amount: 89.99, category: 'Shopping', emissions: 2.8 },
    { id: 5, date: '2025-09-29', merchant: 'ConEd Utilities', amount: 120.00, category: 'Utilities', emissions: 18.3 },
    { id: 6, date: '2025-09-28', merchant: 'Starbucks', amount: 5.75, category: 'Food & Dining', emissions: 0.9 },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSync = () => {
    setSyncError('Unable to sync transactions. Backend service is currently unavailable.');
    setTimeout(() => setSyncError(''), 5000);
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = allTransactions.filter((tx) => {
      const search = searchTerm.toLowerCase();
      return (
        tx.date.toLowerCase().includes(search) ||
        tx.merchant.toLowerCase().includes(search) ||
        tx.category.toLowerCase().includes(search) ||
        tx.amount.toString().includes(search) ||
        tx.emissions.toString().includes(search)
      );
    });

    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'date') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => (
    <button
      onClick={() => handleSort(field)}
      className="ml-1 inline-flex flex-col hover:text-[#1B4332] transition"
    >
      <span className={`text-xs ${sortField === field && sortDirection === 'asc' ? 'text-[#1B4332]' : 'text-gray-400'}`}>▲</span>
      <span className={`text-xs -mt-1 ${sortField === field && sortDirection === 'desc' ? 'text-[#1B4332]' : 'text-gray-400'}`}>▼</span>
    </button>
  );

  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#E5FCD4] text-black">
      {/* Top Border Accent */}
      <div className="h-1 w-full bg-[#1B4332]" />

      {/* Navbar */}
      <header className="bg-white shadow-sm w-full">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 w-full">
          <a href="/" className="text-2xl font-bold tracking-tight text-black hover:text-gray-700 transition">
            Greenprint
          </a>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="/dashboard-demo" className="text-black transition hover:text-gray-600">
              Dashboard
            </a>
            <a href="/transactions-demo" className="text-[#1B4332] font-semibold transition hover:text-gray-600">
              Transactions
            </a>
            <a href="/insights-demo" className="text-black transition hover:text-gray-600">
              Insights
            </a>
            <a href="/actions-demo" className="text-black transition hover:text-gray-600">
              Actions
            </a>
            <a href="/settings-demo" className="text-black transition hover:text-gray-600">
              Settings
            </a>
            <a href="/" className="text-black transition hover:text-gray-600">
              Home
            </a>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1B4332] mb-2">Transactions</h1>
            <p className="text-gray-600">View and analyze your carbon footprint</p>
          </div>
          <button 
            onClick={handleSync}
            className="bg-[#1B4332] text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            <span>🔄</span>
            Sync
          </button>
        </div>

        {/* Sync Error Message */}
        {syncError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
            <span className="text-red-500 font-bold">⚠️</span>
            <div>
              <strong className="font-bold">Sync Error: </strong>
              <span>{syncError}</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]">
              <option>All Categories</option>
              <option>Transportation</option>
              <option>Food & Dining</option>
              <option>Shopping</option>
              <option>Utilities</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]">
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last Year</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                  <SortIcon field="date" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merchant
                  <SortIcon field="merchant" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                  <SortIcon field="category" />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                  <SortIcon field="amount" />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carbon Footprint
                  <SortIcon field="emissions" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedTransactions.length > 0 ? (
                filteredAndSortedTransactions.map((tx, index) => (
                  <tr key={tx.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tx.merchant}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#1B4332]/10 text-[#1B4332]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${tx.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-semibold text-[#1B4332]">{tx.emissions} kg CO2e</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No transactions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Card */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-[#1B4332]">{filteredAndSortedTransactions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-[#1B4332]">
                ${filteredAndSortedTransactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Emissions</p>
              <p className="text-2xl font-bold text-[#1B4332]">
                {filteredAndSortedTransactions.reduce((sum, tx) => sum + tx.emissions, 0).toFixed(1)} kg CO2e
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1B4332] py-8 text-white w-full mt-12">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm w-full">
          <p>&copy; 2025 Greenprint. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="/privacy" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-gray-300">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
