import React, { useState } from 'react';
import { Site, Trip } from '../../types/travel';
import { 
  X, Copy, Check, Sparkles, Bot, 
  Download, FileText, CheckCircle2, AlertCircle, RefreshCw,
  Plus, Trash2, SlidersHorizontal, Image as ImageIcon, Video, Play, Wand2, MapPin
} from 'lucide-react';
import { getSmartCuratedMediaForSite } from '../../utils/photoCurator';

interface LLMResearchModalProps {
  site: Site | null;
  trip?: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSite: (updatedSite: Site) => void;
}

interface CustomFieldDef {
  key: string;
  label: string;
  example: string;
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
    if (isDalian) {
      setCustomFields([
        { key: 'tideOrWeatherTip', label: '🌊 潮汐赶海/海风防晒防护', example: '最佳赶海退潮时间段、海风保暖与儿童防滑鞋装备' },
        { key: 'ticketBookingTip', label: '🎟️ 门票预约与长者优惠证件', example: '是否需提前预约实名购票？长者免费/半价需携带何种身份证件？' },
        { key: 'parkingAndDropoff', label: '🚗 自驾/打车/景区观光车省力动线', example: '下车点离核心景点几米？景区观光车/索道换乘点位置与排队耗时' },
        { key: 'rainyDayPlan', label: '🌧️ 雨天/大风天气备选室内场馆', example: '大风降雨时的室内避险展馆或替代方案' }
      ]);
    } else {
      setCustomFields([
        { key: 'rainyDayPlan', label: '🌧️ 雨天/恶劣天气备选方案', example: '下雨时可直接前往的室内馆区或替代商场' },
        { key: 'ticketBookingTip', label: '🎟️ 门票预约与免排队技巧', example: '是否需提前在官网抢票？有无长者/推车优先绿色通道？' },
        { key: 'parkingAndDropoff', label: '🚗 包车/打车/电车站无障碍直梯', example: '最近电车站几号出口有垂直电梯？步行距离几米？' }
      ]);
    }
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
    const customRequirements = customFields
      .map((f, i) => `${i + 8}. 【自定义拓展】${f.label}：请详细调研 ${f.example}`)
      .join('\n');

    const customJsonEntries = customFields
      .map((f) => `    "${f.key}": "【${f.label}】的具体调研解答内容"`)
      .join(',\n');

    const expertPersona = isDalian
      ? `你是一位拥有10年以上实战经验的大连海滨亲子度假、海岛生态与三代同堂家庭慢游旅行规划专家。`
      : isJapan
      ? `你是一位拥有10年以上实战经验的日本关东与关西亲子慢游、日式庭园寺庙与三代同堂家庭慢游旅行规划专家。`
      : `你是一位拥有10年以上实战经验的【${destination}】亲子慢游与三代同堂家庭旅行规划专家。`;

    const partyInfo = (trip?.partyMembers && trip.partyMembers.length > 0)
      ? trip.partyMembers.map(m => `   - ${m.role} (${m.name})：${m.notes || '重点关怀活动舒适度与体力负荷'}`).join('\n')
      : `   - 👶 4岁活泼幼童（Leo）：重点关注趣味互动展示、动物/自然探索、安全性、防滑防摔、母婴室与推车便利度\n   - 🧓 65岁以上长辈（爷爷奶奶）：重点关注平缓无台阶步道、休息长椅密集度、清淡少油易消化餐饮、长者门票优惠\n   - 🧑 父母/领队：婴儿车全流程推行顺畅度、停车上下客便利度、不走回头路的省心出入口动线`;

    const admissionClause = isDalian
      ? `4. ⏰ 营业开放与门票政策（人民币结算）：最新开放时间、成人常规门票价格、长者优惠标准（如60-69岁是否半价，70岁以上凭身份证是否免票）、4岁幼童免票标准（身高如1.2米或1.3米以下是否免费？若涉及景区电瓶车、索道或出海船票，请说明老人儿童单独收费政策）。`
      : isJapan
      ? `4. ⏰ 营业开放与门票政策（日元 JPY）：最新开放时间、成人票价、长者优惠政策（65岁以上是否有优惠或半价？）、4岁幼童门票（通常是否免费？现场购票是否支持 Suica/ICOCA 或信用卡？）。`
      : `4. ⏰ 营业开放与门票政策（当地货币结算）：最新开放时间、成人票价、长者优惠政策与4岁幼童免票标准。`;

