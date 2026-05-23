import type { SignatureMode } from './watchDetectService';

export type WatchSnapshot = {
  conditionId: string;
  previousLowestPrice: number | null;
  previousWatchSignature: string;
  lastCheckedTime: string;
  refreshCount: number;
  newItemDetectedCount: number;
  signatureMode: SignatureMode;
};

const WATCH_SNAPSHOT_STORAGE_PREFIX = 'poe2-watch-snapshot';

function getSnapshotStorageKey(conditionId: string) {
  return `${WATCH_SNAPSHOT_STORAGE_PREFIX}-${conditionId}`;
}

export function loadWatchSnapshot(conditionId: string): WatchSnapshot | null {
  const savedSnapshot = localStorage.getItem(getSnapshotStorageKey(conditionId));

  if (!savedSnapshot) {
    return null;
  }

  try {
    return JSON.parse(savedSnapshot) as WatchSnapshot;
  } catch {
    localStorage.removeItem(getSnapshotStorageKey(conditionId));
    return null;
  }
}

export function saveWatchSnapshot(snapshot: WatchSnapshot) {
  localStorage.setItem(
    getSnapshotStorageKey(snapshot.conditionId),
    JSON.stringify(snapshot),
  );
}

export function deleteWatchSnapshot(conditionId: string) {
  localStorage.removeItem(getSnapshotStorageKey(conditionId));
}