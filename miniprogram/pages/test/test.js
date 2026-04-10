'use strict';

const engine = require('../../utils/sbti-engine.js');

Page({
  data: {
    visibleList: [],
    total: 0,
    done: 0,
    progressPercent: 0,
    submitDisabled: true,
    hintText: 'Answer all questions before submitting.'
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
        ? 'All done. Submit to see your result.'
        : 'Answer all questions before submitting.'
    });
  },

  onAnswerChange(e) {
    const qid = e.currentTarget.dataset.qid;
    const val = Number(e.detail.value);
    const app = getApp();
    app.globalData.answers[qid] = val;
    if (qid === 'special_gate_q1' && val !== 3) {
      delete app.globalData.answers.special_gate_q2;
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
