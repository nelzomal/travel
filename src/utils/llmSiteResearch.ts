import { Site, Trip, SiteCategory, WalkingIntensity, StairsLevel, WeatherSuitability, SiteAmenities } from '../types/travel';

export interface CustomFieldDef {
  key: string;
  label: string;
  example: string;
}

export const getDefaultCustomFields = (destination: string = '', isDalian: boolean = false): CustomFieldDef[] => {
  if (isDalian) {
    return [
      { key: 'tideOrWeatherTip', label: '🌊 潮汐赶海/海风防晒防护', example: '最佳赶海退潮时间段、海风保暖与儿童防滑鞋装备' },
      { key: 'ticketBookingTip', label: '🎟️ 门票预约与长者优惠证件', example: '是否需提前预约实名购票？长者免费/半价需携带何种身份证件？' },
      { key: 'parkingAndDropoff', label: '🚗 自驾/打车/景区观光车省力动线', example: '下车点离核心景点几米？景区观光车/索道换乘点位置与排队耗时' },
      { key: 'rainyDayPlan', label: '🌧️ 雨天/大风天气备选室内场馆', example: '大风降雨时的室内避险展馆或替代方案' }
    ];
  }
  return [
    { key: 'rainyDayPlan', label: '🌧️ 雨天/恶劣天气备选方案', example: '下雨时可直接前往的室内馆区或替代商场' },
    { key: 'ticketBookingTip', label: '🎟️ 门票预约与免排队技巧', example: '是否需提前在官网抢票？有无长者/推车优先绿色通道？' },
    { key: 'parkingAndDropoff', label: '🚗 包车/打车/电车站无障碍直梯', example: '最近电车站几号出口有垂直电梯？步行距离几米？' }
  ];
};

