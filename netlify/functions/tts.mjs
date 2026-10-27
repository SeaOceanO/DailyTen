// Read-aloud voice proxy: GET /.netlify/functions/tts?lang=zh|en&voice=female|male&text=...
// The Google key lives only in the GOOGLE_TTS_API_KEY environment variable of the Netlify site.
const VOICES = { female: 'Aoede', male: 'Charon' };
const LOCALES = { zh: 'cmn-CN', en: 'en-US' };
const MAX_CHARS = 1200;
const ALLOWED_ORIGIN = /^https:\/\/(seaoceano\.github\.io|([a-z0-9-]+--)?ornate-cactus-877d93\.netlify\.app)(\/|$)/;

function cors(origin) {
  return ALLOWED_ORIGIN.test(origin || '') ? { 'Access-Control-Allow-Origin': new URL(origin).origin } : {};
}

// Google rejects requests whose "sentences" are too long, and its sentence detection is unreliable,
// so we cut the text into short pieces ourselves and join the returned MP3 files.
function splitText(text) {
  const sentences = text.split(/(?<=[。！？；])|(?<=[.!?])\s+/).map((part) => part.trim()).filter(Boolean);
  const pieces = [];
  for (const sentence of sentences) {
    if (sentence.length <= 45) {
      pieces.push(sentence);
      continue;
    }
    let current = '';
    for (const clause of sentence.split(/(?<=[，、：,:])/)) {
      if (current && current.length + clause.length > 45) {
        pieces.push(current);
        current = '';
      }
      current += clause;
    }
    if (current) pieces.push(current);
  }
  // Fewer, slightly longer requests: merge neighbours while the piece stays short.
  const merged = [];
  for (const piece of pieces) {
    if (merged.length && merged[merged.length - 1].length + piece.length <= 40) merged[merged.length - 1] += piece;
    else merged.push(piece);
  }
  return merged;
}

async function synthesizePiece(key, locale, voice, text) {
  const body = JSON.stringify({
    input: { text },
    voice: { languageCode: locale, name: `${locale}-Chirp3-HD-${voice}` },
    audioConfig: { audioEncoding: 'MP3' },
  });
  let last;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    last = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (last.ok) return { ok: true, status: 200, audio: Uint8Array.from(atob((await last.json()).audioContent), (char) => char.charCodeAt(0)) };
  }
  return { ok: false, status: last.status, error: (await last.text()).slice(0, 400) };
}

async function synthesize(key, locale, voice, text) {
  const results = await Promise.all(splitText(text).map((piece) => synthesizePiece(key, locale, voice, piece)));
  const failed = results.find((result) => !result.ok);
  if (failed) return failed;
  const audio = new Uint8Array(results.reduce((total, result) => total + result.audio.length, 0));
  let offset = 0;
  for (const result of results) {
    audio.set(result.audio, offset);
    offset += result.audio.length;
  }
  return { ok: true, status: 200, audio, pieces: results.length };
}

export default async (request) => {
  // TEMPORARY diagnostics, removed before merge: /tts?check=1 reports whether the key is set and what Google answers.
  if (new URL(request.url).searchParams.get('check') === '1') {
    const key = process.env.GOOGLE_TTS_API_KEY;
    const report = { keyConfigured: Boolean(key), keyLength: key ? key.length : 0 };
    if (key) {
      const probeText = new URL(request.url).searchParams.get('text') || '你好。';
      report.textLength = probeText.length;
      const probe = await synthesize(key, 'cmn-CN', 'Aoede', probeText);
      report.googleStatus = probe.status;
      report.pieces = probe.pieces;
      if (!probe.ok) report.googleError = probe.error;
    }
    return new Response(JSON.stringify(report, null, 2), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  }
  const referer = request.headers.get('origin') || request.headers.get('referer') || '';
  const headers = cors(referer);
  const fail = (status, message) => new Response(message, { status, headers: { ...headers, 'Cache-Control': 'no-store' } });

  // Only our own pages may spend the quota (the Referer can be forged, so the length cap below is the real limit).
  if (!ALLOWED_ORIGIN.test(referer)) return fail(403, 'forbidden');
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) return fail(503, 'voice service not configured');

  const url = new URL(request.url);
  const locale = LOCALES[url.searchParams.get('lang')];
  const voice = VOICES[url.searchParams.get('voice')];
  const text = (url.searchParams.get('text') || '').trim();
  if (!locale || !voice || !text || text.length > MAX_CHARS) return fail(400, 'bad request');

  const upstream = await synthesize(key, locale, voice, text);
  if (!upstream.ok) return fail(502, 'voice service error');
  return new Response(upstream.audio, {
    headers: {
      ...headers,
      'Content-Type': 'audio/mpeg',
      // Same text + voice always gives the same audio, so browsers and Netlify's CDN may keep it.
      'Cache-Control': 'public, max-age=31536000, immutable',
      Vary: 'Origin',
    },
  });
};
