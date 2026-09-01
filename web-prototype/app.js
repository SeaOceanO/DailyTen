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
};

const storageKeys = {
  favorites: 'dailyten-web:favorites',
  muted: 'dailyten-web:muted',
  read: 'dailyten-web:read',
  channel: 'dailyten-web:channel',
  date: 'dailyten-web:date',
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

const state = {
  favorites: readSet(storageKeys.favorites),
  muted: readSet(storageKeys.muted),
  read: readSet(storageKeys.read),
  channel: channels[localStorage.getItem(storageKeys.channel)] ? localStorage.getItem(storageKeys.channel) : 'daily',
  selectedDateKey: readSavedDateKey(),
  calendarExpanded: false,
};

const elements = {
  eyebrow: document.querySelector('.eyebrow'),
  title: document.querySelector('#page-title'),
  subtitle: document.querySelector('.subtitle'),
  channelTabs: document.querySelector('#channel-tabs'),
  dateModule: document.querySelector('#date-module'),
  progressTitle: document.querySelector('#progress-title'),
  progressStatus: document.querySelector('#progress-status'),
  feed: document.querySelector('#feed'),
  dots: document.querySelector('#progress-dots'),
  doneCard: document.querySelector('#done-card'),
};

let items = [];
let touchStartY = 0;

init();

async function init() {
  renderChannelTabs();
  wireDateGestures();
  showLoadingState('正在读取这一天的十条...');

  try {
    const latestEdition = await fetchEdition('./data/today.json');
    setLatestDate(latestEdition.dateKey);
    state.selectedDateKey = readSavedDateKey();
    renderDateModule();
    await loadAndRender(latestEdition);
  } catch (error) {
    renderDateModule();
    showErrorState(error);
  }
}

async function loadAndRender(preloadedLatestEdition = null) {
  showLoadingState('正在读取这一天的十条...');

  try {
    const canUsePreloaded = preloadedLatestEdition
      && state.channel === 'daily'
      && state.selectedDateKey === todayKey;
    const edition = canUsePreloaded
      ? preloadedLatestEdition
      : await loadEdition(state.channel, state.selectedDateKey);
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

function setLatestDate(dateKey) {
  today = parseDateKey(dateKey);
  yesterday = addDays(today, -1);
  dateOptions = [today, yesterday];
  todayKey = formatDateKey(today);
  yesterdayKey = formatDateKey(yesterday);
}

async function loadEdition(channel, dateKey) {
  if (channel === 'daily' && dateKey === todayKey) {
    return fetchEdition('./data/today.json');
  }

  return buildLocalEdition(channel, dateKey);
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
  document.title = `${edition.title ?? channel.fallbackTitle} · ${channel.label}`;
  elements.eyebrow.textContent = channel.eyebrow;
  elements.title.textContent = edition.title ?? channel.fallbackTitle;
  elements.subtitle.textContent = edition.subtitle ?? channel.fallbackSubtitle;
  elements.progressTitle.textContent = edition.briefLabel ?? `${dateLabel(state.selectedDateKey)} 10 条`;
  elements.progressStatus.textContent = '先扫读，再展开真正想看的。';
  elements.doneCard.textContent = edition.doneLabel ?? '这一天已读完';
}

function renderChannelTabs() {
  elements.channelTabs.innerHTML = Object.entries(channels).map(([key, channel]) => `
    <button class="channel-tab${state.channel === key ? ' is-active' : ''}" type="button" data-channel="${key}">
      ${escapeHtml(channel.label)}
    </button>
  `).join('');

  elements.channelTabs.querySelectorAll('[data-channel]').forEach((button) => {
    button.addEventListener('click', async () => {
      const nextChannel = button.dataset.channel;
      if (state.channel === nextChannel) return;
      state.channel = nextChannel;
      localStorage.setItem(storageKeys.channel, state.channel);
      await loadAndRender();
    });
  });
}

function renderDateModule() {
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
          <strong>${monthDate.getFullYear()}年 ${monthDate.getMonth() + 1}月</strong>
          <span>可查看今天和昨天的十条</span>
        </div>
        <button class="calendar-toggle in-panel" type="button" aria-label="收起日历" aria-expanded="${state.calendarExpanded}">
          <span class="chevron-icon is-up" aria-hidden="true"><span></span><span></span></span>
        </button>
      </div>
      <div class="weekday-grid">
        ${['日', '一', '二', '三', '四', '五', '六'].map((day) => `<span>${day}</span>`).join('')}
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
      localStorage.setItem(storageKeys.date, dateKey);
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
      <em>${key === todayKey ? '今天' : `${date.getMonth() + 1}月${date.getDate()}日`}</em>
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
    const selectable = key === todayKey || key === yesterdayKey;
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
    touchStartY = event.touches[0]?.clientY ?? 0;
  }, { passive: true });

  elements.dateModule.addEventListener('touchend', (event) => {
    const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY;
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
  elements.feed.innerHTML = `<article class="state-card">${escapeHtml(text)}</article>`;
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

function createCard(item) {
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

function buildLocalEdition(channel, dateKey) {
  if (dateKey !== todayKey && dateKey !== yesterdayKey) {
    throw new Error('当前只保留今天和昨天的十条。');
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

function buildTopicItem(topic, channel, dateKey, index) {
  return {
    id: `${channel}-${dateKey}-${topic.slug}`,
    cat: topic.cat,
    icon: topic.icon,
    title: topic.title,
    take: topic.take,
    meta: `${topic.region}｜${topic.meta}｜${formatChineseDate(dateKey)}`,
    facts: topic.facts,
    visual: topic.visual,
    impacts: topic.impacts,
    next: topic.next,
    source: topic.source,
    updated: `${formatChineseDate(dateKey)} 更新`,
    sourceLinks: [],
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

const aiTodayTopics = [
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
];

const aiYesterdayTopics = [
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
];

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
    ? '这一天的十条已完成。'
    : `已读 ${readCount} / ${items.length} 条`;
  elements.doneCard.hidden = readCount !== items.length;
}

function readSavedDateKey() {
  const saved = localStorage.getItem(storageKeys.date);
  return saved === todayKey || saved === yesterdayKey ? saved : todayKey;
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
  if (dateKey === todayKey) return '今天';
  if (dateKey === yesterdayKey) return '昨天';
  return formatChineseDate(dateKey);
}

function weekdayLabel(date) {
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
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
