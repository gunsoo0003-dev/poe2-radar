'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  canUseAlert,
  createAlertBody,
  createAlertTitle,
  getDailyAlertLimit,
  getNotificationPermissionState,
  increaseAlertUsedCount,
  isAlertLocked,
  loadAlertLimit,
  requestNotificationPermission,
  resetAlertLock,
  saveAlertLock,
  sendBrowserNotification,
  type WatchAlertReason,
} from '../services/watchAlertService';
import {
  countNewItemIds,
  formatCheckedTime,
  formatPrice,
  getItemId,
  getNewItemClassName,
  getNewItemDescription,
  getNewItemLabel,
  getNewItemStatus,
  getNewItemText,
  getPriceChangeClassName,
  getPriceChangeLabel,
  getPriceChangeStatus,
  getPriceChangeText,
  getPriceCurrency,
  getPriceNumber,
  getSignatureModeClassName,
  getWatchSignature,
  type NewItemStatus,
  type PriceChangeStatus,
  type SignatureMode,
} from '../services/watchDetectService';
import {
  fetchWatchSearchPrices,
  getConditionTitle,
  getConditionUrl,
} from '../services/watchSearchClient';
import {
  loadWatchSnapshot,
  saveWatchSnapshot,
} from '../services/watchSnapshotService';
import type { WatchCondition, WatchPrice } from '../types/watch';

type WatchConditionCardProps = {
  condition: WatchCondition;
};

type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

const AUTO_REFRESH_MINUTES = 10;
const AUTO_REFRESH_INTERVAL_MS = AUTO_REFRESH_MINUTES * 60 * 1000;

function getAlertReason({
  priceChangeStatus,
  newItemStatus,
}: {
  priceChangeStatus: PriceChangeStatus;
  newItemStatus: NewItemStatus;
}): WatchAlertReason | null {
  const isPriceDown = priceChangeStatus === 'down';
  const isNewItemDetected = newItemStatus === 'detected';

  if (isPriceDown && isNewItemDetected) {
    return 'priceDownAndNewItem';
  }

  if (isPriceDown) {
    return 'priceDown';
  }

  if (isNewItemDetected) {
    return 'newItem';
  }

  return null;
}

