const C = {
  ink: '#2B2A24',
  secondary: '#6B685C',
  muted: '#96917F',
  olive: '#2F4A3A',
  oliveMid: '#4A6B55',
  sage: '#DCE8DA',
  sageBorder: '#8FAE95',
  gold: '#B99A54',
  goldBg: '#F1E8CF',
  goldBorder: '#CDB477',
  goldText: '#5A4716',
  blue: '#7E9AB8',
  blueLight: '#B9CADB',
  red: '#B45A4A',
  frame: '#FBF8EF',
  track: '#EDE6D4',
};

const storageKeys = {
  favorites: 'dailyten-web:favorites',
  muted: 'dailyten-web:muted',
  read: 'dailyten-web:read',
};

const iconPaths = {
  oil: '<ellipse cx="32" cy="15" rx="12" ry="4.5"/><path d="M20 15V49"/><path d="M44 15V49"/><ellipse cx="32" cy="49" rx="12" ry="4.5"/><path d="M20 28H44"/><path d="M20 40H44"/>',
  chart: '<path d="M13 51H53"/><path d="M13 51V13"/><polyline points="17,43 27,33 35,39 49,19"/><polyline points="43,19 49,19 49,25"/>',
  drone: '<rect x="25" y="28" width="14" height="9" rx="2"/><line x1="25" y1="30" x2="13" y2="20"/><line x1="39" y1="30" x2="51" y2="20"/><line x1="25" y1="35" x2="13" y2="45"/><line x1="39" y1="35" x2="51" y2="45"/><ellipse cx="13" cy="20" rx="7" ry="2.5"/><ellipse cx="51" cy="20" rx="7" ry="2.5"/><ellipse cx="13" cy="45" rx="7" ry="2.5"/><ellipse cx="51" cy="45" rx="7" ry="2.5"/>',
  quake: '<path d="M8 34H16L20 20L27 48L34 24L40 42L45 34H56"/><path d="M12 53H52" stroke-dasharray="1 5"/>',
  ai: '<path d="M18 46L30 34L37 40L48 22"/><polyline points="41,22 48,22 48,29"/><rect x="16" y="50" width="6" height="6"/><rect x="27" y="50" width="6" height="6"/><rect x="38" y="50" width="6" height="6"/>',
  alert: '<path d="M32 8 L35 24 L49 17 L39 30 L54 34 L38 37 L44 52 L31 41 L20 51 L24 35 L10 33 L26 29 Z"/>',
  code: '<polyline points="25,22 16,32 25,42"/><polyline points="39,22 48,32 39,42"/><polyline points="29,35 33,40 40,29"/>',
  refinery: '<rect x="15" y="26" width="8" height="26"/><rect x="29" y="18" width="8" height="34"/><rect x="43" y="30" width="8" height="22"/><path d="M19 26q3-6-1-11"/><path d="M33 18q3-7-1-12"/>',
  ship: '<path d="M12 40H52L46 50H18Z"/><rect x="21" y="30" width="8" height="8"/><rect x="31" y="25" width="8" height="13"/><rect x="41" y="32" width="6" height="6"/><path d="M8 55q4-4 8 0t8 0 8 0 8 0 8 0"/>',
  eclipse: '<circle cx="34" cy="32" r="13"/><line x1="34" y1="9" x2="34" y2="14"/><line x1="34" y1="50" x2="34" y2="55"/><line x1="11" y1="32" x2="16" y2="32"/><line x1="52" y1="32" x2="57" y2="32"/><line x1="17" y1="15" x2="21" y2="19"/><line x1="47" y1="45" x2="51" y2="49"/><circle cx="25" cy="28" r="12" fill="#FBF8EF"/>',
};

const state = {
  favorites: readSet(storageKeys.favorites),
  muted: readSet(storageKeys.muted),
  read: readSet(storageKeys.read),
};

const elements = {
  title: document.querySelector('#page-title'),
  subtitle: document.querySelector('.subtitle'),
  progressTitle: document.querySelector('#progress-title'),
  progressStatus: document.querySelector('#progress-status'),
  feed: document.querySelector('#feed'),
  dots: document.querySelector('#progress-dots'),
  doneCard: document.querySelector('#done-card'),
};

let items = [];

