// Chunked renderer for FiveHundredMileEmail.
// Bundles ONCE without copying the 880MB public/ folder (copies only public/email500 + theboldfont.ttf),
// renders 10 chunks of ~2000 frames each with browser restart between chunks so Chromium never runs out of memory,
// and stitches them losslessly with ffmpeg into out/FiveHundredMileEmail.mp4.
// Resumable: skips any chunk MP4 that already exists.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

const isColabDrive = fs.existsSync('/content/drive/MyDrive');
// On Colab (80GB+ RAM), default CHUNK_SIZE=0 renders in a single pass so there are zero AAC audio boundary glitches
const CHUNK_SIZE = Number(process.env.CHUNK_SIZE ?? (isColabDrive ? 0 : 2000));
const defaultOutRoot = isColabDrive ? '/content/drive/MyDrive/email500-output' : 'out';
const outRoot = path.resolve(process.env.OUT_DIR || defaultOutRoot);
const CONCURRENCY = Number(process.env.CONCURRENCY || (isColabDrive ? 10 : 2));
const testMode = process.argv.includes('--test') || process.env.TEST_SLICE === '1';
const isShort = process.argv.includes('--short') || process.env.COMP_ID === 'FiveHundredMileShort';
const COMP_ID = process.env.COMP_ID || (isShort ? 'FiveHundredMileShort' : 'FiveHundredMileEmail');

const chunksDir = path.join(outRoot, `email500/chunks-${COMP_ID}`);
const minPublic = path.resolve('temp/public-email500');
fs.mkdirSync(chunksDir, { recursive: true });
fs.mkdirSync(path.join(minPublic, 'email500'), { recursive: true });
console.log(`Composition: ${COMP_ID} | Output root: ${outRoot} | Concurrency: ${CONCURRENCY} | Chunk size: ${CHUNK_SIZE || 'SINGLE-PASS (no chunks)'}`);

// Copy only the assets needed by FiveHundredMileEmail & FiveHundredMileShort (~65 MB instead of 880 MB)
const copyIfNewer = (src, dst) => {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dst) || fs.statSync(src).size !== fs.statSync(dst).size) {
    fs.copyFileSync(src, dst);
  }
};
copyIfNewer('public/theboldfont.ttf', path.join(minPublic, 'theboldfont.ttf'));
copyIfNewer('public/email500/voiceover.wav', path.join(minPublic, 'email500/voiceover.wav'));
copyIfNewer('public/email500/short-voiceover.wav', path.join(minPublic, 'email500/short-voiceover.wav'));
copyIfNewer('public/email500/yt-video-card.png', path.join(minPublic, 'email500/yt-video-card.png'));

console.log('Bundling project once (slim public dir)...');
const serveUrl = await bundle({
  entryPoint: path.resolve('src/index.ts'),
  publicDir: minPublic,
});

const composition = await selectComposition({ serveUrl, id: COMP_ID });
const total = composition.durationInFrames;
console.log(`Total frames: ${total} (${(total / 30).toFixed(1)}s)`);

if (testMode) {
  const testEnd = Math.min(total - 1, 150);
  const testOut = path.join(outRoot, `${COMP_ID}-test-0-${testEnd}.mp4`);
  console.log(`[TEST] Rendering frames 0..${testEnd} -> ${testOut}`);
  const t0 = Date.now();
  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    outputLocation: testOut,
    frameRange: [0, testEnd],
    concurrency: CONCURRENCY,
    timeoutInMilliseconds: 90000,
    offthreadVideoCacheSizeInBytes: 64 * 1024 * 1024,
  });
  console.log(`[TEST] Done in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${testOut}`);
  process.exit(0);
}

const finalOut = path.join(outRoot, `${COMP_ID}.mp4`);

if (!CHUNK_SIZE || CHUNK_SIZE >= total) {
  console.log(`[SINGLE-PASS] Rendering all ${total} frames directly -> ${finalOut}`);
  const t0 = Date.now();
  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    outputLocation: finalOut,
    concurrency: CONCURRENCY,
    timeoutInMilliseconds: 120000,
    offthreadVideoCacheSizeInBytes: 256 * 1024 * 1024,
  });
  console.log(`FINAL VIDEO READY: ${finalOut} (${(fs.statSync(finalOut).size / (1024 * 1024)).toFixed(1)} MB) in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  process.exit(0);
}

const chunkFiles = [];
for (let start = 0, idx = 0; start < total; start += CHUNK_SIZE, idx++) {
  const end = Math.min(total - 1, start + CHUNK_SIZE - 1);
  const outChunk = path.join(chunksDir, `chunk-${String(idx).padStart(2, '0')}-${start}-${end}.mp4`);
  chunkFiles.push(outChunk);

  if (fs.existsSync(outChunk) && fs.statSync(outChunk).size > 50000) {
    console.log(`[Chunk ${idx}] Exists (${start}..${end}), skipping.`);
    continue;
  }

  console.log(`[Chunk ${idx}] Rendering frames ${start}..${end}...`);
  const t0 = Date.now();
  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    outputLocation: outChunk,
    frameRange: [start, end],
    concurrency: CONCURRENCY,
    timeoutInMilliseconds: 90000,
    offthreadVideoCacheSizeInBytes: 64 * 1024 * 1024,
  });
  console.log(`[Chunk ${idx}] Done in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${path.basename(outChunk)}`);
}

const concatTxt = path.join(chunksDir, 'concat.txt');
fs.writeFileSync(concatTxt, chunkFiles.map((f) => `file '${f.replace(/\\/g, '/')}'`).join('\n'));
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', concatTxt, '-c', 'copy', finalOut], { stdio: 'inherit' });
console.log(`FINAL VIDEO READY: ${finalOut} (${(fs.statSync(finalOut).size / (1024 * 1024)).toFixed(1)} MB)`);