export default function WatchConditionCard({
  condition,
}: WatchConditionCardProps) {
  const previousLowestPriceRef = useRef<number | null>(null);
  const previousWatchSignatureRef = useRef<string>('');
  const hasLoadedSnapshotRef = useRef(false);
  const refreshCountRef = useRef(0);
  const newItemDetectedCountRef = useRef(0);

  const [status, setStatus] = useState<FetchStatus>('idle');
  const [prices, setPrices] = useState<WatchPrice[]>(condition.prices || []);
  const [league, setLeague] = useState(condition.league || '-');
  const [lastCheckedTime, setLastCheckedTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [refreshCount, setRefreshCount] = useState(0);

  const [previousLowestPrice, setPreviousLowestPrice] = useState<number | null>(
    null,
  );
  const [currentLowestPrice, setCurrentLowestPrice] = useState<number | null>(
    getPriceNumber(condition.prices?.[0]),
  );
  const [currentLowestCurrency, setCurrentLowestCurrency] = useState(
    getPriceCurrency(condition.prices?.[0]),
  );
  const [priceChangeStatus, setPriceChangeStatus] =
    useState<PriceChangeStatus>('none');

  const [newItemStatus, setNewItemStatus] = useState<NewItemStatus>('none');
  const [newItemDetectedCount, setNewItemDetectedCount] = useState(0);
  const [lastNewItemCount, setLastNewItemCount] = useState(0);
  const [signatureMode, setSignatureMode] = useState<SignatureMode>('가격 기준');

  const [alertLocked, setAlertLocked] = useState(false);
  const [alertUsedCount, setAlertUsedCount] = useState(0);
  const [alertPermission, setAlertPermission] = useState<string>('default');

  const conditionUrl = useMemo(() => {
    return getConditionUrl(condition);
  }, [condition]);

  const conditionTitle = useMemo(() => {
    return getConditionTitle(condition);
  }, [condition]);

  const updateRefreshCount = (nextCount: number) => {
    refreshCountRef.current = nextCount;
    setRefreshCount(nextCount);
  };

  const updateNewItemDetectedCount = (nextCount: number) => {
    newItemDetectedCountRef.current = nextCount;
    setNewItemDetectedCount(nextCount);
  };

  const syncAlertState = useCallback(() => {
    const limit = loadAlertLimit();

    setAlertUsedCount(limit.usedCount);
    setAlertLocked(isAlertLocked(condition.id));
    setAlertPermission(getNotificationPermissionState());
  }, [condition.id]);

  const trySendAlert = useCallback(
    async ({
      nextPriceChangeStatus,
      nextNewItemStatus,
      priceText,
    }: {
      nextPriceChangeStatus: PriceChangeStatus;
      nextNewItemStatus: NewItemStatus;
      priceText: string;
    }) => {
      const alertReason = getAlertReason({
        priceChangeStatus: nextPriceChangeStatus,
        newItemStatus: nextNewItemStatus,
      });

      if (!alertReason) {
        return;
      }

      if (isAlertLocked(condition.id)) {
        setAlertLocked(true);
        return;
      }

      if (!canUseAlert()) {
        syncAlertState();
        return;
      }

      let permission = getNotificationPermissionState();

      if (permission === 'default') {
        permission = await requestNotificationPermission();
      }

      setAlertPermission(permission);

      if (permission !== 'granted') {
        return;
      }

      const title = createAlertTitle(alertReason);
      const body = createAlertBody({
        conditionTitle,
        priceText,
      });

      const sent = sendBrowserNotification({
        title,
        body,
      });

      if (!sent) {
        return;
      }

      saveAlertLock({
        conditionId: condition.id,
        reason: title,
      });

      const nextLimit = increaseAlertUsedCount();

      setAlertLocked(true);
      setAlertUsedCount(nextLimit.usedCount);
    },
    [condition.id, conditionTitle, syncAlertState],
  );

  const fetchWatchPrices = useCallback(async () => {
    if (!conditionUrl) {
      setStatus('error');
      setErrorMessage('등록된 거래소 URL이 없습니다.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const result = await fetchWatchSearchPrices({
        conditionUrl,
        fallbackLeague: condition.league,
      });

      const nextPrices = result.prices;
      const nextLowestPrice = getPriceNumber(nextPrices[0]);
      const nextLowestCurrency = getPriceCurrency(nextPrices[0]);

      const previousPrice = previousLowestPriceRef.current;
      const nextChangeStatus = getPriceChangeStatus(
        previousPrice,
        nextLowestPrice,
      );

      const previousSignature = previousWatchSignatureRef.current;
      const watchSignatureResult = getWatchSignature(nextPrices);
      const currentSignature = watchSignatureResult.signature;
      const nextNewItemStatus = getNewItemStatus(
        previousSignature,
        currentSignature,
      );

      const newItemCount =
        watchSignatureResult.mode === 'ID 기준'
          ? countNewItemIds(previousSignature, currentSignature)
          : 0;

      const nextCheckedTime = formatCheckedTime(new Date());
      const nextRefreshCount = refreshCountRef.current + 1;
      const nextDetectedCount =
        nextNewItemStatus === 'detected'
          ? newItemDetectedCountRef.current + 1
          : newItemDetectedCountRef.current;

      const nextPriceText = getPriceChangeText(
        nextChangeStatus,
        previousPrice,
        nextLowestPrice,
        nextLowestCurrency,
      );

      setPrices(nextPrices);
      setLeague(result.league);
      setLastCheckedTime(nextCheckedTime);
      setStatus('success');

      updateRefreshCount(nextRefreshCount);

      setPreviousLowestPrice(previousPrice);
      setCurrentLowestPrice(nextLowestPrice);
      setCurrentLowestCurrency(nextLowestCurrency);
      setPriceChangeStatus(nextChangeStatus);

      setNewItemStatus(nextNewItemStatus);
      setLastNewItemCount(newItemCount);
      setSignatureMode(watchSignatureResult.mode);
      updateNewItemDetectedCount(nextDetectedCount);

      await trySendAlert({
        nextPriceChangeStatus: nextChangeStatus,
        nextNewItemStatus,
        priceText: nextPriceText,
      });

      if (nextLowestPrice !== null) {
        previousLowestPriceRef.current = nextLowestPrice;
      }

      if (currentSignature) {
        previousWatchSignatureRef.current = currentSignature;
      }

      saveWatchSnapshot({
        conditionId: condition.id,
        previousLowestPrice: nextLowestPrice,
        previousWatchSignature: currentSignature,
        lastCheckedTime: nextCheckedTime,
        refreshCount: nextRefreshCount,
        newItemDetectedCount: nextDetectedCount,
        signatureMode: watchSignatureResult.mode,
      });

      syncAlertState();
    } catch (error) {
      setPrices([]);
      setStatus('error');

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    }
  }, [
    condition.id,
    condition.league,
    conditionUrl,
    syncAlertState,
    trySendAlert,
  ]);

  const handleResetAlert = async () => {
    resetAlertLock(condition.id);
    setAlertLocked(false);

    let permission = getNotificationPermissionState();

    if (permission === 'default') {
      permission = await requestNotificationPermission();
    }

    setAlertPermission(permission);
    syncAlertState();
  };

  useEffect(() => {
    if (hasLoadedSnapshotRef.current) {
      return;
    }

    hasLoadedSnapshotRef.current = true;

    const savedSnapshot = loadWatchSnapshot(condition.id);
    const firstLocalPrice = getPriceNumber(condition.prices?.[0]);
    const firstLocalSignatureResult = getWatchSignature(condition.prices || []);

    syncAlertState();

    if (savedSnapshot) {
      previousLowestPriceRef.current = savedSnapshot.previousLowestPrice;
      previousWatchSignatureRef.current = savedSnapshot.previousWatchSignature;
      refreshCountRef.current = savedSnapshot.refreshCount;
      newItemDetectedCountRef.current = savedSnapshot.newItemDetectedCount;

      setPreviousLowestPrice(savedSnapshot.previousLowestPrice);
      setCurrentLowestPrice(savedSnapshot.previousLowestPrice);
      setLastCheckedTime(savedSnapshot.lastCheckedTime);
      setRefreshCount(savedSnapshot.refreshCount);
      setNewItemDetectedCount(savedSnapshot.newItemDetectedCount);
      setSignatureMode(savedSnapshot.signatureMode);
      return;
    }

    if (firstLocalPrice !== null) {
      previousLowestPriceRef.current = firstLocalPrice;
      setCurrentLowestPrice(firstLocalPrice);
      setCurrentLowestCurrency(getPriceCurrency(condition.prices?.[0]));
    }

    if (firstLocalSignatureResult.signature) {
      previousWatchSignatureRef.current = firstLocalSignatureResult.signature;
      setSignatureMode(firstLocalSignatureResult.mode);
    }
  }, [condition.id, condition.prices, syncAlertState]);

  useEffect(() => {
    fetchWatchPrices();
  }, [fetchWatchPrices]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      fetchWatchPrices();
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [fetchWatchPrices]);

  const visiblePrices = prices.slice(0, 10);

  const priceChangeText = getPriceChangeText(
    priceChangeStatus,
    previousLowestPrice,
    currentLowestPrice,
    currentLowestCurrency,
  );
  const priceChangeLabel = getPriceChangeLabel(priceChangeStatus);
  const priceChangeClassName = getPriceChangeClassName(priceChangeStatus);

  const newItemLabel = getNewItemLabel(newItemStatus);
  const newItemText = getNewItemText(
    newItemStatus,
    lastNewItemCount,
    signatureMode,
  );
  const newItemDescription = getNewItemDescription(
    newItemStatus,
    signatureMode,
  );
  const newItemClassName = getNewItemClassName(newItemStatus);
  const signatureModeClassName = getSignatureModeClassName(signatureMode);
  const dailyAlertLimit = getDailyAlertLimit();
  const isDailyAlertLimitReached = alertUsedCount >= dailyAlertLimit;

  return (
    <article className="rounded-3xl border border-emerald-500/20 bg-slate-900 p-5 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-emerald-400">
              ACTIVE WATCH SLOT
            </p>

            <h3 className="mt-2 text-lg font-bold text-white">
              {conditionTitle}
            </h3>
          </div>

          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            감시중
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div
            className={`rounded-2xl border px-4 py-3 ${priceChangeClassName}`}
          >
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold">
                  최저가 변화
                </p>

                <p className="mt-1 text-lg font-black">
                  {priceChangeLabel}
                </p>
              </div>

              <p className="text-sm font-bold">
                {priceChangeText}
              </p>
            </div>
          </div>

          <div
            className={`rounded-2xl border px-4 py-3 ${newItemClassName}`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold">
                    신규 매물 감지
                  </p>

                  <p className="mt-1 text-lg font-black">
                    {newItemLabel}
                  </p>
                </div>

                <p className="text-sm font-bold">
                  {newItemText}
                </p>
              </div>

              <p className="text-xs leading-5 opacity-80">
                {newItemDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-xs text-slate-500">
              리그
            </p>

            <p className="mt-1 truncate text-sm font-bold text-slate-200">
              {league}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-xs text-slate-500">
              조회 상태
            </p>

            <p className="mt-1 text-sm font-bold text-slate-200">
              {status === 'idle' && '대기중'}
              {status === 'loading' && '조회중'}
              {status === 'success' && '조회 완료'}
              {status === 'error' && '조회 실패'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-xs text-slate-500">
              마지막 갱신
            </p>

            <p className="mt-1 text-sm font-bold text-slate-200">
              {lastCheckedTime || '-'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-xs text-slate-500">
              자동 갱신
            </p>

            <p className="mt-1 text-sm font-bold text-slate-200">
              {AUTO_REFRESH_MINUTES}분 주기
            </p>
          </div>

          <div
            className={`rounded-2xl border px-4 py-3 ${signatureModeClassName}`}
          >
            <p className="text-xs font-bold">
              감지 기준
            </p>

            <p className="mt-1 text-sm font-black">
              {signatureMode}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs text-slate-500">
                알림 상태
              </p>

              <p className="mt-1 text-sm font-bold text-slate-200">
                {alertLocked ? '알림 잠김' : '알림 대기중'} · 일일 사용{' '}
                {alertUsedCount} / {dailyAlertLimit}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                조건 달성 시 슬롯별 1회만 알림이 울립니다. 다시 받으려면 알림
                재설정이 필요합니다.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetAlert}
              disabled={isDailyAlertLimitReached}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-400 disabled:cursor-not-allowed disabled:text-slate-600"
            >
              알림 재설정
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-600">
            브라우저 권한: {alertPermission}
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs text-slate-500">
              등록 URL
            </p>

            <p className="mt-1 max-w-full truncate text-xs text-slate-400 md:max-w-xl">
              {conditionUrl || '등록된 URL 없음'}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchWatchPrices}
            disabled={status === 'loading'}
            className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-400 disabled:cursor-not-allowed disabled:text-slate-600"
          >
            {status === 'loading' ? '조회중' : '수동 갱신'}
          </button>
        </div>

        {status === 'loading' ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-5 text-center">
            <p className="text-sm font-semibold text-slate-300">
              공식 거래소 검색조건을 조회하는 중입니다.
            </p>
          </div>
        ) : null}

        {status === 'error' ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-4">
            <p className="text-sm font-bold text-red-300">
              감시 조회 실패
            </p>

            <p className="mt-1 text-xs leading-5 text-red-200/80">
              {errorMessage}
            </p>
          </div>
        ) : null}

        {status === 'success' ? (
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-slate-400">
                최저가순 10개 결과
              </p>

              <p className="text-xs text-slate-500">
                누적 조회 {refreshCount}회 · 변화 감지 {newItemDetectedCount}회
              </p>
            </div>

            {visiblePrices.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {visiblePrices.map((price, index) => (
                  <div
                    key={`${price.amount}-${price.currency}-${index}`}
                    className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-slate-500">
                        #{index + 1}
                      </p>

                      {getItemId(price) ? (
                        <p className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          ID
                        </p>
                      ) : null}
                    </div>

                    <p className="mt-1 text-sm font-black text-white">
                      {formatPrice(price)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-5 text-center">
                <p className="text-sm font-semibold text-slate-300">
                  현재 표시할 가격 데이터가 없습니다.
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  검색조건에 맞는 매물이 없거나 가격 정보가 비어 있을 수 있습니다.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}