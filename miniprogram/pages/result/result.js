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
      wx.showToast({ title: '请先完成测试', icon: 'none' });
      setTimeout(() => {
        wx.navigateBack({ fail: () => wx.reLaunch({ url: '/pages/index/index' }) });
      }, 400);
      return;
    }
    const st = r.secondaryType;
    const secondaryLine = st
      ? `若未触发隐藏人格，系统本判定你为 ${st.code}（${st.cn}），匹配度 ${st.similarity}% · 精准命中 ${st.exact}/15 维。`
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
        ? '本测试仅供娱乐。隐藏人格与傻乐兜底为测试内置规则，请勿把它当成医学、心理学、相学、命理学或灵异学依据。'
        : '本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。你可以笑，但别太当真。'
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
