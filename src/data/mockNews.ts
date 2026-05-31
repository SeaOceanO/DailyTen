export type NewsCategory = 'home' | 'international';

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  whyItMatters: string;
  source: string;
  placeholderColor: string;
  coverVisual: NewsCoverVisual;
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
  backgroundColor: string;
  accentColor: string;
  secondaryColor: string;
  pattern: CoverPattern;
};

type NewsTemplate = Omit<NewsItem, 'id' | 'coverVisual'>;

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

const homeCoverVisuals: NewsCoverVisual[] = [
  {
    label: '\u57ce\u5e02\u4ea4\u901a',
    backgroundColor: '#5f7f86',
    accentColor: '#d8e6e8',
    secondaryColor: '#395d64',
    pattern: 'routes',
  },
  {
    label: '\u793e\u533a\u517b\u8001',
    backgroundColor: '#748468',
    accentColor: '#eef3df',
    secondaryColor: '#53664c',
    pattern: 'care',
  },
  {
    label: '\u5145\u7535\u7f51\u7edc',
    backgroundColor: '#687999',
    accentColor: '#e4ebff',
    secondaryColor: '#465a80',
    pattern: 'charge',
  },
  {
    label: '\u6587\u65c5\u6d88\u8d39',
    backgroundColor: '#8a7662',
    accentColor: '#f3e8d6',
    secondaryColor: '#6e5948',
    pattern: 'travel',
  },
  {
    label: '\u9632\u6c5b\u5e94\u6025',
    backgroundColor: '#747f88',
    accentColor: '#e7eef2',
    secondaryColor: '#53606b',
    pattern: 'weather',
  },
  {
    label: '\u6821\u56ed\u4ea4\u901a',
    backgroundColor: '#507b72',
    accentColor: '#dff0ec',
    secondaryColor: '#35645c',
    pattern: 'school',
  },
  {
    label: '\u6587\u5316\u7a7a\u95f4',
    backgroundColor: '#786e91',
    accentColor: '#ece6f5',
    secondaryColor: '#5f5577',
    pattern: 'culture',
  },
  {
    label: '\u5bb6\u5ead\u5065\u5eb7',
    backgroundColor: '#85705d',
    accentColor: '#f1e7dd',
    secondaryColor: '#665442',
    pattern: 'health',
  },
  {
    label: '\u6570\u5b57\u5546\u6237',
    backgroundColor: '#5b7d9a',
    accentColor: '#e4eef6',
    secondaryColor: '#41647f',
    pattern: 'business',
  },
  {
    label: '\u7eff\u8272\u529e\u516c',
    backgroundColor: '#74805b',
    accentColor: '#edf3dc',
    secondaryColor: '#566542',
    pattern: 'green',
  },
];

const internationalCoverVisuals: NewsCoverVisual[] = [
  {
    label: '\u80fd\u6e90\u50a8\u5907',
    backgroundColor: '#687999',
    accentColor: '#e8eeff',
    secondaryColor: '#455a81',
    pattern: 'energy',
  },
  {
    label: '\u6570\u5b57\u652f\u4ed8',
    backgroundColor: '#507b72',
    accentColor: '#dff0ec',
    secondaryColor: '#37655e',
    pattern: 'payments',
  },
  {
    label: '\u6e2f\u53e3\u7269\u6d41',
    backgroundColor: '#5f7f86',
    accentColor: '#d8e6e8',
    secondaryColor: '#3e6269',
    pattern: 'port',
  },
  {
    label: '\u592a\u9633\u80fd',
    backgroundColor: '#748468',
    accentColor: '#eef3df',
    secondaryColor: '#55694b',
    pattern: 'solar',
  },
  {
    label: '\u519c\u4e1a\u6c14\u5019',
    backgroundColor: '#8a7662',
    accentColor: '#f3e8d6',
    secondaryColor: '#6d5846',
    pattern: 'agri',
  },
  {
    label: '\u822a\u7a7a\u67a2\u7ebd',
    backgroundColor: '#5b7d9a',
    accentColor: '#e4eef6',
    secondaryColor: '#3f627f',
    pattern: 'aviation',
  },
  {
    label: 'AI\u79d1\u6280',
    backgroundColor: '#786e91',
    accentColor: '#ece6f5',
    secondaryColor: '#5f5577',
    pattern: 'robotics',
  },
  {
    label: '\u5168\u7403\u6559\u80b2',
    backgroundColor: '#747f88',
    accentColor: '#e7eef2',
    secondaryColor: '#53606b',
    pattern: 'education',
  },
  {
    label: '\u7b7e\u8bc1\u65c5\u884c',
    backgroundColor: '#85705d',
    accentColor: '#f1e7dd',
    secondaryColor: '#665442',
    pattern: 'visa',
  },
  {
    label: '\u56fd\u9645\u8d5b\u4e8b',
    backgroundColor: '#74805b',
    accentColor: '#edf3dc',
    secondaryColor: '#566542',
    pattern: 'event',
  },
];

