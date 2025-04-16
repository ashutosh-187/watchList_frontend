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
  instrument = instrument
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  const response = await api.get(`/watch_list/add_instrument`, {
    params: { instrument },
  });
  return response.data;
};

export const removeStock = async (name: string): Promise<AddStockResponse> => {
  const response = await api.post<AddStockResponse>('/watch_list/remove_instruments', [
    { name }
  ]);
  return response.data;
};
