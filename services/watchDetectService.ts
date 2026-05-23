import type { WatchPrice } from '../types/watch';

export type PriceChangeStatus = 'none' | 'down' | 'up' | 'same';
export type NewItemStatus = 'none' | 'detected' | 'notDetected';
export type SignatureMode = 'ID 기준' | '가격 기준';

export function formatCheckedTime(date: Date) {
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  return `${hour}:${minute}:${second}`;
}

export function formatPrice(price: WatchPrice) {
  const amount = price.amount ?? '-';
  const currency = price.currency ?? '';

  return `${amount} ${currency}`.trim();
}

export function getPriceNumber(price?: WatchPrice) {
  if (!price) {
    return null;
  }

  if (typeof price.amount === 'number') {
    return price.amount;
  }

  if (typeof price.amount === 'string') {
    const parsedAmount = Number(price.amount);

    if (Number.isNaN(parsedAmount)) {
      return null;
    }

    return parsedAmount;
  }

  return null;
}

export function getPriceCurrency(price?: WatchPrice) {
  return price?.currency || '';
}

export function getItemId(price: WatchPrice) {
  return (
    price.id ||
    price.resultId ||
    price.itemId ||
    price.listingId ||
    ''
  );
}

function hasItemIds(prices: WatchPrice[]) {
  return prices.some((price) => getItemId(price));
}

function getItemIdSignature(prices: WatchPrice[]) {
  return prices
    .slice(0, 10)
    .map((price) => getItemId(price))
    .filter(Boolean)
    .join('|');
}

function getPriceSignature(price: WatchPrice, index: number) {
  return `${index + 1}:${price.amount}:${price.currency}`;
}

function getPriceListSignature(prices: WatchPrice[]) {
  return prices
    .slice(0, 10)
    .map((price, index) => getPriceSignature(price, index))
    .join('|');
}

export function getWatchSignature(prices: WatchPrice[]): {
  signature: string;
  mode: SignatureMode;
} {
  if (hasItemIds(prices)) {
    return {
      signature: getItemIdSignature(prices),
      mode: 'ID 기준',
    };
  }

  return {
    signature: getPriceListSignature(prices),
    mode: '가격 기준',
  };
}

export function countNewItemIds(
  previousSignature: string,
  currentSignature: string,
) {
  if (!previousSignature || !currentSignature) {
    return 0;
  }

  const previousIds = new Set(previousSignature.split('|').filter(Boolean));
  const currentIds = currentSignature.split('|').filter(Boolean);

  return currentIds.filter((id) => !previousIds.has(id)).length;
}

export function getNewItemStatus(
  previousSignature: string,
  currentSignature: string,
): NewItemStatus {
  if (!previousSignature || !currentSignature) {
    return 'none';
  }

  if (previousSignature !== currentSignature) {
    return 'detected';
  }

  return 'notDetected';
}

export function getPriceChangeStatus(
  previousPrice: number | null,
  currentPrice: number | null,
): PriceChangeStatus {
  if (previousPrice === null || currentPrice === null) {
    return 'none';
  }

  if (currentPrice < previousPrice) {
    return 'down';
  }

  if (currentPrice > previousPrice) {
    return 'up';
  }

  return 'same';
}

export function getPriceChangeText(
  status: PriceChangeStatus,
  previousPrice: number | null,
  currentPrice: number | null,
  currency: string,
) {
  if (status === 'none') {
    return '비교 대기';
  }

  if (previousPrice === null || currentPrice === null) {
    return '비교 대기';
  }

  if (status === 'down') {
    return `${previousPrice} → ${currentPrice} ${currency}`;
  }

  if (status === 'up') {
    return `${previousPrice} → ${currentPrice} ${currency}`;
  }

  return `${currentPrice} ${currency}`;
}

export function getPriceChangeLabel(status: PriceChangeStatus) {
  if (status === 'down') {
    return '가격 하락';
  }

  if (status === 'up') {
    return '가격 상승';
  }

  if (status === 'same') {
    return '가격 동일';
  }

  return '비교 대기';
}

export function getPriceChangeClassName(status: PriceChangeStatus) {
  if (status === 'down') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
  }

  if (status === 'up') {
    return 'border-red-500/30 bg-red-500/10 text-red-300';
  }

  if (status === 'same') {
    return 'border-slate-700 bg-slate-800/70 text-slate-300';
  }

  return 'border-slate-800 bg-slate-950 text-slate-500';
}

export function getNewItemLabel(status: NewItemStatus) {
  if (status === 'detected') {
    return '신규 매물 감지';
  }

  if (status === 'notDetected') {
    return '신규 없음';
  }

  return '감지 대기';
}

export function getNewItemText(
  status: NewItemStatus,
  count: number,
  signatureMode: SignatureMode,
) {
  if (status === 'detected') {
    if (signatureMode === 'ID 기준') {
      return count > 0 ? `새 매물 ${count}개` : '목록 순서 변화';
    }

    return '가격 목록 변화';
  }

  if (status === 'notDetected') {
    return '이전 조회와 동일';
  }

  return '다음 조회부터 비교';
}

export function getNewItemDescription(
  status: NewItemStatus,
  signatureMode: SignatureMode,
) {
  if (status === 'detected' && signatureMode === 'ID 기준') {
    return '이전 조회에 없던 매물 ID가 현재 최저가 목록에 들어왔습니다.';
  }

  if (status === 'detected' && signatureMode === '가격 기준') {
    return '매물 ID가 없어 최저가 목록의 가격 변화로 감지했습니다.';
  }

  if (status === 'notDetected') {
    return '현재 최저가 목록은 이전 조회 결과와 동일합니다.';
  }

  return '첫 조회 이후부터 신규 매물 여부를 비교합니다.';
}

export function getNewItemClassName(status: NewItemStatus) {
  if (status === 'detected') {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
  }

  if (status === 'notDetected') {
    return 'border-slate-700 bg-slate-800/70 text-slate-300';
  }

  return 'border-slate-800 bg-slate-950 text-slate-500';
}

export function getSignatureModeClassName(signatureMode: SignatureMode) {
  if (signatureMode === 'ID 기준') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
  }

  return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
}