const homeTemplates: NewsTemplate[] = [
  {
    title: '城市通勤高峰继续恢复',
    summary: '多地早晚高峰客流保持温和增长，公共交通与共享出行需求同步回升。',
    whyItMatters: '通勤强度通常能反映城市活动水平，也会影响商圈、人力和服务业节奏。',
    source: '本地模拟数据',
    placeholderColor: colors[0],
  },
  {
    title: '社区养老服务点增加',
    summary: '多个街道试点把餐食、护理咨询和日间活动放到更近的社区空间。',
    whyItMatters: '老龄服务越靠近日常生活，家庭照护压力越容易被分担。',
    source: '民生观察',
    placeholderColor: colors[1],
  },
  {
    title: '新能源汽车充电排队缓解',
    summary: '新增快充桩投入后，部分商场和办公区的晚间等待时间有所下降。',
    whyItMatters: '补能体验会直接影响用户对新能源车的使用信心。',
    source: '出行简报',
    placeholderColor: colors[2],
  },
  {
    title: '暑期文旅预订提前升温',
    summary: '亲子游、短途游和夜间消费项目的咨询量继续增加。',
    whyItMatters: '文旅消费能带动餐饮、交通和本地小店的连锁收入。',
    source: '消费样本',
    placeholderColor: colors[3],
  },
  {
    title: '多地更新防汛物资清单',
    summary: '基层仓库补充抽水泵、照明设备和应急食品，准备应对强降雨。',
    whyItMatters: '提前备货可以缩短灾害响应时间，减少极端天气造成的影响。',
    source: '应急播报',
    placeholderColor: colors[4],
  },
  {
    title: '校园周边交通优化试行',
    summary: '部分学校门口设置临停区和错峰引导，减少接送拥堵。',
    whyItMatters: '小尺度交通改造能改善家庭日常时间成本，也提升步行安全。',
    source: '城市更新',
    placeholderColor: colors[5],
  },
  {
    title: '线下书店活动频率提高',
    summary: '新书分享、儿童阅读和小型展览让书店承担更多社区文化功能。',
    whyItMatters: '稳定的线下文化空间有助于形成低成本、高频率的公共生活。',
    source: '文化笔记',
    placeholderColor: colors[6],
  },
  {
    title: '家庭健康设备销量平稳',
    summary: '血压计、睡眠监测和运动记录设备保持稳定购买需求。',
    whyItMatters: '自我健康管理正在进入更普通的家庭场景。',
    source: '健康观察',
    placeholderColor: colors[7],
  },
  {
    title: '小微商户数字收款升级',
    summary: '更多门店开始使用聚合账单、会员提醒和库存记录工具。',
    whyItMatters: '轻量数字化能帮助小店更清楚地看见现金流和复购变化。',
    source: '商业样本',
    placeholderColor: colors[8],
  },
  {
    title: '绿色办公改造继续推进',
    summary: '节能照明、纸张减量和空调分区管理成为更多企业的低成本选择。',
    whyItMatters: '办公节能是企业可持续行动中最容易落地的一步。',
    source: '低碳记录',
    placeholderColor: colors[9],
  },
];

