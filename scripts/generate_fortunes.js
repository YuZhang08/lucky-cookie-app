const fs = require('fs');

const subjects = [
  '你', '今天的你', '未来的你', '此刻的你', '勇敢的你', '温柔的你', '专注的你', '发光的你',
  '坚持的你', '努力的你', '真实的你', '独特的你', '聪明的你', '幸运的你', '平静的你', '热爱的你'
];

const openings = [
  '正在迎来', '很快会遇见', '会稳稳接住', '将悄悄打开', '已经走进', '会一步步靠近', '终将拥有', '正在积累',
  '会在今天收获', '会在本周遇到', '会在这个月实现', '会在关键时刻看见', '会比想象中更快得到', '会在转角处发现', '会把平凡变成', '会把等待化作'
];

const blessings = [
  '好消息', '新机会', '温暖回应', '意外惊喜', '贵人帮助', '心想事成', '平安顺遂', '好运连连', '事业进展', '学业突破',
  '感情升温', '财富增长', '灵感爆发', '目标达成', '压力减轻', '状态回升', '自信增长', '笑容常在', '快乐翻倍', '福气满满'
];

const endings = [
  '，继续相信自己。', '，你值得这份好运。', '，前路会越来越清晰。', '，一切都在向好发展。', '，今天请大胆一点。',
  '，会有人为你鼓掌。', '，你的坚持正在发光。', '，答案会在行动里出现。', '，请记得为自己骄傲。', '，你的节奏刚刚好。',
  '，请把笑容留给今天。', '，好运会按时到达。', '，下一步会更顺。', '，每一步都算数。', '，你的选择会带来礼物。', '，好事正在路上。'
];

const birthdayOpeners = [
  '生日快乐', '祝你生日快乐', '今天是你的生日', '在你的生日这天', '愿你生日这天', '新的一岁开始了',
  '属于你的庆生日', '蛋糕和蜡烛都在等你'
];

const birthdayWishes = [
  '愿你心想事成', '愿你健康平安', '愿你万事顺意', '愿你前程似锦', '愿你天天开心', '愿你被爱包围',
  '愿你勇敢追梦', '愿你好运常伴', '愿你笑口常开', '愿你一年比一年闪耀', '愿你福气满满', '愿你喜乐无忧'
];

const birthdayEndings = [
  '，今天和每一天都值得庆祝。', '，把愿望都点亮。', '，把快乐写进新的一岁。', '，继续做闪闪发光的自己。',
  '，愿好事如约而至。', '，愿你岁岁常欢愉。', '，愿你年年皆胜意。', '，愿你所愿皆可期。'
];

const seasonal = ['春天', '夏天', '秋天', '冬天', '清晨', '午后', '夜晚', '周末'];
const actions = ['多一点勇气', '多一点耐心', '多一点自信', '多一点温柔', '多一点专注', '多一点行动', '多一点松弛', '多一点热爱'];
const outcomes = ['就会迎来转机。', '会看见更大的世界。', '会遇见更好的答案。', '会离目标更近一步。', '会让好运更容易找到你。', '会让今天更有收获。', '会让生活更有光。', '会让心情更明亮。'];

const general = [];
for (const s of subjects) {
  for (const o of openings) {
    for (const b of blessings) {
      for (const e of endings) {
        general.push(`${s}${o}${b}${e}`);
      }
    }
  }
}

const birthday = [];
for (const o of birthdayOpeners) {
  for (const w of birthdayWishes) {
    for (const e of birthdayEndings) {
      birthday.push(`${o}，${w}${e}`);
      birthday.push(`${o}！${w}${e}`);
    }
  }
}

const seasonalLines = [];
for (const t of seasonal) {
  for (const a of actions) {
    for (const o of outcomes) {
      seasonalLines.push(`${t}里，给自己${a}，${o}`);
    }
  }
}

const pick = (arr, n) => arr.slice(0, Math.min(n, arr.length));
const mixed = [
  ...pick(general, 9200),
  ...pick(birthday, 500),
  ...pick(seasonalLines, 300)
];

if (mixed.length !== 10000) {
  throw new Error(`Expected 10000 lines, got ${mixed.length}`);
}

fs.writeFileSync('fortunes_10000.txt', mixed.join('\n') + '\n', 'utf8');
console.log(`Generated fortunes_10000.txt with ${mixed.length} lines.`);
