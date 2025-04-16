export interface Stock {
  segment_id: string;
  name: string;
  closing: number;
  ltp: number;
  percentage_change: number;
}

export interface WatchlistResponse {
  data: Stock[];
  status: string;
}

export interface AddStockResponse {
  closing: string,
  ltp: string,
  name: string,
  percentage_change: string,
  segment: string
}