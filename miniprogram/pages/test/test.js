'use strict';

const engine = require('../../utils/sbti-engine.js');

Page({
  data: {
    visibleList: [],
    total: 0,
    done: 0,
    progressPercent: 0,
    submitDisabled: true,
    hintText: '全选完才会放行。世界已经够乱了，起码把题做完整。'
  },

  onLoad() {
    const app = getApp();
    if (!app.globalData.shuffledQuestions.length) {
      app.globalData.answers = {};
      app.globalData.shuffledQuestions = engine.buildShuffledQuestions();
    }
    this.refresh();
  },

  refresh() {
    const app = getApp();
    const { shuffledQuestions, answers } = app.globalData;
    const visibleList = engine.mapVisibleForView(shuffledQuestions, answers);
    const { total, done, percent, complete } = engine.progressState(shuffledQuestions, answers);
    this.setData({
      visibleList,
      total,
      done,
      progressPercent: percent,
      submitDisabled: !complete,
      hintText: complete
        ? '都做完了。现在可以把你的电子魂魄交给结果页审判。'
        : '全选完才会放行。世界已经够乱了，起码把题做完整。'
    });
  },

  onAnswerChange(e) {
    const qid = e.currentTarget.dataset.qid;
    const val = Number(e.detail.value);
    const app = getApp();
    app.globalData.answers[qid] = val;
    if (qid === 'drink_gate_q1' && val !== 3) {
      delete app.globalData.answers.drink_gate_q2;
    }
    this.refresh();
  },

  onBackHome() {
    wx.navigateBack({ fail: () => wx.reLaunch({ url: '/pages/index/index' }) });
  },

  onSubmit() {
    const app = getApp();
    if (this.data.submitDisabled) return;
    const r = engine.computeResult(app.globalData.answers, app.globalData.shuffledQuestions);
    app.globalData.lastResult = r;
    wx.navigateTo({ url: '/pages/result/result' });
  }
});
