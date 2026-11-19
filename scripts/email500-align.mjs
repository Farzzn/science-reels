// Transcribes public/email500/voiceover.wav with whisper.cpp and aligns the
// result to the exact script words -> public/email500/words.json
// Also writes public/email500/captions.srt (script text, whisper timing).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { transcribe, toCaptions } from '@remotion/install-whisper-cpp';
import { WHISPER_MODEL, WHISPER_PATH, WHISPER_VERSION } from '../whisper-config.mjs';

const ROOT = path.join(process.cwd(), 'public', 'email500');
const script = JSON.parse(fs.readFileSync(path.join(ROOT, 'script.json'), 'utf8'));
const timings = JSON.parse(fs.readFileSync(path.join(ROOT, 'timings.json'), 'utf8'));
const have = new Set(timings.chapters.map((c) => c.id));
script.chapters = script.chapters.filter((c) => have.has(c.id)); // partial builds

const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']/g, '');

// ---- 1. whisper (cached) ----
const whisperJson = path.join(ROOT, 'whisper-raw.json');
let wwords;
if (fs.existsSync(whisperJson) && !process.argv.includes('--retranscribe')) {
  wwords = JSON.parse(fs.readFileSync(whisperJson, 'utf8'));
} else {
  fs.mkdirSync('temp', { recursive: true });
  const wav16 = path.resolve('temp', 'email500-16k.wav');
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', path.join(ROOT, 'voiceover.wav'), '-ar', '16000', '-ac', '1', wav16]);
  const out = await transcribe({
    inputPath: wav16, model: WHISPER_MODEL, whisperPath: WHISPER_PATH, whisperCppVersion: WHISPER_VERSION,
    tokenLevelTimestamps: true, printOutput: false, language: 'en',
  });
  const { captions } = toCaptions({ whisperCppOutput: out });
  wwords = captions.map(c => ({ t: c.text.trim(), s: c.startMs / 1000, e: c.endMs / 1000 })).filter(w => norm(w.t));
  fs.writeFileSync(whisperJson, JSON.stringify(wwords));
}

// ---- 2. script tokens ----
const sw = [];
for (const ch of script.chapters) {
  for (const raw of ch.text.split(/\s+/).filter(Boolean)) {
    // split hyphenated words for matching ("nineteen-nineties") but keep display
    const parts = raw.split(/[-–—]/).filter(p => norm(p));
    parts.forEach((p, i) => sw.push({ w: i === parts.length - 1 ? raw : '', key: norm(p), ch: ch.id, display: raw, first: i === 0 }));
  }
}
const wk = wwords.map(w => norm(w.t));

// ---- 3. global alignment (Needleman-Wunsch) ----
const n = sw.length, m = wk.length;
const GAP = -1, MATCH = 3, MIS = -1;
const score = new Int32Array((n + 1) * (m + 1));
const dir = new Uint8Array((n + 1) * (m + 1)); // 1 diag 2 up 3 left
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

// ---- 4. times, interpolating unmatched words within their chapter ----
const chRange = Object.fromEntries(timings.chapters.map(c => [c.id, c]));
const times = sw.map((t, i) => (map[i] >= 0 ? { s: wwords[map[i]].s, e: wwords[map[i]].e } : null));
let matched = 0;
for (let i = 0; i < n; i++) {
  if (times[i]) { matched++; continue; }
  let a = i - 1; while (a >= 0 && (!times[a] || sw[a].ch !== sw[i].ch)) a--;
  let b = i + 1; while (b < n && (!times[b] || sw[b].ch !== sw[i].ch)) b++;
  const r = chRange[sw[i].ch];
  const ta = a >= 0 && sw[a].ch === sw[i].ch ? times[a].e : r.start;
  const tb = b < n && sw[b].ch === sw[i].ch ? times[b].s : r.end;
  const k = (i - a) / (b - a);
  const s = ta + (tb - ta) * k;
  times[i] = { s, e: Math.min(tb, s + 0.25) };
}
// clamp to chapter ranges
for (let i = 0; i < n; i++) {
  const r = chRange[sw[i].ch];
  times[i].s = Math.min(Math.max(times[i].s, r.start), r.end);
  times[i].e = Math.min(Math.max(times[i].e, times[i].s), r.end);
}

// merge hyphen parts back into display words
const words = [];
for (let i = 0; i < n; i++) {
  if (sw[i].first) words.push({ w: sw[i].display, k: norm(sw[i].display.replace(/[-–—]/g, ' ')), ch: sw[i].ch, s: +times[i].s.toFixed(3), e: +times[i].e.toFixed(3) });
  else { words[words.length - 1].e = +times[i].e.toFixed(3); }
}
fs.writeFileSync(path.join(ROOT, 'words.json'), JSON.stringify(words));
console.log(`aligned ${matched}/${n} tokens (${((matched / n) * 100).toFixed(1)}%), whisper words ${m}`);

// ---- 5. SRT from script words (~7 words or sentence end per cue) ----
const fmt = (t) => { const ms = Math.round(t * 1000); const h = Math.floor(ms / 3600000), mi = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
const cues = []; let cur = [];
words.forEach((w, i) => {
  cur.push(w);
  const end = /[.?!]"?$/.test(w.w) || cur.length >= 8 || (i + 1 < words.length && words[i + 1].ch !== w.ch);
  if (end) { cues.push(cur); cur = []; }
});
if (cur.length) cues.push(cur);
fs.writeFileSync(path.join(ROOT, 'captions.srt'), cues.map((c, i) => `${i + 1}\n${fmt(c[0].s)} --> ${fmt(c[c.length - 1].e + 0.15)}\n${c.map(w => w.w).join(' ')}\n`).join('\n'));
console.log(`captions.srt: ${cues.length} cues`);
