import type { Language } from '../i18n/translations';

export type NewsCategory = 'home' | 'international';

export type LocalizedText = Record<Language, string>;

export type LocalizedNewsContent = {
  title: string;
  summary: string;
  whyItMatters: string;
  source: string;
};

export type FutureBilingualNewsItem = {
  id: string;
  dateKey: string;
  category: NewsCategory;
  originalUrl: string | null;
  sourceUrl: string | null;
  sourceName: string;
  imageUrl: string | null;
  originalLanguage: Language;
  generatedAt: string;
  zh: LocalizedNewsContent;
  en: LocalizedNewsContent;
  coverLabel: LocalizedText;
};

export type NewsItem = FutureBilingualNewsItem &
  LocalizedNewsContent & {
    placeholderColor: string;
    coverVisual: NewsCoverVisual;
  };

export type FavoriteNewsItem = NewsItem & {
  favoritedAt: string;
};

export type CoverPattern =
  | 'routes'
  | 'care'
  | 'charge'
  | 'travel'
  | 'weather'
  | 'school'
  | 'culture'
  | 'health'
  | 'business'
  | 'green'
  | 'energy'
  | 'payments'
  | 'port'
  | 'solar'
  | 'agri'
  | 'aviation'
  | 'robotics'
  | 'education'
  | 'visa'
  | 'event';

export type NewsCoverVisual = {
  label: string;
  coverLabel: LocalizedText;
  backgroundColor: string;
  accentColor: string;
  secondaryColor: string;
  pattern: CoverPattern;
};

type NewsCoverVisualTemplate = Omit<NewsCoverVisual, 'label'>;

type NewsTemplate = {
  zh: LocalizedNewsContent;
  en: LocalizedNewsContent;
  sourceName: string;
  placeholderColor: string;
  originalLanguage: Language;
};

// Future production flow:
// 1. RSS / NewsAPI / GDELT will provide candidate real news.
// 2. The backend will select the daily ten items.
// 3. AI will generate both Chinese and English versions.
// 4. Both zh and en versions should be saved before display.
// 5. Language switching should read saved zh/en fields.
// 6. Do not translate live every time the user switches language.

const colors = [
  '#5f7f86',
  '#6f7f64',
  '#6b7895',
  '#8a7662',
  '#7a7d86',
  '#507b72',
  '#786e91',
  '#85705d',
  '#5b7d9a',
  '#74805b',
];

const homeCoverVisuals: NewsCoverVisualTemplate[] = [
  {
    coverLabel: { zh: '城市交通', en: 'Urban Mobility' },
    backgroundColor: '#5f7f86',
    accentColor: '#d8e6e8',
    secondaryColor: '#395d64',
    pattern: 'routes',
  },
  {
    coverLabel: { zh: '社区养老', en: 'Community Care' },
    backgroundColor: '#748468',
    accentColor: '#eef3df',
    secondaryColor: '#53664c',
    pattern: 'care',
  },
  {
    coverLabel: { zh: '充电网络', en: 'Charging Network' },
    backgroundColor: '#687999',
    accentColor: '#e4ebff',
    secondaryColor: '#465a80',
    pattern: 'charge',
  },
  {
    coverLabel: { zh: '文旅消费', en: 'Local Travel' },
    backgroundColor: '#8a7662',
    accentColor: '#f3e8d6',
    secondaryColor: '#6e5948',
    pattern: 'travel',
  },
  {
    coverLabel: { zh: '防汛应急', en: 'Flood Readiness' },
    backgroundColor: '#747f88',
    accentColor: '#e7eef2',
    secondaryColor: '#53606b',
    pattern: 'weather',
  },
  {
    coverLabel: { zh: '校园交通', en: 'School Streets' },
    backgroundColor: '#507b72',
    accentColor: '#dff0ec',
    secondaryColor: '#35645c',
    pattern: 'school',
  },
  {
    coverLabel: { zh: '文化空间', en: 'Culture Spaces' },
    backgroundColor: '#786e91',
    accentColor: '#ece6f5',
    secondaryColor: '#5f5577',
    pattern: 'culture',
  },
  {
    coverLabel: { zh: '家庭健康', en: 'Home Health' },
    backgroundColor: '#85705d',
    accentColor: '#f1e7dd',
    secondaryColor: '#665442',
    pattern: 'health',
  },
  {
    coverLabel: { zh: '数字商户', en: 'Digital Shops' },
    backgroundColor: '#5b7d9a',
    accentColor: '#e4eef6',
    secondaryColor: '#41647f',
    pattern: 'business',
  },
  {
    coverLabel: { zh: '绿色办公', en: 'Green Offices' },
    backgroundColor: '#74805b',
    accentColor: '#edf3dc',
    secondaryColor: '#566542',
    pattern: 'green',
  },
];

