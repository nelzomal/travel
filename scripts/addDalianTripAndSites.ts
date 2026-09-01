import * as fs from "fs";
import { Site, Trip } from "../src/types/travel";
import { INITIAL_SITES } from "../src/data/mockSites";
import { INITIAL_TRIPS } from "../src/data/mockTrips";

const dalianSites: Site[] = [
  {
    id: "site-dalian-sanhuan-ranch",
    name: "三寰牧场 (旅顺/高新)",
    localName: "Sanhuan Ranch (Lvshun / High-tech District)",
    category: "park",
    coordinates: [38.9328, 121.3655],
    address: "辽宁省大连市高新园区旅顺北路英歌石段三寰牧场",
    city: "大连",
    coverImage: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://vjs.zencdn.net/v/oceans.mp4"
    ],
    description: "大连近郊的「小新西兰」辽阔原生态草原牧场！绿草如茵的起伏山坡、黑白花荷斯坦奶牛、绵羊大草坪（定点牧羊犬赶羊秀）、羊驼互动喂食区、童乐谷大型纯木无动力亲子乐园以及帐篷露营区。4岁宝宝可在草地上奔跑投喂小羊，长辈坐在绿荫天幕下品尝新鲜现酿鲜牛奶与手工奶酪，全家尽享欧式慢调田园野趣。",
    recommendedDurationMin: 180,
    openingHours: "09:00 - 17:00 (夏令时 16:30 停止入场)",
    admissionFee: {
      adult: "70元/人",
      senior: "60-69岁半价，70岁以上凭身份证免费",
      child4yo: "身高1.2米以下儿童免费",
      notes: "包含牧场主园区、牧羊犬赶羊秀及无动力儿童设施，小动物胡萝卜投喂饲料另计"
    },
    bestTimeToVisit: "上午 09:30 - 12:00 (光线柔和，小动物活跃) 或 下午 15:00 之后",
    weatherSuitability: "晴天适宜 (草坪户外开阔，夏季注意防晒；小雨时可避入奶牛工坊)",
    strollerRating: 4,
    strollerNotes: "园区主环路为平整沥青与防滑木栈道，婴儿推车畅通无阻；深入部分起伏草坡稍有坡度，建议走外环平坦主道。",
    kidRating: 5,
    kidNotes: "小动物互动满分！近距离抚摸小绵羊、给羊驼喂草、看聪明的边境牧羊犬赶羊群，童乐谷有大型滑梯与沙池，4岁幼童流连忘返。",
    elderlyRating: 4,
    elderlyNotes: "空气极清新，开阔草原让人心情舒畅；园区设有多处观光电瓶车站，长辈无需全程徒步，草坪露营区有充足木椅与遮阳天幕。",
    walkingIntensity: "轻松至适中 (约1.0-1.5公里；可随时搭乘园区电瓶车)",
    stairsLevel: "平坦 / 无台阶 (主要为缓坡沥青道与木栈道)",
    amenities: {
      nursingRoom: true,
      diaperChanging: true,
      accessibleRestroom: true,
      benchesRestAreas: true,
      shuttleOrCart: true,
      elevatorAvailable: false,
      strollerRental: true,
      wheelchairRental: true,
      shadeAvailable: true,
      indoorRainyDayOption: false,
      kidPlayArea: true
    },
    familyTips: [
      "进门处可租赁带遮阳篷的双人脚踏车或儿童手拉车，带娃推车极为省力。",
      "每天 10:30 和 14:30 有精彩的牧羊犬赶羊群表演，建议提前15分钟到草坪看台长椅就座。",
      "园区内「奶牛工坊」供应当日现挤鲜牛奶、手工意式Gelato冰淇淋与酸奶，清淡健康无添加，老少皆宜。"
    ],
    nearbyDining: [
      {
        id: "d1",
        name: "三寰牧场会客厅·田园简餐",
        cuisine: "牧场现烤轻食 / 鲜奶披萨 / 儿童意面",
        familyFeatures: "提供宝宝餐具、儿童高脚椅、草坪户外席，鲜牛奶与奶酪焗饭老幼皆喜",
        walkingTimeMin: 3
      },
      {
        id: "d2",
        name: "龙王塘渔家清淡海鲜庄",
        cuisine: "大连地道胶东海鲜 / 杂粮玉米饼",
        familyFeatures: "清蒸黄黑鱼、原汁海胆蒸蛋、清淡手擀海鲜面，长辈养胃适口",
        walkingTimeMin: 12
      }
    ],
    customTags: ["小新西兰", "投喂小羊", "大草坪露营", "电瓶车无障碍", "亲子互动"],
    reviews: [
      {
        reviewerId: "reviewer1",
        reviewerName: "爸爸",
        reviewerAvatar: "👨",
        kidRating: 5,
        elderlyRating: 4,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "视野极其开阔，简直就像把新西兰农场搬到了大连！4岁宝宝追着小羊喂胡萝卜乐坏了，园区路面干净平整，强烈推荐。",
        updatedAt: "2026-09-01T08:00:00.000Z"
      },
      {
        reviewerId: "reviewer2",
        reviewerName: "妈妈",
        reviewerAvatar: "👩",
        kidRating: 5,
        elderlyRating: 5,
        strollerRating: 5,
        overallRating: 5,
        preference: "must_go",
        comment: "天幕露营区坐着很舒服，海风吹来一点也不闷热。鲜奶冰淇淋很纯，爷爷奶奶坐在遮阳伞下一边喝茶一边看宝宝玩沙，一家人其乐融融。",
        updatedAt: "2026-09-01T08:30:00.000Z"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "site-dalian-discovery-kingdom",
    name: "大连金石滩发现王国主题公园",
    localName: "Dalian Discovery Kingdom Theme Park (Jinshitan)",
    category: "attraction",
    coordinates: [39.0886, 121.9961],
    address: "辽宁省大连市金州区金石滩国家旅游度假区金石路36号",
    city: "大连",
    coverImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/%E5%A4%A7%E8%BF%9E%E5%8F%91%E7%8E%B0%E7%8E%8B%E5%9B%BD.jpg/1280px-%E5%A4%A7%E8%BF%9E%E5%8F%91%E7%8E%B0%E7%8E%8B%E5%9B%BD.jpg",
    gallery: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/%E5%A4%A7%E8%BF%9E%E5%8F%91%E7%8E%B0%E7%8E%8B%E5%9B%BD.jpg/1280px-%E5%A4%A7%E8%BF%9E%E5%8F%91%E7%8E%B0%E7%8E%8B%E5%9B%BD.jpg",
      "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://vjs.zencdn.net/v/oceans.mp4"
    ],
    description: "东北规模最大的国家AAAAA级欧式城堡环湖主题乐园！专门设有「魔法森林」与「小人国传奇」低幼亲子专区（旋转木马、童话小飞象、梦幻水上碰碰船、室内泡泡球乐园）。日间有盛大的皇家风情花车巡游与精灵互动，夜场更有浪漫城堡水上音乐烟火秀。全平整石板地面，全家三代体验童话魔力。",
    recommendedDurationMin: 300,
    openingHours: "日场 09:30 - 17:00；夜场开放期延长至 21:00 (含烟火秀)",
    admissionFee: {
      adult: "220元/人 (夜场票约130-150元)",
      senior: "65周岁以上长辈持老年证享长者特惠票 (约110元)",
      child4yo: "身高1.2米以下儿童免费入园",
      notes: "一票通玩，夜场门票性价比极高，适合避开午间酷暑安排"
    },
    bestTimeToVisit: "夏季下午 15:30 进场入园 (完美衔接午睡，气温凉爽，看巡游+夜场水上烟火)",
    weatherSuitability: "全天候适宜 (小雨天园区正常开放，且室内演艺场馆及魔法餐厅避雨极佳)",
    strollerRating: 5,
    strollerNotes: "园区围绕中心大湖修建，全平整平地与缓坡，无任何阻碍性台阶，是推婴儿车最顺畅的主题乐园之一。",
    kidRating: 5,
    kidNotes: "梦幻旋转木马、小飞象、泡泡王国都是4岁小朋友的心头好，玩累了随时看巡游跟卡通人偶击掌合影。",
    elderlyRating: 4,
    elderlyNotes: "不玩过山车也绝不无聊！湖边绿树成荫长椅很多，坐着看精彩的环湖花车巡游、好莱坞实景特技剧场和城堡灯光秀非常惬意。",
    walkingIntensity: "适中 (约1.5-2.0公里；环湖走走停停，休息点密集)",
    stairsLevel: "平坦 / 无台阶",
    amenities: {
      nursingRoom: true,
      diaperChanging: true,
      accessibleRestroom: true,
      benchesRestAreas: true,
      shuttleOrCart: true,
      elevatorAvailable: true,
      strollerRental: true,
      wheelchairRental: true,
      shadeAvailable: true,
      indoorRainyDayOption: true,
      kidPlayArea: true
    },
    familyTips: [
      "强烈建议购买夏季夜场票（15:30入园），午睡后带娃进场既避开了正午暴晒，又能完整欣赏压轴的湖畔水上城堡焰火灯光秀。",
      "游客服务中心可免费租借婴儿推车（需押金），园区内直梯与无障碍坡道标识清晰。",
      "好莱坞特技实景剧场（看飞车特技）有专门的长辈与家庭轮椅座席，视野开阔且出入无需挤人流。"
    ],
    nearbyDining: [
      {
        id: "d3",
        name: "王国皇家餐厅 (园区中心湖畔)",
        cuisine: "家庭和风定食 / 儿童炸鸡肉丸饭 / 热乌冬面",
        familyFeatures: "全空调临湖大玻璃窗席位，提供宝宝椅与温开水，看湖景视野绝佳",
        walkingTimeMin: 2
      },
      {
        id: "d4",
        name: "金石滩海鲜大饭店",
        cuisine: "大连本地海鲜蒸锅 / 鲅鱼水饺",
        familyFeatures: "独立包厢、安静宽敞、海鲜现蒸少油低盐，老人小孩吃得放心",
        walkingTimeMin: 8
      }
    ],
    customTags: ["夜场烟花秀", "旋转木马", "纯平推车", "花车巡游", "童话城堡"],
    reviews: [
      {
        reviewerId: "reviewer1",
        reviewerName: "爸爸",
        reviewerAvatar: "👨",
        kidRating: 5,
        elderlyRating: 4,
        strollerRating: 5,
        overallRating: 5,
        preference: "must_go",
        comment: "夜场性价比无敌！下午四点带全家进来，小宝坐了三次旋转木马，晚上八点的城堡水上烟火音乐秀非常震撼，长辈直夸好看！",
        updatedAt: "2026-09-01T08:10:00.000Z"
      },
      {
        reviewerId: "reviewer2",
        reviewerName: "妈妈",
        reviewerAvatar: "👩",
        kidRating: 5,
        elderlyRating: 4,
        strollerRating: 5,
        overallRating: 5,
        preference: "must_go",
        comment: "全园地面真的太友好了，轮椅和推车完全畅通！洗手间都有单独的母婴换尿布台，带娃出行毫无压力。",
        updatedAt: "2026-09-01T08:40:00.000Z"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "site-dalian-golden-pebble-beach",
    name: "大连金石滩黄金海岸与地质公园",
    localName: "Golden Pebble Beach & National Geopark",
    category: "nature",
    coordinates: [39.0736, 122.0255],
    address: "辽宁省大连市金州区金石滩海滨中路与地质公园核心景区",
    city: "大连",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/%E9%87%91%E7%9F%B3%E6%BB%A92.jpg/1280px-%E9%87%91%E7%9F%B3%E6%BB%A92.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/%E9%87%91%E7%9F%B3%E6%BB%A92.jpg/1280px-%E9%87%91%E7%9F%B3%E6%BB%A92.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/%E9%87%91%E7%9F%B3%E6%BB%A9.jpg/1280px-%E9%87%91%E7%9F%B3%E6%BB%A9.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/%E9%87%91%E7%9F%B3%E6%BB%A93.jpg/1280px-%E9%87%91%E7%9F%B3%E6%BB%A93.jpg",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://vjs.zencdn.net/v/oceans.mp4"
    ],
    description: "黄海之滨绵延十里的天然海湾与几亿年天然雕琢的海蚀地质奇观！黄金海岸拥有宽阔平缓的金色沙滩，浪柔水清，是4岁幼童挖沙堆城堡、踏浪拾贝的天然游乐场；毗邻的国家地质公园奇石林立，「恐龙探海」、「贝多芬头像」、「大龟裂石」维妙维肖。长辈可乘坐全景环保观光车直达悬崖观海平台，一览黄海万顷碧波。",
    recommendedDurationMin: 240,
    openingHours: "黄金海岸全天开放；地质公园 08:30 - 17:00",
    admissionFee: {
      adult: "黄金海岸免费；地质公园约60元/人",
      senior: "60-69岁半价，70岁以上凭有效证件免票",
      child4yo: "身高1.2米以下儿童免费",
      notes: "地质公园建议购买包含全景环保电瓶车套票，省力不爬山"
    },
    bestTimeToVisit: "早晨 09:00 黄金海岸踏浪，或傍晚 16:30 看海平线落日红霞",
    weatherSuitability: "晴天适宜 (海风微拂最美，紫外线较强需做好防晒)",
    strollerRating: 4,
    strollerNotes: "黄金海岸建有数公里长的滨海防腐木栈道，推婴儿车赏海极舒适；进沙滩需手提推车或存放在栈道旁遮阳伞下。",
    kidRating: 5,
    kidNotes: "金黄细沙+清澈浅滩=孩子的最爱！带上小水桶与塑料小铲，小宝能专心挖沙捉小螃蟹玩一整个上午。",
    elderlyRating: 4,
    elderlyNotes: "地质公园内全程有观光车接驳至观景台，不用让老人爬陡峭台阶；滨海木栈道两旁长椅密集，坐着吹海风听涛声神清气爽。",
    walkingIntensity: "轻松至适中 (沙滩可静态休养，地质公园乘车代步)",
    stairsLevel: "少量台阶 (主木栈道纯平，地质公园核心观景台有局部台阶)",
    amenities: {
      nursingRoom: true,
      diaperChanging: true,
      accessibleRestroom: true,
      benchesRestAreas: true,
      shuttleOrCart: true,
      elevatorAvailable: false,
      strollerRental: false,
      wheelchairRental: true,
      shadeAvailable: true,
      indoorRainyDayOption: false,
      kidPlayArea: true
    },
    familyTips: [
      "请务必随身准备：儿童挖沙玩具、涉水溯溪凉鞋、长辈遮阳帽与防晒衣。",
      "黄金海岸沙滩上有租赁遮阳大伞和躺椅的摊位（可适当砍价），长辈躺着休息非常舒服。",
      "地质公园拍照首选「恐龙探海」，下午顺光时天然海蚀拱桥宛如神龙汲水，拍照极具视觉震撼。"
    ],
    nearbyDining: [
      {
        id: "d5",
        name: "金石滩渔家傲海鲜坊",
        cuisine: "现捞大连海鲜 / 杂色蛤豆腐汤 / 软炸蛎黄",
        familyFeatures: "海鲜现捞现称，杂色蛤鲜甜不辣，豆腐汤清淡适合老人，有宝宝椅",
        walkingTimeMin: 5
      }
    ],
    customTags: ["沙滩挖沙", "地质奇观", "观光电瓶车", "滨海木栈道", "恐龙探海"],
    reviews: [
      {
        reviewerId: "reviewer1",
        reviewerName: "爸爸",
        reviewerAvatar: "👨",
        kidRating: 5,
        elderlyRating: 4,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "黄金海岸沙质比市内好太多了！海水很清，沙滩坡度平缓极安全。恐龙探海的大石头非常壮观，天然地质教科书。",
        updatedAt: "2026-09-01T08:15:00.000Z"
      },
      {
        reviewerId: "reviewer2",
        reviewerName: "妈妈",
        reviewerAvatar: "👩",
        kidRating: 5,
        elderlyRating: 5,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "租了一顶大遮阳伞，老人坐在躺椅上品尝鲜椰子吹海风，孩子在旁边挖沙水沟乐开花，完美的海滨慢度假节奏。",
        updatedAt: "2026-09-01T08:45:00.000Z"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "site-dalian-natural-history-museum",
    name: "大连自然博物馆",
    localName: "Dalian Natural History Museum (Heishijiao)",
    category: "museum",
    coordinates: [38.8681, 121.5583],
    address: "辽宁省大连市沙河口区黑石礁西村街40号 (近黑石礁海滨)",
    city: "大连",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Dalian_Nature_History_Museum.JPG/1280px-Dalian_Nature_History_Museum.JPG",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Dalian_Nature_History_Museum.JPG/1280px-Dalian_Nature_History_Museum.JPG",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1569705460033-cfaa4bf9f822?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://vjs.zencdn.net/v/oceans.mp4"
    ],
    description: "依黑石礁嶙峋海岸而筑的近代百年地标自然博物馆！馆藏全国最为壮观的海洋生物标本群，镇馆之宝是长达18.6米、重达46.7吨的亚洲最大黑露脊鲸巨大骨架与真实剥制立体标本！还拥有恐龙世界展厅、非洲野生动物群情景雕塑与五彩斑斓的海贝走廊。面朝黄海的整面观海弧形全景玻璃幕墙令人惊艳，纯室内全空调，雨天与酷暑避暑头号选择。",
    recommendedDurationMin: 150,
    openingHours: "09:00 - 16:30 (周一闭馆，法定节假日除外，15:30 停止入馆)",
    admissionFee: {
      adult: "免费开放 (需提前在大连自然博物馆公号实名预约门票)",
      senior: "凭身份证免费入馆，设绿色通道免排队",
      child4yo: "随同家长免费进馆",
      notes: "完全免费的高性价比亲子场馆，旺季建议提前1-3天线上预约"
    },
    bestTimeToVisit: "上午 09:30 - 11:30 或 雨天/盛夏午后 (全室内避暑吹空调)",
    weatherSuitability: "室内 (雨天/避暑优选，全馆中央空调恒温舒适)",
    strollerRating: 5,
    strollerNotes: "全馆采用宽幅无障碍斜坡与透明观光直梯连通各楼层，推婴儿车从一楼到三楼完全不需要抬车，平坦极佳。",
    kidRating: 5,
    kidNotes: "一进门就被巨大的鲸鱼骨骼和高耸的马门溪龙恐龙骨架震撼到了！海洋展厅有声光互动的海底投影，孩子看得目不转睛。",
    elderlyRating: 5,
    elderlyNotes: "各楼层展厅均配有大量软皮休息长凳，三楼还有全海景休息连廊，坐着眺望黑石礁海潮拍打礁石，十分惬意养神。",
    walkingIntensity: "轻松 (<500米，室内平坦且随时可坐)",
    stairsLevel: "平坦 / 无台阶 (各楼层有宽敞观光直梯覆盖)",
    amenities: {
      nursingRoom: true,
      diaperChanging: true,
      accessibleRestroom: true,
      benchesRestAreas: true,
      shuttleOrCart: false,
      elevatorAvailable: true,
      strollerRental: true,
      wheelchairRental: true,
      shadeAvailable: true,
      indoorRainyDayOption: true,
      kidPlayArea: true
    },
    familyTips: [
      "大连自然博物馆坐落在黑石礁礁石海边，参观完从后门走出来就是天然黑石礁地貌，可带娃看海浪拍打玄武岩。",
      "一楼总服务台提供免费轮椅与婴儿手推车借用（凭有效证件登记即可）。",
      "恐龙馆有恐龙叫声与动态骨架演示，非常适合激发4岁小朋友对史前地球的好奇心。"
    ],
    nearbyDining: [
      {
        id: "d6",
        name: "喜家德虾仁水饺 (黑石礁近馆店)",
        cuisine: "现包水饺 / 鲜虾素馅水饺 / 酱骨头 / 热热饺子汤",
        familyFeatures: "现点现包全透明明档厨房，少油无味精，儿童最爱鲜虾水饺，提供宝宝椅与儿童小餐具",
        walkingTimeMin: 6
      },
      {
        id: "d7",
        name: "黑石礁海港小馆",
        cuisine: "大连老菜 / 溜鱼片 / 海杂拌 / 清水豆腐汤",
        familyFeatures: "溜鱼片滑嫩无刺，适合老人与小孩，环境整洁家常",
        walkingTimeMin: 7
      }
    ],
    customTags: ["免费博物馆", "巨型鲸鱼骨架", "恐龙展厅", "纯室内空调", "直梯无障碍", "雨天首选"],
    reviews: [
      {
        reviewerId: "reviewer1",
        reviewerName: "爸爸",
        reviewerAvatar: "👨",
        kidRating: 5,
        elderlyRating: 5,
        strollerRating: 5,
        overallRating: 5,
        preference: "must_go",
        comment: "大露脊鲸骨架比想象中庞大太多了，站在底下简直像科幻电影！免费而且不用顶着太阳晒，全平路推车太舒服了。",
        updatedAt: "2026-09-01T08:20:00.000Z"
      },
      {
        reviewerId: "reviewer2",
        reviewerName: "妈妈",
        reviewerAvatar: "👩",
        kidRating: 5,
        elderlyRating: 5,
        strollerRating: 5,
        overallRating: 5,
        preference: "must_go",
        comment: "三楼的大海景落地窗美极了！老人在走廊长椅上坐着看海浪，宝宝在恐龙展馆里找霸王龙，老少满意度100分！",
        updatedAt: "2026-09-01T08:50:00.000Z"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "site-dalian-yacht-cruise",
    name: "大连游艇出游 (星海湾出海喂海鸥)",
    localName: "Dalian Yacht & Catamaran Sailing (Xinghai Bay)",
    category: "relax",
    coordinates: [38.8821, 121.5835],
    address: "辽宁省大连市沙河口区星海湾国际游艇码头 / 东港游艇港",
    city: "大连",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://vjs.zencdn.net/v/oceans.mp4"
    ],
    description: "从星海湾国际游艇码头启航，乘坐豪华双体大帆船或休闲游艇驶向蔚蓝外海！成百上千只洁白海鸥紧贴甲板伴飞争食，大人小孩手持小鱼或面包高高举起，海鸥轻盈俯冲精准叼走，体验妙趣横生！远眺星海湾跨海大桥宛若长龙卧波，大连城堡与海岸天际线尽收眼底。双体船极其平稳不易晕船，船舱内配有空调软沙发，老少皆怡。",
    recommendedDurationMin: 90,
    openingHours: "09:00 - 17:30 (每隔30-60分钟一班船)",
    admissionFee: {
      adult: "散拼游艇票约80-120元/人 (包艇另计)",
      senior: "65岁以上长辈持老年优待证享优惠或同儿童价",
      child4yo: "1.2米以下幼童约半价或免票 (需占救生衣名额)",
      notes: "船上免费提供专业大人和儿童专用轻便救生衣，喂海鸥小鱼条约10元/袋"
    },
    bestTimeToVisit: "下午 16:00 - 17:30 傍晚班次 (光线柔和，海鸥活跃，伴随金黄夕阳晚霞)",
    weatherSuitability: "晴天最佳 (风浪小于4级时运行，台风强风时停航)",
    strollerRating: 4,
    strollerNotes: "游艇码头栈桥平整顺畅，登船时有工作人员协助照看，婴儿车可折叠存放在游艇下层宽敞的室内沙龙舱中。",
    kidRating: 5,
    kidNotes: "全船最高潮时刻！成群海鸥在头顶盘旋，伸出小手拿着小鱼干就能体验被海鸥轻轻叼走食物的神奇感，孩子兴奋得直蹦跳。",
    elderlyRating: 5,
    elderlyNotes: "双体游艇阻浪性极强，海湾内波浪极小，不会产生颠簸眩晕；老人若不想吹海风可坐在下层带空调的皮质卡座中透光看海景。",
    walkingIntensity: "轻松 (<500米，码头登船后全程坐船)",
    stairsLevel: "平坦 / 无台阶 (码头为缓坡浮动栈道，上下船仅2-3级小步级，船员专人搀扶)",
    amenities: {
      nursingRoom: false,
      diaperChanging: false,
      accessibleRestroom: true,
      benchesRestAreas: true,
      shuttleOrCart: false,
      elevatorAvailable: false,
      strollerRental: false,
      wheelchairRental: false,
      shadeAvailable: true,
      indoorRainyDayOption: true,
      kidPlayArea: false
    },
    familyTips: [
      "码头或登船前记得买1-2包喂海鸥用的小干鱼条或火腿肠，海鸥非常喜欢，抢食画面拍照超出片！",
      "上船后船员会为每位乘客发放救生衣，有专门的幼儿小马甲式救生衣，安全感拉满。",
      "推荐选择下午4点半左右的夕阳班次，远处的跨海大桥亮起霓虹夜景，回港时恰好入夜极浪漫。"
    ],
    nearbyDining: [
      {
        id: "d8",
        name: "星海壹号·海景和风餐厅",
        cuisine: "海景精致鲁菜 / 鲜焖鲍鱼 / 软糯海参小米粥",
        familyFeatures: "海参小米粥温润养胃最适合长辈和孩子，餐厅有大露台直面星海湾游艇港",
        walkingTimeMin: 3
      }
    ],
    customTags: ["出海喂海鸥", "双体豪华帆船", "跨海大桥全景", "不晕船", "夕阳绝美"],
    reviews: [
      {
        reviewerId: "reviewer1",
        reviewerName: "爸爸",
        reviewerAvatar: "👨",
        kidRating: 5,
        elderlyRating: 5,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "本趟大连之行最惊喜的体验！双体船真的稳如平地，海鸥几百只围着船尾飞，跨海大桥从船底穿过时气势磅礴，绝对必去！",
        updatedAt: "2026-09-01T08:25:00.000Z"
      },
      {
        reviewerId: "reviewer2",
        reviewerName: "妈妈",
        reviewerAvatar: "👩",
        kidRating: 5,
        elderlyRating: 5,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "奶奶平时容易晕车，坐这个双体船居然一点感觉都没有！坐在沙发舱里吹着海风看宝宝喂海鸥笑，拍了无数张珍贵合影。",
        updatedAt: "2026-09-01T08:55:00.000Z"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "site-dalian-xinghai-square",
    name: "大连 星海广场",
    localName: "Dalian Xinghai Square",
    category: "attraction",
    coordinates: [38.8825, 121.5866],
    address: "辽宁省大连市沙河口区星海广场 (临近星海湾跨海大桥)",
    city: "大连",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/8/87/Xinghai_Square_%28Dalian%29.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Xinghai_Square_%28Dalian%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Xinghai_Square_.jpg/1280px-Xinghai_Square_.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Dalian_Liaoning_China_Two-Chinese-at-Xinghai-Bay-01.jpg/1280px-Dalian_Liaoning_China_Two-Chinese-at-Xinghai-Bay-01.jpg"
    ],
    videos: [
      "https://vjs.zencdn.net/v/oceans.mp4"
    ],
    description: "世界最大的海滨城市广场、大连的城市象征与客厅！地面占地176万平方米，正南直面浩瀚黄海与壮丽的星海湾跨海大桥。广场上建有纪念大连百年的城雕巨大无字天书与足迹浮雕。广场中央的白鸽广场常年有成百上千只不怕人的白色和平鸽，海边台阶更有密集海鸥飞掠。傍晚有华丽的大型音乐喷泉秀，入夜后跨海大桥万盏华灯齐放，是全家散步吹海风第一去处。",
    recommendedDurationMin: 150,
    openingHours: "全天免费开放 (夜间音乐喷泉通常在 19:30 / 20:00 举行)",
    admissionFee: {
      adult: "完全免费",
      senior: "完全免费",
      child4yo: "完全免费",
      notes: "广场小火车或四轮家庭脚踏车租赁自愿消费"
    },
    bestTimeToVisit: "傍晚 16:30 - 19:30 (避开正午日晒，喂鸽子、看海鸥、日落夕阳连着看喷泉大桥夜景)",
    weatherSuitability: "全天候适宜 (广场开阔，夏季晚上海风非常凉爽宜人)",
    strollerRating: 5,
    strollerNotes: "100%纯平花岗岩地面与柏油大道！推车、轮椅平滑如镜，毫无颠簸，可一路从广场中心推到海边观景台。",
    kidRating: 5,
    kidNotes: "和平鸽广场买一小包玉米粒，鸽子会直接飞落到孩子手臂和小手上啄食；海边还可以扔面包喂海鸥，旁边还有彩光游园小火车。",
    elderlyRating: 5,
    elderlyNotes: "视野开阔心旷神怡，沿海有长条石凳可随时休息，也可租一辆四轮带遮阳篷的家庭脚踏车全家同骑慢游。",
    walkingIntensity: "轻松至适中 (广场极大，可选择乘坐游园小火车代步)",
    stairsLevel: "平坦 / 无台阶",
    amenities: {
      nursingRoom: false,
      diaperChanging: false,
      accessibleRestroom: true,
      benchesRestAreas: true,
      shuttleOrCart: true,
      elevatorAvailable: false,
      strollerRental: false,
      wheelchairRental: false,
      shadeAvailable: false,
      indoorRainyDayOption: false,
      kidPlayArea: true
    },
    familyTips: [
      "广场面积巨大，带娃和老人建议直接租一辆「四人亲子脚踏车」或者乘坐彩色观光小火车，既省力又欢声笑语。",
      "白鸽广场位于广场西北角，海鸥群聚集在临海的百年城雕弧形台阶处，两个点都可以提前备好小面包和谷粒。",
      "晚上看星海湾跨海大桥亮灯最佳机位在海边城雕大翻书台阶上，背景是大桥和城堡酒店，全家福必拍点。"
    ],
    nearbyDining: [
      {
        id: "d9",
        name: "品海楼 (星海店)",
        cuisine: "大连老字号海鲜名店 / 金牌脆皮虾 / 葱油鸟贝",
        familyFeatures: "大连老建筑风情，包间宽敞有电梯，菜品清淡适口，宝宝喜欢手工虾丸与软糯大发糕",
        walkingTimeMin: 6
      }
    ],
    customTags: ["世界最大广场", "喂白鸽", "跨海大桥夜景", "纯平推车", "音乐喷泉", "地标必去"],
    reviews: [
      {
        reviewerId: "reviewer1",
        reviewerName: "爸爸",
        reviewerAvatar: "👨",
        kidRating: 5,
        elderlyRating: 5,
        strollerRating: 5,
        overallRating: 5,
        preference: "must_go",
        comment: "大连最核心的地标，不来星海广场等于没来大连！地面平坦到极点，傍晚吹着微凉海风散步，跨海大桥亮灯那一瞬间太震撼了。",
        updatedAt: "2026-09-01T08:05:00.000Z"
      },
      {
        reviewerId: "reviewer2",
        reviewerName: "妈妈",
        reviewerAvatar: "👩",
        kidRating: 5,
        elderlyRating: 5,
        strollerRating: 5,
        overallRating: 5,
        preference: "must_go",
        comment: "小宝在白鸽广场玩得不想走，鸽子特别温顺亲人。给爷爷奶奶租了四人脚踏车，一家人其乐融融，满分推荐！",
        updatedAt: "2026-09-01T08:35:00.000Z"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "site-dalian-forest-zoo",
    name: "大连森林动物园 (熊猫馆/小动物村)",
    localName: "Dalian Forest Zoo (Panda Pavilion & Petting Village)",
    category: "park",
    coordinates: [38.8789, 121.6145],
    address: "辽宁省大连市西岗区迎春路60号 (散养区南门入口)",
    city: "大连",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Dalian_Forest_Zoo.jpg/1280px-Dalian_Forest_Zoo.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Dalian_Forest_Zoo.jpg/1280px-Dalian_Forest_Zoo.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Dalian_Zoo.jpg/1280px-Dalian_Zoo.jpg",
      "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://vjs.zencdn.net/v/oceans.mp4"
    ],
    description: "依山傍海的国家AAAA级自然山水动物园！依白云山而建，森林覆盖率极高。园区最耀眼的明星当属散养区大熊猫馆（“飞云”、“妙音”、“金虎”三只顶流国宝，憨态可掬啃竹子打滚）；还有深受儿童喜爱的小动物村（可零距离抚摸羊驼、小矮马、喂长颈鹿吃树叶）、热带雨林爬虫馆与跨海摩天轮。园区观光电瓶车直达各馆，免除长辈登山劳累。",
    recommendedDurationMin: 240,
    openingHours: "09:00 - 16:30 (16:00 停止入场)",
    admissionFee: {
      adult: "120元/人 (旺季)",
      senior: "60-69岁老人凭证半价(60元)，70岁以上老人免费",
      child4yo: "6周岁或身高1.3米以下儿童免门票",
      notes: "建议从散养区南门入园，南门直奔大熊猫馆最省力"
    },
    bestTimeToVisit: "早晨 09:00 - 11:30 (早晨大熊猫最活跃，下午气温高易在室内睡觉)",
    weatherSuitability: "晴天或凉爽阴天适宜 (林荫茂密，但山地雨后路滑)",
    strollerRating: 4,
    strollerNotes: "园区依山而建有坡度，但主干道路面柏油平坦；推荐购买园区观光电瓶车票，推车折叠带上车，到站下车推行，省力倍增。",
    kidRating: 5,
    kidNotes: "三只大熊猫太可爱了！隔着玻璃看飞云吃竹子荡秋千，还能在长颈鹿看台拿桑树叶亲自喂长颈鹿，4岁宝宝全程兴奋尖叫。",
    elderlyRating: 4,
    elderlyNotes: "绿树成荫空气含氧量极高，但严禁全程徒步登山；务必在南门购买观光车手环，乘车代步看核心动物，轻松不费腿力。",
    walkingIntensity: "中等 (约1.5-2.0公里；配合观光车可减少大部分登山路段)",
    stairsLevel: "平坦至中等台阶 (主道有坡道，核心展馆均有无障碍坡道绕行)",
    amenities: {
      nursingRoom: true,
      diaperChanging: true,
      accessibleRestroom: true,
      benchesRestAreas: true,
      shuttleOrCart: true,
      elevatorAvailable: false,
      strollerRental: true,
      wheelchairRental: true,
      shadeAvailable: true,
      indoorRainyDayOption: true,
      kidPlayArea: true
    },
    familyTips: [
      "强烈建议路线：从【南门（散养区）】进！进门就是大熊猫馆和小动物村，看完大熊猫后坐园区观光车游览，避免走北门的高强度山路爬坡。",
      "大熊猫通常在上午 09:30 - 11:00 进食竹子最活跃，下午多在内舍睡大觉，务必把熊猫馆安排在上午第一站。",
      "长颈鹿喂食台需购买新鲜树叶（约20元/份），长颈鹿大舌头卷树叶非常温顺，拍照极有纪念意义。"
    ],
    nearbyDining: [
      {
        id: "d10",
        name: "森林动物园·熊猫主题亲子餐厅",
        cuisine: "卡通熊猫饭团套餐 / 儿童咖喱 / 现煮玉米排骨汤",
        familyFeatures: "透明落地窗正对小兽散放区，提供可爱熊猫造型餐盘与宝宝椅，口味少盐温和",
        walkingTimeMin: 2
      }
    ],
    customTags: ["顶流大熊猫", "飞云妙音", "喂长颈鹿", "小动物村", "林荫遮阳", "南门入园"],
    reviews: [
      {
        reviewerId: "reviewer1",
        reviewerName: "爸爸",
        reviewerAvatar: "👨",
        kidRating: 5,
        elderlyRating: 4,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "一定要听劝走南门！进门不到5分钟就是大熊猫馆，飞云吃笋萌翻全场。观光车很有必要买，推车折叠上车，省去推车爬山之苦。",
        updatedAt: "2026-09-01T08:12:00.000Z"
      },
      {
        reviewerId: "reviewer2",
        reviewerName: "妈妈",
        reviewerAvatar: "👩",
        kidRating: 5,
        elderlyRating: 4,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "热带雨林爬虫馆和长颈鹿互动太赞了，小宝喂长颈鹿时激动得不行。山里树木多空气特别新鲜，老人走走停停很舒畅。",
        updatedAt: "2026-09-01T08:42:00.000Z"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "site-dalian-sun-asia-ocean-world",
    name: "大连圣亚海洋世界",
    localName: "Sun Asia Ocean World (Xinghai Park)",
    category: "attraction",
    coordinates: [38.8784, 121.5712],
    address: "辽宁省大连市沙河口区中山路608-6-8号 (星海公园西侧内)",
    city: "大连",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://vjs.zencdn.net/v/oceans.mp4"
    ],
    description: "坐落在浪漫星海公园内的中国第一座拥有118米超长海底通道的水族胜地！包含「圣亚海洋世界」、「极地世界」、「珊瑚世界」与「银河星海」四大核心馆。经典水下双人白鲸海豚芭蕾《海豚湾之恋》美轮美奂；海狮海象情景喜剧《功夫海象》笑点密集。118米海底通道配有自动前行传送带，鲨鱼、鳐鱼在头顶盘旋穿梭，纯室内空调，适合三代同堂无忧漫步。",
    recommendedDurationMin: 210,
    openingHours: "08:30 - 17:00 (演出场次按当日时刻表)",
    admissionFee: {
      adult: "四馆套票约190-220元/人",
      senior: "65岁以上长辈凭老年证享优待半价",
      child4yo: "身高1.3米以下儿童免费入场 (每位成人可带一名免票儿童)",
      notes: "一票通用四大展馆，包含全部场次演艺秀，无需另购演出票"
    },
    bestTimeToVisit: "上午 09:30 - 13:00 (看完海豚湾之恋和功夫海象正好衔接午餐与下午午睡)",
    weatherSuitability: "室内 (雨天/避暑优选，全场馆恒温空调)",
    strollerRating: 5,
    strollerNotes: "各馆通道平整宽敞，海底通道有平移步道，婴儿车推行极轻松；演出剧场前排均留有轮椅与婴儿车专属泊位。",
    kidRating: 5,
    kidNotes: "海底通道里近距离仰望大鳐鱼的“笑脸”和巨大鲨鱼，极地馆看企鹅排队跳水，海豚表演还会跃出水面击打高空红球，孩子全程目不暇接。",
    elderlyRating: 5,
    elderlyNotes: "全程在室内平地行走，海底通道站上自动步道即可缓缓前行不用抬脚；两场重量级演艺剧场均有舒适靠背座椅休息看秀。",
    walkingIntensity: "轻松 (<1.0公里，平地加剧场就座观演)",
    stairsLevel: "平坦 / 无台阶",
    amenities: {
      nursingRoom: true,
      diaperChanging: true,
      accessibleRestroom: true,
      benchesRestAreas: true,
      shuttleOrCart: false,
      elevatorAvailable: true,
      strollerRental: true,
      wheelchairRental: true,
      shadeAvailable: true,
      indoorRainyDayOption: true,
      kidPlayArea: true
    },
    familyTips: [
      "入馆第一时间拍摄入口大屏幕的演艺时间表，核心锁定《海豚湾之恋》（极地馆）与《功夫海象》（海洋世界）两场王牌秀，提前20分钟入场占好视野中间位。",
      "圣亚就在星海公园里，游览完毕后出门就是星海公园绿树长椅和海滩，适合慢节奏散步。",
      "馆内设有带空调的母婴休息室，哺乳与更换纸尿裤十分便利卫生。"
    ],
    nearbyDining: [
      {
        id: "d11",
        name: "星海公园和顺面馆",
        cuisine: "现擀清汤大虾面 / 鲜肉小馄饨 / 蒸饺",
        familyFeatures: "出馆步行3分钟即达，清汤温和爽口不油腻，提供宝宝椅与小碗",
        walkingTimeMin: 3
      }
    ],
    customTags: ["118米海底通道", "海豚湾之恋", "功夫海象", "室内空调", "纯平推车", "星海公园内"],
    reviews: [
      {
        reviewerId: "reviewer1",
        reviewerName: "爸爸",
        reviewerAvatar: "👨",
        kidRating: 5,
        elderlyRating: 5,
        strollerRating: 5,
        overallRating: 5,
        preference: "must_go",
        comment: "海底隧道体验比普通水族馆震撼很多，站在履带上慢慢前行，鲨鱼和魔鬼鱼从头顶游过。海象秀特别幽默，老少全场大笑。",
        updatedAt: "2026-09-01T08:18:00.000Z"
      },
      {
        reviewerId: "reviewer2",
        reviewerName: "妈妈",
        reviewerAvatar: "👩",
        kidRating: 5,
        elderlyRating: 5,
        strollerRating: 5,
        overallRating: 5,
        preference: "must_go",
        comment: "全室内空调真的很救命！夏天带长辈孩子完全不用受日晒之苦，剧场座位宽敞，看完表演精神饱满，很适合安排在上午。",
        updatedAt: "2026-09-01T08:48:00.000Z"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "site-dalian-laohutan-ocean-park",
    name: "大连老虎滩海洋公园 (极地馆/鸟语林)",
    localName: "Dalian Laohutan Ocean Park (Polar Museum & Bird Park)",
    category: "attraction",
    coordinates: [38.8685, 121.6705],
    address: "辽宁省大连市中山区滨海中路9号",
    city: "大连",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/%E8%80%81%E8%99%8E%E6%BB%A9%E6%B5%B7%E6%B4%8B%E5%85%AC%E5%9B%AD%E6%AD%A3%E9%97%A8.jpg/1280px-%E8%80%81%E8%99%8E%E6%BB%A9%E6%B5%B7%E6%B4%8B%E5%85%AC%E5%9B%AD%E6%AD%A3%E9%97%A8.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/%E8%80%81%E8%99%8E%E6%BB%A9%E6%B5%B7%E6%B4%8B%E5%85%AC%E5%9B%AD%E6%AD%A3%E9%97%A8.jpg/1280px-%E8%80%81%E8%99%8E%E6%BB%A9%E6%B5%B7%E6%B4%8B%E5%85%AC%E5%9B%AD%E6%AD%A3%E9%97%A8.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/Dalian_Laohutan_Ocean_Park.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Dalian_laohutan.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Bird_Park_%28Dalian%29.jpg/1280px-Bird_Park_%28Dalian%29.jpg"
    ],
    videos: [
      "https://vjs.zencdn.net/v/oceans.mp4"
    ],
    description: "大连最具代表性的国家AAAAA级自然滨海海洋主题公园！依偎在秀丽的滨海中路天然港湾。五大王牌场馆各具千秋：中国最大极地海洋动物馆（帝企鹅繁育基地、凶猛北极熊、白鲸互动）、五彩珊瑚馆、天然海湾海兽馆、欢腾剧场海狮秀，以及全国规模最大的半自然网笼式「鸟语林」（上千只火烈鸟、孔雀与黑天鹅零距离互动）。海湾秀丽，老少皆爱。",
    recommendedDurationMin: 270,
    openingHours: "08:30 - 17:00 (16:00 停止检票)",
    admissionFee: {
      adult: "通票约190-220元/人",
      senior: "60-69岁老人凭证享半价优待，70周岁以上老人免费",
      child4yo: "身高1.3米以下儿童免费入园",
      notes: "通票含极地馆、珊瑚馆、海兽馆、欢腾剧场及鸟语林五大景区"
    },
    bestTimeToVisit: "上午 09:00 入园 (先游极地馆与珊瑚馆，下午漫步鸟语林)",
    weatherSuitability: "全天候适宜 (室内三大馆遮风避暑，鸟语林树木阴凉)",
    strollerRating: 4,
    strollerNotes: "极地馆与珊瑚馆内部无障碍电梯坡道齐全，推车顺畅；海兽馆外围与前往鸟语林建议乘坐园区电瓶车或无障碍步道。",
    kidRating: 5,
    kidNotes: "北极熊潜水游泳的憨态逗乐了宝宝，鸟语林里孔雀就走在脚边，还可以给漂亮的彩色鹦鹉喂瓜子，亲近自然满分。",
    elderlyRating: 4,
    elderlyNotes: "公园沿天然老虎滩海湾展开，海天一色；极地馆室内空调凉爽，馆与馆之间建议乘观光小火车代步，节省体力。",
    walkingIntensity: "适中 (约1.8-2.5公里；建议乘园区观光电瓶车接驳各馆)",
    stairsLevel: "平坦至少量台阶 (主路线坡道完善，海兽馆有部分缓坡台阶)",
    amenities: {
      nursingRoom: true,
      diaperChanging: true,
      accessibleRestroom: true,
      benchesRestAreas: true,
      shuttleOrCart: true,
      elevatorAvailable: true,
      strollerRental: true,
      wheelchairRental: true,
      shadeAvailable: true,
      indoorRainyDayOption: true,
      kidPlayArea: true
    },
    familyTips: [
      "鸟语林位于主园区外侧（出正门过跨海桥即达，门票已含），千万别错过！里面孔雀成群在草地上漫步，火烈鸟极其鲜艳出片。",
      "极地馆内的白鲸水下展厅常有白鲸贴着玻璃跟孩子点头做表情，带娃多停留几分钟往往有意外惊喜互动。",
      "正门广场有租借四轮家庭代步电瓶车的网点，三代同游租一辆代步车游玩更轻松。"
    ],
    nearbyDining: [
      {
        id: "d12",
        name: "渔人码头·九月海风餐厅",
        cuisine: "海鲜现蒸软饺 / 清炖杂鱼 / 儿童鲜虾面",
        familyFeatures: "紧邻老虎滩渔人码头，满眼欧式渔港木船风情，口味清淡鲜甜，备有儿童椅",
        walkingTimeMin: 10
      }
    ],
    customTags: ["国家5A级", "帝企鹅繁育", "北极熊", "鸟语林孔雀", "滨海路风光", "老少皆宜"],
    reviews: [
      {
        reviewerId: "reviewer1",
        reviewerName: "爸爸",
        reviewerAvatar: "👨",
        kidRating: 5,
        elderlyRating: 4,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "大连老牌5A景区名不虚传，极地馆里企鹅规模很大，北极熊在玻璃前大爪子划水看得很清晰。鸟语林尤其惊艳，小宝追着孔雀跑很开心。",
        updatedAt: "2026-09-01T08:22:00.000Z"
      },
      {
        reviewerId: "reviewer2",
        reviewerName: "妈妈",
        reviewerAvatar: "👩",
        kidRating: 5,
        elderlyRating: 4,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "逛完老虎滩顺路去旁边的渔人码头喝咖啡吃海鲜面，渔港停满复古渔船，长辈和宝宝都玩得很尽兴。",
        updatedAt: "2026-09-01T08:52:00.000Z"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "site-dalian-yinggeshi-botanical-garden",
    name: "英歌石植物园 (花海慢游)",
    localName: "Yinggeshi Botanical Garden (Longwangtang)",
    category: "nature",
    coordinates: [38.8872, 121.3688],
    address: "辽宁省大连市高新园区龙王塘街道英歌石村",
    city: "大连",
    coverImage: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://vjs.zencdn.net/v/oceans.mp4"
    ],
    description: "被誉为“中国最美世外花园”的幽静梯田花谷！依青山梯田缓坡顺势而建，数百万株名贵花卉依据四季梯度绽放：春有郁金香与芝樱花海，夏有无尽夏绣球花谷、牡丹芍药，秋有斑斓彩叶林。园内山泉细流潺潺，黑天鹅在镜面湖中游弋，儿童森林木屋沙池乐园绿树成荫。极高负氧离子的纯净空气，是长辈慢步养生、宝宝在大自然里采风识花的天然绿洲。",
    recommendedDurationMin: 180,
    openingHours: "08:00 - 17:30 (开花旺季 07:30 开放)",
    admissionFee: {
      adult: "60元/人 (花期旺季)",
      senior: "60-69周岁半价(30元)，70周岁以上凭身份证免费",
      child4yo: "身高1.3米以下儿童免费",
      notes: "园区提供全景环保电瓶观光车 (约20-30元/人，随招随停)"
    },
    bestTimeToVisit: "早晨 08:30 - 11:30 (晨光透过花瓣最清新，气温舒适凉爽)",
    weatherSuitability: "晴天最佳 (阳光照耀下花海色彩艳丽，适合拍照养生)",
    strollerRating: 4,
    strollerNotes: "园区主游步道均为平整的防滑石板与柏油路面，推车便利；深入个别山坡小道有坡度，推荐乘坐园区电瓶车沿主环线慢赏。",
    kidRating: 4,
    kidNotes: "大自然里的植物大课堂！天鹅湖边可以喂优雅的黑天鹅，儿童无动力游乐区有原木滑梯秋千和沙坑，宝宝玩得不亦乐乎。",
    elderlyRating: 5,
    elderlyNotes: "空气甜美清新，到处是绚烂花海与长寿树木，长辈极其喜爱；梯田步道坡度极缓，沿途亭台水榭与休息木椅随处可见。",
    walkingIntensity: "轻松至适中 (约1.2-1.8公里；配合观光车极其省力)",
    stairsLevel: "平坦至少量台阶 (主线有坡道绕行无台阶)",
    amenities: {
      nursingRoom: false,
      diaperChanging: false,
      accessibleRestroom: true,
      benchesRestAreas: true,
      shuttleOrCart: true,
      elevatorAvailable: false,
      strollerRental: false,
      wheelchairRental: true,
      shadeAvailable: true,
      indoorRainyDayOption: false,
      kidPlayArea: true
    },
    familyTips: [
      "一定要在正门乘坐观光电瓶车直达山顶最高处的「芝樱花海」或「绣球花谷」，然后自上而下缓缓步行下山，省力90%！",
      "植物园草坪允许搭建遮阳防潮小帐篷与铺设野餐垫，自备些水果点心与保温杯温水，全家在花香鸟鸣中休憩享受慢时光。",
      "穿浅色或白色衣物拍照最仙，背景是漫山遍野的鲜花，爷爷奶奶拍出的气色格外年轻红润。"
    ],
    nearbyDining: [
      {
        id: "d13",
        name: "英歌石乡村田园土菜馆",
        cuisine: "农家笨鸡蛋炒大葱 / 柴火小鸡炖蘑菇 / 玉米面饼子",
        familyFeatures: "现采现做绿色有机蔬菜，笨鸡汤鲜美营养适合老人小孩，农家院落安静开阔",
        walkingTimeMin: 4
      }
    ],
    customTags: ["中国最美花园", "郁金香绣球花", "负氧离子吸氧", "黑天鹅湖", "长辈最爱", "慢节奏养生"],
    reviews: [
      {
        reviewerId: "reviewer1",
        reviewerName: "爸爸",
        reviewerAvatar: "👨",
        kidRating: 4,
        elderlyRating: 5,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "名副其实的大花园！空气新鲜极了，花开得铺天盖地。坐观光车上山再慢慢走下来，一点都不累，爷爷奶奶赞不绝口。",
        updatedAt: "2026-09-01T08:16:00.000Z"
      },
      {
        reviewerId: "reviewer2",
        reviewerName: "妈妈",
        reviewerAvatar: "👩",
        kidRating: 4,
        elderlyRating: 5,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "给全家拍了超级多惊艳的照片！黑天鹅特别优雅，宝宝在草地上抓蝴蝶追风车，老人坐在紫藤花架下乘凉，特别治愈身心。",
        updatedAt: "2026-09-01T08:46:00.000Z"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "site-dalian-luotuoshan-haibin",
    name: "骆驼山海滨 (瓦房店原始海岸/赶海)",
    localName: "Camel Mountain Coastal Park (Wafangdian)",
    category: "nature",
    coordinates: [39.8152, 121.4655],
    address: "辽宁省大连市瓦房店市西岗镇驼山乡海滨村",
    city: "大连",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://vjs.zencdn.net/v/oceans.mp4"
    ],
    description: "大连北部渤海湾畔宛若世外桃源的秘境原生态海岸！天然海蚀巨岩如一峰昂首向海的巨大骆驼卧于碧波之中，惟妙惟肖。岸边拥有绵延数里的茂密海防黑松林与平缓浅海滩涂，是绝佳的原生态赶海宝地：潮退时浅滩裸露，带着小桶与小耙子，随手即可翻开碎石捡小花盖蟹、小海星、海螺与野生牡蛎。游人稀少清幽，海鸥成群翱翔，全家体验质朴纯真的渤海渔乡野趣。",
    recommendedDurationMin: 180,
    openingHours: "全天开放 (赶海需根据每日潮汐表选择退潮时段)",
    admissionFee: {
      adult: "完全免费",
      senior: "完全免费",
      child4yo: "完全免费",
      notes: "原生态海滨公园无门票，停车费约10-20元/车"
    },
    bestTimeToVisit: "根据大连当日潮汐表：大退潮前后2小时 (潮退水浅海产最丰富)",
    weatherSuitability: "晴天或多云适宜 (海风和煦，海防林下凉爽舒适)",
    strollerRating: 3,
    strollerNotes: "自驾车可直达离沙滩数十米的林边停车场；松林步道可推推车，进礁石滩涂赶海时建议换上防滑涉水鞋徒步。",
    kidRating: 5,
    kidNotes: "原生态赶海快乐翻倍！石头缝里抓小螃蟹、挖蛤蜊、看弹涂鱼在泥滩上跳跃，4岁幼童能专注探索整个下午。",
    elderlyRating: 4,
    elderlyNotes: "海风轻柔不潮湿，海防松林空气带着松香与淡淡海盐味，长辈可在松树林下铺设野餐垫静坐观潮，避开喧嚣人潮。",
    walkingIntensity: "轻松至适中 (海滩赶海慢行约800米)",
    stairsLevel: "平坦 / 无台阶 (从停车场到海滩为原生态平地与沙石)",
    amenities: {
      nursingRoom: false,
      diaperChanging: false,
      accessibleRestroom: true,
      benchesRestAreas: false,
      shuttleOrCart: false,
      elevatorAvailable: false,
      strollerRental: false,
      wheelchairRental: false,
      shadeAvailable: true,
      indoorRainyDayOption: false,
      kidPlayArea: true
    },
    familyTips: [
      "出行前务必使用小程序查看【瓦房店/驼山潮汐表】，退潮至最低潮位（干潮）前1.5小时到达海滩，是赶海收获最多的黄金窗口期！",
      "务必备齐装备：儿童防滑防割涉水鞋（防礁石牡蛎壳划脚）、小手套、塑料小桶、小耙子与湿纸巾。",
      "松树林边有当地渔民开的海鲜小馆，现煮刚刚捕捞的海蜇、皮皮虾、杂鱼锅，原汁原味鲜甜至极。"
    ],
    nearbyDining: [
      {
        id: "d14",
        name: "驼山渔家鲜味居",
        cuisine: "野生渤海湾杂鱼炖豆腐 / 现煮皮皮虾 / 菜汁小黄花鱼",
        familyFeatures: "渔船直供活海鲜，少油清蒸，鲜美无添加，农家炕榻榻米可供老人孩子歇息",
        walkingTimeMin: 5
      }
    ],
    customTags: ["秘境赶海", "原生态海岸", "骆驼奇石", "松林海风", "抓小螃蟹", "自驾小众"],
    reviews: [
      {
        reviewerId: "reviewer1",
        reviewerName: "爸爸",
        reviewerAvatar: "👨",
        kidRating: 5,
        elderlyRating: 4,
        strollerRating: 3,
        overallRating: 5,
        preference: "must_go",
        comment: "没有商业开发的纯原生态海滩！带娃赶海收获爆棚，抓了一小桶小螃蟹和海螺，骆驼山巨石很宏伟，非常适合自驾一日游。",
        updatedAt: "2026-09-01T08:28:00.000Z"
      },
      {
        reviewerId: "reviewer2",
        reviewerName: "妈妈",
        reviewerAvatar: "👩",
        kidRating: 5,
        elderlyRating: 4,
        strollerRating: 3,
        overallRating: 5,
        preference: "must_go",
        comment: "松林里特别凉爽，老人坐折叠椅上喝茶看海极惬意。孩子玩泥巴抓螃蟹开心得不得了，临走把小螃蟹放归大海，特别有教育意义。",
        updatedAt: "2026-09-01T08:58:00.000Z"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "site-dalian-zhuanghe-geli-island",
    name: "庄河蛤蜊岛 (自驾跨海大堤/赶海吃蛤)",
    localName: "Zhuanghe Geli Island (Clam Island Resort)",
    category: "relax",
    coordinates: [39.6385, 123.0185],
    address: "辽宁省大连市庄河市黑岛镇蛤蜊岛度假区 (经跨海公路大堤直达)",
    city: "大连",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://vjs.zencdn.net/v/oceans.mp4"
    ],
    description: "黄海北部风光旖旎的宝藏海岛度假胜地！最大的亮点是建有一条长达数公里的笔直跨海公路大堤——自驾车可直接一路开上海岛，完全免去老人孩子乘渡轮颠簸搬行李之苦！海岛三面环海，一面耸立秀峰，拥有天然优质细沙海滩与全国著名的优质蛤蜊滩涂。退潮时沙滩平缓如镜，拿小耙子轻轻一挖就是肥美的大骨顶蛤与杂色蛤，现挖现蒸鲜香扑鼻，被誉为“东方夏威夷”与“蛤蜊王国”。",
    recommendedDurationMin: 240,
    openingHours: "08:00 - 18:00 (岛内度假酒店全天开放)",
    admissionFee: {
      adult: "约40-50元/人",
      senior: "60-69岁半价，70周岁以上老人凭有效身份证免费",
      child4yo: "身高1.3米以下儿童免票入岛",
      notes: "自驾车辆开入岛内停车极为方便，酒店住客常包含景区门票"
    },
    bestTimeToVisit: "夏季下午 14:30 进岛至傍晚 18:00 (潮退赶海挖蛤蜊，吃晚霞海鲜大排档)",
    weatherSuitability: "全天候适宜 (海岛气候凉爽，海风习习无酷暑)",
    strollerRating: 4,
    strollerNotes: "汽车直通岛上各景点与酒店大堂，岛内环岛公路平坦，海滨木栈道连贯，推婴儿车赏海极平稳。",
    kidRating: 5,
    kidNotes: "挖蛤蜊的成就感爆棚！沙滩里的蛤蜊又大又多，孩子一耙子下去就有两三个大蛤蜊，还可以在沙滩上捡彩石踏浪。",
    elderlyRating: 5,
    elderlyNotes: "车开上海岛免去乘船晕眩与上下渡轮的折腾，长辈赞誉极高；岛上海鲜肥美清淡，现煮蛤蜊汤清亮鲜甜，养生滋补。",
    walkingIntensity: "轻松 (约1.0公里；车随人走，累了随时上车或就座)",
    stairsLevel: "平坦 / 无台阶",
    amenities: {
      nursingRoom: false,
      diaperChanging: false,
      accessibleRestroom: true,
      benchesRestAreas: true,
      shuttleOrCart: true,
      elevatorAvailable: false,
      strollerRental: false,
      wheelchairRental: false,
      shadeAvailable: true,
      indoorRainyDayOption: true,
      kidPlayArea: true
    },
    familyTips: [
      "跨海大堤本身就是一道绝美风景，两旁海水湛蓝，开车自驾宛如行进在海中央，可放慢车速摇下车窗感受黄海海风。",
      "挖蛤蜊必备工具：铁耙子、小塑料桶、防晒帽。挖出来的蛤蜊可在岛上渔家餐馆请老板代加工白灼清蒸，鲜美得舌头都要化掉！",
      "若时间充裕推荐在岛上海景木屋住一晚，早晨拉开窗帘看黄海日出，夜晚沙滩静谧星光璀璨。"
    ],
    nearbyDining: [
      {
        id: "d15",
        name: "蛤蜊岛·海之味海鲜渔庄",
        cuisine: "原汁蒸庄河大骨顶蛤 / 鲜辣炒花蛤 / 蛤蜊手擀面",
        familyFeatures: "自家挖的蛤蜊可即时加工，现熬蛤蜊海鲜面鲜香适口，老少皆爱，提供儿童餐具",
        walkingTimeMin: 3
      }
    ],
    customTags: ["自驾车直达海岛", "挖蛤蜊胜地", "东方夏威夷", "免乘渡轮", "海鲜现煮", "三代度假"],
    reviews: [
      {
        reviewerId: "reviewer1",
        reviewerName: "爸爸",
        reviewerAvatar: "👨",
        kidRating: 5,
        elderlyRating: 5,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "车能直接开上岛太赞了！完全不用提大包小包赶渡轮。沙滩里蛤蜊多得惊人，挖了半桶当场让店家蒸熟，鲜甜多汁极了！",
        updatedAt: "2026-09-01T08:30:00.000Z"
      },
      {
        reviewerId: "reviewer2",
        reviewerName: "妈妈",
        reviewerAvatar: "👩",
        kidRating: 5,
        elderlyRating: 5,
        strollerRating: 4,
        overallRating: 5,
        preference: "must_go",
        comment: "水质很干净，沙滩细腻。长辈很满意不用坐颠簸的小船，坐在木栈道看海景吃蛤蜊面，全家都说下次还要来慢住两天。",
        updatedAt: "2026-09-01T09:00:00.000Z"
      }
    ],
    createdAt: "2026-09-01T08:00:00.000Z"
  }
];

// Now construct the complete 8-Day Dalian Trip
const dalianTrip: Trip = {
  id: "trip-dalian-coastal-multigen-2026",
  title: "大连海滨浪漫亲子慢游 (山海牧场·海洋世界·地质公园·出海喂海鸥) 🌊🦭⛵",
  destination: "中国 · 大连 (中山 · 沙河口 · 金石滩 · 旅顺 · 庄河)",
  startDate: "2026-07-10",
  endDate: "2026-07-17",
  coverImage: "https://upload.wikimedia.org/wikipedia/commons/8/87/Xinghai_Square_%28Dalian%29.jpg",
  summary: "专为4岁活泼幼童与65岁以上长辈设计的8天7晚大连海滨度假慢游！汇聚星海广场鸽群海鸥、圣亚海底隧道、豪华双体帆船出海投喂、森林动物园大熊猫、三寰牧场小新西兰草坡、发现王国亲子城堡夜场、金石滩黄金海岸与十里地质奇观、英歌石植物园花海、瓦房店骆驼山海蚀赶海与庄河蛤蜊岛自驾直达吃蛤。每日严格保障1.5小时午睡充电与全程无障碍推车关怀。",
  createdAt: "2026-09-01T08:00:00.000Z",
  updatedAt: "2026-09-01T08:00:00.000Z",
  partyMembers: [
    {
      id: "dp1",
      name: "小宝 (Leo)",
      role: "👶 4岁幼童",
      notes: "极爱大熊猫、白鲸水族馆、出海喂海鸥、海滩挖沙与羊驼互动，每天下午 13:30-15:00 必须回酒店午睡充电"
    },
    {
      id: "dp2",
      name: "爷爷 & 奶奶",
      role: "🧓 长辈/爷爷奶奶",
      notes: "喜爱海风慢步、开阔海天、清淡海鲜蒸菜/和合水饺/大连老菜，严禁高强度登山爬坡，优先电瓶车代步"
    },
    {
      id: "dp3",
      name: "爸爸 & 妈妈",
      role: "🧑 父母/领队",
      notes: "负责推车、包车自驾自如切换、海滨防晒装备与行程节奏控制，确保全家轻松不赶路"
    }
  ],
  checklist: [
    { id: "dc1", category: "幼童用品 (4岁)", item: "便携轻便折叠婴儿推车 (各大展馆全平无障碍)", checked: true },
    { id: "dc2", category: "幼童用品 (4岁)", item: "海滩挖沙玩具套装 (小水桶、塑料铲、挖蛤蜊小耙子)", checked: true },
    { id: "dc3", category: "幼童用品 (4岁)", item: "儿童防滑涉水溯溪鞋 (瓦房店骆驼山与庄河赶海防贝壳)", checked: true },
    { id: "dc4", category: "幼童用品 (4岁)", item: "儿童防风连帽薄外套 (傍晚出海吹海风防着凉)", checked: true },
    { id: "dc5", category: "长辈/健康保健", item: "长辈慢病随身药盒 (降压药等随身小包携带)", checked: true },
    { id: "dc6", category: "长辈/健康保健", item: "不锈钢便携保温水杯 (随时补充温开水/大麦茶)", checked: true },
    { id: "dc7", category: "长辈/健康保健", item: "轻便折叠防滑健步手杖", checked: true },
    { id: "dc8", category: "全家必备", item: "高倍数海滨防晒霜 (SPF50+) & 遮阳帽墨镜", checked: true },
    { id: "dc9", category: "全家必备", item: "喂海鸥干鱼小食 & 白鸽玉米粒 (星海湾出海喂海鸥)", checked: true },
    { id: "dc10", category: "全家必备", item: "大容量移动电源 (录制海鸥伴飞与萌娃喂羊驼)", checked: true },
    { id: "dc11", category: "证件与数码", item: "身份证原件 (长辈60+/70+门票减免优待凭证)", checked: true }
  ],
  days: [
    {
      id: "dalian-day-1",
      dayNumber: 1,
      date: "2026-07-10",
      theme: "抵达大连·初遇浪漫海湾·星海广场慢步",
      napBreakIncluded: true,
      dailyNotes: "入住星海湾高品质海景家庭套房，行程节奏极缓，傍晚散步喂鸽吹海风看跨海大桥霓虹。",
      stops: [
        {
          id: "s1-1",
          siteId: "site-dalian-xinghai-square",
          timeSlot: "afternoon",
          startTime: "16:00",
          endTime: "18:00",
          customNotes: "入住酒店休整后前往星海广场，在白鸽广场喂和平鸽，百年城雕台阶看海鸥与跨海大桥。",
          transportToNext: {
            mode: "walk",
            durationMin: 8,
            familyNote: "从广场中心慢步推车穿过滨海走廊直达品海楼"
          }
        },
        {
          id: "s1-2",
          siteId: "",
          timeSlot: "dinner",
          startTime: "18:00",
          endTime: "19:30",
          customNotes: "在「品海楼 (星海店)」享用迎宾大连老菜，金牌脆皮虾、软糯海参包子，老幼皆喜。"
        },
        {
          id: "s1-3",
          siteId: "site-dalian-xinghai-square",
          timeSlot: "evening",
          startTime: "19:30",
          endTime: "20:30",
          customNotes: "饭后步行至海边观赏星海广场大型音乐喷泉秀，跨海大桥千盏华灯齐放，随后回酒店休息。"
        }
      ]
    },
    {
      id: "dalian-day-2",
      dayNumber: 2,
      date: "2026-07-11",
      theme: "海底隧道探秘·午间充电·双体帆船出海喂海鸥",
      napBreakIncluded: true,
      dailyNotes: "上午圣亚全室内无日晒，午后严格保障小宝在酒店午睡1.5小时，傍晚出海喂海鸥看夕阳。",
      stops: [
        {
          id: "s2-1",
          siteId: "site-dalian-sun-asia-ocean-world",
          timeSlot: "morning",
          startTime: "09:30",
          endTime: "12:00",
          customNotes: "漫步118米海底通道看鲨鱼魔鬼鱼，观赏《海豚湾之恋》与《功夫海象》王牌演出。",
          transportToNext: {
            mode: "walk",
            durationMin: 5,
            familyNote: "出馆到星海公园和顺面馆，平坦树荫步道"
          }
        },
        {
          id: "s2-2",
          siteId: "",
          timeSlot: "lunch",
          startTime: "12:00",
          endTime: "13:00",
          customNotes: "享用鲜美大虾面与手工水饺，清淡养胃。"
        },
        {
          id: "s2-3",
          siteId: "",
          timeSlot: "nap_rest",
          startTime: "13:30",
          endTime: "15:30",
          isRestBreak: true,
          customNotes: "🌟 核心三代午睡保护：全家回酒店吹空调午休2小时，小宝深度睡眠充电，长辈泡茶小憩。"
        },
        {
          id: "s2-4",
          siteId: "site-dalian-yacht-cruise",
          timeSlot: "afternoon",
          startTime: "16:00",
          endTime: "17:30",
          customNotes: "乘坐豪华双体帆船出海！上千只海鸥盘旋伴飞，手递手投喂小鱼条，远眺跨海大桥日落。"
        }
      ]
    },
    {
      id: "dalian-day-3",
      dayNumber: 3,
      date: "2026-07-12",
      theme: "森林动物园看顶流飞云·小动物村喂长颈鹿",
      napBreakIncluded: true,
      dailyNotes: "从散养区南门进，观光车直达大熊猫馆看早晨进食，小动物村零距离互动，下午午睡。",
      stops: [
        {
          id: "s3-1",
          siteId: "site-dalian-forest-zoo",
          timeSlot: "morning",
          startTime: "09:00",
          endTime: "12:30",
          customNotes: "南门进乘电瓶车先睹国宝飞云啃竹子，随后在小动物村看羊驼、喂长颈鹿，树林遮阴凉爽。"
        },
        {
          id: "s3-2",
          siteId: "",
          timeSlot: "lunch",
          startTime: "12:30",
          endTime: "13:30",
          customNotes: "在熊猫主题餐厅享用亲子卡通定食与热玉米排骨汤。"
        },
        {
          id: "s3-3",
          siteId: "",
          timeSlot: "nap_rest",
          startTime: "14:00",
          endTime: "15:30",
          isRestBreak: true,
          customNotes: "🌟 亲子午休休整：酒店午睡，避开盛夏正午高温。"
        },
        {
          id: "s3-4",
          siteId: "site-dalian-xinghai-square",
          timeSlot: "afternoon",
          startTime: "16:30",
          endTime: "18:30",
          customNotes: "傍晚租用四轮亲子脚踏车慢骑海滨木栈道，享受惬意海风。"
        }
      ]
    },
    {
      id: "dalian-day-4",
      dayNumber: 4,
      date: "2026-07-13",
      theme: "黑石礁百年自然博物馆·旅顺三寰牧场小新西兰",
      napBreakIncluded: true,
      dailyNotes: "上午看亚洲最大黑露脊鲸骨架，全空调无障碍；下午前往三寰牧场看牧羊犬赶羊秀。",
      stops: [
        {
          id: "s4-1",
          siteId: "site-dalian-natural-history-museum",
          timeSlot: "morning",
          startTime: "09:30",
          endTime: "11:30",
          customNotes: "震撼的巨型鲸鱼骨架与恐龙展厅，三楼观海落地窗眺望黑石礁海潮拍岸。"
        },
        {
          id: "s4-2",
          siteId: "",
          timeSlot: "lunch",
          startTime: "11:30",
          endTime: "12:30",
          customNotes: "在喜家德水饺享用现包虾仁水饺与热饺子汤。"
        },
        {
          id: "s4-3",
          siteId: "",
          timeSlot: "nap_rest",
          startTime: "13:00",
          endTime: "14:30",
          isRestBreak: true,
          customNotes: "🌟 车程中或酒店小憩午睡充电。"
        },
        {
          id: "s4-4",
          siteId: "site-dalian-sanhuan-ranch",
          timeSlot: "afternoon",
          startTime: "15:00",
          endTime: "18:00",
          customNotes: "欧式大草坡牧场！看15:30牧羊犬赶羊秀，喂羊驼小羊，品尝现挤鲜牛奶与冰淇淋。"
        }
      ]
    },
    {
      id: "dalian-day-5",
      dayNumber: 5,
      date: "2026-07-14",
      theme: "金石滩黄金海岸踏浪·发现王国城堡水上焰火夜场",
      napBreakIncluded: true,
      dailyNotes: "转移至金石滩度假区，上午沙滩挖沙踏浪，午睡后15:30进发现王国玩亲子项目看夜景城堡烟花。",
      stops: [
        {
          id: "s5-1",
          siteId: "site-dalian-golden-pebble-beach",
          timeSlot: "morning",
          startTime: "09:00",
          endTime: "11:30",
          customNotes: "黄金海岸租遮阳伞躺椅，小宝在平缓浅滩挖沙堆堡，老人坐躺椅听海浪。"
        },
        {
          id: "s5-2",
          siteId: "",
          timeSlot: "lunch",
          startTime: "11:30",
          endTime: "12:30",
          customNotes: "渔家傲海鲜坊享用现蒸黄鱼与清甜杂色蛤豆腐汤。"
        },
        {
          id: "s5-3",
          siteId: "",
          timeSlot: "nap_rest",
          startTime: "13:00",
          endTime: "15:00",
          isRestBreak: true,
          customNotes: "🌟 金石滩度假酒店全员午睡休整，为精彩夜场蓄足体能！"
        },
        {
          id: "s5-4",
          siteId: "site-dalian-discovery-kingdom",
          timeSlot: "afternoon",
          startTime: "15:30",
          endTime: "21:00",
          customNotes: "玩转小人国与旋转木马，看花车大巡游，晚上八点压轴观赏城堡水上音乐焰火秀。"
        }
      ]
    },
    {
      id: "dalian-day-6",
      dayNumber: 6,
      date: "2026-07-15",
      theme: "国家地质公园恐龙探海·英歌石植物园仙境花海",
      napBreakIncluded: true,
      dailyNotes: "上午观光车巡礼亿年海蚀奇观，下午走进中国最美植物园慢步吸氧赏绣球花谷。",
      stops: [
        {
          id: "s6-1",
          siteId: "site-dalian-golden-pebble-beach",
          timeSlot: "morning",
          startTime: "09:00",
          endTime: "11:30",
          customNotes: "乘坐地质公园观光车直达观景平台，俯瞰万顷碧波与鬼斧神工的「恐龙探海」大石桥。"
        },
        {
          id: "s6-2",
          siteId: "",
          timeSlot: "lunch",
          startTime: "11:45",
          endTime: "12:45",
          customNotes: "品尝金石滩地道海鲜大包子与清爽凉拌海藻。"
        },
        {
          id: "s6-3",
          siteId: "",
          timeSlot: "nap_rest",
          startTime: "13:00",
          endTime: "14:30",
          isRestBreak: true,
          customNotes: "🌟 午睡小憩，恢复活力。"
        },
        {
          id: "s6-4",
          siteId: "site-dalian-yinggeshi-botanical-garden",
          timeSlot: "afternoon",
          startTime: "15:00",
          endTime: "17:30",
          customNotes: "坐观光车至花海山顶，顺梯田漫步下山，在黑天鹅湖畔喂天鹅，空气极度甘冽。"
        }
      ]
    },
    {
      id: "dalian-day-7",
      dayNumber: 7,
      date: "2026-07-16",
      theme: "瓦房店骆驼山海滨自驾·松林海风与原生态赶海",
      napBreakIncluded: true,
      dailyNotes: "自驾前往大连北部秘境骆驼山，松林下野餐，配合退潮时间翻石头抓螃蟹捡海螺。",
      stops: [
        {
          id: "s7-1",
          siteId: "site-dalian-luotuoshan-haibin",
          timeSlot: "morning",
          startTime: "10:00",
          endTime: "12:30",
          customNotes: "车停松林旁，换涉水鞋带小桶在浅滩礁石赶海，小螃蟹海星随便捡，眺望骆驼入海巨石。"
        },
        {
          id: "s7-2",
          siteId: "",
          timeSlot: "lunch",
          startTime: "12:30",
          endTime: "13:30",
          customNotes: "驼山渔家鲜味居现煮皮皮虾与家焖小黄鱼，大块炕头舒展双腿。"
        },
        {
          id: "s7-3",
          siteId: "",
          timeSlot: "nap_rest",
          startTime: "13:30",
          endTime: "15:00",
          isRestBreak: true,
          customNotes: "🌟 松林海风下树荫野餐垫午休，听海浪声安睡入梦。"
        },
        {
          id: "s7-4",
          siteId: "site-dalian-luotuoshan-haibin",
          timeSlot: "afternoon",
          startTime: "15:00",
          endTime: "17:00",
          customNotes: "将抓到的小螃蟹放归大海，在黑松林步道漫步，感受大自然馈赠。"
        }
      ]
    },
    {
      id: "dalian-day-8",
      dayNumber: 8,
      date: "2026-07-17",
      theme: "自驾跨海大堤登蛤蜊岛·滩涂挖大蛤·满载鲜美返程",
      napBreakIncluded: true,
      dailyNotes: "汽车直接开上蛤蜊岛免乘渡轮，滩涂体验一耙子挖两蛤的丰收乐趣，现煮原汁蛤蜊完美收官！",
      stops: [
        {
          id: "s8-1",
          siteId: "site-dalian-zhuanghe-geli-island",
          timeSlot: "morning",
          startTime: "09:30",
          endTime: "12:30",
          customNotes: "穿过跨海大堤登岛，在蛤蜊沙滩用铁耙挖肥美大骨顶蛤，小桶迅速装满，成就感满满！"
        },
        {
          id: "s8-2",
          siteId: "",
          timeSlot: "lunch",
          startTime: "12:30",
          endTime: "14:00",
          customNotes: "海岛渔庄当场加工刚挖的蛤蜊，煮一锅清亮鲜香的蛤蜊手擀面，鲜美无匹。"
        },
        {
          id: "s8-3",
          siteId: "site-dalian-zhuanghe-geli-island",
          timeSlot: "afternoon",
          startTime: "14:00",
          endTime: "15:30",
          customNotes: "海岛环岛木栈道留影合照，收拾行装，依依不舍踏上返程之旅。"
        }
      ]
    }
  ]
};

// Merge sites
const existingIds = new Set(INITIAL_SITES.map(s => s.id));
const mergedSites = [...INITIAL_SITES];
for (const s of dalianSites) {
  if (!existingIds.has(s.id)) {
    mergedSites.push(s);
  }
}

// Merge trips
const existingTripIds = new Set(INITIAL_TRIPS.map(t => t.id));
const mergedTrips = [...INITIAL_TRIPS];
const filteredTrips = mergedTrips.filter(t => t.id !== dalianTrip.id);
filteredTrips.push(dalianTrip);

// Write mockSites.ts and data/sites.json
fs.writeFileSync("./src/data/mockSites.ts", `import { Site } from "../types/travel";\n\nexport const INITIAL_SITES: Site[] = ${JSON.stringify(mergedSites, null, 2)};\n`);
fs.writeFileSync("./data/sites.json", JSON.stringify(mergedSites, null, 2));

// Write mockTrips.ts and data/trips.json
fs.writeFileSync("./src/data/mockTrips.ts", `import { Trip } from "../types/travel";\n\nexport const INITIAL_TRIPS: Trip[] = ${JSON.stringify(filteredTrips, null, 2)};\n`);
fs.writeFileSync("./data/trips.json", JSON.stringify(mergedTrips, null, 2));

console.log(`✅ Successfully added 12 Dalian sites (total ${mergedSites.length} sites) and Dalian Trip (total ${mergedTrips.length} trips)!`);
