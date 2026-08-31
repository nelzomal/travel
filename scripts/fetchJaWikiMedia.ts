import https from 'https';
import fs from 'fs';
import path from 'path';

const USER_AGENT = 'FamilyTravelPlanner/1.0 (https://github.com/nelzomal/travel; contact@travelplanner.local)';

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function checkImage200(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      https.get(parsed, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
        resolve(res.statusCode === 200);
      }).on('error', () => resolve(false));
    } catch {
      resolve(false);
    }
  });
}

async function getImagesForJapanesePage(title: string): Promise<string[]> {
  try {
    const url = `https://ja.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`;
    const data = await fetchJson(url);
    const result: string[] = [];
    if (data && data.items) {
      for (const item of data.items) {
        if (item.type === 'image' && item.srcset) {
          const largest = item.srcset[item.srcset.length - 1];
          let imgUrl = largest ? largest.src : '';
          if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
          imgUrl = imgUrl.split('?')[0];

          if (
            !imgUrl.toLowerCase().includes('logo') &&
            !imgUrl.toLowerCase().includes('icon') &&
            !imgUrl.toLowerCase().includes('stub') &&
            !imgUrl.toLowerCase().includes('map') &&
            !imgUrl.toLowerCase().includes('flag') &&
            !imgUrl.toLowerCase().includes('.svg')
          ) {
            result.push(imgUrl);
          }
        }
      }
    }
    return result;
  } catch (e) {
    console.error(`Error on ${title}:`, e);
    return [];
  }
}

async function main() {
  const mapping: Record<string, { titles: string[]; defaultCoverIndex?: number }> = {
    'site-kasai-rinkai-aquarium': {
      titles: ['葛西臨海水族園', '葛西臨海公園']
    },
    'site-lake-ashi-cruise': {
      titles: ['芦ノ湖', '箱根神社', '箱根海賊船']
    },
    'site-kyoto-railway-aquarium': {
      titles: ['京都鉄道博物館', '京都水族館', '梅小路公園']
    },
    'site-meiji-jingu': {
      titles: ['明治神宮', '代々木公園']
    },
    'site-odaiba': {
      titles: ['お台場', 'ダイバーシティ東京', 'レインボーブリッジ']
    },
    'site-ueno-park-zoo': {
      titles: ['恩賜上野動物園', '上野恩賜公園', '不忍池']
    },
    'site-hakone-owakudani': {
      titles: ['大涌谷', '箱根ロープウェイ']
    },
    'site-mount-fuji-5th-kawaguchiko': {
      titles: ['富士山', '河口湖']
    },
    'site-arashiyama': {
      titles: ['嵐山', '渡月橋', '嵯峨野観光鉄道嵯峨野観光線']
    },
    'site-fushimi-inari-jikkokubune': {
      titles: ['伏見稲荷大社', '伏見 (京都市)']
    },
    'site-kiyomizudera-gion': {
      titles: ['清水寺', '祇園', '産寧坂']
    },
    'site-kifune-kurama': {
      titles: ['貴船神社', '鞍馬寺', '鞍馬山']
    },
    'site-tofukuji': {
      titles: ['東福寺']
    },
    'site-nishi-honganji': {
      titles: ['西本願寺']
    },
    'site-eikando': {
      titles: ['永観堂禅林寺']
    }
  };

  const finalCurated: Record<string, { cover: string; gallery: string[] }> = {};

  for (const [siteId, { titles }] of Object.entries(mapping)) {
    console.log(`Processing ${siteId}...`);
    let rawUrls: string[] = [];
    for (const t of titles) {
      const pageUrls = await getImagesForJapanesePage(t);
      for (const u of pageUrls) {
        if (!rawUrls.includes(u)) rawUrls.push(u);
      }
    }

    // Verify 200 OK
    const verified: string[] = [];
    for (const u of rawUrls) {
      const ok = await checkImage200(u);
      if (ok) {
        verified.push(u);
      }
      if (verified.length >= 10) break;
    }

    console.log(`  -> Got ${verified.length} verified authentic images for ${siteId}`);
    if (verified.length > 0) {
      finalCurated[siteId] = {
        cover: verified[0],
        gallery: verified
      };
    }
  }

  fs.writeFileSync('./data/ja_wiki_verified.json', JSON.stringify(finalCurated, null, 2));
  console.log('✅ Wrote data/ja_wiki_verified.json');
}

main();
