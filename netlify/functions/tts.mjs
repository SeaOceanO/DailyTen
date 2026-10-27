// Read-aloud voice proxy: GET /.netlify/functions/tts?lang=zh|en&voice=female|male&text=...
// The Google key lives only in the GOOGLE_TTS_API_KEY environment variable of the Netlify site.
const VOICES = { female: 'Aoede', male: 'Charon' };
const LOCALES = { zh: 'cmn-CN', en: 'en-US' };
const MAX_CHARS = 1200;
const ALLOWED_ORIGIN = /^https:\/\/(seaoceano\.github\.io|([a-z0-9-]+--)?ornate-cactus-877d93\.netlify\.app)(\/|$)/;

function cors(origin) {
  return ALLOWED_ORIGIN.test(origin || '') ? { 'Access-Control-Allow-Origin': new URL(origin).origin } : {};
}

async function synthesize(key, locale, voice, text) {
  const body = JSON.stringify({
    input: { text },
    voice: { languageCode: locale, name: `${locale}-Chirp3-HD-${voice}` },
    audioConfig: { audioEncoding: 'MP3' },
  });
  let last;
  // Google occasionally rejects a valid request with a transient 400; one retry is enough.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    last = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (last.ok) return last;
  }
  return last;
}

export default async (request) => {
  // TEMPORARY diagnostics, removed before merge: /tts?check=1 reports whether the key is set and what Google answers.
  if (new URL(request.url).searchParams.get('check') === '1') {
    const key = process.env.GOOGLE_TTS_API_KEY;
    const report = { keyConfigured: Boolean(key), keyLength: key ? key.length : 0 };
    if (key) {
      const probe = await synthesize(key, 'cmn-CN', 'Aoede', '你好。');
      report.googleStatus = probe.status;
      if (!probe.ok) report.googleError = (await probe.text()).slice(0, 400);
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
  const { audioContent } = await upstream.json();
  const audio = Uint8Array.from(atob(audioContent), (char) => char.charCodeAt(0));
  return new Response(audio, {
    headers: {
      ...headers,
      'Content-Type': 'audio/mpeg',
      // Same text + voice always gives the same audio, so browsers and Netlify's CDN may keep it.
      'Cache-Control': 'public, max-age=31536000, immutable',
      Vary: 'Origin',
    },
  });
};
