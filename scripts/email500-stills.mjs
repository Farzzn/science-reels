// Renders stills of FiveHundredMileEmail at given seconds (bundles once).
// Usage: node scripts/email500-stills.mjs 3.5 12 40 ...
import path from 'node:path';
import fs from 'node:fs';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const secs = process.argv.slice(2).map(Number);
const outDir = path.resolve('out/email500/stills');
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'FiveHundredMileEmail' });
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * 30));
  const output = path.join(outDir, `t${String(s).replace('.', '_')}.png`);
  await renderStill({ serveUrl, composition, frame, output, scale: 0.5 });
  console.log(output);
}
