import axios from 'axios';
import type { WatchlistResponse, AddStockResponse } from '../types/watchlist';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getWatchlist = async (): Promise<WatchlistResponse> => {
  const response = await api.get<WatchlistResponse>('/watch_list');
  return response.data;
};

export const addStock = async (instrument: string) => {
  instrument = instrument.toUpperCase()
  const response = await api.get(`/watch_list/add_instrument`, {
    params: { instrument },
  });
  return response.data;
};

export const removeStock = async (instrument: string) => {
  instrument = instrument.toUpperCase()
  const response = await api.get('/watch_list/remove_instrument', {
    params: { instrument },
  });
  return response.data;
};
