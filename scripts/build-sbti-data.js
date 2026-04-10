'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const startTag = 'const dimensionMeta';
const endTag = "const DRUNK_TRIGGER_QUESTION_ID = 'special_gate_q2';";
const i0 = html.indexOf(startTag);
const i1 = html.indexOf(endTag);
if (i0 < 0 || i1 < 0) {
  console.error('markers not found', { i0, i1 });
  process.exit(1);
}
const chunk = html.slice(i0, i1 + endTag.length);
const body = chunk.replace(/"\.\/image\//g, '"/packageImages/images/');
const out =
  "'use strict';\n" +
  'module.exports = (function () {\n' +
  body +
  '\nreturn {\n' +
  '  dimensionMeta,\n' +
  '  questions,\n' +
  '  specialQuestions,\n' +
  '  TYPE_LIBRARY,\n' +
  '  TYPE_IMAGES,\n' +
  '  NORMAL_TYPES,\n' +
  '  DIM_EXPLANATIONS,\n' +
  '  dimensionOrder,\n' +
  '  DRUNK_TRIGGER_QUESTION_ID\n' +
  '};\n' +
  '})();\n';

const outDir = path.join(root, 'miniprogram', 'utils');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'sbti-data.js'), out);
console.log('wrote miniprogram/utils/sbti-data.js');
