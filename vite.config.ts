import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function localSyncPlugin(): Plugin {
  const syncHandler = (req: any, res: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const rootDir = path.dirname(fileURLToPath(import.meta.url));
    const sitesPath = path.resolve(rootDir, 'data/sites.json');
    const tripsPath = path.resolve(rootDir, 'data/trips.json');

    if (req.method === 'GET') {
      try {
        let sites: any[] = [];
        let trips: any[] = [];

        if (fs.existsSync(sitesPath)) {
          sites = JSON.parse(fs.readFileSync(sitesPath, 'utf-8'));
          // Keep mockSites.ts in sync with data/sites.json
          const sitesContent = `import { Site } from "../types/travel";\n\nexport const INITIAL_SITES: Site[] = ${JSON.stringify(sites, null, 2)};\n`;
          fs.writeFileSync(path.resolve(rootDir, 'src/data/mockSites.ts'), sitesContent, 'utf-8');
        }
        if (fs.existsSync(tripsPath)) {
          trips = JSON.parse(fs.readFileSync(tripsPath, 'utf-8'));
          // Keep mockTrips.ts in sync with data/trips.json
          const tripsContent = `import { Trip } from "../types/travel";\n\nexport const INITIAL_TRIPS: Trip[] = ${JSON.stringify(trips, null, 2)};\n`;
          fs.writeFileSync(path.resolve(rootDir, 'src/data/mockTrips.ts'), tripsContent, 'utf-8');
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          sites, 
          trips, 
          message: `已从磁盘加载 ${sites.length} 个景点与 ${trips.length} 个行程数据` 
        }));
      } catch (e: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
      return;
    }

    if (req.method === 'POST') {
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer | string) => {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      });
      req.on('end', () => {
        try {
          const body = Buffer.concat(chunks).toString('utf-8');
          const { sites, trips } = JSON.parse(body);
          if (Array.isArray(sites)) {
            const sitesContent = `import { Site } from "../types/travel";\n\nexport const INITIAL_SITES: Site[] = ${JSON.stringify(sites, null, 2)};\n`;
            fs.writeFileSync(path.resolve(rootDir, 'src/data/mockSites.ts'), sitesContent, 'utf-8');
            fs.mkdirSync(path.resolve(rootDir, 'data'), { recursive: true });
            fs.writeFileSync(sitesPath, JSON.stringify(sites, null, 2), 'utf-8');
          }
          if (Array.isArray(trips)) {
            const tripsContent = `import { Trip } from "../types/travel";\n\nexport const INITIAL_TRIPS: Trip[] = ${JSON.stringify(trips, null, 2)};\n`;
            fs.writeFileSync(path.resolve(rootDir, 'src/data/mockTrips.ts'), tripsContent, 'utf-8');
            fs.mkdirSync(path.resolve(rootDir, 'data'), { recursive: true });
            fs.writeFileSync(tripsPath, JSON.stringify(trips, null, 2), 'utf-8');
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Files synchronized to Git codebase successfully' }));
        } catch (e: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
    } else {
      res.writeHead(405);
      res.end();
    }
  };

  return {
    name: 'local-file-sync',
    configureServer(server) {
      server.middlewares.use('/api/sync-data', syncHandler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/sync-data', syncHandler);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), localSyncPlugin()],
});
