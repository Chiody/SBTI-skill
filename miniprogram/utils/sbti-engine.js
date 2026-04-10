'use strict';

const {
  dimensionMeta,
  questions,
  specialQuestions,
  TYPE_LIBRARY,
  TYPE_IMAGES,
  NORMAL_TYPES,
  DIM_EXPLANATIONS,
  dimensionOrder,
  DRUNK_TRIGGER_QUESTION_ID
} = require('./sbti-data.js');

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildShuffledQuestions() {
  const shuffledRegular = shuffle(questions);
  const insertIndex = Math.floor(Math.random() * shuffledRegular.length) + 1;
  return [
    ...shuffledRegular.slice(0, insertIndex),
    specialQuestions[0],
    ...shuffledRegular.slice(insertIndex)
  ];
}

function getVisibleQuestions(shuffled, answers) {
  const visible = [...shuffled];
  const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1');
  if (gateIndex !== -1 && answers.drink_gate_q1 === 3) {
    visible.splice(gateIndex + 1, 0, specialQuestions[1]);
  }
  return visible;
}

function sumToLevel(score) {
  if (score <= 3) return 'L';
  if (score === 4) return 'M';
  return 'H';
}

function levelNum(level) {
  return { L: 1, M: 2, H: 3 }[level];
}

function parsePattern(pattern) {
  return pattern.replace(/-/g, '').split('');
}

function getDrunkTriggered(answers) {
  return answers[DRUNK_TRIGGER_QUESTION_ID] === 2;
}

function computeResult(answers, shuffledQuestions) {
  const rawScores = {};
  const levels = {};
  Object.keys(dimensionMeta).forEach(dim => {
    rawScores[dim] = 0;
  });

  questions.forEach(q => {
    rawScores[q.dim] += Number(answers[q.id] || 0);
  });

  Object.entries(rawScores).forEach(([dim, score]) => {
    levels[dim] = sumToLevel(score);
  });

  const userVector = dimensionOrder.map(dim => levelNum(levels[dim]));
  const ranked = NORMAL_TYPES.map(type => {
    const vector = parsePattern(type.pattern).map(levelNum);
    let distance = 0;
    let exact = 0;
    for (let i = 0; i < vector.length; i++) {
      const diff = Math.abs(userVector[i] - vector[i]);
      distance += diff;
      if (diff === 0) exact += 1;
    }
    const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));
    return { ...type, ...TYPE_LIBRARY[type.code], distance, exact, similarity };
  }).sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    if (b.exact !== a.exact) return b.exact - a.exact;
    return b.similarity - a.similarity;
  });

  const bestNormal = ranked[0];
  const drunkTriggered = getDrunkTriggered(answers);

  let finalType;
  let modeKicker = '你的主类型';
  let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`;
  let sub = '维度命中度较高，当前结果可视为你的第一人格画像。';
  let special = false;
  let secondaryType = null;

  if (drunkTriggered) {
    finalType = TYPE_LIBRARY.DRUNK;
    secondaryType = bestNormal;
    modeKicker = '隐藏人格已激活';
    badge = '匹配度 100% · 酒精异常因子已接管';
    sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。';
    special = true;
  } else if (bestNormal.similarity < 60) {
    finalType = TYPE_LIBRARY.HHHH;
    modeKicker = '系统强制兜底';
    badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`;
    sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。';
    special = true;
  } else {
    finalType = bestNormal;
  }

  const dims = dimensionOrder.map(dim => {
    const level = levels[dim];
    return {
      name: dimensionMeta[dim].name,
      level,
      score: rawScores[dim],
      explanation: DIM_EXPLANATIONS[dim][level]
    };
  });

  return {
    finalType,
    modeKicker,
    badge,
    sub,
    special,
    secondaryType,
    dims,
    posterSrc: TYPE_IMAGES[finalType.code] || '',
    secondaryPosterSrc: secondaryType ? (TYPE_IMAGES[secondaryType.code] || '') : '',
    intro: finalType.intro,
    desc: finalType.desc
  };
}

function progressState(shuffled, answers) {
  const visible = getVisibleQuestions(shuffled, answers);
  const total = visible.length;
  const done = visible.filter(q => answers[q.id] !== undefined).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const complete = done === total && total > 0;
  return { total, done, percent, complete };
}

function mapVisibleForView(shuffled, answers) {
  const visible = getVisibleQuestions(shuffled, answers);
  return visible.map((q, idx) => ({
    id: q.id,
    text: q.text,
    indexLabel: idx + 1,
    metaLabel: q.special ? '补充题' : '维度已隐藏',
    answer: answers[q.id],
    options: q.options.map((opt, oi) => ({
      value: String(opt.value),
      numValue: opt.value,
      label: opt.label,
      code: ['A', 'B', 'C', 'D'][oi] || String(oi + 1)
    }))
  }));
}

module.exports = {
  buildShuffledQuestions,
  getVisibleQuestions,
  computeResult,
  progressState,
  mapVisibleForView
};
