export type SiteCategory = 
  | 'attraction' 
  | 'park' 
  | 'museum' 
  | 'restaurant' 
  | 'temple' 
  | 'nature' 
  | 'shopping' 
  | 'relax' 
  | 'hotel';

export type WalkingIntensity = '轻松 (<500米)' | '适中 (500米-1.5公里)' | '较累 (>1.5公里或坡道)' | (string & {});
export type StairsLevel = '平坦 / 无台阶' | '少量台阶 (配有无障碍坡道)' | '中等台阶' | '陡峭 / 台阶较多' | (string & {});
export type WeatherSuitability = '全天候适宜' | '室内 (雨天/避暑优选)' | '晴天适宜' | '纯户外' | (string & {});

export interface SiteAmenities {
  nursingRoom?: boolean | null;        // 母婴室 / 哺乳室
  diaperChanging?: boolean | null;     // 尿布台
  accessibleRestroom?: boolean | null; // 无障碍洗手间
  benchesRestAreas?: boolean | null;   // 密集休息长椅
  shuttleOrCart?: boolean | null;      // 园区接驳车 / 轮椅代步
  elevatorAvailable?: boolean | null;  // 直梯全覆盖
  strollerRental?: boolean | null;     // 婴儿车租赁
  wheelchairRental?: boolean | null;   // 轮椅借用
  shadeAvailable?: boolean | null;     // 树荫 / 遮阳棚
  indoorRainyDayOption?: boolean | null;// 室内雨天保障
  kidPlayArea?: boolean | null;        // 儿童互动/玩乐区
}

export interface NearbyDining {
  id: string;
  name: string;
  cuisine: string;
  familyFeatures: string; // 例如: "提供宝宝椅、榻榻米包间、儿童乌冬面、长辈清淡定食"
  walkingTimeMin: number;
}

export type ReviewerRole = 'reviewer1' | 'reviewer2';
export type TripPreference = 'must_go' | 'nice_to_have' | 'neutral' | 'skip';

export interface UserReview {
  reviewerId: ReviewerRole;
  reviewerName: string;      // 例如: "爸爸", "妈妈", "同伴"
  reviewerAvatar: string;    // 例如: "👨", "👩", "🧓", "👵", "🧑"
  kidRating: number;         // 1-5
  elderlyRating: number;     // 1-5
  strollerRating: number;    // 1-5
  overallRating: number;     // 1-5 (个人综合推荐指数)
  preference: TripPreference;// 必去 / 挺想去 / 无所谓 / 建议跳过
  comment: string;           // 个人评语、顾虑或体验看法
  updatedAt: string;         // ISO 时间
}

export interface ReviewerConfig {
  reviewer1: { name: string; avatar: string; role: string };
  reviewer2: { name: string; avatar: string; role: string };
}

export type SocialPlatform = 
  | 'xiaohongshu' 
  | 'douyin' 
  | 'bilibili' 
  | 'dianping' 
  | 'weibo' 
  | 'wechat' 
  | 'youtube' 
  | 'instagram' 
  | 'tiktok' 
  | 'other';

export interface SocialMediaLink {
  id: string;
  url: string;
  platform?: SocialPlatform;
  title?: string;
  note?: string;
  author?: string;
  screenshotUrl?: string; // 网页截图 / 笔记长图 / 封面快照 (URL 或 base64)
  addedAt?: string;
}

export interface Site {
  id: string;
  tripId?: string; // 所属旅行计划ID (隔离存储与展示)
  name: string;
  localName?: string;
  category: SiteCategory;
  coordinates: [number, number]; // [lat, lng]
  address: string;
  city: string;
  coverImage: string;
  gallery: string[]; // 8-10张 高清实拍图集
  videos?: string[]; // 1-2个 4K漫步导览或官方宣传视频 (YouTube / Bilibili / MP4)
  description: string;
  
  // 物流与开放
  recommendedDurationMin: number;
  openingHours: string;
  admissionFee: {
    adult: string;
    senior: string;
    child4yo: string;
    notes?: string;
  };
  bestTimeToVisit: string;
  weatherSuitability: WeatherSuitability;
  
  // 三代同堂评估（核心针对4岁幼童与长辈）
  strollerRating: 1 | 2 | 3 | 4 | 5; // 1 = 极难推车, 5 = 纯平无障碍
  strollerNotes: string;
  
  kidRating: 1 | 2 | 3 | 4 | 5; // 4岁孩子趣味性与安全性
  kidNotes: string;
  
  elderlyRating: 1 | 2 | 3 | 4 | 5; // 长辈舒适度、步道平缓度、休息座椅
  elderlyNotes: string;
  
  walkingIntensity: WalkingIntensity;
  stairsLevel: StairsLevel;
  amenities: SiteAmenities;
  
  familyTips: string[];
  nearbyDining: NearbyDining[];
  
  websiteUrl?: string;
  customTags: string[];
  customFields?: Record<string, string>; // 动态自定义字段 (例如: 雨天备选, 停车场信息, 门票预订渠道等)
  reviews?: UserReview[]; // 2人双人协同评分与评价列表
  socialMediaLinks?: SocialMediaLink[]; // 社交媒体种草与实操攻略链接 (小红书/抖音/B站/点评等)
  createdAt: string;
}

export type TimeSlot = 'morning' | 'lunch' | 'afternoon' | 'nap_rest' | 'evening' | 'dinner';

export interface TransportDetail {
  mode: 'walk' | 'taxi' | 'bus' | 'subway' | 'train' | 'car';
  durationMin: number;
  costEst?: string;
  familyNote?: string; // 例如: "建议此段打车（约1200日元），避免推婴儿车走上坡路"
}

export interface ItineraryStop {
  id: string;
  siteId: string;
  timeSlot: TimeSlot;
  startTime: string; // "09:30"
  endTime: string;   // "11:30"
  customNotes?: string;
  isRestBreak?: boolean; // 专属午休/长辈下午茶
  restTitle?: string;    // 例如: "酒店午休与长辈静享下午茶"
  transportToNext?: TransportDetail;
}

export interface DayItinerary {
  id: string;
  dayNumber: number;
  date: string; // "2026-10-15"
  theme: string;
  dailyNotes?: string;
  napBreakIncluded: boolean;
  stops: ItineraryStop[];
}

export interface PackingItem {
  id: string;
  category: '幼童用品 (4岁)' | '长辈/健康保健' | '全家必备' | '证件与数码';
  item: string;
  checked: boolean;
  note?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: '👶 4岁幼童' | '🧓 长辈/爷爷奶奶' | '🧑 父母/领队';
  notes?: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  summary: string;
  partyMembers: FamilyMember[];
  checklist: PackingItem[];
  days: DayItinerary[];
  createdAt: string;
  updatedAt: string;
}
