import React, { useState, useEffect } from 'react';
import { Site, Trip, DayItinerary } from './types/travel';
import { 
  getStoredSites, saveSites, 
  getStoredTrips, saveTrips, 
  getActiveTripId, setActiveTripId, 
  resetToDefaults 
} from './services/storage';

import { Navbar, ActiveTab } from './components/Navbar';
import { TravelMap } from './components/Map/TravelMap';
import { SiteCard } from './components/Sites/SiteCard';
import { SiteDetailModal } from './components/Sites/SiteDetailModal';
import { SiteFormModal } from './components/Sites/SiteFormModal';
import { SiteFilterBar, SiteFilters } from './components/Sites/SiteFilterBar';
import { TripHeader } from './components/Itinerary/TripHeader';
import { DailyTimeline } from './components/Itinerary/DailyTimeline';
import { PackingChecklist } from './components/Itinerary/PackingChecklist';
import { PrintableView } from './components/Itinerary/PrintableView';
import { LLMResearchModal } from './components/Sites/LLMResearchModal';
import { parseCurrentUrl, updateUrlRoute } from './utils/urlRouter';
import { Plus } from 'lucide-react';

export function App() {
  const initialRoute = parseCurrentUrl();
  const [sites, setSites] = useState<Site[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripIdState] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialRoute.tab || 'map_plan');
  const [activeDayIndex, setActiveDayIndex] = useState<number>(initialRoute.dayIndex ?? 0);
  const [pendingRouteSiteId, setPendingRouteSiteId] = useState<string | undefined>(initialRoute.siteId);

  // Modals & Selections
  const [selectedSiteForDetails, setSelectedSiteForDetails] = useState<Site | null>(null);
  const [selectedSiteInitialTab, setSelectedSiteInitialTab] = useState<'overview' | 'collaboration' | 'videos' | 'family' | 'dining' | 'tips'>('overview');
  const [selectedSiteForLLM, setSelectedSiteForLLM] = useState<Site | null>(null);
  const [isLLMModalOpen, setIsLLMModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [isSiteFormOpen, setIsSiteFormOpen] = useState(false);
  const [newSiteCoords, setNewSiteCoords] = useState<[number, number] | null>(null);
  const [newSiteAddress, setNewSiteAddress] = useState<string>('');
  const [newSiteName, setNewSiteName] = useState<string>('');
  const [isPrintOpen, setIsPrintOpen] = useState(initialRoute.isPrintOpen ?? false);

  // Filters
  const [filters, setFilters] = useState<SiteFilters>({
    searchQuery: '',
    category: 'all',
    city: 'all',
    sortBy: 'itinerary_day',
    reviewStatus: 'all',
    minStrollerRating: 0,
    minKidRating: 0,
    minElderlyRating: 0,
    indoorOnly: false,
    easyWalkOnly: false
  });

  // Load from local storage
  const loadData = () => {
    const loadedSites = getStoredSites();
    const loadedTrips = getStoredTrips();
    const currentActiveId = getActiveTripId() || (loadedTrips[0]?.id ?? '');

    setSites(loadedSites);
    setTrips(loadedTrips);
    setActiveTripIdState(currentActiveId);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync initial pending route site after sites are loaded
  useEffect(() => {
    if (pendingRouteSiteId && sites.length > 0) {
      const found = sites.find((s) => s.id === pendingRouteSiteId);
      if (found) {
        setSelectedSiteForDetails(found);
        setPendingRouteSiteId(undefined);
      }
    }
  }, [sites, pendingRouteSiteId]);

  // Sync state changes to browser URL address bar
  useEffect(() => {
    updateUrlRoute({
      tab: activeTab,
      dayIndex: activeDayIndex,
      siteId: selectedSiteForDetails?.id,
      isPrintOpen
    });
  }, [activeTab, activeDayIndex, selectedSiteForDetails?.id, isPrintOpen]);

  // Handle browser Forward / Back buttons
  useEffect(() => {
    const handleUrlChange = () => {
      const route = parseCurrentUrl();
      if (route.tab) setActiveTab(route.tab);
      if (typeof route.dayIndex === 'number') setActiveDayIndex(route.dayIndex);
      if (route.isPrintOpen !== undefined) setIsPrintOpen(route.isPrintOpen);
      if (route.siteId) {
        const found = sites.find((s) => s.id === route.siteId);
        if (found) {
          setSelectedSiteForDetails(found);
        } else {
          setPendingRouteSiteId(route.siteId);
        }
      } else {
        setSelectedSiteForDetails(null);
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [sites]);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];
  const activeDay = activeTrip?.days[activeDayIndex] || activeTrip?.days[0] || null;

  // Site CRUD operations
  const handleSaveSite = (savedSite: Site) => {
    const exists = sites.some((s) => s.id === savedSite.id);
    let updated: Site[];
    if (exists) {
      updated = sites.map((s) => (s.id === savedSite.id ? savedSite : s));
    } else {
      updated = [savedSite, ...sites];
    }
    setSites(updated);
    saveSites(updated);
  };

  const handleUpdateSite = (updatedSite: Site) => {
    const updated = sites.map((s) => (s.id === updatedSite.id ? updatedSite : s));
    setSites(updated);
    saveSites(updated);
    if (selectedSiteForDetails?.id === updatedSite.id) {
      setSelectedSiteForDetails(updatedSite);
    }
  };

  const handleDeleteSite = (siteId: string) => {
    if (!confirm('确定要从景点库中移除此景点吗？')) return;
    const updated = sites.filter((s) => s.id !== siteId);
    setSites(updated);
    saveSites(updated);
  };

  const handleAddNewSiteFromMap = (coords: [number, number], address?: string, name?: string) => {
    setEditingSite(null);
    setNewSiteCoords(coords);
    setNewSiteAddress(address || '');
    setNewSiteName(name || '');
    setIsSiteFormOpen(true);
  };

  // Trip operations
  const handleUpdateTrip = (updatedTrip: Trip) => {
    const updatedTrips = trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t));
    setTrips(updatedTrips);
    saveTrips(updatedTrips);
  };

  const handleSelectTrip = (id: string) => {
    setActiveTripIdState(id);
    setActiveTripId(id);
    setActiveDayIndex(0);
  };

  const handleCreateNewTrip = () => {
    const newTripId = `trip-${Date.now()}`;
    const newTrip: Trip = {
      id: newTripId,
      title: '东京亲子慢游新规划 🗼',
      destination: '日本 东京 (Tokyo)',
      startDate: '2026-11-01',
      endDate: '2026-11-05',
      coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      summary: '为4岁宝宝与长辈定制的专属慢游行程，包含明治神宫、台场海滨及周边适老亲子景点。',
      partyMembers: [
        { id: 'm1', name: '4岁宝宝', role: '👶 4岁幼童', notes: '下午固定1.5小时午休' },
        { id: 'm2', name: '长辈/爷爷奶奶', role: '🧓 长辈/爷爷奶奶', notes: '平缓无障碍路线' },
        { id: 'm3', name: '父母领队', role: '🧑 父母/领队' }
      ],
      checklist: [
        { id: 'c1', category: '幼童用品 (4岁)', item: '轻便折叠旅行婴儿车', checked: false },
        { id: 'c2', category: '幼童用品 (4岁)', item: '消毒湿巾 & 替换衣物', checked: false },
        { id: 'c3', category: '长辈/健康保健', item: '慢病随身药盒 & 保温杯', checked: false },
        { id: 'c4', category: '长辈/健康保健', item: '轻便健步手杖', checked: false },
        { id: 'c5', category: '全家必备', item: 'Suica 西瓜卡 & 充电宝', checked: false }
      ],
      days: [
        {
          id: `day-${Date.now()}-1`,
          dayNumber: 1,
          date: '2026-11-01',
          theme: '抵达与初探：明治神宫清晨漫步',
          dailyNotes: '平缓舒缓的第一天。',
          napBreakIncluded: true,
          stops: [
            {
              id: `stop-${Date.now()}-meiji`,
              siteId: 'site-meiji-jingu',
              timeSlot: 'morning',
              startTime: '09:30',
              endTime: '11:30',
              customNotes: '原宿南参道平缓进入，树荫散步。'
            },
            {
              id: `stop-${Date.now()}-nap`,
              siteId: '',
              isRestBreak: true,
              restTitle: '酒店午休 & 爷爷奶奶品茶',
              timeSlot: 'nap_rest',
              startTime: '13:30',
              endTime: '15:30',
              customNotes: '宝宝午睡充电。'
            }
          ]
        }
      ],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    const updated = [newTrip, ...trips];
    setTrips(updated);
    saveTrips(updated);
    setActiveTripIdState(newTripId);
    setActiveTripId(newTripId);
    setActiveDayIndex(0);
  };

  // Add stop to current day from anywhere
  const handleAddSiteToActiveDay = (siteId: string) => {
    if (!activeTrip || !activeDay) return;
    const newStop = {
      id: `stop-${Date.now()}`,
      siteId,
      timeSlot: 'morning' as const,
      startTime: '10:00',
      endTime: '12:00',
      customNotes: '已从景点库快速添加。'
    };
    const updatedDay: DayItinerary = {
      ...activeDay,
      stops: [...activeDay.stops, newStop]
    };
    const updatedDays = activeTrip.days.map((d) => (d.id === activeDay.id ? updatedDay : d));
    handleUpdateTrip({
      ...activeTrip,
      days: updatedDays
    });
    alert(`已成功加入第 ${activeDay.dayNumber} 天日程！`);
  };

  const handleAddDay = () => {
    if (!activeTrip) return;
    const nextDayNum = activeTrip.days.length + 1;
    const newDay: DayItinerary = {
      id: `day-${Date.now()}-${nextDayNum}`,
      dayNumber: nextDayNum,
      date: '2026-10-18',
      theme: `第 ${nextDayNum} 天 悠闲探索`,
      dailyNotes: '无障碍友好路线。',
      napBreakIncluded: true,
      stops: [
        {
          id: `stop-${Date.now()}-nap`,
          siteId: '',
          isRestBreak: true,
          restTitle: '下午午休充电 & 长辈下午茶',
          timeSlot: 'nap_rest',
          startTime: '13:30',
          endTime: '15:30',
          customNotes: '休整充电时段。'
        }
      ]
    };
    const updatedTrip = {
      ...activeTrip,
      days: [...activeTrip.days, newDay]
    };
    handleUpdateTrip(updatedTrip);
    setActiveDayIndex(updatedTrip.days.length - 1);
  };

  const handleDeleteDay = (dayId: string) => {
    if (!activeTrip || activeTrip.days.length <= 1) return;
    if (!confirm('确定要删除这一天的全部安排吗？')) return;
    const updatedDays = activeTrip.days
      .filter((d) => d.id !== dayId)
      .map((d, idx) => ({ ...d, dayNumber: idx + 1 }));
    handleUpdateTrip({
      ...activeTrip,
      days: updatedDays
    });
    setActiveDayIndex(0);
  };

  // Pre-calculate which day each site is scheduled in the active trip
  const siteDayMap: Record<string, number> = {};
  if (activeTrip && activeTrip.days) {
    activeTrip.days.forEach((day) => {
      day.stops.forEach((stop) => {
        if (stop.siteId && !siteDayMap[stop.siteId]) {
          siteDayMap[stop.siteId] = day.dayNumber;
        }
      });
    });
  }

  // Filter logic
  const filteredSites = sites.filter((site) => {
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = site.name.toLowerCase().includes(q);
      const matchLocal = site.localName?.toLowerCase().includes(q);
      const matchDesc = site.description.toLowerCase().includes(q);
      const matchAddr = site.address.toLowerCase().includes(q);
      const matchCity = site.city.toLowerCase().includes(q);
      const matchTips = site.familyTips.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchLocal && !matchDesc && !matchAddr && !matchCity && !matchTips) {
        return false;
      }
    }

    // City Filter
    if (filters.city && filters.city !== 'all') {
      const matchCity = site.city.includes(filters.city) || site.address.includes(filters.city);
      if (!matchCity) {
        return false;
      }
    }

    // 2-Person Collaboration Review Status Filter
    if (filters.reviewStatus && filters.reviewStatus !== 'all') {
      const revs = site.reviews || [];
      const r1 = revs.find((r) => r.reviewerId === 'reviewer1');
      const r2 = revs.find((r) => r.reviewerId === 'reviewer2');

      if (filters.reviewStatus === 'both_must_go') {
        if (!(r1?.preference === 'must_go' && r2?.preference === 'must_go')) return false;
      } else if (filters.reviewStatus === 'both_rated') {
        if (!(r1 && r2)) return false;
      } else if (filters.reviewStatus === 'pending_partner') {
        if (revs.length !== 1) return false;
      } else if (filters.reviewStatus === 'conflicted') {
        const isConflicted = (r1?.preference === 'must_go' && r2?.preference === 'skip') ||
                             (r1?.preference === 'skip' && r2?.preference === 'must_go');
        if (!isConflicted) return false;
      }
    }

    if (filters.category !== 'all' && site.category !== filters.category) {
      return false;
    }

    if (filters.minStrollerRating > 0 && site.strollerRating < filters.minStrollerRating) {
      return false;
    }

    if (filters.minKidRating > 0 && site.kidRating < filters.minKidRating) {
      return false;
    }

    if (filters.minElderlyRating > 0 && site.elderlyRating < filters.minElderlyRating) {
      return false;
    }

    if (filters.indoorOnly && !site.weatherSuitability.includes('室内')) {
      return false;
    }

    if (filters.easyWalkOnly && !site.walkingIntensity.includes('轻松')) {
      return false;
    }

    return true;
  });

  // Sorting logic (by itinerary day, collaboration score, city, multi-gen rating, default)
  const sortedSites = [...filteredSites].sort((a, b) => {
    if (filters.sortBy === 'itinerary_day') {
      const dayA = siteDayMap[a.id] ?? 999;
      const dayB = siteDayMap[b.id] ?? 999;
      if (dayA !== dayB) return dayA - dayB;
      return a.name.localeCompare(b.name, 'zh-CN');
    }
    if (filters.sortBy === 'collaboration_score') {
      const getScore = (s: Site) => {
        const revs = s.reviews || [];
        if (revs.length >= 2) return (revs[0].overallRating + revs[1].overallRating) / 2;
        if (revs.length === 1) return revs[0].overallRating;
        return (s.kidRating + s.elderlyRating + s.strollerRating) / 3;
      };
      return getScore(b) - getScore(a);
    }
    if (filters.sortBy === 'city') {
      const getCityRank = (site: Site) => {
        if (site.city.includes('大连')) return 1;
        if (site.city.includes('东京')) return 2;
        if (site.city.includes('箱根') || site.address.includes('箱根')) return 3;
        if (site.city.includes('富士山') || site.city.includes('河口湖') || site.city.includes('山梨')) return 4;
        if (site.city.includes('京都')) return 5;
        return 6;
      };
      const rankA = getCityRank(a);
      const rankB = getCityRank(b);
      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name, 'zh-CN');
    }
    if (filters.sortBy === 'kid') {
      return b.kidRating - a.kidRating || b.strollerRating - a.strollerRating;
    }
    if (filters.sortBy === 'elderly') {
      return b.elderlyRating - a.elderlyRating || b.strollerRating - a.strollerRating;
    }
    if (filters.sortBy === 'stroller') {
      return b.strollerRating - a.strollerRating || b.elderlyRating - a.elderlyRating;
    }
    return 0; // default
  });

  if (!activeTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="p-8 bg-white rounded-3xl shadow-xl text-center space-y-3">
          <h2 className="text-lg font-bold text-slate-800">正在加载三代同堂旅行规划助手...</h2>
          <button
            type="button"
            onClick={() => {
              resetToDefaults();
              loadData();
            }}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
          >
            重置并加载推荐数据
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        trips={trips}
        activeTrip={activeTrip}
        onSelectTrip={handleSelectTrip}
        onCreateNewTrip={handleCreateNewTrip}
        onAddNewSite={() => {
          setEditingSite(null);
          setNewSiteCoords(null);
          setNewSiteAddress('');
          setNewSiteName('');
          setIsSiteFormOpen(true);
        }}
        onOpenPrintView={() => setIsPrintOpen(true)}
        onResetDefaults={() => {
          resetToDefaults();
          loadData();
        }}
        onDataImported={loadData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* VIEW 1: MAP & PLAN (Interactive Split Screen) */}
        {activeTab === 'map_plan' && (
          <div className="space-y-6">
            
            {/* Top Quick Tip Banner */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md text-2xl">
                  👶 🧓
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-snug">
                    {activeTrip.title} • 第 {activeDay?.dayNumber || 1} 天 地图动线与日程
                  </h3>
                  <p className="text-xs text-indigo-100 mt-0.5">
                    点击地图地标查看无障碍与亲子详情，或直接点击地图任意处新建景点。虚线自动连接当日打卡动线。
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('itinerary')}
                  className="px-3.5 py-1.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  查看完整排期 ➔
                </button>
              </div>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left: Interactive Leaflet Map (7 cols) */}
              <div className="lg:col-span-7 h-[580px] lg:h-[720px] sticky top-20">
                <TravelMap
                  sites={sites}
                  selectedSiteId={selectedSiteForDetails?.id || null}
                  activeDay={activeDay}
                  onSelectSite={(site) => setSelectedSiteForDetails(site)}
                  onAddNewSiteAtCoords={handleAddNewSiteFromMap}
                  onAddSiteToDay={handleAddSiteToActiveDay}
                />
              </div>

              {/* Right: Daily Schedule & Sites Quick Picker (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Active Day Timeline Preview */}
                <DailyTimeline
                  days={activeTrip.days}
                  activeDayIndex={activeDayIndex}
                  sites={sites}
                  onSelectDayIndex={setActiveDayIndex}
                  onUpdateDay={(updatedDay) => {
                    const updatedDays = activeTrip.days.map((d) =>
                      d.id === updatedDay.id ? updatedDay : d
                    );
                    handleUpdateTrip({ ...activeTrip, days: updatedDays });
                  }}
                  onAddDay={handleAddDay}
                  onDeleteDay={handleDeleteDay}
                  onSelectSiteDetails={(site) => setSelectedSiteForDetails(site)}
                />

                {/* Quick Add from Library Section */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      已收藏景点 ({sites.length} 处)
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('sites')}
                      className="text-xs text-indigo-600 hover:underline font-bold"
                    >
                      进入景点库 ➔
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {sites.slice(0, 5).map((site) => (
                      <div
                        key={site.id}
                        className="p-3 bg-slate-50/80 hover:bg-indigo-50/50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <img
                            src={site.coverImage}
                            alt={site.name}
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{site.name}</h5>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{site.city}</p>
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              🚼 {site.strollerRating}/5 • 🧒 {site.kidRating}/5 • 🧓 {site.elderlyRating}/5
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedSiteForDetails(site)}
                            className="px-2.5 py-1 bg-white text-slate-700 hover:text-indigo-600 rounded-lg text-xs font-bold border border-slate-200 shadow-2xs"
                          >
                            详情
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddSiteToActiveDay(site.id)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                            title="加入当日日程"
                          >
                            + 加日程
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: ALL SITES LIBRARY (Full Cards & Filters) */}
        {activeTab === 'sites' && (
          <div className="space-y-6">
            
            {/* Header & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  三代同堂旅行景点库
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  全方位评估推车无障碍、4岁幼童趣味度、长辈绿荫休息座椅等关键指标，随时增删改查。
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingSite(null);
                  setNewSiteCoords(null);
                  setNewSiteAddress('');
                  setNewSiteName('');
                  setIsSiteFormOpen(true);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all self-start sm:self-center"
              >
                <Plus className="w-4 h-4" />
                <span>新增景点</span>
              </button>
            </div>

            {/* Filter Bar */}
            <SiteFilterBar
              filters={filters}
              onChange={setFilters}
              totalSites={sites.length}
              filteredCount={sortedSites.length}
            />

            {/* Sites Grid */}
            {sortedSites.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto text-xl">
                  🔍
                </div>
                <p className="text-sm font-bold text-slate-800">未找到符合当前筛选条件的景点</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  请尝试清除部分筛选标签或关键词，以查看全部已收录的景点。
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      searchQuery: '',
                      category: 'all',
                      city: 'all',
                      sortBy: 'itinerary_day',
                      reviewStatus: 'all',
                      minStrollerRating: 0,
                      minKidRating: 0,
                      minElderlyRating: 0,
                      indoorOnly: false,
                      easyWalkOnly: false
                    })
                  }
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl text-xs"
                >
                  重置全部筛选与排序
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedSites.map((site) => (
                  <SiteCard
                    key={site.id}
                    site={site}
                    isSelected={selectedSiteForDetails?.id === site.id}
                    itineraryDayBadge={siteDayMap[site.id] ? `Day ${siteDayMap[site.id]}` : undefined}
                    onSelect={(s, tab) => {
                      setSelectedSiteForDetails(s);
                      setSelectedSiteInitialTab(tab || 'overview');
                    }}
                    onEdit={(s) => {
                      setEditingSite(s);
                      setIsSiteFormOpen(true);
                    }}
                    onDelete={handleDeleteSite}
                    onAddToDay={handleAddSiteToActiveDay}
                    onOpenLLMResearch={(s) => {
                      setSelectedSiteForLLM(s);
                      setIsLLMModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* VIEW 3: ITINERARY & DAILY SCHEDULE */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            
            {/* Trip Header & Multi-Gen Party Roster */}
            <TripHeader
              trip={activeTrip}
              onUpdateTrip={handleUpdateTrip}
            />

            {/* Daily Schedule Timeline */}
            <DailyTimeline
              days={activeTrip.days}
              activeDayIndex={activeDayIndex}
              sites={sites}
              onSelectDayIndex={setActiveDayIndex}
              onUpdateDay={(updatedDay) => {
                const updatedDays = activeTrip.days.map((d) =>
                  d.id === updatedDay.id ? updatedDay : d
                );
                handleUpdateTrip({ ...activeTrip, days: updatedDays });
              }}
              onAddDay={handleAddDay}
              onDeleteDay={handleDeleteDay}
              onSelectSiteDetails={(site) => {
                setSelectedSiteForDetails(site);
                setSelectedSiteInitialTab('overview');
              }}
            />

          </div>
        )}

        {/* VIEW 4: PACKING & CARE CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <PackingChecklist
              checklist={activeTrip.checklist}
              onUpdateChecklist={(newChecklist) => {
                handleUpdateTrip({
                  ...activeTrip,
                  checklist: newChecklist
                });
              }}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">FamilyTrip 亲子游 🧭 三代同堂舒适慢游规划伴侣</p>
        <p className="mt-1 text-slate-400">
          专为 4岁幼童 × 爷爷奶奶 慢节奏和睦出行设计，智能午休保护与全无障碍路线保障。
        </p>
      </footer>

      {/* MODAL: Site Detail Viewer */}
      <SiteDetailModal
        site={selectedSiteForDetails}
        initialTab={selectedSiteInitialTab}
        onClose={() => setSelectedSiteForDetails(null)}
        onUpdateSite={handleUpdateSite}
        onEdit={(s) => {
          setSelectedSiteForDetails(null);
          setEditingSite(s);
          setIsSiteFormOpen(true);
        }}
        onAddToDay={handleAddSiteToActiveDay}
        onOpenLLMResearch={(s) => {
          setSelectedSiteForLLM(s);
          setIsLLMModalOpen(true);
        }}
      />

      {/* MODAL: Add / Edit Site Form */}
      <SiteFormModal
        isOpen={isSiteFormOpen}
        initialSite={editingSite}
        initialCoords={newSiteCoords}
        initialAddress={newSiteAddress}
        initialName={newSiteName}
        onClose={() => setIsSiteFormOpen(false)}
        onSave={handleSaveSite}
      />

      {/* MODAL: LLM Research & Auto-Update Modal */}
      <LLMResearchModal
        site={selectedSiteForLLM}
        isOpen={isLLMModalOpen}
        onClose={() => {
          setIsLLMModalOpen(false);
          setSelectedSiteForLLM(null);
        }}
        onUpdateSite={(updated) => {
          handleSaveSite(updated);
          if (selectedSiteForDetails && selectedSiteForDetails.id === updated.id) {
            setSelectedSiteForDetails(updated);
          }
        }}
      />

      {/* MODAL: Printable & PDF View */}
      {isPrintOpen && (
        <PrintableView
          trip={activeTrip}
          sites={sites}
          onClose={() => setIsPrintOpen(false)}
        />
      )}

    </div>
  );
}

export default App;
