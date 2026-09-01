import React, { useState } from 'react';
import { Site, SocialMediaLink, SocialPlatform } from '../../types/travel';
import { 
  ExternalLink, Plus, Trash2, Eye, RefreshCw, Copy, Check, X, 
  Sparkles, AlertCircle
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

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  site,
  onUpdateSite
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputAuthor, setInputAuthor] = useState('');
  const [inputNote, setInputNote] = useState('');
  const [inputPlatform, setInputPlatform] = useState<SocialPlatform>('xiaohongshu');

  // Preview state
  const [activePreviewLink, setActivePreviewLink] = useState<SocialMediaLink | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const links = site.socialMediaLinks || [];

  // When user types URL, auto-detect platform
  const handleUrlChange = (val: string) => {
    setInputUrl(val);
    if (val.trim()) {
      const detected = detectSocialPlatform(val.trim());
      setInputPlatform(detected);
    }
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    const detectedPlatform = inputPlatform || detectSocialPlatform(inputUrl.trim());
    const meta = getPlatformMeta(detectedPlatform);

    const newLink: SocialMediaLink = {
      id: `social-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url: inputUrl.trim(),
      platform: detectedPlatform,
      title: inputTitle.trim() || `${meta.label} 种草推荐`,
      author: inputAuthor.trim() || undefined,
      note: inputNote.trim() || undefined,
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

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6">
      
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
              支持小红书、抖音、大众点评、B站等博主打卡攻略，点击即可在画中画直接加载网页预览。
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

      {/* Quick Add Form */}
      {showAddForm && (
        <form 
          onSubmit={handleAddLink}
          className="p-5 bg-white rounded-2xl border-2 border-rose-200 shadow-md space-y-4 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h5 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>添加一篇社交媒体 / 种草博主笔记</span>
            </h5>
            <span className="text-[11px] text-slate-400">支持直接粘贴分享直链，系统将自动识别平台</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                网页链接 URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="例如: http://xhslink.com/... 或 https://v.douyin.com/... 或 https://www.bilibili.com/..."
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

      {/* Links List Cards */}
      {links.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {links.map((item) => {
            const meta = getPlatformMeta(item.platform);
            const isPreviewing = activePreviewLink?.id === item.id;

            return (
              <div
                key={item.id}
                className={`p-4 bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  isPreviewing
                    ? 'border-rose-500 ring-2 ring-rose-400/20 shadow-md bg-rose-50/20'
                    : 'border-slate-200 hover:border-rose-300 hover:shadow-md'
                }`}
              >
                <div className="space-y-2">
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

                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {item.title || '无标题种草攻略'}
                  </h5>

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
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePreviewLink(item);
                        setIframeKey((prev) => prev + 1);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        isPreviewing
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/70'
                      }`}
                      title="在下方内置窗口中直接加载预览此网页"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isPreviewing ? '正在预览' : '网页即时预览'}</span>
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      title="在新标签页全屏打开此网页"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="hidden sm:inline">新窗口</span>
                    </a>
                  </div>

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
              您在刷小红书、抖音、大众点评时发现实用的赶海攻略、亲子排雷贴，可点击上方「新增社交媒体链接」贴进来，支持画中画即时加载预览！
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

      {/* ==================== IN-PAGE WEBPAGE PREVIEWER ==================== */}
      {activePreviewLink && (
        <div className="p-4 sm:p-5 bg-slate-950 text-white rounded-3xl shadow-2xl border border-slate-800 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Browser-like Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 min-w-0">
              <span className="p-1 bg-slate-800 rounded-lg text-sm flex-shrink-0">
                {getPlatformMeta(activePreviewLink.platform).icon}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                    {activePreviewLink.title}
                  </span>
                  <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 text-[10px] rounded font-medium flex-shrink-0">
                    {getPlatformMeta(activePreviewLink.platform).label}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs sm:max-w-md">
                  {activePreviewLink.url}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIframeKey((k) => k + 1)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1 transition-colors"
                title="重新加载网页"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">刷新</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyLink(activePreviewLink.url)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1 transition-colors"
                title="复制网页直链"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline text-[11px]">{copiedUrl ? '已复制' : '复制直链'}</span>
              </button>

              <a
                href={activePreviewLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
              >
                <span>在新标签页打开</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setActivePreviewLink(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="关闭预览窗口"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cross-Origin Friendly Tip Banner */}
          <div className="flex items-start gap-2 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-300">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>部分平台（如小红书、抖音、大众点评）因浏览器的同源跨域安全策略，可能会阻止在网页内画中画直接加载。</span>
              <a
                href={activePreviewLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:text-rose-300 font-bold underline ml-1 inline-flex items-center gap-0.5"
              >
                点此直接在新标签页全屏打开 ↗
              </a>
            </div>
          </div>

          {/* Iframe Viewport */}
          <div className="relative w-full h-[540px] sm:h-[620px] rounded-2xl overflow-hidden bg-white shadow-2xl">
            <iframe
              key={iframeKey}
              src={getEmbeddableUrl(activePreviewLink.url, activePreviewLink.platform)}
              title={activePreviewLink.title}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              loading="lazy"
            />
          </div>
        </div>
      )}

    </div>
  );
};
