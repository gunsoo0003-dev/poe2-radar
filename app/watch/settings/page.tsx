'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type NotificationPermissionState =
  | 'default'
  | 'granted'
  | 'denied'
  | 'unsupported';

type AlertSettings = {
  priceDropAlertEnabled: boolean;
  priceDropPercent: string;
  targetPriceAlertEnabled: boolean;
  targetPriceAmount: string;
  targetPriceCurrency: string;
};

const ALERT_SETTINGS_KEY = 'poe2-watch-alert-settings';

const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  priceDropAlertEnabled: true,
  priceDropPercent: '20',
  targetPriceAlertEnabled: false,
  targetPriceAmount: '',
  targetPriceCurrency: 'divine',
};

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

  const [alertSettings, setAlertSettings] = useState<AlertSettings>(
    DEFAULT_ALERT_SETTINGS,
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!('Notification' in window)) {
      setPermission('unsupported');
      return;
    }

    setPermission(Notification.permission as NotificationPermissionState);

    const savedSettings = localStorage.getItem(ALERT_SETTINGS_KEY);

    if (!savedSettings) {
      localStorage.setItem(
        ALERT_SETTINGS_KEY,
        JSON.stringify(DEFAULT_ALERT_SETTINGS),
      );
      return;
    }

    try {
      const parsedSettings = JSON.parse(savedSettings) as AlertSettings;

      setAlertSettings({
        ...DEFAULT_ALERT_SETTINGS,
        ...parsedSettings,
      });
    } catch {
      localStorage.setItem(
        ALERT_SETTINGS_KEY,
        JSON.stringify(DEFAULT_ALERT_SETTINGS),
      );
    }
  }, []);

  const saveAlertSettings = (nextSettings: AlertSettings) => {
    setAlertSettings(nextSettings);

    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(ALERT_SETTINGS_KEY, JSON.stringify(nextSettings));
  };

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

        <section className="rounded-3xl border border-emerald-500/20 bg-slate-900/80 p-5">
          <p className="text-xs font-black tracking-[0.28em] text-emerald-400">
            ALERT CONDITION SETTINGS
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            실전 알림 조건 설정
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            알림은 두 가지 방식으로 설정할 수 있습니다. 최저가 대비 하락률
            기준으로 받을 수도 있고, 직접 입력한 기준가격 이하 매물이 올라왔을
            때 받을 수도 있습니다.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-emerald-400">
                    CONDITION 01
                  </p>

                  <h3 className="mt-2 text-xl font-black text-white">
                    최저가 하락 감지
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    saveAlertSettings({
                      ...alertSettings,
                      priceDropAlertEnabled:
                        !alertSettings.priceDropAlertEnabled,
                    })
                  }
                  className={`rounded-full px-4 py-2 text-xs font-black transition ${
                    alertSettings.priceDropAlertEnabled
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {alertSettings.priceDropAlertEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                현재 최저가 기준으로 설정한 비율 이상 싸게 올라온 매물이
                감지되면 알림을 보냅니다.
              </p>

              <div className="mt-5">
                <label className="text-xs font-bold text-slate-500">
                  최저가 대비 하락률
                </label>

                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={alertSettings.priceDropPercent}
                    onChange={(event) =>
                      saveAlertSettings({
                        ...alertSettings,
                        priceDropPercent: event.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-400"
                    placeholder="20"
                  />

                  <span className="text-sm font-black text-slate-400">
                    %
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  예: 현재 최저가가 100 divine이고 20%로 설정하면 80 divine 이하
                  매물이 올라왔을 때 알림을 보냅니다.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-amber-300">
                    CONDITION 02
                  </p>

                  <h3 className="mt-2 text-xl font-black text-white">
                    기준가격 도달 감지
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    saveAlertSettings({
                      ...alertSettings,
                      targetPriceAlertEnabled:
                        !alertSettings.targetPriceAlertEnabled,
                    })
                  }
                  className={`rounded-full px-4 py-2 text-xs font-black transition ${
                    alertSettings.targetPriceAlertEnabled
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {alertSettings.targetPriceAlertEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                사용자가 직접 입력한 기준가격 이하의 매물이 올라오면 알림을
                보냅니다.
              </p>

              <div className="mt-5 grid grid-cols-[1fr_120px] gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500">
                    기준가격
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={alertSettings.targetPriceAmount}
                    onChange={(event) =>
                      saveAlertSettings({
                        ...alertSettings,
                        targetPriceAmount: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-white outline-none focus:border-amber-300"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500">
                    화폐
                  </label>

                  <select
                    value={alertSettings.targetPriceCurrency}
                    onChange={(event) =>
                      saveAlertSettings({
                        ...alertSettings,
                        targetPriceCurrency: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm font-bold text-white outline-none focus:border-amber-300"
                  >
                    <option value="divine">divine</option>
                    <option value="exalted">exalted</option>
                    <option value="chaos">chaos</option>
                  </select>
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                예: 기준가격을 50 divine으로 설정하면 50 divine 이하 매물이
                감지될 때 알림을 보냅니다.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-sm font-bold leading-6 text-slate-300">
              현재 설정은 이 브라우저의 localStorage에 저장됩니다. 브라우저를
              바꾸거나 데이터를 삭제하면 다시 설정해야 합니다.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="text-xl font-black text-white">
            1차 감시 기준
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-xs text-slate-500">감시 간격</p>
              <p className="mt-1 text-sm font-bold text-slate-200">
                10분마다 자동 감시
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-xs text-slate-500">감시 슬롯</p>
              <p className="mt-1 text-sm font-bold text-slate-200">
                최대 4개
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-xs text-slate-500">신규 등록</p>
              <p className="mt-1 text-sm font-bold text-slate-200">
                하루 2개까지
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-xs text-slate-500">저장 방식</p>
              <p className="mt-1 text-sm font-bold text-slate-200">
                현재 브라우저 localStorage
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="text-xl font-black text-white">
            알림 제한 기준
          </h2>

          <div className="mt-4 flex flex-col gap-3 text-sm leading-6 text-slate-400">
            <p>
              신규 매물 또는 설정한 가격 조건이 감지되면 알림을 보냅니다.
            </p>

            <p>
              한 번 알림이 울린 감시조건은 잠금 상태가 되며, 다시 알림을 받으려면
              해당 감시 카드에서 알림 재설정을 해야 합니다.
            </p>

            <p>
              전체 감시 슬롯 합산 기준으로 하루 최대 20회까지만 알림을 보냅니다.
              일일 기준은 매일 00:00에 초기화됩니다.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
          <h2 className="text-xl font-black text-amber-200">
            1차 버전 안내
          </h2>

          <p className="mt-3 text-sm leading-6 text-amber-100/80">
            이 버전은 웹을 실행 중일 때 감시가 작동합니다. 백그라운드 푸시,
            계정 동기화, 서버 저장, Firebase 알림은 추후 업데이트에서 검토합니다.
          </p>
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
      </div>
    </main>
  );
}