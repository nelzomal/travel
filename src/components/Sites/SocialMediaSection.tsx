import React, { useState, useRef, useEffect } from 'react';
import { Site, SocialMediaLink, SocialPlatform } from '../../types/travel';
import { 
  ExternalLink, Plus, Trash2, Eye, RefreshCw, Copy, Check, X, 
  Sparkles, AlertCircle, Image as ImageIcon, Upload, Maximize2, Minimize2,
  Smartphone, Monitor, ZoomIn, ZoomOut, Camera
} from 'lucide-react';

interface SocialMediaSectionProps {
  site: Site;
  onUpdateSite: (updatedSite: Site) => void;
}

export function detectSocialPlatform(url: string): SocialPlatform {
  if (!url) return 'other';
  const lower = url.toLowerCase();
  if (lower.includes('xiaohongshu.com') || lower.includes('xhslink.com')) return 'xiaohongshu';
  if (lower.includes('douyin.com') || lower.includes('iesdouyin.com')) return 'douyin';
  if (lower.includes('bilibili.com') || lower.includes('b23.tv')) return 'bilibili';
  if (lower.includes('dianping.com') || lower.includes('dpurl.cn')) return 'dianping';
  if (lower.includes('weibo.com') || lower.includes('weibo.cn')) return 'weibo';
  if (lower.includes('mp.weixin.qq.com') || lower.includes('weixin.qq.com')) return 'wechat';
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('tiktok.com')) return 'tiktok';
  return 'other';
}

export function getPlatformMeta(platform?: SocialPlatform) {
  switch (platform) {
    case 'xiaohongshu':
      return {
        label: '小红书',
        icon: '📕',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        pillClass: 'bg-rose-600 text-white',
        btnHover: 'hover:border-rose-300 hover:bg-rose-50/50'
      };
    case 'douyin':
      return {
        label: '抖音',
        icon: '🎵',
        badgeClass: 'bg-slate-900 text-white border-slate-700',
        pillClass: 'bg-slate-900 text-white',
        btnHover: 'hover:border-slate-400 hover:bg-slate-50'
      };
    case 'bilibili':
      return {
        label: '哔哩哔哩',
        icon: '📺',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
        pillClass: 'bg-sky-500 text-white',
        btnHover: 'hover:border-sky-300 hover:bg-sky-50/50'
      };
    case 'dianping':
      return {
        label: '大众点评',
        icon: '🍴',
        badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
        pillClass: 'bg-orange-500 text-white',
        btnHover: 'hover:border-orange-300 hover:bg-orange-50/50'
      };
    case 'weibo':
      return {
        label: '新浪微博',
        icon: '👁️',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        pillClass: 'bg-amber-500 text-white',
        btnHover: 'hover:border-amber-300 hover:bg-amber-50/50'
      };
    case 'wechat':
      return {
        label: '微信公众号',
        icon: '💬',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        pillClass: 'bg-emerald-600 text-white',
        btnHover: 'hover:border-emerald-300 hover:bg-emerald-50/50'
      };
    case 'youtube':
      return {
        label: 'YouTube',
        icon: '▶️',
        badgeClass: 'bg-red-50 text-red-700 border-red-200',
        pillClass: 'bg-red-600 text-white',
        btnHover: 'hover:border-red-300 hover:bg-red-50/50'
      };
    case 'instagram':
      return {
        label: 'Instagram',
        icon: '📷',
        badgeClass: 'bg-pink-50 text-pink-700 border-pink-200',
        pillClass: 'bg-pink-600 text-white',
        btnHover: 'hover:border-pink-300 hover:bg-pink-50/50'
      };
    case 'tiktok':
      return {
        label: 'TikTok',
        icon: '🎶',
        badgeClass: 'bg-slate-900 text-white border-slate-700',
        pillClass: 'bg-slate-900 text-white',
        btnHover: 'hover:border-slate-400 hover:bg-slate-50'
      };
    default:
      return {
        label: '网页攻略',
        icon: '🌐',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        pillClass: 'bg-indigo-600 text-white',
        btnHover: 'hover:border-indigo-300 hover:bg-indigo-50/50'
      };
  }
}