const internationalCoverVisuals: NewsCoverVisualTemplate[] = [
  {
    coverLabel: { zh: '能源储备', en: 'Energy Reserves' },
    backgroundColor: '#687999',
    accentColor: '#e8eeff',
    secondaryColor: '#455a81',
    pattern: 'energy',
  },
  {
    coverLabel: { zh: '数字支付', en: 'Digital Payments' },
    backgroundColor: '#507b72',
    accentColor: '#dff0ec',
    secondaryColor: '#37655e',
    pattern: 'payments',
  },
  {
    coverLabel: { zh: '港口物流', en: 'Port Logistics' },
    backgroundColor: '#5f7f86',
    accentColor: '#d8e6e8',
    secondaryColor: '#3e6269',
    pattern: 'port',
  },
  {
    coverLabel: { zh: '太阳能', en: 'Solar Power' },
    backgroundColor: '#748468',
    accentColor: '#eef3df',
    secondaryColor: '#55694b',
    pattern: 'solar',
  },
  {
    coverLabel: { zh: '农业气候', en: 'Climate Farming' },
    backgroundColor: '#8a7662',
    accentColor: '#f3e8d6',
    secondaryColor: '#6d5846',
    pattern: 'agri',
  },
  {
    coverLabel: { zh: '航空枢纽', en: 'Air Hubs' },
    backgroundColor: '#5b7d9a',
    accentColor: '#e4eef6',
    secondaryColor: '#3f627f',
    pattern: 'aviation',
  },
  {
    coverLabel: { zh: 'AI科技', en: 'AI Tech' },
    backgroundColor: '#786e91',
    accentColor: '#ece6f5',
    secondaryColor: '#5f5577',
    pattern: 'robotics',
  },
  {
    coverLabel: { zh: '全球教育', en: 'Global Education' },
    backgroundColor: '#747f88',
    accentColor: '#e7eef2',
    secondaryColor: '#53606b',
    pattern: 'education',
  },
  {
    coverLabel: { zh: '签证旅行', en: 'Visa Travel' },
    backgroundColor: '#85705d',
    accentColor: '#f1e7dd',
    secondaryColor: '#665442',
    pattern: 'visa',
  },
  {
    coverLabel: { zh: '国际赛事', en: 'World Events' },
    backgroundColor: '#74805b',
    accentColor: '#edf3dc',
    secondaryColor: '#566542',
    pattern: 'event',
  },
];

