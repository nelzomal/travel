import React from 'react';
import { DayItinerary, Site } from '../../types/travel';
import { ShieldCheck, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

interface PacingMeterProps {
  day: DayItinerary;
  sites: Site[];
  onAddNapBreak?: () => void;
}

export const PacingMeter: React.FC<PacingMeterProps> = ({ day, sites, onAddNapBreak }) => {
  const activeStops = day.stops.filter((s) => !s.isRestBreak);
  const restStops = day.stops.filter((s) => s.isRestBreak);
  const hasNapBreak = restStops.length > 0;

  // Compute walking intensity sum
  let heavyWalkingCount = 0;
  let steepStairsCount = 0;
  let totalDurationMinutes = 0;

  activeStops.forEach((stop) => {
    const site = sites.find((s) => s.id === stop.siteId);
    if (site) {
      totalDurationMinutes += site.recommendedDurationMin || 60;
      if (site.walkingIntensity.includes('较累')) heavyWalkingCount++;
      if (site.stairsLevel.includes('陡峭') || site.stairsLevel.includes('中等')) steepStairsCount++;
    }
  });

  // Calculate Pace Score & Label
  let paceStatus: 'relaxed' | 'balanced' | 'intense' = 'relaxed';
  if (activeStops.length >= 4 || heavyWalkingCount >= 2) {
    paceStatus = 'intense';
  } else if (activeStops.length >= 2 || totalDurationMinutes > 240) {
    paceStatus = 'balanced';
  }

  const getStatusColor = () => {
    switch (paceStatus) {
      case 'relaxed':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          title: '悠闲舒适节奏 (极佳！最适宜4岁幼童与长辈)',
          desc: '行程疲劳度低。爷爷奶奶可以从容漫步，宝宝保持充足精力和好心情。'
        };
      case 'balanced':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          title: '适中活动节奏',
          desc: '安排紧凑得当。请适时提醒长辈喝水与坐下歇脚，保障宝宝午后电量。'
        };
      case 'intense':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-900',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          title: '疲劳预警：今日活动偏多',
          desc: '检测到4个以上打卡点或较长步行，建议适当删减或在下午插入1.5小时酒店午休。'
        };
    }
  };

  const status = getStatusColor();

  return (
    <div className={`p-4 rounded-3xl border ${status.bg} space-y-3 transition-colors shadow-2xs`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-white shadow-2xs">
            {paceStatus === 'relaxed' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            ) : paceStatus === 'balanced' ? (
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider">第 {day.dayNumber} 天 行程节奏分析:</span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${status.badge}`}>
                {paceStatus === 'relaxed' ? '轻松悠闲' : paceStatus === 'balanced' ? '适度平衡' : '强度偏高'}
              </span>
            </div>
            <p className="text-xs font-medium mt-0.5">{status.title}</p>
          </div>
        </div>

        {/* Nap Button if missing */}
        {!hasNapBreak && onAddNapBreak && (
          <button
            type="button"
            onClick={onAddNapBreak}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors self-start sm:self-center"
          >
            <span>💤</span>
            <span>+ 插入1.5小时午休保护</span>
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 border-t border-black/5">
        <div className="bg-white/70 p-2 rounded-2xl border border-black/5">
          <span className="text-[10px] text-slate-500 font-semibold block">游览打卡点</span>
          <span className="font-bold text-slate-800">{activeStops.length} 处</span>
        </div>
        <div className="bg-white/70 p-2 rounded-2xl border border-black/5">
          <span className="text-[10px] text-slate-500 font-semibold block">预估活动时长</span>
          <span className="font-bold text-slate-800">约 {Math.round(totalDurationMinutes / 60)} 小时</span>
        </div>
        <div className="bg-white/70 p-2 rounded-2xl border border-black/5">
          <span className="text-[10px] text-slate-500 font-semibold block">长距步行路段</span>
          <span className={`font-bold ${heavyWalkingCount > 1 ? 'text-amber-700' : 'text-slate-800'}`}>
            {heavyWalkingCount} 段
          </span>
        </div>
        <div className="bg-white/70 p-2 rounded-2xl border border-black/5">
          <span className="text-[10px] text-slate-500 font-semibold block">幼童长辈午休</span>
          <span className={`font-bold ${hasNapBreak ? 'text-emerald-700' : 'text-rose-600'}`}>
            {hasNapBreak ? '已排定 💤' : '未排定 ⚠️'}
          </span>
        </div>
      </div>

      {/* Smart Advice */}
      <div className="text-[11px] flex items-start gap-1.5 text-slate-700 bg-white/60 p-2.5 rounded-2xl border border-black/5">
        <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          {hasNapBreak ? (
            <span>
              <strong>智能照护提示：</strong> 今日已安排下午午休/茶歇时段，能有效预防4岁小朋友傍晚哭闹闹觉，并让长辈充分缓解足部酸胀！
            </span>
          ) : (
            <span>
              <strong>温馨贴士：</strong> 4岁幼童与长辈最适宜在下午13:30-15:30安排一段静心午睡，精神焕发再开启傍晚行程。
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
