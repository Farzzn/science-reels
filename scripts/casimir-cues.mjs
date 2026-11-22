// Validates every cue("...") phrase in src/CasimirEffect/scenes*.tsx against public/casimir/words.json
import fs from 'node:fs';
import path from 'node:path';

const words = JSON.parse(fs.readFileSync('public/casimir/words.json', 'utf8'));
const timings = JSON.parse(fs.readFileSync('public/casimir/timings.json', 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']/g, '');
const dir = 'src/CasimirEffect';
let bad = 0, total = 0;

for (const f of fs.readdirSync(dir).filter((f) => f.startsWith('scenes'))) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const re = /makeCasimirCue\("(ch\d)"\)|cue(?:\.end)?\("((?:[^"\\]|\\.)*)"/g;
  let ch = null, m;
  while ((m = re.exec(src))) {
    if (m[1]) { ch = m[1]; continue; }
    const phrase = m[2].replace(/\\"/g, '"');
    const list = words.filter((w) => w.ch === ch);
    if (!list.length) continue;
    total++;
    const target = norm(phrase);
    let ok = false, t = -1;
    for (let i = 0; i < list.length && !ok; i++) {
      let acc = '';
      for (let j = i; j < list.length && acc.length < target.length; j++) {
        acc += norm(list[j].w);
        if (acc === target) { ok = true; t = list[i].s; break; }
        if (!target.startsWith(acc)) break;
      }
    }
    const chStart = timings.chapters.find((c) => c.id === ch).start;
    if (!ok) { bad++; console.log(`MISSING ${f} ${ch}: "${phrase}"`); }
    else if (process.argv.includes('--verbose')) {
      console.log(`${ch} +${(t - chStart).toFixed(1)}s (abs ${t.toFixed(1)}s): "${phrase}"`);
    }
  }
}
console.log(`${total - bad}/${total} Casimir cues OK`);