// Convert video URLs to embeddable player iframes where available
export function getEmbeddableUrl(url: string, platform?: SocialPlatform): string {
  if (!url) return '';
  const trimmed = url.trim();

  // YouTube
  if (platform === 'youtube' || trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
    }
  }

  // Bilibili
  if (platform === 'bilibili' || trimmed.includes('bilibili.com')) {
    const bvMatch = trimmed.match(/BV[a-zA-Z0-9]+/);
    if (bvMatch) {
      return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&high_quality=1&danmaku=0&autoplay=0`;
    }
  }

  return trimmed;
}

// Utility to compress an image file / dataUrl to reasonable dimensions
function compressImage(base64Str: string, maxDim = 1400, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  site,
  onUpdateSite
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputAuthor, setInputAuthor] = useState('');
  const [inputNote, setInputNote] = useState('');
  const [inputScreenshot, setInputScreenshot] = useState('');
  const [inputPlatform, setInputPlatform] = useState<SocialPlatform>('xiaohongshu');

  // Preview Modal state
  const [activePreviewLink, setActivePreviewLink] = useState<SocialMediaLink | null>(null);
  const [previewTab, setPreviewTab] = useState<'web' | 'screenshot'>('web');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [iframeKey, setIframeKey] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Hidden file inputs
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const cardFileInputRef = useRef<HTMLInputElement>(null);
  const [targetLinkForScreenshot, setTargetLinkForScreenshot] = useState<string | null>(null);

  const links = site.socialMediaLinks || [];

  // When user types URL, auto-detect platform
  const handleUrlChange = (val: string) => {
    setInputUrl(val);
    if (val.trim()) {
      const detected = detectSocialPlatform(val.trim());
      setInputPlatform(detected);
    }
  };

  // Handle image file selection (convert to compressed base64)
  const processImageFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const raw = e.target?.result as string;
        const compressed = await compressImage(raw);
        resolve(compressed);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle paste event (Ctrl+V / Cmd+V) to capture screenshot from clipboard!
  const handleFormPaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          const base64 = await processImageFile(file);
          setInputScreenshot(base64);
          break;
        }
      }
    }
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    const detectedPlatform = inputPlatform || detectSocialPlatform(inputUrl.trim());
    const meta = getPlatformMeta(detectedPlatform);

    // If no screenshot uploaded, provide fallback preview
    const screenshot = inputScreenshot.trim() || undefined;

    const newLink: SocialMediaLink = {
      id: `social-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url: inputUrl.trim(),
      platform: detectedPlatform,
      title: inputTitle.trim() || `${meta.label} 种草推荐`,
      author: inputAuthor.trim() || undefined,
      note: inputNote.trim() || undefined,
      screenshotUrl: screenshot,
      addedAt: new Date().toISOString().slice(0, 10)
    };

    const updatedSite: Site = {
      ...site,
      socialMediaLinks: [...links, newLink]
    };

    onUpdateSite(updatedSite);

    // Reset form
    setInputUrl('');
    setInputTitle('');
    setInputAuthor('');
    setInputNote('');
    setInputScreenshot('');
    setShowAddForm(false);
  };

  const handleDeleteLink = (id: string) => {
    if (!confirm('确定要移除此社交媒体笔记链接吗？')) return;
    const updated = links.filter((l) => l.id !== id);
    onUpdateSite({
      ...site,
      socialMediaLinks: updated
    });
    if (activePreviewLink?.id === id) {
      setActivePreviewLink(null);
    }
  };

  // Attach/Update screenshot for an existing link card
  const handleAttachScreenshotToCard = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetLinkForScreenshot) return;
    const base64 = await processImageFile(file);
    const updated = links.map((item) => {
      if (item.id === targetLinkForScreenshot) {
        return { ...item, screenshotUrl: base64 };
      }
      return item;
    });
    onUpdateSite({
      ...site,
      socialMediaLinks: updated
    });
    if (activePreviewLink?.id === targetLinkForScreenshot) {
      setActivePreviewLink({
        ...activePreviewLink,
        screenshotUrl: base64
      });
    }
    setTargetLinkForScreenshot(null);
    if (cardFileInputRef.current) cardFileInputRef.current.value = '';
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Open as standalone browser window preserving first-party cookies & login session
  const handleOpenStandaloneWindow = (url: string) => {
    const width = 1280;
    const height = 850;
    const left = Math.max(0, (window.screen.width - width) / 2);
    const top = Math.max(0, (window.screen.height - height) / 2);
    window.open(
      url,
      '_blank',
      `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,location=yes,status=no`
    );
  };

  // Open Preview Modal (Defaults to Desktop Wide Screen)
  const handleOpenPreview = (link: SocialMediaLink, defaultTab: 'web' | 'screenshot' = 'web') => {
    setActivePreviewLink(link);
    setPreviewTab(defaultTab);
    setIframeKey((k) => k + 1);
    setZoomScale(1);
    // Default to Desktop Wide Screen (电脑大屏)
    setDeviceMode('desktop');
  };

  return (
    <div className="space-y-6">
      
      {/* Hidden File Input for Card Screenshot Upload */}
      <input
        ref={cardFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAttachScreenshotToCard}
      />

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-rose-50/80 via-purple-50/40 to-indigo-50/80 rounded-2xl border border-rose-200/70 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 text-lg">
            📱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-slate-900">
                社交媒体种草与实操动态
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                已收录 {links.length} 篇
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              支持小红书、抖音、大众点评、B站等博主打卡攻略，支持贴入高清截图与大屏浏览器视窗全景浏览。
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-rose-600/20 transition-all hover:scale-102 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? '收起表单' : '新增社交媒体链接'}</span>
        </button>
      </div>

      {/* Quick Add Form with Screenshot Attachment */}
      {showAddForm && (
        <form 
          onSubmit={handleAddLink}
          onPaste={handleFormPaste}
          className="p-5 bg-white rounded-2xl border-2 border-rose-200 shadow-md space-y-4 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h5 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>添加一篇社交媒体 / 种草博主笔记</span>
            </h5>
            <span className="text-[11px] text-slate-400">支持直接粘贴分享直链与剪贴板截图</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                网页链接 URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="例如: http://xhslink.com/... 或 https://www.xiaohongshu.com/... 或 https://v.douyin.com/..."
                value={inputUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  平台归属
                </label>
                <select
                  value={inputPlatform}
                  onChange={(e) => setInputPlatform(e.target.value as SocialPlatform)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  <option value="xiaohongshu">📕 小红书 (Xiaohongshu)</option>
                  <option value="douyin">🎵 抖音 (Douyin)</option>
                  <option value="dianping">🍴 大众点评 (Dianping)</option>
                  <option value="bilibili">📺 哔哩哔哩 (B站)</option>
                  <option value="weibo">👁️ 新浪微博 (Weibo)</option>
                  <option value="wechat">💬 微信公众号长文</option>
                  <option value="youtube">▶️ YouTube 视频</option>
                  <option value="instagram">📷 Instagram</option>
                  <option value="tiktok">🎶 TikTok</option>
                  <option value="other">🌐 其他旅行攻略网页</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  笔记主题 / 标题
                </label>
                <input
                  type="text"
                  placeholder="例如: 庄河蛤蜊岛赶海避坑实况"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  作者 / 博主名 (选填)
                </label>
                <input
                  type="text"
                  placeholder="例如: @大连遛娃指南"
                  value={inputAuthor}
                  onChange={(e) => setInputAuthor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* SCREENSHOT ATTACHMENT SECTION */}
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-rose-600" />
                  <span>笔记截图 / 封面长图预览 (推荐配置)</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  支持在此处直接按 Cmd+V / Ctrl+V 粘贴截图，或点击上传本地图片
                </span>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="可输入截图图片 URL，或点击右侧上传/直接按 Cmd+V 粘贴..."
                  value={inputScreenshot.startsWith('data:image') ? '【已成功上传/粘贴本地高清截图】' : inputScreenshot}
                  onChange={(e) => {
                    if (!inputScreenshot.startsWith('data:image')) {
                      setInputScreenshot(e.target.value);
                    }
                  }}
                  className="flex-1 w-full px-3 py-2 rounded-xl text-xs border border-slate-300 bg-white"
                />

                <input
                  ref={addFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await processImageFile(file);
                      setInputScreenshot(base64);
                    }
                  }}
                />

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => addFileInputRef.current?.click()}
                    className="flex-1 sm:flex-none px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>上传截图</span>
                  </button>

                  {inputScreenshot && (
                    <button
                      type="button"
                      onClick={() => setInputScreenshot('')}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="清除截图"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Live Preview Thumbnail of uploaded screenshot */}
              {inputScreenshot && (
                <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-slate-200 bg-black/5 shadow-inner mt-2">
                  <img
                    src={inputScreenshot}
                    alt="截图预览"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[10px] rounded font-bold">
                    已加载预览截图
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                核心避坑重点与摘录笔记 (选填)
              </label>
              <textarea
                rows={2}
                placeholder="例如: 博主提到一定要走跨海大堤直达，退潮前1小时去沙滩蛤蜊最多；礁石较湿滑，老人和孩子必须穿包脚防割防滑鞋。"
                value={inputNote}
                onChange={(e) => setInputNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-rose-600/20 transition-all hover:scale-102 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>保存并收录</span>
            </button>
          </div>
        </form>
      )}

      {/* Links List Cards (With Screenshot Thumbnails & Large Preview Buttons) */}
      {links.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((item) => {
            const meta = getPlatformMeta(item.platform);
            const hasScreenshot = Boolean(item.screenshotUrl);

            return (
              <div
                key={item.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-rose-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-3">
                  
                  {/* Card Top: Platform + Author + Date */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1 ${meta.badgeClass}`}>
                        <span>{meta.icon}</span>
                        <span>{meta.label}</span>
                      </span>
                      {item.author && (
                        <span className="text-xs text-slate-600 font-bold">
                          {item.author}
                        </span>
                      )}
                    </div>
                    {item.addedAt && (
                      <span className="text-[10px] text-slate-400">
                        {item.addedAt}
                      </span>
                    )}
                  </div>

                  {/* Screenshot Thumbnail Preview (If available) */}
                  {hasScreenshot ? (
                    <div 
                      onClick={() => handleOpenPreview(item, 'screenshot')}
                      className="group/img relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-inner"
                      title="点击放大查看高清长图与截图详情"
                    >
                      <img
                        src={item.screenshotUrl}
                        alt={item.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-2.5">
                        <span className="text-[11px] text-white font-bold flex items-center gap-1 drop-shadow-md">
                          <Camera className="w-3.5 h-3.5 text-rose-400" />
                          <span>点击全屏查看截图快照</span>
                        </span>
                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[10px] rounded-lg font-bold">
                          📸 高清长图
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-[11px]">暂无截图快照 (可补充上传)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTargetLinkForScreenshot(item.id);
                          cardFileInputRef.current?.click();
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                        <span>上传截图</span>
                      </button>
                    </div>
                  )}

                  {/* Title */}
                  <h5 
                    onClick={() => handleOpenPreview(item, 'web')}
                    className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-rose-600 transition-colors"
                    title="点击打开大屏网页浏览器视窗"
                  >
                    {item.title || '无标题种草攻略'}
                  </h5>

                  {/* Notes / Tips */}
                  {item.note && (
                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200/80 leading-relaxed font-normal">
                      <span className="font-bold text-slate-700 mr-1">📝 笔记重点:</span>
                      {item.note}
                    </div>
                  )}

                  <div className="text-[11px] font-mono text-slate-400 truncate max-w-full">
                    {item.url}
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    
                    {/* Primary Button: Open BIG Webpage Browser */}
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(item, 'web')}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-rose-600/20 transition-all hover:scale-102"
                      title="打开大屏独立浏览器视窗浏览网页"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>全屏大窗浏览</span>
                    </button>

                    {/* Secondary Button: View Screenshot */}
                    {hasScreenshot && (
                      <button
                        type="button"
                        onClick={() => handleOpenPreview(item, 'screenshot')}
                        className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors border border-rose-200/70"
                        title="查看高清长图快照"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>看截图</span>
                      </button>
                    )}

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      title="在新标签页全屏打开此网页"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="hidden sm:inline">新窗口</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetLinkForScreenshot(item.id);
                        cardFileInputRef.current?.click();
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="更新/上传此篇笔记的高清截图"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteLink(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="移除此链接"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50/70 rounded-3xl border-2 border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl">
            📱
          </div>
          <div>
            <h5 className="text-sm font-bold text-slate-800">暂无收录的社交媒体打卡链接</h5>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              您在刷小红书、抖音、大众点评时发现实用的赶海攻略、亲子排雷贴，可点击上方「新增社交媒体链接」贴进来，支持截图与大屏浏览器视窗全景浏览！
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-rose-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>立即添加第一篇</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL-WINDOW BIG BROWSER & SCREENSHOT VIEWER MODAL (REAL BROWSER EXPERIENCE) */}
      {/* ========================================================================= */}
      {activePreviewLink && (
        <div className="fixed inset-0 z-[120] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          
          <div 
            className={`bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden transition-all duration-300 ${
              isFullscreen 
                ? 'w-full h-full rounded-none' 
                : 'w-full max-w-[98vw] h-[94vh] sm:h-[96vh]'
            }`}
          >
            
            {/* Top Browser Window Toolbar */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 select-none">
              
              {/* Left: Traffic Lights & Tab Switch (Web vs Screenshot) */}
              <div className="flex items-center gap-3">
                
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
                  <button 
                    onClick={() => setActivePreviewLink(null)} 
                    className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors" 
                    title="关闭"
                  />
                  <button 
                    onClick={() => setDeviceMode(deviceMode === 'desktop' ? 'mobile' : 'desktop')} 
                    className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors" 
                    title="切换移动/桌面视图"
                  />
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)} 
                    className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors" 
                    title="切换全屏模式"
                  />
                </div>

                {/* View Tabs: 🌐 实时网页 vs 📸 高清长图截图 */}
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPreviewTab('web')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      previewTab === 'web'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🌐 实时网页</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewTab('screenshot')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      previewTab === 'screenshot'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>📸 高清截图</span>
                    {activePreviewLink.screenshotUrl && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                </div>

                {/* Device Mode Switcher (Only in Web mode) */}
                {previewTab === 'web' && (
                  <div className="hidden md:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold text-slate-400">
                    <button
                      type="button"
                      onClick={() => setDeviceMode('desktop')}
                      className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                        deviceMode === 'desktop' ? 'bg-slate-800 text-white' : 'hover:text-white'
                      }`}
                      title="电脑宽屏全景浏览"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>电脑大屏</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeviceMode('mobile')}
                      className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                        deviceMode === 'mobile' ? 'bg-slate-800 text-white' : 'hover:text-white'
                      }`}
                      title="手机竖屏真机视窗 (最适合小红书/抖音等短图文)"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>手机竖屏</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Center: Real Browser Address Bar */}
              <div className="flex-1 max-w-xl mx-auto flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-inner">
                <span className="text-slate-500">🔒</span>
                <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 text-[10px] rounded font-bold flex-shrink-0">
                  {getPlatformMeta(activePreviewLink.platform).icon} {getPlatformMeta(activePreviewLink.platform).label}
                </span>
                <span className="text-white font-semibold truncate max-w-[120px] sm:max-w-[200px]">
                  {activePreviewLink.title}
                </span>
                <span className="text-slate-500 font-mono truncate hidden lg:inline flex-1 text-[11px]">
                  {activePreviewLink.url}
                </span>
              </div>

              {/* Right: Quick Tools & Fullscreen Toggle */}
              <div className="flex items-center gap-1.5 justify-end">
                {previewTab === 'web' && (
                  <button
                    type="button"
                    onClick={() => setIframeKey((k) => k + 1)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-xs flex items-center gap-1 transition-colors"
                    title="刷新网页"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleCopyLink(activePreviewLink.url)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-xs flex items-center gap-1 transition-colors"
                  title="复制网页直链"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenStandaloneWindow(activePreviewLink.url)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all hidden sm:flex"
                  title="以独立原生小窗打开（直接继承您当前浏览器的已登录Cookie与账号状态）"
                >
                  <span>独立小窗 (含登录态)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <a
                  href={activePreviewLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                  title="在新标签页全屏打开"
                >
                  <span>新标签页打开</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors hidden sm:block"
                  title={isFullscreen ? '退出全屏' : '展开至全屏沉浸视窗'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActivePreviewLink(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                  title="关闭浏览器视窗"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Note Sub-Bar (If available) */}
            {activePreviewLink.note && (
              <div className="bg-slate-950/90 px-4 py-2 border-b border-slate-800 flex items-center gap-2 text-xs text-slate-300">
                <span className="font-bold text-amber-400 flex-shrink-0">📝 笔记备忘:</span>
                <span className="truncate">{activePreviewLink.note}</span>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative flex flex-col items-center justify-center bg-slate-950">
              
              {/* ======================================== */}
              {/* MODE 1: LIVE WEBPAGE BROWSER (BIG SCREEN) */}
              {/* ======================================== */}
              {previewTab === 'web' && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  
                  {/* Cross-Origin Friendly Top Banner */}
                  <div className="w-full bg-slate-900/90 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                    <div className="flex items-center gap-2 truncate">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate">
                        小红书/抖音等移动端页面若被浏览器同源策略限制，可切换至「📸 高清截图」或点击右侧全屏打开。
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {activePreviewLink.screenshotUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewTab('screenshot')}
                          className="text-emerald-400 hover:underline font-bold"
                        >
                          切换到高清截图 ↗
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenStandaloneWindow(activePreviewLink.url)}
                        className="text-amber-300 hover:text-amber-200 font-bold underline"
                      >
                        以独立小窗打开 (直接带登录态) ↗
                      </button>
                      <a
                        href={activePreviewLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-400 hover:text-rose-300 font-bold underline"
                      >
                        新标签页打开 ↗
                      </a>
                    </div>
                  </div>

                  {/* Viewport Frame */}
                  <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl bg-white flex flex-col ${
                        deviceMode === 'mobile'
                          ? 'w-[440px] max-w-full border-4 border-slate-700 ring-4 ring-black/40'
                          : 'w-full border border-slate-800'
                      }`}
                    >
                      {deviceMode === 'mobile' && (
                        <div className="bg-slate-900 py-1.5 px-4 flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 flex-shrink-0 select-none">
                          <span>09:41</span>
                          <span className="w-14 h-3 bg-black rounded-full" />
                          <span>5G 100%</span>
                        </div>
                      )}
                      <iframe
                        key={iframeKey}
                        src={getEmbeddableUrl(activePreviewLink.url, activePreviewLink.platform)}
                        title={activePreviewLink.title}
                        className="w-full flex-1 border-0 bg-white"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================== */}
              {/* MODE 2: HIGH-DEFINITION SCREENSHOT VIEWER */}
              {/* ======================================== */}
              {previewTab === 'screenshot' && (
                <div className="w-full h-full flex flex-col">
                  
                  {/* Screenshot Toolbar */}
                  <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-rose-500" />
                      <span className="font-bold text-white">高清长图 / 笔记快照</span>
                      <span className="text-[11px] text-slate-500">免登录直接查看</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setZoomScale(Math.max(0.5, zoomScale - 0.2))}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                        title="缩小"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono font-bold w-12 text-center">
                        {Math.round(zoomScale * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setZoomScale(Math.min(3, zoomScale + 0.2))}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                        title="放大"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomScale(1)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors ml-1"
                      >
                        复位
                      </button>

                      {/* Replace Screenshot */}
                      <button
                        type="button"
                        onClick={() => {
                          setTargetLinkForScreenshot(activePreviewLink.id);
                          cardFileInputRef.current?.click();
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ml-2"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>更换截图</span>
                      </button>
                    </div>
                  </div>

                  {/* Screenshot Image Container */}
                  <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center">
                    {activePreviewLink.screenshotUrl ? (
                      <div 
                        className="transition-transform duration-200 shadow-2xl rounded-2xl overflow-hidden bg-white max-w-4xl"
                        style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
                      >
                        <img
                          src={activePreviewLink.screenshotUrl}
                          alt={activePreviewLink.title}
                          className="w-full h-auto object-contain select-none"
                        />
                      </div>
                    ) : (
                      <div className="my-auto p-8 text-center bg-slate-900/80 rounded-3xl border border-slate-800 max-w-md space-y-4">
                        <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto text-2xl">
                          📸
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">尚未为此篇笔记上传截图</h4>
                          <p className="text-xs text-slate-400 mt-1">
                            您可截取小红书或手机上的攻略图，直接点击下方按钮上传或粘贴，即可永久保存免登录查看！
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setTargetLinkForScreenshot(activePreviewLink.id);
                            cardFileInputRef.current?.click();
                          }}
                          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
                        >
                          <Upload className="w-4 h-4" />
                          <span>立即上传此笔记截图</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
