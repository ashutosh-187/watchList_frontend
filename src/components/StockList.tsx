import React from 'react';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import type { Stock } from '../types/watchlist';

interface StockListProps {
  stocks: Stock[];
  isLoading: boolean;
  error: string | null;
  onDelete: (stockName: string) => Promise<void>;
}

export const StockList: React.FC<StockListProps> = ({ stocks, isLoading, error, onDelete }) => {
  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 p-4">
        {error}
      </div>
    );
  }

  if (isLoading && (!stocks || stocks.length === 0)) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!Array.isArray(stocks)) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-4">
        No stocks available
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {stocks.map((stock) => (
        <div
          key={stock.segment_id}
          className="group bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg relative"
        >
          {/* Delete button that appears on hover */}
          <button
            onClick={() => onDelete(stock.name)}
            className="absolute top-2 right-2 p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-200 dark:hover:bg-red-800"
            aria-label="Delete stock"
          >
            <Trash2 size={16} />
          </button>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {stock.name}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Closing Price</p>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                ${stock.closing}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">LTP</p>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                ${stock.ltp}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {stock.percentage_change >= 0 ? (
              <TrendingUp className="text-green-500 mr-2" size={20} />
            ) : (
              <TrendingDown className="text-red-500 mr-2" size={20} />
            )}
            <span
              className={`text-lg font-semibold ${
                stock.percentage_change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {stock.percentage_change}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};