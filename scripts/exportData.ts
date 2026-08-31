import { INITIAL_SITES } from '../src/data/mockSites';
import { INITIAL_TRIPS } from '../src/data/mockTrips';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../data');
fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(path.join(dataDir, 'sites.json'), JSON.stringify(INITIAL_SITES, null, 2));
fs.writeFileSync(path.join(dataDir, 'trips.json'), JSON.stringify(INITIAL_TRIPS, null, 2));

console.log('✅ Successfully exported JSON datasets:');
console.log(`   - data/sites.json (${INITIAL_SITES.length} sites)`);
console.log(`   - data/trips.json (${INITIAL_TRIPS.length} trip)`);
