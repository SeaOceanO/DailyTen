import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const schemaPath = path.join(rootDir, 'schema', 'openai-dailyten-edition.schema.json');
const configPath = path.join(rootDir, 'config', 'interests.json');
const dataDir = path.join(rootDir, 'data');
const editionsDir = path.join(dataDir, 'editions');
const aiEditionsDir = path.join(dataDir, 'ai-editions');
const outputPath = path.join(dataDir, 'today.json');
const aiOutputPath = path.join(dataDir, 'ai-today.json');
const editionIndexPath = path.join(editionsDir, 'index.json');
const validateOnly = process.argv.includes('--validate-only');
const testSourcesOnly = process.argv.includes('--test-sources');

const allowedIcons = new Set(['oil', 'chart', 'drone', 'quake', 'ai', 'alert', 'code', 'refinery', 'ship', 'eclipse']);
const allowedVisuals = new Set(['chain', 'bars', 'trend']);
const rssFeeds = [
  { publisher: 'BBC News', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
  { publisher: 'NPR', url: 'https://feeds.npr.org/1001/rss.xml' },
  { publisher: 'The Guardian', url: 'https://www.theguardian.com/world/rss' },
];
const aiRssFeeds = [
  { publisher: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { publisher: 'MIT Technology Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed' },
];

// Future production flow:
// 1. RSS, NewsAPI, GDELT, or curated source feeds provide candidate real news.
// 2. The server-side generator selects the daily ten from those candidates.
// 3. AI produces the fixed DailyTen JSON shape once, before publication.
// 4. The generated JSON is saved and deployed; the browser only reads saved data.
// 5. User-facing rendering never calls the AI API directly.

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

async function main() {
  const [schema, config] = await Promise.all([
    readJson(schemaPath),
    readJson(configPath),
  ]);

  if (validateOnly) {
    const edition = await readJson(outputPath);
    validateEdition(edition);
    const aiEdition = await readOptionalJson(aiOutputPath);
    if (aiEdition) validateEdition(aiEdition);
    const index = await readEditionIndex();
    const archivedEdition = await readArchivedEdition(edition.dateKey);
    if (archivedEdition) {
      validateEdition(archivedEdition);
    }
    const aiStatus = aiEdition ? ` and ${aiEdition.items.length} AI items` : '';
    console.log(`Validated ${edition.items.length} DailyTen items${aiStatus} for ${edition.dateKey}. Saved editions: ${index.editions.length}.`);
    return;
  }

  if (testSourcesOnly) {
    const candidates = await fetchNewsCandidates(config);
    console.log(`Fetched ${candidates.daily.length} general and ${candidates.ai.length} AI candidate articles.`);
    console.log(candidates.ai.slice(0, 5).map((candidate) => `- ${candidate.title} (${candidate.domain})`).join('\n'));
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  const reasoningEffort = process.env.OPENAI_REASONING_EFFORT ?? 'medium';

  if (!apiKey || !model) {
    throw new Error('Missing OPENAI_API_KEY or OPENAI_MODEL. Set them before running daily generation.');
  }

  const candidatePools = await fetchNewsCandidates(config);
  const edition = await generateEdition({ apiKey, model, reasoningEffort, schema, config, candidates: candidatePools.daily, channel: 'daily' });
  const aiEdition = await generateEdition({ apiKey, model, reasoningEffort, schema, config, candidates: candidatePools.ai, channel: 'ai' });
  normalizeEdition(edition, 'daily');
  normalizeEdition(aiEdition, 'ai');
  await enrichEditionEventImages(edition);
  await enrichEditionEventImages(aiEdition);
  validateEdition(edition);
  validateEdition(aiEdition);
  await writeEditionOutputs(edition, aiEdition);
  console.log(`Wrote and archived ${edition.items.length} DailyTen items plus ${aiEdition.items.length} AI items for ${edition.dateKey}.`);
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function readOptionalJson(filePath) {
  try {
    return await readJson(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function writeEditionOutputs(edition, aiEdition) {
  await Promise.all([
    fs.mkdir(editionsDir, { recursive: true }),
    fs.mkdir(aiEditionsDir, { recursive: true }),
  ]);
  const payload = `${JSON.stringify(edition, null, 2)}\n`;
  const aiPayload = `${JSON.stringify(aiEdition, null, 2)}\n`;
  const archivedPath = path.join(editionsDir, `${edition.dateKey}.json`);
  const aiArchivedPath = path.join(aiEditionsDir, `${aiEdition.dateKey}.json`);
  const index = await readEditionIndex();
  const nextIndex = updateEditionIndex(index, edition, aiEdition);

  await Promise.all([
    fs.writeFile(outputPath, payload, 'utf8'),
    fs.writeFile(aiOutputPath, aiPayload, 'utf8'),
    fs.writeFile(archivedPath, payload, 'utf8'),
    fs.writeFile(aiArchivedPath, aiPayload, 'utf8'),
    fs.writeFile(editionIndexPath, `${JSON.stringify(nextIndex, null, 2)}\n`, 'utf8'),
  ]);
}

async function readEditionIndex() {
  try {
    const index = await readJson(editionIndexPath);
    return normalizeEditionIndex(index);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }

    return {
      latestDateKey: '',
      updatedAt: '',
      editions: [],
    };
  }
}

async function readArchivedEdition(dateKey) {
  try {
    return await readJson(path.join(editionsDir, `${dateKey}.json`));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function normalizeEditionIndex(index) {
  const editions = Array.isArray(index?.editions) ? index.editions : [];
  const seen = new Set();
  return {
    latestDateKey: typeof index?.latestDateKey === 'string' ? index.latestDateKey : '',
    updatedAt: typeof index?.updatedAt === 'string' ? index.updatedAt : '',
    editions: editions
      .filter((entry) => typeof entry?.dateKey === 'string' && !seen.has(entry.dateKey) && seen.add(entry.dateKey))
      .map((entry) => ({
        dateKey: entry.dateKey,
        path: typeof entry.path === 'string' ? entry.path : `./data/editions/${entry.dateKey}.json`,
        aiPath: typeof entry.aiPath === 'string' ? entry.aiPath : '',
        channels: Array.isArray(entry.channels) ? entry.channels : ['daily'],
        generatedAt: typeof entry.generatedAt === 'string' ? entry.generatedAt : '',
      }))
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey)),
  };
}

function updateEditionIndex(index, edition, aiEdition) {
  const current = normalizeEditionIndex(index);
  const entry = {
    dateKey: edition.dateKey,
    path: `./data/editions/${edition.dateKey}.json`,
    aiPath: `./data/ai-editions/${aiEdition.dateKey}.json`,
    channels: ['daily', 'ai'],
    generatedAt: edition.generatedAt,
  };
  const editions = [
    entry,
    ...current.editions.filter((item) => item.dateKey !== edition.dateKey),
  ].sort((a, b) => b.dateKey.localeCompare(a.dateKey));

  return {
    latestDateKey: editions[0]?.dateKey ?? edition.dateKey,
    updatedAt: new Date().toISOString(),
    editions,
  };
}

async function fetchNewsCandidates(config) {
  let dailyCandidates;

  try {
    dailyCandidates = await fetchGdeltCandidates(config.sourceQuery, '48h');
    console.log(`Fetched ${dailyCandidates.length} general candidate articles from GDELT.`);
  } catch (error) {
    console.warn(`${error.message}; falling back to public RSS feeds.`);
    dailyCandidates = await fetchRssCandidates();
    console.log(`Fetched ${dailyCandidates.length} general candidate articles from RSS feeds.`);
  }

  let aiCandidates;
  try {
    await delay(5500);
    aiCandidates = await fetchGdeltCandidates(config.aiSourceQuery || defaultAiSourceQuery, '72h');
    console.log(`Fetched ${aiCandidates.length} focused AI candidate articles from GDELT.`);
  } catch (error) {
    console.warn(`${error.message}; falling back to focused AI RSS feeds.`);
    try {
      aiCandidates = await fetchAiRssCandidates();
      console.log(`Fetched ${aiCandidates.length} focused AI candidate articles from RSS feeds.`);
    } catch (rssError) {
      console.warn(`${rssError.message}; deriving the AI pool from available candidates.`);
      aiCandidates = dailyCandidates.filter(isAiCandidate);
    }
  }

  const rankedAi = rankCandidates(dedupeCandidates(aiCandidates), 'ai');
  const rankedDaily = rankCandidates(
    dedupeCandidates([...dailyCandidates, ...rankedAi.slice(0, 30)]),
    'daily',
  );

  if (rankedAi.length < 10) {
    throw new Error(`Only ${rankedAi.length} focused AI candidates were available; at least 10 are required.`);
  }

  return {
    daily: rankedDaily.slice(0, 120),
    ai: rankedAi.slice(0, 100),
  };
}

const defaultAiSourceQuery = '(OpenAI OR GPT OR Anthropic OR Claude OR Gemini OR "AI model" OR "AI agent" OR MCP OR "model context protocol" OR robotics OR robot OR "embodied AI" OR "humanoid robot" OR "AI chip" OR inference OR "AI data center")';

async function fetchGdeltCandidates(query, timespan) {
  const params = new URLSearchParams({
    query,
    mode: 'ArtList',
    format: 'json',
    maxrecords: '75',
    sort: 'hybridrel',
    timespan,
  });
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?${params}`;

  const response = await fetchWithContext(url, {
    headers: { accept: 'application/json' },
  }, 'GDELT candidate fetch');

  if (!response.ok) {
    throw new Error(`GDELT candidate fetch failed: ${response.status}`);
  }

  const body = await response.text();
  const data = parseJson(body, 'GDELT candidate response');

  if (!Array.isArray(data.articles) || data.articles.length === 0) {
    throw new Error(`GDELT returned no candidate articles. Response preview: ${body.slice(0, 180)}`);
  }

  return (data.articles ?? []).map((article) => ({
    title: article.title,
    url: article.url,
    sourceCountry: article.sourceCountry,
    domain: article.domain,
    seenDate: article.seendate,
    language: article.language,
  }));
}

function dedupeCandidates(candidates) {
  const seen = new Set();
  return candidates.filter((candidate) => {
    const key = `${String(candidate.url || '').toLowerCase()}|${String(candidate.title || '').toLowerCase()}`;
    if (!candidate.title || !candidate.url || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isAiCandidate(candidate) {
  return /\b(ai|artificial intelligence|openai|gpt|anthropic|claude|gemini|agent|mcp|robot|robotics|humanoid|inference|compute|chip|data cent(?:er|re))\b/i.test(candidate.title || '');
}

function rankCandidates(candidates, channel) {
  return candidates
    .map((candidate) => ({
      ...candidate,
      priorityScore: candidatePriority(candidate, channel),
    }))
    .sort((first, second) => second.priorityScore - first.priorityScore);
}

function candidatePriority(candidate, channel) {
  const title = String(candidate.title || '');
  const domain = String(candidate.domain || '');
  let score = 0;

  if (/\b(gpt[- ]?6|astra|openai|anthropic|claude|gemini)\b/i.test(title)) score += 90;
  if (/\b(launch|launched|release|released|introduc|announce|unveil|new model)\b/i.test(title)) score += 45;
  if (/\b(agent|mcp|robot|robotics|humanoid|embodied ai|inference|ai chip|data cent(?:er|re))\b/i.test(title)) score += 28;
  if (/openai\.com|anthropic\.com|deepmind\.google|blog\.google/i.test(domain)) score += 70;
  if (/press release|sponsored|地方|园区|签约|促消费/i.test(title)) score -= 25;
  if (channel === 'ai' && isAiCandidate(candidate)) score += 35;

  const seenAt = Date.parse(candidate.seenDate || '');
  if (Number.isFinite(seenAt)) {
    const hoursOld = Math.max(0, (Date.now() - seenAt) / 3600000);
    score += Math.max(0, 24 - hoursOld) / 4;
  }

  return Math.round(score * 10) / 10;
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchRssCandidates() {
  const batches = await Promise.all(rssFeeds.map(async (feed) => {
    const response = await fetchWithContext(feed.url, {
      headers: { accept: 'application/rss+xml, application/xml, text/xml' },
    }, `${feed.publisher} RSS fetch`);

    if (!response.ok) {
      throw new Error(`${feed.publisher} RSS fetch failed: ${response.status}`);
    }

    const xml = await response.text();
    return parseRssItems(xml, feed);
  }));

  const candidates = batches.flat();

  if (candidates.length < 10) {
    throw new Error(`RSS fallback returned only ${candidates.length} candidate articles.`);
  }

  return candidates.slice(0, 75);
}

async function fetchAiRssCandidates() {
  const batches = await Promise.all(aiRssFeeds.map(async (feed) => {
    const response = await fetchWithContext(feed.url, {
      headers: { accept: 'application/rss+xml, application/xml, text/xml' },
    }, `${feed.publisher} RSS fetch`);

    if (!response.ok) {
      throw new Error(`${feed.publisher} RSS fetch failed: ${response.status}`);
    }

    return parseRssItems(await response.text(), feed);
  }));

  const candidates = dedupeCandidates(batches.flat());
  if (candidates.length < 10) {
    throw new Error(`AI RSS fallback returned only ${candidates.length} candidate articles.`);
  }

  return candidates.slice(0, 100);
}

function parseRssItems(xml, feed) {
  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match) => {
    const itemXml = match[1];
    const title = readXmlTag(itemXml, 'title');
    const url = readXmlTag(itemXml, 'link') || readXmlTag(itemXml, 'guid');
    const publishedAt = readXmlTag(itemXml, 'pubDate') || readXmlTag(itemXml, 'updated');

    return {
      title,
      url,
      sourceCountry: '',
      domain: domainFromUrl(url) || feed.publisher,
      seenDate: publishedAt,
      language: 'English',
      publisher: feed.publisher,
    };
  }).filter((candidate) => candidate.title && candidate.url);
}

function readXmlTag(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? decodeXml(match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()) : '';
}

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'");
}

function domainFromUrl(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

async function generateEdition({ apiKey, model, reasoningEffort, schema, config, candidates, channel }) {
  const channelInstructions = channel === 'ai'
    ? [
      'This is the separate AI Industry edition: all ten items must be substantial AI-industry news.',
      'Cover models, Agents, MCP and other tool protocols, compute, chips, AI products, governance, safety, and real robotics news.',
      'A verified launch of a major frontier model or platform within the last 72 hours is normally a top-three item and must not be displaced by routine funding, local promotion, or generic trend stories.',
      'Include robotics or embodied AI only when a genuinely important real candidate exists; do not force it.',
    ]
    : [
      'This is the broad DailyTen edition covering the reader interests in the preferences.',
      'A globally significant verified AI launch can enter DailyTen, but keep the overall set balanced across major interests.',
    ];

  const response = await fetchWithContext('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      reasoning: {
        effort: reasoningEffort,
      },
      instructions: [
        'You are the editor of DailyTen, a calm personal daily briefing product.',
        'Select exactly ten important real news items from the candidate list.',
        ...channelInstructions,
        'Treat priorityScore as an editorial review signal, not as proof. Verify importance using the title, publisher, timing, and corroboration in the candidate set.',
        'Do not omit a major official model or platform launch in favor of routine corporate promotion, local showcase projects, or generic commentary.',
        'Prefer first-party announcements and stories corroborated by multiple reputable publishers.',
        'Avoid filling several slots with near-duplicate coverage of the same event.',
        'Write in plain Simplified Chinese for a smart general reader who does not read policy or industry jargon every day.',
        'For every item, also write an en object in natural English.',
        'Each item must have a brief field: one plain, compact sentence for the collapsed card.',
        'brief is for scanning; take is for the expanded explanation. The collapsed card must read like one everyday sentence, not an official summary, policy abstract, or industry report sentence.',
        'The English version must be plain and readable, but do not remove useful technical terms such as Agent, MCP, compute, inference, governance, data center, supply chain, or audit when they are central to the story.',
        'Explain technical terms through context instead of deleting them.',
        'Do not sound like a government notice, corporate press release, stock analyst note, or official abstract.',
        'Use everyday explanations: first say what happened, then why it matters, then what could change for ordinary life, work, prices, tools, privacy, safety, or choices.',
        'Keep key numbers, actors, places, dates, and direct consequences; simplify wording without losing important facts.',
        'For frontier model launches, never make the title or brief only say the model is new, latest, stronger, or upgraded. Name the real reader-facing tension: AGI framing, computer-use ability, rollout limits, price, access, safety restrictions, product impact, developer impact, or competitive pressure.',
        'Avoid vague phrases such as 加速落地, 赋能, 释放价值, 稳中向好, 生态完善 unless you immediately explain what that means in concrete terms.',
        'Every item must explain why it matters to a person, not only to markets, governments, or industries.',
        'When using abbreviations or technical terms such as AI, Agent, MCP, ANP, compute, inference, data center, governance, audit, supply chain, or robotics, keep the useful term but explain it through plain surrounding language.',
        'Follow categoryRules exactly. Never label a city, provincial, or local policy story as 全球经济.',
        'Use 全球经济 only for genuinely global, multi-country, or cross-border macroeconomic stories.',
        'Use 中国经济 for China national, provincial, municipal, or local economic policy stories.',
        'Use sourceLinks from the provided candidates. Do not invent URLs.',
        'Return only JSON that matches the provided schema.',
      ].join('\n'),
      input: JSON.stringify({
        dateKey: todayInTimezone(config.timezone),
        channel,
        preferences: config,
        candidates,
        outputNotes: [
          'facts must contain exactly three short label/text pairs.',
          'impacts must contain two or three short label/text pairs.',
          'next may contain zero to two watch points.',
          'title should be clear and concrete, not slogan-like.',
          'For model launches, title must not be a generic stronger-model headline; it must say what changed for users, developers, safety, access, or the AGI debate.',
          'brief should be one everyday sentence that explains why a normal reader should care.',
          'brief should usually be shorter than take and should not repeat the title. It should say the practical point in plain language.',
          'take should be one readable paragraph in everyday language, while preserving the important numbers and consequences.',
          'fact labels should be simple nouns; fact text should explain the point without bureaucratic phrasing.',
          'en must mirror the same important facts as the Chinese item, with natural English rather than literal translation.',
          'visual may be null, chain, bars, or trend.',
          'If visual.type is bars, every bar must be [label, numericPercent, hexColor].',
        ],
      }),
      max_output_tokens: 20000,
      text: {
        format: {
          type: 'json_schema',
          name: 'dailyten_edition',
          strict: true,
          schema,
        },
      },
    }),
  }, 'OpenAI edition generation');

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI generation failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const text = extractOutputText(payload);

  if (!text) {
    throw new Error('OpenAI response did not contain output text.');
  }

  return parseJson(text, 'OpenAI edition output');
}

function normalizeEdition(edition, channel) {
  for (const item of edition.items ?? []) {
    item.cat = normalizeCategory(item);
    if (channel === 'ai' && !item.id.startsWith('ai-')) {
      item.id = `ai-${item.id}`;
    }
  }
}

async function enrichEditionEventImages(edition) {
  await Promise.all((edition.items ?? []).map(async (item) => {
    if (item.eventImage?.url) return;

    const source = Array.isArray(item.sourceLinks) ? item.sourceLinks[0] : null;
    if (!source?.url) {
      item.eventImage = null;
      return;
    }

    const imageUrl = await findSourceImage(source.url);
    item.eventImage = imageUrl
      ? {
        url: imageUrl,
        credit: source.publisher || item.source || '',
        link: source.url,
        zh: {
          alt: item.title,
          caption: item.title,
        },
        en: {
          alt: item.en?.title || item.title,
          caption: item.en?.title || item.title,
        },
      }
      : null;
  }));
}

async function findSourceImage(url) {
  try {
    const response = await withTimeout(fetch(url, {
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'Mozilla/5.0 DailyTen image resolver',
      },
    }), 9000);

    if (!response.ok) return '';

    const html = await response.text();
    return selectUsableImage(extractImageCandidates(html, url));
  } catch (error) {
    console.warn(`Image lookup skipped for ${url}: ${error.message}`);
    return '';
  }
}

function extractImageCandidates(html, baseUrl) {
  const candidates = [];
  const add = (value) => {
    if (!value) return;
    try {
      candidates.push(new URL(value.replaceAll('&amp;', '&'), baseUrl).href);
    } catch {
      // Ignore malformed image URLs from source pages.
    }
  };

  [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/gi,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)/gi,
    /<img\b[^>]+(?:src|data-src|data-original)=["']([^"']+)["'][^>]*>/gi,
  ].forEach((pattern) => {
    for (const match of html.matchAll(pattern)) {
      add(match[1]);
    }
  });

  return candidates;
}

function selectUsableImage(candidates) {
  return candidates.find((url) => {
    const lower = url.toLowerCase();
    return /\.(jpe?g|png|webp)(\?|#|$)/.test(lower)
      && !/(logo|qrcode|qr-code|code|ewm|beacon|share|app|blank|police|big_logo|thumb_150_110|article-er|weixin)/.test(lower);
  }) || '';
}

function withTimeout(promise, milliseconds) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), milliseconds);
    }),
  ]);
}

function normalizeCategory(item) {
  const text = [item.cat, item.title, item.take, item.meta, item.source]
    .filter(Boolean)
    .join(' ');

  if (item.cat === '全球经济' && isLocalChinaEconomicStory(text)) {
    return '中国经济';
  }

  return item.cat;
}

function isLocalChinaEconomicStory(text) {
  return /中国|重庆|上海|北京|天津|广东|深圳|广州|浙江|江苏|山东|四川|陕西|河南|湖北|湖南|福建|安徽|河北|山西|辽宁|吉林|黑龙江|江西|云南|贵州|广西|海南|甘肃|青海|宁夏|新疆|西藏|内蒙古/.test(text)
    && /经济|增长|就业|消费|融资|投资|政策|产业|稳增长/.test(text);
}

async function fetchWithContext(url, options, label) {
  try {
    return await fetch(url, options);
  } catch (error) {
    const reason = error.cause?.message ?? error.cause?.code ?? error.message;
    throw new Error(`${label} failed: ${reason}`);
  }
}

function parseJson(value, label) {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`${label} was not valid JSON. Preview: ${String(value).slice(0, 180)}`);
  }
}

function extractOutputText(payload) {
  if (typeof payload.output_text === 'string') {
    return payload.output_text;
  }

  return payload.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .filter(Boolean)
    .join('\n');
}

function todayInTimezone(timezone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function validateEdition(edition) {
  const errors = [];

  if (!edition || typeof edition !== 'object') {
    throw new Error('Edition must be an object.');
  }

  requiredStrings(edition, ['dateKey', 'generatedAt', 'title', 'subtitle', 'briefLabel', 'doneLabel'], errors, 'edition');

  if (!Array.isArray(edition.items) || edition.items.length !== 10) {
    errors.push('edition.items must contain exactly 10 items.');
  }

  const ids = new Set();
  for (const [index, item] of (edition.items ?? []).entries()) {
    const label = `items[${index}]`;
    requiredStrings(item, ['id', 'cat', 'icon', 'title', 'brief', 'take', 'meta', 'source', 'updated'], errors, label);

    if (ids.has(item.id)) {
      errors.push(`${label}.id is duplicated.`);
    }
    ids.add(item.id);

    if (!allowedIcons.has(item.icon)) {
      errors.push(`${label}.icon is not supported.`);
    }

    validatePairs(item.facts, 3, 3, `${label}.facts`, errors);
    validatePairs(item.impacts, 2, 3, `${label}.impacts`, errors);
    validateLocalizedItem(item.en, `${label}.en`, errors);

    if (!Array.isArray(item.next) || item.next.length > 2) {
      errors.push(`${label}.next must contain zero to two items.`);
    }

    if (!Array.isArray(item.sourceLinks)) {
      errors.push(`${label}.sourceLinks must be an array.`);
    }

    if (item.visual !== null) {
      validateVisual(item.visual, `${label}.visual`, errors);
    }
  }

  if (errors.length) {
    throw new Error(`DailyTen edition validation failed:\n- ${errors.join('\n- ')}`);
  }
}

function validateLocalizedItem(item, label, errors) {
  requiredStrings(item, ['cat', 'title', 'brief', 'take', 'meta', 'source', 'updated'], errors, label);
  validatePairs(item?.facts, 3, 3, `${label}.facts`, errors);
  validatePairs(item?.impacts, 2, 3, `${label}.impacts`, errors);

  if (label.endsWith('.en') && containsCjkText(item)) {
    errors.push(`${label} must be written in English, not Chinese.`);
  }

  if (!Array.isArray(item?.next) || item.next.length > 2) {
    errors.push(`${label}.next must contain zero to two items.`);
  }

  if (item?.visual !== null) {
    validateVisual(item?.visual, `${label}.visual`, errors);
  }
}

function containsCjkText(value) {
  return /[\u3400-\u9fff]/.test(JSON.stringify(value ?? ''));
}

function requiredStrings(object, keys, errors, label) {
  for (const key of keys) {
    if (typeof object?.[key] !== 'string' || object[key].trim() === '') {
      errors.push(`${label}.${key} must be a non-empty string.`);
    }
  }
}

function validatePairs(value, min, max, label, errors) {
  if (!Array.isArray(value) || value.length < min || value.length > max) {
    errors.push(`${label} must contain ${min === max ? min : `${min}-${max}`} pairs.`);
    return;
  }

  value.forEach((pair, index) => {
    if (!Array.isArray(pair) || pair.length !== 2 || pair.some((entry) => typeof entry !== 'string' || entry.trim() === '')) {
      errors.push(`${label}[${index}] must be a two-string pair.`);
    }
  });
}

function validateVisual(visual, label, errors) {
  if (!visual || typeof visual !== 'object' || !allowedVisuals.has(visual.type)) {
    errors.push(`${label} must be null, chain, bars, or trend.`);
    return;
  }

  if (typeof visual.label !== 'string' || visual.label.trim() === '') {
    errors.push(`${label}.label must be a non-empty string.`);
  }

  if (visual.type === 'chain' && (!Array.isArray(visual.nodes) || visual.nodes.length < 3)) {
    errors.push(`${label}.nodes must contain at least three nodes.`);
  }

  if (visual.type === 'bars' && (!Array.isArray(visual.bars) || typeof visual.max !== 'number')) {
    errors.push(`${label}.bars and ${label}.max are required.`);
  }

  if (visual.type === 'trend' && (!Array.isArray(visual.points) || visual.points.length < 3)) {
    errors.push(`${label}.points must contain at least three points.`);
  }
}