const homeTemplates: NewsTemplate[] = [
  {
    zh: {
      title: '城市通勤高峰继续恢复',
      summary: '多地早晚高峰客流保持温和增长，公共交通与共享出行需求同步回升。',
      whyItMatters: '通勤强度通常能反映城市活动水平，也会影响商圈、人力和服务业节奏。',
      source: '本地模拟数据',
    },
    en: {
      title: 'City Commutes Keep Recovering',
      summary: 'Morning and evening passenger flows are rising steadily across several cities, with public transit and shared mobility moving together.',
      whyItMatters: 'Commute intensity is a useful signal for urban activity and can shape retail, staffing, and service rhythms.',
      source: 'Local mock data',
    },
    sourceName: 'Local Mobility Sample',
    placeholderColor: colors[0],
    originalLanguage: 'zh',
  },
  {
    zh: {
      title: '社区养老服务点增加',
      summary: '多个街道试点把餐食、护理咨询和日间活动放到更近的社区空间。',
      whyItMatters: '老龄服务越靠近日常生活，家庭照护压力越容易被分担。',
      source: '民生观察',
    },
    en: {
      title: 'More Community Care Sites Open',
      summary: 'Neighborhood pilots are bringing meals, care advice, and daytime activities into community spaces closer to residents.',
      whyItMatters: 'When elder care sits closer to daily life, families get more practical support and lighter care pressure.',
      source: 'Civic life watch',
    },
    sourceName: 'Civic Life Watch',
    placeholderColor: colors[1],
    originalLanguage: 'zh',
  },
  {
    zh: {
      title: '新能源汽车充电排队缓解',
      summary: '新增快充桩投入后，部分商场和办公区的晚间等待时间有所下降。',
      whyItMatters: '补能体验会直接影响用户对新能源汽车的使用信心。',
      source: '出行简报',
    },
    en: {
      title: 'EV Charging Queues Ease',
      summary: 'New fast chargers are reducing evening wait times at selected malls and office districts.',
      whyItMatters: 'Charging convenience has a direct effect on driver confidence and everyday EV adoption.',
      source: 'Mobility brief',
    },
    sourceName: 'Mobility Brief',
    placeholderColor: colors[2],
    originalLanguage: 'zh',
  },
  {
    zh: {
      title: '暑期文旅预订提前升温',
      summary: '亲子游、短途游和夜间消费项目的咨询量继续增加。',
      whyItMatters: '文旅消费能带动餐饮、交通和本地小店的连锁收入。',
      source: '消费样本',
    },
    en: {
      title: 'Summer Travel Bookings Warm Up',
      summary: 'Family trips, short breaks, and night-time activities are drawing more early inquiries.',
      whyItMatters: 'Local travel spending can lift restaurants, transport services, and neighborhood businesses at the same time.',
      source: 'Consumer sample',
    },
    sourceName: 'Consumer Sample',
    placeholderColor: colors[3],
    originalLanguage: 'zh',
  },
  {
    zh: {
      title: '多地更新防汛物资清单',
      summary: '基层仓库补充抽水泵、照明设备和应急食品，准备应对强降雨。',
      whyItMatters: '提前备货可以缩短灾害响应时间，减少极端天气造成的影响。',
      source: '应急播报',
    },
    en: {
      title: 'Flood Supplies Get Refreshed',
      summary: 'Local warehouses are restocking pumps, lighting equipment, and emergency food ahead of heavy rain.',
      whyItMatters: 'Prepared supplies shorten response time and reduce the disruption caused by severe weather.',
      source: 'Emergency brief',
    },
    sourceName: 'Emergency Brief',
    placeholderColor: colors[4],
    originalLanguage: 'zh',
  },
  {
    zh: {
      title: '校园周边交通优化试行',
      summary: '部分学校门口设置临停区和错峰引导，减少接送拥堵。',
      whyItMatters: '小尺度交通改造能改善家庭日常时间成本，也提升步行安全。',
      source: '城市更新',
    },
    en: {
      title: 'School Streets Try New Traffic Plans',
      summary: 'Selected schools are testing short-stop zones and staggered pickup guidance to reduce congestion.',
      whyItMatters: 'Small street changes can lower daily time costs for families and make walking safer.',
      source: 'Urban update',
    },
    sourceName: 'Urban Update',
    placeholderColor: colors[5],
    originalLanguage: 'zh',
  },
  {
    zh: {
      title: '线下书店活动频率提高',
      summary: '新书分享、儿童阅读和小型展览让书店承担更多社区文化功能。',
      whyItMatters: '稳定的线下文化空间有助于形成低成本、高频率的公共生活。',
      source: '文化笔记',
    },
    en: {
      title: 'Bookstores Host More Local Events',
      summary: 'Book talks, children\u2019s reading sessions, and small exhibits are giving bookstores a broader community role.',
      whyItMatters: 'Reliable offline cultural spaces help create frequent, low-cost public life.',
      source: 'Culture notes',
    },
    sourceName: 'Culture Notes',
    placeholderColor: colors[6],
    originalLanguage: 'zh',
  },
  {
    zh: {
      title: '家庭健康设备销量平稳',
      summary: '血压计、睡眠监测和运动记录设备保持稳定购买需求。',
      whyItMatters: '自我健康管理正在进入更普通的家庭场景。',
      source: '健康观察',
    },
    en: {
      title: 'Home Health Devices Stay Steady',
      summary: 'Blood pressure monitors, sleep trackers, and activity devices continue to see stable demand.',
      whyItMatters: 'Personal health management is becoming a normal part of household routines.',
      source: 'Health watch',
    },
    sourceName: 'Health Watch',
    placeholderColor: colors[7],
    originalLanguage: 'zh',
  },
  {
    zh: {
      title: '小微商户数字收款升级',
      summary: '更多门店开始使用聚合账单、会员提醒和库存记录工具。',
      whyItMatters: '轻量数字化能帮助小店更清楚地看见现金流和复购变化。',
      source: '商业样本',
    },
    en: {
      title: 'Small Shops Upgrade Digital Payments',
      summary: 'More stores are adopting combined bills, member reminders, and simple inventory tools.',
      whyItMatters: 'Lightweight digital tools help small merchants see cash flow and repeat purchases more clearly.',
      source: 'Business sample',
    },
    sourceName: 'Business Sample',
    placeholderColor: colors[8],
    originalLanguage: 'zh',
  },
  {
    zh: {
      title: '绿色办公改造继续推进',
      summary: '节能照明、纸张减量和空调分区管理成为更多企业的低成本选择。',
      whyItMatters: '办公节能是企业可持续行动中最容易落地的一步。',
      source: '低碳记录',
    },
    en: {
      title: 'Green Office Updates Continue',
      summary: 'Efficient lighting, lower paper use, and zoned air conditioning are becoming low-cost choices for more companies.',
      whyItMatters: 'Office efficiency is one of the easiest sustainability steps for companies to put into practice.',
      source: 'Low-carbon log',
    },
    sourceName: 'Low-Carbon Log',
    placeholderColor: colors[9],
    originalLanguage: 'zh',
  },
];

