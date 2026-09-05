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
  frame: '#FBF8EF',
  track: '#EDE6D4',
};

const channels = {
  daily: {
    label: '每日十条',
    eyebrow: 'DAILYTEN · 今日简报',
    fallbackTitle: 'DailyTen 每日十条',
    fallbackSubtitle: '替你筛掉大部分新闻，把今天值得知道的十件事讲清楚。',
  },
  ai: {
    label: 'AI 行业',
    eyebrow: 'DAILYTEN · AI 行业',
    fallbackTitle: 'AI 行业十条',
    fallbackSubtitle: '模型、Agent、算力、芯片、产品与治理，一次看清今天的 AI 产业变化。',
  },
  mine: {
    label: '我的',
    eyebrow: 'DAILYTEN · 我的',
    fallbackTitle: '我的',
    fallbackSubtitle: '管理收藏、语言和之后会接入的个人偏好。',
  },
  favorites: {
    label: '收藏',
    eyebrow: 'DAILYTEN · 收藏',
    fallbackTitle: '我的收藏',
    fallbackSubtitle: '把想回看的每日十条和 AI 行业内容集中放在这里。',
  },
};

const bottomTabs = ['daily', 'ai', 'mine'];
const swipeChannels = ['daily', 'ai', 'mine'];
const transitionMs = 280;
const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');

const i18n = {
  zh: {
    daily: '主页',
    ai: 'AI 行业',
    mine: '我的',
    favorites: '收藏',
    language: '语言选择',
    theme: '主题',
    themeDark: '深色',
    themeLight: '浅色',
    themeSystem: '跟随本机',
    chinese: '中文',
    english: 'English',
    close: '关闭',
    mineEyebrow: 'DAILYTEN · 我的',
    mineTitle: '我的',
    mineSubtitle: '管理收藏、语言和之后会接入的个人偏好。',
    favoritesEyebrow: 'DAILYTEN · 收藏',
    favoritesTitle: '我的收藏',
    favoritesSubtitle: '已收藏的内容会保留在本机浏览器里，方便之后回看。',
    favoritesEmptyTitle: '暂无收藏',
    favoritesEmptyCopy: '在每日十条或 AI 行业里点击收藏，内容会出现在这里。',
    noContentTitle: '暂无内容',
    noContentCopy: '这一天暂时没有可展示的内容。',
    progressDefault: '先扫读，再展开真正想看的。',
    progressEmpty: '在每日十条或 AI 行业里点击收藏。',
    readComplete: '这一天的十条已完成。',
    readPrefix: '已读',
    favoriteOn: '已收藏',
    favoriteOff: '收藏',
    expand: '展开',
    collapse: '收起',
    muteOn: '已记录偏好',
    muteOff: '少看这类',
    conclusion: '一句话结论',
    facts: '三个关键事实',
    visual: '核心可视化',
    eventImage: '事件图片',
    impact: '对个人有什么影响',
    next: '接下来只看什么',
    today: '今天',
    languageHint: '选择后会立刻保存到当前浏览器。',
    favoriteHint: '查看已收藏的十条',
    termKicker: '专业词解释',
    termMeaning: '它是什么意思',
    termRelation: '和这条新闻的关系',
    themeHint: '选择后会立刻应用并保存在当前浏览器。',
  },
  en: {
    daily: 'Home',
    ai: 'AI Industry',
    mine: 'Mine',
    favorites: 'Favorites',
    language: 'Language',
    theme: 'Theme',
    themeDark: 'Dark',
    themeLight: 'Light',
    themeSystem: 'Follow device',
    chinese: 'Chinese',
    english: 'English',
    close: 'Close',
    mineEyebrow: 'DAILYTEN · MINE',
    mineTitle: 'Mine',
    mineSubtitle: 'Manage favorites, language, and future personal preferences.',
    favoritesEyebrow: 'DAILYTEN · FAVORITES',
    favoritesTitle: 'Favorites',
    favoritesSubtitle: 'Saved items stay in this browser for quick review later.',
    favoritesEmptyTitle: 'No favorites yet',
    favoritesEmptyCopy: 'Tap Favorite in DailyTen or AI Industry to save items here.',
    noContentTitle: 'No content',
    noContentCopy: 'There is nothing to show for this date yet.',
    progressDefault: 'Scan first, then open the stories that matter.',
    progressEmpty: 'Tap Favorite in DailyTen or AI Industry to save items.',
    readComplete: 'You have finished this edition.',
    readPrefix: 'Read',
    favoriteOn: 'Saved',
    favoriteOff: 'Favorite',
    expand: 'Open',
    collapse: 'Collapse',
    muteOn: 'Preference saved',
    muteOff: 'Show less',
    conclusion: 'Bottom line',
    facts: 'Three key facts',
    visual: 'Core visual',
    eventImage: 'Event image',
    impact: 'What it means for you',
    next: 'What to watch next',
    today: 'Today',
    languageHint: 'Your choice is saved in this browser.',
    favoriteHint: 'View saved items',
    termKicker: 'Term guide',
    termMeaning: 'What it means',
    termRelation: 'Why it matters here',
    themeHint: 'Your choice applies immediately and is saved in this browser.',
  },
};

const storageKeys = {
  favorites: 'dailyten-web:favorites',
  muted: 'dailyten-web:muted',
  read: 'dailyten-web:read',
  channel: 'dailyten-web:channel',
  date: 'dailyten-web:date',
  language: 'dailyten-web:language',
  theme: 'dailyten-web:theme',
  themeVersion: 'dailyten-web:theme-version',
};

const memoryStorage = new Map();
const storage = {
  getItem(key) {
    try {
      const value = window.localStorage.getItem(key);
      return value === null ? (memoryStorage.get(key) || null) : value;
    } catch {
      return memoryStorage.get(key) || null;
    }
  },
  setItem(key, value) {
    memoryStorage.set(key, String(value));
    try {
      window.localStorage.setItem(key, String(value));
    } catch {
      // Restricted browser storage falls back to memory for this visit.
    }
  },
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

let today = startOfDay(new Date());
let yesterday = addDays(today, -1);
let dateOptions = [today, yesterday];
let todayKey = formatDateKey(today);
let yesterdayKey = formatDateKey(yesterday);
let latestDailyEdition = null;
let editionIndex = null;
let availableDateKeys = new Set([todayKey, yesterdayKey]);
let editionPathByDate = new Map();
let aiEditionPathByDate = new Map();

const state = {
  favorites: readSet(storageKeys.favorites),
  muted: readSet(storageKeys.muted),
  read: readSet(storageKeys.read),
  channel: channels[storage.getItem(storageKeys.channel)] ? storage.getItem(storageKeys.channel) : 'daily',
  language: readSavedLanguage(),
  theme: readSavedTheme(),
  selectedDateKey: readSavedDateKey(),
  calendarExpanded: false,
};

const elements = {
  eyebrow: document.querySelector('.eyebrow'),
  title: document.querySelector('#page-title'),
  subtitle: document.querySelector('.subtitle'),
  channelTabs: document.querySelector('#channel-tabs'),
  bottomNav: document.querySelector('#bottom-nav'),
  dateModule: document.querySelector('#date-module'),
  progressTitle: document.querySelector('#progress-title'),
  progressStatus: document.querySelector('#progress-status'),
  progressCard: document.querySelector('.progress-card'),
  feed: document.querySelector('#feed'),
  dots: document.querySelector('#progress-dots'),
  doneCard: document.querySelector('#done-card'),
  languageModal: document.querySelector('#language-modal'),
  languageOptions: document.querySelector('#language-options'),
  languageModalTitle: document.querySelector('#language-modal-title'),
  languageClose: document.querySelector('[data-language-close]'),
  themeModal: document.querySelector('#theme-modal'),
  themeOptions: document.querySelector('#theme-options'),
  themeModalTitle: document.querySelector('#theme-modal-title'),
  themeClose: document.querySelector('[data-theme-close]'),
  termModal: document.querySelector('#term-modal'),
  termModalKicker: document.querySelector('#term-modal-kicker'),
  termModalTitle: document.querySelector('#term-modal-title'),
  termModalBody: document.querySelector('#term-modal-body'),
  termClose: document.querySelector('[data-term-close]'),
  shell: document.querySelector('.shell'),
};

let items = [];
let touchStartY = 0;
let navigationLocked = false;
let suppressNextClick = false;
const channelScrollPositions = new Map();

window.addEventListener('error', (event) => {
  reportRuntimeError(event.error || new Error(event.message));
});

window.addEventListener('unhandledrejection', (event) => {
  reportRuntimeError(event.reason || new Error('页面数据加载失败'));
});

init();

async function init() {
  showLoadingState('正在读取这一天的十条...');
  safeSetup(applyTheme);
  safeSetup(renderChannelTabs);
  safeSetup(renderLanguageModal);
  safeSetup(renderThemeModal);
  safeSetup(wireLanguageModal);
  safeSetup(wireThemeModal);
  safeSetup(wireThemePreference);
  safeSetup(wireTermModal);
  safeSetup(wireDateGestures);
  safeSetup(wireNavigationGestures);

  try {
    const [latestEdition, loadedIndex] = await Promise.all([
      fetchEdition('./data/today.json'),
      fetchEditionIndex(),
    ]);
    latestDailyEdition = latestEdition;
    setLatestDate(latestEdition.dateKey, loadedIndex);
    state.selectedDateKey = readSavedDateKey();
    renderDateModule();
    await loadAndRender(latestEdition);
  } catch (error) {
    renderDateModule();
    showErrorState(error);
  }
}

function safeSetup(callback) {
  try {
    callback();
  } catch (error) {
    console.warn(error);
  }
}

function reportRuntimeError(error) {
  console.error(error);
  if (items.length) return;
  showErrorState(error instanceof Error ? error : new Error(String(error)));
}

async function loadAndRender(preloadedLatestEdition = null) {
  if (!items.length && state.channel !== 'mine' && state.channel !== 'favorites') {
    showLoadingState('正在读取这一天的十条...');
  }

  try {
    const canUsePreloaded = preloadedLatestEdition
      && state.channel === 'daily'
      && state.selectedDateKey === todayKey;
    const edition = canUsePreloaded
      ? preloadedLatestEdition
      : await loadEdition(state.channel, state.selectedDateKey);
    if (state.channel === 'daily' && state.selectedDateKey === todayKey) {
      latestDailyEdition = edition;
    }
    items = edition.items;
    hydrateEdition(edition);
    renderChannelTabs();
    renderDateModule();
    renderDots(items.length);
    render();
  } catch (error) {
    showErrorState(error);
  }
}

function setLatestDate(dateKey, loadedIndex = null) {
  today = parseDateKey(dateKey);
  yesterday = addDays(today, -1);
  todayKey = formatDateKey(today);
  yesterdayKey = formatDateKey(yesterday);
  editionIndex = normalizeEditionIndex(loadedIndex, dateKey);
  editionPathByDate = new Map(editionIndex.editions.map((entry) => [entry.dateKey, entry.path]));
  aiEditionPathByDate = new Map(
    editionIndex.editions
      .filter((entry) => entry.aiPath)
      .map((entry) => [entry.dateKey, entry.aiPath]),
  );
  availableDateKeys = new Set([todayKey, yesterdayKey, ...editionPathByDate.keys()]);
  dateOptions = [...availableDateKeys]
    .filter((key) => parseDateKey(key) <= today)
    .sort((a, b) => b.localeCompare(a))
    .map((key) => parseDateKey(key));
}

async function loadEdition(channel, dateKey) {
  if (channel === 'mine') {
    return buildMineEdition();
  }

  if (channel === 'favorites') {
    return buildFavoritesEdition();
  }

  if (channel === 'daily' && dateKey === todayKey) {
    if (latestDailyEdition) return latestDailyEdition;
    latestDailyEdition = await fetchEdition('./data/today.json');
    return latestDailyEdition;
  }

  if (channel === 'daily') {
    const archivedPath = editionPathByDate.get(dateKey);
    if (archivedPath) {
      return fetchEdition(archivedPath);
    }
  }

  if (channel === 'ai') {
    const aiArchivedPath = aiEditionPathByDate.get(dateKey);
    if (aiArchivedPath) {
      try {
        return await fetchEdition(aiArchivedPath);
      } catch {
        // Older deployments can fall back to the saved daily archive below.
      }
    }

    const archivedPath = editionPathByDate.get(dateKey);
    if (archivedPath && dateKey !== todayKey && dateKey !== yesterdayKey) {
      return adaptArchivedEditionForAi(await fetchEdition(archivedPath));
    }
  }

  return buildLocalEdition(channel, dateKey);
}

function adaptArchivedEditionForAi(edition) {
  return {
    ...edition,
    title: 'AI 行业十条',
    subtitle: channels.ai.fallbackSubtitle,
    briefLabel: `${dateLabel(edition.dateKey)} AI 行业 10 条 · 约 ${edition.readTimeMinutes || 8} 分钟`,
    doneLabel: `${dateLabel(edition.dateKey)} AI 行业已读完`,
  };
}

async function fetchEditionIndex() {
  try {
    return await fetchEdition('./data/editions/index.json');
  } catch {
    return null;
  }
}

function normalizeEditionIndex(index, fallbackDateKey) {
  const seen = new Set();
  const rawEntries = index && Array.isArray(index.editions) ? index.editions : [];
  const editions = rawEntries
    .filter((entry) => entry && typeof entry.dateKey === 'string' && entry.dateKey <= fallbackDateKey)
    .filter((entry) => !seen.has(entry.dateKey) && seen.add(entry.dateKey))
    .map((entry) => ({
      dateKey: entry.dateKey,
      path: typeof entry.path === 'string' ? entry.path : `./data/editions/${entry.dateKey}.json`,
      aiPath: typeof entry.aiPath === 'string' ? entry.aiPath : '',
      channels: Array.isArray(entry.channels) ? entry.channels : ['daily'],
      generatedAt: typeof entry.generatedAt === 'string' ? entry.generatedAt : '',
    }))
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey));

  return {
    latestDateKey: index && typeof index.latestDateKey === 'string' ? index.latestDateKey : fallbackDateKey,
    updatedAt: index && typeof index.updatedAt === 'string' ? index.updatedAt : '',
    editions,
  };
}

async function fetchEdition(pathname) {
  const response = await fetch(pathname, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`${pathname} 读取失败：${response.status}`);
  }

  return response.json();
}

function hydrateEdition(edition) {
  const channel = channels[state.channel];
  const title = localizedEditionTitle(edition, channel);
  const subtitle = localizedEditionSubtitle(edition, channel);

  document.documentElement.lang = state.language === 'en' ? 'en' : 'zh-CN';
  document.title = `${title} · ${coalesce(t(state.channel), channel.label)}`;
  elements.eyebrow.textContent = localizedEyebrow(channel);
  elements.title.textContent = title;
  elements.subtitle.textContent = subtitle;
  elements.progressTitle.textContent = localizedBriefLabel(edition);
  elements.progressStatus.textContent = t('progressDefault');
  elements.doneCard.textContent = coalesce(edition.doneLabel, t('readComplete'));
  elements.progressCard.hidden = state.channel === 'mine';
}

function renderChannelTabs() {
  elements.channelTabs.hidden = true;
  const activeTab = state.channel === 'favorites' ? 'mine' : state.channel;

  elements.bottomNav.innerHTML = bottomTabs.map((key) => `
    <button class="bottom-nav-item${activeTab === key ? ' is-active' : ''}" type="button" data-channel="${key}">
      ${escapeHtml(t(key))}
    </button>
  `).join('');

  elements.bottomNav.querySelectorAll('[data-channel]').forEach((button) => {
    button.addEventListener('click', async () => {
      const nextChannel = button.dataset.channel;
      await setActiveChannel(nextChannel);
    });
  });
}

async function setActiveChannel(nextChannel, transitionOptions = {}) {
  if (!channels[nextChannel] || state.channel === nextChannel || navigationLocked) return;
  navigationLocked = true;
  const currentChannel = state.channel;
  const direction = channelDirection(state.channel, nextChannel);
  channelScrollPositions.set(currentChannel, getPageScrollTop());

  try {
    await transitionChannel(direction, async () => {
      state.channel = nextChannel;
      storage.setItem(storageKeys.channel, state.channel);
      renderChannelTabs();
      await loadAndRender();
    }, {
      ...transitionOptions,
      targetScroll: channelScrollPositions.get(nextChannel) || 0,
    });
  } finally {
    navigationLocked = false;
  }
}

