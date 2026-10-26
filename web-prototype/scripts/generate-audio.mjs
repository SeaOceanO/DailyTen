// Generates natural-voice mp3 files for the latest edition with the OpenAI speech API.
// Output goes to web-prototype/audio/ and is deployed with the site but never committed to git
// (the workflow only commits web-prototype/data). The page reads audio/manifest.json and falls
// back to the browser's system voice for any story without a file.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dataDir = process.env.DAILYTEN_DATA_DIR || path.join(rootDir, 'data');
const audioDir = process.env.DAILYTEN_AUDIO_DIR || path.join(rootDir, 'audio');
const apiBase = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const channels = [
  { key: 'daily', file: 'today.json' },
  { key: 'ai', file: 'ai-today.json' },
];

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts';
const voice = process.env.OPENAI_TTS_VOICE || 'alloy';
const instructions = 'Speak in natural, warm, clear Mandarin Chinese, like a calm news presenter. Read English names naturally.';

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

async function main() {
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY; skipping audio generation.');

  await fs.rm(audioDir, { recursive: true, force: true });
  const manifest = { generatedAt: new Date().toISOString(), model, voice, files: {} };
  let made = 0;
  let failed = 0;

  for (const channel of channels) {
    const edition = await readEdition(path.join(dataDir, channel.file));
    if (!edition) continue;
    const dir = path.join(audioDir, edition.dateKey, channel.key);
    await fs.mkdir(dir, { recursive: true });
    const entries = {};
    manifest.files[edition.dateKey] ??= {};
    manifest.files[edition.dateKey][channel.key] = entries;

    for (const [index, item] of edition.items.entries()) {
      const fileName = `${String(index + 1).padStart(2, '0')}.mp3`;
      try {
        const audio = await speak(storyText(item, index));
        await fs.writeFile(path.join(dir, fileName), audio);
        entries[item.id] = `./audio/${edition.dateKey}/${channel.key}/${fileName}`;
        made += 1;
      } catch (error) {
        failed += 1;
        console.error(`Audio for ${channel.key} #${index + 1} failed: ${error.message}`);
      }
    }
  }

  await fs.mkdir(audioDir, { recursive: true });
  await fs.writeFile(path.join(audioDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Generated ${made} audio files (${failed} failed) with ${model}/${voice}.`);
}

async function readEdition(filePath) {
  try {
    const edition = JSON.parse(await fs.readFile(filePath, 'utf8'));
    return edition && Array.isArray(edition.items) && edition.dateKey ? edition : null;
  } catch {
    return null;
  }
}

function sentence(value) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return /[。！？.!?]$/.test(text) ? text : `${text}。`;
}

function storyText(item, index) {
  return [`热点${index + 1}。`, sentence(item.title), sentence(item.take || item.brief)].filter(Boolean).join(' ');
}

async function speak(input, attempt = 0) {
  const body = { model, voice, input, response_format: 'mp3' };
  if (model.startsWith('gpt-4o')) body.instructions = instructions;
  try {
    const response = await fetch(`${apiBase}/audio/speech`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`OpenAI speech API returned ${response.status}: ${(await response.text()).slice(0, 200)}`);
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    if (attempt < 1) return speak(input, attempt + 1);
    throw error;
  }
}
