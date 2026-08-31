import React from 'react';
import { Site } from '../../types/travel';
import { WalkingIntensityBadge } from '../Common/FamilyBadge';
import { Clock, Eye, Edit3, Trash2, Plus, Sparkles } from 'lucide-react';

interface SiteCardProps {
  site: Site;
  isSelected?: boolean;
  onSelect: (site: Site) => void;
  onEdit: (site: Site) => void;
  onDelete: (siteId: string) => void;
  onAddToDay?: (siteId: string) => void;
  onOpenLLMResearch?: (site: Site) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onAddToDay,
  onOpenLLMResearch
}) => {
  const getCategoryText = (cat: string) => {
    switch (cat) {
      case 'temple': return '神社寺庙';
      case 'attraction': return '地标乐园';
      case 'park': return '公园动物园';
      case 'museum': return '博览展馆';
      case 'nature': return '自然风景';
      case 'restaurant': return '亲子餐厅';
      case 'shopping': return '商场购物';
      case 'relax': return '温泉茶休';
      default: return '景点';
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-0.5 ${
        isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      {/* Cover Image */}
      <div 
        className="relative h-44 w-full bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onSelect(site)}
      >
        <img
          src={site.coverImage}
          alt={site.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider">
            {getCategoryText(site.category)}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-md text-slate-800 text-[10px] font-semibold">
            {site.city}
          </span>
        </div>

        {/* Gallery count indicator */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-medium">
          📷 {site.gallery.length} 张实拍
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
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">🚼 推车无障碍</span>
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

        {/* Description & Duration */}
        <div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {site.description}
          </p>
          
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              建议游玩: 约{site.recommendedDurationMin}分钟
            </span>
            <WalkingIntensityBadge intensity={site.walkingIntensity} />
          </div>
        </div>

        {/* Highlight Family Tip if available */}
        {site.familyTips && site.familyTips.length > 0 && (
          <div className="p-2 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="line-clamp-1 italic">{site.familyTips[0]}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelect(site)}
            className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            详情
          </button>

          {onAddToDay && (
            <button
              type="button"
              onClick={() => onAddToDay(site.id)}
              className="py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs"
              title="加入当前日程"
            >
              <Plus className="w-3.5 h-3.5" />
              加日程
            </button>
          )}

          {onOpenLLMResearch && (
            <button
              type="button"
              onClick={() => onOpenLLMResearch(site)}
              title="生成 LLM 深度调研提示词 / 导入回复"
              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI调研</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(site)}
            title="编辑景点信息"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(site.id)}
            title="删除景点"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
