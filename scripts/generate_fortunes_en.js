const fs = require('fs');

const subjects = [
  'You', 'Today you', 'Future you', 'The brave you', 'The calm you', 'The focused you', 'The creative you',
  'The patient you', 'The honest you', 'The resilient you', 'The kind you', 'The determined you'
];

const openings = [
  'are about to receive', 'will soon meet', 'are steadily building', 'are ready to unlock', 'are attracting',
  'will discover', 'are moving toward', 'will turn into reality through', 'are now aligned with', 'are prepared for'
];

const blessings = [
  'a good surprise', 'new opportunities', 'better momentum', 'clear direction', 'meaningful support', 'strong confidence',
  'a lucky break', 'peaceful progress', 'unexpected kindness', 'a valuable connection', 'a practical win', 'fresh inspiration'
];

const endings = [
  '. Keep going.', '. Trust your process.', '. Your timing is better than you think.', '. Keep showing up.',
  '. The next step will be easier.', '. You are closer than you feel.', '. Your effort is compounding.', '. Stay open to small signs.'
];

const birthdayOpeners = [
  'Happy birthday', 'Wishing you a happy birthday', 'On your birthday', 'Today is your birthday', 'Birthday blessings to you'
];

const birthdayWishes = [
  'may your year be full of joy', 'may your plans bloom', 'may your health stay strong', 'may your dreams gain momentum',
  'may your days stay bright', 'may your work be meaningful', 'may your heart stay peaceful', 'may good news find you often'
];

const birthdayEndings = [
  '.', '. Celebrate yourself fully today.', '. You deserve a beautiful new chapter.', '. May luck walk beside you this year.', '. Keep shining.'
];

const moods = ['morning', 'afternoon', 'evening', 'weekend', 'this week', 'this month'];
const actions = ['one more brave move', 'a bit more patience', 'one clear decision', 'a focused hour', 'a kind message', 'a small finish'];
const outcomes = [
  'can change everything.', 'will open a better path.', 'will create visible progress.', 'will attract the right people.',
  'will bring calmer energy.', 'will move your goal forward.'
];

const general = [];
for (const s of subjects) {
  for (const o of openings) {
    for (const b of blessings) {
      for (const e of endings) {
        general.push(`${s} ${o} ${b}${e}`);
      }
    }
  }
}

const birthday = [];
for (const o of birthdayOpeners) {
  for (const w of birthdayWishes) {
    for (const e of birthdayEndings) {
      birthday.push(`${o}, ${w}${e}`);
      birthday.push(`${o}! ${w}${e}`);
    }
  }
}

const situational = [];
for (const m of moods) {
  for (const a of actions) {
    for (const o of outcomes) {
      situational.push(`In the ${m}, ${a} ${o}`);
    }
  }
}

const mixed = [...general.slice(0, 9384), ...birthday, ...situational];
if (mixed.length !== 10000) {
  throw new Error(`Expected 10000 lines, got ${mixed.length}`);
}

fs.writeFileSync('fortunes_en_10000.txt', mixed.join('\n') + '\n', 'utf8');
console.log(`Generated fortunes_en_10000.txt with ${mixed.length} lines.`);
