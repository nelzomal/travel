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
  nursingRoom: boolean;        // 母婴室 / 哺乳室
  diaperChanging: boolean;     // 尿布台
  accessibleRestroom: boolean; // 无障碍洗手间
  benchesRestAreas: boolean;   // 密集休息长椅
  shuttleOrCart: boolean;      // 园区接驳车 / 轮椅代步
  elevatorAvailable: boolean;  // 直梯全覆盖
  strollerRental: boolean;     // 婴儿车租赁
  wheelchairRental: boolean;   // 轮椅借用
  shadeAvailable: boolean;     // 树荫 / 遮阳棚
  indoorRainyDayOption: boolean;// 室内雨天保障
  kidPlayArea: boolean;        // 儿童互动/玩乐区
}

export interface NearbyDining {
  id: string;
  name: string;
  cuisine: string;
  familyFeatures: string; // 例如: "提供宝宝椅、榻榻米包间、儿童乌冬面、长辈清淡定食"
  walkingTimeMin: number;
}

export interface Site {
  id: string;
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
