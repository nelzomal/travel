import React, { useState } from 'react';
import { Site } from '../../types/travel';
import { PhotoGallery } from '../Common/PhotoGallery';
import { FamilyScoreBadge, WalkingIntensityBadge, StairsBadge, WeatherBadge } from '../Common/FamilyBadge';
import { 
  X, MapPin, Clock, DollarSign, ExternalLink, 
  Baby, HeartHandshake, Utensils, CheckCircle2, XCircle, 
  Plus, Edit3, Sparkles, Video, Play, ExternalLink as ExtLinkIcon
} from 'lucide-react';

interface SiteDetailModalProps {
  site: Site | null;
  onClose: () => void;
  onEdit: (site: Site) => void;
  onAddToDay?: (siteId: string) => void;
  onOpenLLMResearch?: (site: Site) => void;
}

export const SiteDetailModal: React.FC<SiteDetailModalProps> = ({
  site,
  onClose,
  onEdit,
  onAddToDay,
  onOpenLLMResearch
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'family' | 'dining' | 'tips'>('overview');
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);

  if (!site) return null;

  const amenityList = [
    { key: 'nursingRoom', label: '独立母婴室 / 哺乳间', icon: '🍼', value: site.amenities.nursingRoom },
    { key: 'diaperChanging', label: '婴儿尿布台', icon: '🚼', value: site.amenities.diaperChanging },
    { key: 'accessibleRestroom', label: '多功能无障碍洗手间', icon: '♿', value: site.amenities.accessibleRestroom },
    { key: 'benchesRestAreas', label: '密集休息座椅 / 长椅', icon: '🪑', value: site.amenities.benchesRestAreas },
    { key: 'elevatorAvailable', label: '直达升降电梯', icon: '🛗', value: site.amenities.elevatorAvailable },
    { key: 'strollerRental', label: '婴儿手推车免费出借/租赁', icon: '🛒', value: site.amenities.strollerRental },
    { key: 'wheelchairRental', label: '长辈轮椅免费借用', icon: '🧑‍🦽', value: site.amenities.wheelchairRental },
    { key: 'shuttleOrCart', label: '园区电瓶代步车 / 接驳', icon: '🚐', value: site.amenities.shuttleOrCart },
    { key: 'shadeAvailable', label: '树荫覆盖 / 防晒遮阳棚', icon: '⛱️', value: site.amenities.shadeAvailable },
    { key: 'indoorRainyDayOption', label: '室内全空调 / 雨天无忧', icon: '☔', value: site.amenities.indoorRainyDayOption },
    { key: 'kidPlayArea', label: '4岁儿童互动探索 / 游乐区', icon: '🛝', value: site.amenities.kidPlayArea },
  ];

  const cleanUrl = (raw: any): string => {
    if (!raw || typeof raw !== 'string') return '';
    const trimmed = raw.trim();
    const mdMatch = trimmed.match(/\[.*?\]\((https?:\/\/[^\s\)]+)\)/);
    if (mdMatch && mdMatch[1]) return mdMatch[1].trim();
    const bracketMatch = trimmed.match(/\[(https?:\/\/[^\]]+)\]/);
    if (bracketMatch && bracketMatch[1]) return bracketMatch[1].trim();
    const plainMatch = trimmed.match(/(https?:\/\/[^\s"'<>\(\)\[\]]+)/);
    if (plainMatch && plainMatch[1]) return plainMatch[1].trim();
    if (trimmed.startsWith('http')) return trimmed;
    return '';
  };

  const rawVideos = site.videos && site.videos.length > 0 ? site.videos.map(cleanUrl).filter(Boolean) : [];
  const siteVideos = rawVideos.length > 0 
    ? rawVideos 
    : [
        'https://vjs.zencdn.net/v/oceans.mp4',
        'https://www.youtube.com/watch?v=GlnVSO8F_oI'
      ];

  const activeVideoUrl = cleanUrl(siteVideos[selectedVideoIdx] || siteVideos[0]);
  const isMp4 = activeVideoUrl.endsWith('.mp4') || activeVideoUrl.endsWith('.webm');

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0`;
      }
      if (url.includes('bilibili.com/video/')) {
        const bvid = url.split('video/')[1]?.split('/')[0]?.split('?')[0];
        if (bvid) return `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0`;
      }
    } catch {
      return url;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-2xl text-lg">
              {site.category === 'museum' ? '🏛️' : site.category === 'temple' ? '⛩️' : site.category === 'park' ? '🐼' : '📍'}
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">{site.name}</h2>
              {site.localName && (
                <p className="text-xs text-slate-500 font-medium">{site.localName} • {site.city}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLLMResearch && (
              <button
                type="button"
                onClick={() => onOpenLLMResearch(site)}
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                title="生成发给其他 LLM 的调研提示词 / 回填数据"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI 智能调研提示词</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onEdit(site)}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              title="编辑此景点"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            概览与高清相册 ({site.gallery.length}张)
          </button>
          
          {/* DEDICATED 4K VIDEO TAB */}
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'videos'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-600" />
            <span>🎬 4K 导览视频 ({siteVideos.length}部)</span>
            <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 text-[10px] rounded-full font-bold">可播放</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('family')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'family'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>👶 三代同堂适宜度 (幼童+长辈)</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-bold">重点</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('tips')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'tips'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            避坑小贴士与开放门票 ({site.familyTips.length})
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('dining')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'dining'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            周边亲子及和食餐厅 ({site.nearbyDining.length})
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ==================== TAB 1: OVERVIEW ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Photo & Video Gallery Component */}
              <PhotoGallery images={site.gallery} videos={siteVideos} title={site.name} />

              {/* Quick Multi-Gen Ratings Snapshot */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gradient-to-r from-indigo-50/70 via-purple-50/70 to-emerald-50/70 rounded-3xl border border-indigo-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚼</span>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-600">推车便利度</p>
                    <p className="text-sm font-bold text-slate-900">{site.strollerRating} / 5 <span className="text-xs text-slate-500 font-normal">({site.strollerRating >= 4 ? '纯平缓坡' : '有少许台阶'})</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-y sm:border-y-0 sm:border-x border-slate-200/80 py-2 sm:py-0 sm:px-3">
                  <span className="text-2xl">🧒</span>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-600">4岁幼童趣味</p>
                    <p className="text-sm font-bold text-slate-900">{site.kidRating} / 5 <span className="text-xs text-slate-500 font-normal">({site.kidRating >= 4 ? '超爱玩' : '适中'})</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:pl-3">
                  <span className="text-2xl">🧓</span>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-600">长辈体力舒适</p>
                    <p className="text-sm font-bold text-slate-900">{site.elderlyRating} / 5 <span className="text-xs text-slate-500 font-normal">({site.elderlyRating >= 4 ? '绿荫多长椅' : '需适度步行'})</span></p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">景点介绍</h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {site.description}
                </p>
              </div>

              {/* Key Logistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Hours & Duration */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
                    <Clock className="w-4 h-4" />
                    <span>开放时间与建议游玩</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium">{site.openingHours}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-slate-500">建议游玩时长:</span>
                    <span className="text-xs font-bold text-indigo-600">约 {site.recommendedDurationMin} 分钟</span>
                  </div>
                </div>

                {/* Admission Fee Breakdown */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                    <DollarSign className="w-4 h-4" />
                    <span>门票价格明细</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-1.5 bg-white rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">成人</p>
                      <p className="font-bold text-slate-800">{site.admissionFee.adult}</p>
                    </div>
                    <div className="p-1.5 bg-white rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">长者(65+)</p>
                      <p className="font-bold text-slate-800">{site.admissionFee.senior}</p>
                    </div>
                    <div className="p-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-[10px] text-emerald-700 font-semibold">4岁幼儿</p>
                      <p className="font-bold text-emerald-800">{site.admissionFee.child4yo}</p>
                    </div>
                  </div>
                  {site.admissionFee.notes && (
                    <p className="text-[11px] text-slate-500 italic mt-1">{site.admissionFee.notes}</p>
                  )}
                </div>
              </div>

              {/* Address & Best Time */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-800">{site.address}</p>
                      <p className="text-[11px] text-slate-400">GPS坐标: {site.coordinates[0]}, {site.coordinates[1]}</p>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${site.coordinates[0]},${site.coordinates[1]}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex-shrink-0 bg-white px-2.5 py-1 rounded-xl border border-indigo-100 shadow-2xs"
                  >
                    <span>Google 地图导航</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">最佳游览时段:</span>
                  <span className="text-slate-800 font-semibold">{site.bestTimeToVisit}</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: DEDICATED 4K VIDEOS TAB ==================== */}
          {activeTab === 'videos' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Main Dedicated Video Player */}
              <div className="relative w-full h-80 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800 flex flex-col items-center justify-center">
                {isMp4 ? (
                  <video
                    src={activeVideoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                    poster={site.coverImage}
                  >
                    您的浏览器暂不支持直接播放该视频。
                  </video>
                ) : (
                  <iframe
                    src={getEmbedUrl(activeVideoUrl)}
                    title={`${site.name} 4K导览视频`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                )}

                {/* Direct Launch Button */}
                <div className="absolute top-4 right-4 z-10">
                  <a
                    href={activeVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center gap-1.5 transition-all hover:scale-105 border border-rose-400/40"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>在新窗口全屏超清播放</span>
                    <ExtLinkIcon className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>
                </div>
              </div>

              {/* Video Cards Selector */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-rose-600" />
                  <span>选择要播放的实景导览视频 (共 {siteVideos.length} 部)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {siteVideos.map((vid, idx) => {
                    const isSelected = idx === selectedVideoIdx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedVideoIdx(idx)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-rose-50/80 border-rose-500 shadow-md ring-2 ring-rose-500/20'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                            <Play className="w-4 h-4 fill-current" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {site.name} — 4K 实景漫步导览 #{idx + 1}
                            </p>
                            <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">{vid}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                          isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isSelected ? '正在播放' : '点击切换'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Family Watching Tips */}
              <div className="p-4 bg-gradient-to-r from-rose-50/70 to-indigo-50/70 rounded-2xl border border-rose-200/60 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">💡 三代同堂出行前视频预热提示：</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  行前在电视或大屏上和 4 岁宝宝一起观看实景视频，提前熟悉展馆动线与小动物，能极大增强小朋友的探索兴趣；长辈也可提前了解步道平缓度与休息区位置。
                </p>
              </div>

            </div>
          )}

          {/* ==================== TAB 3: FAMILY ==================== */}
          {activeTab === 'family' && (
            <div className="space-y-6">
              
              {/* Detailed Multi-Gen Evaluation Cards */}
              <div className="space-y-4">
                
                {/* 1. Stroller Friendliness */}
                <div className="p-4 rounded-3xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚼</span>
                      <div>
                        <h4 className="text-xs font-bold text-indigo-950">婴儿推车与无障碍平缓度</h4>
                        <p className="text-[11px] text-slate-500">平坦度、坡度与电梯配置</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-indigo-600">{site.strollerRating} / 5</span>
                      <span className="block text-[10px] text-slate-500">{site.strollerRating >= 4 ? '推车极便利' : '部分路段有台阶'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 bg-white/80 p-3 rounded-2xl border border-indigo-50 leading-relaxed">
                    {site.strollerNotes}
                  </p>
                </div>

                {/* 2. Kid Engagement */}
                <div className="p-4 rounded-3xl bg-purple-50/50 border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🧒</span>
                      <div>
                        <h4 className="text-xs font-bold text-purple-950">4岁幼童趣味度与安全性</h4>
                        <p className="text-[11px] text-slate-500">互动体验、动物植物、安全围栏与母婴室</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-purple-600">{site.kidRating} / 5</span>
                      <span className="block text-[10px] text-slate-500">{site.kidRating >= 4 ? '4岁孩子超爱' : '适中'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 bg-white/80 p-3 rounded-2xl border border-purple-50 leading-relaxed">
                    {site.kidNotes}
                  </p>
                </div>

                {/* 3. Elderly Comfort */}
                <div className="p-4 rounded-3xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🧓</span>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950">65岁以上长辈体力舒适度</h4>
                        <p className="text-[11px] text-slate-500">步行距离、长椅密度、轮椅借用与长者票</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-emerald-600">{site.elderlyRating} / 5</span>
                      <span className="block text-[10px] text-slate-500">{site.elderlyRating >= 4 ? '轻松省力' : '需适度步行'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 bg-white/80 p-3 rounded-2xl border border-emerald-50 leading-relaxed">
                    {site.elderlyNotes}
                  </p>
                </div>

              </div>

              {/* Physical Intensity Badges */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">🚶 步行运动负荷与台阶情况</h4>
                <div className="flex flex-wrap gap-2">
                  <WalkingIntensityBadge intensity={site.walkingIntensity} />
                  <StairsBadge level={site.stairsLevel} />
                  <WeatherBadge weather={site.weatherSuitability} />
                </div>
              </div>

              {/* Amenities Grid Checklist */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">设施无障碍与亲子便利设施一览</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {amenityList.map((item) => (
                    <div 
                      key={item.key} 
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                        item.value 
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 font-medium' 
                          : 'bg-slate-100/60 border-slate-200/60 text-slate-400 line-through'
                      }`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                      {item.value ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-slate-300 ml-auto flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 4: TIPS ==================== */}
          {activeTab === 'tips' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800">💡 专属避坑与照护贴士</h4>
                <div className="space-y-2.5">
                  {site.familyTips.map((tip, idx) => (
                    <div key={idx} className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex items-start gap-3">
                      <span className="p-1 bg-amber-200/80 text-amber-800 rounded-lg text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-amber-950 leading-relaxed font-medium">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 5: DINING ==================== */}
          {activeTab === 'dining' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800">🍜 周边推荐亲子与长辈友好餐厅</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {site.nearbyDining.map((dine) => (
                  <div key={dine.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-slate-900">{dine.name}</h5>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                        步行 {dine.walkingTimeMin} 分钟
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{dine.cuisine}</p>
                    <div className="pt-1 text-xs text-emerald-800 font-medium bg-emerald-50/60 p-2 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                      <span>👶🧓</span>
                      <span>{dine.familyFeatures}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            关闭
          </button>

          <div className="flex items-center gap-2">
            {onAddToDay && (
              <button
                type="button"
                onClick={() => {
                  onAddToDay(site.id);
                  onClose();
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>加入当日日程排期</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
