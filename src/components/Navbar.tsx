import React, { useRef, useState } from 'react';
import { Trip } from '../types/travel';
import { 
  Plus, Printer, Download, Upload, Share2, Check, Save, GitBranch, X, Copy, RotateCw
} from 'lucide-react';
import { exportDataAsJSON, importDataFromJSON, syncToFilesystem, syncFromDiskToLocalStorage, getExportDataJSONString } from '../services/storage';

export type ActiveTab = 'map_plan' | 'sites' | 'itinerary' | 'checklist';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  trips: Trip[];
  activeTrip: Trip;
  onSelectTrip: (tripId: string) => void;
  onCreateNewTrip: () => void;
  onAddNewSite: () => void;
  onOpenPrintView: () => void;
  onDataImported: () => void;
  onSyncFromDisk?: () => Promise<{ success: boolean; message: string }>;
  onOpenSyncModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  trips,
  activeTrip,
  onSelectTrip,
  onCreateNewTrip,
  onAddNewSite,
  onOpenPrintView,
  onDataImported,
  onSyncFromDisk,
  onOpenSyncModal
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [syncedStatus, setSyncedStatus] = useState<string | null>(null);
  const [diskSyncedStatus, setDiskSyncedStatus] = useState<string | null>(null);
  const [isSyncingFromDisk, setIsSyncingFromDisk] = useState(false);

  const handleManualSyncFromDisk = async () => {
    setIsSyncingFromDisk(true);
    try {
      if (onSyncFromDisk) {
        const res = await onSyncFromDisk();
        setDiskSyncedStatus(res.message || '已成功从磁盘载入！');
      } else {
        const res = await syncFromDiskToLocalStorage();
        setDiskSyncedStatus(res.message);
        onDataImported();
      }
    } catch (e: any) {
      setDiskSyncedStatus(e?.message || '从磁盘同步失败');
    } finally {
      setIsSyncingFromDisk(false);
      setTimeout(() => setDiskSyncedStatus(null), 3500);
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleManualSyncToGit = async () => {
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalDev) {
      const res = await syncToFilesystem();
      if (res.success) {
        setSyncedStatus('已成功写入本地 Git！');
      } else {
        setSyncedStatus(res.message || '同步完成');
      }
      setTimeout(() => setSyncedStatus(null), 3000);
    }
    onOpenSyncModal();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importDataFromJSON(content);
        if (res.success) {
          alert('行程与景点数据已成功导入并同步写入！');
          onDataImported();
        } else {
          alert(`导入失败: ${res.message}`);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 text-xl font-black">
              🧭
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-slate-900 tracking-tight">FamilyTrip 亲子游</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60 hidden sm:inline-block">
                  三代同堂版
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                👶 4岁幼童 × 🧓 爷爷奶奶 舒适慢游规划助手
              </p>
            </div>
          </div>

          {/* Navigation View Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => onSelectTab('map_plan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'map_plan'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🗺️</span>
              <span>地图与规划</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('sites')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'sites'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🏛️</span>
              <span>景点库管理</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('itinerary')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'itinerary'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📅</span>
              <span>每日行程排期</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('checklist')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'checklist'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎒</span>
              <span>三代行李健康清单</span>
            </button>
          </nav>

          {/* Right Controls (Trip Selector, Share, Save to Git & Primary Action) */}
          <div className="flex items-center gap-2">
            
            {/* Trip Selector Dropdown */}
            <div className="relative">
              <select
                value={activeTrip.id}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    onCreateNewTrip();
                  } else {
                    onSelectTrip(e.target.value);
                  }
                }}
                className="text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs max-w-[150px] sm:max-w-[200px] truncate"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    ✈️ {t.title}
                  </option>
                ))}
                <option value="new">➕ + 新建旅行计划...</option>
              </select>
            </div>

            {/* Quick Share Current Tab Link */}
            <button
              type="button"
              onClick={handleShareLink}
              title="复制当前页面分享链接（给家人/同伴）"
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border shadow-2xs ${
                copiedLink
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>已复制!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">分享</span>
                </>
              )}
            </button>

            {/* Sync from Disk to LocalStorage */}
            <button
              type="button"
              onClick={handleManualSyncFromDisk}
              disabled={isSyncingFromDisk}
              title="从本地磁盘代码文件 (data/sites.json 与 data/trips.json) 读取最新修改并立即载入浏览器 LocalStorage"
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border shadow-2xs ${
                diskSyncedStatus
                  ? 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-400/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-amber-300'
              }`}
            >
              {diskSyncedStatus ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[11px] truncate max-w-[120px]">已从磁盘加载!</span>
                </>
              ) : (
                <>
                  <RotateCw className={`w-3.5 h-3.5 text-amber-600 ${isSyncingFromDisk ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">从磁盘同步</span>
                </>
              )}
            </button>

            {/* Save & Sync directly to Git codebase */}
            <button
              type="button"
              onClick={handleManualSyncToGit}
              title="将修改即时写入本地 Git 代码文件 (src/data/mockSites.ts 及 data/sites.json)"
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border shadow-2xs ${
                syncedStatus
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {syncedStatus ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>已同步Git!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">存入Git</span>
                </>
              )}
            </button>

            {/* Quick Add Site Button */}
            <button
              type="button"
              onClick={onAddNewSite}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">新增景点</span>
            </button>

            {/* Tools Menu (Export / Import / Print) */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                type="button"
                onClick={onOpenPrintView}
                title="打印或导出 PDF 纯享版"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={exportDataAsJSON}
                title="导出备份 JSON 文件"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors hidden sm:block"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="导入 JSON 行程文件"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors hidden sm:block"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {/* Save & Sync directly to Git codebase / Open Sync Modal */}
            <button
              type="button"
              onClick={handleManualSyncToGit}
              title="同步数据至本地 Git，或打开弹窗复制/导出完整 JSON 数据"
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border shadow-2xs cursor-pointer ${
                syncedStatus
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400/20'
                  : 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border-indigo-200 hover:border-indigo-300'
              }`}
            >
              {syncedStatus ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>已写入Git!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-indigo-600" />
                  <span>存入Git / 同步数据</span>
                </>
              )}
            </button>

            {/* Quick Add Site Button */}
            <button
              type="button"
              onClick={onAddNewSite}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>新增景点</span>
            </button>

          </div>

        </div>

        {/* Mobile Navigation Tabs Bar */}
        <div className="flex md:hidden border-t border-slate-200/80 py-2 justify-around text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onSelectTab('map_plan')}
            className={`py-1 px-2 rounded-lg ${activeTab === 'map_plan' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'}`}
          >
            🗺️ 地图规划
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('sites')}
            className={`py-1 px-2 rounded-lg ${activeTab === 'sites' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'}`}
          >
            🏛️ 景点库
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('itinerary')}
            className={`py-1 px-2 rounded-lg ${activeTab === 'itinerary' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'}`}
          >
            📅 行程
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('checklist')}
            className={`py-1 px-2 rounded-lg ${activeTab === 'checklist' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'}`}
          >
            🎒 清单
          </button>
        </div>

      </div>
    </header>
  );
};
