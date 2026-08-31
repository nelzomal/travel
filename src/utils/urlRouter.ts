import { ActiveTab } from '../components/Navbar';

export interface RouteState {
  tab: ActiveTab;
  dayIndex?: number;
  siteId?: string;
  isPrintOpen?: boolean;
}

export const parseCurrentUrl = (): Partial<RouteState> => {
  try {
    const hash = window.location.hash; // e.g. "#/sites?site=site-123" or "#sites"
    const search = window.location.search; // e.g. "?tab=sites&site=site-123"

    let tabStr = '';
    let params = new URLSearchParams();

    if (hash.startsWith('#/')) {
      const [pathPart, queryPart] = hash.slice(2).split('?');
      tabStr = pathPart;
      if (queryPart) {
        params = new URLSearchParams(queryPart);
      }
    } else if (hash.startsWith('#')) {
      const [pathPart, queryPart] = hash.slice(1).split('?');
      tabStr = pathPart;
      if (queryPart) {
        params = new URLSearchParams(queryPart);
      }
    }

    // Also fallback to search params if present
    if (search && !params.toString()) {
      params = new URLSearchParams(search);
      if (!tabStr && params.get('tab')) {
        tabStr = params.get('tab') || '';
      }
    }

    const state: Partial<RouteState> = {};

    if (tabStr === 'sites' || tabStr === 'attractions') state.tab = 'sites';
    else if (tabStr === 'itinerary' || tabStr === 'schedule' || tabStr === 'daily') state.tab = 'itinerary';
    else if (tabStr === 'checklist' || tabStr === 'packing') state.tab = 'checklist';
    else if (tabStr === 'map_plan' || tabStr === 'plan' || tabStr === 'map') state.tab = 'map_plan';

    if (params.has('day')) {
      const d = parseInt(params.get('day') || '1', 10);
      if (!isNaN(d) && d >= 1) {
        state.dayIndex = d - 1;
      }
    }

    if (params.has('site')) {
      state.siteId = params.get('site') || undefined;
    }

    if (params.has('print') && params.get('print') === 'true') {
      state.isPrintOpen = true;
    }

    return state;
  } catch (e) {
    console.error('Error parsing URL route:', e);
    return {};
  }
};

export const updateUrlRoute = (state: RouteState, push = false) => {
  try {
    const tabMap: Record<ActiveTab, string> = {
      map_plan: 'plan',
      sites: 'sites',
      itinerary: 'itinerary',
      checklist: 'checklist'
    };

    const tabPath = tabMap[state.tab] || 'plan';
    const params = new URLSearchParams();

    if (state.tab === 'itinerary' && typeof state.dayIndex === 'number' && state.dayIndex >= 0) {
      params.set('day', String(state.dayIndex + 1));
    }

    if (state.siteId) {
      params.set('site', state.siteId);
    }

    if (state.isPrintOpen) {
      params.set('print', 'true');
    }

    const queryString = params.toString();
    const newHash = `#/${tabPath}${queryString ? `?${queryString}` : ''}`;

    if (window.location.hash !== newHash) {
      if (push) {
        window.history.pushState(null, '', newHash);
      } else {
        window.history.replaceState(null, '', newHash);
      }
    }
  } catch (e) {
    console.error('Error updating URL route:', e);
  }
};
