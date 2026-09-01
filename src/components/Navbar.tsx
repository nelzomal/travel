import React, { useRef, useState } from 'react';
import { Trip } from '../types/travel';
import { 
  Plus, Printer, Download, Upload, RotateCcw, Share2, Check, Save, GitBranch, X, Copy
} from 'lucide-react';
import { exportDataAsJSON, importDataFromJSON, syncToFilesystem, getExportDataJSONString } from '../services/storage';

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
  onResetDefaults: () => void;
  onDataImported: () => void;
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
  onResetDefaults,
  onDataImported
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [syncedStatus, setSyncedStatus] = useState<string | null>(null);

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

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
        setSyncedStatus('已成功同步写入本地 Git 文件！');
      } else {
        setSyncedStatus(res.message || '同步完成');
      }
      setTimeout(() => setSyncedStatus(null), 3000);
    } else {
      setShowSyncModal(true);
    }
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

              <button
                type="button"
                onClick={() => {
                  if (confirm('是否重置为默认推荐的日本全景三代同堂亲子游？')) {
                    onResetDefaults();
                  }
                }}
                title="恢复默认推荐示例行程"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors hidden lg:block"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onSelectTab('map_plan')}
            className={`py-1 px-2 rounded-lg ${activeTab === 'map_plan' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'}`}
          >
            🗺️ 地图
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('sites')}
            className={`py-1 px-2 rounded-lg ${activeTab === 'sites' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'}`}
          >
            🏛️ 景点
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

      {/* SYNC TO GIT MODAL (For Cloudflare Pages / Static Hosting) */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
                  💾
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">同步线上修改至本地 Git</h3>
                  <p className="text-xs text-slate-500">线上部署运行于纯静态云端，修改暂存于您当前浏览器的本地存储</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSyncModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs space-y-2.5 text-slate-700">
              <p className="font-bold text-slate-900">推荐同步方式：</p>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">1</span>
                <p>点击下方 <strong>「一键复制全部数据 JSON」</strong> 按钮；</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">2</span>
                <p>在 AI 对话框中直接粘贴发送，AI 助手将全量写入本地 Git 代码库并即刻提交！</p>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center gap-2 text-slate-500 text-[11px]">
                <span>💡</span>
                <span>也可以在电脑浏览器打开本地版 <strong>http://localhost:5173</strong>，点击顶部的「📤 导入」直接生效。</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(getExportDataJSONString());
                  setCopiedJson(true);
                  setTimeout(() => setCopiedJson(false), 3000);
                }}
                className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>已复制全部数据 JSON 到剪贴板！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>📋 一键复制全部数据 JSON</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={exportDataAsJSON}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>下载 JSON 文件</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
