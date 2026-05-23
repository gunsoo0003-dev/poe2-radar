export type WatchPrice = {
  id?: string | null;
  resultId?: string | null;
  itemId?: string | null;
  listingId?: string | null;
  itemName?: string | null;
  amount: number | string | null;
  currency: string | null;
  indexed?: string | null;
  seller?: string | null;
};

export type PublicMonitor = {
  id?: string;
  title: string;
  league: string;
  changeRate: string;
  newItemText: string;
  conditionText?: string;
  prices: WatchPrice[];
};

export type WatchCondition = {
  id: string;

  title?: string;
  name?: string;

  url?: string;
  tradeUrl?: string;
  searchUrl?: string;
  officialUrl?: string;

  league?: string;
  memo?: string;

  alertEnabled?: boolean;
  alertType?: string;
  alertLabel?: string;

  updatedAt?: string;
  createdAt?: string;
  lastCheckedAt?: string;

  summary?: string[];
  extraSummaryCount?: number;

  prices?: WatchPrice[];
};

export type WatchSearchApiResponse = {
  ok?: boolean;
  league?: string;
  searchId?: string | null;
  prices?: WatchPrice[];
  results?: WatchPrice[];
  items?: WatchPrice[];
  error?: string;
  message?: string;
};