export const cleanUrl = (raw: any): string => {
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

export interface GeneratePromptParams {
  siteName: string;
  localName?: string;
  city?: string;
  category?: SiteCategory | string;
  address?: string;
  trip?: Trip | null;
  customFields?: CustomFieldDef[];
  siteId?: string;
  existingCoverImage?: string;
}

export const generateSiteResearchPrompt = ({
  siteName,
  localName,
  city = '东京',
  category = 'attraction',
  address,
  trip,
  customFields = [],
  siteId,
  existingCoverImage
}: GeneratePromptParams): string => {
  const targetSiteName = siteName.trim() || '待调研景点';
  const destination = trip?.destination || (city === '大连' ? '中国 · 大连' : '日本');
  const tripTitle = trip?.title || `${city || destination}慢游之旅`;

  const isDalian = (city && city.includes('大连')) || destination.includes('大连') || trip?.id === 'trip-dalian-coastal-multigen-2026' || (siteId && siteId.startsWith('site-dalian-'));
  const isJapan = !isDalian && (destination.includes('日本') || (city && (city.includes('东京') || city.includes('京都') || city.includes('箱根') || city.includes('富士山'))));

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

  const defaultCover = existingCoverImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80';

  return `${expertPersona}请为我深度调研以下景点，针对我们即将出发的【${tripTitle}】三代同堂家庭慢游需求提供专业调研与结构化数据：

【本次旅行基本背景】
- 旅行计划：${tripTitle}
- 旅行目的地：${destination}
- 同行家庭阵容（三代同堂）：
${partyInfo}

【待调研景点基本信息】
- 景点名称：${targetSiteName} ${localName ? `(${localName})` : ''}
- 归属旅行：${tripTitle}
- 所在城市/区域：${city || destination}
- 景点类别：${category}
- 现存地址：${address || city || destination}

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
请先用中文条理清晰地给出详细解答；并在最后附带一个合法的 JSON 代码块（请用 \`\`\`json 和 \`\`\` 包裹），以便我一键导入系统更新或新增该景点：

\`\`\`json
{
  "name": "${targetSiteName}",
  "localName": "${localName || ''}",
  "description": "简练生动的100字景点亮点介绍",
  "coverImage": "${defaultCover}",
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

export interface ParsedSiteData {
  name?: string;
  localName?: string;
  description?: string;
  coverImage?: string;
  gallery?: string[];
  videos?: string[];
  recommendedDurationMin?: number;
  openingHours?: string;
  admissionFee?: {
    adult: string;
    senior: string;
    child4yo: string;
    notes?: string;
  };
  bestTimeToVisit?: string;
  weatherSuitability?: WeatherSuitability;
  strollerRating?: 1 | 2 | 3 | 4 | 5;
  strollerNotes?: string;
  kidRating?: 1 | 2 | 3 | 4 | 5;
  kidNotes?: string;
  elderlyRating?: 1 | 2 | 3 | 4 | 5;
  elderlyNotes?: string;
  walkingIntensity?: WalkingIntensity;
  stairsLevel?: StairsLevel;
  amenities?: Partial<SiteAmenities>;
  familyTips?: string[];
  nearbyDining?: Array<{
    id: string;
    name: string;
    cuisine: string;
    familyFeatures: string;
    walkingTimeMin: number;
  }>;
  customTags?: string[];
  customFields?: Record<string, string>;
  city?: string;
  address?: string;
  coordinates?: [number, number];
  category?: SiteCategory;
}

export interface ParseResult {
  success: boolean;
  data?: ParsedSiteData;
  message: string;
}

export const parseLLMReply = (
  llmOutputText: string,
  currentSite?: Partial<Site>
): ParseResult => {
  if (!llmOutputText || !llmOutputText.trim()) {
    return {
      success: false,
      message: '请先粘贴 LLM 的回复内容或 JSON 代码块！'
    };
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

    const knownKeys = new Set([
      'name', 'localName', 'description', 'recommendedDurationMin', 'openingHours',
      'admissionFee', 'bestTimeToVisit', 'weatherSuitability', 'strollerRating',
      'strollerNotes', 'kidRating', 'kidNotes', 'elderlyRating', 'elderlyNotes',
      'walkingIntensity', 'stairsLevel', 'amenities', 'familyTips', 'nearbyDining',
      'customTags', 'customFields', 'id', 'coordinates', 'address', 'city', 'coverImage', 'gallery', 'videos', 'category'
    ]);

    const extractedCustomFields: Record<string, string> = {
      ...(currentSite?.customFields || {}),
      ...(parsed.customFields || {})
    };

    Object.keys(parsed).forEach((k) => {
      if (!knownKeys.has(k) && typeof parsed[k] === 'string') {
        extractedCustomFields[k] = parsed[k];
      }
    });

    let coverImage = currentSite?.coverImage || '';
    const parsedCover = cleanUrl(parsed.coverImage);
    if (parsedCover.startsWith('http')) {
      coverImage = parsedCover;
    }

    let gallery = currentSite?.gallery || [];
    if (Array.isArray(parsed.gallery) && parsed.gallery.length > 0) {
      const validUrls = parsed.gallery.map(cleanUrl).filter((u: string) => u.startsWith('http'));
      if (validUrls.length > 0) {
        gallery = validUrls;
        if (!coverImage || !parsedCover.startsWith('http')) {
          coverImage = validUrls[0];
        }
      }
    }

    let videos = currentSite?.videos || [];
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

    const data: ParsedSiteData = {
      name: parsed.name?.trim() || undefined,
      localName: parsed.localName !== undefined ? String(parsed.localName).trim() : undefined,
      description: parsed.description?.trim() || undefined,
      coverImage: coverImage || undefined,
      gallery: gallery.length > 0 ? gallery : undefined,
      videos: videos.length > 0 ? videos : undefined,
      recommendedDurationMin: Number(parsed.recommendedDurationMin) || undefined,
      openingHours: parsed.openingHours?.trim() || undefined,
      admissionFee: parsed.admissionFee ? {
        adult: parsed.admissionFee.adult || '免费',
        senior: parsed.admissionFee.senior || '免费 / 半价',
        child4yo: parsed.admissionFee.child4yo || '免费',
        notes: parsed.admissionFee.notes || undefined
      } : undefined,
      bestTimeToVisit: parsed.bestTimeToVisit?.trim() || undefined,
      weatherSuitability: parsed.weatherSuitability || undefined,
      strollerRating: (parsed.strollerRating >= 1 && parsed.strollerRating <= 5) ? parsed.strollerRating : undefined,
      strollerNotes: parsed.strollerNotes?.trim() || undefined,
      kidRating: (parsed.kidRating >= 1 && parsed.kidRating <= 5) ? parsed.kidRating : undefined,
      kidNotes: parsed.kidNotes?.trim() || undefined,
      elderlyRating: (parsed.elderlyRating >= 1 && parsed.elderlyRating <= 5) ? parsed.elderlyRating : undefined,
      elderlyNotes: parsed.elderlyNotes?.trim() || undefined,
      walkingIntensity: parsed.walkingIntensity || undefined,
      stairsLevel: parsed.stairsLevel || undefined,
      amenities: parsed.amenities ? {
        ...(currentSite?.amenities || {}),
        ...parsed.amenities
      } : undefined,
      familyTips: Array.isArray(parsed.familyTips) && parsed.familyTips.length > 0 ? parsed.familyTips : undefined,
      nearbyDining: Array.isArray(parsed.nearbyDining) && parsed.nearbyDining.length > 0 ? parsed.nearbyDining.map((d: any, idx: number) => ({
        id: `dine-llm-${Date.now()}-${idx}`,
        name: d.name || '特色餐厅',
        cuisine: d.cuisine || '和食简餐',
        familyFeatures: d.familyFeatures || '亲子长辈适宜',
        walkingTimeMin: Number(d.walkingTimeMin) || 3
      })) : undefined,
      customTags: parsed.customTags || undefined,
      customFields: Object.keys(extractedCustomFields).length > 0 ? extractedCustomFields : undefined,
      city: parsed.city?.trim() || undefined,
      address: parsed.address?.trim() || undefined,
      category: parsed.category || undefined
    };

    const countImages = gallery.length;
    const countVideos = videos.length;

    return {
      success: true,
      data,
      message: `成功解析！提取了「${data.name || '景点'}」：包含 ${countImages} 张相册、${countVideos} 部导览视频、门票与三代同堂评分！`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `解析失败: ${err.message}。请确保粘贴的内容中包含合法的 JSON 数据块。`
    };
  }
};
