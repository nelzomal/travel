import https from 'https';
import fs from 'fs';
import path from 'path';

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'TravelAppBot/1.0 (zhounan@example.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function checkUrlOk(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const req = https.request(parsed, { method: 'HEAD', headers: { 'User-Agent': 'TravelAppBot/1.0' } }, (res) => {
        resolve(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(5000, () => { req.destroy(); resolve(false); });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function getImagesForWikipediaTitle(title: string): Promise<string[]> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=images&titles=${encodeURIComponent(title)}&gimlimit=30&prop=imageinfo&iiprop=url|mime&format=json`;
    const data = await fetchJson(url);
    const urls: string[] = [];
    if (data && data.query && data.query.pages) {
      for (const p of Object.values(data.query.pages) as any[]) {
        if (p.imageinfo && p.imageinfo[0]) {
          const imgUrl = p.imageinfo[0].url;
          const mime = p.imageinfo[0].mime;
          if (
            (mime === 'image/jpeg' || mime === 'image/png' || mime === 'image/webp') &&
            !imgUrl.toLowerCase().includes('logo') &&
            !imgUrl.toLowerCase().includes('icon') &&
            !imgUrl.toLowerCase().includes('stub') &&
            !imgUrl.toLowerCase().includes('flag') &&
            !imgUrl.toLowerCase().includes('commons-logo')
          ) {
            urls.push(imgUrl);
          }
        }
      }
    }
    return urls;
  } catch (e) {
    console.error(`Failed to get images for ${title}`, e);
    return [];
  }
}

async function main() {
  const siteConfig: Record<string, { titles: string[]; extraRealUrls?: string[] }> = {
    'site-kyoto-railway-aquarium': {
      titles: ['Kyoto_Railway_Museum', 'Umekoji_Locomotive_Depot']
    },
    'site-meiji-jingu': {
      titles: ['Meiji_Shrine']
    },
    'site-odaiba': {
      titles: ['Odaiba', 'DiverCity_Tokyo_Plaza', 'Statue_of_Liberty_(Odaiba)']
    },
    'site-ueno-park-zoo': {
      titles: ['Ueno_Zoo', 'Ueno_Park', 'Shinobazu_Pond']
    },
    'site-hakone-owakudani': {
      titles: ['Ōwakudani', 'Hakone_Ropeway']
    },
    'site-mount-fuji-5th-kawaguchiko': {
      titles: ['Mount_Fuji', 'Lake_Kawaguchi']
    },
    'site-arashiyama': {
      titles: ['Arashiyama', 'Togetsukyō', 'Iwatayama_Monkey_Park']
    },
    'site-fushimi-inari-jikkokubune': {
      titles: ['Fushimi_Inari-taisha']
    },
    'site-kiyomizudera-gion': {
      titles: ['Kiyomizu-dera', 'Gion', 'Ninenzaka']
    },
    'site-kifune-kurama': {
      titles: ['Kifune_Shrine', 'Kurama-dera']
    },
    'site-tofukuji': {
      titles: ['Tōfuku-ji']
    },
    'site-nishi-honganji': {
      titles: ['Nishi_Hongan-ji']
    },
    'site-eikando': {
      titles: ['Eikan-dō_Zenrin-ji']
    }
  };

  const finalMediaBank: Record<string, { cover: string; gallery: string[] }> = {};

  for (const [siteId, cfg] of Object.entries(siteConfig)) {
    console.log(`\nFetching for ${siteId}...`);
    const allFound: string[] = [];
    for (const t of cfg.titles) {
      const urls = await getImagesForWikipediaTitle(t);
      for (const u of urls) {
        if (!allFound.includes(u)) allFound.push(u);
      }
    }

    // Verify all found URLs with HEAD request
    const verified: string[] = [];
    for (const u of allFound) {
      const ok = await checkUrlOk(u);
      if (ok) {
        verified.push(u);
      }
    }

    console.log(`  -> Verified ${verified.length} working authentic images for ${siteId}`);
    if (verified.length > 0) {
      finalMediaBank[siteId] = {
        cover: verified[0],
        gallery: verified.slice(0, 8)
      };
    }
  }

  fs.writeFileSync('./data/verified_media.json', JSON.stringify(finalMediaBank, null, 2));
  console.log('\n✅ Saved verified_media.json successfully!');
}

main();
