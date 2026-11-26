// Validates every cue("...") phrase in src/CosmicSpeedLimit/scenes*.tsx against public/cosmiclimit/words.json
import fs from 'node:fs';
import path from 'node:path';

const words = JSON.parse(fs.readFileSync(path.resolve('public/cosmiclimit/words.json'), 'utf8'));
const timings = JSON.parse(fs.readFileSync(path.resolve('public/cosmiclimit/timings.json'), 'utf8'));
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']/g, '');

const dir = path.resolve('src/CosmicSpeedLimit');
const files = fs.existsSync(dir)
  ? fs.readdirSync(dir).filter((f) => /^scenes.*\.tsx$/.test(f)).sort().map((f) => path.join(dir, f))
  : [];

if (!files.length) {
  console.error('No scene files found in src/CosmicSpeedLimit/');
  process.exit(1);
}

let total = 0;
let missed = 0;

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const blocks = src.split(/export const CosmicCh/);
  for (let b = 1; b < blocks.length; b++) {
    const chMatch = blocks[b].match(/makeCosmicCue\("([^"]+)"\)/);
    if (!chMatch) continue;
    const ch = chMatch[1];
    const list = words.filter((w) => w.ch === ch);
    const chInfo = timings.chapters.find((c) => c.id === ch);
    const chStart = chInfo ? chInfo.start : 0;
    for (const m of blocks[b].matchAll(/\bcue(?:\.end)?\("((?:[^"\\]|\\.)*)"/g)) {
      total++;
      const phrase = m[1].replace(/\\"/g, '"');
      const target = norm(phrase);
      let found = false;
      let t = -1;
      for (let i = 0; i < list.length && !found; i++) {
        let acc = '';
        for (let j = i; j < list.length && acc.length < target.length; j++) {
          acc += norm(list[j].w);
          if (acc === target) { found = true; t = list[i].s; break; }
          if (!target.startsWith(acc)) break;
        }
      }
      if (!found) {
        console.error(`MISSING CUE in ${path.basename(f)} ${ch}: "${phrase}"`);
        missed++;
      } else if (process.argv.includes('--verbose')) {
        console.log(`${ch} +${(t - chStart).toFixed(1)}s (abs ${t.toFixed(1)}s): "${phrase}"`);
      }
    }
  }
}

console.log(`${total - missed}/${total} CosmicSpeedLimit cues OK`);
if (missed > 0) process.exit(1);
