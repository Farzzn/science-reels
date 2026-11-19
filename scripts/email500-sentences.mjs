// Prints sentence start times. Usage: node scripts/email500-sentences.mjs ch0 ch1
import fs from 'node:fs';
const w = JSON.parse(fs.readFileSync('public/email500/words.json', 'utf8'));
const chs = new Set(process.argv.slice(2));
let prev = '.';
for (const x of w) {
  if (chs.size && !chs.has(x.ch)) { prev = x.w; continue; }
  if (/[.?!:"]$/.test(prev)) console.log(`${x.ch} ${x.s.toFixed(1)} ${x.w}`);
  prev = x.w;
}
