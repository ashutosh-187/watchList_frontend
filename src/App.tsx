import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { StockList } from './components/StockList';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import { getWatchlist, addStock, removeStock } from './services/api';
import type { Stock } from './types/watchlist';

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode, setIsDarkMode } = useTheme();

  // Fetch the current watchlist from the backend
  const fetchWatchlist = async () => {
    try {
      const response = await getWatchlist();
      setStocks(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch watchlist data');
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial fetch and schedule periodic updates every 60 seconds.
  useEffect(() => {
    fetchWatchlist();
    const interval = setInterval(fetchWatchlist, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handler when the user submits a search
  const handleSearch = async (symbol: string) => {
    setIsLoading(true); // Show the loader while processing
    try {
      await addStock(symbol);  // Add the new stock to the watchlist
      await fetchWatchlist();  // Refresh the list after adding
    } catch (err) {
      setError('Failed to add stock to watchlist');
      setIsLoading(false);
    }
  };

  // Handler for deleting a stock
  const handleDelete = async (stockName: string) => {
    setIsLoading(true); // Show loading screen
    try {
      await removeStock(stockName);
      await fetchWatchlist(); // Refresh the list after deletion
    } catch (err) {
      console.log(err);
      setError('Failed to delete stock from watchlist');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          Stock Watchlist
        </h1>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {isLoading ? (
          // Container for centering the loader both horizontally and vertically
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="relative block max-w-sm p-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white opacity-20">
                Loading...
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400 opacity-20">
                Please wait while we update your watchlist.
              </p>
              <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        ) : (
          <StockList 
            stocks={stocks} 
            isLoading={isLoading} 
            error={error} 
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default App;