function renderLanguageModal() {
  elements.languageModalTitle.textContent = t('language');
  elements.languageClose.textContent = '×';
  elements.languageClose.setAttribute('aria-label', t('close'));
  elements.languageOptions.innerHTML = `
    <button class="choice-option${state.language === 'zh' ? ' is-active' : ''}" type="button" data-language="zh">
      <strong>${escapeHtml(t('chinese'))}</strong>
      <span>${state.language === 'zh' ? '当前选择' : ''}</span>
    </button>
    <button class="choice-option${state.language === 'en' ? ' is-active' : ''}" type="button" data-language="en">
      <strong>${escapeHtml(t('english'))}</strong>
      <span>${state.language === 'en' ? 'Selected' : ''}</span>
    </button>
    <p class="choice-hint">${escapeHtml(t('languageHint'))}</p>
  `;

  elements.languageOptions.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', async () => {
      state.language = button.dataset.language;
      storage.setItem(storageKeys.language, state.language);
      elements.languageModal.hidden = true;
      renderLanguageModal();
      renderThemeModal();
      await loadAndRender();
    });
  });
}

function renderThemeModal() {
  const labels = {
    dark: t('themeDark'),
    light: t('themeLight'),
    system: t('themeSystem'),
  };

  elements.themeModalTitle.textContent = t('theme');
  elements.themeClose.textContent = '×';
  elements.themeClose.setAttribute('aria-label', t('close'));
  elements.themeOptions.innerHTML = ['system', 'dark', 'light'].map((mode) => `
    <button class="choice-option${state.theme === mode ? ' is-active' : ''}" type="button" data-theme="${mode}">
      <strong>${escapeHtml(labels[mode])}</strong>
      <span>${state.theme === mode ? (state.language === 'en' ? 'Selected' : '当前选择') : ''}</span>
    </button>
  `).join('') + `<p class="choice-hint">${escapeHtml(t('themeHint'))}</p>`;

  elements.themeOptions.querySelectorAll('[data-theme]').forEach((button) => {
    button.addEventListener('click', () => {
      state.theme = button.dataset.theme;
      storage.setItem(storageKeys.theme, state.theme);
      storage.setItem(storageKeys.themeVersion, '2');
      elements.themeModal.hidden = true;
      applyTheme();
      renderThemeModal();
      renderMineIfActive();
    });
  });
}

function wireLanguageModal() {
  elements.languageClose.addEventListener('click', () => {
    elements.languageModal.hidden = true;
  });

  elements.languageModal.addEventListener('click', (event) => {
    if (event.target === elements.languageModal) {
      elements.languageModal.hidden = true;
    }
  });
}

function wireThemeModal() {
  elements.themeClose.addEventListener('click', () => {
    elements.themeModal.hidden = true;
  });

  elements.themeModal.addEventListener('click', (event) => {
    if (event.target === elements.themeModal) {
      elements.themeModal.hidden = true;
    }
  });
}

function wireThemePreference() {
  const syncSystemTheme = () => {
    if (state.theme === 'system') {
      applyTheme();
    }
  };

  if (themeMedia.addEventListener) {
    themeMedia.addEventListener('change', syncSystemTheme);
    return;
  }

  themeMedia.addListener(syncSystemTheme);
}

function wireTermModal() {
  elements.termClose.addEventListener('click', closeTermModal);
  elements.termModal.addEventListener('click', (event) => {
    if (event.target === elements.termModal) {
      closeTermModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !elements.termModal.hidden) {
      closeTermModal();
    }
  });
}

function renderDateModule() {
  if (state.channel === 'favorites' || state.channel === 'mine') {
    elements.dateModule.hidden = true;
    elements.dateModule.innerHTML = '';
    return;
  }

  elements.dateModule.hidden = false;
  const monthDate = parseDateKey(state.selectedDateKey);
  elements.dateModule.classList.toggle('is-expanded', state.calendarExpanded);
  elements.dateModule.innerHTML = `
    <div class="date-row" data-date-gesture="collapsed">
      <button class="calendar-toggle" type="button" aria-label="${state.calendarExpanded ? '收起日历' : '展开日历'}" aria-expanded="${state.calendarExpanded}">
        <span class="chevron-icon ${state.calendarExpanded ? 'is-up' : 'is-down'}" aria-hidden="true"><span></span><span></span></span>
      </button>
      <div class="date-strip">
        ${dateOptions.map((date) => dateChipHtml(date)).join('')}
      </div>
    </div>
    <div class="calendar-panel" data-date-gesture="expanded">
      <div class="calendar-head">
        <div>
          <strong>${monthTitle(monthDate)}</strong>
          <span>${state.language === 'en' ? 'Saved editions stay available here' : '已生成的日期会保存在这里'}</span>
        </div>
        <button class="calendar-toggle in-panel" type="button" aria-label="收起日历" aria-expanded="${state.calendarExpanded}">
          <span class="chevron-icon is-up" aria-hidden="true"><span></span><span></span></span>
        </button>
      </div>
      <div class="weekday-grid">
        ${weekdayNames().map((day) => `<span>${day}</span>`).join('')}
      </div>
      <div class="calendar-grid">
        ${calendarCellsHtml(monthDate)}
      </div>
    </div>
  `;

  elements.dateModule.querySelectorAll('.calendar-toggle').forEach((button) => {
    button.addEventListener('click', () => setCalendarExpanded(!state.calendarExpanded));
  });

  elements.dateModule.querySelectorAll('[data-date-key]').forEach((button) => {
    button.addEventListener('click', async () => {
      const dateKey = button.dataset.dateKey;
      if (button.disabled || !dateKey || state.selectedDateKey === dateKey) return;
      state.selectedDateKey = dateKey;
      storage.setItem(storageKeys.date, dateKey);
      await loadAndRender();
    });
  });
}

function dateChipHtml(date) {
  const key = formatDateKey(date);
  const selected = key === state.selectedDateKey;
  return `
    <button class="date-chip${selected ? ' is-selected' : ''}" type="button" data-date-key="${key}">
      <span>${weekdayLabel(date)}</span>
      <strong>${date.getDate()}</strong>
      <em>${key === todayKey ? t('today') : shortDateLabel(date)}</em>
    </button>
  `;
}

function calendarCellsHtml(monthDate) {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const last = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const cells = [];

  for (let index = 0; index < first.getDay(); index += 1) {
    cells.push('<span class="calendar-empty"></span>');
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    const key = formatDateKey(date);
    const selectable = availableDateKeys.has(key);
    const isFuture = date > today;
    const classes = [
      'calendar-day',
      key === state.selectedDateKey ? 'is-selected' : '',
      key === todayKey ? 'is-today' : '',
      !selectable || isFuture ? 'is-disabled' : '',
    ].filter(Boolean).join(' ');

    cells.push(`
      <button class="${classes}" type="button" data-date-key="${key}" ${selectable && !isFuture ? '' : 'disabled'}>
        <span>${day}</span>
      </button>
    `);
  }

  return cells.join('');
}

function wireDateGestures() {
  elements.dateModule.addEventListener('touchstart', (event) => {
    touchStartY = event.touches[0] ? event.touches[0].clientY : 0;
  }, { passive: true });

  elements.dateModule.addEventListener('touchend', (event) => {
    const touchEndY = event.changedTouches[0] ? event.changedTouches[0].clientY : touchStartY;
    const deltaY = touchEndY - touchStartY;

    if (!state.calendarExpanded && deltaY > 34) {
      setCalendarExpanded(true);
    }

    if (state.calendarExpanded && deltaY < -34) {
      setCalendarExpanded(false);
    }
  }, { passive: true });
}

function setCalendarExpanded(expanded) {
  state.calendarExpanded = expanded;
  renderDateModule();
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
  elements.feed.innerHTML = `<article class="state-card">${escapeHtml(state.language === 'en' ? 'Loading this edition...' : text)}</article>`;
}

function wireNavigationGestures() {
  let gesture = null;
  let dragFrame = 0;
  const gestureSurface = document;

  const paintDrag = () => {
    dragFrame = 0;
    if (!gesture || gesture.axis !== 'horizontal') return;
    elements.shell.style.transform = `translate3d(${gesture.offsetX}px, 0, 0)`;
  };

  const queueDragPaint = () => {
    if (!dragFrame) dragFrame = requestAnimationFrame(paintDrag);
  };

  gestureSurface.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0 || navigationLocked || state.channel === 'favorites') return;
    if (event.target.closest('.date-module, .modal-backdrop, .bottom-nav, input, select, textarea, [data-term]')) return;

    const now = performance.now();
    gesture = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: now,
      velocityX: 0,
      axis: null,
      offsetX: 0,
      targetChannel: null,
    };
  }, { passive: true });

  gestureSurface.addEventListener('pointermove', (event) => {
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (!gesture.axis) {
      if (Math.max(absX, absY) < 9) return;
      gesture.axis = absX > absY * 1.18 ? 'horizontal' : 'vertical';
      if (gesture.axis === 'horizontal') {
        elements.shell.classList.add('is-nav-dragging');
      }
    }

    if (gesture.axis !== 'horizontal') return;
    event.preventDefault();

    const now = performance.now();
    const elapsed = Math.max(1, now - gesture.lastTime);
    gesture.velocityX = (event.clientX - gesture.lastX) / elapsed;
    gesture.lastX = event.clientX;
    gesture.lastTime = now;
    gesture.targetChannel = swipeTargetForDelta(deltaX);
    gesture.offsetX = gesture.targetChannel ? deltaX : deltaX * 0.18;
    queueDragPaint();
  }, { passive: false });

  const finishGesture = async (event, cancelled = false) => {
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const finishedGesture = gesture;
    gesture = null;
    if (dragFrame) cancelAnimationFrame(dragFrame);
    dragFrame = 0;

    if (finishedGesture.axis !== 'horizontal') return;
    suppressNextClick = true;
    window.setTimeout(() => { suppressNextClick = false; }, 360);

    const distanceEnough = Math.abs(finishedGesture.offsetX) >= window.innerWidth * 0.2;
    const velocityEnough = Math.abs(finishedGesture.velocityX) >= 0.42;
    const shouldChange = !cancelled
      && finishedGesture.targetChannel
      && (distanceEnough || velocityEnough);

    elements.shell.classList.remove('is-nav-dragging');

    if (shouldChange) {
      await setActiveChannel(finishedGesture.targetChannel, {
        initialOffset: finishedGesture.offsetX,
      });
      return;
    }

    await animateShellBack(finishedGesture.offsetX);
  };

  gestureSurface.addEventListener('pointerup', (event) => finishGesture(event));
  gestureSurface.addEventListener('pointercancel', (event) => finishGesture(event, true));

  document.addEventListener('click', (event) => {
    if (!suppressNextClick) return;
    suppressNextClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
}

function swipeTargetForDelta(deltaX) {
  const currentIndex = swipeChannels.indexOf(state.channel);
  if (currentIndex < 0 || deltaX === 0) return null;
  const nextIndex = deltaX < 0 ? currentIndex + 1 : currentIndex - 1;
  return swipeChannels[nextIndex] || null;
}

async function animateShellBack(offsetX) {
  if (!offsetX || !elements.shell.animate) {
    elements.shell.style.transform = '';
    return;
  }

  const animation = elements.shell.animate([
    { transform: `translate3d(${offsetX}px, 0, 0)` },
    { transform: 'translate3d(0, 0, 0)' },
  ], {
    duration: 220,
    easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
  });

  try {
    await animation.finished;
  } catch {
    // A new gesture can intentionally replace this settling animation.
  } finally {
    elements.shell.style.transform = '';
  }
}

function getPageScrollTop() {
  return Math.max(
    window.scrollY || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0,
  );
}

function setPageScrollTop(top) {
  const safeTop = Math.max(0, top);
  const bodyOwnsScroll = document.body.scrollTop > 0
    && window.scrollY === 0
    && document.documentElement.scrollTop === 0;

  if (bodyOwnsScroll) {
    document.body.scrollTop = safeTop;
    return;
  }

  window.scrollTo({ top: safeTop, left: 0 });
}

function channelDirection(currentChannel, nextChannel) {
  const currentIndex = swipeChannels.indexOf(currentChannel === 'favorites' ? 'mine' : currentChannel);
  const nextIndex = swipeChannels.indexOf(nextChannel === 'favorites' ? 'mine' : nextChannel);
  return nextIndex >= currentIndex ? 'forward' : 'back';
}

async function transitionChannel(direction, applyChange, options = {}) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targetScroll = options.targetScroll || 0;

  if (reduceMotion || !elements.shell.animate) {
    await applyChange();
    setPageScrollTop(targetScroll);
    return;
  }

  elements.shell.getAnimations().forEach((animation) => animation.cancel());
  const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const initialOffset = Number.isFinite(options.initialOffset) ? options.initialOffset : 0;
  const outgoingEnd = direction === 'forward' ? -Math.min(viewportWidth * 0.32, 180) : Math.min(viewportWidth * 0.32, 180);
  const incomingStart = direction === 'forward' ? Math.min(viewportWidth * 0.34, 190) : -Math.min(viewportWidth * 0.34, 190);
  const startOffset = initialOffset || 0;

  try {
    elements.shell.style.willChange = 'transform, opacity';
    const outgoingAnimation = elements.shell.animate([
      { opacity: 1, transform: `translate3d(${startOffset}px, 0, 0)` },
      { opacity: 0.9, transform: `translate3d(${outgoingEnd}px, 0, 0)` },
    ], {
      duration: 120,
      easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
      fill: 'both',
    });
    await outgoingAnimation.finished.catch(() => {});

    await applyChange();
    setPageScrollTop(targetScroll);
    elements.shell.style.transform = `translate3d(${incomingStart}px, 0, 0)`;
    elements.shell.style.opacity = '0.96';
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const incomingAnimation = elements.shell.animate([
      { opacity: 0.96, transform: `translate3d(${incomingStart}px, 0, 0)` },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    ], {
      duration: transitionMs - 40,
      easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
      fill: 'both',
    });

    await incomingAnimation.finished.catch(() => {});
  } finally {
    elements.shell.style.opacity = '';
    elements.shell.style.transform = '';
    elements.shell.style.willChange = '';
  }
}

function showErrorState(error) {
  elements.feed.innerHTML = `
    <article class="state-card is-error">
      <strong>这一天暂时没有加载成功</strong>
      <span>${escapeHtml(error.message)}</span>
    </article>
  `;
}

function render() {
  elements.feed.innerHTML = '';

  if (state.channel === 'mine') {
    renderMine();
    return;
  }

  if (!items.length) {
    const emptyTitle = state.channel === 'favorites' ? t('favoritesEmptyTitle') : t('noContentTitle');
    const emptyCopy = state.channel === 'favorites'
      ? t('favoritesEmptyCopy')
      : t('noContentCopy');
    elements.feed.innerHTML = `
      <article class="state-card">
        <strong>${emptyTitle}</strong>
        <span>${emptyCopy}</span>
      </article>
    `;
    updateProgress();
    return;
  }

  let lastCategory = '';

  items.forEach((item, index) => {
    const displayItem = localizedItem(item);

    if (displayItem.cat !== lastCategory) {
      const label = document.createElement('p');
      label.className = 'category-label';
      label.textContent = displayItem.cat;
      elements.feed.append(label);
      lastCategory = displayItem.cat;
    }

    elements.feed.append(createCard(item, index));
  });

  updateProgress();
}