const internationalTemplates: NewsTemplate[] = [
  {
    zh: {
      title: '欧洲多国讨论能源储备',
      summary: '政策焦点转向储气、跨境电网和可再生能源调度的协同安排。',
      whyItMatters: '能源安全会影响冬季价格、工业成本和地区政策协调。',
      source: '国际模拟数据',
    },
    en: {
      title: 'European States Review Energy Reserves',
      summary: 'Policy discussions are focusing on gas storage, cross-border grids, and coordinated renewable dispatch.',
      whyItMatters: 'Energy security shapes winter prices, industrial costs, and regional policy coordination.',
      source: 'International mock data',
    },
    sourceName: 'International Mock Data',
    placeholderColor: colors[2],
    originalLanguage: 'en',
  },
  {
    zh: {
      title: '东南亚数字支付增长',
      summary: '移动钱包和即时转账服务在零售、交通和外卖场景继续扩展。',
      whyItMatters: '支付基础设施会改变小商户接触金融服务的方式。',
      source: '区域简报',
    },
    en: {
      title: 'Digital Payments Grow in Southeast Asia',
      summary: 'Mobile wallets and instant transfers keep expanding across retail, transit, and delivery use cases.',
      whyItMatters: 'Payment infrastructure changes how small merchants reach financial services.',
      source: 'Regional brief',
    },
    sourceName: 'Regional Brief',
    placeholderColor: colors[5],
    originalLanguage: 'en',
  },
  {
    zh: {
      title: '北美港口自动化项目推进',
      summary: '新的调度系统和岸桥设备用于提高集装箱周转效率。',
      whyItMatters: '港口效率会影响跨境供应链成本和货物交付稳定性。',
      source: '物流观察',
    },
    en: {
      title: 'North American Ports Advance Automation',
      summary: 'New scheduling systems and quay equipment are being used to improve container turnover.',
      whyItMatters: 'Port efficiency affects cross-border supply chain costs and delivery reliability.',
      source: 'Logistics watch',
    },
    sourceName: 'Logistics Watch',
    placeholderColor: colors[0],
    originalLanguage: 'en',
  },
  {
    zh: {
      title: '非洲太阳能微电网扩张',
      summary: '偏远社区通过小规模储能和本地维护获得更稳定的供电。',
      whyItMatters: '可靠电力是教育、医疗和小企业发展的基础条件。',
      source: '能源笔记',
    },
    en: {
      title: 'Solar Microgrids Expand in Africa',
      summary: 'Remote communities are gaining steadier electricity through small storage systems and local maintenance.',
      whyItMatters: 'Reliable power underpins education, health care, and small-business growth.',
      source: 'Energy notes',
    },
    sourceName: 'Energy Notes',
    placeholderColor: colors[1],
    originalLanguage: 'en',
  },
  {
    zh: {
      title: '拉美农产品出口关注气候',
      summary: '干旱和降雨波动让种植者更重视保险、灌溉和品种调整。',
      whyItMatters: '主要农产品价格变化会传导到全球食品供应链。',
      source: '农业观察',
    },
    en: {
      title: 'Latin American Exporters Watch Climate Risk',
      summary: 'Drought and rainfall swings are pushing growers toward insurance, irrigation, and crop variety changes.',
      whyItMatters: 'Price shifts in major crops can ripple through global food supply chains.',
      source: 'Agriculture watch',
    },
    sourceName: 'Agriculture Watch',
    placeholderColor: colors[3],
    originalLanguage: 'en',
  },
  {
    zh: {
      title: '中东航空枢纽继续扩容',
      summary: '多家机场投资候机楼、货运区和长途航线衔接能力。',
      whyItMatters: '航空枢纽竞争会重塑跨洲旅行和高价值货运路线。',
      source: '交通简报',
    },
    en: {
      title: 'Middle East Air Hubs Keep Expanding',
      summary: 'Airports are investing in terminals, cargo zones, and better long-haul connections.',
      whyItMatters: 'Hub competition can reshape intercontinental travel and high-value freight routes.',
      source: 'Transport brief',
    },
    sourceName: 'Transport Brief',
    placeholderColor: colors[8],
    originalLanguage: 'en',
  },
  {
    zh: {
      title: '日韩企业加码机器人应用',
      summary: '服务、仓储和制造场景中的协作机器人部署继续增加。',
      whyItMatters: '老龄化与劳动力短缺会推动自动化从工厂走向日常服务。',
      source: '科技观察',
    },
    en: {
      title: 'Japan and Korea Expand Robot Use',
      summary: 'Collaborative robots are appearing more often in service, warehouse, and manufacturing settings.',
      whyItMatters: 'Aging populations and labor shortages are pushing automation beyond factories and into daily services.',
      source: 'Technology watch',
    },
    sourceName: 'Technology Watch',
    placeholderColor: colors[6],
    originalLanguage: 'en',
  },
  {
    zh: {
      title: '全球高校更新AI课程',
      summary: '更多专业把数据素养、模型评估和伦理讨论加入基础课程。',
      whyItMatters: '教育体系的调整会影响下一代劳动者的核心技能。',
      source: '教育简报',
    },
    en: {
      title: 'Universities Refresh AI Courses',
      summary: 'More programs are adding data literacy, model evaluation, and ethics into foundational classes.',
      whyItMatters: 'Curriculum changes will shape the core skills of the next generation of workers.',
      source: 'Education brief',
    },
    sourceName: 'Education Brief',
    placeholderColor: colors[4],
    originalLanguage: 'en',
  },
  {
    zh: {
      title: '跨境旅游签证流程优化',
      summary: '部分目的地试行电子材料和更短审核周期，以吸引淡季游客。',
      whyItMatters: '入境便利度会影响航线恢复、酒店入住和本地服务收入。',
      source: '旅行观察',
    },
    en: {
      title: 'Visa Processes Get Easier for Travelers',
      summary: 'Some destinations are testing digital documents and shorter reviews to attract off-season visitors.',
      whyItMatters: 'Entry convenience affects route recovery, hotel occupancy, and local service revenue.',
      source: 'Travel watch',
    },
    sourceName: 'Travel Watch',
    placeholderColor: colors[7],
    originalLanguage: 'en',
  },
  {
    zh: {
      title: '国际体育赛事关注可持续',
      summary: '主办方更多使用临时设施、公共交通方案和低碳采购标准。',
      whyItMatters: '大型赛事的组织方式会成为城市治理和品牌展示的一部分。',
      source: '体育商业',
    },
    en: {
      title: 'Global Sports Events Lean Greener',
      summary: 'Organizers are using more temporary venues, public transit plans, and lower-carbon procurement standards.',
      whyItMatters: 'The way major events are run becomes part of city governance and brand presentation.',
      source: 'Sports business',
    },
    sourceName: 'Sports Business',
    placeholderColor: colors[9],
    originalLanguage: 'en',
  },
];