init();

async function init() {
  showLoadingState('正在读取今日十条...');

  try {
    const edition = await loadEdition();
    items = edition.items;
    hydrateEdition(edition);
    renderDots(items.length);
    render();
  } catch (error) {
    showErrorState(error);
  }
}

async function loadEdition() {
  const response = await fetch('./data/today.json', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`today.json 读取失败：${response.status}`);
  }

  return response.json();
}

function hydrateEdition(edition) {
  document.title = `${edition.title ?? 'DailyTen'} · 今日简报`;
  elements.title.textContent = edition.title ?? '每日十条';
  elements.subtitle.textContent = edition.subtitle ?? '替你筛掉大部分新闻，把今天值得知道的十件事讲清楚。';
  elements.progressTitle.textContent = edition.briefLabel ?? `今日 ${edition.items.length} 条`;
  elements.progressStatus.textContent = '先扫读，再展开真正想看的。';
  elements.doneCard.textContent = edition.doneLabel ?? '今日简报已完成';
}

function renderDots(count) {
  elements.dots.innerHTML = '';

  for (let index = 0; index < count; index += 1) {
    const dot = document.createElement('span');
    dot.className = 'progress-dot';
    elements.dots.append(dot);
  }
}

function showLoadingState(text) {
  elements.feed.innerHTML = `<article class="state-card">${escapeHtml(text)}</article>`;
}

function showErrorState(error) {
  elements.feed.innerHTML = `
    <article class="state-card is-error">
      <strong>今日十条暂时没有加载成功</strong>
      <span>${escapeHtml(error.message)}</span>
    </article>
  `;
}

function render() {
  elements.feed.innerHTML = '';
  let lastCategory = '';

  items.forEach((item, index) => {
    if (item.cat !== lastCategory) {
      const label = document.createElement('p');
      label.className = 'category-label';
      label.textContent = item.cat;
      elements.feed.append(label);
      lastCategory = item.cat;
    }

    elements.feed.append(createCard(item, index));
  });

  updateProgress();
}

function createCard(item, index) {
  const card = document.createElement('article');
  card.className = `news-card${state.muted.has(item.id) ? ' is-muted' : ''}`;
  card.dataset.id = item.id;

  const header = document.createElement('button');
  header.className = 'card-button';
  header.type = 'button';
  header.setAttribute('aria-expanded', 'false');
  header.innerHTML = `
    <span class="summary-row">
      <span class="summary-copy">
        <span class="card-title">${escapeHtml(item.title)}</span>
        <span class="card-take">${escapeHtml(item.take)}</span>
        <span class="card-meta">${escapeHtml(item.meta)}</span>
      </span>
      <span class="sketch-icon">${sketchIcon(item.icon, 42)}</span>
      <span class="chevron" aria-hidden="true"></span>
    </span>
  `;

  const details = document.createElement('div');
  details.className = 'details';
  details.innerHTML = detailsHtml(item);

  header.addEventListener('click', () => {
    const open = card.classList.toggle('is-open');
    header.setAttribute('aria-expanded', String(open));
    if (open) {
      state.read.add(item.id);
      writeSet(storageKeys.read, state.read);
      updateProgress();
    }
  });

  details.querySelector('[data-action="favorite"]').addEventListener('click', () => {
    toggleSet(state.favorites, item.id);
    writeSet(storageKeys.favorites, state.favorites);
    syncCardButtons(card, item.id);
  });

  details.querySelector('[data-action="mute"]').addEventListener('click', () => {
    state.muted.add(item.id);
    writeSet(storageKeys.muted, state.muted);
    card.classList.add('is-muted');
    syncCardButtons(card, item.id);
  });

  card.append(header, details);
  syncCardButtons(card, item.id);

  return card;
}