function renderMine() {
  elements.progressCard.hidden = true;
  elements.doneCard.hidden = true;
  elements.feed.innerHTML = `
    <section class="settings-list" aria-label="${escapeHtml(t('mine'))}">
      <button class="settings-row" type="button" data-settings-action="favorites">
        <span>
          <strong>${escapeHtml(t('favorites'))}</strong>
          <em>${escapeHtml(t('favoriteHint'))}</em>
        </span>
        <b data-favorite-count>0</b>
      </button>
      <button class="settings-row" type="button" data-settings-action="language">
        <span>
          <strong>${escapeHtml(t('language'))}</strong>
          <em>${escapeHtml(state.language === 'en' ? t('english') : t('chinese'))}</em>
        </span>
        <b>${state.language === 'en' ? 'EN' : '中'}</b>
      </button>
      <button class="settings-row" type="button" data-settings-action="theme">
        <span>
          <strong>${escapeHtml(t('theme'))}</strong>
          <em>${escapeHtml(themeLabel(state.theme))}</em>
        </span>
        <b>${escapeHtml(themeBadge(state.theme))}</b>
      </button>
    </section>
  `;

  elements.feed.querySelector('[data-settings-action="favorites"]').addEventListener('click', async () => {
    state.channel = 'favorites';
    await loadAndRender();
  });

  elements.feed.querySelector('[data-settings-action="language"]').addEventListener('click', () => {
    renderLanguageModal();
    elements.languageModal.hidden = false;
  });

  elements.feed.querySelector('[data-settings-action="theme"]').addEventListener('click', () => {
    renderThemeModal();
    elements.themeModal.hidden = false;
  });

  syncDisplayableFavorites().then((favoriteItems) => {
    const count = elements.feed.querySelector('[data-favorite-count]');
    if (count) count.textContent = String(favoriteItems.length);
  });
}

function createCard(item) {
  const displayItem = localizedItem(item);
  const brief = summaryBrief(displayItem);
  const card = document.createElement('article');
  card.className = `news-card${state.muted.has(item.id) ? ' is-muted' : ''}`;
  card.dataset.id = item.id;

  const header = document.createElement('div');
  header.className = 'card-button';
  header.tabIndex = 0;
  header.setAttribute('role', 'button');
  header.setAttribute('aria-expanded', 'false');
  header.innerHTML = `
    <span class="summary-row">
      <span class="summary-copy">
        <span class="card-title">${annotateTerms(displayItem.title, item)}</span>
        <span class="card-take">${annotateTerms(brief, item)}</span>
        <span class="card-meta">${annotateTerms(displayItem.meta, item)}</span>
      </span>
      <span class="summary-controls">
        <span class="sketch-icon">${sketchIcon(item.icon, 38)}</span>
        <span class="summary-action">${escapeHtml(t('expand'))}${chevronControlHtml('down')}</span>
      </span>
    </span>
  `;

  const details = document.createElement('div');
  details.className = 'details';
  let detailsRendered = false;

  function ensureDetailsRendered() {
    if (detailsRendered) return;
    details.innerHTML = detailsHtml(localizedItem(item));
    detailsRendered = true;

    details.querySelectorAll('.event-image img').forEach((image) => {
      image.addEventListener('error', () => {
        const wrapper = image.closest('.event-image');
        if (wrapper) wrapper.remove();
      }, { once: true });
    });

    details.querySelector('[data-action="collapse"]').addEventListener('click', () => {
      collapseCard(card, header, 'bottom');
    });

    details.querySelector('[data-action="favorite"]').addEventListener('click', async () => {
      toggleSet(state.favorites, item.id);
      writeSet(storageKeys.favorites, state.favorites);

      if (state.channel === 'favorites') {
        await loadAndRender();
        return;
      }

      syncCardButtons(card, item.id);
    });

    details.querySelector('[data-action="mute"]').addEventListener('click', () => {
      state.muted.add(item.id);
      writeSet(storageKeys.muted, state.muted);
      card.classList.add('is-muted');
      syncCardButtons(card, item.id);
    });

    syncCardButtons(card, item.id);
  }

  header.addEventListener('click', (event) => {
    if (event.target.closest('[data-term]')) return;
    toggleCardOpen(card, header, item);
  });

  header.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.target.closest('[data-term]')) return;
    event.preventDefault();
    toggleCardOpen(card, header, item);
  });

  details.addEventListener('click', (event) => {
    const termButton = event.target.closest('[data-term]');
    if (!termButton) return;
    event.stopPropagation();
    openTermModal(termButton.dataset.term, item);
  });

  header.addEventListener('click', (event) => {
    const termButton = event.target.closest('[data-term]');
    if (!termButton) return;
    event.stopPropagation();
    openTermModal(termButton.dataset.term, item);
  });

  function toggleCardOpen(card, header, item) {
    if (card.classList.contains('is-card-animating')) return;

    if (card.classList.contains('is-open')) {
      collapseCard(card, header, 'top');
      return;
    }

    ensureDetailsRendered();
    openCard(card, header, item);
  }

  card.append(header, details);
  syncCardButtons(card, item.id);

  return card;
}

function detailsHtml(item) {
  return `
    <div class="divider"></div>
    <div class="takeaway-row">
      <div class="takeaway-copy">
        <p class="mini-label">${escapeHtml(t('conclusion'))}</p>
        <p class="take-text">${annotateTerms(item.take, item)}</p>
      </div>
      <span class="sketch-icon">${sketchIcon(item.icon, 58)}</span>
    </div>

    ${sectionTitle(t('facts'))}
    <div class="fact-grid">
      ${item.facts.map(([label, text]) => `
        <div class="fact">
          <strong>${annotateTerms(label, item)}</strong>
          <span>${annotateTerms(text, item)}</span>
        </div>
      `).join('')}
    </div>

    ${eventImageHtml(item)}

    ${item.visual ? `${sectionTitle(t('visual'))}${visualBlock(item.visual)}` : ''}

    ${sectionTitle(t('impact'))}
    <div class="impact-grid">
      ${item.impacts.map(([label, text]) => `
        <div class="impact">
          <strong>${annotateTerms(label, item)}</strong>
          <span>${annotateTerms(text, item)}</span>
        </div>
      `).join('')}
    </div>

    ${item.next.length ? `
      ${sectionTitle(t('next'))}
      <ol class="next-list">
        ${item.next.map((text, index) => `<li><span>${index + 1}</span>${annotateTerms(text, item)}</li>`).join('')}
      </ol>
    ` : ''}

    <div class="source-row">
      <span class="source-text">${annotateTerms(item.source, item)} · ${escapeHtml(item.updated)}</span>
      <span class="actions">
        <button class="pill-button" type="button" data-action="favorite"></button>
        <button class="pill-button is-danger" type="button" data-action="mute"></button>
        <button class="pill-button is-collapse" type="button" data-action="collapse">${escapeHtml(t('collapse'))}${chevronControlHtml('up')}</button>
      </span>
    </div>
  `;
}

async function openCard(card, header, item) {
  const details = card.querySelector('.details');
  if (!details) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  card.classList.add('is-open');
  header.setAttribute('aria-expanded', 'true');
  state.read.add(item.id);
  writeSet(storageKeys.read, state.read);
  updateProgress();

  if (reduceMotion || !details.animate) return;

  card.classList.add('is-card-animating', 'is-opening');
  const targetHeight = details.scrollHeight;
  const animation = details.animate([
    {
      clipPath: 'inset(0 0 100% 0)',
      height: '0px',
      opacity: 0,
      paddingTop: '0px',
      paddingBottom: '0px',
      transform: 'translateY(-6px)',
    },
    {
      clipPath: 'inset(0 0 0 0)',
      height: `${targetHeight}px`,
      opacity: 1,
      paddingTop: '2px',
      paddingBottom: '16px',
      transform: 'translateY(0)',
    },
  ], {
    duration: 300,
    easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
    fill: 'both',
  });

  try {
    await animation.finished;
  } catch {
    // A page change can intentionally interrupt this animation.
  } finally {
    animation.cancel();
    card.classList.remove('is-card-animating', 'is-opening');
  }
}

async function collapseCard(card, header, anchor) {
  if (card.classList.contains('is-card-animating')) return;

  const details = card.querySelector('.details');
  if (!details) return;

  const detailsHeight = details.getBoundingClientRect().height;
  const startScroll = getPageScrollTop();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const keepBottomStable = anchor === 'bottom';

  if (keepBottomStable) {
    document.documentElement.classList.add('is-card-collapsing');
  }

  header.setAttribute('aria-expanded', 'false');

  if (reduceMotion || !details.animate || detailsHeight <= 0) {
    card.classList.remove('is-open');
    if (keepBottomStable) {
      setPageScrollTop(Math.max(0, startScroll - detailsHeight));
    }
    document.documentElement.classList.remove('is-card-collapsing');
    return;
  }

  card.classList.add('is-card-animating', keepBottomStable ? 'is-collapsing-bottom' : 'is-collapsing-top');
  const keyframes = keepBottomStable
    ? [
      { clipPath: 'inset(0 0 0 0)', opacity: 1, transform: 'translateY(0)' },
      { clipPath: 'inset(100% 0 0 0)', opacity: 0.18, transform: 'translateY(8px)' },
    ]
    : [
      {
        clipPath: 'inset(0 0 0 0)',
        height: `${detailsHeight}px`,
        opacity: 1,
        paddingTop: '2px',
        paddingBottom: '16px',
        transform: 'translateY(0)',
      },
      {
        clipPath: 'inset(0 0 100% 0)',
        height: '0px',
        opacity: 0,
        paddingTop: '0px',
        paddingBottom: '0px',
        transform: 'translateY(-6px)',
      },
    ];
  const animation = details.animate(keyframes, {
    duration: keepBottomStable ? 280 : 260,
    easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
    fill: 'both',
  });

  try {
    await animation.finished;
  } catch {
    // A page change can intentionally interrupt this animation.
  } finally {
    if (keepBottomStable) {
      const spacer = document.createElement('div');
      spacer.className = 'collapse-layout-spacer';
      spacer.style.height = `${detailsHeight}px`;
      card.insertAdjacentElement('afterend', spacer);
      card.classList.remove('is-open');
      animation.cancel();
      card.classList.remove('is-card-animating', 'is-collapsing-bottom');
      await animateCollapseSpacer(spacer, startScroll, detailsHeight);
      spacer.remove();
      setPageScrollTop(Math.max(0, startScroll - detailsHeight));
      document.documentElement.classList.remove('is-card-collapsing');
      return;
    }

    card.classList.remove('is-open');
    animation.cancel();
    card.classList.remove('is-card-animating', 'is-collapsing-top');
  }
}

