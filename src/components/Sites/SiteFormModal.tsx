import React, { useState, useEffect } from 'react';
import { Site, SiteCategory, WalkingIntensity, StairsLevel, WeatherSuitability, SocialMediaLink, SocialPlatform, Trip } from '../../types/travel';
import { detectSocialPlatform, getPlatformMeta } from './SocialMediaSection';
import { 
  X, Search, Plus, Trash2, Check, Loader2, Sparkles, Bot, 
  Copy, Download, Wand2, SlidersHorizontal, AlertCircle, CheckCircle2, 
  Video, RefreshCw, ChevronDown, ChevronUp, MapPin, Eye, FileText 
} from 'lucide-react';
import { searchPlaces, GeocodeResult } from '../../services/geocoding';
import { 
  generateSiteResearchPrompt, parseLLMReply, getDefaultCustomFields, 
  CustomFieldDef 
} from '../../utils/llmSiteResearch';
import { getSmartCuratedMediaForSite } from '../../utils/photoCurator';

interface SiteFormModalProps {
  initialSite?: Site | null;
  initialCoords?: [number, number] | null;
  initialAddress?: string;
  initialName?: string;
  trip?: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (site: Site) => void | Promise<any>;
}

export const SiteFormModal: React.FC<SiteFormModalProps> = ({
  initialSite,
  initialCoords,
  initialAddress,
  initialName,
  trip,
  isOpen,
  onClose,
  onSave
}) => {
  const isTripDalian = trip?.id === 'trip-dalian-coastal-multigen-2026' || trip?.destination?.includes('大连') || trip?.title?.includes('大连');
  const defaultCity = isTripDalian ? '大连' : (trip?.destination?.includes('京都') ? '京都' : (trip?.destination?.includes('箱根') ? '箱根' : '东京'));
  const defaultAddress = isTripDalian ? '中国 辽宁省 大连市' : '日本 东京';
  const defaultLat = isTripDalian ? 38.8788 : 35.6764;
  const defaultLng = isTripDalian ? 121.6038 : 139.6993;
  const defaultAdultFee = isTripDalian ? '门票免费 / ¥50' : '免费参拜 / ¥500';
  const defaultSeniorFee = isTripDalian ? '60岁以上老人半价 / 免票' : '免费 / 半价';
  const defaultChildFee = isTripDalian ? '免费 (4岁 / 1.3米以下)' : '免费 (4岁)';

  const [name, setName] = useState('');
  const [localName, setLocalName] = useState('');
  const [category, setCategory] = useState<SiteCategory>('attraction');
  const [city, setCity] = useState(defaultCity);
  const [address, setAddress] = useState(defaultAddress);
  const [lat, setLat] = useState<number>(defaultLat);
  const [lng, setLng] = useState<number>(defaultLng);
  const [coverImage, setCoverImage] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [videos, setVideos] = useState<string[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Logistics
  const [recommendedDurationMin, setRecommendedDurationMin] = useState(90);
  const [openingHours, setOpeningHours] = useState('09:00 - 17:00');
  const [adultFee, setAdultFee] = useState(defaultAdultFee);
  const [seniorFee, setSeniorFee] = useState(defaultSeniorFee);
  const [childFee, setChildFee] = useState(defaultChildFee);
  const [feeNotes, setFeeNotes] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('早晨 09:00 避开旅行团与烈日');
  const [weatherSuitability, setWeatherSuitability] = useState<WeatherSuitability>('全天候适宜');

  // Multi-Gen Ratings
  const [strollerRating, setStrollerRating] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [strollerNotes, setStrollerNotes] = useState('路面平缓，配有无障碍缓坡或直梯，推车方便。');
  const [kidRating, setKidRating] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [kidNotes, setKidNotes] = useState('空间宽阔安全，有适合4岁幼儿的趣味展示或互动。');
  const [elderlyRating, setElderlyRating] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [elderlyNotes, setElderlyNotes] = useState('绿荫多，沿途配有休息长椅或茶歇区，步行强度适中。');
  const [walkingIntensity, setWalkingIntensity] = useState<WalkingIntensity>('轻松 (<500米)');
  const [stairsLevel, setStairsLevel] = useState<StairsLevel>('平坦 / 无台阶');

  // Amenities
  const [amenities, setAmenities] = useState({
    nursingRoom: true,
    diaperChanging: true,
    accessibleRestroom: true,
    benchesRestAreas: true,
    shuttleOrCart: false,
    elevatorAvailable: true,
    strollerRental: false,
    wheelchairRental: true,
    shadeAvailable: true,
    indoorRainyDayOption: false,
    kidPlayArea: false
  });

  // Tips & Dining
  const [familyTips, setFamilyTips] = useState<string[]>([]);
  const [newTip, setNewTip] = useState('');
  const [nearbyDining, setNearbyDining] = useState<Array<{ id: string; name: string; cuisine: string; familyFeatures: string; walkingTimeMin: number }>>([]);
  const [newDineName, setNewDineName] = useState('');
  const [newDineCuisine, setNewDineCuisine] = useState('');
  const [newDineFeatures, setNewDineFeatures] = useState('');
  const [newDineWalk, setNewDineWalk] = useState(3);

  // Custom Fields (雨天备选, 门票预约渠道, 停车信息等)
  const [customFieldsMap, setCustomFieldsMap] = useState<Record<string, string>>({});
  const [newCustomKey, setNewCustomKey] = useState('');
  const [newCustomVal, setNewCustomVal] = useState('');

  // Social Media Links
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>([]);
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialTitle, setNewSocialTitle] = useState('');
  const [newSocialAuthor, setNewSocialAuthor] = useState('');
  const [newSocialNote, setNewSocialNote] = useState('');
  const [newSocialScreenshot, setNewSocialScreenshot] = useState('');

  // Search places
  const [geocodingQuery, setGeocodingQuery] = useState('');
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);

  // AI Prompt & AI Reply Assistant States
  const [aiTab, setAiTab] = useState<'prompt' | 'reply' | 'curate'>('prompt');
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [llmReplyText, setLlmReplyText] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  // Custom prompt fields config
  const [promptCustomFields, setPromptCustomFields] = useState<CustomFieldDef[]>([]);
  const [showAddPromptField, setShowAddPromptField] = useState(false);
  const [newPromptFieldKey, setNewPromptFieldKey] = useState('');
  const [newPromptFieldLabel, setNewPromptFieldLabel] = useState('');

  // Social media research options
  const [enableSocialResearch, setEnableSocialResearch] = useState(true);
  const [socialPlatforms, setSocialPlatforms] = useState<('xiaohongshu' | 'bilibili')[]>(['xiaohongshu', 'bilibili']);

  const destination = trip?.destination || (city === '大连' ? '中国 · 大连' : '日本');
  const tripTitle = trip?.title || `${city || destination}慢游之旅`;
  const isDalian = (city && city.includes('大连')) || destination.includes('大连') || trip?.id === 'trip-dalian-coastal-multigen-2026' || (initialSite?.id && initialSite.id.startsWith('site-dalian-'));

  useEffect(() => {
    if (initialSite) {
      setName(initialSite.name);
      setLocalName(initialSite.localName || '');
      setCategory(initialSite.category);
      setCity(initialSite.city || '东京');
      setAddress(initialSite.address);
      setLat(initialSite.coordinates[0]);
      setLng(initialSite.coordinates[1]);
      setCoverImage(initialSite.coverImage);
      setGalleryUrls(initialSite.gallery || []);
      setVideos(initialSite.videos || []);
      setDescription(initialSite.description);
      setRecommendedDurationMin(initialSite.recommendedDurationMin);
      setOpeningHours(initialSite.openingHours);
      setAdultFee(initialSite.admissionFee.adult);
      setSeniorFee(initialSite.admissionFee.senior);
      setChildFee(initialSite.admissionFee.child4yo);
      setFeeNotes(initialSite.admissionFee.notes || '');
      setBestTimeToVisit(initialSite.bestTimeToVisit);
      setWeatherSuitability(initialSite.weatherSuitability);
      setStrollerRating(initialSite.strollerRating);
      setStrollerNotes(initialSite.strollerNotes);
      setKidRating(initialSite.kidRating);
      setKidNotes(initialSite.kidNotes);
      setElderlyRating(initialSite.elderlyRating);
      setElderlyNotes(initialSite.elderlyNotes);
      setWalkingIntensity(initialSite.walkingIntensity);
      setStairsLevel(initialSite.stairsLevel);
      setAmenities(initialSite.amenities);
      setFamilyTips(initialSite.familyTips || []);
      setNearbyDining(initialSite.nearbyDining || []);
      setCustomFieldsMap(initialSite.customFields || {});
      setSocialMediaLinks(initialSite.socialMediaLinks || []);
      setPromptCustomFields(getDefaultCustomFields(destination, Boolean(isDalian)));
      setAiStatus(null);
      setLlmReplyText('');
    } else {
      // Reset for new site
      setSocialMediaLinks([]);
      setName(initialName || '');
      setLocalName('');
      setCity(defaultCity);
      setAddress(initialAddress || defaultAddress);
      setLat(initialCoords ? initialCoords[0] : defaultLat);
      setLng(initialCoords ? initialCoords[1] : defaultLng);
      setCoverImage('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80');
      setGalleryUrls(['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80']);
      setVideos([]);
      setDescription('');
      setRecommendedDurationMin(90);
      setOpeningHours('09:00 - 17:00');
      setAdultFee(defaultAdultFee);
      setSeniorFee(defaultSeniorFee);
      setChildFee(defaultChildFee);
      setFeeNotes('');
      setBestTimeToVisit('早晨 09:00 前往');
      setWeatherSuitability('全天候适宜');
      setStrollerRating(4);
      setStrollerNotes('平坦通达，无障碍坡道顺畅。');
      setKidRating(4);
      setKidNotes('4岁幼儿适宜，无危险临空区域。');
      setElderlyRating(4);
      setElderlyNotes('步行平缓，配有绿荫和长椅。');
      setWalkingIntensity('轻松 (<500米)');
      setStairsLevel('平坦 / 无台阶');
      setAmenities({
        nursingRoom: true,
        diaperChanging: true,
        accessibleRestroom: true,
        benchesRestAreas: true,
        shuttleOrCart: false,
        elevatorAvailable: true,
        strollerRental: false,
        wheelchairRental: true,
        shadeAvailable: true,
        indoorRainyDayOption: false,
        kidPlayArea: false
      });
      setFamilyTips(['准备便携保温水杯与婴儿车防雨罩。']);
      setNearbyDining([]);
      setCustomFieldsMap({});
      setPromptCustomFields(getDefaultCustomFields(destination, Boolean(isDalian)));
      setAiStatus(null);
      setLlmReplyText('');
    }
  }, [initialSite, initialCoords, initialAddress, initialName, isOpen, destination]);

  if (!isOpen) return null;

  const handleSearchPlaces = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geocodingQuery.trim()) return;
    setIsSearchingGeocode(true);
    const results = await searchPlaces(geocodingQuery);
    setGeocodeResults(results);
    setIsSearchingGeocode(false);
  };

  const handleSelectGeocode = (res: GeocodeResult) => {
    setName(res.name);
    setAddress(res.displayName);
    setLat(res.lat);
    setLng(res.lng);
    if (res.address.city || res.address.town || res.address.state) {
      setCity(res.address.city || res.address.town || res.address.state || '东京');
    }
    setGeocodeResults([]);
    setGeocodingQuery('');
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setGalleryUrls([...galleryUrls, newGalleryUrl.trim()]);
    if (!coverImage) setCoverImage(newGalleryUrl.trim());
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryUrl = (idx: number) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== idx));
  };

  const handleAddTip = () => {
    if (!newTip.trim()) return;
    setFamilyTips([...familyTips, newTip.trim()]);
    setNewTip('');
  };

  const handleRemoveTip = (idx: number) => {
    setFamilyTips(familyTips.filter((_, i) => i !== idx));
  };

  const handleAddDining = () => {
    if (!newDineName.trim()) return;
    setNearbyDining([
      ...nearbyDining,
      {
        id: `dine-${Date.now()}`,
        name: newDineName.trim(),
        cuisine: newDineCuisine.trim() || '和食简餐',
        familyFeatures: newDineFeatures.trim() || '配有宝宝椅、儿童软面条、榻榻米',
        walkingTimeMin: Number(newDineWalk) || 3
      }
    ]);
    setNewDineName('');
    setNewDineCuisine('');
    setNewDineFeatures('');
    setNewDineWalk(3);
  };

  const handleRemoveDining = (id: string) => {
    setNearbyDining(nearbyDining.filter((d) => d.id !== id));
  };

  const handleAddSocialLink = () => {
    if (!newSocialUrl.trim()) return;
    const platform = detectSocialPlatform(newSocialUrl.trim());
    const meta = getPlatformMeta(platform);
    const link: SocialMediaLink = {
      id: `social-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url: newSocialUrl.trim(),
      platform,
      title: newSocialTitle.trim() || `${meta.label} 种草推荐`,
      author: newSocialAuthor.trim() || undefined,
      note: newSocialNote.trim() || undefined,
      screenshotUrl: newSocialScreenshot.trim() || undefined,
      addedAt: new Date().toISOString().slice(0, 10)
    };
    setSocialMediaLinks([...socialMediaLinks, link]);
    setNewSocialUrl('');
    setNewSocialTitle('');
    setNewSocialAuthor('');
    setNewSocialNote('');
    setNewSocialScreenshot('');
  };

  const handleRemoveSocialLink = (id: string) => {
    setSocialMediaLinks(socialMediaLinks.filter((s) => s.id !== id));
  };

  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) return;
    setVideos([...videos, newVideoUrl.trim()]);
    setNewVideoUrl('');
  };

  const handleRemoveVideo = (idx: number) => {
    setVideos(videos.filter((_, i) => i !== idx));
  };

  const handleAddCustomFieldEntry = () => {
    if (!newCustomKey.trim() || !newCustomVal.trim()) return;
    setCustomFieldsMap({
      ...customFieldsMap,
      [newCustomKey.trim()]: newCustomVal.trim()
    });
    setNewCustomKey('');
    setNewCustomVal('');
  };

  const handleRemoveCustomFieldEntry = (key: string) => {
    const updated = { ...customFieldsMap };
    delete updated[key];
    setCustomFieldsMap(updated);
  };

  const handleAddPromptCustomField = () => {
    if (!newPromptFieldLabel.trim()) return;
    const key = newPromptFieldKey.trim() || `custom_${Date.now()}`;
    setPromptCustomFields([...promptCustomFields, { key, label: newPromptFieldLabel.trim(), example: '详细调研说明' }]);
    setNewPromptFieldKey('');
    setNewPromptFieldLabel('');
    setShowAddPromptField(false);
  };

  const handleRemovePromptCustomField = (key: string) => {
    setPromptCustomFields(promptCustomFields.filter((f) => f.key !== key));
  };

  const handleResetPromptFields = () => {
    setPromptCustomFields(getDefaultCustomFields(destination, Boolean(isDalian)));
  };

  const generatedPrompt = generateSiteResearchPrompt({
    siteName: name || '待调研景点',
    localName,
    city: city || defaultCity,
    category,
    address,
    trip,
    customFields: promptCustomFields,
    siteId: initialSite?.id,
    existingCoverImage: coverImage,
    enableSocialResearch,
    socialPlatforms
  });

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleParseAndApplyReply = async () => {
    setAiStatus(null);
    if (!llmReplyText.trim()) {
      setAiStatus({ success: false, message: '请先粘贴 LLM 的回复内容或 JSON 代码块！' });
      return;
    }

    const currentDraft: Partial<Site> = {
      id: initialSite?.id,
      name,
      localName,
      description,
      coverImage,
      gallery: galleryUrls,
      videos,
      recommendedDurationMin,
      openingHours,
      admissionFee: {
        adult: adultFee,
        senior: seniorFee,
        child4yo: childFee,
        notes: feeNotes
      },
      bestTimeToVisit,
      weatherSuitability,
      strollerRating,
      strollerNotes,
      kidRating,
      kidNotes,
      elderlyRating,
      elderlyNotes,
      walkingIntensity,
      stairsLevel,
      amenities,
      familyTips,
      nearbyDining,
      customFields: customFieldsMap
    };

    const result = parseLLMReply(llmReplyText, currentDraft);
    if (!result.success || !result.data) {
      setAiStatus({ success: false, message: result.message });
      return;
    }

    const d = result.data;
    const isTargetDalian = isTripDalian || d.city?.includes('大连') || d.name?.includes('大连') || d.description?.includes('大连') || (d.localName && d.localName.includes('大连'));
    const resolvedCity = d.city || (isTargetDalian ? '大连' : defaultCity);
    const resolvedAddress = d.address || (isTargetDalian ? (address && !address.includes('东京') && !address.includes('日本') ? address : '中国 辽宁省 大连市') : defaultAddress);

    if (d.name) setName(d.name);
    if (d.localName !== undefined) setLocalName(d.localName);
    if (d.description) setDescription(d.description);
    if (d.coverImage) setCoverImage(d.coverImage);
    if (d.gallery && d.gallery.length > 0) setGalleryUrls(d.gallery);
    if (d.videos && d.videos.length > 0) setVideos(d.videos);
    setCity(resolvedCity);
    setAddress(resolvedAddress);
    if (d.coordinates) {
      setLat(d.coordinates[0]);
      setLng(d.coordinates[1]);
    } else if (isTargetDalian && (lat === 35.6764 || !lat)) {
      setLat(38.8788);
      setLng(121.6038);
    }
    if (d.recommendedDurationMin) setRecommendedDurationMin(d.recommendedDurationMin);
    if (d.openingHours) setOpeningHours(d.openingHours);
    if (d.admissionFee) {
      if (d.admissionFee.adult) setAdultFee(d.admissionFee.adult);
      if (d.admissionFee.senior) setSeniorFee(d.admissionFee.senior);
      if (d.admissionFee.child4yo) setChildFee(d.admissionFee.child4yo);
      if (d.admissionFee.notes !== undefined) setFeeNotes(d.admissionFee.notes);
    }
    if (d.bestTimeToVisit) setBestTimeToVisit(d.bestTimeToVisit);
    if (d.weatherSuitability) setWeatherSuitability(d.weatherSuitability);
    if (d.strollerRating) setStrollerRating(d.strollerRating);
    if (d.strollerNotes) setStrollerNotes(d.strollerNotes);
    if (d.kidRating) setKidRating(d.kidRating);
    if (d.kidNotes) setKidNotes(d.kidNotes);
    if (d.elderlyRating) setElderlyRating(d.elderlyRating);
    if (d.elderlyNotes) setElderlyNotes(d.elderlyNotes);
    if (d.walkingIntensity) setWalkingIntensity(d.walkingIntensity);
    if (d.stairsLevel) setStairsLevel(d.stairsLevel);
    if (d.amenities) setAmenities(prev => ({ ...prev, ...d.amenities }));
    if (d.familyTips && d.familyTips.length > 0) setFamilyTips(d.familyTips);
    if (d.nearbyDining && d.nearbyDining.length > 0) setNearbyDining(d.nearbyDining);
    if (d.customFields) setCustomFieldsMap(prev => ({ ...prev, ...d.customFields }));
    if (d.socialMediaLinks && d.socialMediaLinks.length > 0) {
      setSocialMediaLinks((prev) => {
        const existingUrls = new Set(prev.map((s) => s.url));
        const toAdd = d.socialMediaLinks!.filter((s) => !existingUrls.has(s.url));
        return [...prev, ...toAdd];
      });
    }

    setAiStatus({
      success: true,
      message: `${result.message} 所有信息已自动回填至表单各字段，城市已设为「${resolvedCity}」！`
    });

    const targetQuery = d.name || name;
    if (targetQuery && (!d.coordinates || (lat === 35.6764 && lng === 139.6993))) {
      try {
        const queryWithCity = resolvedCity === '大连' && !targetQuery.includes('大连') ? `大连 ${targetQuery}` : targetQuery;
        const places = await searchPlaces(queryWithCity);
        if (places && places.length > 0) {
          const first = places[0];
          setLat(first.lat);
          setLng(first.lng);
          if (first.displayName) setAddress(first.displayName);
          if (first.address.city || first.address.town || first.address.state) {
            setCity(first.address.city || first.address.town || first.address.state || resolvedCity);
          }
        }
      } catch (err) {
        // silent
      }
    }
  };

  const handleAutoCurate = () => {
    const targetSiteDraft: Partial<Site> & { name: string } = {
      id: initialSite?.id,
      name: name || '',
      localName,
      coverImage,
      gallery: galleryUrls,
      videos
    };
    const curated = getSmartCuratedMediaForSite(targetSiteDraft);
    if (curated.gallery && curated.gallery.length > 0) {
      setGalleryUrls(curated.gallery);
      if (curated.coverImage) setCoverImage(curated.coverImage);
      if (curated.videos && curated.videos.length > 0) setVideos(curated.videos);
      setAiStatus({
        success: true,
        message: `已自动为「${name || '该景点'}」匹配权威实景图库：填入 ${curated.gallery.length} 张高清实拍相册与 ${curated.videos.length} 部 4K 导览视频！`
      });
    } else {
      setAiStatus({
        success: false,
        message: `未在内置实景图库中精确匹配到「${name || '该景点'}」，建议使用「1. 调研提示词」让 AI 生成实拍图片直链！`
      });
    }
  };

  const handleAutoGeocodeByName = async () => {
    const targetQuery = name.trim();
    if (!targetQuery) return;
    setIsSearchingGeocode(true);
    try {
      const places = await searchPlaces(targetQuery);
      if (places && places.length > 0) {
        handleSelectGeocode(places[0]);
        setAiStatus({
          success: true,
          message: `已成功联网检索并定位「${targetQuery}」：坐标 (${places[0].lat.toFixed(4)}, ${places[0].lng.toFixed(4)})，详细地址已自动回填！`
        });
      } else {
        setAiStatus({
          success: false,
          message: `未找到「${targetQuery}」的精确在线坐标，请在上方的搜索框手动输入搜索。`
        });
      }
    } catch (err: any) {
      setAiStatus({ success: false, message: `检索失败: ${err.message}` });
    } finally {
      setIsSearchingGeocode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const isTargetDalian = isTripDalian || city?.includes('大连') || name?.includes('大连') || description?.includes('大连');
    const finalTripId = initialSite?.tripId || trip?.id || (isTargetDalian ? 'trip-dalian-coastal-multigen-2026' : 'trip-japan-grand-multigen-2026');
    const finalCity = city.trim() || (isTargetDalian ? '大连' : defaultCity);
    const finalSite: Site = {
      id: initialSite ? initialSite.id : `site-${isTargetDalian ? 'dalian-' : ''}${Date.now()}`,
      name: name.trim(),
      localName: localName.trim() || undefined,
      category,
      tripId: finalTripId,
      coordinates: [Number(lat), Number(lng)],
      address: address.trim() || (isTargetDalian ? '中国 辽宁省 大连市' : defaultAddress),
      city: finalCity,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      gallery: galleryUrls.length > 0 ? galleryUrls : [coverImage],
      videos: videos.length > 0 ? videos : undefined,
      description: description.trim() || `${name} (${city})`,
      recommendedDurationMin: Number(recommendedDurationMin),
      openingHours: openingHours.trim(),
      admissionFee: {
        adult: adultFee.trim() || '免费',
        senior: seniorFee.trim() || '免费',
        child4yo: childFee.trim() || '免费',
        notes: feeNotes.trim() || undefined
      },
      bestTimeToVisit: bestTimeToVisit.trim(),
      weatherSuitability,
      strollerRating,
      strollerNotes: strollerNotes.trim(),
      kidRating,
      kidNotes: kidNotes.trim(),
      elderlyRating,
      elderlyNotes: elderlyNotes.trim(),
      walkingIntensity,
      stairsLevel,
      amenities,
      familyTips,
      nearbyDining,
      socialMediaLinks,
      customTags: initialSite?.customTags || ['亲子精选'],
      customFields: Object.keys(customFieldsMap).length > 0 ? customFieldsMap : undefined,
      createdAt: initialSite?.createdAt || new Date().toISOString().slice(0, 10)
    };

    try {
      await onSave(finalSite);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl text-base">
              {initialSite ? '✏️' : '✨'}
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {initialSite ? '编辑景点信息' : '新增三代同堂旅行景点'}
              </h2>
              <p className="text-xs text-slate-500">配置幼童与长辈适宜度、实拍图库、无障碍配套与避坑贴士</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Auto-Search Location */}
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2">
            <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              全球地名/地址在线智能搜索 (自动回填坐标与地址)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="例如: 明治神宫, 台场高达, 上野公园, 东京迪士尼..."
                value={geocodingQuery}
                onChange={(e) => setGeocodingQuery(e.target.value)}
                className="flex-1 px-3 py-2 bg-white rounded-xl text-xs border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleSearchPlaces}
                disabled={isSearchingGeocode}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
              >
                {isSearchingGeocode ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : '搜索'}
              </button>
            </div>

            {/* Dropdown Results */}
            {geocodeResults.length > 0 && (
              <div className="mt-2 bg-white rounded-xl border border-indigo-100 divide-y divide-slate-100 max-h-48 overflow-y-auto shadow-md">
                {geocodeResults.map((res) => (
                  <button
                    key={res.placeId}
                    type="button"
                    onClick={() => handleSelectGeocode(res)}
                    className="w-full text-left p-2.5 hover:bg-indigo-50 text-xs flex items-center justify-between"
                  >
                    <div className="pr-2">
                      <p className="font-semibold text-slate-800">{res.name}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{res.displayName}</p>
                    </div>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg flex-shrink-0">
                      填入
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Research & Auto-Fill Assistant Panel */}
          <div className="rounded-2xl border border-purple-200/90 bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/60 p-4 shadow-sm space-y-3.5">
            {/* Panel Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-purple-200/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-xl shadow-xs flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>AI 智能调研与填单助手</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                        AI Prompt &amp; Reply
                      </span>
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    根据当前行程【{tripTitle}】专属定制三代同堂慢游提示词，或粘贴 AI 回复一键自动填满全表单
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <div className="flex items-center bg-white/90 p-0.5 rounded-xl border border-purple-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => { setAiTab('prompt'); setIsAiPanelOpen(true); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      aiTab === 'prompt' && isAiPanelOpen
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>1. 调研提示词 (Prompt)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAiTab('reply'); setIsAiPanelOpen(true); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      aiTab === 'reply' && isAiPanelOpen
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>2. 粘贴回复填单 (Reply)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAiTab('curate'); setIsAiPanelOpen(true); }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      aiTab === 'curate' && isAiPanelOpen
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="图库补齐"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">3. 智能图库</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 bg-white/70 hover:bg-white rounded-lg border border-purple-200 transition-colors"
                  title={isAiPanelOpen ? '收起 AI 助手' : '展开 AI 助手'}
                >
                  {isAiPanelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Panel Body */}
            {isAiPanelOpen && (
              <div className="space-y-3.5 pt-1">
                
                {/* TAB 1: AI PROMPT */}
                {aiTab === 'prompt' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    {/* Status context pill */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white/80 rounded-xl border border-purple-100 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-700">待调研景点:</span>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg font-bold border border-indigo-200">
                          {name.trim() || '（尚未输入景点名称）'}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">归属目的地:</span>
                        <span className="font-bold text-slate-700">{destination}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                          <span>👶 4岁幼童</span>
                          <span>+</span>
                          <span>🧓 65岁长辈</span>
                        </span>
                        <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200 font-semibold">
                          8-10实景图 + 4K视频
                        </span>
                      </div>
                    </div>

                    {/* Quick input if name is empty */}
                    {!name.trim() && (
                      <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                          <span>💡 快速生成：</span>
                        </div>
                        <input
                          type="text"
                          placeholder="在此处输入待调研景点名称，例如: 明治神宫 / 大连圣亚海洋世界 / 品海楼..."
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-amber-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                        <span className="text-[11px] text-amber-700 hidden sm:inline">输入后将自动定制专属 Prompt</span>
                      </div>
                    )}

                    {/* Social Media Research Configurator */}
                    <div className="p-3 bg-white/70 rounded-xl border border-purple-100 space-y-2">
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
                        <span className="text-[11px] text-slate-400 hidden sm:inline">要求 AI 调研并输出真实博主笔记</span>
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

                    {/* Custom fields configurator toggle */}
                    <div className="p-3 bg-white/70 rounded-xl border border-purple-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                          <span>自定义扩展调研字段 ({promptCustomFields.length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleResetPromptFields}
                            className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            重置默认
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddPromptField(!showAddPromptField)}
                            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{showAddPromptField ? '收起' : '增加字段'}</span>
                          </button>
                        </div>
                      </div>

                      {showAddPromptField && (
                        <div className="p-2.5 bg-white rounded-xl border border-indigo-200 shadow-2xs space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="显示名称 (如: 📸 最佳拍照机位)"
                              value={newPromptFieldLabel}
                              onChange={(e) => setNewPromptFieldLabel(e.target.value)}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="JSON 键名 (如: photoSpots)"
                              value={newPromptFieldKey}
                              onChange={(e) => setNewPromptFieldKey(e.target.value)}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={handleAddPromptCustomField}
                              className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
                            >
                              加入 Prompt
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {promptCustomFields.map((f) => (
                          <span
                            key={f.key}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700"
                          >
                            <span className="font-semibold">{f.label}</span>
                            <button
                              type="button"
                              onClick={() => handleRemovePromptCustomField(f.key)}
                              className="text-slate-300 hover:text-rose-600 ml-0.5 transition-colors"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action button & preview */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span>提示词已融合：推车平缓度、4岁互动点、长辈休息设施、8-10张实景图与 JSON 代码块</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPromptPreview(!showPromptPreview)}
                          className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white rounded-xl border border-purple-200 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{showPromptPreview ? '隐藏预览' : '查看完整 Prompt'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyPrompt}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                            copiedPrompt
                              ? 'bg-emerald-600 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          {copiedPrompt ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>已成功复制到剪贴板！</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>复制完整调研提示词</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Optional Prompt Preview */}
                    {showPromptPreview && (
                      <div className="relative pt-1 animate-in fade-in duration-150">
                        <textarea
                          readOnly
                          rows={8}
                          value={generatedPrompt}
                          className="w-full p-3 rounded-xl border border-purple-200 bg-white/90 font-mono text-[11px] leading-relaxed text-slate-800 shadow-inner focus:outline-none"
                        />
                      </div>
                    )}

                    <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[11px] text-indigo-900">
                      💡 <strong>使用流程</strong>：1. 点击「复制完整调研提示词」→ 2. 发送至 ChatGPT / Claude / DeepSeek / Kimi / 豆包 → 3. 复制 AI 的回复，点击上方「2. 粘贴回复填单」一键完成自动填表！
                    </div>
                  </div>
                )}

                {/* TAB 2: AI REPLY */}
                {aiTab === 'reply' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-indigo-600" />
                        <span>粘贴 AI 回复内容或 JSON 代码块：</span>
                      </label>
                      {llmReplyText && (
                        <button
                          type="button"
                          onClick={() => setLlmReplyText('')}
                          className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          清空内容
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={6}
                      placeholder="在此处直接粘贴 ChatGPT / Claude / DeepSeek / Kimi / Gemini 等返回的完整回复或包含 ```json ... ``` 的代码块..."
                      value={llmReplyText}
                      onChange={(e) => setLlmReplyText(e.target.value)}
                      className="w-full p-3 rounded-xl border border-purple-200 bg-white text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                    />

                    {/* Status Alert Banner */}
                    {aiStatus && (
                      <div
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2 animate-in fade-in duration-200 ${
                          aiStatus.success
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}
                      >
                        {aiStatus.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold">{aiStatus.message}</p>
                          {aiStatus.success && name.trim() && (lat === 35.6764 && lng === 139.6993 && !city.includes('东京')) && (
                            <button
                              type="button"
                              onClick={handleAutoGeocodeByName}
                              disabled={isSearchingGeocode}
                              className="mt-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              <span>联网自动检索并回填「{name}」精确地理坐标与地址</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        系统将自动提取相册、视频、三代同堂评分、避坑贴士、周边美食与无障碍配置
                      </span>

                      <button
                        type="button"
                        onClick={handleParseAndApplyReply}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>✨ 一键解析并回填全表单</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: SMART MEDIA CURATOR */}
                {aiTab === 'curate' && (
                  <div className="p-3.5 bg-white/80 rounded-xl border border-purple-100 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Wand2 className="w-4 h-4 text-purple-600" />
                          <span>一键匹配权威实拍图库与 4K 导览视频</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          系统内置经权威审核的高清实景相册（8-10张）与沉浸式导览视频，避免 AI 生成失效图片链接
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAutoCurate}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>一键匹配并应用实景图库</span>
                      </button>
                    </div>

                    {aiStatus && (
                      <div
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                          aiStatus.success
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        {aiStatus.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        )}
                        <span>{aiStatus.message}</span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Section: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">基础信息</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">景点名称 *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如: 明治神宫 / 台场海滨公园"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">当地/外文名称 (可选)</label>
                <input
                  type="text"
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  placeholder="例如: 明治神宮 (Meiji Jingu)"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">类别分类</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SiteCategory)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="attraction">地标 / 亲子主题乐园</option>
                  <option value="temple">神社 / 寺庙 / 历史文化</option>
                  <option value="park">公园 / 动物园 / 植物园</option>
                  <option value="museum">博物馆 / 科学展馆</option>
                  <option value="nature">自然山水 / 滨海风光</option>
                  <option value="restaurant">亲子和食 / 特色餐厅</option>
                  <option value="shopping">综合商场 / 免税街区</option>
                  <option value="relax">温泉茶歇 / 悠闲漫步</option>
                  <option value="hotel">酒店住宿</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">城市 / 区域</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="例如: 东京 (涩谷区)"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">详细地址</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="街道地址..."
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">纬度 (Latitude)</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">经度 (Longitude)</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">景点亮点与介绍</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="景点的特色亮点，适合全家游玩的景观..."
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section: Photos & Gallery */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">实拍照片与相册</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">封面大图 URL</label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Gallery Images List */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">图库照片 ({galleryUrls.length} 张)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="粘贴更多图片直链 URL..."
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加
                </button>
              </div>

              {/* Gallery Thumbnails */}
              {galleryUrls.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {galleryUrls.map((url, idx) => (
                    <div key={idx} className="relative group w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-slate-300">
                      <img src={url} alt="thumb" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryUrl(idx)}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4K Videos Section */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-rose-600" />
                <span>4K 视频导览与短片直链 ({videos.length} 部)</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  placeholder="输入 YouTube / Bilibili / MP4 视频直链..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs border border-slate-200 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddVideo}
                  className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加视频
                </button>
              </div>

              {videos.length > 0 && (
                <div className="space-y-1.5">
                  {videos.map((vid, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono">
                      <span className="truncate text-slate-700 pr-2">🎬 {vid}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 flex-shrink-0 font-sans"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section: Multi-Gen & Family Friendliness (Crucial for 4yo + Elderly) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-base">👶</span>
              <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                三代同堂适宜度评级 (4岁幼儿与长辈体验)
              </h3>
            </div>

            {/* 1. Stroller Friendliness */}
            <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>🚼 婴儿推车与无障碍平缓度</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStrollerRating(star as any)}
                      className={`text-base transition-transform hover:scale-125 ${
                        star <= strollerRating ? 'text-amber-500' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-indigo-700 ml-1">{strollerRating}/5分</span>
                </div>
              </div>
              <input
                type="text"
                value={strollerNotes}
                onChange={(e) => setStrollerNotes(e.target.value)}
                placeholder="关于坡道、升降梯、路面推车平整度的说明..."
                className="w-full px-3 py-2 rounded-xl text-xs border border-indigo-100 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 2. 4yo Kid Fun */}
            <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>🧒 4岁幼童趣味度与安全性</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setKidRating(star as any)}
                      className={`text-base transition-transform hover:scale-125 ${
                        star <= kidRating ? 'text-amber-500' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-700 ml-1">{kidRating}/5分</span>
                </div>
              </div>
              <input
                type="text"
                value={kidNotes}
                onChange={(e) => setKidNotes(e.target.value)}
                placeholder="4岁孩子喜欢的互动点，以及安全围栏、防走失保障..."
                className="w-full px-3 py-2 rounded-xl text-xs border border-amber-100 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* 3. Elderly Grandparent Comfort */}
            <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>🧓 长辈/爷爷奶奶舒适度与休息环境</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setElderlyRating(star as any)}
                      className={`text-base transition-transform hover:scale-125 ${
                        star <= elderlyRating ? 'text-amber-500' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-emerald-700 ml-1">{elderlyRating}/5分</span>
                </div>
              </div>
              <input
                type="text"
                value={elderlyNotes}
                onChange={(e) => setElderlyNotes(e.target.value)}
                placeholder="座椅密度、遮阳绿荫、步行强度、茶室等歇脚点..."
                className="w-full px-3 py-2 rounded-xl text-xs border border-emerald-100 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Intensity & Stairs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">步行距离与体力负荷</label>
                <select
                  value={walkingIntensity}
                  onChange={(e) => setWalkingIntensity(e.target.value as WalkingIntensity)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="轻松 (<500米)">轻松 (&lt;500米 - 极低体力消耗)</option>
                  <option value="适中 (500米-1.5公里)">适中 (500米-1.5公里)</option>
                  <option value="较累 (>1.5公里或坡道)">较累 (&gt;1.5公里或坡道较多)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">地形与台阶情况</label>
                <select
                  value={stairsLevel}
                  onChange={(e) => setStairsLevel(e.target.value as StairsLevel)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="平坦 / 无台阶">平坦 / 无台阶</option>
                  <option value="少量台阶 (配有无障碍坡道)">少量台阶 (配有无障碍坡道)</option>
                  <option value="中等台阶">中等台阶</option>
                  <option value="陡峭 / 台阶较多">陡峭 / 台阶较多</option>
                </select>
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">家庭及无障碍配套设施</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { key: 'nursingRoom', label: '🍼 母婴室' },
                  { key: 'diaperChanging', label: '🚼 尿布台' },
                  { key: 'accessibleRestroom', label: '♿ 无障碍洗手间' },
                  { key: 'benchesRestAreas', label: '🪑 密集休息长椅' },
                  { key: 'elevatorAvailable', label: '🛗 升降电梯' },
                  { key: 'strollerRental', label: '🛒 婴儿车出借' },
                  { key: 'wheelchairRental', label: '🧑‍🦽 轮椅出借' },
                  { key: 'shuttleOrCart', label: '🚐 园区接驳车' },
                  { key: 'shadeAvailable', label: '⛱️ 遮阳防晒棚' },
                  { key: 'indoorRainyDayOption', label: '☔ 室内雨天保障' },
                  { key: 'kidPlayArea', label: '🛝 儿童游乐区' },
                ].map((amenity) => (
                  <label
                    key={amenity.key}
                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(amenities as any)[amenity.key]}
                      onChange={(e) =>
                        setAmenities({ ...amenities, [amenity.key]: e.target.checked })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-700">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Logistics & Admission */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">营业开放与门票收费</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">开放营业时间</label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  placeholder="例如: 09:00 - 17:00 (最终入园 16:30)"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">建议游玩时长 (分钟)</label>
                <input
                  type="number"
                  value={recommendedDurationMin}
                  onChange={(e) => setRecommendedDurationMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">成人票价</label>
                <input
                  type="text"
                  value={adultFee}
                  onChange={(e) => setAdultFee(e.target.value)}
                  placeholder="¥600"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">长者(65+)优惠</label>
                <input
                  type="text"
                  value={seniorFee}
                  onChange={(e) => setSeniorFee(e.target.value)}
                  placeholder="半价 / 免费"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-700 mb-1">4岁幼童门票</label>
                <input
                  type="text"
                  value={childFee}
                  onChange={(e) => setChildFee(e.target.value)}
                  placeholder="免费"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-emerald-200 bg-emerald-50/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">最佳游览时段</label>
                <input
                  type="text"
                  value={bestTimeToVisit}
                  onChange={(e) => setBestTimeToVisit(e.target.value)}
                  placeholder="例如: 早晨 09:00 前往避暑"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">天气适宜性</label>
                <select
                  value={weatherSuitability}
                  onChange={(e) => setWeatherSuitability(e.target.value as WeatherSuitability)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="全天候适宜">全天候适宜</option>
                  <option value="室内 (雨天/避暑优选)">室内 (雨天/避暑优选)</option>
                  <option value="晴天适宜">晴天适宜</option>
                  <option value="纯户外">纯户外</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Family Tips */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">避坑小贴士与交通建议</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="例如: 从原宿站JR东口出站即到平缓参道入口..."
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTip}
                className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                添加小贴士
              </button>
            </div>

            {familyTips.length > 0 && (
              <div className="space-y-1.5">
                {familyTips.map((tip, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-700">💡 {tip}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTip(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Nearby Dining */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              周边亲子与长辈友好餐厅 ({nearbyDining.length})
            </h3>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="餐厅名称..."
                  value={newDineName}
                  onChange={(e) => setNewDineName(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="text"
                  placeholder="菜系 (例如: 和食乌冬, 蛋包饭)..."
                  value={newDineCuisine}
                  onChange={(e) => setNewDineCuisine(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="number"
                  placeholder="步行分钟..."
                  value={newDineWalk}
                  onChange={(e) => setNewDineWalk(Number(e.target.value))}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="亲子长辈配置 (例如: 宝宝高脚椅、清淡无刺鱼、榻榻米包间)..."
                  value={newDineFeatures}
                  onChange={(e) => setNewDineFeatures(e.target.value)}
                  className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddDining}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加餐厅
                </button>
              </div>
            </div>

            {nearbyDining.length > 0 && (
              <div className="space-y-1.5">
                {nearbyDining.map((dine) => (
                  <div key={dine.id} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{dine.name}</span> ({dine.cuisine} • 步行{dine.walkingTimeMin}分钟)
                      <p className="text-[11px] text-slate-500">{dine.familyFeatures}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDining(dine.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Custom Research Fields */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                <span>自定义扩展调研字段 ({Object.keys(customFieldsMap).length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">如雨天备选、门票预约渠道、停车与上下客动线等</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="字段名称 (如: 雨天备选方案)..."
                  value={newCustomKey}
                  onChange={(e) => setNewCustomKey(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="text"
                  placeholder="调研内容与建议..."
                  value={newCustomVal}
                  onChange={(e) => setNewCustomVal(e.target.value)}
                  className="sm:col-span-2 text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddCustomFieldEntry}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加扩展字段
                </button>
              </div>
            </div>

            {Object.keys(customFieldsMap).length > 0 && (
              <div className="space-y-1.5">
                {Object.entries(customFieldsMap).map(([k, v]) => (
                  <div key={k} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start justify-between text-xs gap-2">
                    <div>
                      <span className="font-bold text-slate-800">{k}：</span>
                      <span className="text-slate-600 leading-relaxed">{v}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomFieldEntry(k)}
                      className="text-slate-400 hover:text-rose-600 p-1 flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Social Media Links (小红书/抖音/B站/大众点评) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>📱 社交媒体种草与实操链接 ({socialMediaLinks.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">支持小红书、抖音、大众点评、B站等，在详情页可画中画预览</span>
            </div>

            <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-200/80 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="url"
                  placeholder="粘贴网址 (如: http://xhslink.com/... 或 https://v.douyin.com/...)"
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-mono"
                />
                <input
                  type="text"
                  placeholder="笔记主题/标题 (如: 庄河蛤蜊岛退潮避坑实况)"
                  value={newSocialTitle}
                  onChange={(e) => setNewSocialTitle(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="博主/作者 (选填，如 @大连遛娃指南)"
                  value={newSocialAuthor}
                  onChange={(e) => setNewSocialAuthor(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="text"
                  placeholder="摘录笔记 (选填，如 建议下午低潮前1小时去沙滩)"
                  value={newSocialNote}
                  onChange={(e) => setNewSocialNote(e.target.value)}
                  className="sm:col-span-2 text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="截图 / 封面图片 URL (选填，在详情页将优先以高清大图呈现)"
                  value={newSocialScreenshot}
                  onChange={(e) => setNewSocialScreenshot(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-mono"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddSocialLink}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加社交媒体链接
                </button>
              </div>
            </div>

            {socialMediaLinks.length > 0 && (
              <div className="space-y-1.5">
                {socialMediaLinks.map((link) => {
                  const meta = getPlatformMeta(link.platform);
                  return (
                    <div key={link.id} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${meta.badgeClass}`}>
                            {meta.icon} {meta.label}
                          </span>
                          <span className="font-bold text-slate-800 truncate">{link.title}</span>
                          {link.author && <span className="text-slate-500 text-[11px]">({link.author})</span>}
                        </div>
                        {link.note && <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">笔记: {link.note}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSocialLink(link.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Footer in Modal */}
          <div className="sticky bottom-0 z-20 -mx-6 -mb-6 p-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>正在保存...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{initialSite ? '保存修改' : '确认创建景点'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
