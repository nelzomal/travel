export interface GeocodeResult {
  placeId: number;
  displayName: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  address: {
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

export const searchPlaces = async (query: string): Promise<GeocodeResult[]> => {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&addressdetails=1&limit=6`;
    
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en,ja,zh',
        'User-Agent': 'FamilyTravelPlannerApp/1.0'
      }
    });

    if (!response.ok) return [];
    
    const data = await response.json();
    return data.map((item: any) => ({
      placeId: item.place_id,
      displayName: item.display_name,
      name: item.name || item.display_name.split(',')[0],
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type,
      address: item.address || {}
    }));
  } catch (err) {
    console.error('Error during geocoding search:', err);
    return [];
  }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en,ja,zh',
        'User-Agent': 'FamilyTravelPlannerApp/1.0'
      }
    });
    if (!response.ok) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (err) {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};
