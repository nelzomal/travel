import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Download, Check, Database } from 'lucide-react';
import { getExportDataJSONString, exportDataAsJSON, getStoredSites, getStoredTrips } from '../services/storage';

interface SyncToGitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyncToGitModal: React.FC<SyncToGitModalProps> = ({ isOpen, onClose }) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const sitesCount = getStoredSites().length;
  const tripsCount = getStoredTrips().length;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/75 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center min-h-screen"
      onClick={onClose}
      style={{ margin: 0 }}
    >
      <div
        className="relative w-full max-w-lg my-auto max-h-[calc(100vh-2.5rem)] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-2xs">
              💾
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">同步线上修改至本地 Git</h3>
              <p className="text-xs text-slate-500">线上修改暂存于当前浏览器，可一键复制 JSON 同步回 Git</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="关闭 (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1">
          {/* Data Summary Pill */}
          <div className="flex items-center justify-between p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-indigo-900">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-xs">当前暂存总数据：</span>
            </div>
            <span className="px-2.5 py-1 bg-white rounded-xl border border-indigo-200 font-bold text-[11px] text-indigo-700 shadow-2xs">
              🏛️ {sitesCount} 个景点 · 🗺️ {tripsCount} 条行程
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
            <p className="font-bold text-slate-900 text-sm">推荐同步步骤：</p>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">1</span>
              <p className="leading-relaxed">点击下方 <strong className="text-indigo-600 font-bold">「一键复制全部数据 JSON」</strong> 按钮；</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">2</span>
              <p className="leading-relaxed">在 AI 对话框中直接粘贴发送，AI 助手将全量写入本地 Git 代码库并即刻提交！</p>
            </div>
            <div className="pt-2.5 border-t border-slate-200 flex items-start gap-2 text-slate-500 text-[11px]">
              <span className="mt-0.5">💡</span>
              <span>也可以在电脑打开本地版 <code className="bg-slate-200/80 px-1 py-0.5 rounded text-slate-800 font-mono">http://localhost:5173</code>，点击顶部的「📤 导入」上传导出的 JSON。</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div className="p-5 sm:p-6 pt-3 border-t border-slate-100 flex-shrink-0 flex flex-col sm:flex-row gap-2.5 bg-slate-50/40">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(getExportDataJSONString());
              setCopiedJson(true);
              setTimeout(() => setCopiedJson(false), 3000);
            }}
            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
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
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>下载 JSON 文件</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
