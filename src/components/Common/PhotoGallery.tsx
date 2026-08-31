import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Maximize2, X, 
  Image as ImageIcon, Video, Play, ExternalLink, RefreshCw, AlertCircle, Sparkles
} from 'lucide-react';

interface PhotoGalleryProps {
  images: string[];
  videos?: string[];
  title: string;
}

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

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images, videos = [], title }) => {
  const [activeMediaType, setActiveMediaType] = useState<'photo' | 'video'>('photo');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize and clean image URLs
  useEffect(() => {
    if (images && images.length > 0) {
      const cleaned = images
        .map(cleanUrl)
        .filter((url) => url.startsWith('http') && !url.includes('undefined'));
      
      // Deduplicate
      const unique = Array.from(new Set(cleaned));
      setImageUrls(unique);
    } else {
      setImageUrls([]);
    }
    setCurrentImageIndex(0);
  }, [images]);

  // Safe videos list
  const cleanedVideos = videos
    .map(cleanUrl)
    .filter((v) => v.startsWith('http') && !v.includes('undefined'));
  const validVideos = Array.from(new Set(cleanedVideos));

  // If an image fails to load, remove it from the active list gracefully
  const handleImageError = (failedIndex: number) => {
    setImageUrls((prev) => {
      const filtered = prev.filter((_, idx) => idx !== failedIndex);
      return filtered;
    });
    setCurrentImageIndex((prev) => (prev >= failedIndex && prev > 0 ? prev - 1 : 0));
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (imageUrls.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (imageUrls.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  // Helper to parse video type & URL
  const activeVideoRawUrl = validVideos[currentVideoIndex] || validVideos[0] || '';

  const getVideoType = (url: string): 'youtube' | 'bilibili' | 'mp4' | 'other' => {
    if (!url) return 'mp4';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('bilibili.com')) return 'bilibili';
    if (url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('.mp4?')) return 'mp4';
    return 'other';
  };

  const videoType = getVideoType(activeVideoRawUrl);

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

  const embedUrl = getEmbedUrl(activeVideoRawUrl);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950 shadow-xl border border-slate-800">
      
      {/* Top Media Type Switcher */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 p-1 bg-black/75 backdrop-blur-md rounded-2xl border border-white/15 text-xs shadow-lg">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveMediaType('photo');
          }}
          className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
            activeMediaType === 'photo'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>📸 实景相册 ({imageUrls.length}张)</span>
        </button>

        {validVideos.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMediaType('video');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeMediaType === 'video'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span className="relative flex items-center gap-1">
              <span>🎬 沉浸视频 ({validVideos.length}部)</span>
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            </span>
          </button>
        )}
      </div>

      {/* ==================== 1. PHOTO DISPLAY MODE ==================== */}
      {activeMediaType === 'photo' && (
        <>
          <div 
            className="relative h-64 sm:h-80 md:h-96 w-full cursor-pointer group overflow-hidden bg-slate-900 flex items-center justify-center"
            onClick={() => {
              if (imageUrls.length > 0) setIsFullscreen(true);
            }}
          >
            {imageUrls.length > 0 ? (
              <>
                <img
                  src={imageUrls[currentImageIndex]}
                  alt={`${title} - 图片 ${currentImageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={() => handleImageError(currentImageIndex)}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                {/* Counter Badge */}
                <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm border border-white/10">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{currentImageIndex + 1} / {imageUrls.length}</span>
                </div>

                {/* Enlarge Hint */}
                <button
                  type="button"
                  aria-label="查看全屏高清大图"
                  className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white rounded-xl transition-opacity opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(true);
                  }}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Prev / Next Arrows */}
                {imageUrls.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="上一张图片"
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-black/80 text-white rounded-2xl backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-md"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="下一张图片"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-black/80 text-white rounded-2xl backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-md"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              /* Tasteful Empty State */
              <div className="p-8 text-center space-y-2 text-slate-400">
                <div className="text-4xl">⛩️</div>
                <div className="text-sm font-bold text-white">{title}</div>
                <p className="text-xs text-slate-400">官方实景图库加载中或可通过上方「AI智能调研」一键补充图片</p>
              </div>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {imageUrls.length > 1 && (
            <div className="flex items-center gap-2 p-3 bg-slate-950/90 overflow-x-auto border-t border-slate-800/80">
              {imageUrls.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all bg-slate-800 ${
                    idx === currentImageIndex ? 'border-indigo-500 scale-105 shadow-md ring-2 ring-indigo-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`缩略图 ${idx + 1}`} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                    onError={() => handleImageError(idx)}
                  />
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* ==================== 2. VIDEO DISPLAY MODE ==================== */}
      {activeMediaType === 'video' && validVideos.length > 0 && (
        <div className="relative h-72 sm:h-84 md:h-96 w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
          
          {/* HTML5 Direct Video Player */}
          {videoType === 'mp4' ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src={activeVideoRawUrl}
                controls
                playsInline
                autoPlay
                className="w-full h-full object-contain"
                poster={imageUrls[0]}
              >
                您的浏览器暂不支持直接播放该格式视频。
              </video>
            </div>
          ) : (
            /* Embedded Player */
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <iframe
                src={embedUrl}
                title={`${title} 沉浸导览视频`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />

              {/* External Play Link */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                <a
                  href={activeVideoRawUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-lg border border-rose-400/40 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>在新窗口全屏超清播放</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                </a>
              </div>
            </div>
          )}

          {/* Bottom Video Switcher Bar */}
          {validVideos.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 bg-black/85 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl max-w-[90%] overflow-x-auto">
              {validVideos.map((vid, idx) => {
                const type = getVideoType(vid);
                const label = type === 'mp4' ? `⚡ 直链短片 ${idx + 1}` : type === 'bilibili' ? `🎬 B站视频 ${idx + 1}` : `📺 4K漫步 ${idx + 1}`;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentVideoIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      idx === currentVideoIndex
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ==================== 3. FULLSCREEN LIGHTBOX ==================== */}
      {isFullscreen && imageUrls.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button"
            aria-label="关闭全屏"
            className="absolute top-4 right-4 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={imageUrls[currentImageIndex]}
            alt={title}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onError={() => handleImageError(currentImageIndex)}
          />

          {imageUrls.length > 1 && (
            <>
              <button
                type="button"
                aria-label="上一张"
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3.5 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                type="button"
                aria-label="下一张"
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3.5 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all"
                onClick={handleNextImage}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-semibold">
            {currentImageIndex + 1} / {imageUrls.length} — {title}
          </div>
        </div>
      )}

    </div>
  );
};
