// Transcribes public/casimir/short-voiceover.wav with whisper.cpp and aligns
// the result to public/casimir/short-script.txt -> public/casimir/short-words.json
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { transcribe, toCaptions } from '@remotion/install-whisper-cpp';
import { WHISPER_MODEL, WHISPER_PATH, WHISPER_VERSION } from '../whisper-config.mjs';

const ROOT = path.join(process.cwd(), 'public', 'casimir');
const scriptText = fs.readFileSync(path.join(ROOT, 'short-script.txt'), 'utf8').trim();
const wavPath = path.join(ROOT, 'short-voiceover.wav');
const totalDur = parseFloat(
  execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wavPath]).toString()
);

const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']/g, '');

fs.mkdirSync('temp', { recursive: true });
const wav16 = path.resolve('temp', 'short-casimir-16k.wav');
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', wavPath, '-ar', '16000', '-ac', '1', wav16]);

const out = await transcribe({
  inputPath: wav16,
  model: WHISPER_MODEL,
  whisperPath: WHISPER_PATH,
  whisperCppVersion: WHISPER_VERSION,
  tokenLevelTimestamps: true,
  printOutput: false,
  language: 'en',
});
const { captions } = toCaptions({ whisperCppOutput: out });
const wwords = captions.map((c) => ({ t: c.text.trim(), s: c.startMs / 1000, e: c.endMs / 1000 })).filter((w) => norm(w.t));

const sw = [];
for (const raw of scriptText.split(/\s+/).filter(Boolean)) {
  const parts = raw.split(/[-–—]/).filter((p) => norm(p));
  parts.forEach((p, i) => sw.push({ w: i === parts.length - 1 ? raw : '', key: norm(p), display: raw, first: i === 0 }));
}
const wk = wwords.map((w) => norm(w.t));

const n = sw.length, m = wk.length;
const GAP = -1, MATCH = 3, MIS = -1;
const score = new Int32Array((n + 1) * (m + 1));
const dir = new Uint8Array((n + 1) * (m + 1));
const idx = (i, j) => i * (m + 1) + j;
for (let i = 1; i <= n; i++) { score[idx(i, 0)] = i * GAP; dir[idx(i, 0)] = 2; }
for (let j = 1; j <= m; j++) { score[idx(0, j)] = j * GAP; dir[idx(0, j)] = 3; }
const sim = (a, b) => (a === b ? MATCH : (a.length > 3 && b.length > 3 && (a.startsWith(b) || b.startsWith(a))) ? 1 : MIS);
for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= m; j++) {
    const d = score[idx(i - 1, j - 1)] + sim(sw[i - 1].key, wk[j - 1]);
    const u = score[idx(i - 1, j)] + GAP;
    const l = score[idx(i, j - 1)] + GAP;
    if (d >= u && d >= l) { score[idx(i, j)] = d; dir[idx(i, j)] = 1; }
    else if (u >= l) { score[idx(i, j)] = u; dir[idx(i, j)] = 2; }
    else { score[idx(i, j)] = l; dir[idx(i, j)] = 3; }
  }
}
const map = new Array(n).fill(-1);
for (let i = n, j = m; i > 0 || j > 0;) {
  const d = dir[idx(i, j)];
  if (d === 1) { if (sim(sw[i - 1].key, wk[j - 1]) > 0) map[i - 1] = j - 1; i--; j--; }
  else if (d === 2) i--; else j--;
}

const times = sw.map((t, i) => (map[i] >= 0 ? { s: wwords[map[i]].s, e: wwords[map[i]].e } : null));
let matched = 0;
for (let i = 0; i < n; i++) {
  if (times[i]) { matched++; continue; }
  let a = i - 1; while (a >= 0 && !times[a]) a--;
  let b = i + 1; while (b < n && !times[b]) b++;
  const ta = a >= 0 ? times[a].e : 0;
  const tb = b < n ? times[b].s : totalDur;
  const k = (i - a) / (b - a);
  const s = ta + (tb - ta) * k;
  times[i] = { s, e: Math.min(tb, s + 0.22) };
}

const words = [];
for (let i = 0; i < n; i++) {
  if (sw[i].first) words.push({ w: sw[i].display, k: norm(sw[i].display.replace(/[-–—]/g, ' ')), s: +times[i].s.toFixed(3), e: +times[i].e.toFixed(3) });
  else words[words.length - 1].e = +times[i].e.toFixed(3);
}
fs.writeFileSync(path.join(ROOT, 'short-words.json'), JSON.stringify({ duration: +totalDur.toFixed(3), words }, null, 2));
console.log(`Casimir Short aligned ${matched}/${n} tokens (${((matched / n) * 100).toFixed(1)}%), total duration: ${totalDur.toFixed(2)}s`);
let prev = '.';
for (const x of words) {
  if (/[.?!:"]$/.test(prev)) console.log(`${x.s.toFixed(1)}s ${x.w}`);
  prev = x.w;
}
