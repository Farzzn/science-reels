// Generates the voiceover for "How a Single Particle From Outer Space Teleported Mario" (public/cosmic).
//  1. Gemini TTS per chapter (uses primary + fallback API keys automatically)
//  2. Trims leading/trailing silence & normalises loudness to -16 LUFS
//  3. Concatenates with 0.85s chapter gaps -> public/cosmic/voiceover.wav
//  4. Writes public/cosmic/timings.json
//  5. Runs whisper.cpp and aligns to exact script tokens -> public/cosmic/words.json & captions.srt
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { transcribe, toCaptions } from '@remotion/install-whisper-cpp';
import { WHISPER_MODEL, WHISPER_PATH, WHISPER_VERSION } from '../whisper-config.mjs';

const ROOT = path.join(process.cwd(), 'public', 'cosmic');
const RAW = path.join(ROOT, 'chapters-raw');
const CLEAN = path.join(ROOT, 'chapters');
fs.mkdirSync(RAW, { recursive: true });
fs.mkdirSync(CLEAN, { recursive: true });

const script = JSON.parse(fs.readFileSync(path.join(ROOT, 'script.json'), 'utf8'));
const force = process.argv.includes('--force') ? process.argv[process.argv.indexOf('--force') + 1] : null;
const noTts = process.argv.includes('--no-tts');
const GAP = 0.85;

const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

for (const ch of script.chapters) {
  if (noTts) break;
  const raw = path.join(RAW, `${ch.id}.wav`);
  if (fs.existsSync(raw) && force !== ch.id) { console.log(`skip TTS ${ch.id}`); continue; }
  const txt = path.join(RAW, `${ch.id}.txt`);
  fs.writeFileSync(txt, ch.text);
  console.log(`TTS ${ch.id} ...`);
  execFileSync('node', ['scripts/tts.mjs', txt, raw, script.voice, script.style], { stdio: 'inherit' });
}

const availChapters = script.chapters.filter((ch) => fs.existsSync(path.join(RAW, `${ch.id}.wav`)));
for (const ch of availChapters) {
  const raw = path.join(RAW, `${ch.id}.wav`);
  const out = path.join(CLEAN, `${ch.id}.wav`);
  const trim = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.15,areverse';
  ff(['-i', raw, '-af', `${trim},loudnorm=I=-16:TP=-1.5:LRA=11`, '-ar', '48000', '-ac', '1', out]);
}

const silence = path.join(CLEAN, 'gap.wav');
ff(['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', String(GAP), silence]);
const lead = path.join(CLEAN, 'lead.wav');
ff(['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', '0.4', lead]);

const list = [lead];
const timings = [];
let t = dur(lead);
availChapters.forEach((ch, i) => {
  const f = path.join(CLEAN, `${ch.id}.wav`);
  const d = dur(f);
  timings.push({ id: ch.id, title: ch.title, start: +t.toFixed(3), end: +(t + d).toFixed(3) });
  list.push(f);
  t += d;
  if (i < availChapters.length - 1) { list.push(silence); t += GAP; }
});
const tail = path.join(CLEAN, 'tail.wav');
ff(['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', '1.4', tail]);
list.push(tail); t += 1.4;

const listFile = path.join(CLEAN, 'concat.txt');
fs.writeFileSync(listFile, list.map((f) => `file '${f.replace(/\\/g, '/')}'`).join('\n'));
const voiceoverWav = path.join(ROOT, 'voiceover.wav');
ff(['-f', 'concat', '-safe', '0', '-i', listFile, '-c:a', 'pcm_s16le', voiceoverWav]);

const total = dur(voiceoverWav);
const timingsObj = { total: +total.toFixed(3), chapters: timings };
fs.writeFileSync(path.join(ROOT, 'timings.json'), JSON.stringify(timingsObj, null, 2));
console.log(`voiceover.wav ${total.toFixed(1)}s`);
console.table(timings);

