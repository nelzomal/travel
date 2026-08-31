import https from 'https';
import fs from 'fs';

function checkUrlOk(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      https.get(parsed, { headers: { 'User-Agent': 'Mozilla/5.0 (FamilyTravelApp)' } }, (res) => {
        resolve(res.statusCode === 200);
      }).on('error', () => resolve(false));
    } catch {
      resolve(false);
    }
  });
}

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (FamilyTravelApp)' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
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
          const largest = item.srcset[item.srcset.length - 1];
          let imgUrl = largest ? largest.src : '';
          if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
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
    return [];
  }
}

async function main() {
  const pageMap: Record<string, string[]> = {
    'site-meiji-jingu': ['Meiji_Shrine', 'Meiji_Jingu_Stadium', 'Yoyogi_Park'],
    'site-odaiba': ['Odaiba', 'DiverCity_Tokyo_Plaza', 'Statue_of_Liberty_(Odaiba)', 'Fuji_TV_building'],
    'site-ueno-park-zoo': ['Ueno_Zoo', 'Ueno_Park', 'Shinobazu_Pond', 'Tokyo_National_Museum'],
    'site-hakone-owakudani': ['Ōwakudani', 'Hakone_Ropeway', 'Hakone,_Kanagawa'],
    'site-mount-fuji-5th-kawaguchiko': ['Mount_Fuji', 'Lake_Kawaguchi', 'Fuji-Hakone-Izu_National_Park'],
    'site-arashiyama': ['Arashiyama', 'Togetsukyō', 'Iwatayama_Monkey_Park', 'Tenryū-ji'],
    'site-fushimi-inari-jikkokubune': ['Fushimi_Inari-taisha', 'Fushimi,_Kyoto'],
    'site-kiyomizudera-gion': ['Kiyomizu-dera', 'Gion', 'Yasaka_Shrine'],
    'site-kifune-kurama': ['Kifune_Shrine', 'Kurama-dera', 'Mount_Kurama'],
    'site-tofukuji': ['Tōfuku-ji'],
    'site-nishi-honganji': ['Nishi_Hongan-ji', 'Higashi_Hongan-ji'],
    'site-eikando': ['Eikan-dō_Zenrin-ji', 'Nanzen-ji']
  };

  const finalBank: Record<string, string[]> = {};

  for (const [siteId, pages] of Object.entries(pageMap)) {
    console.log(`Searching pages for ${siteId}...`);
    let candidates: string[] = [];
    for (const p of pages) {
      const urls = await getMediaForPage(p);
      for (const u of urls) {
        if (!candidates.includes(u)) candidates.push(u);
      }
    }

    const verified: string[] = [];
    for (const c of candidates) {
      const ok = await checkUrlOk(c);
      if (ok) {
        verified.push(c);
      }
      if (verified.length >= 10) break;
    }
    console.log(`  -> ${siteId}: ${verified.length} verified 200 OK images`);
    finalBank[siteId] = verified;
  }

  fs.writeFileSync('./data/auto_verified_bank.json', JSON.stringify(finalBank, null, 2));
  console.log('✅ Wrote data/auto_verified_bank.json');
}

main();
