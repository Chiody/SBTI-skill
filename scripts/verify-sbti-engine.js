#!/usr/bin/env node
'use strict';

const path = require('path');

const root = path.join(__dirname, '..');
const data = require(path.join(root, 'miniprogram/utils/sbti-data.js'));
const engine = require(path.join(root, 'miniprogram/utils/sbti-engine.js'));

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assert failed');
}

assert(Array.isArray(data.questions) && data.questions.length >= 1, 'questions missing');
assert(data.TYPE_LIBRARY && Object.keys(data.TYPE_LIBRARY).length >= 2, 'TYPE_LIBRARY too small');
const normalCount = data.NORMAL_TYPES ? data.NORMAL_TYPES.length : 0;
assert(normalCount >= 1, `NORMAL_TYPES too short: ${normalCount}`);

const keys = Object.keys(data.TYPE_LIBRARY);

const shuffled = engine.buildShuffledQuestions();
assert(shuffled.length >= data.questions.length, 'shuffled should include regular + gate question');

const answers = {};
shuffled.forEach(q => {
  answers[q.id] = q.options ? q.options[0].value : 1;
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
