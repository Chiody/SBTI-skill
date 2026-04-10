'use strict';

const engine = require('../../utils/sbti-engine.js');

Page({
  data: {
    modeKicker: '',
    typeName: '',
    badge: '',
    sub: '',
    intro: '',
    desc: '',
    posterSrc: '',
    funNote: '',
    dimRows: [],
    showSecondary: false,
    secondaryLine: '',
    secondaryDesc: '',
    secondaryPosterSrc: ''
  },

  onShow() {
    const r = getApp().globalData.lastResult;
    if (!r) {
      wx.showToast({ title: 'Please complete the test first', icon: 'none' });
      setTimeout(() => {
        wx.navigateBack({ fail: () => wx.reLaunch({ url: '/pages/index/index' }) });
      }, 400);
      return;
    }
    const st = r.secondaryType;
    const secondaryLine = st
      ? `Without the hidden trigger, you would be ${st.code} (${st.cn}), match ${st.similarity}% · ${st.exact}/15 dimensions.`
      : '';
    this.setData({
      modeKicker: r.modeKicker,
      typeName: `${r.finalType.code}（${r.finalType.cn}）`,
      badge: r.badge,
      sub: r.sub,
      intro: r.intro,
      desc: r.desc,
      posterSrc: r.posterSrc,
      dimRows: r.dims,
      showSecondary: !!st,
      secondaryLine,
      secondaryDesc: st ? st.desc : '',
      secondaryPosterSrc: st ? r.secondaryPosterSrc : '',
      funNote: r.special
        ? 'For entertainment only. Hidden and fallback types are built-in engine rules.'
        : 'For entertainment only. Do not use as a clinical or professional assessment.'
    });
  },

  onRestart() {
    const app = getApp();
    app.globalData.answers = {};
    app.globalData.shuffledQuestions = engine.buildShuffledQuestions();
    app.globalData.lastResult = null;
    wx.redirectTo({ url: '/pages/test/test' });
  },

  onHome() {
    const app = getApp();
    app.globalData.shuffledQuestions = [];
    app.globalData.answers = {};
    app.globalData.lastResult = null;
    wx.reLaunch({ url: '/pages/index/index' });
  }
});
