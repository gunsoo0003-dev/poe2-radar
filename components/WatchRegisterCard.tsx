'use client';

import { useState } from 'react';

import type { WatchCondition, WatchPrice, WatchSearchApiResponse } from '../types/watch';

type WatchRegisterCardProps = {
  currentCount: number;
  onAddCondition: (condition: WatchCondition) => void;
};

const MAX_WATCH_SLOT_COUNT = 4;

function createConditionId() {
  return `watch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeSummary(league?: string) {
  const summary: string[] = [];

  if (league) {
    summary.push(league);
  }

  if (summary.length === 0) {
    summary.push('공식 거래소 검색조건');
  }

  summary.push('최저가순');

  return summary;
}

function normalizePrices(
  prices: WatchPrice[] | undefined,
): WatchPrice[] {
  if (!prices || prices.length === 0) {
    return [
      {
        amount: '-',
        currency: '검색 결과 없음',
      },
    ];
  }

  return prices.slice(0, 10).map((price) => ({
    amount: price.amount ?? '-',
    currency: price.currency ?? '',
  }));
}

export default function WatchRegisterCard({
  currentCount,
  onAddCondition,
}: WatchRegisterCardProps) {
  const [tradeUrl, setTradeUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!tradeUrl.trim()) {
      setMessage('공식 거래소 검색 URL을 입력해야 합니다.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        `/api/watch-search?url=${encodeURIComponent(tradeUrl.trim())}`,
      );

      const data = (await response.json()) as WatchSearchApiResponse;

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.error ||
            data.message ||
            '공식 거래소 검색조건을 불러오지 못했습니다.',
        );
      }

      const title =
        customTitle.trim() ||
        data.league ||
        '공식 거래소 감시조건';

      const condition: WatchCondition = {
        id: createConditionId(),
        title,
        name: title,
        url: tradeUrl.trim(),
        tradeUrl: tradeUrl.trim(),
        league: data.league || '리그 확인중',
        alertEnabled: true,
        alertType: 'price',
        alertLabel: '가격 변화 감지',
        createdAt: new Date().toISOString(),
        updatedAt: '방금 전',
        summary: normalizeSummary(data.league),
        extraSummaryCount: 0,
        prices: normalizePrices(data.prices || data.results || data.items),
      };

      onAddCondition(condition);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs font-bold text-emerald-400">
            WATCH CONDITION REGISTER
          </p>

          <h2 className="mt-2 text-xl font-bold text-white">
            공식 거래소 검색조건 등록
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            POE2 공식 거래소에서 검색조건을 만든 뒤, 검색 결과 URL을 그대로
            붙여넣으면 감시 슬롯에 등록됩니다.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <p className="text-xs font-bold text-slate-500">
            현재 감시 슬롯
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {currentCount} / {MAX_WATCH_SLOT_COUNT}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            슬롯이 4개를 초과하면 가장 오래된 감시조건이 자동으로 교체됩니다.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="watch-title"
            className="text-sm font-bold text-slate-300"
          >
            감시조건 이름
          </label>

          <input
            id="watch-title"
            value={customTitle}
            onChange={(event) => setCustomTitle(event.target.value)}
            placeholder="예: 희귀 장갑 생명력 + 저항"
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="trade-url"
            className="text-sm font-bold text-slate-300"
          >
            공식 거래소 검색 URL
          </label>

          <textarea
            id="trade-url"
            value={tradeUrl}
            onChange={(event) => setTradeUrl(event.target.value)}
            placeholder="https://poe.game.daum.net/trade2/search/poe2/..."
            rows={4}
            className="resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
          />
        </div>

        {message ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="text-sm font-semibold text-red-300">
              {message}
            </p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleRegister}
          disabled={isLoading}
          className="rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isLoading ? '검색조건 확인중' : '감시조건 등록'}
        </button>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
          <p className="text-xs font-bold text-slate-500">
            등록 방식
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            하루 신규 등록은 2개까지 가능하며, 총 4개 슬롯을 초과하면 가장
            오래된 감시조건이 자동으로 제거됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}