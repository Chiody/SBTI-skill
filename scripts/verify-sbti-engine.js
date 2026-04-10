#!/usr/bin/env node
'use strict';

const path = require('path');

const root = path.join(__dirname, '..');
const data = require(path.join(root, 'miniprogram/utils/sbti-data.js'));
const engine = require(path.join(root, 'miniprogram/utils/sbti-engine.js'));

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assert failed');
}

assert(Array.isArray(data.questions) && data.questions.length >= 30, 'questions missing');
assert(data.TYPE_LIBRARY && data.TYPE_LIBRARY.CTRL, 'TYPE_LIBRARY missing');
const normalCount = data.NORMAL_TYPES ? data.NORMAL_TYPES.length : 0;
assert(normalCount >= 23, `NORMAL_TYPES too short: ${normalCount}`);

const keys = Object.keys(data.TYPE_LIBRARY);
assert(keys.length >= 26, `TYPE_LIBRARY keys too few: ${keys.length}`);

const shuffled = engine.buildShuffledQuestions();
assert(shuffled.length >= 31, 'shuffled should include gate question + regular');

const answers = {};
shuffled.forEach(q => {
  if (q.special) {
    answers[q.id] = q.id === 'drink_gate_q1' ? 1 : 1;
  } else {
    answers[q.id] = 2;
  }
});

const r = engine.computeResult(answers, shuffled);
assert(r && r.finalType && r.finalType.code, 'computeResult should return finalType.code');
assert(Array.isArray(r.dims) && r.dims.length === 15, 'dims should be 15');

console.log('verify-sbti-engine: OK', {
  questions: data.questions.length,
  typeLibraryKeys: keys.length,
  normalTypes: data.NORMAL_TYPES.length,
  sampleResult: r.finalType.code
});
