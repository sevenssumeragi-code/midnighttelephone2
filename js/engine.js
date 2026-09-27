/*
 * Midnight Telephone — シナリオ実行VM
 * DOMに依存しない。表示は host オブジェクトに委譲する。
 * ブラウザ（window.MTEngine）/ Node（module.exports）両対応。
 *
 * host が実装すべきメソッド:
 *   text(speaker, text, meta)       … 1行表示。ユーザ入力で vm.advance() を呼ぶ
 *   choice(options, timed, def)     … 選択肢表示。vm.choose(index|label) を呼ぶ
 *   inputName(defaultName)          … 名前入力。vm.setName(str) を呼ぶ
 *   ending(endingId)                … エンディング到達
 *   visual(state)                   … 背景/CG/電話パネル等の状態が変わった
 *   sound(kind, id)                 … bgm / se 再生
 *   effect(name)                    … 画面効果
 *   title(kind, text)               … 章・話タイトル / センター表示（advance待ち）
 *   wait(ms)                        … 一定時間待機後 vm.advance()
 *   saveGlobals()                   … グローバルデータ保存
 *   autosave()                      … チェックポイント
 */
(function (root) {
  'use strict';
  var Compiler = (typeof module !== 'undefined' && module.exports) ? require('./compiler.js') : root.MTCompiler;

  var CHARS = ['reny', 'hyu', 'jin', 'muni', 'gel', 'neo'];
  var AFF_START = 20;

  function defaultVars() {
    var v = { name: 'ヨル', kokoro: 5 };
    CHARS.forEach(function (c) { v['aff.' + c] = AFF_START; });
    return v;
  }

  function defaultVisual() {
    return {
      bg: null, cg: null, portrait: null, portraitExpr: null,
      lines: { 1: { state: 'off', label: '' }, 2: { state: 'off', label: '' } },
      conf: false, clock: '', chapter: '', episode: '', bgm: null
    };
  }

  function VM(compiled, host, globals) {
    this.program = compiled.program;
    this.labels = compiled.labels;
    this.host = host;
    this.globals = globals || { flags: {}, cg: {}, endings: {}, memo: {}, read: {} };
    ['flags', 'cg', 'endings', 'memo', 'read'].forEach(function (k) { if (!this.globals[k]) this.globals[k] = {}; }, this);
    this.reset();
  }

  VM.CHARS = CHARS;

  VM.prototype.reset = function () {
    this.state = { pc: 0, vars: defaultVars(), stack: [], visual: defaultVisual(), lastText: '' };
    this.waiting = null;
    this.halted = false;
  };

  VM.prototype.start = function (label) {
    this.reset();
    this.jump(label || 'start');
    this.run();
  };

  VM.prototype.jump = function (label) {
    var idx = this.labels[label];
    if (idx === undefined) throw new Error('未定義のラベル: ' + label);
    this.state.pc = idx;
  };

  VM.prototype.resolve = function (id) {
    if (id.indexOf('G_') === 0) return !!this.globals.flags[id];
    var v = this.state.vars[id];
    if (v === undefined) return false;
    return v;
  };

  VM.prototype.eval = function (expr) {
    var self = this;
    return Compiler.evaluate(expr, function (id) { return self.resolve(id); });
  };

  VM.prototype.subst = function (text) {
    var vars = this.state.vars;
    return String(text).replace(/\{name\}/g, vars.name || 'ヨル');
  };

  // 既読管理キー：直前ラベル名 + オフセット
  VM.prototype.readKey = function (pc) {
    var ins = this.program[pc];
    return ins.file + ':' + ins.line;
  };

  VM.prototype.isRead = function () {
    return !!this.globals.read[this.readKey(this.state.pc - 1)];
  };

  VM.prototype.advance = function () {
    if (this.waiting === 'text' || this.waiting === 'wait' || this.waiting === 'title') {
      this.waiting = null;
      this.run();
    }
  };

  VM.prototype.choose = function (opt) {
    if (this.waiting !== 'choice') return;
    var label = typeof opt === 'string' ? opt : this.currentOptions[opt].label;
    this.waiting = null;
    this.currentOptions = null;
    this.jump(label);
    this.run();
  };

  VM.prototype.setName = function (name) {
    if (this.waiting !== 'input') return;
    name = String(name || '').trim().slice(0, 8);
    this.state.vars.name = name || 'ヨル';
    this.waiting = null;
    this.run();
  };

  VM.prototype.notifyVisual = function () {
    if (this.host.visual) this.host.visual(this.state.visual);
  };

  VM.prototype.run = function () {
    var guard = 0;
    while (!this.waiting && !this.halted) {
      if (++guard > 100000) throw new Error('無限ループの可能性: pc=' + this.state.pc);
      var ins = this.program[this.state.pc];
      if (!ins) throw new Error('プログラム範囲外: pc=' + this.state.pc);
      this.state.pc++;
      switch (ins.op) {
        case 'label': break;
        case 'jmp': this.state.pc = ins.target; break;
        case 'jmpf':
          if (!this.eval(ins.cond)) this.state.pc = ins.target;
          break;
        case 'text': {
          var wasRead = !!this.globals.read[ins.file + ':' + ins.line];
          this.globals.read[ins.file + ':' + ins.line] = 1;
          var sp = ins.speaker ? this.subst(ins.speaker) : null;
          var tx = this.subst(ins.text);
          this.state.lastText = (sp ? sp + '「' + tx + '」' : tx).slice(0, 60);
          this.waiting = 'text';
          this.host.text(sp, tx, { read: wasRead, file: ins.file, line: ins.line });
          break;
        }
        case 'choice': {
          var self = this;
          var opts = ins.options.filter(function (o) { return self.eval(o.cond); })
            .map(function (o) { return { text: self.subst(o.text), label: o.label }; });
          if (!opts.length) throw new Error('有効な選択肢がありません: ' + ins.file + ':' + ins.line);
          this.currentOptions = opts;
          this.waiting = 'choice';
          this.host.choice(opts, ins.timed, ins.def);
          break;
        }
        case 'cmd':
          this.exec(ins);
          break;
        default:
          throw new Error('不明な命令: ' + ins.op);
      }
    }
  };

  function splitArgs(s) { return s ? s.split(/\s+/) : []; }

  VM.prototype.exec = function (ins) {
    var st = this.state, vis = st.visual, a = splitArgs(ins.args);
    switch (ins.name) {
      case 'halt':
        this.halted = true;
        throw new Error('シナリオがファイル末尾に到達しました（@goto/@ending 漏れ）: ' + ins.file);
      case 'goto': this.jump(a[0]); break;
      case 'gosub':
        st.stack.push(st.pc);
        this.jump(a[0]);
        break;
      case 'return':
        if (!st.stack.length) throw new Error('@return に対応する @gosub がありません: ' + ins.file + ':' + ins.line);
        st.pc = st.stack.pop();
        break;
      case 'set': {
        var m = ins.args.match(/^([A-Za-z_][A-Za-z0-9_.]*)\s*(=|\+=|-=)\s*(.+)$/);
        if (!m) throw new Error('@set の書式エラー: ' + ins.args);
        var val = this.eval(m[3]);
        if (m[2] === '=') st.vars[m[1]] = val;
        else {
          var cur = Number(st.vars[m[1]]) || 0;
          st.vars[m[1]] = m[2] === '+=' ? cur + Number(val) : cur - Number(val);
        }
        if (m[1] === 'kokoro') st.vars.kokoro = Math.max(0, Math.min(10, st.vars.kokoro));
        break;
      }
      case 'aff': {
        var key = 'aff.' + a[0];
        if (CHARS.indexOf(a[0]) < 0) throw new Error('@aff 不明なキャラ: ' + a[0]);
        var nv = (Number(st.vars[key]) || 0) + parseInt(a[1], 10);
        st.vars[key] = Math.max(0, Math.min(100, nv));
        if (this.host.affChanged) this.host.affChanged(a[0], parseInt(a[1], 10));
        break;
      }
      case 'kokoro': {
        st.vars.kokoro = Math.max(0, Math.min(10, (Number(st.vars.kokoro) || 0) + parseInt(a[0], 10)));
        break;
      }
      case 'flag': st.vars[a[0]] = true; break;
      case 'unflag': st.vars[a[0]] = false; break;
      case 'gflag':
        this.globals.flags[a[0]] = true;
        if (this.host.saveGlobals) this.host.saveGlobals();
        break;
      case 'memo':
        st.vars['MEMO_' + a[0]] = true;
        this.globals.memo[a[0]] = true;
        if (this.host.memoUnlocked) this.host.memoUnlocked(a[0]);
        if (this.host.saveGlobals) this.host.saveGlobals();
        break;
      case 'chapter':
        vis.chapter = ins.args.replace(/^\S+\s*/, '');
        vis.episode = '';
        this.notifyVisual();
        this.waiting = 'title';
        this.host.title('chapter', vis.chapter, a[0]);
        if (this.host.autosave) this.host.autosave();
        break;
      case 'episode':
        vis.episode = ins.args;
        this.notifyVisual();
        this.waiting = 'title';
        this.host.title('episode', ins.args);
        break;
      case 'center':
        this.waiting = 'title';
        this.host.title('center', this.subst(ins.args));
        break;
      case 'clock': vis.clock = a[0]; this.notifyVisual(); break;
      case 'bg': vis.bg = a[0]; vis.cg = null; this.notifyVisual(); break;
      case 'cg':
        vis.cg = a[0];
        this.globals.cg[a[0]] = true;
        if (this.host.saveGlobals) this.host.saveGlobals();
        this.notifyVisual();
        break;
      case 'cgoff': vis.cg = null; this.notifyVisual(); break;
      case 'portrait':
        if (!a[0] || a[0] === 'none') { vis.portrait = null; vis.portraitExpr = null; }
        else { vis.portrait = a[0]; vis.portraitExpr = a[1] || 'normal'; }
        this.notifyVisual();
        break;
      case 'line': {
        // @line <1|2> <ring|talk|hold|off> [表示ラベル]
        var n = a[0];
        if (!vis.lines[n]) throw new Error('@line 不明な回線: ' + n);
        vis.lines[n] = { state: a[1], label: this.subst(a.slice(2).join(' ')) };
        if (a[1] === 'ring' && this.host.sound) this.host.sound('se', 'phone_ring');
        this.notifyVisual();
        break;
      }
      case 'conf': vis.conf = a[0] !== 'off'; this.notifyVisual(); break;
      case 'hangup':
        vis.lines = { 1: { state: 'off', label: '' }, 2: { state: 'off', label: '' } };
        vis.conf = false;
        vis.portrait = null;
        if (this.host.sound) this.host.sound('se', 'phone_hangup');
        this.notifyVisual();
        break;
      case 'bgm':
        vis.bgm = a[0] === 'stop' ? null : a[0];
        if (this.host.sound) this.host.sound('bgm', vis.bgm);
        break;
      case 'se': if (this.host.sound) this.host.sound('se', a[0]); break;
      case 'effect': if (this.host.effect) this.host.effect(a[0]); break;
      case 'wait':
        this.waiting = 'wait';
        this.host.wait(parseInt(a[0], 10) || 500);
        break;
      case 'input_name':
        this.waiting = 'input';
        this.host.inputName(st.vars.name || 'ヨル');
        break;
      case 'checkpoint':
        if (this.host.autosave) this.host.autosave();
        break;
      case 'set_top': {
        // @set_top VAR reny=式 hyu=式 ... 条件を満たす候補から好感度最大のキャラを選ぶ（同値は記述順）
        var target = a[0], best = null, bestAff = -1, self = this;
        a.slice(1).forEach(function (kv) {
          var eq = kv.indexOf('=');
          var ch = kv.slice(0, eq), cond = kv.slice(eq + 1);
          if (self.eval(cond)) {
            var af = Number(st.vars['aff.' + ch]) || 0;
            if (af > bestAff) { best = ch; bestAff = af; }
          }
        });
        st.vars[target] = best || 'none';
        break;
      }
      case 'ending': {
        var id = a[0];
        this.globals.endings[id] = true;
        this.globals.flags['G_END_' + id] = true;
        this.globals.flags.G_CLEAR_ONCE = true;
        if (this.host.saveGlobals) this.host.saveGlobals();
        this.waiting = 'ending';
        this.host.ending(id);
        break;
      }
      case 'log': break; // 開発用メモ
      default:
        throw new Error('不明なコマンド @' + ins.name + ' (' + ins.file + ':' + ins.line + ')');
    }
  };

  /* ---------- セーブ／ロード ---------- */
  VM.prototype.snapshot = function () {
    // pc を「直前のラベル＋オフセット」で保存し、シナリオ修正に強くする
    var pc = this.state.pc - 1; // 現在表示中の命令
    if (this.waiting === 'choice' || this.waiting === 'input') pc = this.state.pc - 1;
    var labelName = null, labelIdx = -1;
    for (var i = pc; i >= 0; i--) {
      if (this.program[i].op === 'label') { labelName = this.program[i].name; labelIdx = i; break; }
    }
    var stack = this.state.stack.map(function (p) { return p; });
    return {
      v: 1,
      label: labelName,
      offset: pc - labelIdx,
      stack: stack,
      vars: JSON.parse(JSON.stringify(this.state.vars)),
      visual: JSON.parse(JSON.stringify(this.state.visual)),
      text: this.state.lastText,
      time: Date.now()
    };
  };

  VM.prototype.restore = function (snap) {
    this.reset();
    var base = this.labels[snap.label];
    if (base === undefined) throw new Error('セーブデータのラベルが見つかりません: ' + snap.label);
    this.state.pc = base + snap.offset;
    this.state.vars = snap.vars;
    this.state.visual = snap.visual;
    this.state.stack = snap.stack || [];
    this.notifyVisual();
    if (this.host.sound) this.host.sound('bgm', snap.visual.bgm);
    this.run();
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = VM;
  else root.MTEngine = VM;
})(this);
