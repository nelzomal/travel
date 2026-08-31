import React from 'react';
import { Trip, Site } from '../../types/travel';
import { Printer, X, MapPin, Calendar } from 'lucide-react';

interface PrintableViewProps {
  trip: Trip;
  sites: Site[];
  onClose: () => void;
}

export const PrintableView: React.FC<PrintableViewProps> = ({ trip, sites, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const getTransportModeText = (mode: string) => {
    switch (mode) {
      case 'walk': return '步行';
      case 'taxi': return '打车/出租车';
      case 'train': return '地铁/单轨';
      case 'bus': return '巴士';
      case 'car': return '包车/自驾';
      default: return '交通';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 sm:p-8 flex justify-center">
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl p-8 sm:p-12 space-y-8 print:shadow-none print:p-0 print:m-0 print:max-w-none print:rounded-none">
        
        {/* Floating Print / Close Bar (Hidden on paper print) */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md py-2 border-b border-slate-100 flex items-center justify-between print:hidden -mt-4 mb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            🖨️ 三代同堂旅行计划 • 打印 / PDF 随身版
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>立即打印 / 另存为 PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
            <span>🧭 Tabiji 亲子慢游路书</span>
            <span>•</span>
            <span>4岁幼童 × 爷爷奶奶 无障碍尊享版</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">{trip.title}</h1>
          <div className="flex items-center gap-4 text-xs text-slate-600 font-medium flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              目的地: {trip.destination}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              出行时间: {trip.startDate} 至 {trip.endDate} (共 {trip.days.length} 天)
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            {trip.summary}
          </p>

          {/* Party Members */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-700">出行全家成员:</span>
            {trip.partyMembers.map((m) => (
              <span key={m.id} className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                {m.role.includes('幼童') ? '👶' : m.role.includes('长辈') ? '🧓' : '🧑'} {m.name} ({m.role})
              </span>
            ))}
          </div>
        </div>

        {/* Day-by-Day Complete Itinerary */}
        <div className="space-y-8">
          {trip.days.map((day) => (
            <div key={day.id} className="space-y-4 page-break-inside-avoid">
              <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between border border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    第 {day.dayNumber} 天 — {day.theme}
                  </h3>
                  <p className="text-[11px] text-slate-600">{day.date}</p>
                </div>
                {day.stops.some((s) => s.isRestBreak) && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-bold">
                    💤 下午午睡时段已排定
                  </span>
                )}
              </div>

              {day.dailyNotes && (
                <p className="text-xs text-slate-600 italic px-1">
                  备忘提醒: {day.dailyNotes}
                </p>
              )}

              {/* Day Stops */}
              <div className="space-y-3 pl-2">
                {day.stops.map((stop, idx) => {
                  const site = sites.find((s) => s.id === stop.siteId);

                  if (stop.isRestBreak) {
                    return (
                      <div
                        key={stop.id}
                        className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2"
                      >
                        <span className="text-base">💤</span>
                        <div>
                          <span className="font-bold">{stop.startTime} - {stop.endTime}</span>: {stop.restTitle || '午休茶歇时段'}
                          {stop.customNotes && <p className="text-[11px] text-purple-800 mt-0.5">{stop.customNotes}</p>}
                        </div>
                      </div>
                    );
                  }

                  if (!site) return null;

                  return (
                    <div key={stop.id} className="space-y-2">
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {stop.startTime} - {stop.endTime}
                          </span>
                          <span className="text-slate-500 font-medium">
                            🚼 推车 {site.strollerRating}/5分 • 🧒 幼童 {site.kidRating}/5分 • 🧓 长辈 {site.elderlyRating}/5分
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900">{site.name} {site.localName ? `(${site.localName})` : ''}</h4>
                        <p className="text-slate-500 text-[11px]">{site.address} • 开放时间: {site.openingHours}</p>
                        
                        {site.admissionFee && (
                          <p className="text-[11px] text-slate-600">
                            <strong>门票费用:</strong> 成人 {site.admissionFee.adult}，长者 {site.admissionFee.senior}，4岁幼童 {site.admissionFee.child4yo}
                          </p>
                        )}

                        {stop.customNotes && (
                          <p className="text-amber-900 bg-amber-50 p-2 rounded-lg text-[11px] font-medium border border-amber-100">
                            💡 当日计划: {stop.customNotes}
                          </p>
                        )}
                      </div>

                      {/* Transit step */}
                      {idx < day.stops.length - 1 && stop.transportToNext && (
                        <div className="ml-4 pl-3 py-1 border-l-2 border-slate-300 text-[11px] text-slate-600">
                          ↳ 前往下一站: <strong>{getTransportModeText(stop.transportToNext.mode)}</strong> (~约{stop.transportToNext.durationMin}分钟)
                          {stop.transportToNext.costEst && ` [${stop.transportToNext.costEst}]`}
                          {stop.transportToNext.familyNote && ` — ${stop.transportToNext.familyNote}`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Packing List Summary */}
        <div className="border-t border-slate-200 pt-6 space-y-3 page-break-inside-avoid">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            三代同堂核心行李打包清单
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
            {trip.checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-1.5">
                <span>{item.checked ? '☑' : '☐'}</span>
                <span>[{item.category}] {item.item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
