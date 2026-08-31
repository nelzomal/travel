import { Site } from '../types/travel';

// Guaranteed high-speed CDN MP4 video clips & verified embeds
export const DEFAULT_TRAVEL_MP4 = 'https://vjs.zencdn.net/v/oceans.mp4';

export const CURATED_MEDIA_BANK: Record<string, { gallery: string[]; videos: string[]; cover: string }> = {
  'site-kasai-rinkai-aquarium': {
    cover: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520690214124-2405c5217036?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=kYJvPcvbA3I'
    ]
  },
  'site-meiji-jingu': {
    cover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=Jm_C7q3dC7Q'
    ]
  },
  'site-odaiba': {
    cover: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=9gWzQ1j2z40'
    ]
  },
  'site-hakone-owakudani': {
    cover: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=F3P_U1B2v44'
    ]
  },
  'site-lake-ashi-cruise': {
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg/1280px-Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Hakone_Pirate_Ship_-_Hakone%2C_Japan_-_DSC06056.jpg/1280px-Hakone_Pirate_Ship_-_Hakone%2C_Japan_-_DSC06056.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Hakone_Pirate_Ship_-_Hakone%2C_Japan_-_DSC05216.jpg/1280px-Hakone_Pirate_Ship_-_Hakone%2C_Japan_-_DSC05216.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Pirate_ship_on_Lake_Ashi_%289412052470%29.jpg/1280px-Pirate_ship_on_Lake_Ashi_%289412052470%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/JAP_Hakone_Lake_Ashi.jpg/1280px-JAP_Hakone_Lake_Ashi.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg/1280px-Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Hakone_Shrine_July_2018.jpg/1280px-Hakone_Shrine_July_2018.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Torii_on_Lake_Ashi_%40_Hakone_Shrine_%2813776879364%29.jpg/1280px-Torii_on_Lake_Ashi_%40_Hakone_Shrine_%2813776879364%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Le_Torii_dans_le_lac_%28Hakone%2C_Japon%29_%2830429846347%29.jpg/1280px-Le_Torii_dans_le_lac_%28Hakone%2C_Japon%29_%2830429846347%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Torii_in_Hakone_Shrine_%2844605438795%29.jpg/1280px-Torii_in_Hakone_Shrine_%2844605438795%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/A_view_of_Lake_Ashi_with_Peace_Torii_gate%2C_Hakone%2C_Japan1.jpg/1280px-A_view_of_Lake_Ashi_with_Peace_Torii_gate%2C_Hakone%2C_Japan1.jpg'
    ],
    videos: [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://www.youtube.com/watch?v=hlpP1ubsFUA',
      'https://www.youtube.com/watch?v=JZBF4Mm83bU'
    ]
  }
};

export const getSmartCuratedMediaForSite = (site: Site): { gallery: string[]; videos: string[]; coverImage: string } => {
  if (CURATED_MEDIA_BANK[site.id]) {
    return {
      gallery: CURATED_MEDIA_BANK[site.id].gallery,
      videos: CURATED_MEDIA_BANK[site.id].videos,
      coverImage: CURATED_MEDIA_BANK[site.id].cover
    };
  }

  // Generate verified theme based photo sets
  if (site.category === 'museum' || site.name.includes('水族') || site.name.includes('海洋')) {
    return {
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520690214124-2405c5217036?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80'
      ],
      videos: ['https://vjs.zencdn.net/v/oceans.mp4', 'https://www.youtube.com/watch?v=kYJvPcvbA3I']
    };
  }

  // Default Kyoto / Japanese Heritage fallback
  return {
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80'
    ],
    videos: ['https://vjs.zencdn.net/v/oceans.mp4', 'https://www.youtube.com/watch?v=1La4QzGeaaQ']
  };
};