// ---- Whisper Alignment ----
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']/g, '');
const whisperJson = path.join(ROOT, 'whisper-raw.json');
let wwords;
if (fs.existsSync(whisperJson) && !process.argv.includes('--retranscribe') && noTts) {
  wwords = JSON.parse(fs.readFileSync(whisperJson, 'utf8'));
} else {
  fs.mkdirSync('temp', { recursive: true });
  const wav16 = path.resolve('temp', 'cosmic-16k.wav');
  ff(['-i', voiceoverWav, '-ar', '16000', '-ac', '1', wav16]);
  const out = await transcribe({
    inputPath: wav16, model: WHISPER_MODEL, whisperPath: WHISPER_PATH, whisperCppVersion: WHISPER_VERSION,
    tokenLevelTimestamps: true, printOutput: false, language: 'en',
  });
  const { captions } = toCaptions({ whisperCppOutput: out });
  wwords = captions.map((c) => ({ t: c.text.trim(), s: c.startMs / 1000, e: c.endMs / 1000 })).filter((w) => norm(w.t));
  fs.writeFileSync(whisperJson, JSON.stringify(wwords));
}

const sw = [];
for (const ch of availChapters) {
  for (const raw of ch.text.split(/\s+/).filter(Boolean)) {
    const parts = raw.split(/[-–—]/).filter((p) => norm(p));
    parts.forEach((p, i) => sw.push({ w: i === parts.length - 1 ? raw : '', key: norm(p), ch: ch.id, display: raw, first: i === 0 }));
  }
}
const wk = wwords.map((w) => norm(w.t));

const n = sw.length, m = wk.length;
const GAP_S = -1, MATCH = 3, MIS = -1;
const score = new Int32Array((n + 1) * (m + 1));
const dir = new Uint8Array((n + 1) * (m + 1));
const idx = (i, j) => i * (m + 1) + j;
for (let i = 1; i <= n; i++) { score[idx(i, 0)] = i * GAP_S; dir[idx(i, 0)] = 2; }
for (let j = 1; j <= m; j++) { score[idx(0, j)] = j * GAP_S; dir[idx(0, j)] = 3; }
const sim = (a, b) => (a === b ? MATCH : (a.length > 3 && b.length > 3 && (a.startsWith(b) || b.startsWith(a))) ? 1 : MIS);
for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= m; j++) {
    const d = score[idx(i - 1, j - 1)] + sim(sw[i - 1].key, wk[j - 1]);
    const u = score[idx(i - 1, j)] + GAP_S;
    const l = score[idx(i, j - 1)] + GAP_S;
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

const chRange = Object.fromEntries(timings.map((c) => [c.id, c]));
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
for (let i = 0; i < n; i++) {
  const r = chRange[sw[i].ch];
  times[i].s = Math.min(Math.max(times[i].s, r.start), r.end);
  times[i].e = Math.min(Math.max(times[i].e, times[i].s), r.end);
}

const words = [];
for (let i = 0; i < n; i++) {
  if (sw[i].first) words.push({ w: sw[i].display, k: norm(sw[i].display.replace(/[-–—]/g, ' ')), ch: sw[i].ch, s: +times[i].s.toFixed(3), e: +times[i].e.toFixed(3) });
  else words[words.length - 1].e = +times[i].e.toFixed(3);
}
fs.writeFileSync(path.join(ROOT, 'words.json'), JSON.stringify(words));
console.log(`Aligned ${matched}/${n} tokens (${((matched / n) * 100).toFixed(1)}%), whisper words ${m}`);

const fmt = (t) => { const ms = Math.round(t * 1000); const h = Math.floor(ms / 3600000), mi = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
const cues = []; let cur = [];
words.forEach((w, i) => {
  cur.push(w);
  const end = /[.?!]"?$/.test(w.w) || cur.length >= 8 || (i + 1 < words.length && words[i + 1].ch !== w.ch);
  if (end) { cues.push(cur); cur = []; }
});
if (cur.length) cues.push(cur);
fs.writeFileSync(path.join(ROOT, 'captions.srt'), cues.map((c, i) => `${i + 1}\n${fmt(c[0].s)} --> ${fmt(c[c.length - 1].e + 0.15)}\n${c.map((w) => w.w).join(' ')}\n`).join('\n'));
console.log(`captions.srt: ${cues.length} cues`);
