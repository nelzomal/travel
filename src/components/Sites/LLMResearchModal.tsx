import React, { useState } from 'react';
import { Site, Trip } from '../../types/travel';
import { 
  X, Copy, Check, Sparkles, Bot, 
  Download, FileText, CheckCircle2, AlertCircle, RefreshCw,
  Plus, Trash2, SlidersHorizontal, Image as ImageIcon, Video, Play, Wand2, MapPin
} from 'lucide-react';
import { getSmartCuratedMediaForSite } from '../../utils/photoCurator';
import { 
  generateSiteResearchPrompt, 
  parseLLMReply, 
  getDefaultCustomFields, 
  CustomFieldDef 
} from '../../utils/llmSiteResearch';

interface LLMResearchModalProps {
  site: Site | null;
  trip?: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSite: (updatedSite: Site) => void;
}

export const LLMResearchModal: React.FC<LLMResearchModalProps> = ({
  site,
  trip,
  isOpen,
  onClose,
  onUpdateSite
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'import' | 'media'>('prompt');
  const [copied, setCopied] = useState(false);
  const [llmOutputText, setLlmOutputText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  const [customFields, setCustomFields] = useState<CustomFieldDef[]>([
    { key: 'rainyDayPlan', label: '🌧️ 雨天/恶劣天气备选方案', example: '下雨时可直接前往的室内馆区或替代商场' },
    { key: 'ticketBookingTip', label: '🎟️ 门票预约与免排队技巧', example: '是否需提前在官网抢票？有无长者/推车优先绿色通道？' },
    { key: 'parkingAndDropoff', label: '🚗 包车/打车/自驾上下客与停车便利度', example: '下车点距离主入口几米？是否需爬楼梯？' }
  ]);

  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [showAddField, setShowAddField] = useState(false);

  // Social media research options
  const [enableSocialResearch, setEnableSocialResearch] = useState(false);
  const [socialPlatforms, setSocialPlatforms] = useState<('xiaohongshu' | 'bilibili')[]>(['xiaohongshu', 'bilibili']);

  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [customCoverUrl, setCustomCoverUrl] = useState(site?.coverImage || '');

  // Keep customCoverUrl synchronized when site changes
  React.useEffect(() => {
    if (site?.coverImage) {
      setCustomCoverUrl(site.coverImage);
    }
  }, [site?.coverImage]);

  if (!isOpen || !site) return null;

  const destination = trip?.destination || (site.city === '大连' ? '中国 · 大连' : '日本');
  const tripTitle = trip?.title || `${site.city || destination}慢游之旅`;

  const isDalian = site.city.includes('大连') || destination.includes('大连') || trip?.id === 'trip-dalian-coastal-multigen-2026' || site.id.startsWith('site-dalian-');
  const isJapan = !isDalian && (destination.includes('日本') || site.city.includes('东京') || site.city.includes('京都') || site.city.includes('箱根') || site.city.includes('富士山'));

  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const key = newFieldKey.trim() || `custom_${Date.now()}`;
    setCustomFields([...customFields, { key, label: newFieldLabel.trim(), example: '详细调研说明' }]);
    setNewFieldKey('');
    setNewFieldLabel('');
    setShowAddField(false);
  };

  const handleRemoveCustomField = (key: string) => {
    setCustomFields(customFields.filter((f) => f.key !== key));
  };

  const handleResetDefaultFields = () => {
    setCustomFields(getDefaultCustomFields(destination, isDalian));
  };

  const handleQuickAddPredefined = (label: string, key: string, example: string) => {
    if (customFields.some((f) => f.key === key)) return;
    setCustomFields([...customFields, { key, label, example }]);
  };

  // 1-Click Smart Auto-Curate & Fix media
  const handleAutoCurateMedia = () => {
    const curated = getSmartCuratedMediaForSite(site);
    const updated: Site = {
      ...site,
      coverImage: curated.coverImage || site.coverImage,
      gallery: curated.gallery.length > 0 ? curated.gallery : site.gallery,
      videos: (curated.videos && curated.videos.length > 0) ? curated.videos : (site.videos || [])
    };
    onUpdateSite(updated);
    setImportStatus({
      success: true,
      message: `已自动为「${site.name}」修复并应用 ${curated.gallery.length} 张高清实景相册与 ${curated.videos.length} 部导览视频！`
    });
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    const updated: Site = {
      ...site,
      gallery: [...site.gallery, newGalleryUrl.trim()]
    };
    onUpdateSite(updated);
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (urlToRemove: string) => {
    const updated: Site = {
      ...site,
      gallery: site.gallery.filter((g) => g !== urlToRemove)
    };
    onUpdateSite(updated);
  };

  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) return;
    const currentVideos = site.videos || [];
    const updated: Site = {
      ...site,
      videos: [...currentVideos, newVideoUrl.trim()]
    };
    onUpdateSite(updated);
    setNewVideoUrl('');
  };

  const handleRemoveVideo = (urlToRemove: string) => {
    const currentVideos = site.videos || [];
    const updated: Site = {
      ...site,
      videos: currentVideos.filter((v) => v !== urlToRemove)
    };
    onUpdateSite(updated);
  };

  const generatePrompt = () => {
    return generateSiteResearchPrompt({
      siteName: site.name,
      localName: site.localName,
      city: site.city,
      category: site.category,
      address: site.address,
      trip,
      customFields,
      siteId: site.id,
      existingCoverImage: customCoverUrl || site.coverImage,
      enableSocialResearch,
      socialPlatforms
    });
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Smart JSON & Text Parser for LLM output (supporting 8-10 photos and 1-2 videos)
  const handleParseAndApply = () => {
    setImportStatus(null);
    if (!llmOutputText.trim()) {
      setImportStatus({ success: false, message: '请先粘贴 LLM 的回复内容或 JSON 代码块！' });
      return;
    }

    const result = parseLLMReply(llmOutputText, site);
    if (!result.success || !result.data) {
      setImportStatus({ success: false, message: result.message });
      return;
    }

    const parsed = result.data;
    const updatedSite: Site = {
      ...site,
      name: parsed.name || site.name,
      localName: parsed.localName !== undefined ? parsed.localName : site.localName,
      description: parsed.description || site.description,
      coverImage: parsed.coverImage || site.coverImage,
      gallery: parsed.gallery && parsed.gallery.length > 0 ? parsed.gallery : site.gallery,
      videos: parsed.videos && parsed.videos.length > 0 ? parsed.videos : (site.videos || []),
      recommendedDurationMin: Number(parsed.recommendedDurationMin) || site.recommendedDurationMin,
      openingHours: parsed.openingHours || site.openingHours,
      admissionFee: {
        adult: parsed.admissionFee?.adult || site.admissionFee.adult,
        senior: parsed.admissionFee?.senior || site.admissionFee.senior,
        child4yo: parsed.admissionFee?.child4yo || site.admissionFee.child4yo,
        notes: parsed.admissionFee?.notes !== undefined ? parsed.admissionFee.notes : site.admissionFee.notes
      },
      bestTimeToVisit: parsed.bestTimeToVisit || site.bestTimeToVisit,
      weatherSuitability: parsed.weatherSuitability || site.weatherSuitability,
      strollerRating: parsed.strollerRating || site.strollerRating,
      strollerNotes: parsed.strollerNotes || site.strollerNotes,
      kidRating: parsed.kidRating || site.kidRating,
      kidNotes: parsed.kidNotes || site.kidNotes,
      elderlyRating: parsed.elderlyRating || site.elderlyRating,
      elderlyNotes: parsed.elderlyNotes || site.elderlyNotes,
      walkingIntensity: parsed.walkingIntensity || site.walkingIntensity,
      stairsLevel: parsed.stairsLevel || site.stairsLevel,
      amenities: {
        ...site.amenities,
        ...(parsed.amenities || {})
      },
      familyTips: Array.isArray(parsed.familyTips) && parsed.familyTips.length > 0 ? parsed.familyTips : site.familyTips,
      nearbyDining: Array.isArray(parsed.nearbyDining) && parsed.nearbyDining.length > 0 ? parsed.nearbyDining : site.nearbyDining,
      customTags: parsed.customTags || site.customTags,
      customFields: parsed.customFields || site.customFields,
      socialMediaLinks: (() => {
        if (!parsed.socialMediaLinks || parsed.socialMediaLinks.length === 0) return site.socialMediaLinks;
        const existingUrls = new Set((site.socialMediaLinks || []).map((s) => s.url));
        const toAdd = parsed.socialMediaLinks.filter((s) => !existingUrls.has(s.url));
        return [...(site.socialMediaLinks || []), ...toAdd];
      })()
    };

    onUpdateSite(updatedSite);
    setImportStatus({ 
      success: true, 
      message: result.message 
    });
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl shadow-md shadow-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900">AI 智能调研与相册生成</h2>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                  {site.name}
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span>✈️</span>
                  <span>{tripTitle}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                提示词已根据【{tripTitle}】专属定制专家角色、家庭阵容、周边菜系与票价币种
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 px-6 pt-3 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'prompt'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. 定制调研字段与复制 Prompt (含视频要求)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>2. 粘贴 AI 回复并一键回填</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'media'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>3. 📸 相册({site.gallery?.length || 0}) ＆ 🎬 视频({site.videos?.length || 0})</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* TAB 1: PROMPT EXPORT */}
          {activeTab === 'prompt' && (
            <div className="space-y-5">
              
              {/* Media Requirements Highlight Badge */}
              <div className="p-3.5 bg-gradient-to-r from-rose-50 via-indigo-50 to-purple-50 rounded-2xl border border-rose-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-rose-100 text-rose-700 rounded-xl text-sm font-bold">🎬</span>
                  <div>
                    <span className="font-bold text-slate-900">已开启多媒体指令：要求 8-10 张精准实景图 + 1-2 部 4K 导览视频</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Prompt 中要求精准覆盖水族馆/地标实景，杜绝伪造假链接与无关图片</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Custom Field Configurator */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                    <span>自定义扩展字段</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddField(!showAddField)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddField ? '收起' : '+ 增加新字段'}</span>
                  </button>
                </div>

                {/* Inline Add Field Form */}
                {showAddField && (
                  <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs space-y-2 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="字段显示名称 (例如: 📸 最佳拍照机位)"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="JSON 英文键名 (例如: photoSpots)"
                        value={newFieldKey}
                        onChange={(e) => setNewFieldKey(e.target.value)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddCustomField}
                        className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-indigo-700"
                      >
                        加入提示词
                      </button>
                    </div>
                  </div>
                )}

                {/* Active Custom Fields List */}
                <div className="space-y-1.5 pt-1">
                  {customFields.map((f) => (
                    <div
                      key={f.key}
                      className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{f.label}</span>
                        <code className="text-[10px] bg-slate-100 text-indigo-600 px-1.5 py-0.2 rounded font-mono">
                          "{f.key}"
                        </code>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCustomField(f.key)}
                        className="text-slate-300 hover:text-rose-600 p-1 transition-colors"
                        title="移除此字段"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Research Configurator */}
              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={enableSocialResearch}
                      onChange={(e) => setEnableSocialResearch(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="text-sm">📱</span>
                      <span>增加社交媒体与真实避坑攻略调研</span>
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">要求 AI 调研并输出真实博主笔记</span>
                </div>

                {enableSocialResearch && (
                  <div className="flex flex-wrap items-center gap-3 pl-6 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={socialPlatforms.includes('xiaohongshu')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSocialPlatforms([...socialPlatforms, 'xiaohongshu']);
                          } else {
                            setSocialPlatforms(socialPlatforms.filter((p) => p !== 'xiaohongshu'));
                          }
                        }}
                        className="w-3.5 h-3.5 rounded text-rose-500 focus:ring-rose-400 border-slate-300"
                      />
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-200 text-[11px] font-bold flex items-center gap-1">
                        <span>📕 小红书</span>
                        <span className="text-[10px] opacity-75 font-normal">(亲子带娃实测 / 避坑心得)</span>
                      </span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={socialPlatforms.includes('bilibili')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSocialPlatforms([...socialPlatforms, 'bilibili']);
                          } else {
                            setSocialPlatforms(socialPlatforms.filter((p) => p !== 'bilibili'));
                          }
                        }}
                        className="w-3.5 h-3.5 rounded text-sky-500 focus:ring-sky-400 border-slate-300"
                      />
                      <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md border border-sky-200 text-[11px] font-bold flex items-center gap-1">
                        <span>📺 哔哩哔哩 (B站)</span>
                        <span className="text-[10px] opacity-75 font-normal">(4K全景路线 / 沉浸实录)</span>
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Prompt Text Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    已包含 8-10 图与 1-2 视频要求的完整 Prompt:
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>已成功复制！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>复制完整调研提示词</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    readOnly
                    rows={12}
                    value={generatePrompt()}
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-mono text-[11px] leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: IMPORT / AUTO-UPDATE */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <p className="font-semibold text-slate-900 mb-1">📥 粘贴 AI 回复：</p>
                <p className="text-[11px] text-slate-500">
                  将其他 LLM 输出的回答直接粘贴在下方，系统会自动提取 8-10 张相册图片、1-2 部视频导览链接与所有扩展字段。
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  粘贴 LLM 回复内容或 JSON:
                </label>
                <textarea
                  rows={10}
                  placeholder="在此处粘贴 ChatGPT / Claude / Gemini 返回的包含 ```json ... ``` 的回复内容..."
                  value={llmOutputText}
                  onChange={(e) => setLlmOutputText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Status Banner */}
              {importStatus && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    importStatus.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {importStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleParseAndApply}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>智能解析并立即更新 (含 8-10相册 & 视频)</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: MEDIA (8-10 IMAGES & 1-2 VIDEOS) MANAGEMENT */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              
              {/* SMART 1-CLICK FIX BUTTON */}
              <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4 text-indigo-600" />
                    <span>若图片显示异常或与景点不符？</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    一键自动替换为经权威校验的 8-10 张高清实拍（金枪鱼水槽/企鹅/摩天轮等）与 4K 导览视频
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoCurateMedia}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>一键修复与美化图库</span>
                </button>
              </div>

              {/* SECTION 1: VIDEOS MANAGEMENT */}
              <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-950">
                    <Video className="w-4 h-4 text-rose-600" />
                    <span>4K 视频导览与官方短片 (当前共 {site.videos?.length || 0} 部)</span>
                  </div>
                </div>

                {/* Add Video Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="输入 YouTube / Bilibili / MP4 视频链接 (如 https://www.youtube.com/watch?v=...)"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white rounded-xl text-xs border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddVideo}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加视频</span>
                  </button>
                </div>

                {/* Videos List */}
                <div className="space-y-2 pt-1">
                  {site.videos && site.videos.length > 0 ? (
                    site.videos.map((vid, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white rounded-xl border border-rose-200/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Play className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <span className="font-mono text-slate-700 truncate">{vid}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(vid)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="删除视频"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-rose-800/80 italic">暂无视频。可粘贴 YouTube 或 B站链接，或点击上方「一键修复」。</p>
                  )}
                </div>
              </div>

              {/* SECTION 2: COVER & GALLERY (8-10 IMAGES) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>8-10 张多图相册管理 (当前共 {(site.gallery || []).length} 张)</span>
                  </div>
                </div>

                {/* Add Photo Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="添加新图片 URL 直链 (如 https://...)"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加至相册</span>
                  </button>
                </div>

                {/* Grid of gallery images */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {(site.gallery || []).map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                      <img
                        src={imgUrl}
                        alt={`${site.name}-${idx}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setCustomCoverUrl(imgUrl);
                            onUpdateSite({ ...site, coverImage: imgUrl });
                          }}
                          className="px-2 py-1 bg-white text-slate-800 text-[10px] font-bold rounded-lg shadow-sm hover:bg-indigo-50"
                        >
                          设封面
                        </button>
                        {site.gallery.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(imgUrl)}
                            className="p-1 bg-rose-600 text-white rounded-lg hover:bg-rose-700 text-xs"
                            title="删除图片"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 bg-white px-6 py-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            支持所有主流 LLM (GPT-4o, Claude 3.5, Gemini Pro, DeepSeek R1)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            关闭
          </button>
        </div>

      </div>
    </div>
  );
};
