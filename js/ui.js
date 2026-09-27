/*
 * Midnight Telephone — UI（VMのhost実装・各種メニュー）
 */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 保存不可環境 */ } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var SLOT_COUNT = 18;
  var DEFAULT_SETTINGS = { textSpeed: 30, autoWait: 1500, bgm: 0.6, se: 0.8, skipUnread: false, affToast: false, fontSize: 24 };

  var UI = window.MTUI = {
    vm: null,
    settings: Object.assign({}, DEFAULT_SETTINGS, LS.get('mt_settings', {})),
    globals: LS.get('mt_globals', { flags: {}, cg: {}, endings: {}, memo: {}, read: {} }),
    backlog: [],
    typing: null, fullText: '', auto: false, skip: false, ctrlSkip: false,
    autoTimer: null, choiceTimer: null, waitTimer: null, pending: null,
    imgCache: {},
    nameToChar: {},
    inGame: false
  };
  Object.keys(window.CHARACTERS).forEach(function (k) { UI.nameToChar[window.CHARACTERS[k].name] = k; });

  /* ================= 画像ロード（未配置ならプレースホルダー） ================= */
  function tryImage(path, ok, ng) {
    if (!path) { ng(); return; }
    var c = UI.imgCache[path];
    if (c === true) { ok(path); return; }
    if (c === false) { ng(); return; }
    var img = new Image();
    img.onload = function () { UI.imgCache[path] = true; ok(path); };
    img.onerror = function () { UI.imgCache[path] = false; ng(); };
    img.src = path;
  }
  function cgInfo(id) { return (window.CG_LIST || []).filter(function (c) { return c.id === id; })[0]; }

  /* ================= host 実装 ================= */
  var host = UI.host = {
    text: function (speaker, text, meta) {
      clearTimers();
      hideTitlecard();
      var nb = $('#namebox'), tb = $('#text');
      nb.textContent = speaker || '';
      var ch = speaker && UI.nameToChar[speaker];
      nb.style.color = ch ? window.CHARACTERS[ch].color : '';
      tb.className = speaker ? '' : 'narration';
      if (meta && meta.read) tb.classList.add('read');
      var shown = speaker ? '「' + text + '」' : text;
      UI.backlog.push({ name: speaker, text: shown });
      if (UI.backlog.length > 400) UI.backlog.shift();
      startTyping(shown, meta && meta.read);
    },
    choice: function (options, timed, def) {
      clearTimers();
      if (UI.skip && !UI.ctrlSkip) setSkip(false);
      var box = $('#choices');
      box.innerHTML = '';
      box.className = 'overlay';
      var ins = UI.vm.program[UI.vm.state.pc - 1];
      if (ins && ins.style === 'phone') box.classList.add('phone');
      options.forEach(function (o, i) {
        var b = document.createElement('button');
        b.textContent = o.text;
        b.onclick = function (e) { e.stopPropagation(); pickChoice(i); };
        box.appendChild(b);
      });
      if (timed) {
        var bar = document.createElement('div');
        bar.className = 'timer-bar';
        bar.innerHTML = '<div></div>';
        box.appendChild(bar);
        var inner = bar.firstChild;
        requestAnimationFrame(function () {
          inner.style.transitionDuration = timed + 'ms';
          inner.style.width = '0%';
        });
        UI.choiceTimer = setTimeout(function () {
          var idx = -1;
          options.forEach(function (o, i) { if (o.label === def) idx = i; });
          if (idx >= 0) pickChoice(idx); else { box.classList.add('hidden'); UI.vm.choose(def); }
        }, timed);
      }
    },
    inputName: function (def) {
      var w = $('#namein');
      w.classList.remove('hidden');
      var inp = $('#namein-input');
      inp.value = def;
      setTimeout(function () { inp.focus(); inp.select(); }, 50);
    },
    ending: function (id) {
      clearTimers();
      setSkip(false); setAuto(false);
      LS.del('mt_save_auto');
      var e = (window.ENDINGS || []).filter(function (x) { return x.id === id; })[0] || { title: id, type: '', no: '' };
      var s = $('#endscreen');
      s.querySelector('.end-type').textContent = e.type + ' END';
      s.querySelector('.end-no').textContent = 'No.' + e.no + ' / ' + (window.ENDINGS || []).length;
      s.querySelector('.end-title').textContent = '「' + e.title + '」';
      var seen = Object.keys(UI.globals.endings).length;
      s.querySelector('.end-hint').textContent = '到達エンディング ' + seen + ' / ' + window.ENDINGS.length + (e.type === 'BAD' ? '\nヒント：' + e.hint : '');
      s.classList.remove('hidden');
      if (e.type !== 'BAD') window.MTAudio.playBgm('bgm_ending');
    },
    visual: function (v) { renderVisual(v); },
    sound: function (kind, id) {
      if (kind === 'bgm') window.MTAudio.playBgm(id);
      else if (!UI.skip) window.MTAudio.playSe(id);
    },
    effect: function (name) {
      if (UI.skip) return;
      var fx = $('#layer-effect');
      if (name === 'shake') {
        var st = $('#stage');
        st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake');
        return;
      }
      fx.className = 'layer'; void fx.offsetWidth;
      fx.classList.add(name === 'white' ? 'white' : 'flash');
    },
    title: function (kind, text, id) {
      clearTimers();
      var tc = $('#titlecard');
      tc.className = 'overlay ' + kind;
      var inner = tc.querySelector('.tc-inner');
      if (kind === 'chapter') {
        var m = text.match(/^(\S+)\s+(.+)$/);
        inner.innerHTML = m ? '<small>' + esc(m[1]) + '</small>' + esc(m[2]) : esc(text);
      } else inner.textContent = text;
      if (kind === 'center') UI.backlog.push({ name: null, text: text });
      UI.pending = 'title';
      if (UI.skip) UI.autoTimer = setTimeout(proceed, 120);
      else if (kind === 'episode') UI.autoTimer = setTimeout(proceed, 1800);
      else if (UI.auto) UI.autoTimer = setTimeout(proceed, 2600);
    },
    wait: function (ms) {
      clearTimers();
      UI.pending = 'wait';
      UI.waitTimer = setTimeout(function () { UI.pending = null; UI.vm.advance(); }, UI.skip ? 10 : ms);
    },
    saveGlobals: function () { LS.set('mt_globals', UI.globals); },
    autosave: function () { if (UI.vm) LS.set('mt_save_auto', UI.vm.snapshot()); },
    affChanged: function (ch, d) {
      if (!UI.settings.affToast || d === 0) return;
      toast(window.CHARACTERS[ch].name + (d > 0 ? '　♡ +' + d : '　♡ ' + d));
    },
    memoUnlocked: function (id) {
      var m = window.MEMO[id];
      if (m && !UI.skip) toast('相談メモ：' + m.title);
    }
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ================= テキスト送り ================= */
  function startTyping(text, isRead) {
    var tb = $('#text');
    UI.fullText = text;
    $('#next-indicator').classList.remove('show');
    UI.pending = 'text';
    var speed = UI.settings.textSpeed;
    if (UI.skip || speed <= 0) { tb.textContent = text; typingDone(isRead); return; }
    var i = 0;
    tb.textContent = '';
    UI.typing = setInterval(function () {
      i++;
      tb.textContent = text.slice(0, i);
      if (i >= text.length) { clearInterval(UI.typing); UI.typing = null; typingDone(isRead); }
    }, Math.max(5, 80 - speed));
  }
  function typingDone(isRead) {
    $('#next-indicator').classList.add('show');
    if (UI.skip) {
      if (isRead || UI.settings.skipUnread || UI.ctrlSkip) UI.autoTimer = setTimeout(proceed, 25);
      else setSkip(false);
    } else if (UI.auto) {
      UI.autoTimer = setTimeout(proceed, UI.settings.autoWait + UI.fullText.length * 40);
    }
  }
  function completeTyping() {
    if (UI.typing) { clearInterval(UI.typing); UI.typing = null; $('#text').textContent = UI.fullText; typingDone(false); return true; }
    return false;
  }
  function proceed() {
    clearTimers();
    if (UI.pending === 'title') { hideTitlecard(); UI.pending = null; UI.vm.advance(); return; }
    if (UI.pending === 'text') { UI.pending = null; UI.vm.advance(); }
  }
  function clearTimers() {
    if (UI.autoTimer) { clearTimeout(UI.autoTimer); UI.autoTimer = null; }
    if (UI.choiceTimer) { clearTimeout(UI.choiceTimer); UI.choiceTimer = null; }
    if (UI.waitTimer) { clearTimeout(UI.waitTimer); UI.waitTimer = null; }
  }
  function hideTitlecard() { $('#titlecard').classList.add('hidden'); }
  function pickChoice(i) {
    clearTimers();
    var opt = UI.vm.currentOptions[i];
    UI.backlog.push({ name: null, text: '▶ ' + opt.text, choice: true });
    $('#choices').classList.add('hidden');
    UI.vm.choose(i);
  }
  UI.clickAdvance = function () {
    if (!UI.inGame) return;
    if (!$('#modal').classList.contains('hidden')) return;
    if ($('#game').classList.contains('hide-ui')) { $('#game').classList.remove('hide-ui'); return; }
    if (UI.skip && !UI.ctrlSkip) setSkip(false);
    if (UI.pending === 'text') { if (completeTyping()) return; proceed(); }
    else if (UI.pending === 'title') proceed();
  };

  function setAuto(on) {
    UI.auto = on;
    $$('#quickmenu [data-act=auto]')[0].classList.toggle('on', on);
    updateMode();
    if (on && UI.pending === 'text' && !UI.typing) UI.autoTimer = setTimeout(proceed, UI.settings.autoWait);
  }
  function setSkip(on) {
    UI.skip = on;
    $$('#quickmenu [data-act=skip]')[0].classList.toggle('on', on);
    updateMode();
    if (on) { completeTyping(); if (UI.pending === 'text' || UI.pending === 'title') UI.autoTimer = setTimeout(proceed, 25); }
  }
  UI.setSkip = setSkip; UI.setAuto = setAuto;
  function updateMode() { $('#mode-indicator').textContent = UI.skip ? 'SKIP ▶▶' : (UI.auto ? 'AUTO ▶' : ''); }

  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }

  /* ================= ビジュアル描画 ================= */
  var lastBg = null, lastCg = null, lastPortrait = null;
  function renderVisual(v) {
    // 背景
    if (v.bg !== lastBg) {
      lastBg = v.bg;
      var bgEl = $('#layer-bg');
      var a = (window.ASSETS.bg || {})[v.bg];
      bgEl.innerHTML = '';
      bgEl.style.backgroundColor = a ? a.color : '#000';
      if (a) tryImage(a.path, function (p) { if (lastBg === v.bg) bgEl.innerHTML = '<img src="' + p + '" alt="">'; },
        function () { if (lastBg === v.bg) bgEl.innerHTML = '<div class="placeholder-label">BG: ' + esc(v.bg) + '</div>'; });
    }
    // CG
    if (v.cg !== lastCg) {
      lastCg = v.cg;
      var cgEl = $('#layer-cg');
      if (!v.cg) { cgEl.classList.remove('show'); }
      else {
        var info = cgInfo(v.cg) || { id: v.cg, title: v.cg, composition: '' };
        cgEl.innerHTML = '';
        tryImage(info.file, function (p) { if (lastCg === v.cg) cgEl.innerHTML = '<img src="' + p + '" alt="">'; },
          function () {
            if (lastCg === v.cg) cgEl.innerHTML = '<div class="cg-placeholder"><div class="cg-id">' + esc(info.id) + '</div><div class="cg-title">' + esc(info.title) + '</div><div class="cg-comp">' + esc(info.composition || '') + '</div></div>';
          });
        cgEl.classList.add('show');
      }
    }
    // 立ち絵
    var pkey = v.portrait ? v.portrait + '_' + v.portraitExpr : null;
    if (pkey !== lastPortrait) {
      lastPortrait = pkey;
      var pl = $('#layer-portrait');
      if (!v.portrait) { $$('#layer-portrait .portrait').forEach(function (e) { e.classList.remove('show'); setTimeout(function () { e.remove(); }, 500); }); }
      else {
        var ch = window.CHARACTERS[v.portrait];
        var path = window.ASSETS.charaPath.replace('{char}', v.portrait).replace('{expr}', v.portraitExpr);
        var div = document.createElement('div');
        div.className = 'portrait';
        tryImage(path, function (p) { div.innerHTML = '<img src="' + p + '" alt="">'; },
          function () {
            div.innerHTML = '<div class="portrait-ph" style="background:linear-gradient(180deg,' + ch.color + '55,' + ch.color + '11)">' + esc(ch.name) + '<br>(' + esc(v.portraitExpr) + ')</div>';
          });
        $$('#layer-portrait .portrait').forEach(function (e) { e.classList.remove('show'); setTimeout(function () { e.remove(); }, 500); });
        pl.appendChild(div);
        requestAnimationFrame(function () { div.classList.add('show'); });
      }
    }
    // 電話
    [1, 2].forEach(function (n) {
      var L = v.lines[n], el = $('#pline-' + n);
      el.className = 'pline ' + (L.state || 'off');
      el.querySelector('.ltext').textContent = L.state === 'off' ? '' : (L.state === 'hold' ? '保留：' : '') + (L.label || (L.state === 'ring' ? '着信' : ''));
    });
    $('#phone-conf').classList.toggle('on', !!v.conf);
    $('#phone-clock').textContent = v.clock || '--:--';
    $('#phone-chapter').textContent = v.chapter ? v.chapter.replace(/\s.*$/, '') : '';
  }
  UI.resetVisualCache = function () { lastBg = lastCg = lastPortrait = null; $('#layer-portrait').innerHTML = ''; };

  /* ================= セーブ／ロード ================= */
  function chapterName(snap) { return snap.visual && snap.visual.chapter ? snap.visual.chapter + (snap.visual.episode ? '　' + snap.visual.episode : '') : '序章'; }
  function fmtDate(t) { var d = new Date(t); return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function slotHtml(key, label) {
    var s = LS.get(key, null);
    if (!s) return '<div class="slot empty" data-key="' + key + '">' + label + '　― 空き ―</div>';
    return '<div class="slot" data-key="' + key + '"><div class="s-no">' + label + '　' + esc(s.visual.clock || '') + '</div><div class="s-ch">' + esc(chapterName(s)) + '</div><div class="s-tx">' + esc(s.text || '') + '</div><div class="s-dt">' + fmtDate(s.time) + '</div></div>';
  }
  UI.openSave = function () {
    var html = '<div class="slots">';
    for (var i = 1; i <= SLOT_COUNT; i++) html += slotHtml('mt_save_' + i, 'No.' + i);
    html += '</div>';
    openModal('SAVE', html);
    $$('#modal-body .slot').forEach(function (el) {
      el.onclick = function () {
        var key = el.getAttribute('data-key');
        if (LS.get(key, null) && !confirm('上書きしますか？')) return;
        LS.set(key, UI.vm.snapshot());
        UI.openSave();
        toast('セーブしました');
      };
    });
  };
  UI.openLoad = function () {
    var html = '<div class="slots">' + slotHtml('mt_save_auto', 'AUTO') + slotHtml('mt_save_quick', 'QUICK');
    for (var i = 1; i <= SLOT_COUNT; i++) html += slotHtml('mt_save_' + i, 'No.' + i);
    html += '</div>';
    openModal('LOAD', html);
    $$('#modal-body .slot').forEach(function (el) {
      el.onclick = function () {
        var s = LS.get(el.getAttribute('data-key'), null);
        if (!s) return;
        closeModal();
        UI.loadSnapshot(s);
      };
    });
  };
  UI.loadSnapshot = function (s) {
    window.MTMain.enterGame();
    clearTimers();
    setSkip(false); setAuto(false);
    UI.backlog = [];
    UI.resetVisualCache();
    $('#choices').classList.add('hidden');
    hideTitlecard();
    UI.vm.restore(s);
  };
  UI.latestSave = function () {
    var best = null;
    var keys = ['mt_save_auto', 'mt_save_quick'];
    for (var i = 1; i <= SLOT_COUNT; i++) keys.push('mt_save_' + i);
    keys.forEach(function (k) { var s = LS.get(k, null); if (s && (!best || s.time > best.time)) best = s; });
    return best;
  };
  UI.quickSave = function () { LS.set('mt_save_quick', UI.vm.snapshot()); toast('クイックセーブしました'); };
  UI.quickLoad = function () { var s = LS.get('mt_save_quick', null); if (s) UI.loadSnapshot(s); else toast('クイックセーブがありません'); };

  /* ================= バックログ ================= */
  UI.openLog = function () {
    var html = UI.backlog.map(function (b) {
      return '<div class="log-entry' + (b.choice ? ' choice' : '') + '">' + (b.name ? '<span class="log-name">' + esc(b.name) + '</span>' : '') + esc(b.text) + '</div>';
    }).join('') || '<div class="log-entry">（まだ何もありません）</div>';
    openModal('LOG', html);
    var body = $('#modal-body');
    body.scrollTop = body.scrollHeight;
  };

  /* ================= 設定 ================= */
  UI.openConfig = function () {
    var S = UI.settings;
    var rows = [
      ['textSpeed', '文字速度', 0, 75, 1, S.textSpeed],
      ['autoWait', 'オート待ち時間(ms)', 300, 4000, 100, S.autoWait],
      ['bgm', 'BGM音量', 0, 1, 0.05, S.bgm],
      ['se', 'SE音量', 0, 1, 0.05, S.se],
      ['fontSize', '文字サイズ', 18, 32, 1, S.fontSize]
    ];
    var html = rows.map(function (r) {
      return '<div class="config-row"><label>' + r[1] + '</label><input type="range" data-k="' + r[0] + '" min="' + r[2] + '" max="' + r[3] + '" step="' + r[4] + '" value="' + r[5] + '"><span class="val">' + r[5] + '</span></div>';
    }).join('');
    html += '<div class="config-row"><label>未読もスキップする</label><input type="checkbox" data-k="skipUnread"' + (S.skipUnread ? ' checked' : '') + '></div>';
    html += '<div class="config-row"><label>好感度の変化を表示する</label><input type="checkbox" data-k="affToast"' + (S.affToast ? ' checked' : '') + '></div>';
    html += '<div class="config-row"><label>操作</label><span style="font-size:13px;color:var(--ink-dim);line-height:1.7">クリック/Enter/Space：進む　Ctrl長押し：スキップ　A：オート　L/ホイール上：ログ　H/右クリック：ウィンドウ非表示　Esc：閉じる</span></div>';
    openModal('CONFIG', html);
    $$('#modal-body input').forEach(function (inp) {
      inp.oninput = inp.onchange = function () {
        var k = inp.getAttribute('data-k');
        var v = inp.type === 'checkbox' ? inp.checked : Number(inp.value);
        UI.settings[k] = v;
        if (inp.nextSibling && inp.nextSibling.className === 'val') inp.nextSibling.textContent = v;
        applySettings();
        LS.set('mt_settings', UI.settings);
      };
    });
  };
  function applySettings() {
    document.documentElement.style.setProperty('--text-size', UI.settings.fontSize + 'px');
    window.MTAudio.setVolume('bgm', UI.settings.bgm);
    window.MTAudio.setVolume('se', UI.settings.se);
  }
  UI.applySettings = applySettings;

  /* ================= ギャラリー ================= */
  UI.openGallery = function () {
    var groups = {};
    var order = [];
    window.CG_LIST.forEach(function (c) { if (!groups[c.group]) { groups[c.group] = []; order.push(c.group); } groups[c.group].push(c); });
    var total = window.CG_LIST.length, got = window.CG_LIST.filter(function (c) { return UI.globals.cg[c.id]; }).length;
    var html = '<div style="color:var(--ink-dim);font-size:14px">回収率 ' + got + ' / ' + total + '（' + Math.round(got * 100 / total) + '%）</div>';
    order.forEach(function (g) {
      html += '<div class="gallery-group">' + esc(g) + '</div><div class="gallery">';
      groups[g].forEach(function (c) {
        if (UI.globals.cg[c.id]) html += '<div class="thumb" data-cg="' + c.id + '" style="background-image:url(\'' + c.file + '\')"><span class="t-title">' + esc(c.title) + '</span></div>';
        else html += '<div class="thumb locked">？？？</div>';
      });
      html += '</div>';
    });
    openModal('GALLERY', html);
    $$('#modal-body .thumb[data-cg]').forEach(function (el) {
      el.onclick = function () {
        var c = cgInfo(el.getAttribute('data-cg'));
        var v = document.createElement('div');
        v.id = 'cgview';
        v.className = 'layer';
        tryImage(c.file, function (p) { v.innerHTML = '<img src="' + p + '" style="width:100%;height:100%;object-fit:contain">'; },
          function () { v.innerHTML = '<div class="cg-placeholder"><div class="cg-id">' + esc(c.id) + '</div><div class="cg-title">' + esc(c.title) + '</div><div class="cg-comp">' + esc(c.composition) + '</div></div>'; });
        v.onclick = function () { v.remove(); };
        $('#stage').appendChild(v);
      };
    });
  };

  /* ================= エンディングリスト ================= */
  UI.openEndings = function () {
    var got = Object.keys(UI.globals.endings).length;
    var html = '<div style="color:var(--ink-dim);font-size:14px;margin-bottom:8px">到達 ' + got + ' / ' + window.ENDINGS.length + '</div><div class="end-list">';
    window.ENDINGS.forEach(function (e) {
      var seen = UI.globals.endings[e.id];
      html += '<div class="end-item"><span class="e-no">No.' + e.no + '</span><span class="e-type ' + e.type + '">' + e.type + '</span><span class="e-title">' + (seen ? '「' + esc(e.title) + '」' : '？？？？？') + '</span><span class="e-hint">' + (seen ? '到達済み' : 'ヒント：' + esc(e.hint)) + '</span></div>';
    });
    html += '</div>';
    openModal('ENDING LIST', html);
  };

  /* ================= 相談メモ ================= */
  UI.openMemo = function (cat) {
    cat = cat || 'world';
    var tabs = '<div class="memo-tabs">' + window.MEMO_CATS.map(function (c) { return '<button data-cat="' + c.id + '"' + (c.id === cat ? ' class="on"' : '') + '>' + esc(c.name) + '</button>'; }).join('') + '</div>';
    var entries = Object.keys(window.MEMO).filter(function (k) { return window.MEMO[k].cat === cat; });
    var unlockedAny = entries.some(function (k) { return UI.globals.memo[k]; });
    var html = tabs;
    var ch = window.CHARACTERS[cat];
    if (ch && unlockedAny) html += '<div class="memo-profile">' + esc(ch.profile) + '</div>';
    html += entries.map(function (k) {
      var m = window.MEMO[k];
      return UI.globals.memo[k]
        ? '<div class="memo-entry"><div class="m-title">' + esc(m.title) + '</div><div class="m-text">' + esc(m.text) + '</div></div>'
        : '<div class="memo-entry locked"><div class="m-title">？？？</div></div>';
    }).join('');
    openModal('相談メモ', html);
    $$('#modal-body .memo-tabs button').forEach(function (b) { b.onclick = function () { UI.openMemo(b.getAttribute('data-cat')); }; });
  };

  /* ================= サウンド（BGM鑑賞・素材確認用） ================= */
  UI.openSound = function () {
    var html = '<div style="color:var(--ink-dim);font-size:13px;margin-bottom:10px">BGM素材の確認用。ファイル未配置の曲は再生されません（js/assets.js 参照）。</div>';
    Object.keys(window.ASSETS.bgm).forEach(function (id) {
      html += '<div class="config-row"><label>' + esc(id) + '</label><span class="val" style="width:auto;flex:1">' + esc(window.ASSETS.bgm[id]) + '</span><button data-bgm="' + id + '">▶</button></div>';
    });
    html += '<div class="config-row"><label>停止</label><button data-bgm="">■</button></div>';
    openModal('SOUND', html);
    $$('#modal-body [data-bgm]').forEach(function (b) { b.onclick = function () { window.MTAudio.playBgm(b.getAttribute('data-bgm') || null); }; });
  };

  /* ================= モーダル ================= */
  function openModal(title, html) {
    clearTimers();
    $('#modal-title').textContent = title;
    $('#modal-body').innerHTML = html;
    $('#modal').classList.remove('hidden');
  }
  function closeModal() {
    $('#modal').classList.add('hidden');
    if (UI.inGame && UI.auto && UI.pending === 'text' && !UI.typing) UI.autoTimer = setTimeout(proceed, UI.settings.autoWait);
  }
  UI.closeModal = closeModal;

  /* ================= デバッグ ================= */
  UI.initDebug = function () {
    var d = $('#debug');
    d.classList.remove('hidden');
    function render() {
      if (!UI.vm) return;
      var v = UI.vm.state.vars;
      var ins = UI.vm.program[UI.vm.state.pc - 1] || {};
      d.innerHTML = '<b>DEBUG</b> ' + (ins.file || '') + ':' + (ins.line || '') +
        '<br>jump: <input id="dbg-label" placeholder="label"><button id="dbg-go">go</button>' +
        '<br><button id="dbg-cg">全CG解放</button><button id="dbg-end">全END解放</button><button id="dbg-reset">グローバル初期化</button>' +
        '<pre>' + esc(JSON.stringify(v, null, 1)) + '</pre><pre>G: ' + esc(Object.keys(UI.globals.flags).join(', ')) + '</pre>';
      $('#dbg-go').onclick = function () { var l = $('#dbg-label').value.trim(); if (l) { window.MTMain.enterGame(); clearTimers(); $('#choices').classList.add('hidden'); UI.vm.waiting = null; UI.vm.halted = false; UI.vm.jump(l); UI.vm.run(); } };
      $('#dbg-cg').onclick = function () { window.CG_LIST.forEach(function (c) { UI.globals.cg[c.id] = true; }); host.saveGlobals(); };
      $('#dbg-end').onclick = function () { window.ENDINGS.forEach(function (e) { UI.globals.endings[e.id] = true; UI.globals.flags['G_END_' + e.id] = true; }); UI.globals.flags.G_CLEAR_ONCE = true; UI.globals.flags.G_DREAM_2222 = true; UI.globals.flags.G_DREAM_FIRE = true; host.saveGlobals(); };
      $('#dbg-reset').onclick = function () { if (confirm('グローバルデータ（既読・CG・END）を初期化しますか？')) { UI.globals = { flags: {}, cg: {}, endings: {}, memo: {}, read: {} }; host.saveGlobals(); location.reload(); } };
    }
    setInterval(function () { if (!document.activeElement || document.activeElement.id !== 'dbg-label') render(); }, 1000);
  };
})();
