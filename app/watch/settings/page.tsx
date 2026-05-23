'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

function getPermissionText(permission: NotificationPermissionState) {
  if (permission === 'granted') {
    return '알림 허용됨';
  }

  if (permission === 'denied') {
    return '알림 차단됨';
  }

  if (permission === 'unsupported') {
    return '알림 미지원';
  }

  return '알림 미설정';
}

function getPermissionDescription(permission: NotificationPermissionState) {
  if (permission === 'granted') {
    return '현재 브라우저에서 POE2 SEARCH RADAR 알림을 받을 수 있습니다.';
  }

  if (permission === 'denied') {
    return '브라우저에서 알림이 차단되어 있습니다. 주소창 왼쪽 사이트 설정에서 알림 권한을 다시 허용해야 합니다.';
  }

  if (permission === 'unsupported') {
    return '현재 브라우저에서는 웹 알림 기능을 사용할 수 없습니다.';
  }

  return '알림을 받으려면 아래 버튼으로 브라우저 알림 권한을 허용해야 합니다.';
}

export default function WatchSettingsPage() {
  const [permission, setPermission] =
    useState<NotificationPermissionState>('default');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!('Notification' in window)) {
      setPermission('unsupported');
      return;
    }

    setPermission(Notification.permission as NotificationPermissionState);
  }, []);

  const handleRequestNotification = async () => {
    if (!('Notification' in window)) {
      setPermission('unsupported');
      return;
    }

    const nextPermission = await Notification.requestPermission();
    setPermission(nextPermission as NotificationPermissionState);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-5">
        <header className="px-1">
          <Link
            href="/"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
          >
            ← 메인으로 돌아가기
          </Link>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 md:p-6">
          <p className="text-xs font-black tracking-[0.3em] text-emerald-400">
            NOTIFICATION SETTINGS
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-white md:text-5xl">
            알림 설정
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
            1차 버전은 로그인과 Firebase 없이 작동합니다. 감시는 사용자가 웹을
            실행 중일 때 브라우저에서 진행되며, 조건이 달성되면 브라우저 알림을
            표시합니다.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">
                현재 알림 권한
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                {getPermissionText(permission)}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {getPermissionDescription(permission)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRequestNotification}
              disabled={permission === 'granted' || permission === 'unsupported'}
              className="rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              알림 권한 허용
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-500/20 bg-slate-900 p-5">
            <p className="text-xs font-black text-emerald-400">
              PC CHROME
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              가장 안정적
            </h2>

            <div className="mt-4 flex flex-col gap-3 text-sm leading-6 text-slate-400">
              <p>
                PC 크롬에서는 웹을 켜둔 상태의 감시와 알림이 가장 안정적으로
                작동합니다.
              </p>

              <p>
                크롬 탭이 살아 있고, PC가 절전모드에 들어가지 않으면 10분 간격
                감시가 정상적으로 진행됩니다.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
              <p className="text-sm font-bold text-emerald-300">
                1차 추천 환경
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-500/20 bg-slate-900 p-5">
            <p className="text-xs font-black text-amber-300">
              ANDROID CHROME
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              실행 중 알림
            </h2>

            <div className="mt-4 flex flex-col gap-3 text-sm leading-6 text-slate-400">
              <p>
                안드로이드 크롬에서도 웹을 실행 중이면 감시와 알림을 사용할 수
                있습니다.
              </p>

              <p>
                다만 화면이 꺼지거나 다른 앱을 오래 사용하면 브라우저가 감시를
                늦추거나 멈출 수 있습니다.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
              <p className="text-sm font-bold text-amber-300">
                백그라운드 알림은 추후 지원
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-xs font-black text-slate-400">
              IPHONE SAFARI
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              1차 제한
            </h2>

            <div className="mt-4 flex flex-col gap-3 text-sm leading-6 text-slate-400">
              <p>
                아이폰은 웹 알림 조건이 까다롭기 때문에 1차 버전에서는 제한될 수
                있습니다.
              </p>

              <p>
                우선 PC 크롬과 안드로이드 크롬 기준으로 기능을 안정화한 뒤,
                추후 지원 여부를 검토합니다.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              <p className="text-sm font-bold text-slate-300">
                1차 우선 지원 아님
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="text-xl font-black text-white">
            1차 감시 기준
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-xs text-slate-500">
                감시 간격
              </p>

              <p className="mt-1 text-sm font-bold text-slate-200">
                10분마다 자동 감시
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-xs text-slate-500">
                감시 슬롯
              </p>

              <p className="mt-1 text-sm font-bold text-slate-200">
                최대 4개
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-xs text-slate-500">
                신규 등록
              </p>

              <p className="mt-1 text-sm font-bold text-slate-200">
                하루 2개까지
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-xs text-slate-500">
                저장 방식
              </p>

              <p className="mt-1 text-sm font-bold text-slate-200">
                현재 브라우저에 저장
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="text-xl font-black text-white">
            알림 제한 기준
          </h2>

          <div className="mt-4 flex flex-col gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-sm font-bold text-slate-200">
                신규 매물 감지 또는 최저가 하락 시 알림
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                가격 상승, 가격 동일, 조회 실패는 알림으로 보내지 않습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-sm font-bold text-slate-200">
                슬롯별 조건 달성 시 1회 알림
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                한 번 알림이 울린 슬롯은 잠김 상태가 되며, 사용자가 알림을
                재설정해야 다시 알림을 받을 수 있습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-sm font-bold text-slate-200">
                전체 슬롯 합산 하루 20회
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                알림 사용 횟수는 매일 00:00 기준으로 초기화됩니다.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
          <p className="text-sm font-black text-amber-300">
            1차 버전 안내
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-100/80">
            이 버전은 웹을 실행 중인 상태에서 사용하는 감시툴입니다. 웹을 완전히
            닫아도 오는 백그라운드 푸시 알림은 추후 Firebase 또는 별도 푸시 서버
            구조로 지원할 예정입니다.
          </p>
        </section>
      </div>
    </main>
  );
}