const internationalTemplates: NewsTemplate[] = [
  {
    title: '欧洲多国讨论能源储备',
    summary: '政策焦点转向储气、跨境电网和可再生能源调度的协同安排。',
    whyItMatters: '能源安全会影响冬季价格、工业成本和地区政策协调。',
    source: '国际模拟数据',
    placeholderColor: colors[2],
  },
  {
    title: '东南亚数字支付增长',
    summary: '移动钱包和即时转账服务在零售、交通和外卖场景继续扩展。',
    whyItMatters: '支付基础设施会改变小商户接触金融服务的方式。',
    source: '区域简报',
    placeholderColor: colors[5],
  },
  {
    title: '北美港口自动化项目推进',
    summary: '新的调度系统和岸桥设备用于提高集装箱周转效率。',
    whyItMatters: '港口效率会影响跨境供应链成本和货物交付稳定性。',
    source: '物流观察',
    placeholderColor: colors[0],
  },
  {
    title: '非洲太阳能微电网扩张',
    summary: '偏远社区通过小规模储能和本地维护获得更稳定的供电。',
    whyItMatters: '可靠电力是教育、医疗和小企业发展的基础条件。',
    source: '能源笔记',
    placeholderColor: colors[1],
  },
  {
    title: '拉美农产品出口关注气候',
    summary: '干旱和降雨波动让种植者更重视保险、灌溉和品种调整。',
    whyItMatters: '主要农产品价格变化会传导到全球食品供应链。',
    source: '农业观察',
    placeholderColor: colors[3],
  },
  {
    title: '中东航空枢纽继续扩容',
    summary: '多家机场投资候机楼、货运区和长途航线衔接能力。',
    whyItMatters: '航空枢纽竞争会重塑跨洲旅行和高价值货运路线。',
    source: '交通简报',
    placeholderColor: colors[8],
  },
  {
    title: '日韩企业加码机器人应用',
    summary: '服务、仓储和制造场景中的协作机器人部署继续增加。',
    whyItMatters: '老龄化与劳动力短缺会推动自动化从工厂走向日常服务。',
    source: '科技观察',
    placeholderColor: colors[6],
  },
  {
    title: '全球高校更新AI课程',
    summary: '更多专业把数据素养、模型评估和伦理讨论加入基础课程。',
    whyItMatters: '教育体系的调整会影响下一代劳动者的核心技能。',
    source: '教育简报',
    placeholderColor: colors[4],
  },
  {
    title: '跨境旅游签证流程优化',
    summary: '部分目的地试行电子材料和更短审核周期，以吸引淡季游客。',
    whyItMatters: '入境便利度会影响航线恢复、酒店入住和本地服务收入。',
    source: '旅行观察',
    placeholderColor: colors[7],
  },
  {
    title: '国际体育赛事关注可持续',
    summary: '主办方更多使用临时设施、公共交通方案和低碳采购标准。',
    whyItMatters: '大型赛事的组织方式会成为城市治理和品牌展示的一部分。',
    source: '体育商业',
    placeholderColor: colors[9],
  },
];

const templatesByCategory: Record<NewsCategory, NewsTemplate[]> = {
  home: homeTemplates,
  international: internationalTemplates,
};

const coverVisualsByCategory: Record<NewsCategory, NewsCoverVisual[]> = {
  home: homeCoverVisuals,
  international: internationalCoverVisuals,
};

export function getMockNews(category: NewsCategory, dateKey: string): NewsItem[] {
  const templateIndexes = getDeterministicOrder(
    templatesByCategory[category].length,
    getDateSeed(`${category}-${dateKey}`),
  );

  return templateIndexes.map((templateIndex, index) => {
    const template = templatesByCategory[category][templateIndex];

    return {
    ...template,
    coverVisual: coverVisualsByCategory[category][templateIndex],
    id: `${category}-${dateKey}-${index + 1}`,
    };
  });
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