function animateCollapseSpacer(spacer, startScroll, height) {
  const duration = 210;
  return new Promise((resolve) => {
    const startedAt = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      spacer.style.height = `${height * (1 - eased)}px`;
      setPageScrollTop(Math.max(0, startScroll - height * eased));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
}

function chevronControlHtml(direction) {
  return `<span class="inline-chevron is-${direction}" aria-hidden="true"><span></span><span></span></span>`;
}

function sectionTitle(text) {
  return `<p class="section-title">${escapeHtml(text)}</p>`;
}

function visualBlock(visual) {
  const content = visual.type === 'chain'
    ? chainDiagramHtml(visual.nodes)
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

function buildLocalEdition(channel, dateKey) {
  if (dateKey !== todayKey && dateKey !== yesterdayKey) {
    throw new Error('这一天还没有保存的十条。');
  }

  const isAi = channel === 'ai';
  const topics = isAi
    ? (dateKey === todayKey ? aiTodayTopics : aiYesterdayTopics)
    : yesterdayDailyTopics;
  const channelInfo = channels[channel];

  return {
    dateKey,
    generatedAt: `${dateKey}T05:00:00+08:00`,
    title: isAi ? 'AI 行业十条' : 'DailyTen 每日十条',
    subtitle: isAi ? channelInfo.fallbackSubtitle : '昨天值得回看的是：政策、能源、科技和公共安全怎样落到普通人的生活里。',
    briefLabel: `${dateLabel(dateKey)} 10 条 · 约 8 分钟`,
    doneLabel: `${dateLabel(dateKey)}已读完`,
    readTimeMinutes: 8,
    items: topics.map((topic, index) => buildTopicItem(topic, channel, dateKey, index)),
  };
}

async function buildFavoritesEdition() {
  const favoriteItems = await syncDisplayableFavorites();

  return {
    dateKey: 'favorites',
    generatedAt: new Date().toISOString(),
    title: t('favoritesTitle'),
    subtitle: favoriteItems.length
      ? t('favoritesSubtitle')
      : channels.favorites.fallbackSubtitle,
    briefLabel: favoriteItems.length
      ? (state.language === 'en' ? `${favoriteItems.length} saved` : `已收藏 ${favoriteItems.length} 条`)
      : t('favoritesEmptyTitle'),
    doneLabel: state.language === 'en' ? 'Favorites finished' : '收藏已读完',
    readTimeMinutes: Math.max(1, Math.ceil(favoriteItems.length * 0.8)),
    items: favoriteItems,
  };
}

function buildMineEdition() {
  return {
    dateKey: 'mine',
    generatedAt: new Date().toISOString(),
    title: t('mineTitle'),
    subtitle: t('mineSubtitle'),
    briefLabel: '',
    doneLabel: '',
    readTimeMinutes: 0,
    items: [],
  };
}

async function collectAvailableFavoriteItems() {
  const editions = [];

  if (!latestDailyEdition) {
    try {
      latestDailyEdition = await fetchEdition('./data/today.json');
    } catch {
      latestDailyEdition = null;
    }
  }

  if (latestDailyEdition) {
    editions.push(latestDailyEdition);
  }

  const archivedDailyEditions = await Promise.all(
    (editionIndex && editionIndex.editions ? editionIndex.editions : [])
      .filter((entry) => entry.dateKey !== todayKey)
      .map(async (entry) => {
        try {
          return await fetchEdition(entry.path);
        } catch {
          return null;
        }
      }),
  );

  editions.push(...archivedDailyEditions.filter(Boolean));

  const archivedAiEditions = await Promise.all(
    (editionIndex && editionIndex.editions ? editionIndex.editions : [])
      .filter((entry) => entry.aiPath)
      .map(async (entry) => {
        try {
          return await fetchEdition(entry.aiPath);
        } catch {
          return null;
        }
      }),
  );

  editions.push(...archivedAiEditions.filter(Boolean));

  editions.push(
    buildLocalEdition('daily', yesterdayKey),
    buildLocalEdition('ai', todayKey),
    buildLocalEdition('ai', yesterdayKey),
  );

  const seen = new Set();
  return editions
    .reduce((allItems, edition) => allItems.concat(edition.items), [])
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
}

async function syncDisplayableFavorites() {
  const allItems = await collectAvailableFavoriteItems();
  const availableIds = new Set(allItems.map((item) => item.id));
  const favoriteItems = allItems.filter((item) => state.favorites.has(item.id));
  const cleanedFavorites = new Set([...state.favorites].filter((id) => availableIds.has(id)));

  if (cleanedFavorites.size !== state.favorites.size) {
    state.favorites = cleanedFavorites;
    writeSet(storageKeys.favorites, state.favorites);
  }

  return favoriteItems;
}

function buildTopicItem(topic, channel, dateKey, index) {
  const english = coalesce(topic.en, localTopicEnglish[topic.slug], null);

  return {
    id: `${channel}-${dateKey}-${topic.slug}`,
    slug: topic.slug,
    cat: topic.cat,
    icon: topic.icon,
    title: topic.title,
    brief: topic.brief || summaryBrief(topic),
    take: topic.take,
    meta: `${topic.region}｜${topic.meta}｜${formatChineseDate(dateKey)}`,
    facts: topic.facts,
    visual: topic.visual,
    impacts: topic.impacts,
    next: topic.next,
    source: topic.source,
    updated: `${formatChineseDate(dateKey)} 更新`,
    en: english ? {
      cat: english.cat,
      title: english.title,
      brief: english.brief || summaryBrief(english),
      take: english.take,
      meta: `${english.region} | ${english.meta} | ${formatEnglishDate(dateKey)}`,
      facts: english.facts,
      visual: { type: 'chain', label: english.visualLabel, nodes: english.nodes },
      impacts: english.impacts,
      next: english.next,
      source: english.source,
      updated: `Updated ${formatEnglishDate(dateKey)}`,
    } : null,
    sourceLinks: Array.isArray(topic.sourceLinks) ? topic.sourceLinks : [],
    eventImage: topic.eventImage || aiTopicEventImage(topic.slug),
  };
}

function aiTopicEventImage(slug) {
  return aiTopicImages[slug] || null;
}

function makeEventImage(url, zhAlt, enAlt, link, credit = '') {
  return {
    url,
    credit,
    link,
    zh: { alt: zhAlt, caption: zhAlt },
    en: { alt: enAlt, caption: enAlt },
  };
}

const aiTopicImages = {
  'gpt6-astra': makeEventImage(
    'https://www.all-ai.de/images/2-news/8-26/openai-astra-1600.webp',
    'OpenAI Astra 发布视觉图',
    'OpenAI Astra launch visual',
    'https://openai.com/index/gpt-6-astra/',
    'OpenAI',
  ),
  'enterprise-agents': makeEventImage(
    'https://cdn-cms.apito.ai/blog/images/news-openai-codex-gpt6-astra-signal--cover-7fb32167c8d5.webp',
    '企业级代码与 Agent 工具视觉图',
    'Enterprise coding and agent tool visual',
    'https://apito.ai/zh/blog/news/news-openai-codex-gpt6-astra-signal/',
    'Apito',
  ),
  'ai-browser': makeEventImage(
    'https://x0.ifengimg.com/ucms/2026_32/304B7C60D3533DBDD54D2967D025BB2F3FC1615E_size26_w900_h507.jpg',
    'AI 助手界面视觉图',
    'AI assistant interface visual',
    'https://tech.ifeng.com/c/8vQLdqUGmyN',
    'Ifeng Tech',
  ),
  'mcp-ecosystem': makeEventImage(
    'https://cdn-cms.apito.ai/blog/images/news-openai-codex-gpt6-astra-signal--cover-7fb32167c8d5.webp',
    '工具协议与开发者工作流视觉图',
    'Tool protocol and developer workflow visual',
    'https://apito.ai/zh/blog/news/news-openai-codex-gpt6-astra-signal/',
    'Apito',
  ),
  'ai-chip-demand': makeEventImage(
    'https://2b1c.cscec.com/xwzx/gsyw/202412/W020241218360665154863.jpg',
    '智算中心项目实景图',
    'AI compute-center project image',
    'https://www.chinanews.com.cn/cj/2026/09-01/10687882.shtml',
    'China News',
  ),
  'open-models': makeEventImage(
    'https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2025/10_oct/17_fri/img_1760710246027_473.jpg',
    'GPT-6 模型发布视觉图',
    'GPT-6 model release visual',
    'https://inshorts.com/en/news/gpt-6-is-expected-to-arrive-by-the-end-of-2025--report-1760710259078',
    'Inshorts',
  ),
  'ai-regulation': makeEventImage(
    'https://n.sinaimg.cn/spider20260902/629/w1270h959/20260902/0289-7b9a78fd2c9707098e0b9f3aea122589.png',
    '成都人工智能监管报道配图',
    'Chengdu AI regulation report image',
    'https://finance.sina.com.cn/tech/roll/2026-09-02/doc-iniqckee9182260.shtml',
    'Sina',
  ),
  'devtools-agent': makeEventImage(
    'https://cdn-cms.apito.ai/blog/images/news-openai-codex-gpt6-astra-signal--cover-7fb32167c8d5.webp',
    '代码 Agent 与开发工具视觉图',
    'Coding agent and developer tool visual',
    'https://apito.ai/zh/blog/news/news-openai-codex-gpt6-astra-signal/',
    'Apito',
  ),
  'ai-media': makeEventImage(
    'https://www.news.cn/fortune/20260903/190642596f8d4aed8595ae279f86e676/22921f52c382440d97e95dd1ed79d5da.jpg',
    '数字内容与平台经济报道配图',
    'Digital content and platform economy image',
    'https://www.news.cn/fortune/20260903/390361c5e8ac4a969c1908a5ad5a5a0a/c.html',
    'Xinhua',
  ),
  'voice-agents': makeEventImage(
    'https://japan.zdnet.com/storage/2025/10/09/60478e248ca20b13795f871513cee7f9/t/1280/960/d/251009_ai_as_1280_323829966.jpeg',
    'AI 云服务与交互场景配图',
    'AI cloud service and interaction visual',
    'https://japan.zdnet.com/article/35252231/',
    'ZDNET Japan',
  ),
  'ai-energy': makeEventImage(
    'https://ichef.bbci.co.uk/ace/branded_news/1200/cpsprodpb/2f90/live/402d60f0-a828-11f1-aed2-8d6da8d75094.jpg',
    'AI 数据中心与电力成本报道配图',
    'AI data center and energy cost report image',
    'https://www.bbc.co.uk/news/articles/cgl3we7wdr3o?at_medium=RSS&at_campaign=rss',
    'BBC News',
  ),
  'agent-memory': makeEventImage(
    'https://pasqualepillitteri.it/uploads/img/news/openai-astra-multi-agente-senato-cover.webp',
    '多 Agent 系统视觉图',
    'Multi-agent system visual',
    'https://pasqualepillitteri.it/en/news/9190/openai-astra-multi-agent-model-senate',
    'Pasquale Pillitteri',
  ),
  'anp-protocols': makeEventImage(
    'https://pasqualepillitteri.it/uploads/img/news/openai-astra-multi-agente-senato-cover.webp',
    'Agent 通信协议视觉图',
    'Agent communication protocol visual',
    'https://pasqualepillitteri.it/en/news/9190/openai-astra-multi-agent-model-senate',
    'Pasquale Pillitteri',
  ),
  'ai-office': makeEventImage(
    'https://cdn-cms.apito.ai/blog/images/news-openai-codex-gpt6-astra-signal--cover-7fb32167c8d5.webp',
    '办公与代码 AI 工作流视觉图',
    'Office and coding AI workflow visual',
    'https://apito.ai/zh/blog/news/news-openai-codex-gpt6-astra-signal/',
    'Apito',
  ),
  'robotics-ai': makeEventImage(
    'https://www.news.cn/tech/20260903/ae2c27b2145645d7aa02f2e3957068a0/20260903ae2c27b2145645d7aa02f2e3957068a0_2026090392bb21e171a44e64bd1636ea35928095.jpg',
    '北京亦庄机器人产业报道配图',
    'Beijing E-Town robotics industry report image',
    'https://www.news.cn/tech/20260903/ae2c27b2145645d7aa02f2e3957068a0/c.html',
    'Xinhua',
  ),
  'ai-security': makeEventImage(
    'https://staticr1.blastingcdncf.com/media/photogallery/2026/8/8/660x290/b_1200x675x95/openais-astra-solved-10-open-math-problems-for-2-dollars-000-cents-memeburn-c-creative-commons_3293647.jpg',
    'OpenAI Astra 安全能力视觉图',
    'OpenAI Astra safety capability visual',
    'https://openai.com/index/safety-overview-gpt-6-astra/',
    'OpenAI',
  ),
  'ai-healthcare': makeEventImage(
    'https://www.price.utah.edu/wp-content/uploads/2026/06/Tucker-Hermans-Class.jpg',
    '人机协作研究现场图',
    'Human-robot collaboration research image',
    'https://www.price.utah.edu/2026/09/01/u-researchers-join-nsf-center-that-will-study-how-robots-and-people-learn-to-live-and-work-together',
    'University of Utah',
  ),
  'ai-ads': makeEventImage(
    'https://www.news.cn/fortune/20260831/4120c91857b54add803d76426e6d2ed9/202608314120c91857b54add803d76426e6d2ed9_a214f4426aeb4dcb815cd24a7a8ac8cc.jpg',
    '智能消费与平台业务报道配图',
    'Smart consumption and platform business image',
    'https://www.news.cn/fortune/20260831/4120c91857b54add803d76426e6d2ed9/c.html',
    'Xinhua',
  ),
  'ai-coding-market': makeEventImage(
    'https://cdn-cms.apito.ai/blog/images/news-openai-codex-gpt6-astra-signal--cover-7fb32167c8d5.webp',
    'AI 编程工具报道视觉图',
    'AI coding tool report visual',
    'https://apito.ai/zh/blog/news/news-openai-codex-gpt6-astra-signal/',
    'Apito',
  ),
  'ai-devices': makeEventImage(
    'https://np-metadata.eastmoney.com/api/metadata.jpg?event=1&source=3&mode=2&type=1&id=202609023861873539',
    'AI 终端产品报道配图',
    'AI device product report image',
    'https://finance.eastmoney.com/a/202609023861873539.html',
    'Eastmoney',
  ),
  'ai-evals': makeEventImage(
    'https://www.all-ai.de/images/2-news/8-26/openai-astra-1600.webp',
    '模型评测与 Astra 能力视觉图',
    'Model evaluation and Astra capability visual',
    'https://openai.com/index/gpt-6-astra/',
    'OpenAI',
  ),
};

const localTopicEnglish = {
  'grid-storage': makeEnglishTopic('Energy', 'China storage projects are following AI power demand', 'AI data centers need steady electricity all day, not just occasional peak power. That is why storage is moving from a renewable-energy add-on to a practical backup for grids, factories, hospitals, and telecom networks.', 'China', 'storage and compute', 'Industry Watch', ['AI load', 'grid balancing', 'storage projects', 'stable power'], [['Demand', 'Data centers and industrial parks are asking for more continuous power.'], ['Cost', 'Cheaper batteries make more storage projects possible.'], ['Constraint', 'Safety rules and recycling capacity need to catch up with deployment.']], [['Reliability', 'More storage can soften power spikes and outages.'], ['Costs', 'It may reduce volatility over time, but construction costs still need to be paid for.'], ['City services', 'Hospitals, transit, and communications depend on steadier electricity.']], ['Watch whether new storage is tied directly to data centers.', 'Watch whether safety rules move as fast as construction.']),
  'aramco-france': makeEnglishTopic('Energy', 'Saudi Aramco and French firms sign large cooperation deals', 'Large energy deals can shape future oil, gas, chemicals, and lower-carbon investments. The effects eventually show up in transport costs, industrial supply chains, and household energy bills.', 'Saudi Arabia, France', 'energy cooperation', 'TradeArabia', ['energy investment', 'cross-border deals', 'projects', 'prices'], [['Scale', 'The agreements are at a multi-billion-dollar level.'], ['Scope', 'They cover energy, chemicals, and engineering services.'], ['Signal', 'Traditional energy supply chains are still being rebuilt and funded.']], [['Travel', 'Fuel expectations affect transport prices.'], ['Goods', 'Logistics costs can move into everyday prices.'], ['Transition', 'The lower-carbon share of the deals will show how fast change really is.']], ['Look for how much of the deal is low-carbon technology.', 'Look for clear project timelines.']),
  'city-consumption': makeEnglishTopic('China Economy', 'Chinese cities keep using vouchers to support demand', 'Local governments are trying to nudge people back into restaurants, travel, retail, appliances, and cars. The real question is whether short-term vouchers turn into steadier jobs and household cash flow.', 'China', 'consumer policy', 'Local Mock Archive', ['policy support', 'merchant signups', 'consumer spending', 'jobs'], [['Form', 'More programs are focused on services and small subsidies.'], ['Target', 'Dining, tourism, appliances, and autos remain key areas.'], ['Challenge', 'Household confidence matters more than a one-time discount.']], [['Budget', 'Some spending can get temporary relief.'], ['Jobs', 'Service orders need to recover before income improves.'], ['Small shops', 'Repeat customers matter more than one busy campaign.']], ['Watch whether subsidies continue into holidays.', 'Watch whether retail and employment data follow.']),
  'semiconductor-export': makeEnglishTopic('Tech Industry', 'Chip supply chains keep adjusting to export controls', 'Where chips, tools, and materials can move determines whether AI services, phones, cars, and cloud products stay available and affordable. Export rules are now a daily business constraint, not a distant policy topic.', 'Global', 'chip supply chain', 'Multi-source Watch', ['controls', 'company adjustments', 'supply shifts', 'device prices'], [['Scope', 'Advanced chips and manufacturing tools remain policy targets.'], ['Companies', 'Firms are looking for backup suppliers and regional partnerships.'], ['Effect', 'Supply-chain changes create short-term uncertainty.']], [['Electronics', 'Some devices may face price or supply swings.'], ['Jobs', 'Manufacturing and maintenance work may move with investment.'], ['AI services', 'Compute supply affects model pricing.']], ['Watch whether export rules become more detailed.', 'Watch whether alternative suppliers can scale.']),
  'public-health-alert': makeEnglishTopic('Public Safety', 'Health systems prepare more for extreme weather', 'Heat, heavy rain, and outages are not just weather stories. They quickly affect older people, children, chronic patients, outdoor workers, and anyone who depends on cooling, medicine, or transport.', 'Multiple regions', 'public health', 'Public Safety Watch', ['extreme weather', 'medical readiness', 'community alerts', 'vulnerable groups'], [['Risk', 'Extreme weather adds pressure on emergency rooms, power, and water.'], ['Response', 'Local clinics and service points are preparing alerts and temporary support.'], ['Priority', 'Older people, children, and outdoor workers need early help.']], [['Families', 'Water, medicine, and emergency contacts matter more.'], ['Travel', 'Warnings can affect commuting and school schedules.'], ['Communities', 'Neighbor support can fill gaps when services are stretched.']], ['Watch whether local warnings escalate.', 'Watch whether cooling and emergency sites open nearby.']),
  'shipping-delay': makeEnglishTopic('International Affairs', 'Some shipping routes still face detours and insurance pressure', 'Shipping risk can make cross-border goods slower and more expensive. That matters for online purchases, imported parts, and small businesses that depend on stable overseas supply.', 'Global', 'shipping risk', 'Shipping Watch', ['route risk', 'detours', 'insurance costs', 'retail prices'], [['Routes', 'Some carriers still avoid high-risk corridors.'], ['Costs', 'Fuel, insurance, and time costs rise together.'], ['Pass-through', 'Imported parts and consumer goods feel the impact early.']], [['Shopping', 'Cross-border parcels may take longer.'], ['Prices', 'Transport costs can enter shelf prices.'], ['Small business', 'Firms using imported parts face cash-flow pressure.']], ['Watch whether carriers return to normal routes.', 'Watch whether insurance rates keep rising.']),
  'ai-finance-risk': makeEnglishTopic('Public Safety', 'AI concentration risk in finance remains under scrutiny', 'If banks, funds, and payment systems use similar AI models, the same error can spread faster. That may affect fraud checks, loan approvals, insurance pricing, and account safety.', 'Global', 'fintech risk', 'Fintech Watch', ['shared models', 'automated decisions', 'risk amplification', 'human review'], [['Use cases', 'Fraud detection, customer service, advice, and credit are all adding AI.'], ['Risk', 'Model bias can create repeated mistakes.'], ['Oversight', 'Audits and appeal channels are becoming central.']], [['Loans', 'People need clearer reasons for approvals or rejections.'], ['Accounts', 'AI-generated scams are harder to spot.'], ['Insurance', 'Algorithmic pricing can affect fairness.']], ['Watch whether regulators require model audits.', 'Watch whether banks keep human review channels.']),
  'education-tools': makeEnglishTopic('AI', 'Schools keep testing AI study assistants', 'AI tutors can make explanations easier to get, but they also change homework, exams, and study habits. The goal is to help students understand, not let the tool do the thinking for them.', 'Global', 'edtech', 'Edtech Watch', ['study assistant', 'classroom pilots', 'homework rules', 'assessment changes'], [['Use', 'Schools and platforms are testing personalized tutoring.'], ['Concern', 'Ghostwritten homework and wrong explanations remain problems.'], ['Direction', 'More rules may require process records and teacher involvement.']], [['Students', 'They can get explanations faster but still need to check them.'], ['Parents', 'They need to tell tutoring apart from doing the work.'], ['Teachers', 'Assessment may focus more on process and expression.']], ['Watch whether schools publish clear AI-use rules.', 'Watch whether tools show sources and correction paths.']),
  'robotics-factory': makeEnglishTopic('Tech Industry', 'Robotics investment shifts toward flexible factories', 'Robots are moving from fixed stations toward lines that can change tasks more easily. That can alter factory jobs, delivery speed, and production costs.', 'Asia', 'smart manufacturing', 'Manufacturing Watch', ['sensors', 'robot scheduling', 'flexible lines', 'delivery speed'], [['Trend', 'Companies want machines that can switch tasks quickly.'], ['Cost', 'Cheaper hardware and better software expand pilots.'], ['Jobs', 'Maintenance, tuning, and data roles are growing.']], [['Work', 'Some repetitive jobs shrink while maintenance roles grow.'], ['Products', 'Small-batch goods may ship faster.'], ['Training', 'Frontline workers need more digital skills.']], ['Watch whether pilots become full deployments.', 'Watch whether safety rules fit human-robot work.']),
  'privacy-rules': makeEnglishTopic('Public Safety', 'Personal data rules keep tightening across regions', 'Data rules shape recommendations, finance, health records, and cross-border work. Ordinary users mainly need to know what they agreed to, how to withdraw consent, and how to delete or correct data.', 'Global', 'data governance', 'Privacy Watch', ['data collection', 'consent records', 'cross-border transfer', 'user rights'], [['Regulation', 'More regions are defining data-use boundaries.'], ['Companies', 'Compliance and audit costs are rising.'], ['Users', 'Consent, withdrawal, and correction rights matter more.']], [['Privacy', 'Apps need clearer explanations of data use.'], ['Experience', 'Stricter rules may reduce some personalization.'], ['Work', 'Cross-border teams may need different data tools.']], ['Watch for clearer personal data dashboards.', 'Watch whether cross-border rules affect common services.']),
  'enterprise-agents': makeEnglishTopic('Agent', 'Enterprise agents move from demos to real workflows', 'More AI products now handle reports, customer service, sales follow-up, and internal search. The hard part is no longer whether they can chat, but whether they can finish work reliably with permissions and logs.', 'Global', 'enterprise software', 'AI Industry Watch', ['task planning', 'tool use', 'permissions', 'workflow delivery'], [['Shift', 'Agent products are connecting to internal company systems.'], ['Hard part', 'Permissions, audit logs, and rollback matter as much as model quality.'], ['Opportunity', 'Repetitive knowledge work is the first area to change.']], [['Work', 'People will spend more time setting rules and checking outputs.'], ['Management', 'Teams need clear responsibility boundaries.'], ['Buying software', 'Security and integrations become key purchase factors.']], ['Watch whether pilots turn into paid long-term contracts.', 'Watch whether permission audits keep up with automation.']),
  'ai-browser': makeEnglishTopic('AI Products', 'AI browsers and search assistants keep fighting for the main entry point', 'Browsers, search engines, and personal assistants all want to become the place where people start asking questions. Answers may arrive faster, but users become more dependent on how platforms rank, cite, and explain sources.', 'Global', 'AI search', 'Product Watch', ['web understanding', 'answer generation', 'source citations', 'user entry point'], [['Competition', 'Search, browsers, and assistants are blending together.'], ['Trust', 'Citation quality and correction paths decide whether users can rely on answers.'], ['Business model', 'Ads and subscriptions are still being tested.']], [['Information', 'Search steps may shrink, but source-checking matters more.'], ['Creators', 'Traffic distribution may keep changing.'], ['Privacy', 'Browsing context becomes sensitive data.']], ['Watch whether answers show clear citations.', 'Watch whether the default search entry point changes.']),
  'mcp-ecosystem': makeEnglishTopic('AI Infrastructure', 'Tool protocols keep expanding around enterprise integration', 'Tool protocols such as MCP make it easier for models to call documents, databases, and business systems. The useful part is integration; the risky part is that permissions, logs, and safety boundaries become much more important.', 'Global', 'tool protocols', 'Developer Watch', ['protocol APIs', 'tool connections', 'permission audit', 'enterprise rollout'], [['Direction', 'Developers want more standardized tool connections.'], ['Benefit', 'Apps may not need one-off model integrations each time.'], ['Risk', 'Tool calls expand the damage from bad instructions or leaks.']], [['Developers', 'Integration costs may fall.'], ['Enterprises', 'Security review becomes stricter.'], ['Users', 'Automation gets stronger, but key actions still need confirmation.']], ['Watch whether major platforms support common protocols.', 'Watch whether permission revocation and logs are easy to inspect.']),
  'ai-chip-demand': makeEnglishTopic('Chips and Compute', 'AI chip demand keeps reshuffling supply chains', 'Training and inference need chips, memory, networking, data centers, and electricity at the same time. That pressure can change cloud prices and decide which AI products are actually available.', 'Global', 'compute supply chain', 'Supply Chain Watch', ['model demand', 'chip orders', 'data centers', 'service pricing'], [['Demand', 'Inference traffic is becoming long-term compute demand.'], ['Bottleneck', 'Packaging, memory, and networking gear are also critical.'], ['Split', 'Large firms and small teams face very different compute costs.']], [['Developers', 'Compute budgets shape how quickly products can be tested.'], ['Users', 'Advanced AI features may move further into paid plans.'], ['Energy', 'Data-center electricity pressure keeps rising.']], ['Watch whether inference chips ease supply pressure.', 'Watch whether cloud providers change prices.']),
  'open-models': makeEnglishTopic('Model Ecosystem', 'Open models keep narrowing the baseline capability gap', 'Better open models lower the cost for startups and companies that want more control. But production use still depends on deployment, security, evaluation, and licensing, not just benchmark scores.', 'Global', 'model ecosystem', 'Model Watch', ['open models', 'fine-tuning', 'enterprise evaluation', 'lower cost'], [['Progress', 'More models are good enough for code, long text, and multilingual work.'], ['Advantage', 'Private deployment and cost control are more flexible.'], ['Limit', 'Security testing and operations still require skill.']], [['Startups', 'Prototype costs fall.'], ['Enterprises', 'Sensitive data can stay in-house.'], ['Users', 'There are more product choices, but quality varies more.']], ['Watch for reliable third-party evals.', 'Watch whether commercial licenses are clear.']),
  'ai-regulation': makeEnglishTopic('AI Governance', 'AI regulation is moving from principles to responsibility', 'Regulators are no longer only saying AI should be safe. They are asking who is responsible, how systems are audited, and how people can appeal when AI decisions affect finance, health, education, or hiring.', 'Global', 'AI regulation', 'Policy Watch', ['new rules', 'model audits', 'responsibility', 'appeals'], [['Focus', 'High-risk uses face clearer transparency and audit duties.'], ['Companies', 'Pre-launch testing and post-launch logs matter more.'], ['Users', 'People affected by AI decisions need a way to appeal.']], [['Jobs', 'Automated resume screening needs explanations.'], ['Finance', 'Credit and insurance pricing must avoid discrimination.'], ['Health', 'Doctor responsibility and AI advice boundaries must be clear.']], ['Watch whether regulators publish practical checklists.', 'Watch whether companies disclose where AI is used.']),
  'devtools-agent': makeEnglishTopic('Developer Tools', 'Coding agents are entering team workflows', 'Coding assistants are moving beyond autocomplete into issue breakdown, tests, refactors, and code review. Teams need new quality gates so speed does not quietly create regressions.', 'Global', 'developer tools', 'Developer Watch', ['task understanding', 'code changes', 'test runs', 'review and merge'], [['Shift', 'Tools are becoming collaborators, not just solo helpers.'], ['Risk', 'Wrong edits and hidden dependencies need test coverage.'], ['Opportunity', 'Routine bug fixes and scaffolding can move faster.']], [['Developers', 'More time goes into defining tasks and reviewing results.'], ['Teams', 'They need rules for what AI can change.'], ['Products', 'Small features may ship faster.']], ['Watch whether tools can run tests and explain changes.', 'Watch how companies handle permissions and code privacy.']),
  'ai-media': makeEnglishTopic('Content and Copyright', 'AI content platforms face more pressure on copyright and labeling', 'As generated text, images, videos, and summaries spread, users need to know what the source was, whether content was licensed, and whether humans reviewed it.', 'Global', 'content industry', 'Media Watch', ['training data', 'generation', 'licensing talks', 'source labels'], [['Dispute', 'Rights holders want more transparency about data use.'], ['Platforms', 'Labeling and detection tools are improving.'], ['Business', 'Licensing and revenue sharing are still unsettled.']], [['Readers', 'Source labels matter more.'], ['Creators', 'Licensing and income models may be rewritten.'], ['Brands', 'Misused material can create legal risk.']], ['Watch whether platforms clearly label AI content.', 'Watch whether licensing models stabilize.']),
  'voice-agents': makeEnglishTopic('AI Products', 'Voice agents keep expanding into service and coaching', 'Voice makes AI easier to use, especially in customer service, language practice, and sales training. It also raises sharper questions about recordings, consent, identity, and when a person should take over.', 'Global', 'voice AI', 'Product Watch', ['real-time voice', 'task execution', 'service quality', 'privacy boundaries'], [['Use cases', 'Customer service, language learning, and sales training are early markets.'], ['Experience', 'Low latency and interruption handling are key.'], ['Risk', 'Recording and identity data need clearer consent.']], [['Users', 'Tasks can feel more natural, but recording notices matter.'], ['Companies', 'Service costs may fall while quality responsibility rises.'], ['Workers', 'Training may feel more like live coaching.']], ['Watch whether products offer recording deletion.', 'Watch whether complex cases can transfer to a human.']),
  'ai-energy': makeEnglishTopic('Compute and Energy', 'AI data-center power is becoming an industry constraint', 'AI competition is not only about software. It is also about electricity, land, water, grid capacity, and storage. Those physical constraints shape where AI services can grow.', 'Global', 'data-center energy', 'Energy Watch', ['model demand', 'data centers', 'power contracts', 'community impact'], [['Demand', 'Inference services create more continuous electricity use.'], ['Constraint', 'Grid access and cooling resources affect site choices.'], ['Trend', 'More projects are tied to clean power and storage.']], [['Residents', 'Local power and water debates may increase.'], ['Companies', 'Cloud prices reflect energy costs.'], ['Environment', 'The clean-power share determines carbon pressure.']], ['Watch whether new data centers disclose power sources.', 'Watch whether local communities get a say.']),
  'agent-memory': makeEnglishTopic('Agent', 'Agent products start emphasizing memory and task context', 'Memory makes an assistant feel more like a long-running coworker. But users and companies need to know what is saved, who can see it, and whether it can be corrected or deleted.', 'Global', 'agent memory', 'AI Industry Watch', ['preferences', 'task context', 'permissions', 'ongoing collaboration'], [['Direction', 'More products treat long-term context as a core feature.'], ['Problem', 'Memory accuracy and privacy boundaries still need proof.'], ['Adoption', 'Enterprise use requires admin controls and audits.']], [['Personal use', 'Assistants become easier to work with, but saved information needs review.'], ['Companies', 'Permission management becomes a buying requirement.'], ['Safety', 'Wrong memory can affect later decisions.']], ['Watch whether users can view and delete memory.', 'Watch whether admins can block sensitive information.']),
  'anp-protocols': makeEnglishTopic('AI Infrastructure', 'Agent-to-agent protocol talk is heating up', 'If agents can exchange tasks, identity, and results, automation becomes more powerful. But standards, trust, authentication, and verification need to mature before that is safe at scale.', 'Global', 'agent protocols', 'Developer Watch', ['identity', 'task negotiation', 'result verification', 'cross-app work'], [['Trend', 'Developer communities are discussing agent interoperability.'], ['Value', 'Cross-tool cooperation can reduce manual copy-paste work.'], ['Risk', 'Fake identity and bad handoffs can amplify mistakes.']], [['Users', 'Cross-app tasks could feel smoother.'], ['Developers', 'Authentication and permissions become central.'], ['Enterprises', 'Automation boundaries must be traceable.']], ['Watch whether a standard gets adopted by major platforms.', 'Watch whether the protocol includes security certification.']),
  'ai-office': makeEnglishTopic('AI Products', 'Office suites keep adding AI to documents and spreadsheets', 'AI in everyday office tools is useful when it reduces searching, cleanup, and checking, not only when it writes faster. The hard part is fitting into permissions and real workflows.', 'Global', 'office AI', 'Product Watch', ['document understanding', 'spreadsheet cleanup', 'meeting summaries', 'task follow-up'], [['Features', 'Summaries, rewriting, and data cleanup remain common entry points.'], ['Competition', 'Platforms stress integration with existing permissions.'], ['Limit', 'Complex business judgment still needs people.']], [['Office work', 'Repetitive cleanup may shrink.'], ['Managers', 'Meetings and task tracking become easier to review.'], ['Privacy', 'Companies need to know whether documents train models.']], ['Watch whether AI features are on by default.', 'Watch whether companies can opt out of training.']),
  'robotics-ai': makeEnglishTopic('Robotics', 'Embodied AI keeps attracting factory and logistics pilots', 'Large models make robots better at understanding instructions, but stable, safe, low-cost deployment is still hard. Warehouses, inspection, and simple assembly are the first places to watch.', 'Global', 'robotics AI', 'Industry Watch', ['vision', 'motion planning', 'pilots', 'safety checks'], [['Use', 'Warehousing, inspection, and simple assembly are common pilots.'], ['Bottleneck', 'Hardware cost and safety certification limit scale.'], ['Trend', 'Better models help robots adapt to changing environments.']], [['Jobs', 'Repetitive physical work may change.'], ['Logistics', 'Warehouse efficiency may improve.'], ['Safety', 'Human-robot work needs strict standards.']], ['Watch whether pilots expand to real production lines.', 'Watch how accident responsibility is defined.']),
  'ai-security': makeEnglishTopic('AI Security', 'Companies add AI risk to cybersecurity workflows', 'AI tools can help defenders, but they also widen the attack surface. The practical question is who called which tool, what data it touched, and whether risky actions require confirmation.', 'Global', 'AI security', 'Security Watch', ['model access', 'tool calls', 'audit logs', 'risk response'], [['Shift', 'Security teams are reviewing AI tool permissions.'], ['Risk', 'Prompt injection and data leaks remain central concerns.'], ['Controls', 'Logs, isolation, and human confirmation are becoming common.']], [['Employees', 'Customer data should not be pasted into random tools.'], ['Companies', 'Central purchasing and permission rules are needed.'], ['Users', 'Responsibility for data leaks gets more attention.']], ['Watch whether companies create AI tool allowlists.', 'Watch whether sensitive actions need second confirmation.']),
  'ai-healthcare': makeEnglishTopic('AI Applications', 'Medical AI focuses more on responsibility after diagnosis support', 'AI can help doctors read images and organize records, but patients need to know whether a doctor reviewed the result, who is responsible for mistakes, and how medical data is protected.', 'Global', 'medical AI', 'Health Tech Watch', ['record cleanup', 'image support', 'doctor review', 'responsibility'], [['Progress', 'Hospitals keep testing diagnosis support and documentation tools.'], ['Limit', 'Clinical responsibility cannot be handed fully to a model.'], ['Requirement', 'Data compliance and explainable results matter.']], [['Patients', 'Visits may become faster.'], ['Doctors', 'Paperwork pressure may fall.'], ['Privacy', 'Medical data use must be transparent.']], ['Watch whether tools have clinical validation.', 'Watch whether hospitals disclose AI involvement.']),
  'ai-ads': makeEnglishTopic('AI Commercialization', 'AI ads and recommendations keep changing platform revenue', 'Platforms can use AI to make and target ads faster. That helps businesses, but it also makes it harder for users to separate ordinary content from paid persuasion.', 'Global', 'platform economy', 'Business Watch', ['content generation', 'targeting', 'conversion', 'labeling'], [['Trend', 'Ad tools are becoming more automated.'], ['Benefit', 'Small merchants can create material more easily.'], ['Risk', 'Misleading content and over-personalization are harder to police.']], [['Consumers', 'Ad labels matter more.'], ['Merchants', 'Ad costs and results may split further.'], ['Platforms', 'Transparency becomes a regulatory focus.']], ['Watch whether AI ads are clearly labeled.', 'Watch whether platforms limit sensitive categories.']),
  'ai-coding-market': makeEnglishTopic('Developer Tools', 'AI coding tools move from autocomplete to project-level work', 'Tools can write code, run tests, and fix bugs, but teams need stability, explanations, and respect for existing code more than raw generation speed.', 'Global', 'coding agents', 'Developer Watch', ['task breakdown', 'code generation', 'test validation', 'merge review'], [['Capability', 'More tools support cross-file edits.'], ['Risk', 'Hidden regressions and dependency mistakes remain common.'], ['Trend', 'Testing and code review are becoming key selling points.']], [['Developers', 'The role shifts toward architecture and review.'], ['Teams', 'They need rules for which files AI can change.'], ['Companies', 'Speed and quality control must be balanced.']], ['Watch whether tools explain each change.', 'Watch whether they run tests by default.']),
  'ai-devices': makeEnglishTopic('Consumer AI', 'Phone and PC makers push AI into the operating system', 'When AI moves from apps into the operating system, it affects photos, search, notifications, writing, and support. It also becomes a reason companies may give users to upgrade devices.', 'Global', 'on-device AI', 'Consumer Tech Watch', ['on-device models', 'system features', 'privacy policy', 'hardware upgrades'], [['Direction', 'Makers are putting AI into default system entry points.'], ['Difference', 'On-device versus cloud processing changes privacy.'], ['Business', 'Some premium features may be tied to new hardware.']], [['Users', 'Common actions become more automated.'], ['Privacy', 'People need to know whether data leaves the device.'], ['Budget', 'AI features may become part of upgrade pressure.']], ['Watch whether older devices get new features.', 'Watch whether cloud processing can be turned off.']),
  'ai-evals': makeEnglishTopic('Model Evaluation', 'AI evaluation shifts from leaderboards to real tasks', 'Simple benchmark scores are no longer enough. Companies care more about whether a model is stable in real workflows, how much it costs, and what kinds of mistakes it makes.', 'Global', 'AI evaluation', 'Model Watch', ['task sets', 'error categories', 'cost checks', 'production monitoring'], [['Shift', 'General scores do not prove business value.'], ['Practice', 'Companies are building their own evaluation sets.'], ['Key point', 'Failure cases are often more useful than average scores.']], [['Procurement', 'Real task trials matter more.'], ['Developers', 'Live monitoring becomes necessary.'], ['Users', 'The gap between marketing and real experience becomes easier to see.']], ['Watch whether vendors publish failure cases.', 'Watch whether companies build internal evals.']),
};

function makeEnglishTopic(cat, title, take, region, meta, source, nodes, facts, impacts, next) {
  return {
    cat,
    title,
    take,
    region,
    meta,
    source,
    nodes,
    facts,
    impacts,
    next,
    visualLabel: 'Impact chain',
  };
}

const yesterdayDailyTopics = [
  makeTopic('grid-storage', '能源', 'refinery', '中国储能项目继续围绕算力需求扩张', 'AI 数据中心带来更稳定、更高负荷的用电需求，储能从新能源配套变成电网韧性的关键组件。', '中国', '储能与算力', '行业观察', ['算力负荷', '电网调节', '储能部署', '供电稳定'], [['需求', '数据中心和工业园区正在增加连续供电需求。'], ['成本', '储能价格下降让更多项目有机会落地。'], ['约束', '安全标准和回收体系仍需要跟上扩张速度。']], [['用电可靠', '更多储能能缓冲高峰用电和突发波动。'], ['生活成本', '长期可能降低峰谷波动，但短期建设成本仍会被消化。'], ['城市服务', '医院、交通和通信更依赖稳定电力。']], ['新增储能项目是否与数据中心直接绑定。', '安全监管标准是否同步升级。']),
  makeTopic('aramco-france', '能源', 'oil', '沙特阿美与法国企业签署大额合作协议', '大型能源合作会影响未来油气、化工和低碳技术投资，最终传导到交通、物流和家庭能源成本。', '沙特、法国', '能源合作', 'TradeArabia', ['能源投资', '跨国合作', '项目落地', '价格传导'], [['规模', '协议金额达到数十亿美元级别。'], ['领域', '合作覆盖能源、化工和相关工程服务。'], ['信号', '传统能源供应链仍在重组和投入。']], [['出行', '能源供给预期会影响燃油和运输价格。'], ['商品价格', '物流成本会继续影响日用品售价。'], ['长期转型', '低碳项目占比决定转型速度。']], ['协议中低碳技术的占比。', '项目投产时间表是否清晰。']),
  makeTopic('city-consumption', '中国经济', 'chart', '多地继续用消费券和服务补贴稳需求', '地方刺激消费能短期带动餐饮、文旅和零售，但真正重要的是能否转化为稳定就业和家庭现金流。', '中国', '消费政策', '本地历史样例', ['政策发放', '商户参与', '居民消费', '就业回流'], [['形式', '地方政策更多转向服务消费和小额补贴。'], ['目标', '餐饮、文旅、家电和汽车仍是重点。'], ['难点', '居民信心比单次补贴更关键。']], [['家庭预算', '部分消费支出能得到短期缓冲。'], ['就业', '服务业订单回升才会真正影响收入。'], ['商家', '小店更关心活动后的复购。']], ['补贴是否持续到节假日。', '就业和零售数据是否跟上。']),
  makeTopic('semiconductor-export', '科技产业', 'ai', '芯片供应链继续围绕出口管制调整', '芯片、设备和材料的流向决定 AI 服务、手机、汽车和云计算产品的供给稳定性。', '全球', '芯片供应链', '多来源观察', ['管制变化', '企业调整', '供应迁移', '终端价格'], [['范围', '先进芯片和制造设备仍是各国政策焦点。'], ['企业', '厂商继续寻找替代供应和区域合作。'], ['影响', '供应链调整会增加短期不确定性。']], [['电子产品', '部分设备可能面临供货或价格波动。'], ['工作机会', '制造和维护岗位需求随投资转移。'], ['AI 服务', '算力供给会影响模型服务价格。']], ['出口规则是否进一步细化。', '替代供应能否稳定量产。']),
  makeTopic('public-health-alert', '公共安全', 'alert', '多地公共卫生系统加强极端天气应对', '高温、暴雨和停电不只是天气新闻，会直接影响老人、儿童、慢病患者和户外工作者。', '多地', '公共卫生', '公共安全观察', ['极端天气', '医疗准备', '社区通知', '重点人群'], [['风险', '极端天气增加急诊、用电和供水压力。'], ['措施', '基层机构加强提醒和临时服务点。'], ['重点', '老人、儿童和户外劳动者最需要提前照护。']], [['家庭', '需要准备饮水、药品和备用联系方式。'], ['出行', '天气预警会影响通勤和学校安排。'], ['社区', '邻里互助能补上服务空档。']], ['本地预警是否升级。', '社区避暑和应急点是否开放。']),
  makeTopic('shipping-delay', '国际局势', 'ship', '部分国际航线仍面临绕行和保险成本压力', '航运风险会让跨境商品变慢、变贵，影响海淘、进口零件和依赖外贸的小企业。', '全球', '航运风险', '航运观察', ['航线风险', '船公司绕行', '保险成本', '到货价格'], [['路线', '部分船公司继续避开高风险航道。'], ['成本', '燃油、保险和时间成本同步增加。'], ['传导', '进口零件和消费品最先感受到波动。']], [['海淘', '跨境包裹可能变慢。'], ['物价', '运输成本可能进入商品售价。'], ['小企业', '依赖进口零件的企业现金流承压。']], ['船公司是否恢复原航线。', '保险费率是否继续上调。']),
  makeTopic('ai-finance-risk', '公共安全', 'alert', '金融机构使用 AI 的集中风险继续受关注', '当银行、基金和支付系统使用相似模型时，错误可能被更快复制，普通人会在信贷、保险和账户安全上感受到影响。', '全球', '金融科技风险', '金融科技观察', ['模型共用', '自动决策', '风险放大', '人工复核'], [['场景', '反欺诈、客服、投顾和信贷都在接入 AI。'], ['风险', '模型偏差可能造成相似错误。'], ['监管', '审计和申诉机制成为重点。']], [['借贷', '审批结果需要更透明的解释。'], ['账户安全', 'AI 诈骗内容更难识别。'], ['保险', '算法定价会影响保费公平性。']], ['监管是否要求模型审计。', '银行是否保留人工复核渠道。']),
  makeTopic('education-tools', 'AI', 'code', '教育场景继续试用 AI 学习助手', 'AI 学习工具能降低答疑门槛，但也会改变作业、考试和学习习惯，关键是怎么让它帮理解而不是替代思考。', '全球', '教育科技', '教育科技观察', ['学习助手', '课堂试点', '作业边界', '评估调整'], [['应用', '学校和平台继续测试个性化答疑。'], ['争议', '作业代写和错误解释仍是主要担忧。'], ['方向', '更多规则会要求过程记录和教师参与。']], [['学生', '能更快获得解释，但要学会核对。'], ['家长', '需要判断工具是在辅导还是代做。'], ['教师', '评价方式会更重视过程和表达。']], ['学校是否公布使用边界。', '工具是否提供引用和纠错机制。']),
  makeTopic('robotics-factory', '科技产业', 'drone', '机器人产线投资继续向柔性制造转移', '机器人从固定工位走向更灵活的产线，会改变工厂岗位结构，也会影响商品交付速度和生产成本。', '亚洲', '智能制造', '制造业观察', ['传感器', '机器人调度', '柔性产线', '交付效率'], [['趋势', '企业更重视可快速切换任务的设备。'], ['成本', '硬件降价和软件成熟推动试点扩大。'], ['岗位', '维护、调试和数据岗位需求增加。']], [['就业', '重复性岗位减少，维护类岗位增加。'], ['商品', '小批量产品可能更快交付。'], ['培训', '一线工人需要更多数字技能。']], ['试点能否转为规模部署。', '安全标准是否适应人机协作。']),
  makeTopic('privacy-rules', '公共安全', 'alert', '个人数据授权和跨境流动规则继续收紧', '数据规则会影响应用推荐、金融服务、医疗记录和跨境办公，普通人最需要看懂授权边界和删除权。', '全球', '数据治理', '隐私观察', ['数据收集', '授权记录', '跨境传输', '个人权利'], [['监管', '多个地区继续细化数据使用边界。'], ['企业', '合规成本和审计要求上升。'], ['用户', '授权、撤回和纠错变得更重要。']], [['隐私', '应用需要更清楚说明数据用途。'], ['服务体验', '更严格规则可能影响个性化推荐。'], ['工作', '跨境团队的数据工具选择会受影响。']], ['是否出现更清晰的个人数据面板。', '跨境数据规则是否影响常用服务。']),
];

function gpt6AstraTopic() {
  const topic = makeTopic(
    'gpt6-astra',
    '前沿模型',
    'ai',
    'OpenAI 把 GPT-6 Astra 推成“AGI 时代”的信号',
    'OpenAI 于 9 月 3 日发布 GPT-6 Astra。真正值得看的是，它不只是“回答更强”，而是更像一个能操作电脑、浏览网页、写代码、做研究并接管多步骤工作的系统。OpenAI 高管 Greg Brockman 把这次发布称作可能被回看为 AGI 时代的起点；但这不等于普通人今天就拿到万能助手，开放仍在分批进行，敏感网络安全能力也有额外限制。',
    '全球',
    'AGI 与模型发布',
    'OpenAI',
    ['OpenAI 官方发布', 'AGI 时代表述', '电脑操作能力', '分批开放与安全限制'],
    [['AGI 说法', 'Brockman 把 Astra 描述成可能被未来回看为 AGI 时代起点，但 AGI 本身仍没有统一定义。'], ['真正变化', '重点是模型能更主动地操作工具和电脑，而不只是给出一段更漂亮的回答。'], ['开放限制', '先给部分组织使用，更多 ChatGPT、API 和云平台用户随后分批获得。']],
    [['普通用户', '你短期内可能还看不到入口，但未来 AI 会更像能代办整套任务的助手。'], ['开发者和公司', '更强的电脑使用和工作流能力，会直接影响软件开发、数据分析、客服和研究流程。'], ['安全边界', '越能代办真实操作，越需要权限、审计、撤销和人工确认。']],
    ['普通账号、API 和企业客户什么时候真正拿到。', '它在真实任务里是否稳定，而不是只在发布演示里好看。'],
  );
  topic.brief = '真正的大新闻不是“模型又强了”，而是 OpenAI 开始把它当成 AGI 时代入口来讲，但开放和安全限制还没跟上。';
  topic.en = makeEnglishTopic(
    'Frontier Models',
    'OpenAI frames GPT-6 Astra as a possible start of the AGI era',
    'OpenAI introduced GPT-6 Astra on September 3. The point is not just that the model is stronger. Astra is being presented as a system that can operate computers, browse the web, write code, do research, and carry more of a full workflow. OpenAI president Greg Brockman described the launch as something future people may look back on as the start of the AGI era, though AGI is still a contested term and access remains limited.',
    'Global',
    'AGI and frontier models',
    'OpenAI',
    ['Official launch', 'AGI-era framing', 'Computer-use ability', 'Limited rollout and safety controls'],
    [['AGI framing', 'Brockman framed Astra as a possible marker for the beginning of the AGI era, while the meaning of AGI remains debated.'], ['Real change', 'The shift is toward AI that can use tools and computers to finish work, not just produce better text.'], ['Access', 'The rollout begins with selected organizations before reaching more ChatGPT, API, and cloud users.']],
    [['Everyday users', 'You may not see it in your account right away, but this is the direction of AI assistants that can handle whole tasks.'], ['Developers and companies', 'Computer use and workflow execution could change coding, analysis, customer support, and research work.'], ['Safety', 'The more a model can act in real systems, the more permissions, audit logs, rollback, and human confirmation matter.']],
    ['Watch when access reaches normal accounts, API users, and enterprises.', 'Watch whether it stays reliable on real tasks, not only in launch demos.'],
  );
  topic.en.brief = 'The real story is not “a stronger model”; OpenAI is framing Astra as an AGI-era step, while access and safety limits are still unresolved.';
  topic.sourceLinks = [{
    title: 'GPT-6 Astra: A new generation of intelligence',
    url: 'https://openai.com/index/gpt-6-astra/',
    publisher: 'OpenAI',
  }, {
    title: 'Welcome to the AGI era, OpenAI says as GPT-6 Astra debuts',
    url: 'https://www.axios.com/2026/09/03/openai-astra-gpt-6-agi-brockman',
    publisher: 'Axios',
  }];
  return topic;
}

const aiTodayTopics = [
  gpt6AstraTopic(),
  makeTopic('enterprise-agents', 'Agent', 'code', '企业 Agent 从演示走向流程接管', '越来越多 AI 产品开始处理报表、客服、销售跟进和内部检索，重点不再是会聊天，而是能不能稳定完成工作。', '全球', '企业软件', 'AI 行业观察', ['任务分解', '工具调用', '权限控制', '流程交付'], [['变化', 'Agent 产品开始绑定企业内部系统。'], ['难点', '权限、审计和错误回滚比模型能力更关键。'], ['机会', '重复性知识工作最先被改造。']], [['工作方式', '人会更多检查结果和设定规则。'], ['团队管理', '流程责任边界需要写清楚。'], ['采购', '企业会更看重安全和集成能力。']], ['真实客户是否从试点转为长期合同。', '权限审计能否跟上自动执行。']),
  makeTopic('ai-browser', 'AI 产品', 'ai', 'AI 浏览器和搜索助手继续争夺入口', '浏览器、搜索和个人助手都想成为信息入口，用户获得答案更快，但也更依赖平台如何排序、引用和解释来源。', '全球', 'AI 搜索', '产品观察', ['网页理解', '答案生成', '引用来源', '用户入口'], [['竞争', '搜索、浏览器和助手产品边界正在变模糊。'], ['关键', '引用质量和错误纠正决定可信度。'], ['商业', '广告和订阅模式仍在摸索。']], [['获取信息', '搜索步骤会减少，但核对来源更重要。'], ['创作者', '流量分配可能继续变化。'], ['隐私', '浏览上下文会成为敏感数据。']], ['是否清楚展示引用来源。', '默认搜索入口是否发生变化。']),
  makeTopic('mcp-ecosystem', 'AI 基础设施', 'code', '工具协议生态继续围绕企业集成扩展', '类似 MCP 的工具连接方式让模型更容易调用文档、数据库和业务系统，但真正落地要看权限、日志和安全边界。', '全球', '工具协议', '开发者观察', ['协议接口', '工具连接', '权限审计', '企业落地'], [['方向', '开发者更重视标准化工具连接。'], ['收益', '减少每个应用单独适配模型的成本。'], ['风险', '工具调用扩大了误操作和泄露边界。']], [['开发者', '集成成本可能下降。'], ['企业', '安全审核会更细。'], ['普通用户', '自动化能力增强，但需要明确确认关键操作。']], ['主流平台是否支持共同协议。', '权限撤销和日志能否简单可查。']),
  makeTopic('ai-chip-demand', '芯片与算力', 'chart', 'AI 芯片需求继续推动供应链重新排队', '模型训练和推理需求让芯片、内存、网络和电力同时紧张，最终会影响云服务价格和 AI 产品可用性。', '全球', '算力供应链', '供应链观察', ['模型需求', '芯片订单', '数据中心', '服务价格'], [['需求', '推理流量正在变成长期算力需求。'], ['瓶颈', '先进封装、内存和网络设备同样关键。'], ['分化', '大厂和小团队获得算力的成本差距扩大。']], [['开发者', '算力预算会影响产品试验速度。'], ['用户', '高级 AI 功能可能更偏订阅制。'], ['能源', '数据中心用电压力继续上升。']], ['推理芯片是否缓解供给压力。', '云厂商是否调整价格。']),
  makeTopic('open-models', '模型生态', 'ai', '开源模型继续挤压闭源产品的基础能力差距', '开源模型能力提升会降低创业和企业自建门槛，但部署、安全和评估仍决定它能不能用于生产。', '全球', '模型生态', '模型观察', ['开源模型', '微调部署', '企业评估', '成本下降'], [['进展', '更多模型在代码、长文本和多语言上接近商用需求。'], ['优势', '私有部署和成本控制更灵活。'], ['限制', '安全评估和运维能力要求更高。']], [['创业', '原型成本下降。'], ['企业', '可把敏感数据留在内部环境。'], ['用户', '产品选择更多，但质量差异也更大。']], ['是否有可靠第三方评测。', '商业许可是否足够清晰。']),
  makeTopic('ai-regulation', 'AI 治理', 'alert', 'AI 监管重点从原则转向具体责任', '监管讨论正在从“要安全”进入“谁负责、怎么审计、如何申诉”，这会影响金融、医疗、教育和招聘产品。', '全球', 'AI 监管', '政策观察', ['规则发布', '模型审计', '责任划分', '用户申诉'], [['重点', '高风险场景的透明度和审计要求更明确。'], ['企业', '上线前评估和上线后记录会更重要。'], ['用户', '被 AI 决策影响时需要可申诉渠道。']], [['求职', '自动筛选简历需要解释。'], ['金融', '信贷和保险定价要避免歧视。'], ['医疗', '医生责任和工具建议边界要清楚。']], ['监管是否公布可执行检查清单。', '企业是否公开模型使用范围。']),
  makeTopic('devtools-agent', '开发工具', 'code', '代码 Agent 开始进入多人协作流程', '代码助手不只是补全代码，正在参与 issue 拆解、测试、重构和代码审查，团队需要新的质量门槛。', '全球', '开发者工具', '开发者观察', ['任务理解', '代码修改', '测试运行', '审查合并'], [['变化', '工具从单人辅助变成协作成员。'], ['风险', '错误修改和隐性依赖需要测试兜底。'], ['机会', '重复修 bug 和写脚手架速度提升。']], [['程序员', '更多时间花在定义任务和审查结果。'], ['团队', '需要规定哪些改动能自动化。'], ['产品', '小功能迭代速度可能变快。']], ['是否能稳定跑测试并解释修改。', '企业权限和代码隐私如何处理。']),
  makeTopic('ai-media', '内容与版权', 'chart', 'AI 内容平台继续面对版权和标注压力', '生成式内容进入图片、视频和新闻摘要后，用户更需要知道内容来源、授权情况和是否经过人工编辑。', '全球', '内容产业', '媒体观察', ['训练数据', '内容生成', '版权谈判', '来源标注'], [['争议', '版权方要求更透明的数据使用。'], ['平台', '内容标注和检测工具继续完善。'], ['商业', '授权分成仍在谈判。']], [['读者', '需要更会看来源和标注。'], ['创作者', '授权和收入模式会被重写。'], ['品牌', '误用素材可能带来法律风险。']], ['平台是否提供明确 AI 标识。', '授权收入模式是否稳定。']),
  makeTopic('voice-agents', 'AI 产品', 'ai', '语音 Agent 继续向客服和陪练场景扩展', '语音交互降低使用门槛，但也让隐私、录音保存和身份识别更敏感。', '全球', '语音 AI', '产品观察', ['实时语音', '任务执行', '服务质检', '隐私边界'], [['场景', '客服、语言学习和销售培训最先落地。'], ['能力', '低延迟和打断处理是体验关键。'], ['风险', '录音和身份信息需要更清楚的授权。']], [['用户', '办事可以更自然，但要注意录音提示。'], ['企业', '客服成本下降但质检责任上升。'], ['员工', '培训方式会更像实时陪练。']], ['是否提供录音删除入口。', '复杂问题是否能转人工。']),
  makeTopic('ai-energy', '算力与能源', 'refinery', 'AI 数据中心用电继续成为产业变量', 'AI 不只是软件竞争，也在变成电力、土地、水资源和电网容量的竞争。', '全球', '数据中心能源', '能源观察', ['模型需求', '数据中心', '电力协议', '社区影响'], [['需求', '推理服务扩张让用电更持续。'], ['约束', '电网接入和冷却资源影响选址。'], ['趋势', '更多项目绑定绿电和储能。']], [['居民', '本地电价和用水讨论可能增加。'], ['企业', '云服务价格受能源成本影响。'], ['环境', '绿电比例决定碳排压力。']], ['新增数据中心是否公开用电来源。', '地方社区是否参与审批讨论。']),
].slice(0, 10);

const aiYesterdayTopics = [
  gpt6AstraTopic(),
  makeTopic('agent-memory', 'Agent', 'code', 'Agent 产品开始强调长期记忆和任务上下文', '记忆能力让助手更像持续工作的同事，但企业和个人都需要知道哪些信息被保存、能否删除、谁能访问。', '全球', 'Agent 记忆', 'AI 行业观察', ['偏好记录', '任务上下文', '权限管理', '持续协作'], [['方向', '更多产品把长期上下文作为核心卖点。'], ['问题', '记忆准确性和隐私边界仍需验证。'], ['落地', '企业场景需要管理员控制和审计。']], [['个人', '助手更省心，但要定期检查保存的信息。'], ['企业', '权限管理会成为采购条件。'], ['安全', '错误记忆可能影响后续决策。']], ['是否提供记忆查看和删除。', '团队管理员能否限制敏感信息。']),
  makeTopic('anp-protocols', 'AI 基础设施', 'code', 'Agent 之间的通信协议讨论升温', '如果 Agent 能彼此交换任务、身份和结果，自动化会更强，但标准、信任和验证机制必须先跟上。', '全球', 'Agent 协议', '开发者观察', ['身份声明', '任务协商', '结果验证', '跨应用协作'], [['趋势', '开发者社区开始讨论 Agent 间互操作。'], ['价值', '跨工具协同可以减少人工复制粘贴。'], ['风险', '身份伪造和错误传递会放大损失。']], [['用户', '跨应用任务会更顺滑。'], ['开发者', '需要处理认证和权限。'], ['企业', '自动化边界必须可追踪。']], ['是否出现被主流平台采纳的标准。', '协议是否有安全认证机制。']),
  makeTopic('ai-office', 'AI 产品', 'ai', '办公套件继续把 AI 放进表格和文档流程', 'AI 进入日常办公后，价值不只是写得快，而是能不能减少查找、整理和核对的时间。', '全球', '办公 AI', '产品观察', ['文档理解', '表格整理', '会议摘要', '任务跟进'], [['功能', '摘要、改写、数据整理仍是主流入口。'], ['竞争', '平台更强调和现有权限系统整合。'], ['限制', '复杂业务判断仍需要人复核。']], [['白领', '重复整理工作会减少。'], ['管理者', '会议和任务追踪更透明。'], ['隐私', '企业文档是否进入模型训练需要看清。']], ['AI 功能是否默认开启。', '企业数据是否可选择不训练。']),
  makeTopic('robotics-ai', '机器人', 'drone', '具身智能继续吸引制造和物流场景试点', '机器人结合大模型后更会理解指令，但距离稳定、安全、低成本地进入普通场景还有距离。', '全球', '机器人 AI', '产业观察', ['视觉理解', '动作规划', '场景试点', '安全验证'], [['应用', '仓储、巡检和简单装配是主要试点。'], ['瓶颈', '硬件成本和安全认证仍限制规模。'], ['趋势', '模型能力提升让机器人更容易适应变化场景。']], [['就业', '重复体力岗位会变化。'], ['物流', '仓储效率可能提高。'], ['安全', '人机协作需要更严格标准。']], ['试点是否扩大到真实生产线。', '事故责任如何划分。']),
  makeTopic('ai-security', 'AI 安全', 'alert', '企业开始把 AI 风险纳入网络安全流程', 'AI 工具能帮忙防御，也可能扩大攻击面；最重要的是记录谁调用了什么、拿到了哪些数据。', '全球', 'AI 安全', '安全观察', ['模型访问', '工具调用', '日志审计', '风险响应'], [['变化', '安全团队开始审查 AI 工具权限。'], ['风险', '提示注入和数据泄露仍是重点。'], ['措施', '日志、隔离和人工确认成为常见做法。']], [['员工', '不能随便把客户数据丢进工具。'], ['企业', '需要统一采购和权限管理。'], ['用户', '数据泄露责任会更受关注。']], ['是否有 AI 工具白名单。', '敏感操作是否需要二次确认。']),
  makeTopic('ai-healthcare', 'AI 应用', 'chart', '医疗 AI 更重视辅助诊断后的责任边界', 'AI 可以帮助医生整理影像和病历，但患者最关心的是错误谁负责、医生是否复核、数据是否安全。', '全球', '医疗 AI', '医疗科技观察', ['病历整理', '影像辅助', '医生复核', '责任边界'], [['进展', '医疗机构继续测试辅助诊断和文书工具。'], ['限制', '临床责任不能完全交给模型。'], ['要求', '数据合规和结果解释成为重点。']], [['患者', '看病流程可能更快。'], ['医生', '文书压力可能下降。'], ['隐私', '病历数据使用必须更透明。']], ['工具是否经过临床验证。', '医院是否说明 AI 参与程度。']),
  makeTopic('ai-ads', 'AI 商业化', 'chart', 'AI 广告和推荐系统继续改变平台收入结构', '平台用 AI 生成和投放广告会提高效率，也会让用户更难分清自然内容和商业推荐。', '全球', '平台经济', '商业观察', ['内容生成', '精准投放', '转化优化', '标注透明'], [['趋势', '广告工具越来越自动化。'], ['收益', '中小商家制作素材门槛下降。'], ['风险', '误导性内容和过度个性化更难监管。']], [['消费者', '需要更会辨认广告标识。'], ['商家', '投放成本和效果会重新分化。'], ['平台', '透明度会成为监管焦点。']], ['AI 广告是否清楚标识。', '平台是否限制敏感品类。']),
  makeTopic('ai-coding-market', '开发工具', 'code', 'AI 编程工具继续从补全走向项目级执行', '工具能写代码、跑测试、改 bug，但团队真正需要的是稳定性、可解释性和不会破坏已有代码。', '全球', '代码 Agent', '开发者观察', ['需求拆解', '代码生成', '测试验证', '合并审查'], [['能力', '更多工具支持跨文件修改。'], ['风险', '隐藏回归和依赖误判仍常见。'], ['趋势', '测试和代码审查能力变成核心卖点。']], [['开发者', '角色更偏架构和审查。'], ['团队', '需要规定 AI 可改哪些文件。'], ['公司', '交付速度和质量控制要重新平衡。']], ['工具是否能解释每个改动。', '是否默认运行测试。']),
  makeTopic('ai-devices', '消费 AI', 'ai', '手机和电脑厂商继续把 AI 功能放到系统层', 'AI 从应用进入操作系统后，会影响拍照、搜索、通知、写作和客服，也会影响换机理由。', '全球', '端侧 AI', '消费科技观察', ['端侧模型', '系统功能', '隐私策略', '硬件升级'], [['方向', '厂商把 AI 功能放进系统默认入口。'], ['差异', '端侧处理和云端处理影响隐私。'], ['商业', '部分高级功能可能绑定新硬件。']], [['用户', '常用操作会更自动化。'], ['隐私', '需要看清数据是否离开设备。'], ['预算', 'AI 功能可能成为换机理由。']], ['旧设备是否支持新功能。', '云端处理是否可关闭。']),
  makeTopic('ai-evals', '模型评测', 'chart', 'AI 评测从跑分转向真实任务表现', '简单榜单越来越难说明产品好坏，企业更关心模型在真实流程中的稳定、成本和错误类型。', '全球', 'AI 评测', '模型观察', ['任务集', '错误分类', '成本评估', '生产监控'], [['变化', '通用跑分不足以判断业务价值。'], ['做法', '企业开始建立自己的评测集。'], ['关键', '失败案例比平均分更有参考价值。']], [['企业采购', '会更重视真实任务试用。'], ['开发者', '需要持续监控上线效果。'], ['用户', '产品宣传和实际体验差距会更容易暴露。']], ['厂商是否公开失败案例。', '企业是否建立内部评测流程。']),
].slice(0, 10);

function makeTopic(slug, cat, icon, title, take, region, meta, source, nodes, facts, impacts, next) {
  return {
    slug,
    cat,
    icon,
    title,
    take,
    region,
    meta,
    source,
    facts,
    impacts,
    next,
    visual: { type: 'chain', label: '影响链 · 谁影响谁', nodes },
  };
}

function sketchIcon(name, size) {
  const path = coalesce(iconPaths[name], iconPaths.chart);
  return `
    <svg class="sketch-svg" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        ${path}
      </g>
    </svg>
  `;
}

function eventImageHtml(item) {
  const image = localizedEventImage(item.eventImage);
  if (!image || !image.url) return '';
  const link = image.link || (item.sourceLinks && item.sourceLinks[0] ? item.sourceLinks[0].url : '');
  const imageMarkup = `
    <img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt || item.title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
  `;

  return `
    <figure class="event-image">
      ${link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${imageMarkup}</a>` : imageMarkup}
    </figure>
  `;
}

function localizedEventImage(image) {
  if (!image) return null;
  const localized = state.language === 'en' ? image.en : image.zh;
  return {
    ...image,
    alt: localized && localized.alt !== undefined ? localized.alt : image.alt,
    caption: localized && localized.caption !== undefined ? localized.caption : image.caption,
  };
}

function chainDiagramHtml(nodes) {
  return `
    <div class="chain-diagram" role="img" aria-label="${escapeHtml(nodes.join('，'))}">
      ${nodes.map((node, index) => `
        <span class="chain-node${index === nodes.length - 1 ? ' is-final' : ''}">${annotateTerms(node)}</span>
        ${index < nodes.length - 1 ? '<span class="chain-arrow" aria-hidden="true"></span>' : ''}
      `).join('')}
    </div>
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
  return `
    <div class="bars-diagram" role="img" aria-label="${state.language === 'en' ? 'Comparison bar chart' : '对比条形图'}">
      ${bars.map(([label, value, color]) => {
        const width = Math.min(100, Math.max(4, (value / max) * 100));
        const display = decimal ? value.toFixed(1) : String(value);
        return `
          <div class="bar-row">
            <span class="bar-label">${escapeHtml(label)}</span>
            <div class="bar-track">
              <span class="bar-fill" style="width: ${width}%; background: ${escapeHtml(color)}"></span>
            </div>
            <strong class="bar-value">${escapeHtml(display)}%</strong>
          </div>
        `;
      }).join('')}
    </div>
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

  if (favoriteButton) {
    favoriteButton.textContent = favorite ? t('favoriteOn') : t('favoriteOff');
    favoriteButton.classList.toggle('is-active', favorite);
  }

  if (muteButton) {
    muteButton.textContent = muted ? t('muteOn') : t('muteOff');
  }
}

const glossary = [
  {
    key: 'ai',
    terms: ['AI'],
    zh: {
      label: 'AI',
      meaning: '人工智能，简单说就是让软件通过模型理解文字、图片、声音或数据，并辅助生成、判断和执行任务。',
      relation: '在这条新闻里，AI 不是一个抽象概念，而是会影响工具能力、用电、芯片、隐私、工作流程和产品价格的实际技术。',
    },
    en: {
      label: 'AI',
      meaning: 'Artificial intelligence: software using models to understand text, images, audio, or data, then help generate, decide, or act.',
      relation: 'Here, AI is not just a buzzword. It affects tools, electricity demand, chips, privacy, workflows, and product pricing.',
    },
  },
  {
    key: 'mcp',
    terms: ['MCP'],
    zh: {
      label: 'MCP',
      meaning: '一种让 AI 模型连接外部工具和数据的接口协议，可以把文档、数据库、软件功能接到模型旁边。',
      relation: '这条新闻提到 MCP 时，重点通常不是协议名字本身，而是 AI 能不能安全地调用真实工具、留下日志、控制权限。',
    },
    en: {
      label: 'MCP',
      meaning: 'A protocol for connecting AI models to external tools and data, such as documents, databases, and app functions.',
      relation: 'Here, MCP matters because useful agents need safe tool access, permissions, and logs, not only better chat.',
    },
  },
  {
    key: 'agent',
    terms: ['Agent', '智能体'],
    zh: {
      label: 'Agent',
      meaning: '可以按目标自己拆步骤、调用工具、执行任务的 AI，不只是回答一句话。',
      relation: '在这条新闻里，Agent 的关键是能否稳定接管流程，比如查资料、填表、跟进任务，同时不越权、不乱改。',
    },
    en: {
      label: 'Agent',
      meaning: 'An AI system that can break a goal into steps, use tools, and carry out tasks, not just answer a prompt.',
      relation: 'In this story, the agent angle is whether AI can reliably handle real workflows while staying within permissions.',
    },
  },
  {
    key: 'anp',
    terms: ['ANP'],
    zh: {
      label: 'ANP',
      meaning: '可以理解成 Agent 之间互相沟通、传递任务和结果的一类协议思路。',
      relation: '如果新闻里出现 ANP，重点是多个 Agent 能否安全协作，而不是每个工具各自孤立运行。',
    },
    en: {
      label: 'ANP',
      meaning: 'A protocol idea for agents to communicate, hand off tasks, and share results with each other.',
      relation: 'Here it matters because multi-agent work needs identity, trust, and verification before it can scale safely.',
    },
  },
  {
    key: 'compute',
    terms: ['算力', 'compute'],
    zh: {
      label: '算力',
      meaning: '运行 AI 模型所需的计算能力，主要来自芯片、服务器、网络和电力。',
      relation: '这条新闻里的算力关系到 AI 服务能不能便宜、稳定、广泛地提供给企业和普通用户。',
    },
    en: {
      label: 'Compute',
      meaning: 'The computing power needed to run AI models, usually involving chips, servers, networks, and electricity.',
      relation: 'In this story, compute affects whether AI services are affordable, reliable, and widely available.',
    },
  },
  {
    key: 'inference',
    terms: ['推理', 'inference'],
    zh: {
      label: '推理',
      meaning: '模型已经训练好之后，每次回答问题、分析文件、生成图片或执行任务时的计算过程。',
      relation: '新闻里谈推理，通常是在说 AI 真正被大量使用后，对芯片、云服务和电力的持续压力。',
    },
    en: {
      label: 'Inference',
      meaning: 'The compute used when a trained model answers questions, reads files, generates content, or performs tasks.',
      relation: 'Here, inference points to the ongoing cost of everyday AI use, not just the one-time cost of training.',
    },
  },
  {
    key: 'data-center',
    terms: ['数据中心', 'data center', 'data centers'],
    zh: {
      label: '数据中心',
      meaning: '集中放服务器和芯片的机房，是云计算和 AI 服务的基础设施。',
      relation: '这条新闻里，数据中心通常会牵动电网接入、用水、用地、储能和地方电价讨论。',
    },
    en: {
      label: 'Data center',
      meaning: 'A facility full of servers and chips that powers cloud computing and AI services.',
      relation: 'In this story, data centers connect AI growth to grid access, water, land, storage, and local energy costs.',
    },
  },
  {
    key: 'supply-chain',
    terms: ['供应链', 'supply chain', 'supply chains'],
    zh: {
      label: '供应链',
      meaning: '从原材料、零部件、生产、运输到交付的一整套链路。',
      relation: '这条新闻里的供应链变化，最后可能影响产品能不能买到、价格稳不稳、维修和交付快不快。',
    },
    en: {
      label: 'Supply chain',
      meaning: 'The chain from raw materials and parts through production, shipping, and delivery.',
      relation: 'Here, supply-chain shifts can affect availability, pricing, repairs, and delivery times.',
    },
  },
  {
    key: 'governance',
    terms: ['治理', 'governance'],
    zh: {
      label: '治理',
      meaning: '给技术使用定规则：谁能用、怎么审、出问题谁负责、用户怎么申诉。',
      relation: '这条新闻里，治理决定 AI 是只追求速度，还是能在金融、医疗、教育等场景里被放心使用。',
    },
    en: {
      label: 'Governance',
      meaning: 'Rules for how technology is used: access, audits, responsibility, and user appeals.',
      relation: 'Here, governance decides whether AI can be trusted in serious settings such as finance, health, or education.',
    },
  },
  {
    key: 'audit',
    terms: ['审计', 'audit', 'audits'],
    zh: {
      label: '审计',
      meaning: '把系统做了什么、谁批准了什么、哪里出错了记录下来并检查。',
      relation: '这条新闻里的审计，是为了让 AI 自动做事时还能追责和回滚，避免黑箱操作。',
    },
    en: {
      label: 'Audit',
      meaning: 'A way to record and inspect what a system did, who approved it, and where it failed.',
      relation: 'Here, audits matter because automated AI work needs accountability, rollback, and clear records.',
    },
  },
  {
    key: 'robotics',
    terms: ['机器人', '具身智能', 'robotics', 'robots', 'embodied AI'],
    zh: {
      label: '机器人 / 具身智能',
      meaning: '让 AI 不只在屏幕里回答问题，也能通过机器人感知环境、移动和执行物理任务。',
      relation: '如果当天新闻里有机器人，它更关乎工厂、物流、仓储、服务业岗位和安全标准，而不只是模型能力。',
    },
    en: {
      label: 'Robotics / embodied AI',
      meaning: 'AI connected to machines that can sense the physical world, move, and perform real-world tasks.',
      relation: 'In this story, robotics links AI to factories, logistics, service jobs, and safety standards.',
    },
  },
  {
    key: 'lumi-ai',
    terms: ['LUMI-AI'],
    zh: {
      label: 'LUMI-AI',
      meaning: '欧洲正在建设的 AI 超算项目，可以理解成给科研和产业用的大型算力基础设施。',
      relation: '这条新闻里，它代表欧洲想把关键 AI 算力留在本地，减少对外部云和芯片资源的依赖。',
    },
    en: {
      label: 'LUMI-AI',
      meaning: 'A European AI supercomputing project, essentially large-scale compute infrastructure for research and industry.',
      relation: 'Here, it shows Europe trying to keep critical AI compute closer to home and reduce outside dependence.',
    },
  },
];

function annotateTerms(value) {
  const text = String(coalesce(value, ''));
  if (!text) return '';

  const matches = [];
  const lowerText = text.toLowerCase();

  for (const entry of glossary) {
    for (const term of entry.terms) {
      const lowerTerm = term.toLowerCase();
      let start = lowerText.indexOf(lowerTerm);

      while (start !== -1) {
        const end = start + term.length;
        if (isTermBoundary(text, start, end)) {
          matches.push({ start, end, entry });
        }
        start = lowerText.indexOf(lowerTerm, start + term.length);
      }
    }
  }

  matches.sort((first, second) => first.start - second.start || second.end - first.end);

  let cursor = 0;
  let html = '';

  for (const match of matches) {
    if (match.start < cursor) continue;
    const rawTerm = text.slice(match.start, match.end);
    const copy = state.language === 'en' ? match.entry.en : match.entry.zh;
    html += escapeHtml(text.slice(cursor, match.start));
    html += `<button class="term-token" type="button" data-term="${match.entry.key}" aria-label="${escapeHtml(copy.label)}">${escapeHtml(rawTerm)}</button>`;
    cursor = match.end;
  }

  html += escapeHtml(text.slice(cursor));
  return html;
}

function isTermBoundary(text, start, end) {
  const before = coalesce(text[start - 1], '');
  const after = coalesce(text[end], '');
  return !isAsciiWord(before) && !isAsciiWord(after);
}

function isAsciiWord(character) {
  return /[A-Za-z0-9_-]/.test(character);
}

function openTermModal(key, item) {
  const entry = glossary.find((glossaryItem) => glossaryItem.key === key);
  if (!entry) return;

  const copy = state.language === 'en' ? entry.en : entry.zh;
  elements.termModalKicker.textContent = t('termKicker');
  elements.termModalTitle.textContent = copy.label;
  elements.termModalBody.innerHTML = `
    <div>
      <strong>${escapeHtml(t('termMeaning'))}</strong>
      <p>${escapeHtml(copy.meaning)}</p>
    </div>
    <div>
      <strong>${escapeHtml(t('termRelation'))}</strong>
      <p>${escapeHtml(copy.relation)}</p>
      <em>${escapeHtml(localizedItem(item).title)}</em>
    </div>
  `;
  elements.termModal.hidden = false;
  requestAnimationFrame(() => {
    elements.termModal.classList.add('is-open');
  });
}

function closeTermModal() {
  elements.termModal.classList.remove('is-open');
  window.setTimeout(() => {
    elements.termModal.hidden = true;
  }, 170);
}

function localizedItem(item) {
  if (state.language !== 'en' || !item.en) {
    return item;
  }

  return {
    ...item,
    cat: coalesce(item.en.cat, item.cat),
    title: coalesce(item.en.title, item.title),
    brief: coalesce(item.en.brief, item.brief),
    take: coalesce(item.en.take, item.take),
    meta: coalesce(item.en.meta, item.meta),
    facts: coalesce(item.en.facts, item.facts),
    visual: coalesce(item.en.visual, item.visual),
    impacts: coalesce(item.en.impacts, item.impacts),
    next: coalesce(item.en.next, item.next),
    source: coalesce(item.en.source, item.source),
    updated: coalesce(item.en.updated, item.updated),
  };
}

function coalesce(value, fallback) {
  return value === null || value === undefined ? fallback : value;
}

function summaryBrief(item) {
  const text = String(item.brief || item.summary || item.take || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';

  const sentence = firstReadableSentence(text);
  const limit = state.language === 'en' ? 135 : 54;

  if (sentence.length <= limit) return sentence;

  const comma = state.language === 'en'
    ? sentence.indexOf(',', 68)
    : sentence.indexOf('，', 22);
  const cut = comma > 0 && comma <= limit + 18
    ? sentence.slice(0, comma)
    : sentence.slice(0, limit);

  return `${cut.replace(/[，,;；、\s]+$/, '')}${state.language === 'en' ? '...' : '。'}`;
}

function firstReadableSentence(text) {
  const match = text.match(/^.+?[。！？.!?](?=\s|$|[A-Za-z0-9\u4e00-\u9fff])/);
  if (match) return match[0].trim();
  return text;
}

function updateProgress() {
  if (!items.length) {
    Array.from(elements.dots.children).forEach((dot) => dot.classList.remove('is-read'));
    elements.progressStatus.textContent = state.channel === 'favorites'
      ? t('progressEmpty')
      : t('noContentCopy');
    elements.doneCard.hidden = true;
    return;
  }

  const readCount = items.filter((item) => state.read.has(item.id)).length;
  Array.from(elements.dots.children).forEach((dot, index) => {
    dot.classList.toggle('is-read', index < readCount);
  });
  elements.progressStatus.textContent = readCount === items.length
    ? t('readComplete')
    : `${t('readPrefix')} ${readCount} / ${items.length}`;
  elements.doneCard.hidden = readCount !== items.length;
}

function t(key) {
  const languagePack = i18n[state.language] || i18n.zh;
  if (languagePack[key] !== undefined) return languagePack[key];
  if (i18n.zh[key] !== undefined) return i18n.zh[key];
  return key;
}

function effectiveTheme() {
  if (state.theme === 'dark') return 'dark';
  if (state.theme === 'light') return 'light';
  return themeMedia.matches ? 'dark' : 'light';
}

function applyTheme() {
  const theme = effectiveTheme();
  document.documentElement.dataset.theme = theme;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute('content', theme === 'dark' ? '#101513' : '#f4f6f2');
  }
}

function themeLabel(theme) {
  if (theme === 'dark') return t('themeDark');
  if (theme === 'light') return t('themeLight');
  return t('themeSystem');
}

function themeBadge(theme) {
  if (theme === 'dark') return state.language === 'en' ? 'DARK' : '深';
  if (theme === 'light') return state.language === 'en' ? 'LIGHT' : '浅';
  return state.language === 'en' ? 'AUTO' : '自动';
}

function renderMineIfActive() {
  if (state.channel === 'mine') {
    renderMine();
  }
}

function localizedEyebrow(channel) {
  if (state.channel === 'mine') return t('mineEyebrow');
  if (state.channel === 'favorites') return t('favoritesEyebrow');
  return state.language === 'en'
    ? `DAILYTEN · ${t(state.channel).toUpperCase()}`
    : channel.eyebrow;
}

function localizedEditionTitle(edition, channel) {
  if (state.channel === 'mine') return t('mineTitle');
  if (state.channel === 'favorites') return t('favoritesTitle');
  if (state.language === 'en') {
    return state.channel === 'ai' ? 'AI Industry Ten' : 'DailyTen';
  }
  return coalesce(edition.title, channel.fallbackTitle);
}

function localizedEditionSubtitle(edition, channel) {
  if (state.channel === 'mine') return t('mineSubtitle');
  if (state.channel === 'favorites') return coalesce(edition.subtitle, t('favoritesSubtitle'));
  if (state.language === 'en') {
    return state.channel === 'ai'
      ? 'Models, agents, compute, chips, products, and governance in one quiet briefing.'
      : 'Ten things worth knowing today, filtered and explained clearly.';
  }
  return coalesce(edition.subtitle, channel.fallbackSubtitle);
}

function localizedBriefLabel(edition) {
  if (state.channel === 'mine') return '';
  if (state.channel === 'favorites') return edition.briefLabel;
  if (state.language === 'en') {
    return `${dateLabel(state.selectedDateKey)} · 10 items`;
  }
  return coalesce(edition.briefLabel, `${dateLabel(state.selectedDateKey)} 10 条`);
}

function readSavedDateKey() {
  const saved = storage.getItem(storageKeys.date);
  return saved && availableDateKeys.has(saved) ? saved : todayKey;
}

function readSavedLanguage() {
  return storage.getItem(storageKeys.language) === 'en' ? 'en' : 'zh';
}

function readSavedTheme() {
  if (storage.getItem(storageKeys.themeVersion) !== '2') {
    storage.setItem(storageKeys.theme, 'light');
    storage.setItem(storageKeys.themeVersion, '2');
    return 'light';
  }

  const saved = storage.getItem(storageKeys.theme);
  return saved === 'dark' || saved === 'light' || saved === 'system' ? saved : 'light';
}

function readSet(key) {
  try {
    return new Set(JSON.parse(coalesce(storage.getItem(key), '[]')));
  } catch {
    return new Set();
  }
}

function writeSet(key, value) {
  storage.setItem(key, JSON.stringify([...value]));
}

function toggleSet(set, value) {
  if (set.has(value)) {
    set.delete(value);
  } else {
    set.add(value);
  }
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatChineseDate(dateKey) {
  const date = parseDateKey(dateKey);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function dateLabel(dateKey) {
  if (dateKey === todayKey) return t('today');
  if (dateKey === yesterdayKey) return state.language === 'en' ? 'Yesterday' : '昨天';
  return state.language === 'en' ? formatEnglishDate(dateKey) : formatChineseDate(dateKey);
}

function weekdayLabel(date) {
  const names = state.language === 'en'
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return names[date.getDay()];
}

function weekdayNames() {
  return state.language === 'en'
    ? ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    : ['日', '一', '二', '三', '四', '五', '六'];
}

function shortDateLabel(date) {
  return state.language === 'en'
    ? `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}`
    : `${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatEnglishDate(dateKey) {
  const date = parseDateKey(dateKey);
  return `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}`;
}

function monthTitle(date) {
  return state.language === 'en'
    ? date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    : `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
}

function uniqueId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeSvg(value) {
  return escapeHtml(value);
}
