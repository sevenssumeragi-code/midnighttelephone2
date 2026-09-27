/*
 * 音声管理。素材が無い場合は静かに無視する（ゲームは止まらない）。
 * BGM はクロスフェード、SE はワンショット。
 */
(function () {
  'use strict';
  var A = window.MTAudio = {
    bgm: null, bgmId: null,
    vol: { bgm: 0.6, se: 0.8 },
    missing: {},
    setVolume: function (kind, v) {
      A.vol[kind] = v;
      if (kind === 'bgm' && A.bgm) A.bgm.volume = v;
    },
    playBgm: function (id) {
      if (id === A.bgmId) return;
      var old = A.bgm;
      A.bgmId = id || null;
      A.bgm = null;
      if (old) fadeOut(old);
      if (!id) return;
      var path = (window.ASSETS.bgm || {})[id];
      if (!path || A.missing[path]) return;
      var a = new Audio(path);
      a.loop = true;
      a.volume = 0;
      a.addEventListener('error', function () { A.missing[path] = true; });
      var p = a.play();
      if (p && p.catch) p.catch(function () { /* 自動再生制限・素材なし */ });
      A.bgm = a;
      fadeIn(a, A.vol.bgm);
    },
    playSe: function (id) {
      var path = (window.ASSETS.se || {})[id];
      if (!path || A.missing[path] || A.vol.se <= 0) return;
      var a = new Audio(path);
      a.volume = A.vol.se;
      a.addEventListener('error', function () { A.missing[path] = true; });
      var p = a.play();
      if (p && p.catch) p.catch(function () {});
    }
  };
  function fadeOut(a) {
    var t = setInterval(function () {
      a.volume = Math.max(0, a.volume - 0.05);
      if (a.volume <= 0) { clearInterval(t); a.pause(); }
    }, 40);
  }
  function fadeIn(a, target) {
    var t = setInterval(function () {
      if (A.bgm !== a) { clearInterval(t); return; }
      a.volume = Math.min(target, a.volume + 0.05);
      if (a.volume >= target) clearInterval(t);
    }, 40);
  }
})();
