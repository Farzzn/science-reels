import fs from 'node:fs';
import path from 'node:path';

const words = JSON.parse(fs.readFileSync(path.resolve('public/attowater/words.json'), 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']/g, '');

const files = ['src/AttosecondWater/scenes01.tsx', 'src/AttosecondWater/scenes02.tsx'];
let total = 0;
let missed = 0;

for (const f of files) {
  const src = fs.readFileSync(path.resolve(f), 'utf8');
  const blocks = src.split(/export const AttoCh/);
  for (let b = 1; b < blocks.length; b++) {
    const chMatch = blocks[b].match(/makeAttoCue\("([^"]+)"\)/);
    if (!chMatch) continue;
    const ch = chMatch[1];
    const list = words.filter((w) => w.ch === ch);
    for (const m of blocks[b].matchAll(/\bcue\("([^"]+)"/g)) {
      total++;
      const phrase = m[1];
      const target = norm(phrase);
      let found = false;
      for (let i = 0; i < list.length && !found; i++) {
        let acc = '';
        for (let j = i; j < list.length && acc.length < target.length; j++) {
          acc += norm(list[j].w);
          if (acc === target) { found = true; break; }
          if (!target.startsWith(acc)) break;
        }
      }
      if (!found) {
        console.error(`MISSING CUE in ${ch}: "${phrase}"`);
        missed++;
      }
    }
  }
}
console.log(`${total - missed}/${total} AttoWater cues OK`);
if (missed > 0) process.exit(1);
