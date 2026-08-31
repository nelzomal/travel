import React, { useState } from 'react';
import { DayItinerary, Site, ItineraryStop } from '../../types/travel';
import { PacingMeter } from './PacingMeter';
import { AddStopModal } from './AddStopModal';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, 
  Eye, Car, Footprints, Bus, Train, Sparkles, 
  Edit3
} from 'lucide-react';

interface DailyTimelineProps {
  days: DayItinerary[];
  activeDayIndex: number;
  sites: Site[];
  onSelectDayIndex: (index: number) => void;
  onUpdateDay: (updatedDay: DayItinerary) => void;
  onAddDay: () => void;
  onDeleteDay: (dayId: string) => void;
  onSelectSiteDetails: (site: Site) => void;
}

export const DailyTimeline: React.FC<DailyTimelineProps> = ({
  days,
  activeDayIndex,
  sites,
  onSelectDayIndex,
  onUpdateDay,
  onAddDay,
  onDeleteDay,
  onSelectSiteDetails
}) => {
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [isEditingTheme, setIsEditingTheme] = useState(false);

  const currentDay = days[activeDayIndex] || days[0];

  if (!currentDay) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-sm text-slate-500">暂无日程安排。</p>
        <button
          type="button"
          onClick={onAddDay}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          创建第 1 天
        </button>
      </div>
    );
  }

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    const newStops = [...currentDay.stops];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStops.length) return;

    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    onUpdateDay({
      ...currentDay,
      stops: newStops
    });
  };

  const handleDeleteStop = (stopId: string) => {
    onUpdateDay({
      ...currentDay,
      stops: currentDay.stops.filter((s) => s.id !== stopId)
    });
  };

  const handleAddStop = (stop: ItineraryStop) => {
    onUpdateDay({
      ...currentDay,
      stops: [...currentDay.stops, stop],
      napBreakIncluded: stop.isRestBreak ? true : currentDay.napBreakIncluded
    });
  };

  const handleQuickAddNap = () => {
    const napStop: ItineraryStop = {
      id: `stop-${Date.now()}`,
      siteId: '',
      isRestBreak: true,
      restTitle: '4岁宝宝午休充电 & 爷爷奶奶静享下午茶',
      timeSlot: 'nap_rest',
      startTime: '13:30',
      endTime: '15:30',
      customNotes: '重要充电时段！宝宝睡饱防哭闹，长辈放松双腿，为傍晚海景漫步积蓄精力。'
    };
    handleAddStop(napStop);
  };

  const getTimeSlotBadge = (slot: string) => {
    switch (slot) {
      case 'morning': return { label: '晨间游览', icon: '🌅', color: 'bg-amber-100 text-amber-800' };
      case 'lunch': return { label: '午餐美食', icon: '🍜', color: 'bg-orange-100 text-orange-800' };
      case 'afternoon': return { label: '下午游览', icon: '☀️', color: 'bg-sky-100 text-sky-800' };
      case 'nap_rest': return { label: '午休/茶歇', icon: '💤', color: 'bg-purple-100 text-purple-800' };
      case 'evening': return { label: '傍晚漫步', icon: '🌙', color: 'bg-indigo-100 text-indigo-800' };
      case 'dinner': return { label: '晚餐时光', icon: '🍲', color: 'bg-rose-100 text-rose-800' };
      default: return { label: '打卡点', icon: '📍', color: 'bg-slate-100 text-slate-800' };
    }
  };

  const getTransportModeText = (mode: string) => {
    switch (mode) {
      case 'walk': return '步行';
      case 'taxi': return '出租车 / 网约车';
      case 'train': return '地铁 / 单轨电车';
      case 'bus': return '公共巴士';
      case 'car': return '包车 / 自驾';
      default: return '交通';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Day Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {days.map((day, idx) => {
          const isActive = idx === activeDayIndex;
          const stopCount = day.stops.filter((s) => !s.isRestBreak).length;
          const hasNap = day.stops.some((s) => s.isRestBreak);

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => onSelectDayIndex(idx)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs">第 {day.dayNumber} 天</span>
                {hasNap && <span title="已安排午睡茶歇" className="text-xs">💤</span>}
              </div>
              <div className={`text-[10px] mt-0.5 ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                {day.date} • {stopCount} 个景点
              </div>
            </button>
          );
        })}

        {/* Add Day Button */}
        <button
          type="button"
          onClick={onAddDay}
          className="flex-shrink-0 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>加一天</span>
        </button>
      </div>

      {/* Day Banner & Header Info */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-black">
                第 {currentDay.dayNumber} 天
              </span>
              <span className="text-xs text-slate-500 font-medium">📅 {currentDay.date}</span>
            </div>

            {isEditingTheme ? (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={currentDay.theme}
                  onChange={(e) => onUpdateDay({ ...currentDay, theme: e.target.value })}
                  placeholder="当日主题 (例如: 明治神宫清晨吸氧与森林漫步)..."
                  className="w-full text-sm font-bold border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <input
                  type="date"
                  value={currentDay.date}
                  onChange={(e) => onUpdateDay({ ...currentDay, date: e.target.value })}
                  className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <textarea
                  value={currentDay.dailyNotes || ''}
                  onChange={(e) => onUpdateDay({ ...currentDay, dailyNotes: e.target.value })}
                  placeholder="当日家庭出行备忘 (例如: 婴儿车、防风外套)..."
                  rows={2}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsEditingTheme(false)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                >
                  完成
                </button>
              </div>
            ) : (
              <div className="mt-1">
                <h3 className="text-base font-bold text-slate-900">{currentDay.theme}</h3>
                {currentDay.dailyNotes && (
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5 max-w-2xl">
                    {currentDay.dailyNotes}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setIsEditingTheme(!isEditingTheme)}
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors text-xs flex items-center gap-1 font-semibold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingTheme ? '收起' : '修改当日主题'}</span>
            </button>

            {days.length > 1 && (
              <button
                type="button"
                onClick={() => onDeleteDay(currentDay.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs"
                title="删除这一天日程"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Pacing & Fatigue Analyzer for Multi-Gen */}
        <PacingMeter
          day={currentDay}
          sites={sites}
          onAddNapBreak={handleQuickAddNap}
        />
      </div>

      {/* Stops Timeline List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            当日时间线日程 ({currentDay.stops.length} 个规划块)
          </h4>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickAddNap}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span>💤</span>
              <span>+ 插入午休时段</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddStopOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加打卡点</span>
            </button>
          </div>
        </div>

        {currentDay.stops.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl">
              🗺️
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">第 {currentDay.dayNumber} 天还没有添加活动</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                您可以从景点库中选择景点添加，或插入下午午休保护时段。
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddStopOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              添加第一个打卡点
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {currentDay.stops.map((stop, idx) => {
              const site = sites.find((s) => s.id === stop.siteId);
              const slotInfo = getTimeSlotBadge(stop.timeSlot);

              return (
                <div key={stop.id} className="space-y-3">
                  
                  {/* The Stop Card */}
                  {stop.isRestBreak ? (
                    /* Dedicated Rest & Nap Break Card */
                    <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-200/80 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-2 bg-purple-100 text-purple-700 rounded-2xl text-lg">💤</span>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                              幼童午休充电 & 长辈茶歇静养
                            </span>
                            <h5 className="text-sm font-bold text-purple-950 mt-0.5">
                              {stop.restTitle || '午休茶歇时段'}
                            </h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-semibold text-purple-800 bg-white/80 px-2.5 py-1 rounded-xl border border-purple-100">
                            {stop.startTime} - {stop.endTime}
                          </span>
                        </div>
                      </div>

                      {stop.customNotes && (
                        <p className="text-xs text-purple-900 bg-white/70 p-2.5 rounded-2xl border border-purple-100/60 leading-relaxed font-medium">
                          {stop.customNotes}
                        </p>
                      )}

                      {/* Stop Action Bar */}
                      <div className="flex items-center justify-end gap-1 pt-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveStop(idx, 'up')}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg"
                          title="上移"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === currentDay.stops.length - 1}
                          onClick={() => handleMoveStop(idx, 'down')}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg"
                          title="下移"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStop(stop.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                          title="删除此休息时段"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : site ? (
                    /* Site / Destination Stop Card */
                    <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-indigo-200 transition-all space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        
                        <div className="flex items-start gap-3">
                          <img
                            src={site.coverImage}
                            alt={site.name}
                            className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 shadow-2xs"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${slotInfo.color}`}>
                                {slotInfo.icon} {slotInfo.label}
                              </span>
                              <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                                {stop.startTime} - {stop.endTime}
                              </span>
                            </div>
                            
                            <h5 className="text-sm font-bold text-slate-900 mt-1">{site.name} {site.localName ? `(${site.localName})` : ''}</h5>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{site.address}</p>
                          </div>
                        </div>

                        {/* Multi-Gen Quick Indicator on Card */}
                        <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-2xl border border-slate-100 text-xs self-start sm:self-center">
                          <span className="text-[11px] font-semibold text-slate-700">🚼 推车 {site.strollerRating}/5</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] font-semibold text-slate-700">🧒 幼童 {site.kidRating}/5</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] font-semibold text-slate-700">🧓 长辈 {site.elderlyRating}/5</span>
                        </div>
                      </div>

                      {/* Custom Stop Notes */}
                      {stop.customNotes && (
                        <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-xs text-amber-900 flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="font-medium">{stop.customNotes}</p>
                        </div>
                      )}

                      {/* Controls Bar */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => onSelectSiteDetails(site)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          查看三代适宜度与设施
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveStop(idx, 'up')}
                            className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg transition-colors"
                            title="上移"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === currentDay.stops.length - 1}
                            onClick={() => handleMoveStop(idx, 'down')}
                            className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg transition-colors"
                            title="下移"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStop(stop.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                            title="移除此打卡点"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Transit to Next Stop Indicator */}
                  {idx < currentDay.stops.length - 1 && stop.transportToNext && (
                    <div className="ml-8 pl-4 py-1.5 border-l-2 border-dashed border-indigo-200 flex items-center gap-3 text-xs text-slate-600">
                      <div className="p-1 bg-indigo-50 text-indigo-600 rounded-lg">
                        {stop.transportToNext.mode === 'walk' && <Footprints className="w-3.5 h-3.5" />}
                        {stop.transportToNext.mode === 'taxi' && <Car className="w-3.5 h-3.5" />}
                        {stop.transportToNext.mode === 'bus' && <Bus className="w-3.5 h-3.5" />}
                        {stop.transportToNext.mode === 'train' && <Train className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">
                          {getTransportModeText(stop.transportToNext.mode)} (~约{stop.transportToNext.durationMin}分钟)
                        </span>
                        {stop.transportToNext.costEst && (
                          <span className="text-slate-500 ml-1.5">[{stop.transportToNext.costEst}]</span>
                        )}
                        {stop.transportToNext.familyNote && (
                          <p className="text-[11px] text-indigo-700 font-medium italic mt-0.5">
                            💡 {stop.transportToNext.familyNote}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Add Stop Modal */}
      <AddStopModal
        isOpen={isAddStopOpen}
        sites={sites}
        dayNumber={currentDay.dayNumber}
        onClose={() => setIsAddStopOpen(false)}
        onAddStop={handleAddStop}
      />

    </div>
  );
};