    const transportClause = isDalian
      ? `5. 💡 最佳游玩时间与交通避坑指南：几点入园最省时省力避开旅行团大巴与海滨午后暴晒？自驾停车或打车推荐停在哪个门出入口步行最短（如森林动物园南门 vs 北门）？景区内部接驳车/观光车怎样乘坐最省长辈体力？有无赶海退潮时机或海风保暖注意？`
      : isJapan
      ? `5. 💡 最佳游玩时间与交通避坑指南：几点入园最能避开旅行团大巴与午后暴晒？推荐从哪个出入口/地铁电车站进出步行距离最短、无障碍直梯最顺畅？`
      : `5. 💡 最佳游玩时间与交通避坑指南：几点入园最舒适避开人流与暴晒？推荐从哪个出入口/车站进出最省老人幼童体力？`;

    const diningClause = isDalian
      ? `6. 🍜 步行5-10分钟内周边特色餐厅推荐（2-3家）：适合三代同堂家庭用餐（必须配备儿童宝宝椅、提供少油少盐清淡健康的海鲜水饺、清蒸小海鲜、软嫩面食、大连老菜温热炖菜软豆腐等，让4岁幼童与65岁长辈吃得舒心放心）。`
      : isJapan
      ? `6. 🍜 步行5-10分钟内周边特色餐厅推荐（2-3家）：适合三代同堂家庭用餐（必须配备儿童宝宝椅、提供清淡软质和食、热乌冬面、和风米饭等长辈与幼童易消化的温热菜品）。`
      : `6. 🍜 步行5-10分钟内周边特色餐厅推荐（2-3家）：适合三代同堂家庭用餐（必须配备儿童宝宝椅、提供清淡软烂、少油少盐健康餐饮）。`;

    const mediaClause = isDalian
      ? `7. 🖼️ 【多媒体图片与视频要求（请务必真实准确）】：\n   - 请在 JSON 中提供 【8 - 10 张】 与该大连景点【精准契合】的高清实拍大图直链（覆盖：主要地标景观、大门出入口、观光车/木栈道、儿童互动区、长辈休息区；请勿伪造或提供无关景点图片）；\n   - 请在 JSON 中提供 【1 - 2 个】 该景点的 4K 沉浸式慢步导览或官方宣传视频直链（支持 Bilibili、微信视频号、YouTube 或 MP4 视频直链）。`
      : isJapan
      ? `7. 🖼️ 【多媒体图片与视频要求（请务必真实准确）】：\n   - 请在 JSON 中提供 【8 - 10 张】 与该日本景点【精准契合】的高清实拍大图直链（覆盖：主要殿堂/地标、山门入口、婴儿车缓坡道、亲子体验区、长辈休息区等；请勿伪造不存在的链接或提供不相干地点的图片）；\n   - 请在 JSON 中提供 【1 - 2 个】 该景点的 4K 沉浸式慢步导览或官方宣传视频直链（支持 YouTube 视频直链、Bilibili 或 MP4 视频直链）。`
      : `7. 🖼️ 【多媒体图片与视频要求（请务必真实准确）】：\n   - 请在 JSON 中提供 【8 - 10 张】 与该景点【精准契合】的高清实拍大图直链；\n   - 请在 JSON 中提供 【1 - 2 个】 该景点的沉浸式慢步导览或官方宣传视频直链。`;

    const exampleAdmission = isDalian
      ? `  "admissionFee": {\n    "adult": "60元/人",\n    "senior": "60-69岁半价，70岁以上免票",\n    "child4yo": "免费 (1.3米以下)",\n    "notes": "观光车20元/人通票，建议长辈幼童购买"\n  },`
      : `  "admissionFee": {\n    "adult": "¥700",\n    "senior": "¥350 (65岁以上半价)",\n    "child4yo": "免费 (4岁)",\n    "notes": "门票说明，支持现场刷卡/现金"\n  },`;

    const exampleDining = isDalian
      ? `  "nearbyDining": [\n    {\n      "name": "喜家德水饺 / 品海楼",\n      "cuisine": "海鲜水饺 / 经典大连老菜",\n      "familyFeatures": "提供儿童宝宝椅与餐具，水饺软嫩鲜美，海参软豆腐适合长辈消化",\n      "walkingTimeMin": 4\n    }\n  ],`
      : `  "nearbyDining": [\n    {\n      "name": "和风软食料理店",\n      "cuisine": "日式定食 / 清汤乌冬面",\n      "familyFeatures": "提供儿童高脚椅，乌冬面汤底清淡软和，适合老人儿童",\n      "walkingTimeMin": 3\n    }\n  ],`;

