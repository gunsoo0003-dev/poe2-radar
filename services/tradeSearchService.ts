// services/tradeSearchService.ts

import type { WatchPrice } from '../types/watch';

export type TradeSearchResponse = {
  ok?: boolean;
  error?: string;
  prices?: WatchPrice[];
  query?: unknown;
};

export async function fetchWatchSearch(
  tradeUrl: string,
): Promise<TradeSearchResponse> {
  const response = await fetch(
    `/api/watch-search?url=${encodeURIComponent(tradeUrl)}`,
  );

  const data = (await response.json()) as TradeSearchResponse;

  if (!response.ok) {
    return {
      ok: false,
      error: data.error ?? '검색조건 조회에 실패했습니다.',
    };
  }

  return data;
}