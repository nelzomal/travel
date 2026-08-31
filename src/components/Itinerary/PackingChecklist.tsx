import React, { useState } from 'react';
import { PackingItem } from '../../types/travel';
import { Plus, Trash2 } from 'lucide-react';

interface PackingChecklistProps {
  checklist: PackingItem[];
  onUpdateChecklist: (newChecklist: PackingItem[]) => void;
}

export const PackingChecklist: React.FC<PackingChecklistProps> = ({
  checklist,
  onUpdateChecklist
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('幼童用品 (4岁)');
  const [newItemNote, setNewItemNote] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const categories: Array<PackingItem['category']> = [
    '幼童用品 (4岁)',
    '长辈/健康保健',
    '全家必备',
    '证件与数码'
  ];

  const handleToggle = (id: string) => {
    onUpdateChecklist(
      checklist.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleDelete = (id: string) => {
    onUpdateChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: `pack-${Date.now()}`,
      category: newItemCategory,
      item: newItemName.trim(),
      checked: false,
      note: newItemNote.trim() || undefined
    };

    onUpdateChecklist([...checklist, newItem]);
    setNewItemName('');
    setNewItemNote('');
    setShowAddForm(false);
  };

  const totalCount = checklist.length;
  const checkedCount = checklist.filter((c) => c.checked).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '幼童用品 (4岁)': return '👶';
      case '长辈/健康保健': return '🧓';
      case '全家必备': return '🎒';
      case '证件与数码': return '📱';
      default: return '📦';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header & Progress Bar */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-2xl text-base">🎒</span>
              <h2 className="text-lg font-bold text-slate-900">三代同堂出行行李与照护健康清单</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              专为4岁活泼幼童与长辈定制的贴心准备备忘录
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">
              已打包 {checkedCount} / 共 {totalCount} 项 ({progressPercent}%)
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? '收起' : '添加清单项'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Inline Add Item Form */}
      {showAddForm && (
        <form onSubmit={handleAddItem} className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-3 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">添加新行李物品</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as any)}
              className="text-xs px-3 py-2 rounded-xl border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryIcon(cat)} {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              placeholder="物品名称 (例如: 便携防晒帽、健步手杖)..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:col-span-2"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="使用原因或注意事项 (例如: 台场海边防风用)..."
              value={newItemNote}
              onChange={(e) => setNewItemNote(e.target.value)}
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs"
            >
              确认添加
            </button>
          </div>
        </form>
      )}

      {/* Categorized Packing List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const items = checklist.filter((item) => item.category === cat);
          if (items.length === 0) return null;

          const catChecked = items.filter((i) => i.checked).length;

          return (
            <div key={cat} className="space-y-3 p-4 bg-slate-50/70 rounded-3xl border border-slate-200/80">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(cat)}</span>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{cat}</h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                  {catChecked}/{items.length}
                </span>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggle(item.id)}
                    className={`p-3 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                      item.checked
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-500'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {}} // handled by parent div click
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p className={`text-xs font-medium ${item.checked ? 'line-through opacity-70' : ''}`}>
                          {item.item}
                        </p>
                        {item.note && (
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 italic">
                            💡 {item.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="text-slate-300 hover:text-rose-600 p-1 text-xs transition-colors"
                      title="删除此项"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
