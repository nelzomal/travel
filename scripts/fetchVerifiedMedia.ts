import https from 'https';

interface WikiImageInfo {
  url: string;
  descriptionurl?: string;
}

const fetchJson = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'TravelAppBot/1.0 (zhounan@example.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

const checkUrlStatus = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      https.request(parsed, { method: 'HEAD', headers: { 'User-Agent': 'TravelAppBot/1.0' } }, (res) => {
        resolve(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302);
      }).on('error', () => resolve(false)).end();
    } catch {
      resolve(false);
    }
  });
};

async function getImagesForCategoryOrPage(titles: string[]): Promise<string[]> {
  const verifiedUrls: string[] = [];
  for (const title of titles) {
    try {
      const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=images&titles=${encodeURIComponent(title)}&gimlimit=20&prop=imageinfo&iiprop=url|mime&format=json`;
      const data = await fetchJson(apiUrl);
      if (data && data.query && data.query.pages) {
        for (const pageId of Object.keys(data.query.pages)) {
          const page = data.query.pages[pageId];
          if (page.imageinfo && page.imageinfo[0]) {
            const url = page.imageinfo[0].url;
            const mime = page.imageinfo[0].mime;
            if (mime === 'image/jpeg' || mime === 'image/png' || mime === 'image/webp') {
              // verify with checkUrlStatus
              const ok = await checkUrlStatus(url);
              if (ok && !verifiedUrls.includes(url)) {
                verifiedUrls.push(url);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(`Error querying title ${title}:`, e);
    }
  }
  return verifiedUrls;
}

async function run() {
  console.log('Fetching verified Wikimedia images for all sites...');
  const siteQueries: Record<string, string[]> = {
    'site-kyoto-railway-aquarium': ['Kyoto_Railway_Museum', 'Kyoto_Aquarium', 'Umekoji_Park'],
    'site-meiji-jingu': ['Meiji_Shrine', 'Meiji_Jingu'],
    'site-odaiba': ['Odaiba', 'DiverCity_Tokyo_Plaza', 'Statue_of_Liberty_(Odaiba)'],
    'site-ueno-park-zoo': ['Ueno_Zoo', 'Ueno_Park', 'Shinobazu_Pond'],
    'site-hakone-owakudani': ['Ōwakudani', 'Hakone_Ropeway'],
    'site-mount-fuji-5th-kawaguchiko': ['Mount_Fuji', 'Lake_Kawaguchi', 'Fuji_Subaru_Line'],
    'site-arashiyama': ['Arashiyama', 'Togetsukyō', 'Iwatayama_Monkey_Park', 'Sagano_Scenic_Railway'],
    'site-fushimi-inari-jikkokubune': ['Fushimi_Inari-taisha', 'Fushimi,_Kyoto'],
    'site-kiyomizudera-gion': ['Kiyomizu-dera', 'Gion', 'Ninenzaka'],
    'site-kifune-kurama': ['Kifune_Shrine', 'Kurama-dera'],
    'site-tofukuji': ['Tōfuku-ji'],
    'site-nishi-honganji': ['Nishi_Hongan-ji'],
    'site-eikando': ['Eikan-dō_Zenrin-ji']
  };

  const results: Record<string, string[]> = {};

  for (const [siteId, titles] of Object.entries(siteQueries)) {
    console.log(`Searching for ${siteId}...`);
    const urls = await getImagesForCategoryOrPage(titles);
    console.log(`  Found ${urls.length} verified URLs for ${siteId}`);
    results[siteId] = urls.slice(0, 10);
  }

  console.log('\nRESULTS SUMMARY:');
  console.log(JSON.stringify(results, null, 2));
}

run();
