import React from 'react';
import { Site } from '../../types/travel';
import { 
  Footprints, Clock, Sparkles, Edit, Trash2, Plus, 
  Eye, Calendar, Video, Users, MessageSquare, Check
} from 'lucide-react';

interface SiteCardProps {
  site: Site;
  isSelected?: boolean;
  itineraryDayBadge?: string; // e.g. "Day 1", "Day 3"
  onSelect: (site: Site, initialTab?: 'overview' | 'collaboration' | 'videos' | 'family' | 'dining' | 'tips') => void;
  onEdit: (site: Site) => void;
  onDelete: (siteId: string) => void;
  onAddToDay?: (siteId: string) => void;
  onOpenLLMResearch?: (site: Site) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  isSelected,
  itineraryDayBadge,
  onSelect,
  onEdit,
  onDelete,
  onAddToDay,
  onOpenLLMResearch
}) => {
  const getCategoryText = (cat: string) => {
    switch (cat) {
      case 'attraction': return '地标乐园';
      case 'park': return '公园动物';
      case 'museum': return '博览展馆';
      case 'temple': return '神社寺庙';
      case 'nature': return '自然风景';
      case 'relax': return '温泉茶歇';
      case 'shopping': return '休闲购物';
      default: return '旅游景点';
    }
  };

  const reviews = site.reviews || [];
  const bothRated = reviews.length >= 2;
  const avgScore = bothRated 
    ? ((reviews[0].overallRating + reviews[1].overallRating) / 2).toFixed(1)
    : reviews[0]?.overallRating || null;

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${
        isSelected ? 'ring-2 ring-indigo-600 border-indigo-600 shadow-md' : 'border-slate-200/90 shadow-2xs'
      }`}
    >
      {/* Cover Image */}
      <div 
        className="relative h-44 w-full bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onSelect(site, 'overview')}
      >
        <img
          src={site.coverImage}
          alt={site.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Meiji_Jingu_2023-3.jpg/1280px-Meiji_Jingu_2023-3.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          {itineraryDayBadge && (
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/95 backdrop-blur-md text-white text-[10px] font-extrabold shadow-sm border border-indigo-400/40 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{itineraryDayBadge}</span>
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider">
            {getCategoryText(site.category)}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold">
            {site.city}
          </span>
        </div>

        {/* Gallery & Video count indicator */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          {site.videos && site.videos.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
              🎬 4K视频
            </span>
          )}
          <div className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-medium">
            📷 {site.gallery.length}张
          </div>
        </div>

        {/* Title on Image bottom */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
          <h3 className="font-bold text-base leading-snug line-clamp-1 drop-shadow-md">
            {site.name}
          </h3>
          {site.localName && (
            <p className="text-xs text-slate-200 font-normal line-clamp-1 opacity-90">
              {site.localName}
            </p>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Family Scores Row */}
        <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">🚼 推车</span>
            <span className="text-xs font-bold text-emerald-700">{site.strollerRating}/5</span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-200">
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">🧒 4岁幼童</span>
            <span className="text-xs font-bold text-amber-700">{site.kidRating}/5</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">🧓 长辈舒适</span>
            <span className="text-xs font-bold text-indigo-700">{site.elderlyRating}/5</span>
          </div>
        </div>

        {/* 2-PERSON COLLABORATIVE EVALUATION PILL */}
        <div
          onClick={() => onSelect(site, 'collaboration')}
          className={`flex items-center justify-between p-2 rounded-xl text-[11px] font-bold cursor-pointer transition-colors border ${
            bothRated
              ? reviews[0].preference === 'must_go' && reviews[1].preference === 'must_go'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                : 'bg-indigo-50/80 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
              : reviews.length === 1
              ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              : 'bg-slate-50/80 text-slate-600 border-dashed border-slate-200 hover:bg-slate-100 hover:text-indigo-600'
          }`}
          title="点击进入双人打分与评语协同"
        >
          <div className="flex items-center gap-1.5 truncate">
            <Users className="w-3.5 h-3.5 flex-shrink-0 text-indigo-600" />
            <span className="truncate">
              {bothRated ? (
                <>
                  <span>2人已评 ★{avgScore}</span>
                  <span className="opacity-70 ml-1">
                    {reviews[0].preference === 'must_go' && reviews[1].preference === 'must_go' ? '(双方必去 🌟)' : '(双方达成)'}
                  </span>
                </>
              ) : reviews.length === 1 ? (
                <>
                  <span>{reviews[0].reviewerName}已评 ★{reviews[0].overallRating}</span>
                  <span className="text-amber-700 font-medium ml-1">(待另一位评分)</span>
                </>
              ) : (
                <span>双人待评分与评价</span>
              )}
            </span>
          </div>

          <span className="text-[10px] text-indigo-600 font-bold underline flex-shrink-0 ml-1">
            {reviews.length > 0 ? '评语' : '+打分'}
          </span>
        </div>

        {/* Intensity & Duration */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1 bg-slate-100/80 px-2 py-0.5 rounded-lg text-slate-600">
            <Footprints className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] truncate max-w-[120px]">{site.walkingIntensity}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>约 {site.recommendedDurationMin} 分钟</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
          {site.description}
        </p>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onSelect(site, 'overview')}
              className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              title="查看详情"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px]">详情</span>
            </button>

            {onOpenLLMResearch && (
              <button
                type="button"
                onClick={() => onOpenLLMResearch(site)}
                className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                title="AI 智能调研提示词"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">AI调研</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onEdit(site)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="编辑景点"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(site.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="删除景点"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {onAddToDay && (
            <button
              type="button"
              onClick={() => onAddToDay(site.id)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
              title="加入当前选中的行程天"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>排期</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
