import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Site, DayItinerary } from '../../types/travel';
import { Search, Plus, MapPin, Navigation, Compass, Loader2 } from 'lucide-react';
import { searchPlaces, GeocodeResult, reverseGeocode } from '../../services/geocoding';

interface TravelMapProps {
  sites: Site[];
  selectedSiteId: string | null;
  activeDay: DayItinerary | null;
  onSelectSite: (site: Site) => void;
  onAddNewSiteAtCoords: (coords: [number, number], address?: string, name?: string) => void;
  onAddSiteToDay?: (siteId: string) => void;
}

export const TravelMap: React.FC<TravelMapProps> = ({
  sites,
  selectedSiteId,
  activeDay,
  onSelectSite,
  onAddNewSiteAtCoords,
  onAddSiteToDay
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const tempMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapStyle, setMapStyle] = useState<'voyager' | 'osm' | 'topo'>('voyager');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [clickCoords, setClickCoords] = useState<[number, number] | null>(null);
  const [clickAddress, setClickAddress] = useState<string>('');

  // Map Tile URLs
  const tileUrls = {
    voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center around Tokyo
    const initialLat = sites[0]?.coordinates[0] || 35.6764;
    const initialLng = sites[0]?.coordinates[1] || 139.6993;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const tileLayer = L.tileLayer(tileUrls[mapStyle], {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap & CARTO'
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Click on map to add custom site
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const lat = parseFloat(e.latlng.lat.toFixed(5));
      const lng = parseFloat(e.latlng.lng.toFixed(5));
      setClickCoords([lat, lng]);

      // Temporary marker
      if (tempMarkerRef.current) {
        tempMarkerRef.current.remove();
      }

      const tempIcon = L.divIcon({
        className: 'custom-temp-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 bg-indigo-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white text-base animate-bounce">
              📍
            </div>
            <div class="absolute -bottom-1 w-2 h-2 bg-indigo-600 rotate-45"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const tempMarker = L.marker([lat, lng], { icon: tempIcon }).addTo(map);
      tempMarkerRef.current = tempMarker;

      // Reverse geocode to get human address
      const addr = await reverseGeocode(lat, lng);
      setClickAddress(addr);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(tileUrls[mapStyle]);
  }, [mapStyle]);

  // Render Markers and Active Day Route
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    const bounds = L.latLngBounds([]);

    // Map of siteId to Day Stop Index (if active day exists)
    const dayStopOrderMap = new Map<string, number>();
    const routeCoords: [number, number][] = [];

    if (activeDay) {
      let order = 1;
      activeDay.stops.forEach((stop) => {
        if (stop.siteId && !stop.isRestBreak) {
          dayStopOrderMap.set(stop.siteId, order++);
          const site = sites.find((s) => s.id === stop.siteId);
          if (site) {
            routeCoords.push(site.coordinates);
          }
        }
      });
    }

    // Draw connecting route polyline if active day has multiple stops
    if (routeCoords.length > 1) {
      const polyline = L.polyline(routeCoords, {
        color: '#4f46e5',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(mapInstanceRef.current);

      routeLayerRef.current = polyline;
    }

    // Add Site Markers
    sites.forEach((site) => {
      bounds.extend(site.coordinates);

      const isSelected = selectedSiteId === site.id;
      const dayOrder = dayStopOrderMap.get(site.id);

      const getMarkerColor = () => {
        if (dayOrder !== undefined) return '#4f46e5'; // Indigo for today's itinerary
        switch (site.category) {
          case 'temple': return '#d97706';
          case 'attraction': return '#e11d48';
          case 'park': return '#059669';
          case 'museum': return '#0284c7';
          case 'nature': return '#16a34a';
          case 'restaurant': return '#ea580c';
          case 'shopping': return '#9333ea';
          default: return '#64748b';
        }
      };

      const getCategoryText = (cat: string) => {
        switch (cat) {
          case 'temple': return '神社寺庙';
          case 'attraction': return '地标乐园';
          case 'park': return '公园动物园';
          case 'museum': return '博览展馆';
          case 'nature': return '自然风景';
          case 'restaurant': return '亲子餐厅';
          case 'shopping': return '商场购物';
          case 'relax': return '温泉茶休';
          default: return '景点';
        }
      };

      const markerColor = getMarkerColor();
      const markerHtml = `
        <div class="relative flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-10'}">
          <div style="background-color: ${markerColor};" class="w-9 h-9 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">
            ${dayOrder ? `D${dayOrder}` : getCategoryEmoji(site.category)}
          </div>
          <div style="background-color: ${markerColor};" class="absolute -bottom-1 w-2 h-2 rotate-45"></div>
          ${isSelected ? '<div class="absolute -inset-1.5 rounded-full border-2 border-indigo-400 animate-ping pointer-events-none opacity-75"></div>' : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-site-marker',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const marker = L.marker(site.coordinates, { icon: customIcon });

      // Custom Popup HTML in Chinese
      const popupContent = document.createElement('div');
      popupContent.className = 'w-72 overflow-hidden bg-white text-slate-800 rounded-xl font-sans';
      popupContent.innerHTML = `
        <div class="relative h-28 w-full bg-slate-100 overflow-hidden">
          <img src="${site.coverImage}" alt="${site.name}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider">
            ${getCategoryText(site.category)}
          </span>
          <div class="absolute bottom-2 left-2 right-2 text-white">
            <h4 class="font-bold text-sm leading-tight drop-shadow-sm line-clamp-1">${site.name}</h4>
            <p class="text-[11px] text-slate-200 line-clamp-1">${site.localName || site.address}</p>
          </div>
        </div>
        <div class="p-3 space-y-2">
          <div class="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span class="font-bold text-emerald-700">🚼 推车 ${site.strollerRating}/5</span>
            <span class="font-bold text-amber-700">🧒 幼童 ${site.kidRating}/5</span>
            <span class="font-bold text-indigo-700">🧓 长辈 ${site.elderlyRating}/5</span>
          </div>
          <p class="text-xs text-slate-600 line-clamp-2">${site.description}</p>
          <div class="pt-1 flex items-center gap-2">
            <button id="popup-view-btn-${site.id}" class="flex-1 py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs">
              查看三代同堂详情
            </button>
            ${
              onAddSiteToDay
                ? `<button id="popup-add-btn-${site.id}" class="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs">
                    + 加入当日
                  </button>`
                : ''
            }
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300, closeButton: true });

      marker.on('popupopen', () => {
        const viewBtn = document.getElementById(`popup-view-btn-${site.id}`);
        viewBtn?.addEventListener('click', () => {
          onSelectSite(site);
          marker.closePopup();
        });

        if (onAddSiteToDay) {
          const addBtn = document.getElementById(`popup-add-btn-${site.id}`);
          addBtn?.addEventListener('click', () => {
            onAddSiteToDay(site.id);
            marker.closePopup();
          });
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });

    if (sites.length > 0 && mapInstanceRef.current) {
      if (selectedSiteId) {
        const selectedSite = sites.find((s) => s.id === selectedSiteId);
        if (selectedSite) {
          mapInstanceRef.current.flyTo(selectedSite.coordinates, 15, { duration: 1.2 });
        }
      }
    }
  }, [sites, selectedSiteId, activeDay]);

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'temple': return '⛩️';
      case 'attraction': return '🎡';
      case 'park': return '🐼';
      case 'museum': return '🏛️';
      case 'nature': return '🌲';
      case 'restaurant': return '🍜';
      case 'shopping': return '🛍️';
      case 'relax': return '🍵';
      case 'hotel': return '🏨';
      default: return '📍';
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setShowSearchResults(true);
    const results = await searchPlaces(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectSearchResult = (result: GeocodeResult) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([result.lat, result.lng], 16, { duration: 1.5 });
    setShowSearchResults(false);
    setClickCoords([result.lat, result.lng]);
    setClickAddress(result.displayName);

    if (tempMarkerRef.current) tempMarkerRef.current.remove();

    const tempIcon = L.divIcon({
      className: 'custom-temp-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 bg-indigo-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white text-base animate-bounce">
            📍
          </div>
          <div class="absolute -bottom-1 w-2 h-2 bg-indigo-600 rotate-45"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const tempMarker = L.marker([result.lat, result.lng], { icon: tempIcon }).addTo(mapInstanceRef.current);
    tempMarkerRef.current = tempMarker;
  };

  const handleFitAllSites = () => {
    if (!mapInstanceRef.current || sites.length === 0) return;
    const bounds = L.latLngBounds(sites.map((s) => s.coordinates));
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  };

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-3xl overflow-hidden shadow-inner border border-slate-200">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Search Bar */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-96 z-20">
        <form onSubmit={handleSearchSubmit} className="relative shadow-lg rounded-2xl">
          <input
            type="text"
            placeholder="搜索全球/日本任意地名或地址..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowSearchResults(true);
            }}
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          
          {isSearching && (
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
          )}
        </form>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="mt-1.5 w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {searchResults.map((res) => (
              <button
                key={res.placeId}
                type="button"
                onClick={() => handleSelectSearchResult(res)}
                className="w-full text-left p-3 hover:bg-indigo-50/80 transition-colors flex items-start gap-2.5"
              >
                <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">{res.name}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{res.displayName}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Control Bar Top-Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Layer Switcher */}
        <div className="bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-md border border-slate-200 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMapStyle('voyager')}
            className={`px-2.5 py-1 text-xs font-medium rounded-xl transition-colors ${
              mapStyle === 'voyager' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            现代清新
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('osm')}
            className={`px-2.5 py-1 text-xs font-medium rounded-xl transition-colors ${
              mapStyle === 'osm' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            标准地图
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('topo')}
            className={`px-2.5 py-1 text-xs font-medium rounded-xl transition-colors ${
              mapStyle === 'topo' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            地形图
          </button>
        </div>

        {/* Fit All Sites Button */}
        <button
          type="button"
          onClick={handleFitAllSites}
          title="全览所有景点"
          className="p-2.5 bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600 rounded-2xl shadow-md border border-slate-200 backdrop-blur-md transition-colors"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Click Pin Notification / Add Site Prompt */}
      {clickCoords && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-20 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-2xl flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wide uppercase text-indigo-600">地图选定坐标</span>
                <p className="text-xs font-medium text-slate-800 line-clamp-2 mt-0.5">
                  {clickAddress || `${clickCoords[0]}, ${clickCoords[1]}`}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  纬度: {clickCoords[0]} • 经度: {clickCoords[1]}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setClickCoords(null);
                if (tempMarkerRef.current) tempMarkerRef.current.remove();
              }}
              className="text-slate-400 hover:text-slate-600 text-sm p-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onAddNewSiteAtCoords(clickCoords, clickAddress);
                setClickCoords(null);
                if (tempMarkerRef.current) tempMarkerRef.current.remove();
              }}
              className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              在此位置创建新景点
            </button>
          </div>
        </div>
      )}

      {/* Route Badge when viewing Day */}
      {activeDay && (
        <div className="absolute bottom-6 right-16 z-20 bg-indigo-900/90 text-white backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-indigo-700/50 flex items-center gap-2 text-xs">
          <Navigation className="w-4 h-4 text-indigo-300" />
          <div>
            <span className="font-bold">第 {activeDay.dayNumber} 天 路线连线中</span>
            <span className="text-indigo-200 ml-1.5 font-normal">({activeDay.stops.filter(s => !s.isRestBreak).length} 个打卡点)</span>
          </div>
        </div>
      )}
    </div>
  );
};
