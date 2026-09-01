import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const schemaPath = path.join(rootDir, 'schema', 'openai-dailyten-edition.schema.json');
const configPath = path.join(rootDir, 'config', 'interests.json');
const outputPath = path.join(rootDir, 'data', 'today.json');
const validateOnly = process.argv.includes('--validate-only');
const testSourcesOnly = process.argv.includes('--test-sources');

const allowedIcons = new Set(['oil', 'chart', 'drone', 'quake', 'ai', 'alert', 'code', 'refinery', 'ship', 'eclipse']);
const allowedVisuals = new Set(['chain', 'bars', 'trend']);
const rssFeeds = [
  { publisher: 'BBC News', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
  { publisher: 'NPR', url: 'https://feeds.npr.org/1001/rss.xml' },
  { publisher: 'The Guardian', url: 'https://www.theguardian.com/world/rss' },
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
    console.log(`Validated ${edition.items.length} DailyTen items for ${edition.dateKey}.`);
    return;
  }

  if (testSourcesOnly) {
    const candidates = await fetchNewsCandidates(config);
    console.log(`Fetched ${candidates.length} candidate articles.`);
    console.log(candidates.slice(0, 3).map((candidate) => `- ${candidate.title} (${candidate.domain})`).join('\n'));
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  const reasoningEffort = process.env.OPENAI_REASONING_EFFORT ?? 'medium';

  if (!apiKey || !model) {
    throw new Error('Missing OPENAI_API_KEY or OPENAI_MODEL. Set them before running daily generation.');
  }

  const candidates = await fetchNewsCandidates(config);
  const edition = await generateEdition({ apiKey, model, reasoningEffort, schema, config, candidates });
  normalizeEdition(edition);
  validateEdition(edition);
  await fs.writeFile(outputPath, `${JSON.stringify(edition, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${edition.items.length} DailyTen items to ${outputPath}.`);
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function fetchNewsCandidates(config) {
  try {
    const candidates = await fetchGdeltCandidates(config);
    console.log(`Fetched ${candidates.length} candidate articles from GDELT.`);
    return candidates;
  } catch (error) {
    console.warn(`${error.message}; falling back to public RSS feeds.`);
    const candidates = await fetchRssCandidates();
    console.log(`Fetched ${candidates.length} candidate articles from RSS feeds.`);
    return candidates;
  }
}

async function fetchGdeltCandidates(config) {
  const params = new URLSearchParams({
    query: config.sourceQuery,
    mode: 'ArtList',
    format: 'json',
    maxrecords: '75',
    sort: 'hybridrel',
    timespan: '24h',
  });
  const url = `http://api.gdeltproject.org/api/v2/doc/doc?${params}`;

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

async function generateEdition({ apiKey, model, reasoningEffort, schema, config, candidates }) {
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
        'Write in plain Simplified Chinese for a smart general reader who does not read policy or industry jargon every day.',
        'For every item, also write an en object in natural English.',
        'The English version must be plain and readable, but do not remove useful technical terms such as Agent, MCP, compute, inference, governance, data center, supply chain, or audit when they are central to the story.',
        'Explain technical terms through context instead of deleting them.',
        'Do not sound like a government notice, corporate press release, stock analyst note, or official abstract.',
        'Use everyday explanations: first say what happened, then why it matters, then what could change for ordinary life, work, prices, tools, privacy, safety, or choices.',
        'Keep key numbers, actors, places, dates, and direct consequences; simplify wording without losing important facts.',
        'Avoid vague phrases such as 加速落地, 赋能, 释放价值, 稳中向好, 生态完善 unless you immediately explain what that means in concrete terms.',
        'Every item must explain why it matters to a person, not only to markets, governments, or industries.',
        'Follow categoryRules exactly. Never label a city, provincial, or local policy story as 全球经济.',
        'Use 全球经济 only for genuinely global, multi-country, or cross-border macroeconomic stories.',
        'Use 中国经济 for China national, provincial, municipal, or local economic policy stories.',
        'Use sourceLinks from the provided candidates. Do not invent URLs.',
        'Return only JSON that matches the provided schema.',
      ].join('\n'),
      input: JSON.stringify({
        dateKey: todayInTimezone(config.timezone),
        preferences: config,
        candidates,
        outputNotes: [
          'facts must contain exactly three short label/text pairs.',
          'impacts must contain two or three short label/text pairs.',
          'next may contain zero to two watch points.',
          'title should be clear and concrete, not slogan-like.',
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

function normalizeEdition(edition) {
  for (const item of edition.items ?? []) {
    item.cat = normalizeCategory(item);
  }
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
    requiredStrings(item, ['id', 'cat', 'icon', 'title', 'take', 'meta', 'source', 'updated'], errors, label);

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
  requiredStrings(item, ['cat', 'title', 'take', 'meta', 'source', 'updated'], errors, label);
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
