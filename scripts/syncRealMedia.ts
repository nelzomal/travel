import https from 'https';
import fs from 'fs';
import path from 'path';

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'FamilyTravelApp/1.0 (contact@example.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function checkUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      https.get(parsed, { headers: { 'User-Agent': 'FamilyTravelApp/1.0' } }, (res) => {
        resolve(res.statusCode === 200);
      }).on('error', () => resolve(false));
    } catch {
      resolve(false);
    }
  });
}

async function getMediaForPage(title: string): Promise<string[]> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`;
    const data = await fetchJson(url);
    const result: string[] = [];
    if (data && data.items) {
      for (const item of data.items) {
        if (item.type === 'image' && item.srcset) {
          // get the largest available (e.g. 1280px or 800px or last one in srcset)
          const largest = item.srcset[item.srcset.length - 1];
          let imgUrl = largest ? largest.src : '';
          if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
          // remove query string
          imgUrl = imgUrl.split('?')[0];

          if (
            !imgUrl.toLowerCase().includes('logo') &&
            !imgUrl.toLowerCase().includes('icon') &&
            !imgUrl.toLowerCase().includes('stub') &&
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

async function run() {
  const mapping: Record<string, string[]> = {
    'site-kasai-rinkai-aquarium': ['Tokyo_Sea_Life_Park', 'Kasai_Rinkai_Park'],
    'site-lake-ashi-cruise': ['Hakone_Sightseeing_Cruise', 'Lake_Ashi', 'Hakone_Shrine'],
    'site-kyoto-railway-aquarium': ['Kyoto_Railway_Museum', 'Kyoto_Aquarium', 'Umekoji_Park'],
    'site-meiji-jingu': ['Meiji_Shrine'],
    'site-odaiba': ['Odaiba', 'DiverCity_Tokyo_Plaza', 'Statue_of_Liberty_(Odaiba)'],
    'site-ueno-park-zoo': ['Ueno_Zoo', 'Ueno_Park', 'Shinobazu_Pond'],
    'site-hakone-owakudani': ['Ōwakudani', 'Hakone_Ropeway'],
    'site-mount-fuji-5th-kawaguchiko': ['Mount_Fuji', 'Lake_Kawaguchi'],
    'site-arashiyama': ['Arashiyama', 'Togetsukyō', 'Iwatayama_Monkey_Park'],
    'site-fushimi-inari-jikkokubune': ['Fushimi_Inari-taisha', 'Fushimi,_Kyoto'],
    'site-kiyomizudera-gion': ['Kiyomizu-dera', 'Gion', 'Ninenzaka'],
    'site-kifune-kurama': ['Kifune_Shrine', 'Kurama-dera'],
    'site-tofukuji': ['Tōfuku-ji'],
    'site-nishi-honganji': ['Nishi_Hongan-ji'],
    'site-eikando': ['Eikan-dō_Zenrin-ji']
  };

  const output: Record<string, { cover: string; gallery: string[] }> = {};

  for (const [siteId, titles] of Object.entries(mapping)) {
    console.log(`Processing ${siteId}...`);
    let urls: string[] = [];
    for (const t of titles) {
      const pageUrls = await getMediaForPage(t);
      for (const u of pageUrls) {
        if (!urls.includes(u)) urls.push(u);
      }
    }

    // Filter to keep working ones
    const verified: string[] = [];
    for (const u of urls) {
      const ok = await checkUrl(u);
      if (ok) {
        verified.push(u);
      }
      if (verified.length >= 8) break;
    }

    console.log(`  -> Got ${verified.length} verified real images`);
    if (verified.length > 0) {
      output[siteId] = {
        cover: verified[0],
        gallery: verified
      };
    }
  }

  fs.writeFileSync('./data/verified_wikipedia_media.json', JSON.stringify(output, null, 2));
  console.log('✅ Done! Saved to data/verified_wikipedia_media.json');
}

run();
