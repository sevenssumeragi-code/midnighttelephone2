/*
 * Midnight Telephone — シナリオコンパイラ
 * ブラウザ（window.MTCompiler）と Node（module.exports）の両方で動作する。
 * シナリオDSLの仕様は docs/11_システム設計書.md を参照。
 */
(function (root) {
  'use strict';

  var DIALOGUE_RE = /^([^\s「」@*\/#（(]{1,16})「([\s\S]*)」$/;

  function CompileError(msg, file, line) {
    this.message = '[' + file + ':' + line + '] ' + msg;
    this.file = file;
    this.line = line;
  }

  // 1ファイル分のテキストを命令列に変換する
  function compileFile(file, text, program, labels, errors) {
    var lines = text.split(/\r?\n/);
    var ifStack = []; // {jmpfIndex, endJumps:[]}
    var i = 0;

    function push(ins, lineNo) {
      ins.file = file;
      ins.line = lineNo;
      program.push(ins);
      return program.length - 1;
    }

    while (i < lines.length) {
      var raw = lines[i];
      var lineNo = i + 1;
      var s = raw.trim();
      i++;
      if (!s) continue;
      if (s.indexOf('//') === 0) continue;

      // ラベル
      if (s.charAt(0) === '*') {
        var name = s.slice(1).trim();
        if (labels[name] !== undefined) {
          errors.push(new CompileError('ラベル重複: ' + name, file, lineNo));
        }
        labels[name] = program.length;
        push({ op: 'label', name: name }, lineNo);
        continue;
      }

      // コマンド
      if (s.charAt(0) === '@') {
        var sp = s.indexOf(' ');
        var cmd = (sp < 0 ? s.slice(1) : s.slice(1, sp)).trim();
        var args = sp < 0 ? '' : s.slice(sp + 1).trim();

        if (cmd === 'if') {
          var idx = push({ op: 'jmpf', cond: args, target: -1 }, lineNo);
          ifStack.push({ jmpf: idx, ends: [] });
          continue;
        }
        if (cmd === 'elif' || cmd === 'else') {
          var top = ifStack[ifStack.length - 1];
          if (!top) { errors.push(new CompileError('@' + cmd + ' に対応する @if がありません', file, lineNo)); continue; }
          if (top.jmpf < 0) { errors.push(new CompileError('@else の後に @' + cmd + ' があります', file, lineNo)); continue; }
          top.ends.push(push({ op: 'jmp', target: -1 }, lineNo));
          program[top.jmpf].target = program.length;
          if (cmd === 'elif') {
            top.jmpf = push({ op: 'jmpf', cond: args, target: -1 }, lineNo);
          } else {
            top.jmpf = -1;
          }
          continue;
        }
        if (cmd === 'endif') {
          var t = ifStack.pop();
          if (!t) { errors.push(new CompileError('@endif に対応する @if がありません', file, lineNo)); continue; }
          if (t.jmpf >= 0) program[t.jmpf].target = program.length;
          for (var e = 0; e < t.ends.length; e++) program[t.ends[e]].target = program.length;
          continue;
        }
        if (cmd === 'choice') {
          var opts = [];
          var params = parseParams(args);
          while (i < lines.length) {
            var l2 = lines[i].trim();
            i++;
            if (!l2 || l2.indexOf('//') === 0) continue;
            if (l2 === '@endchoice') break;
            if (l2.charAt(0) !== '-') {
              errors.push(new CompileError('選択肢行は "- テキスト -> ラベル [if 条件]" の形式にしてください: ' + l2, file, i));
              continue;
            }
            var body = l2.slice(1).trim();
            var arrow = body.lastIndexOf('->');
            if (arrow < 0) { errors.push(new CompileError('選択肢に -> がありません: ' + l2, file, i)); continue; }
            var textPart = body.slice(0, arrow).trim();
            var rest = body.slice(arrow + 2).trim();
            var cond = null;
            var m = rest.match(/^(\S+)\s+if\s+(.+)$/);
            var target = rest;
            if (m) { target = m[1]; cond = m[2]; }
            opts.push({ text: textPart, label: target, cond: cond, line: i });
          }
          push({ op: 'choice', options: opts, timed: params.timed ? parseInt(params.timed, 10) : 0, def: params['default'] || null, style: params.style || null }, lineNo);
          continue;
        }
        push({ op: 'cmd', name: cmd, args: args }, lineNo);
        continue;
      }

      // 台詞
      var dm = s.match(DIALOGUE_RE);
      if (dm) {
        push({ op: 'text', speaker: dm[1], text: dm[2] }, lineNo);
        continue;
      }
      // 地の文
      push({ op: 'text', speaker: null, text: s }, lineNo);
    }
    if (ifStack.length) {
      errors.push(new CompileError('@if が閉じられていません（' + ifStack.length + '個）', file, lines.length));
    }
  }

  function parseParams(args) {
    var out = {};
    if (!args) return out;
    args.split(/\s+/).forEach(function (kv) {
      var p = kv.split('=');
      if (p.length === 2) out[p[0]] = p[1];
    });
    return out;
  }

  function compileAll(files) {
    var program = [];
    var labels = {};
    var errors = [];
    files.forEach(function (f) {
      compileFile(f.id, f.text, program, labels, errors);
      // ファイル末尾に暗黙の停止を置き、次のファイルへ流れ落ちないようにする
      program.push({ op: 'cmd', name: 'halt', args: '', file: f.id, line: -1 });
    });
    return { program: program, labels: labels, errors: errors };
  }

  /* ---------------- 式評価器（安全な再帰下降パーサ） ---------------- */
  function tokenize(src) {
    var toks = [];
    var i = 0;
    while (i < src.length) {
      var c = src.charAt(i);
      if (/\s/.test(c)) { i++; continue; }
      var two = src.substr(i, 2);
      if (['&&', '||', '==', '!=', '>=', '<='].indexOf(two) >= 0) { toks.push({ t: 'op', v: two }); i += 2; continue; }
      if ('<>!(),+-*'.indexOf(c) >= 0) { toks.push({ t: 'op', v: c }); i++; continue; }
      if (c === '"' || c === "'") {
        var j = i + 1; var str = '';
        while (j < src.length && src.charAt(j) !== c) { str += src.charAt(j); j++; }
        toks.push({ t: 'str', v: str }); i = j + 1; continue;
      }
      var m = src.slice(i).match(/^\d+/);
      if (m) { toks.push({ t: 'num', v: parseInt(m[0], 10) }); i += m[0].length; continue; }
      m = src.slice(i).match(/^[A-Za-z_][A-Za-z0-9_.]*/);
      if (m) { toks.push({ t: 'id', v: m[0] }); i += m[0].length; continue; }
      throw new Error('式を解釈できません: ' + src + ' (位置 ' + i + ')');
    }
    return toks;
  }

  function parseExpr(src) {
    var toks = tokenize(src);
    var p = 0;
    function peek() { return toks[p]; }
    function eat(v) { var t = toks[p]; if (t && t.v === v) { p++; return true; } return false; }
    function expect(v) { if (!eat(v)) throw new Error('"' + v + '" が必要です: ' + src); }
    function orE() { var l = andE(); while (eat('||')) { l = { k: 'or', a: l, b: andE() }; } return l; }
    function andE() { var l = cmpE(); while (eat('&&')) { l = { k: 'and', a: l, b: cmpE() }; } return l; }
    function cmpE() {
      var l = addE();
      var t = peek();
      if (t && t.t === 'op' && ['==', '!=', '>=', '<=', '>', '<'].indexOf(t.v) >= 0) { p++; return { k: 'cmp', o: t.v, a: l, b: addE() }; }
      return l;
    }
    function addE() {
      var l = unE();
      for (;;) {
        var t = peek();
        if (t && t.t === 'op' && (t.v === '+' || t.v === '-')) { p++; l = { k: 'arith', o: t.v, a: l, b: unE() }; } else break;
      }
      return l;
    }
    function unE() {
      if (eat('!')) return { k: 'not', a: unE() };
      if (eat('-')) return { k: 'neg', a: unE() };
      return prim();
    }
    function prim() {
      var t = toks[p++];
      if (!t) throw new Error('式が途中で終わっています: ' + src);
      if (t.v === '(' && t.t === 'op') { var e = orE(); expect(')'); return e; }
      if (t.t === 'num') return { k: 'lit', v: t.v };
      if (t.t === 'str') return { k: 'lit', v: t.v };
      if (t.t === 'id') {
        if (t.v === 'true') return { k: 'lit', v: true };
        if (t.v === 'false') return { k: 'lit', v: false };
        if (eat('(')) {
          var args = [];
          if (!eat(')')) {
            do { args.push(orE()); } while (eat(','));
            expect(')');
          }
          return { k: 'call', f: t.v, args: args };
        }
        return { k: 'id', v: t.v };
      }
      throw new Error('予期しないトークン "' + t.v + '": ' + src);
    }
    var ast = orE();
    if (p < toks.length) throw new Error('式の末尾に余分なトークン: ' + src);
    return ast;
  }

  var FUNCS = {
    count: function (args) { var n = 0; args.forEach(function (a) { if (a) n++; }); return n; },
    min: function (args) { return Math.min.apply(null, args); },
    max: function (args) { return Math.max.apply(null, args); }
  };

  function evalAst(ast, resolve) {
    switch (ast.k) {
      case 'lit': return ast.v;
      case 'id': return resolve(ast.v);
      case 'not': return !evalAst(ast.a, resolve);
      case 'neg': return -evalAst(ast.a, resolve);
      case 'and': return evalAst(ast.a, resolve) && evalAst(ast.b, resolve);
      case 'or': return evalAst(ast.a, resolve) || evalAst(ast.b, resolve);
      case 'arith': {
        var x = Number(evalAst(ast.a, resolve)) || 0, y = Number(evalAst(ast.b, resolve)) || 0;
        return ast.o === '+' ? x + y : x - y;
      }
      case 'cmp': {
        var a = evalAst(ast.a, resolve), b = evalAst(ast.b, resolve);
        switch (ast.o) {
          case '==': return a == b; // eslint-disable-line eqeqeq
          case '!=': return a != b; // eslint-disable-line eqeqeq
          case '>=': return a >= b;
          case '<=': return a <= b;
          case '>': return a > b;
          case '<': return a < b;
        }
        break;
      }
      case 'call': {
        var f = FUNCS[ast.f];
        if (!f) throw new Error('未定義の関数: ' + ast.f);
        return f(ast.args.map(function (x) { return evalAst(x, resolve); }));
      }
    }
    throw new Error('不正な式ノード');
  }

  var cache = {};
  function evaluate(src, resolve) {
    if (src === null || src === undefined || src === '') return true;
    var ast = cache[src] || (cache[src] = parseExpr(src));
    return evalAst(ast, resolve);
  }

  // 式に登場する識別子を列挙（検証ツール用）
  function identifiers(src) {
    var out = [];
    (function walk(n) {
      if (!n) return;
      if (n.k === 'id') out.push(n.v);
      ['a', 'b'].forEach(function (k) { if (n[k]) walk(n[k]); });
      if (n.args) n.args.forEach(walk);
    })(parseExpr(src));
    return out;
  }

  var api = {
    compileAll: compileAll,
    evaluate: evaluate,
    parseExpr: parseExpr,
    identifiers: identifiers,
    DIALOGUE_RE: DIALOGUE_RE
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MTCompiler = api;
})(this);
