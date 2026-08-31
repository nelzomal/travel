import React, { useState, useEffect } from 'react';
import { Site } from '../../types/travel';
import { PhotoGallery } from '../Common/PhotoGallery';
import { FamilyScoreBadge, WalkingIntensityBadge, StairsBadge, WeatherBadge } from '../Common/FamilyBadge';
import { SiteCollaborationReview } from './SiteCollaborationReview';
import { 
  X, MapPin, Clock, DollarSign, ExternalLink, 
  Baby, HeartHandshake, Utensils, CheckCircle2, XCircle, 
  Plus, Edit3, Sparkles, Video, Play, Users, MessageSquare, ExternalLink as ExtLinkIcon
} from 'lucide-react';

interface SiteDetailModalProps {
  site: Site | null;
  onClose: () => void;
  onEdit: (site: Site) => void;
  onUpdateSite?: (updatedSite: Site) => void;
  onAddToDay?: (siteId: string) => void;
  onOpenLLMResearch?: (site: Site) => void;
  initialTab?: 'overview' | 'collaboration' | 'videos' | 'family' | 'dining' | 'tips';
}

export const SiteDetailModal: React.FC<SiteDetailModalProps> = ({
  site,
  onClose,
  onEdit,
  onUpdateSite,
  onAddToDay,
  onOpenLLMResearch,
  initialTab
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'collaboration' | 'videos' | 'family' | 'dining' | 'tips'>('overview');
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);

  // Check url params for review tab
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    } else if (window.location.hash.includes('review=1')) {
      setActiveTab('collaboration');
    }
  }, [initialTab, site?.id]);

  if (!site) return null;

  const reviewsCount = site.reviews?.length || 0;

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
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {site.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {site.localName || site.address} • {site.city}
              </p>
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
            概览与实景相册 ({site.gallery.length}张)
          </button>

          {/* 2-PERSON COLLABORATION TAB */}
          <button
            type="button"
            onClick={() => setActiveTab('collaboration')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'collaboration'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>👥 双人协同评分 ({reviewsCount === 2 ? '2人已评' : reviewsCount === 1 ? '1人已评' : '待评分'})</span>
            {reviewsCount === 2 ? (
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-bold">已达成</span>
            ) : (
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded-full font-bold">待打分</span>
            )}
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
            避坑小贴士与门票 ({site.familyTips.length})
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
            周边亲子和食餐厅 ({site.nearbyDining.length})
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ==================== TAB: COLLABORATION REVIEWS ==================== */}
          {activeTab === 'collaboration' && (
            <SiteCollaborationReview 
              site={site} 
              onUpdateSite={onUpdateSite || (() => {})} 
            />
          )}

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
                    <div className="text-[10px] text-slate-500 font-bold uppercase">推车便利度</div>
                    <div className="text-sm font-black text-emerald-800">{site.strollerRating} / 5 分</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">👶</span>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">4岁孩子趣味</div>
                    <div className="text-sm font-black text-amber-800">{site.kidRating} / 5 分</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧓</span>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">长辈体力友好</div>
                    <div className="text-sm font-black text-indigo-800">{site.elderlyRating} / 5 分</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">景点介绍</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                  {site.description}
                </p>
              </div>

              {/* Key Logistics Quick Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>开放时间与建议时长</span>
                  </div>
                  <p className="text-xs text-slate-600"><strong>建议游玩：</strong>约 {site.recommendedDurationMin} 分钟</p>
                  <p className="text-xs text-slate-600"><strong>营业开放：</strong>{site.openingHours}</p>
                  <p className="text-xs text-slate-600"><strong>最佳时段：</strong>{site.bestTimeToVisit}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>门票与三代优惠政策</span>
                  </div>
                  <p className="text-xs text-slate-600"><strong>成人票：</strong>{site.admissionFee.adult}</p>
                  <p className="text-xs text-slate-600"><strong>长辈优待：</strong>{site.admissionFee.senior}</p>
                  <p className="text-xs text-slate-600"><strong>4岁幼童：</strong><span className="text-emerald-700 font-bold">{site.admissionFee.child4yo}</span></p>
                  {site.admissionFee.notes && (
                    <p className="text-[11px] text-slate-500 italic">注: {site.admissionFee.notes}</p>
                  )}
                </div>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-2 pt-2">
                <WalkingIntensityBadge intensity={site.walkingIntensity} />
                <StairsBadge level={site.stairsLevel} />
                <WeatherBadge weather={site.weatherSuitability} />
              </div>
            </div>
          )}

          {/* ==================== TAB 2: DEDICATED 4K VIDEOS ==================== */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-600" />
                  <span>4K 沉浸式实景漫步与官方导览 ({siteVideos.length} 部)</span>
                </h4>
                <p className="text-xs text-slate-500">
                  出游前与家人一起观看实拍视频，提前熟悉现场地形、推车动线与步道平整度。
                </p>
              </div>

              {/* Video Player Display */}
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-xl border border-slate-800 flex items-center justify-center">
                {isMp4 ? (
                  <video
                    src={activeVideoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  >
                    您的浏览器不支持直接播放该视频。
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
              </div>

              {/* Video Selector Pills & External Link */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-700 mr-1">选择片段:</span>
                  {siteVideos.map((vid, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVideoIdx(idx)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        selectedVideoIdx === idx
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{vid.endsWith('.mp4') ? `⚡ 直链超清短片 ${idx + 1}` : `📺 4K漫步实拍 ${idx + 1}`}</span>
                    </button>
                  ))}
                </div>

                <a
                  href={activeVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>在独立窗口全屏观看</span>
                  <ExtLinkIcon className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          )}

          {/* ==================== TAB 3: FAMILY & ACCESSIBILITY ==================== */}
          {activeTab === 'family' && (
            <div className="space-y-6">
              
              {/* Detailed Multi-Gen Notes Cards */}
              <div className="space-y-3">
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900">
                    <Baby className="w-4 h-4 text-amber-600" />
                    <span>4岁幼童专属评价 (趣味度与安全) ★ {site.kidRating}/5</span>
                  </div>
                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    {site.kidNotes || '该景点空间开阔，趣味性高，非常适合幼童探索与亲子互动。'}
                  </p>
                </div>

                <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-900">
                    <HeartHandshake className="w-4 h-4 text-indigo-600" />
                    <span>长辈专属评价 (体力舒适与休息座椅) ★ {site.elderlyRating}/5</span>
                  </div>
                  <p className="text-xs text-indigo-900/90 leading-relaxed">
                    {site.elderlyNotes || '步道平缓，遮荫良好，配有充足的长椅与平地无障碍设施。'}
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900">
                    <span className="text-base">🚼</span>
                    <span>婴儿手推车通行实况 ★ {site.strollerRating}/5</span>
                  </div>
                  <p className="text-xs text-emerald-900/90 leading-relaxed">
                    {site.strollerNotes || '主路全平坦无障碍，推车通行极为顺畅。'}
                  </p>
                </div>
              </div>

              {/* 11 Amenities Checklist Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  三代同堂关键设施完备度 (11 项无障碍与母婴保障)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {amenityList.map((item) => (
                    <div
                      key={item.key}
                      className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                        item.value
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-800 font-semibold'
                          : 'bg-slate-50 border-slate-200/70 text-slate-400 line-through'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.value ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 4: TIPS & LOGISTICS ==================== */}
          {activeTab === 'tips' && (
            <div className="space-y-6">
              
              {/* Family Tips List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  带娃与长辈实操避坑贴士 ({site.familyTips.length} 条)
                </h4>
                <div className="space-y-2.5">
                  {site.familyTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="text-amber-600 font-bold mt-0.5">💡</span>
                      <span className="flex-1">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Custom Fields */}
              {site.customFields && Object.keys(site.customFields).length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    自定义补充信息
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(site.customFields).map(([key, val]) => (
                      <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="font-bold text-slate-600">{key}: </span>
                        <span className="text-slate-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Address & Official Website Link */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>{site.address}</span>
                </div>
                {site.websiteUrl && (
                  <a
                    href={site.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline font-bold flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>官方网站</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

            </div>
          )}

          {/* ==================== TAB 5: NEARBY DINING ==================== */}
          {activeTab === 'dining' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  周边和食与亲子餐厅推荐 ({site.nearbyDining.length} 处)
                </h4>
                <p className="text-xs text-slate-500">
                  特别筛选适合4岁幼童（宝宝椅/儿童餐/乌冬面）与长辈（清淡和食/不油腻/长椅包间）的周边步行餐厅。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {site.nearbyDining.map((dine) => (
                  <div
                    key={dine.id}
                    className="p-4 bg-slate-50 hover:bg-indigo-50/40 rounded-2xl border border-slate-200 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Utensils className="w-4 h-4 text-indigo-600" />
                        <span>{dine.name}</span>
                      </h5>
                      <span className="px-2 py-0.5 bg-white text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100 shadow-2xs">
                        步行 {dine.walkingTimeMin} 分钟
                      </span>
                    </div>

                    <p className="text-xs text-slate-600"><strong>菜系品类：</strong>{dine.cuisine}</p>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-100 text-[11px] text-slate-700 leading-relaxed">
                      <span className="font-bold text-indigo-600 mr-1">👶👵 适老适幼特色:</span>
                      {dine.familyFeatures}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            {site.customTags.map((tag) => `#${tag}`).join(' ')}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {onAddToDay && (
              <button
                type="button"
                onClick={() => {
                  onAddToDay(site.id);
                  onClose();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                <span>+ 加入当日行程</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs transition-colors"
            >
              关闭
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