const templatesByCategory: Record<NewsCategory, NewsTemplate[]> = {
  home: homeTemplates,
  international: internationalTemplates,
};

const coverVisualsByCategory: Record<NewsCategory, NewsCoverVisualTemplate[]> = {
  home: homeCoverVisuals,
  international: internationalCoverVisuals,
};

export function getMockNews(
  category: NewsCategory,
  dateKey: string,
  language: Language = 'zh',
): NewsItem[] {
  const templateIndexes = getDeterministicOrder(
    templatesByCategory[category].length,
    getDateSeed(`${category}-${dateKey}`),
  );

  return templateIndexes.map((templateIndex) => {
    const template = templatesByCategory[category][templateIndex];
    const coverTemplate = coverVisualsByCategory[category][templateIndex];
    const content = template[language];
    const coverLabel = coverTemplate.coverLabel;

    return {
      ...content,
      id: `${category}-${dateKey}-${getStableSlug(template.sourceName)}`,
      dateKey,
      category,
      originalUrl: null,
      sourceUrl: null,
      sourceName: template.sourceName,
      imageUrl: null,
      originalLanguage: template.originalLanguage,
      generatedAt: `${dateKey}T08:00:00.000Z`,
      zh: template.zh,
      en: template.en,
      coverLabel,
      placeholderColor: template.placeholderColor,
      coverVisual: {
        ...coverTemplate,
        label: coverLabel[language],
      },
    };
  });
}

export function localizeNewsItem<T extends NewsItem>(item: T, language: Language): T {
  return {
    ...item,
    ...item[language],
    coverVisual: {
      ...item.coverVisual,
      label: item.coverLabel[language],
    },
  };
}

function getStableSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getDateSeed(value: string) {
  return value.split('').reduce((seed, character) => {
    return Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0;
  }, 2166136261);
}

function getDeterministicOrder(length: number, seed: number) {
  const order = Array.from({ length }, (_, index) => index);
  let state = seed || 1;

  for (let index = order.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
  }

  return order;
}
