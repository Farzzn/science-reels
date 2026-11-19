// Gemini TTS helper. Usage:
//   node scripts/tts.mjs <textFile> <outWav> [voice] [style]
// Reads GEMINI_API_KEY from the environment (user env var).
import fs from 'node:fs';

const [, , textFile, outWav, voice = 'Charon', style = 'calm, curious documentary narrator, clear and engaging, natural pacing'] = process.argv;
const keys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_FALLBACK].filter(Boolean);
if (!keys.length) { console.error('GEMINI_API_KEY not set'); process.exit(3); }
if (!textFile || !outWav) { console.error('usage: node scripts/tts.mjs <textFile> <outWav> [voice] [style]'); process.exit(2); }

const text = fs.readFileSync(textFile, 'utf8').trim();
const body = {
  model: 'gemini-3.8-flash-tts',
  input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style }] }] }],
  response_format: { type: 'audio' },
  generation_config: { speech_config: [{ voice }] },
};

let keyIdx = 0;
for (let attempt = 1; attempt <= 5; attempt++) {
  const key = keys[keyIdx];
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (res.ok) {
    const audio = (json.steps || []).filter(s => s.type === 'model_output')
      .flatMap(s => s.content || []).filter(c => c.type === 'audio').pop();
    if (!audio) { console.error('No audio in response', JSON.stringify(json).slice(0, 500)); process.exit(1); }
    fs.writeFileSync(outWav, Buffer.from(audio.data, 'base64'));
    console.log(outWav);
    process.exit(0);
  }
  console.error(`HTTP ${res.status} (attempt ${attempt}, key #${keyIdx + 1}):`, JSON.stringify(json).slice(0, 400));
  if (res.status === 429 && keyIdx + 1 < keys.length) {
    keyIdx++;
    console.log(`Switching to fallback API key #${keyIdx + 1}...`);
    continue;
  }
  if (res.status !== 429 && res.status < 500) process.exit(1);
  if (res.status === 429 && /per day/i.test(JSON.stringify(json))) process.exit(4); // daily quota: don't hammer
  await new Promise(r => setTimeout(r, attempt * 15000));
}
process.exit(1);
