// A deploy triggered by a code push would replace the site and drop the natural-voice audio that the
// daily run generated (audio is not committed). This copies the audio from the currently live site
// into web-prototype/audio so the new deploy keeps it. Any failure just means "no audio carried over".
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.resolve(__dirname, '..', 'audio');
const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
const baseUrl = process.env.SITE_URL || (owner && repo ? `https://${owner.toLowerCase()}.github.io/${repo}/` : '');

main().catch((error) => console.log(`No audio carried over: ${error.message}`));

async function main() {
  if (!baseUrl) throw new Error('unknown site URL');
  const response = await fetch(new URL('audio/manifest.json', baseUrl));
  if (!response.ok) throw new Error(`manifest returned ${response.status}`);
  const manifest = await response.json();
  let copied = 0;

  for (const channels of Object.values(manifest.files ?? {})) {
    for (const entries of Object.values(channels)) {
      for (const relative of Object.values(entries)) {
        const target = path.join(audioDir, relative.replace(/^\.\/audio\//, ''));
        if (!target.startsWith(audioDir + path.sep)) continue;
        const file = await fetch(new URL(relative.replace(/^\.\//, ''), baseUrl));
        if (!file.ok) continue;
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, Buffer.from(await file.arrayBuffer()));
        copied += 1;
      }
    }
  }

  await fs.mkdir(audioDir, { recursive: true });
  await fs.writeFile(path.join(audioDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Carried over ${copied} audio files.`);
}
