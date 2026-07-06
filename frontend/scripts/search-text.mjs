import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

function searchDir(dir, query) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry !== 'node_modules' && entry !== '.git' && entry !== 'dist') {
        searchDir(full, query);
      }
    } else {
      if (full.endsWith('.tsx') || full.endsWith('.ts') || full.endsWith('.html')) {
        const content = readFileSync(full, 'utf-8');
        if (content.toLowerCase().includes(query.toLowerCase())) {
          console.log(`Found in: ${full}`);
        }
      }
    }
  }
}

console.log('Searching for "Select a Service"...');
searchDir('C:/Users/A/OneDrive/Desktop/ks-demo/src', 'Select a Service');
