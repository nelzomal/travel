import { Site, Trip } from '../types/travel';
import { INITIAL_SITES } from '../data/mockSites';
import { INITIAL_TRIPS } from '../data/mockTrips';

const SITES_KEY = 'family_travel_sites_zh_v12';
const TRIPS_KEY = 'family_travel_trips_zh_v12';
const ACTIVE_TRIP_KEY = 'family_travel_active_trip_id_zh_v12';

// Automatically sync local changes to filesystem / git codebase when running in Vite dev mode
export const syncToFilesystem = async (sites?: Site[], trips?: Trip[]): Promise<{ success: boolean; message?: string }> => {
  try {
    const payloadSites = sites || getStoredSites();
    const payloadTrips = trips || getStoredTrips();
    const res = await fetch('/api/sync-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sites: payloadSites, trips: payloadTrips })
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || '已成功同步到本地代码文件与 Git' };
    }
    return { success: false, message: '同步失败，服务器返回错误' };
  } catch (e: any) {
    // Graceful fallback for static hosting
    return { success: false, message: e?.message || '静态部署环境不支持直接写入磁盘' };
  }
};

export const getStoredSites = (): Site[] => {
  try {
    const raw = localStorage.getItem(SITES_KEY);
    if (!raw) {
      localStorage.setItem(SITES_KEY, JSON.stringify(INITIAL_SITES));
      return INITIAL_SITES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading sites from storage:', e);
    return INITIAL_SITES;
  }
};

export const saveSites = (sites: Site[]) => {
  try {
    localStorage.setItem(SITES_KEY, JSON.stringify(sites));
    // Auto-sync to disk in background
    syncToFilesystem(sites, undefined);
  } catch (e) {
    console.error('Error saving sites to storage:', e);
  }
};

export const getStoredTrips = (): Trip[] => {
  try {
    const raw = localStorage.getItem(TRIPS_KEY);
    if (!raw) {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(INITIAL_TRIPS));
      return INITIAL_TRIPS;
    }
    return INITIAL_TRIPS;
  } catch (e) {
    console.error('Error loading trips from storage:', e);
    return INITIAL_TRIPS;
  }
};

export const saveTrips = (trips: Trip[]) => {
  try {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
    // Auto-sync to disk in background
    syncToFilesystem(undefined, trips);
  } catch (e) {
    console.error('Error saving trips to storage:', e);
  }
};

export const getActiveTripId = (): string => {
  try {
    const id = localStorage.getItem(ACTIVE_TRIP_KEY);
    if (id) return id;
    const trips = getStoredTrips();
    if (trips.length > 0) {
      localStorage.setItem(ACTIVE_TRIP_KEY, trips[0].id);
      return trips[0].id;
    }
    return '';
  } catch (e) {
    return '';
  }
};

export const setActiveTripId = (tripId: string) => {
  try {
    localStorage.setItem(ACTIVE_TRIP_KEY, tripId);
  } catch (e) {
    console.error('Error setting active trip id:', e);
  }
};

export const resetToDefaults = () => {
  localStorage.setItem(SITES_KEY, JSON.stringify(INITIAL_SITES));
  localStorage.setItem(TRIPS_KEY, JSON.stringify(INITIAL_TRIPS));
  if (INITIAL_TRIPS[0]) {
    localStorage.setItem(ACTIVE_TRIP_KEY, INITIAL_TRIPS[0].id);
  }
  syncToFilesystem(INITIAL_SITES, INITIAL_TRIPS);
};

export const exportDataAsJSON = () => {
  const data = {
    sites: getStoredSites(),
    trips: getStoredTrips(),
    exportedAt: new Date().toISOString(),
    version: '12.0-zh'
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `亲子三代同堂旅行规划_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importDataFromJSON = (jsonStr: string): { success: boolean; message?: string } => {
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed.sites) && Array.isArray(parsed.trips)) {
      saveSites(parsed.sites);
      saveTrips(parsed.trips);
      if (parsed.trips.length > 0) {
        setActiveTripId(parsed.trips[0].id);
      }
      syncToFilesystem(parsed.sites, parsed.trips);
      return { success: true };
    }
    return { success: false, message: '数据格式错误，未找到有效的景点或行程列表。' };
  } catch (e: any) {
    return { success: false, message: e.message || '解析 JSON 文件失败' };
  }
};