function detailsHtml(item) {
  return `
    <div class="divider"></div>
    <div class="takeaway-row">
      <div class="takeaway-copy">
        <p class="mini-label">一句话结论</p>
        <p class="take-text">${escapeHtml(item.take)}。</p>
      </div>
      <span class="sketch-icon">${sketchIcon(item.icon, 58)}</span>
    </div>

    ${sectionTitle('三个关键事实')}
    <div class="fact-grid">
      ${item.facts.map(([label, text]) => `
        <div class="fact">
          <strong>${escapeHtml(label)}</strong>
          <span>${escapeHtml(text)}</span>
        </div>
      `).join('')}
    </div>

    ${item.visual ? `${sectionTitle('核心可视化')}${visualBlock(item.visual)}` : ''}

    ${sectionTitle('对个人有什么影响')}
    <div class="impact-grid">
      ${item.impacts.map(([label, text]) => `
        <div class="impact">
          <strong>${escapeHtml(label)}</strong>
          <span>${escapeHtml(text)}</span>
        </div>
      `).join('')}
    </div>

    ${item.next.length ? `
      ${sectionTitle('接下来只看什么')}
      <ol class="next-list">
        ${item.next.map((text, index) => `<li><span>${index + 1}</span>${escapeHtml(text)}</li>`).join('')}
      </ol>
    ` : ''}

    <div class="source-row">
      <span class="source-text">${escapeHtml(item.source)} · ${escapeHtml(item.updated)}</span>
      <span class="actions">
        <button class="pill-button" type="button" data-action="favorite"></button>
        <button class="pill-button is-danger" type="button" data-action="mute"></button>
      </span>
    </div>
  `;
}

function sectionTitle(text) {
  return `<p class="section-title">${escapeHtml(text)}</p>`;
}

function visualBlock(visual) {
  const content = visual.type === 'chain'
    ? chainSvg(visual.nodes)
    : visual.type === 'bars'
      ? barsSvg(visual.bars, visual.max, visual.decimal)
      : trendSvg(visual);

  return `
    <div class="visual-block">
      <p class="visual-label">${escapeHtml(visual.label)}</p>
      ${content}
    </div>
  `;
}

function sketchIcon(name, size) {
  const id = uniqueId('sketch');
  const path = iconPaths[name] ?? iconPaths.chart;
  return `
    <svg class="sketch-svg" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">
      <defs>${sketchFilter(id, 2.2, 0.03)}</defs>
      <g filter="url(#${id})" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        ${path}
      </g>
    </svg>
  `;
}

function chainSvg(nodes) {
  const width = 620;
  const height = 78;
  const id = uniqueId('chain');
  const nodeWidth = 100;
  const gap = (width - nodeWidth * nodes.length) / Math.max(nodes.length - 1, 1);
  const y = 18;

  const shapes = nodes.map((node, index) => {
    const x = index * (nodeWidth + gap);
    const last = index === nodes.length - 1;
    return `
      <rect x="${x + 2}" y="${y}" width="${nodeWidth - 4}" height="42" rx="13" fill="${last ? C.goldBg : C.sage}" stroke="${last ? C.goldBorder : C.sageBorder}" stroke-width="2" />
      ${index < nodes.length - 1 ? arrowPath(x + nodeWidth, y + 21, gap - 8) : ''}
    `;
  }).join('');

  const labels = nodes.map((node, index) => {
    const x = index * (nodeWidth + gap) + nodeWidth / 2;
    const last = index === nodes.length - 1;
    return `<text x="${x}" y="${y + 22}" text-anchor="middle" dominant-baseline="middle" font-size="12" font-weight="700" fill="${last ? C.goldText : C.olive}">${escapeSvg(node)}</text>`;
  }).join('');

  return `
    <svg class="visual-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(nodes.join('，'))}">
      <defs>${sketchFilter(id, 2.4, 0.012)}</defs>
      <g filter="url(#${id})">${shapes}</g>
      <g>${labels}</g>
    </svg>
  `;
}

