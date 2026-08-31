import React from 'react';
import { Search, Baby, HeartHandshake, Umbrella, Footprints, ArrowUpDown, MapPin, Calendar } from 'lucide-react';

export type SortOption = 'itinerary_day' | 'city' | 'kid' | 'elderly' | 'stroller' | 'default';

export interface SiteFilters {
  searchQuery: string;
  category: string;
  city: string;
  sortBy: SortOption;
  minStrollerRating: number;
  minKidRating: number;
  minElderlyRating: number;
  indoorOnly: boolean;
  easyWalkOnly: boolean;
}

interface SiteFilterBarProps {
  filters: SiteFilters;
  onChange: (newFilters: SiteFilters) => void;
  totalSites: number;
  filteredCount: number;
}

export const SiteFilterBar: React.FC<SiteFilterBarProps> = ({
  filters,
  onChange,
  totalSites,
  filteredCount
}) => {
  const categories: Array<{ id: string; label: string; icon: string }> = [
    { id: 'all', label: '全部类型', icon: '✨' },
    { id: 'attraction', label: '地标与乐园', icon: '🎡' },
    { id: 'temple', label: '神社寺庙', icon: '⛩️' },
    { id: 'park', label: '公园与动物', icon: '🐼' },
    { id: 'museum', label: '博览展馆', icon: '🏛️' },
    { id: 'nature', label: '自然漫步', icon: '🌲' },
    { id: 'relax', label: '温泉茶歇', icon: '🍵' },
  ];

  const cities = [
    { id: 'all', label: '全部城市', icon: '🗾' },
    { id: '东京', label: '东京', icon: '🗼' },
    { id: '箱根', label: '箱根', icon: '♨️' },
    { id: '富士山', label: '富士山/河口湖', icon: '🗻' },
    { id: '京都', label: '京都', icon: '⛩️' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
      
      {/* ROW 1: Search Input, Sorting Selector & Counter */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="搜索景点名称、特色、城市或避坑贴士..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-2xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Sort By Dropdown & Total Count */}
        <div className="flex items-center gap-3 self-end lg:self-center">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-2xl px-3 py-1.5 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-bold text-slate-600">排序:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as SortOption })}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="itinerary_day">📅 按行程天数 (Day 1 → Day 9)</option>
              <option value="city">🏙️ 按所在城市 (东京/箱根/富士山/京都)</option>
              <option value="kid">🧒 4岁幼童喜爱 (高到低)</option>
              <option value="elderly">🧓 长辈体力舒适 (高到低)</option>
              <option value="stroller">🚼 推车平缓便利 (高到低)</option>
              <option value="default">✨ 默认推荐顺序</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:block">
            展示 <span className="font-bold text-slate-800">{filteredCount}</span> / {totalSites} 景点
          </div>
        </div>

      </div>

      {/* ROW 2: City Tabs & Category Horizontal Filter */}
      <div className="space-y-2.5 pt-1">
        
        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1 flex-shrink-0">
            <MapPin className="w-3 h-3 text-slate-400" />
            城市筛选:
          </span>
          {cities.map((c) => {
            const isActive = filters.city === c.id || (c.id === 'all' && (!filters.city || filters.city === 'all'));
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange({ ...filters, city: c.id })}
                className={`flex-shrink-0 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex-shrink-0">
            分类筛选:
          </span>
          {categories.map((cat) => {
            const isActive = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChange({ ...filters, category: cat.id })}
                className={`flex-shrink-0 px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ROW 3: Multi-Gen & Family Quick Filter Badges */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
          三代同堂专选:
        </span>

        {/* Stroller friendly */}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...filters,
              minStrollerRating: filters.minStrollerRating === 4 ? 0 : 4
            })
          }
          className={`px-2.5 py-1 rounded-xl border font-medium flex items-center gap-1 transition-colors ${
            filters.minStrollerRating === 4
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>🚼</span>
          <span>推车纯平 (★4星+)</span>
        </button>

        {/* 4yo Kid Top Pick */}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...filters,
              minKidRating: filters.minKidRating === 4 ? 0 : 4
            })
          }
          className={`px-2.5 py-1 rounded-xl border font-medium flex items-center gap-1 transition-colors ${
            filters.minKidRating === 4
              ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Baby className="w-3.5 h-3.5 text-amber-700" />
          <span>4岁幼童最爱 (★4星+)</span>
        </button>

        {/* Senior Comfort */}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...filters,
              minElderlyRating: filters.minElderlyRating === 4 ? 0 : 4
            })
          }
          className={`px-2.5 py-1 rounded-xl border font-medium flex items-center gap-1 transition-colors ${
            filters.minElderlyRating === 4
              ? 'bg-indigo-100 text-indigo-800 border-indigo-300 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 text-indigo-700" />
          <span>长辈舒适慢游 (★4星+)</span>
        </button>

        {/* Indoor Rain Safe */}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...filters,
              indoorOnly: !filters.indoorOnly
            })
          }
          className={`px-2.5 py-1 rounded-xl border font-medium flex items-center gap-1 transition-colors ${
            filters.indoorOnly
              ? 'bg-sky-100 text-sky-800 border-sky-300 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Umbrella className="w-3.5 h-3.5 text-sky-700" />
          <span>室内空调/雨天优选</span>
        </button>

        {/* Easy Walk */}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...filters,
              easyWalkOnly: !filters.easyWalkOnly
            })
          }
          className={`px-2.5 py-1 rounded-xl border font-medium flex items-center gap-1 transition-colors ${
            filters.easyWalkOnly
              ? 'bg-teal-100 text-teal-800 border-teal-300 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Footprints className="w-3.5 h-3.5 text-teal-700" />
          <span>轻松短距步行 (&lt;500米)</span>
        </button>

        {/* Reset filters if any active */}
        {(filters.searchQuery ||
          filters.category !== 'all' ||
          (filters.city && filters.city !== 'all') ||
          filters.sortBy !== 'itinerary_day' ||
          filters.minStrollerRating > 0 ||
          filters.minKidRating > 0 ||
          filters.minElderlyRating > 0 ||
          filters.indoorOnly ||
          filters.easyWalkOnly) && (
          <button
            type="button"
            onClick={() =>
              onChange({
                searchQuery: '',
                category: 'all',
                city: 'all',
                sortBy: 'itinerary_day',
                minStrollerRating: 0,
                minKidRating: 0,
                minElderlyRating: 0,
                indoorOnly: false,
                easyWalkOnly: false
              })
            }
            className="text-xs text-rose-600 hover:underline font-semibold ml-auto"
          >
            重置筛选与排序
          </button>
        )}
      </div>
    </div>
  );
};
