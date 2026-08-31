import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const schemaPath = path.join(rootDir, 'schema', 'dailyten-edition.schema.json');
const configPath = path.join(rootDir, 'config', 'interests.json');
const outputPath = path.join(rootDir, 'data', 'today.json');
const validateOnly = process.argv.includes('--validate-only');

const allowedIcons = new Set(['oil', 'chart', 'drone', 'quake', 'ai', 'alert', 'code', 'refinery', 'ship', 'eclipse']);
const allowedVisuals = new Set(['chain', 'bars', 'trend']);

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

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  if (!apiKey || !model) {
    throw new Error('Missing OPENAI_API_KEY or OPENAI_MODEL. Set them before running daily generation.');
  }

  const candidates = await fetchNewsCandidates(config);
  const edition = await generateEdition({ apiKey, model, schema, config, candidates });
  validateEdition(edition);
  await fs.writeFile(outputPath, `${JSON.stringify(edition, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${edition.items.length} DailyTen items to ${outputPath}.`);
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function fetchNewsCandidates(config) {
  const params = new URLSearchParams({
    query: config.sourceQuery,
    mode: 'ArtList',
    format: 'json',
    maxrecords: '75',
    sort: 'hybridrel',
    timespan: '24h',
  });
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?${params}`;

  const response = await fetch(url, {
    headers: { accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`GDELT candidate fetch failed: ${response.status}`);
  }

  const data = await response.json();
  return (data.articles ?? []).map((article) => ({
    title: article.title,
    url: article.url,
    sourceCountry: article.sourceCountry,
    domain: article.domain,
    seenDate: article.seendate,
    language: article.language,
  }));
}

async function generateEdition({ apiKey, model, schema, config, candidates }) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      instructions: [
        'You are the editor of DailyTen, a calm personal daily briefing product.',
        'Select exactly ten important real news items from the candidate list.',
        'Write in Simplified Chinese for a smart general reader.',
        'Every item must explain why it matters to a person, not only to markets, governments, or industries.',
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
          'visual may be null, chain, bars, or trend.',
        ],
      }),
      text: {
        format: {
          type: 'json_schema',
          name: 'dailyten_edition',
          strict: true,
          schema,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI generation failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const text = extractOutputText(payload);

  if (!text) {
    throw new Error('OpenAI response did not contain output text.');
  }

  return JSON.parse(text);
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