function arrowPath(x, y, length) {
  const end = x + Math.max(length, 16);
  return `<path d="M${x + 4} ${y} L${end} ${y}" fill="none" stroke="${C.oliveMid}" stroke-width="2.2" stroke-linecap="round"/><path d="M${end - 7} ${y - 5} L${end} ${y} L${end - 7} ${y + 5}" fill="none" stroke="${C.oliveMid}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function barsSvg(bars, max, decimal = false) {
  const width = 620;
  const rowHeight = 34;
  const height = bars.length * rowHeight + 24;
  const left = 112;
  const plot = width - left - 58;
  const id = uniqueId('bars');

  const shapes = bars.map(([, value, color], index) => {
    const y = 8 + index * rowHeight;
    const barWidth = Math.max(4, (plot * value) / max);
    return `
      <rect x="${left}" y="${y + 8}" width="${plot}" height="17" rx="6" fill="${C.track}" />
      <rect x="${left}" y="${y + 8}" width="${barWidth}" height="17" rx="6" fill="${color}" />
    `;
  }).join('');

  const labels = bars.map(([label, value], index) => {
    const y = 8 + index * rowHeight;
    const barWidth = Math.max(4, (plot * value) / max);
    const display = decimal ? value.toFixed(1) : String(value);
    return `
      <text x="${left - 10}" y="${y + 17}" text-anchor="end" dominant-baseline="middle" font-size="12" fill="${C.secondary}">${escapeSvg(label)}</text>
      <text x="${left + barWidth + 8}" y="${y + 17}" dominant-baseline="middle" font-size="12" font-weight="700" fill="${C.ink}">${display}%</text>
    `;
  }).join('');

  return `
    <svg class="visual-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="对比条形图">
      <defs>${sketchFilter(id, 2, 0.02)}</defs>
      <g filter="url(#${id})">${shapes}</g>
      <g>${labels}</g>
    </svg>
  `;
}

function trendSvg(visual) {
  const width = 620;
  const height = 114;
  const sparkWidth = 230;
  const sparkHeight = 58;
  const id = uniqueId('trend');
  const min = Math.min(...visual.points);
  const max = Math.max(...visual.points);
  const range = max - min || 1;
  const step = sparkWidth / (visual.points.length - 1);
  const path = visual.points.map((point, index) => {
    const x = 350 + index * step;
    const y = 28 + sparkHeight - ((point - min) / range) * sparkHeight;
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  const color = visual.up ? C.oliveMid : C.gold;

  return `
    <svg class="visual-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(visual.label)}">
      <defs>${sketchFilter(id, 2, 0.02)}</defs>
      <text x="10" y="44" font-size="36" font-weight="800" fill="${C.olive}">${escapeSvg(visual.big)}</text>
      <text x="12" y="68" font-size="13" fill="${C.secondary}">${escapeSvg(visual.sub)}</text>
      <rect x="12" y="80" width="112" height="24" rx="11" fill="${visual.up ? C.sage : C.goldBg}" stroke="${visual.up ? C.sageBorder : C.goldBorder}" />
      <text x="68" y="92" dominant-baseline="middle" text-anchor="middle" font-size="12" font-weight="700" fill="${visual.up ? C.olive : C.goldText}">${escapeSvg(visual.direction)}</text>
      <g filter="url(#${id})">
        <path d="${path}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${path} L580 100 L350 100 Z" fill="${color}" opacity="0.14" />
      </g>
    </svg>
  `;
}

function sketchFilter(id, scale, frequency) {
  return `
    <filter id="${id}" x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="1" seed="${Math.floor(Math.random() * 40)}" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="${scale}" />
    </filter>
  `;
}

function syncCardButtons(card, id) {
  const favoriteButton = card.querySelector('[data-action="favorite"]');
  const muteButton = card.querySelector('[data-action="mute"]');
  const favorite = state.favorites.has(id);
  const muted = state.muted.has(id);

  favoriteButton.textContent = favorite ? '已收藏' : '收藏';
  favoriteButton.classList.toggle('is-active', favorite);
  muteButton.textContent = muted ? '已记录偏好' : '少看这类';
}

function updateProgress() {
  const readCount = items.filter((item) => state.read.has(item.id)).length;
  Array.from(elements.dots.children).forEach((dot, index) => {
    dot.classList.toggle('is-read', index < readCount);
  });
  elements.progressStatus.textContent = readCount === items.length
    ? '今日简报已完成。'
    : `已读 ${readCount} / ${items.length} 条`;
  elements.doneCard.hidden = readCount !== items.length;
}

function readSet(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) ?? '[]'));
  } catch {
    return new Set();
  }
}

function writeSet(key, value) {
  localStorage.setItem(key, JSON.stringify([...value]));
}

function toggleSet(set, value) {
  if (set.has(value)) {
    set.delete(value);
  } else {
    set.add(value);
  }
}

function uniqueId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeSvg(value) {
  return escapeHtml(value);
}