    return `${expertPersona}请为我深度调研以下景点，针对我们即将出发的【${tripTitle}】三代同堂家庭慢游需求提供专业调研与结构化数据：

【本次旅行基本背景】
- 旅行计划：${tripTitle}
- 旅行目的地：${destination}
- 同行家庭阵容（三代同堂）：
${partyInfo}

【待调研景点基本信息】
- 景点名称：${site.name} ${site.localName ? `(${site.localName})` : ''}
- 归属旅行：${tripTitle}
- 所在城市/区域：${site.city || destination}
- 景点类别：${site.category}
- 现存地址：${site.address || site.city || destination}

【重点调研内容要求】
1. 🚼 婴儿车与无障碍平缓度（评分1-5星）：是否有连续台阶、碎石路或陡坡？是否有无障碍直梯与缓坡道？是否提供婴儿手推车/轮椅借用？
2. 🧒 4岁幼童适宜度（评分1-5星）：有哪些4岁孩子极度喜欢的互动展示/动物/自然体验？安全性如何（有无危险水边或临空高台）？有无母婴室、尿布台？
3. 🧓 65岁以上长辈舒适度（评分1-5星）：全景观赏需步行多少距离？沿途是否有密集的遮阳休息长椅、茶室或咖啡厅？是否有轮椅借用或代步电瓶车？长者门票是否有优惠？
${admissionClause}
${transportClause}
${diningClause}
${mediaClause}
${customRequirements ? `\n【用户自定义扩展调研字段】\n${customRequirements}\n` : ''}
【输出格式要求】
请先用中文条理清晰地给出详细解答；并在最后附带一个合法的 JSON 代码块（请用 \`\`\`json 和 \`\`\` 包裹），以便我一键导入系统更新该景点：

\`\`\`json
{
  "name": "${site.name}",
  "localName": "${site.localName || ''}",
  "description": "简练生动的100字景点亮点介绍",
  "coverImage": "${site.coverImage}",
  "gallery": [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
  ],
  "videos": [
    "https://www.youtube.com/watch?v=kYJvPcvbA3I",
    "https://www.youtube.com/watch?v=1La4QzGeaaQ"
  ],
  "recommendedDurationMin": 150,
  "openingHours": "09:00 - 17:00",
${exampleAdmission}
  "bestTimeToVisit": "早晨开园入场，避开烈日与人流",
  "weatherSuitability": "全天候适宜",
  "strollerRating": 5,
  "strollerNotes": "婴儿推车无障碍详细说明",
  "kidRating": 5,
  "kidNotes": "4岁孩子喜欢的互动与安全说明",
  "elderlyRating": 5,
  "elderlyNotes": "长辈步行负荷与休息座椅说明",
  "walkingIntensity": "轻松 (<500米)",
  "stairsLevel": "平坦 / 无台阶",
  "amenities": {
    "nursingRoom": true,
    "diaperChanging": true,
    "accessibleRestroom": true,
    "benchesRestAreas": true,
    "shuttleOrCart": true,
    "elevatorAvailable": true,
    "strollerRental": true,
    "wheelchairRental": true,
    "shadeAvailable": true,
    "indoorRainyDayOption": true,
    "kidPlayArea": true
  },
  "familyTips": [
    "避坑贴士1",
    "交通省力贴士2",
    "照护备忘贴士3"
  ],
${exampleDining}
  "customFields": {
${customJsonEntries || '    "note": "扩展备注"'}
  }
}
\`\`\``;
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

