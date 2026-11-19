// Builds the narration for "The Email That Couldn't Travel More Than 500 Miles".
//  1. Gemini TTS per chapter (skips chapters that already exist)
//  2. Trim silence + loudness-normalise each chapter
//  3. Concatenate with gaps -> public/email500/voiceover.wav
//  4. Write public/email500/timings.json (chapter start/end in seconds)
// Usage: node scripts/email500-voice.mjs [--force ch3]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.join(process.cwd(), 'public', 'email500');
const RAW = path.join(ROOT, 'chapters-raw');
const CLEAN = path.join(ROOT, 'chapters');
fs.mkdirSync(RAW, { recursive: true });
fs.mkdirSync(CLEAN, { recursive: true });

const script = JSON.parse(fs.readFileSync(path.join(ROOT, 'script.json'), 'utf8'));
const force = process.argv.includes('--force') ? process.argv[process.argv.indexOf('--force') + 1] : null;
const GAP = 0.9; // seconds of silence between chapters

const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

const noTts = process.argv.includes('--no-tts');
for (const ch of script.chapters) {
  if (noTts) break;
  const raw = path.join(RAW, `${ch.id}.wav`);
  if (fs.existsSync(raw) && force !== ch.id) { console.log(`skip TTS ${ch.id}`); continue; }
  const txt = path.join(RAW, `${ch.id}.txt`);
  fs.writeFileSync(txt, ch.text);
  console.log(`TTS ${ch.id} ...`);
  try {
    execFileSync('node', ['scripts/tts.mjs', txt, raw, script.voice, script.style], { stdio: 'inherit' });
  } catch {
    console.error(`TTS failed for ${ch.id}; continuing with available chapters (partial build).`);
    break;
  }
}

// Partial builds: only use chapters whose raw audio exists
script.chapters = script.chapters.filter((ch) => fs.existsSync(path.join(RAW, `${ch.id}.wav`)));

// Clean: trim leading/trailing silence, normalise loudness to -16 LUFS, 48 kHz mono
for (const ch of script.chapters) {
  const raw = path.join(RAW, `${ch.id}.wav`);
  const out = path.join(CLEAN, `${ch.id}.wav`);
  const trim = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.15,areverse';
  ff(['-i', raw, '-af', `${trim},loudnorm=I=-16:TP=-1.5:LRA=11`, '-ar', '48000', '-ac', '1', out]);
}

// Concatenate with gaps and record timings
const silence = path.join(CLEAN, 'gap.wav');
ff(['-f', 'lavfi', '-i', `anullsrc=r=48000:cl=mono`, '-t', String(GAP), silence]);
const lead = path.join(CLEAN, 'lead.wav');
ff(['-f', 'lavfi', '-i', `anullsrc=r=48000:cl=mono`, '-t', '0.4', lead]);

const list = [lead];
const timings = [];
let t = dur(lead);
script.chapters.forEach((ch, i) => {
  const f = path.join(CLEAN, `${ch.id}.wav`);
  const d = dur(f);
  timings.push({ id: ch.id, title: ch.title, start: +t.toFixed(3), end: +(t + d).toFixed(3) });
  list.push(f);
  t += d;
  if (i < script.chapters.length - 1) { list.push(silence); t += GAP; }
});
const tail = path.join(CLEAN, 'tail.wav');
ff(['-f', 'lavfi', '-i', `anullsrc=r=48000:cl=mono`, '-t', '1.5', tail]);
list.push(tail); t += 1.5;

const listFile = path.join(CLEAN, 'concat.txt');
fs.writeFileSync(listFile, list.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n'));
ff(['-f', 'concat', '-safe', '0', '-i', listFile, '-c:a', 'pcm_s16le', path.join(ROOT, 'voiceover.wav')]);

const total = dur(path.join(ROOT, 'voiceover.wav'));
fs.writeFileSync(path.join(ROOT, 'timings.json'), JSON.stringify({ total: +total.toFixed(3), chapters: timings }, null, 2));
console.log(`voiceover.wav ${total.toFixed(1)}s`);
console.table(timings);
