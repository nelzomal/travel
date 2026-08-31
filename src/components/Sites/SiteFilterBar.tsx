import React from 'react';
import { Search, Baby, HeartHandshake, Umbrella, Footprints } from 'lucide-react';

export interface SiteFilters {
  searchQuery: string;
  category: string;
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
    { id: 'all', label: '全部景点', icon: '✨' },
    { id: 'attraction', label: '地标与乐园', icon: '🎡' },
    { id: 'temple', label: '神社寺庙', icon: '⛩️' },
    { id: 'park', label: '公园与动物', icon: '🐼' },
    { id: 'museum', label: '博览展馆', icon: '🏛️' },
    { id: 'nature', label: '自然漫步', icon: '🌲' },
    { id: 'relax', label: '温泉茶歇', icon: '🍵' },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
      {/* Search Input & Category Pills */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="搜索景点名称、特色或避坑小贴士..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-2xl text-xs border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Counter */}
        <div className="text-xs text-slate-500 font-medium self-end md:self-center">
          当前展示 <span className="font-bold text-slate-800">{filteredCount}</span> / 共 {totalSites} 个景点
        </div>
      </div>

      {/* Category Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ ...filters, category: cat.id })}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
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

      {/* Multi-Gen & Family Quick Filter Badges */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
          三代同堂专选标签:
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
                minStrollerRating: 0,
                minKidRating: 0,
                minElderlyRating: 0,
                indoorOnly: false,
                easyWalkOnly: false
              })
            }
            className="text-xs text-rose-600 hover:underline font-semibold ml-auto"
          >
            重置所有筛选
          </button>
        )}
      </div>
    </div>
  );
};