    try {
      let jsonStr = llmOutputText.trim();
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonStr = jsonMatch[1].trim();
      } else {
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }
      }

      const parsed = JSON.parse(jsonStr);

      // Collect all custom fields
      const knownKeys = new Set([
        'name', 'localName', 'description', 'recommendedDurationMin', 'openingHours',
        'admissionFee', 'bestTimeToVisit', 'weatherSuitability', 'strollerRating',
        'strollerNotes', 'kidRating', 'kidNotes', 'elderlyRating', 'elderlyNotes',
        'walkingIntensity', 'stairsLevel', 'amenities', 'familyTips', 'nearbyDining',
        'customTags', 'customFields', 'id', 'coordinates', 'address', 'city', 'coverImage', 'gallery', 'videos'
      ]);

      const extractedCustomFields: Record<string, string> = {
        ...(site.customFields || {}),
        ...(parsed.customFields || {})
      };

      Object.keys(parsed).forEach((k) => {
        if (!knownKeys.has(k) && typeof parsed[k] === 'string') {
          extractedCustomFields[k] = parsed[k];
        }
      });

      // Helper to strip markdown formatting like [https://...](https://...) or brackets from LLMs
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

      // Filter and sanitize Cover Image & Gallery (8-10 images)
      let coverImage = site.coverImage;
      const parsedCover = cleanUrl(parsed.coverImage);
      if (parsedCover.startsWith('http')) {
        coverImage = parsedCover;
      }

      let gallery = site.gallery;
      if (Array.isArray(parsed.gallery) && parsed.gallery.length > 0) {
        const validUrls = parsed.gallery.map(cleanUrl).filter((u: string) => u.startsWith('http'));
        if (validUrls.length > 0) {
          gallery = validUrls;
          if (!parsedCover.startsWith('http')) {
            coverImage = validUrls[0];
          }
        }
      }

      // Handle Videos (1-2 videos)
      let videos = site.videos || [];
      if (Array.isArray(parsed.videos) && parsed.videos.length > 0) {
        const validVideos = parsed.videos.map(cleanUrl).filter((v: string) => v.startsWith('http'));
        if (validVideos.length > 0) {
          videos = validVideos;
        }
      } else if (parsed.video) {
        const cleanedSingle = cleanUrl(parsed.video);
        if (cleanedSingle.startsWith('http')) {
          videos = [cleanedSingle];
        }
      }

      const updatedSite: Site = {
        ...site,
        name: parsed.name || site.name,
        localName: parsed.localName !== undefined ? parsed.localName : site.localName,
        description: parsed.description || site.description,
        coverImage,
        gallery,
        videos,
        recommendedDurationMin: Number(parsed.recommendedDurationMin) || site.recommendedDurationMin,
        openingHours: parsed.openingHours || site.openingHours,
        admissionFee: {
          adult: parsed.admissionFee?.adult || site.admissionFee.adult,
          senior: parsed.admissionFee?.senior || site.admissionFee.senior,
          child4yo: parsed.admissionFee?.child4yo || site.admissionFee.child4yo,
          notes: parsed.admissionFee?.notes || site.admissionFee.notes
        },
        bestTimeToVisit: parsed.bestTimeToVisit || site.bestTimeToVisit,
        weatherSuitability: parsed.weatherSuitability || site.weatherSuitability,
        strollerRating: (parsed.strollerRating >= 1 && parsed.strollerRating <= 5) ? parsed.strollerRating : site.strollerRating,
        strollerNotes: parsed.strollerNotes || site.strollerNotes,
        kidRating: (parsed.kidRating >= 1 && parsed.kidRating <= 5) ? parsed.kidRating : site.kidRating,
        kidNotes: parsed.kidNotes || site.kidNotes,
        elderlyRating: (parsed.elderlyRating >= 1 && parsed.elderlyRating <= 5) ? parsed.elderlyRating : site.elderlyRating,
        elderlyNotes: parsed.elderlyNotes || site.elderlyNotes,
        walkingIntensity: parsed.walkingIntensity || site.walkingIntensity,
        stairsLevel: parsed.stairsLevel || site.stairsLevel,
        amenities: {
          ...site.amenities,
          ...(parsed.amenities || {})
        },
        familyTips: Array.isArray(parsed.familyTips) && parsed.familyTips.length > 0 ? parsed.familyTips : site.familyTips,
        nearbyDining: Array.isArray(parsed.nearbyDining) && parsed.nearbyDining.length > 0 ? parsed.nearbyDining.map((d: any, idx: number) => ({
          id: `dine-llm-${Date.now()}-${idx}`,
          name: d.name || '美食餐厅',
          cuisine: d.cuisine || '和食简餐',
          familyFeatures: d.familyFeatures || '亲子长辈适宜',
          walkingTimeMin: Number(d.walkingTimeMin) || 3
        })) : site.nearbyDining,
        customTags: parsed.customTags || site.customTags,
        customFields: extractedCustomFields
      };

      onUpdateSite(updatedSite);
      setImportStatus({ 
        success: true, 
        message: `成功！已更新「${updatedSite.name}」：包含 ${gallery.length} 张高清相册、${videos.length} 部视频导览与 ${Object.keys(extractedCustomFields).length} 个扩展字段！` 
      });
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: any) {
      setImportStatus({
        success: false,
        message: `解析失败: ${err.message}。请确保粘贴的内容中包含合法的 JSON 数据块。`
      });
    }
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
