import { Site, Trip } from '../types/travel';
import { INITIAL_SITES } from '../data/mockSites';
import { INITIAL_TRIPS } from '../data/mockTrips';

const SITES_KEY = 'family_travel_sites_zh_v21';
const TRIPS_KEY = 'family_travel_trips_zh_v21';
const ACTIVE_TRIP_KEY = 'family_travel_active_trip_id_zh_v21';

export const isLocalEnvironment = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

// Automatically sync local changes to filesystem / git codebase when running in Vite dev mode
export const syncToFilesystem = async (
  sites?: Site[], 
  trips?: Trip[]
): Promise<{ success: boolean; isStaticHost?: boolean; message?: string }> => {
  try {
    const isLocal = isLocalEnvironment();
    if (!isLocal) {
      return { 
        success: false, 
        isStaticHost: true,
        message: '当前运行于线上静态部署环境，浏览器无法直接写入本地磁盘。已保存至当前浏览器本地存储。请点击顶部「存入Git」复制 JSON，或在本地启动开发服务。' 
      };
    }

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
    return { success: false, message: `同步写入磁盘失败 (服务器返回 HTTP ${res.status})` };
  } catch (e: any) {
    return { success: false, message: e?.message || '无法连接本地 Vite 同步服务，请确认本地开发服务器正常运行' };
  }
};

// Helper to apply fresh sites and trips to localStorage while preserving local user reviews
const applyFreshDataToStorage = (
  freshSites: Site[],
  freshTrips: Trip[],
  successMessage: string
): { success: boolean; sites: Site[]; trips: Trip[]; message: string } => {
  // Preserve user reviews & personal preferences if any exist locally
  const existingSites = getStoredSites();
  const reviewsMap = new Map<string, any>();
  existingSites.forEach((s) => {
    if (s.reviews && s.reviews.length > 0) {
      reviewsMap.set(s.id, s.reviews);
    }
  });

  const mergedSites = freshSites.map((s) => {
    if ((!s.reviews || s.reviews.length === 0) && reviewsMap.has(s.id)) {
      return { ...s, reviews: reviewsMap.get(s.id) };
    }
    return s;
  });

  localStorage.setItem(SITES_KEY, JSON.stringify(mergedSites));
  localStorage.setItem(TRIPS_KEY, JSON.stringify(freshTrips));
  const activeId = localStorage.getItem(ACTIVE_TRIP_KEY);
  if (!activeId || !freshTrips.some((t) => t.id === activeId)) {
    if (freshTrips.length > 0) {
      localStorage.setItem(ACTIVE_TRIP_KEY, freshTrips[0].id);
    }
  }

  return {
    success: true,
    sites: mergedSites,
    trips: freshTrips,
    message: successMessage
  };
};

// Synchronize from disk (data/sites.json & data/trips.json) or static host into browser LocalStorage
export const syncFromDiskToLocalStorage = async (): Promise<{
  success: boolean;
  sites?: Site[];
  trips?: Trip[];
  message: string;
}> => {
  // 1. Try local Vite dev server endpoint first
  try {
    const res = await fetch('/api/sync-data', {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' }
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.success && Array.isArray(data.sites) && Array.isArray(data.trips)) {
        return applyFreshDataToStorage(
          data.sites, 
          data.trips, 
          `已成功从本地磁盘载入 ${data.sites.length} 个景点与 ${data.trips.length} 个行程数据！`
        );
      }
    }
  } catch {
    // Continue to static endpoint
  }

  // 2. Try static /data/sites.json and /data/trips.json (works on remote Cloudflare Pages static hosting)
  try {
    const bust = `?t=${Date.now()}`;
    const [sitesRes, tripsRes] = await Promise.all([
      fetch(`/data/sites.json${bust}`, { headers: { 'Cache-Control': 'no-cache' } }),
      fetch(`/data/trips.json${bust}`, { headers: { 'Cache-Control': 'no-cache' } })
    ]);
    const sitesType = sitesRes.headers.get('content-type') || '';
    const tripsType = tripsRes.headers.get('content-type') || '';
    if (sitesRes.ok && tripsRes.ok && sitesType.includes('application/json') && tripsType.includes('application/json')) {
      const sites = await sitesRes.json();
      const trips = await tripsRes.json();
      if (Array.isArray(sites) && Array.isArray(trips)) {
        return applyFreshDataToStorage(
          sites, 
          trips, 
          `已成功从云端/代码库同步 ${sites.length} 个景点与 ${trips.length} 个行程数据！`
        );
      }
    }
  } catch {
    // Continue to bundled fallback
  }

  // 3. Fallback: Always succeed by syncing from current build's bundled INITIAL_SITES & INITIAL_TRIPS
  if (Array.isArray(INITIAL_SITES) && INITIAL_SITES.length > 0) {
    return applyFreshDataToStorage(
      INITIAL_SITES, 
      INITIAL_TRIPS, 
      `已成功恢复当前版本内置数据 (${INITIAL_SITES.length} 个景点与 ${INITIAL_TRIPS.length} 个行程)！`
    );
  }

  return {
    success: false,
    message: '从磁盘同步失败，未找到可用数据源。已保护并保留本地已有数据。'
  };
};

