import React, { useState } from 'react';
import { Site, TimeSlot, ItineraryStop } from '../../types/travel';
import { X, Search, Plus, Car, Sparkles } from 'lucide-react';

interface AddStopModalProps {
  isOpen: boolean;
  sites: Site[];
  dayNumber: number;
  onClose: () => void;
  onAddStop: (stop: ItineraryStop) => void;
}

export const AddStopModal: React.FC<AddStopModalProps> = ({
  isOpen,
  sites,
  dayNumber,
  onClose,
  onAddStop
}) => {
  const [mode, setMode] = useState<'site' | 'rest'>('site');
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [customNotes, setCustomNotes] = useState('');
  
  // For Rest Break
  const [restTitle, setRestTitle] = useState('酒店午休与长辈静享下午茶');
  
  // Transport to next stop
  const [transportMode, setTransportMode] = useState<'walk' | 'taxi' | 'bus' | 'subway' | 'train' | 'car'>('walk');
  const [transportDurationMin, setTransportDurationMin] = useState(10);
  const [transportCostEst, setTransportCostEst] = useState('');
  const [transportFamilyNote, setTransportFamilyNote] = useState('');

  if (!isOpen) return null;

  const filteredSites = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'rest') {
      const stop: ItineraryStop = {
        id: `stop-${Date.now()}`,
        siteId: '',
        isRestBreak: true,
        restTitle: restTitle.trim() || '幼童午休与长辈休息时段',
        timeSlot: 'nap_rest',
        startTime,
        endTime,
        customNotes: customNotes.trim() || '宝宝安稳午睡充电，长辈泡茶放松，养精蓄锐。'
      };
      onAddStop(stop);
      onClose();
      return;
    }

    if (!selectedSiteId) return;

    const stop: ItineraryStop = {
      id: `stop-${Date.now()}`,
      siteId: selectedSiteId,
      timeSlot,
      startTime,
      endTime,
      customNotes: customNotes.trim() || undefined,
      transportToNext: {
        mode: transportMode,
        durationMin: Number(transportDurationMin) || 10,
        costEst: transportCostEst.trim() || undefined,
        familyNote: transportFamilyNote.trim() || undefined
      }
    };

    onAddStop(stop);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">向第 {dayNumber} 天日程添加活动</h2>
            <p className="text-xs text-slate-500">可从景点库挑选打卡目的地，或插入专属午睡休整时段</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 px-6 pt-3 gap-3">
          <button
            type="button"
            onClick={() => setMode('site')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'site'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🏛️ 从已有景点库挑选</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('rest');
              setTimeSlot('nap_rest');
              setStartTime('14:00');
              setEndTime('15:30');
            }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'rest'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>💤 4岁宝宝午睡 & 长辈下午茶</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {mode === 'site' ? (
            <>
              {/* Pick Site */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  选择打卡景点
                </label>
                
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索景点库..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Site Radio Picker List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1 border border-slate-100 rounded-2xl">
                  {filteredSites.map((site) => {
                    const isSelected = selectedSiteId === site.id;
                    return (
                      <div
                        key={site.id}
                        onClick={() => setSelectedSiteId(site.id)}
                        className={`p-2.5 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={site.coverImage}
                          alt={site.name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{site.name}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{site.city}</p>
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 mt-0.5">
                            <span>🚼 {site.strollerRating}/5</span>
                            <span>🧒 {site.kidRating}/5</span>
                            <span>🧓 {site.elderlyRating}/5</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time slot & Range */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">时段分类</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="morning">🌅 晨间时段</option>
                    <option value="lunch">🍜 午餐美食</option>
                    <option value="afternoon">☀️ 下午游览</option>
                    <option value="evening">🌙 傍晚散步</option>
                    <option value="dinner">🍲 晚餐时光</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">开始时间</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">结束时间</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Custom Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  全家专属备注 (例如: 备好推车、避开台阶、提前买票等)
                </label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="例如: 原宿站南参道进，带宝宝在手水舍洗手，给长辈买抹茶甜点。"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Transport to Next Stop */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Car className="w-4 h-4 text-indigo-600" />
                  <span>前往下一站交通指引</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">出行方式</label>
                    <select
                      value={transportMode}
                      onChange={(e) => setTransportMode(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-xl text-xs border border-slate-200 bg-white"
                    >
                      <option value="walk">🚶 步行</option>
                      <option value="taxi">🚕 出租车 / Uber</option>
                      <option value="train">🚆 地铁 / 单轨电车</option>
                      <option value="bus">🚌 公共巴士</option>
                      <option value="car">🚗 包车 / 自驾</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">耗时 (分钟)</label>
                    <input
                      type="number"
                      value={transportDurationMin}
                      onChange={(e) => setTransportDurationMin(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-xl text-xs border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">预估花费</label>
                    <input
                      type="text"
                      placeholder="约 ¥1,200"
                      value={transportCostEst}
                      onChange={(e) => setTransportCostEst(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl text-xs border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    家庭出行交通建议 (例如: 建议打车避免走长阶梯)
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 建议直接打车回酒店，避免推车挤地铁，保存长辈体力。"
                    value={transportFamilyNote}
                    onChange={(e) => setTransportFamilyNote(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl text-xs border border-slate-200 bg-white"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Rest / Nap Break Mode */
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  为什么4岁幼童与长辈必须设置午休时段？
                </p>
                <p className="leading-relaxed text-slate-600">
                  下午13:30-15:30安排1.5小时酒店午休或静心茶歇，不仅能避免孩子过度疲劳闹脾气，还能让长辈有效放松双脚，全家晚上神清气爽看夜景！
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">休息时段名称</label>
                <input
                  type="text"
                  value={restTitle}
                  onChange={(e) => setRestTitle(e.target.value)}
                  placeholder="例如: 酒店午休与长辈静享下午茶"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">开始时间</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">结束时间</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">休整安排与补充说明</label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="例如: 宝宝在婴儿车或酒店大床午睡1.5小时，爷爷奶奶泡热水脚并喝大麦茶放松。"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit Footer */}
          <div className="sticky bottom-0 z-20 -mx-6 -mb-6 p-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              加入第 {dayNumber} 天日程
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
