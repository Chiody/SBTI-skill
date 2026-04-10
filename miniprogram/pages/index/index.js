'use strict';

const engine = require('../../utils/sbti-engine.js');

Page({
  onStart() {
    const app = getApp();
    app.globalData.answers = {};
    app.globalData.shuffledQuestions = engine.buildShuffledQuestions();
    app.globalData.lastResult = null;
    wx.navigateTo({ url: '/pages/test/test' });
  }
});