export const getStoredSites = (): Site[] => {
  try {
    const raw = localStorage.getItem(SITES_KEY);
    if (!raw) {
      localStorage.setItem(SITES_KEY, JSON.stringify(INITIAL_SITES));
      return INITIAL_SITES;
    }
    const sites: Site[] = JSON.parse(raw);
    let dirty = false;

    // Check if INITIAL_SITES has new sites that are not in localStorage at all!
    const storedIds = new Set(sites.map((s) => s.id));
    const missingSites = INITIAL_SITES.filter((s) => !storedIds.has(s.id));
    if (missingSites.length > 0) {
      sites.push(...missingSites);
      dirty = true;
    }

    const sanitized = sites.map((s) => {
      if ((s.name.includes('海达索道') || s.name.includes('莲花山索道')) && (s.city === '东京' || s.coordinates[0] === 35.6764)) {
        dirty = true;
        return {
          ...s,
          id: s.id.startsWith('site-dalian-') ? s.id : 'site-dalian-haida-cableway',
          city: '大连',
          tripId: 'trip-dalian-coastal-multigen-2026',
          address: '辽宁省大连市西岗区迎春路 (森林动物园南门至莲花山山顶)',
          coordinates: [38.8788, 121.6038] as [number, number]
        };
      }
      return s;
    });
    if (!sanitized.some((s) => s.name === '海达索道')) {
      const haidaInInitial = INITIAL_SITES.find((s) => s.name === '海达索道');
      if (haidaInInitial) {
        sanitized.push(haidaInInitial);
        dirty = true;
      }
    }
    if (dirty) {
      localStorage.setItem(SITES_KEY, JSON.stringify(sanitized));
    }
    return sanitized;
  } catch (e) {
    console.error('Error loading sites from storage:', e);
    return INITIAL_SITES;
  }
};

export const saveSites = async (sites: Site[]): Promise<{ success: boolean; isStaticHost?: boolean; message?: string }> => {
  try {
    localStorage.setItem(SITES_KEY, JSON.stringify(sites));
    // Auto-sync to disk in background
    return await syncToFilesystem(sites, undefined);
  } catch (e: any) {
    console.error('Error saving sites to storage:', e);
    return { success: false, message: e?.message || '保存到本地存储失败' };
  }
};

export const getStoredTrips = (): Trip[] => {
  try {
    const raw = localStorage.getItem(TRIPS_KEY);
    if (!raw) {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(INITIAL_TRIPS));
      return INITIAL_TRIPS;
    }
    const trips: Trip[] = JSON.parse(raw);
    const storedTripIds = new Set(trips.map((t) => t.id));
    const missingTrips = INITIAL_TRIPS.filter((t) => !storedTripIds.has(t.id));
    if (missingTrips.length > 0) {
      trips.push(...missingTrips);
      localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
    }
    return trips;
  } catch (e) {
    console.error('Error loading trips from storage:', e);
    return INITIAL_TRIPS;
  }
};

export const saveTrips = async (trips: Trip[]): Promise<{ success: boolean; isStaticHost?: boolean; message?: string }> => {
  try {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
    // Auto-sync to disk in background
    return await syncToFilesystem(undefined, trips);
  } catch (e: any) {
    console.error('Error saving trips to storage:', e);
    return { success: false, message: e?.message || '保存到本地存储失败' };
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

export const getExportDataJSONString = (): string => {
  const data = {
    sites: getStoredSites(),
    trips: getStoredTrips(),
    exportedAt: new Date().toISOString(),
    version: '16.0-zh'
  };
  return JSON.stringify(data, null, 2);
};

export const exportDataAsJSON = () => {
  const data = {
    sites: getStoredSites(),
    trips: getStoredTrips(),
    exportedAt: new Date().toISOString(),
    version: '16.0-zh'
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
