/*
 * Midnight Telephone — 起動処理・入力
 */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var UI = window.MTUI;

  var compiled = window.MTCompiler.compileAll(window.SCENARIO);
  if (compiled.errors.length) {
    console.error(compiled.errors.map(function (e) { return e.message; }).join('\n'));
    alert('シナリオのコンパイルエラー:\n' + compiled.errors.slice(0, 5).map(function (e) { return e.message; }).join('\n'));
  }
  UI.vm = new window.MTEngine(compiled, UI.host, UI.globals);

  var Main = window.MTMain = {
    enterGame: function () {
      UI.inGame = true;
      $('#title').classList.add('hidden');
      $('#game').classList.remove('hidden');
      $('#endscreen').classList.add('hidden');
    },
    toTitle: function () {
      UI.inGame = false;
      UI.setSkip(false); UI.setAuto(false);
      $('#game').classList.add('hidden');
      $('#title').classList.remove('hidden');
      $('#endscreen').classList.add('hidden');
      window.MTAudio.playBgm('bgm_title');
      refreshTitle();
    },
    newGame: function () {
      Main.enterGame();
      UI.backlog = [];
      UI.resetVisualCache();
      $('#choices').classList.add('hidden');
      UI.vm.start('start');
    }
  };

  function refreshTitle() {
    var hasSave = !!UI.latestSave();
    $('[data-title=continue]').disabled = !hasSave;
    $('[data-title=load]').disabled = !hasSave;
    var ends = Object.keys(UI.globals.endings).length;
    var cgs = window.CG_LIST.filter(function (c) { return UI.globals.cg[c.id]; }).length;
    $('#title-foot').textContent = 'ENDING ' + ends + '/' + window.ENDINGS.length + '　CG ' + cgs + '/' + window.CG_LIST.length + (UI.globals.flags.G_TRUE ? '　☆' : '');
    var tb = window.ASSETS.ui && window.ASSETS.ui.title_bg;
    if (tb) { var img = new Image(); img.onload = function () { $('.title-bg').style.backgroundImage = 'url(' + tb + ')'; }; img.src = tb; }
  }

  /* ---------- 画面サイズ ---------- */
  function fit() {
    var s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    var st = $('#stage');
    st.style.transform = 'scale(' + s + ')';
    st.style.setProperty('--scale', s);
  }
  window.addEventListener('resize', fit);
  fit();

  /* ---------- タイトル ---------- */
  document.querySelectorAll('[data-title]').forEach(function (b) {
    b.addEventListener('click', function () {
      var a = b.getAttribute('data-title');
      if (a === 'new') Main.newGame();
      else if (a === 'continue') { var s = UI.latestSave(); if (s) UI.loadSnapshot(s); }
      else if (a === 'load') UI.openLoad();
      else if (a === 'gallery') UI.openGallery();
      else if (a === 'endings') UI.openEndings();
      else if (a === 'memo') UI.openMemo();
      else if (a === 'sound') UI.openSound();
      else if (a === 'config') UI.openConfig();
    });
  });

  /* ---------- クイックメニュー ---------- */
  document.querySelectorAll('#quickmenu button').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var a = b.getAttribute('data-act');
      if (a === 'auto') UI.setAuto(!UI.auto);
      else if (a === 'skip') UI.setSkip(!UI.skip);
      else if (a === 'log') UI.openLog();
      else if (a === 'save') UI.openSave();
      else if (a === 'load') UI.openLoad();
      else if (a === 'qsave') UI.quickSave();
      else if (a === 'qload') UI.quickLoad();
      else if (a === 'memo') UI.openMemo();
      else if (a === 'config') UI.openConfig();
      else if (a === 'hide') $('#game').classList.add('hide-ui');
      else if (a === 'title') { if (confirm('タイトルに戻りますか？（未セーブの進行は失われます）')) Main.toTitle(); }
    });
  });

  /* ---------- 進行 ---------- */
  $('#game').addEventListener('click', function (e) {
    if (e.target.closest('#quickmenu') || e.target.closest('#choices button')) return;
    UI.clickAdvance();
  });
  $('#game').addEventListener('contextmenu', function (e) { e.preventDefault(); $('#game').classList.toggle('hide-ui'); });
  $('#titlecard').addEventListener('click', function (e) { e.stopPropagation(); UI.clickAdvance(); });
  $('#game').addEventListener('wheel', function (e) { if (e.deltaY < 0 && UI.inGame && $('#modal').classList.contains('hidden')) UI.openLog(); });

  $('#modal-close').addEventListener('click', function () { UI.closeModal(); });
  $('#modal').addEventListener('click', function (e) { if (e.target.id === 'modal') UI.closeModal(); });

  $('#namein-ok').addEventListener('click', submitName);
  $('#namein-input').addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.isComposing) submitName(); });
  function submitName() {
    $('#namein').classList.add('hidden');
    UI.vm.setName($('#namein-input').value);
  }
  $('#end-ok').addEventListener('click', function () { Main.toTitle(); });

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'Escape') { if (!$('#modal').classList.contains('hidden')) UI.closeModal(); else if (document.getElementById('cgview')) document.getElementById('cgview').remove(); return; }
    if (!UI.inGame || !$('#modal').classList.contains('hidden')) return;
    if (e.key === 'Control') { if (!UI.ctrlSkip) { UI.ctrlSkip = true; UI.setSkip(true); } return; }
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); UI.clickAdvance(); }
    else if (e.key === 'a' || e.key === 'A') UI.setAuto(!UI.auto);
    else if (e.key === 'l' || e.key === 'L' || e.key === 'PageUp') UI.openLog();
    else if (e.key === 'h' || e.key === 'H') $('#game').classList.toggle('hide-ui');
    else if (e.key === 'F5') { e.preventDefault(); UI.quickSave(); }
    else if (e.key === 'F9') { e.preventDefault(); UI.quickLoad(); }
    else if (/^[1-9]$/.test(e.key) && !$('#choices').classList.contains('hidden')) {
      var btns = document.querySelectorAll('#choices button');
      var b = btns[parseInt(e.key, 10) - 1];
      if (b) b.click();
    }
  });
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Control' && UI.ctrlSkip) { UI.ctrlSkip = false; UI.setSkip(false); }
  });

  UI.applySettings();
  if (/[?&]debug=1/.test(location.search)) UI.initDebug();
  $('#game').classList.add('hidden');
  Main.toTitle();
})();
