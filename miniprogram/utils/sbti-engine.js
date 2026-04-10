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
  const gateIndex = visible.findIndex(q => q.id === 'special_gate_q1');
  if (gateIndex !== -1 && answers.special_gate_q1 === 3) {
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
  let modeKicker = 'Your primary type';
  let badge = `Match ${bestNormal.similarity}% · ${bestNormal.exact}/15 dimensions`;
  let sub = 'High dimensional match. This is your primary personality profile.';
  let special = false;
  let secondaryType = null;

  if (drunkTriggered) {
    finalType = TYPE_LIBRARY.HIDDEN;
    secondaryType = bestNormal;
    modeKicker = 'Hidden personality activated';
    badge = 'Match 100% · Special trigger factor detected';
    sub = 'Special branch triggered; standard matching bypassed.';
    special = true;
  } else if (bestNormal.similarity < 60) {
    finalType = TYPE_LIBRARY.FALLBACK;
    modeKicker = 'Fallback assignment';
    badge = `Best match only ${bestNormal.similarity}%`;
    sub = 'No standard type matched above threshold; fallback type assigned.';
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
    metaLabel: q.special ? 'Special' : 'Dimension hidden',
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
