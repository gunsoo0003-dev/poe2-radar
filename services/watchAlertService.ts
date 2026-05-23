export type WatchAlertLimit = {
  dateKey: string;
  usedCount: number;
};

export type WatchAlertLock = {
  conditionId: string;
  locked: boolean;
  lockedAt: string;
  reason: string;
};

export type WatchAlertReason = 'priceDown' | 'newItem' | 'priceDownAndNewItem';

const WATCH_ALERT_LIMIT_KEY = 'poe2-watch-alert-limit';
const WATCH_ALERT_LOCK_PREFIX = 'poe2-watch-alert-lock';
const DAILY_ALERT_LIMIT = 20;

function getTodayKey() {
  const now = new Date();

  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const date = now.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${date}`;
}

function getAlertLockKey(conditionId: string) {
  return `${WATCH_ALERT_LOCK_PREFIX}-${conditionId}`;
}

export function getDailyAlertLimit() {
  return DAILY_ALERT_LIMIT;
}

export function loadAlertLimit(): WatchAlertLimit {
  const todayKey = getTodayKey();
  const savedLimit = localStorage.getItem(WATCH_ALERT_LIMIT_KEY);

  if (!savedLimit) {
    return {
      dateKey: todayKey,
      usedCount: 0,
    };
  }

  try {
    const parsedLimit = JSON.parse(savedLimit) as WatchAlertLimit;

    if (parsedLimit.dateKey !== todayKey) {
      const resetLimit = {
        dateKey: todayKey,
        usedCount: 0,
      };

      localStorage.setItem(WATCH_ALERT_LIMIT_KEY, JSON.stringify(resetLimit));

      return resetLimit;
    }

    return parsedLimit;
  } catch {
    localStorage.removeItem(WATCH_ALERT_LIMIT_KEY);

    return {
      dateKey: todayKey,
      usedCount: 0,
    };
  }
}

export function saveAlertLimit(limit: WatchAlertLimit) {
  localStorage.setItem(WATCH_ALERT_LIMIT_KEY, JSON.stringify(limit));
}

export function increaseAlertUsedCount() {
  const currentLimit = loadAlertLimit();

  const nextLimit = {
    ...currentLimit,
    usedCount: currentLimit.usedCount + 1,
  };

  saveAlertLimit(nextLimit);

  return nextLimit;
}

export function canUseAlert() {
  const currentLimit = loadAlertLimit();

  return currentLimit.usedCount < DAILY_ALERT_LIMIT;
}

export function loadAlertLock(conditionId: string): WatchAlertLock | null {
  const savedLock = localStorage.getItem(getAlertLockKey(conditionId));

  if (!savedLock) {
    return null;
  }

  try {
    return JSON.parse(savedLock) as WatchAlertLock;
  } catch {
    localStorage.removeItem(getAlertLockKey(conditionId));
    return null;
  }
}

export function isAlertLocked(conditionId: string) {
  const lock = loadAlertLock(conditionId);

  return Boolean(lock?.locked);
}

export function saveAlertLock({
  conditionId,
  reason,
}: {
  conditionId: string;
  reason: string;
}) {
  const lock: WatchAlertLock = {
    conditionId,
    locked: true,
    lockedAt: new Date().toISOString(),
    reason,
  };

  localStorage.setItem(getAlertLockKey(conditionId), JSON.stringify(lock));

  return lock;
}

export function resetAlertLock(conditionId: string) {
  localStorage.removeItem(getAlertLockKey(conditionId));
}

export function getNotificationPermissionState() {
  if (typeof window === 'undefined') {
    return 'unsupported';
  }

  if (!('Notification' in window)) {
    return 'unsupported';
  }

  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (typeof window === 'undefined') {
    return 'unsupported';
  }

  if (!('Notification' in window)) {
    return 'unsupported';
  }

  return Notification.requestPermission();
}

export function createAlertTitle(reason: WatchAlertReason) {
  if (reason === 'priceDownAndNewItem') {
    return '신규 매물 및 최저가 하락 감지';
  }

  if (reason === 'priceDown') {
    return '최저가 하락 감지';
  }

  return '신규 매물 감지';
}

export function createAlertBody({
  conditionTitle,
  priceText,
}: {
  conditionTitle: string;
  priceText: string;
}) {
  if (priceText) {
    return `${conditionTitle} · ${priceText}`;
  }

  return conditionTitle;
}

export function sendBrowserNotification({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  if (typeof window === 'undefined') {
    return false;
  }

  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  new Notification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
  });

  return true;
}