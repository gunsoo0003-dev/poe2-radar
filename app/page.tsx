'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import WatchConditionCard from '../components/WatchConditionCard';
import { deleteWatchSnapshot } from '../services/watchSnapshotService';
import { WatchCondition } from '../types/watch';

const WATCH_STORAGE_KEY = 'poe2-watch-conditions';
const WATCH_DAILY_LIMIT_KEY = 'poe2-watch-daily-register-limit';
const MAX_WATCH_SLOT_COUNT = 4;
const SHOW_DEV_CLEAR_BUTTON = false;
const SHOW_AD_SECTION = false;

export default function HomePage() {
  const [watchConditions, setWatchConditions] = useState<WatchCondition[]>([]);

  useEffect(() => {
    const savedConditions = localStorage.getItem(WATCH_STORAGE_KEY);

    if (!savedConditions) {
      return;
    }

    try {
      const parsedConditions = JSON.parse(savedConditions) as WatchCondition[];
      setWatchConditions(parsedConditions);
    } catch {
      localStorage.removeItem(WATCH_STORAGE_KEY);
    }
  }, []);

  const handleClearDevStorage = () => {
    const confirmed = window.confirm(
      '개발용 초기화를 진행할까요? 등록된 감시조건, 하루 등록 제한, 감시 snapshot이 모두 삭제됩니다.',
    );

    if (!confirmed) {
      return;
    }

    watchConditions.forEach((condition) => {
      deleteWatchSnapshot(condition.id);
    });

    localStorage.removeItem(WATCH_STORAGE_KEY);
    localStorage.removeItem(WATCH_DAILY_LIMIT_KEY);

    setWatchConditions([]);
  };

  const emptySlotCount = MAX_WATCH_SLOT_COUNT - watchConditions.length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070c] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute right-[-160px] top-[280px] h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-[-220px] left-[-120px] h-[480px] w-[480px] rounded-full bg-orange-700/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 md:gap-6 md:py-6">
        <header className="relative overflow-hidden rounded-[2rem] border border-amber-500/20 bg-slate-950/90 shadow-2xl shadow-black/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_36%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.98))]" />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />
          <div className="absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

          <div className="relative grid grid-cols-1 gap-6 px-5 py-6 md:grid-cols-[1.25fr_0.75fr] md:px-7 md:py-8">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-amber-300 to-transparent" />
                <p className="text-[11px] font-black tracking-[0.36em] text-amber-300/90">
                  TRADE WATCH
                </p>
              </div>

              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-amber-100 drop-shadow-[0_2px_0_rgba(0,0,0,0.9)] md:text-6xl">
                POE2
                <br />
                SEARCH RADAR
              </h1>

              <p className="mt-3 text-xs font-black uppercase tracking-[0.32em] text-emerald-400 md:text-sm">
                Official Trade Condition Monitor
              </p>

              <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-slate-200 md:text-base">
                공식 거래소 검색 URL을 등록하고, 신규 매물과 최저가 변화를
                감시하는 POE2 거래소 검색조건 레이더입니다.
              </p>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Track your Path of Exile 2 official trade search URL, detect new
                listings, and monitor lowest price changes while the web app is
                running.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  href="/watch/create"
                  className="group rounded-2xl border border-emerald-300/30 bg-emerald-400 px-5 py-4 text-center text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-300"
                >
                  검색조건 등록
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/watch/settings"
                  className="rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-center text-sm font-black text-slate-100 transition hover:-translate-y-0.5 hover:border-amber-300/40 hover:bg-slate-800"
                >
                  알림 설정
                </Link>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-slate-800/90 bg-slate-950/70 p-4 shadow-2xl shadow-black/20">
              <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-300">
                  Current Setup
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-2xl font-black text-white">
                      {watchConditions.length}
                      <span className="text-sm text-slate-500">/4</span>
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      등록 슬롯
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-2xl font-black text-emerald-300">10m</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      자동 감시
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-2xl font-black text-amber-300">2</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      하루 등록
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-2xl font-black text-sky-300">20</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      일일 알림
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
                  <p className="text-xs font-bold leading-5 text-emerald-200">
                    신규 매물 또는 최저가 하락이 감지되면 브라우저 알림을
                    보냅니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-5 shadow-2xl shadow-black/20 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">
                Step 01
              </p>
              <h2 className="mt-3 text-lg font-black text-white">
                거래소 URL 등록
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                공식 거래소에서 만든 검색 결과 URL을 그대로 붙여넣습니다.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">
                Step 02
              </p>
              <h2 className="mt-3 text-lg font-black text-white">
                10분 자동 감시
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                웹이 실행 중인 동안 검색조건을 주기적으로 다시 확인합니다.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-300">
                Step 03
              </p>
              <h2 className="mt-3 text-lg font-black text-white">
                변화 감지 알림
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                신규 매물과 최저가 하락이 감지되면 브라우저 알림을 보냅니다.
              </p>
            </div>
          </div>
        </section>

        {SHOW_AD_SECTION ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4 shadow-xl shadow-black/20">
            <div className="flex min-h-[100px] items-center justify-center rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/50 px-4 text-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-600">
                  Advertisement
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  애드센스 광고 영역
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="flex flex-col gap-4">
          <div className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
                  My Watch Slots
                </p>

                <h2 className="mt-3 text-2xl font-black text-white">
                  내 감시 슬롯
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  최대 4개까지 등록됩니다. 하루 신규 등록은 2개까지 가능하며,
                  슬롯이 가득 차면 가장 오래된 감시조건이 자동으로 교체됩니다.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <p className="text-xs font-black text-slate-300">
                  {watchConditions.length}개 감시중 · {emptySlotCount}개 대기
                </p>
              </div>

              {SHOW_DEV_CLEAR_BUTTON ? (
                <button
                  type="button"
                  onClick={handleClearDevStorage}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300 transition hover:bg-red-500/20"
                >
                  개발용 전체 초기화
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {watchConditions.map((condition) => (
              <WatchConditionCard key={condition.id} condition={condition} />
            ))}

            {Array.from({ length: emptySlotCount }).map((_, index) => (
              <div
                key={`empty-slot-${index}`}
                className="group relative overflow-hidden rounded-[1.8rem] border border-dashed border-slate-700/80 bg-slate-950/60 p-5 transition hover:border-emerald-400/40 hover:bg-slate-900/70"
              >
                <div className="absolute right-[-40px] top-[-40px] h-28 w-28 rounded-full bg-emerald-400/5 blur-2xl transition group-hover:bg-emerald-400/10" />

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      Empty Watch Slot
                    </p>

                    <h3 className="mt-3 text-xl font-black text-slate-200">
                      감시 슬롯 {watchConditions.length + index + 1}
                    </h3>
                  </div>

                  <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-black text-slate-500">
                    대기중
                  </div>
                </div>

                <p className="relative mt-4 text-sm leading-6 text-slate-500">
                  공식 거래소 검색 URL을 등록하면 이 슬롯에 감시 카드가
                  표시됩니다.
                </p>

                <div className="relative mt-5 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                  <p className="text-xs font-black text-slate-400">
                    아직 감시조건 없음
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    상단의 검색조건 등록 버튼에서 새 감시조건을 추가할 수
                    있습니다.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-5 md:p-6">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
            POE2 Trade Monitor Tool
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            POE2 SEARCH RADAR는 어떤 도구인가요?
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 px-5 py-5">
              <h3 className="text-sm font-black text-slate-200">
                공식 거래소 검색조건 감시
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                POE2 SEARCH RADAR는 Path of Exile 2 공식 거래소 검색 URL을
                등록하고, 해당 검색조건의 신규 매물과 최저가 변화를 확인하는
                거래소 감시 도구입니다.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 px-5 py-5">
              <h3 className="text-sm font-black text-slate-200">
                POE2 official trade search monitor
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                POE2 SEARCH RADAR is a Path of Exile 2 trade search monitor
                that tracks official trade search URLs, detects new listings,
                and watches lowest price changes.
              </p>
            </div>
          </div>
        </section>

        <footer className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black text-slate-300">
                POE2 SEARCH RADAR
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Path of Exile 2 official trade search condition monitor.
              </p>
            </div>

            <nav className="flex flex-wrap gap-3 text-sm font-bold text-slate-500">
              <Link href="/guide" className="hover:text-emerald-300">
                사용법
              </Link>

              <Link href="/privacy" className="hover:text-emerald-300">
                개인정보처리방침
              </Link>

              <Link href="/terms" className="hover:text-emerald-300">
                이용약관
              </Link>

              <Link href="/contact" className="hover:text-emerald-300">
                문의
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </main>
  );
}