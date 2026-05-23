'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import WatchRegisterCard from '../../../components/WatchRegisterCard';
import { deleteWatchSnapshot } from '../../../services/watchSnapshotService';
import { WatchCondition } from '../../../types/watch';

const WATCH_STORAGE_KEY = 'poe2-watch-conditions';
const WATCH_DAILY_LIMIT_KEY = 'poe2-watch-daily-register-limit';

const MAX_WATCH_SLOT_COUNT = 4;
const DAILY_REGISTER_LIMIT = 2;

type DailyRegisterLimit = {
  dateKey: string;
  count: number;
};

function getTodayKey() {
  const now = new Date();

  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const date = now.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${date}`;
}

function loadWatchConditions() {
  const savedConditions = localStorage.getItem(WATCH_STORAGE_KEY);

  if (!savedConditions) {
    return [];
  }

  try {
    return JSON.parse(savedConditions) as WatchCondition[];
  } catch {
    localStorage.removeItem(WATCH_STORAGE_KEY);
    return [];
  }
}

function loadDailyRegisterLimit(): DailyRegisterLimit {
  const todayKey = getTodayKey();
  const savedLimit = localStorage.getItem(WATCH_DAILY_LIMIT_KEY);

  if (!savedLimit) {
    return {
      dateKey: todayKey,
      count: 0,
    };
  }

  try {
    const parsedLimit = JSON.parse(savedLimit) as DailyRegisterLimit;

    if (parsedLimit.dateKey !== todayKey) {
      return {
        dateKey: todayKey,
        count: 0,
      };
    }

    return parsedLimit;
  } catch {
    localStorage.removeItem(WATCH_DAILY_LIMIT_KEY);

    return {
      dateKey: todayKey,
      count: 0,
    };
  }
}

function applyFifoSlotLimit(conditions: WatchCondition[]) {
  if (conditions.length <= MAX_WATCH_SLOT_COUNT) {
    return {
      nextConditions: conditions,
      removedConditions: [],
    };
  }

  const removeCount = conditions.length - MAX_WATCH_SLOT_COUNT;
  const removedConditions = conditions.slice(0, removeCount);
  const nextConditions = conditions.slice(removeCount);

  return {
    nextConditions,
    removedConditions,
  };
}

export default function WatchCreatePage() {
  const router = useRouter();
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    const savedConditions = loadWatchConditions();
    setCurrentCount(savedConditions.length);
  }, []);

  const handleAddCondition = (condition: WatchCondition) => {
    const dailyLimit = loadDailyRegisterLimit();

    if (dailyLimit.count >= DAILY_REGISTER_LIMIT) {
      alert('하루 신규 등록은 2개까지만 가능합니다.');
      return;
    }

    const savedConditions = loadWatchConditions();
    const addedConditions = [...savedConditions, condition];

    const { nextConditions, removedConditions } =
      applyFifoSlotLimit(addedConditions);

    removedConditions.forEach((removedCondition) => {
      deleteWatchSnapshot(removedCondition.id);
    });

    localStorage.setItem(
      WATCH_STORAGE_KEY,
      JSON.stringify(nextConditions),
    );

    localStorage.setItem(
      WATCH_DAILY_LIMIT_KEY,
      JSON.stringify({
        dateKey: dailyLimit.dateKey,
        count: dailyLimit.count + 1,
      }),
    );

    setCurrentCount(nextConditions.length);
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-5">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <Link
            href="/"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
          >
            ← 메인으로 돌아가기
          </Link>

          <h1 className="mt-4 text-2xl font-bold">
            검색조건 등록
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            공식 거래소 검색 URL을 등록하면 감시 슬롯에 저장됩니다.
            최대 4개까지 유지되며, 슬롯이 가득 차면 가장 오래된 조건이
            자동으로 교체됩니다.
          </p>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-xs font-bold text-slate-500">
              현재 감시 슬롯
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-200">
              {currentCount} / {MAX_WATCH_SLOT_COUNT}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              하루 신규 등록은 2개까지 가능하며, 4개를 초과하면 가장 오래된
              조건이 자동으로 제거됩니다.
            </p>
          </div>
        </section>

        <WatchRegisterCard
          currentCount={currentCount}
          onAddCondition={handleAddCondition}
        />
      </div>
    </main>
  );
}