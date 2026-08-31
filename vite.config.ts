import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

function localSyncPlugin(): Plugin {
  return {
    name: 'local-file-sync',
    configureServer(server) {
      server.middlewares.use('/api/sync-data', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { sites, trips } = JSON.parse(body);
              const rootDir = process.cwd();
              if (Array.isArray(sites)) {
                const sitesContent = `import { Site } from "../types/travel";\n\nexport const INITIAL_SITES: Site[] = ${JSON.stringify(sites, null, 2)};\n`;
                fs.writeFileSync(path.resolve(rootDir, 'src/data/mockSites.ts'), sitesContent, 'utf-8');
                fs.mkdirSync(path.resolve(rootDir, 'data'), { recursive: true });
                fs.writeFileSync(path.resolve(rootDir, 'data/sites.json'), JSON.stringify(sites, null, 2), 'utf-8');
              }
              if (Array.isArray(trips)) {
                const tripsContent = `import { Trip } from "../types/travel";\n\nexport const INITIAL_TRIPS: Trip[] = ${JSON.stringify(trips, null, 2)};\n`;
                fs.writeFileSync(path.resolve(rootDir, 'src/data/mockTrips.ts'), tripsContent, 'utf-8');
                fs.mkdirSync(path.resolve(rootDir, 'data'), { recursive: true });
                fs.writeFileSync(path.resolve(rootDir, 'data/trips.json'), JSON.stringify(trips, null, 2), 'utf-8');
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
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), localSyncPlugin()],
});
