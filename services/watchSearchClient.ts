import type {
  WatchCondition,
  WatchPrice,
  WatchSearchApiResponse,
} from '../types/watch';

export type WatchSearchClientResult = {
  prices: WatchPrice[];
  league: string;
};

export function getConditionUrl(condition: WatchCondition) {
  return (
    condition.url ||
    condition.tradeUrl ||
    condition.searchUrl ||
    condition.officialUrl ||
    ''
  );
}

export function getConditionTitle(condition: WatchCondition) {
  return condition.title || condition.name || '등록된 감시조건';
}

function normalizePrices(data: WatchSearchApiResponse): WatchPrice[] {
  if (Array.isArray(data.prices)) {
    return data.prices;
  }

  if (Array.isArray(data.results)) {
    return data.results;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  return [];
}

export async function fetchWatchSearchPrices({
  conditionUrl,
  fallbackLeague,
}: {
  conditionUrl: string;
  fallbackLeague?: string;
}): Promise<WatchSearchClientResult> {
  if (!conditionUrl) {
    throw new Error('등록된 거래소 URL이 없습니다.');
  }

  const response = await fetch(
    `/api/watch-search?url=${encodeURIComponent(conditionUrl)}`,
  );

  const data = (await response.json()) as WatchSearchApiResponse;

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.error ||
        data.message ||
        '감시 데이터를 불러오지 못했습니다.',
    );
  }

  return {
    prices: normalizePrices(data),
    league: data.league || fallbackLeague || '-',
  };
}