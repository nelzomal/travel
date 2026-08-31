import React, { useState } from 'react';
import { Trip, FamilyMember } from '../../types/travel';
import { Calendar, MapPin, Users, Plus, Edit3, Check } from 'lucide-react';

interface TripHeaderProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
}

export const TripHeader: React.FC<TripHeaderProps> = ({ trip, onUpdateTrip }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(trip.title);
  const [destination, setDestination] = useState(trip.destination);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);
  const [summary, setSummary] = useState(trip.summary);

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'👶 4岁幼童' | '🧓 长辈/爷爷奶奶' | '🧑 父母/领队'>('👶 4岁幼童');
  const [newMemberNotes, setNewMemberNotes] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  const handleSaveTripInfo = () => {
    onUpdateTrip({
      ...trip,
      title,
      destination,
      startDate,
      endDate,
      summary,
      updatedAt: new Date().toISOString().slice(0, 10)
    });
    setIsEditing(false);
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const newMember: FamilyMember = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      role: newMemberRole,
      notes: newMemberNotes.trim() || undefined
    };
    onUpdateTrip({
      ...trip,
      partyMembers: [...trip.partyMembers, newMember],
      updatedAt: new Date().toISOString().slice(0, 10)
    });
    setNewMemberName('');
    setNewMemberNotes('');
    setShowAddMember(false);
  };

  const handleRemoveMember = (id: string) => {
    onUpdateTrip({
      ...trip,
      partyMembers: trip.partyMembers.filter((m) => m.id !== id),
      updatedAt: new Date().toISOString().slice(0, 10)
    });
  };

  const calculateDaysCount = () => {
    try {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : trip.days.length;
    } catch {
      return trip.days.length;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-2 flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="行程计划标题..."
                className="w-full text-xl font-bold text-slate-900 border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="旅行目的地..."
                  className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="行程总览与全家出行备忘..."
                rows={2}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveTripInfo}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{trip.title}</h1>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="编辑行程标题与日期"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap font-medium">
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  {trip.destination}
                </span>
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  {trip.startDate} 至 {trip.endDate} (共 {calculateDaysCount()} 天)
                </span>
                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl font-bold">
                  👶 4岁幼儿 + 🧓 爷爷奶奶 舒适配置
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl pt-1">
                {trip.summary}
              </p>
            </>
          )}
        </div>

        {/* Quick Stats Box */}
        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 flex-shrink-0">
          <div className="text-center px-3 border-r border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">总规划天数</span>
            <p className="text-lg font-black text-indigo-600">{trip.days.length} 天</p>
          </div>
          <div className="text-center px-3 border-r border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">打卡点总数</span>
            <p className="text-lg font-black text-indigo-600">
              {trip.days.reduce((acc, d) => acc + d.stops.filter((s) => !s.isRestBreak).length, 0)} 处
            </p>
          </div>
          <div className="text-center px-3">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">午休保护时段</span>
            <p className="text-lg font-black text-emerald-600">
              {trip.days.reduce((acc, d) => acc + d.stops.filter((s) => s.isRestBreak).length, 0)} 次 💤
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Gen Party Members Roster */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              全家出行成员与照顾重点 (幼童/长辈)
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowAddMember(!showAddMember)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            {showAddMember ? '收起' : '添加家庭成员'}
          </button>
        </div>

        {/* Add Member Form Inline */}
        {showAddMember && (
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="姓名/昵称 (例如: 轩轩, 姥爷)"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value as any)}
                className="text-xs px-3 py-1.5 rounded-xl border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="👶 4岁幼童">👶 4岁幼童</option>
                <option value="🧓 长辈/爷爷奶奶">🧓 长辈/爷爷奶奶</option>
                <option value="🧑 父母/领队">🧑 父母/领队</option>
              </select>
              <input
                type="text"
                placeholder="特别照顾事项 (例如: 午休、防滑、喜好热茶)"
                value={newMemberNotes}
                onChange={(e) => setNewMemberNotes(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddMember}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-2xs"
              >
                确认添加
              </button>
            </div>
          </div>
        )}

        {/* Party Member Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {trip.partyMembers.map((member) => (
            <div
              key={member.id}
              className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-2 shadow-2xs"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xl">
                  {member.role.includes('幼童') ? '👶' : member.role.includes('长辈') ? '🧓' : '🧑'}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-800">{member.name}</p>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold">
                      {member.role}
                    </span>
                  </div>
                  {member.notes && (
                    <p className="text-[11px] text-slate-500 leading-snug mt-1 italic">
                      {member.notes}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveMember(member.id)}
                className="text-slate-300 hover:text-rose-600 p-1 text-xs"
                title="移除成员"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
