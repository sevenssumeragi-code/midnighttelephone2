#!/usr/bin/env node
/*
 * Midnight Telephone — シナリオ検証ツール
 *   node tools/validate.js            静的検査 + ランダム周回シミュレーション
 *   node tools/validate.js --runs 20000
 *   node tools/validate.js --report   docs/generated/ にレポートを書き出す
 *
 * 検査内容:
 *   1. コンパイルエラー（ラベル重複・if/endif不整合・選択肢書式）
 *   2. 参照整合性（ジャンプ先ラベル / CG / エンディング / メモ / 立ち絵 / 素材ID）
 *   3. フラグ整合性（使われるのに立たないフラグ、立つのに使われないフラグ）
 *   4. キャラクター口調チェック（一人称・二人称・呼称・禁止語）
 *   5. ランダム周回シミュレーション（到達エンディング、未到達ラベル、実行時エラー）
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Compiler = require('../js/compiler.js');
const VM = require('../js/engine.js');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const RUNS = (() => { const i = args.indexOf('--runs'); return i >= 0 ? parseInt(args[i + 1], 10) : 6000; })();
const WRITE_REPORT = args.includes('--report');

function loadWindowScripts(files) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  files.forEach(f => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f }));
  return ctx.window;
}

const scenarioFiles = fs.readdirSync(path.join(ROOT, 'scenario')).filter(f => f.endsWith('.js')).sort().map(f => path.join(ROOT, 'scenario', f));
const dataFiles = ['characters.js', 'cg.js', 'endings.js', 'memo.js', 'flags.js'].map(f => path.join(ROOT, 'data', f)).filter(f => fs.existsSync(f));
const assetFile = path.join(ROOT, 'js', 'assets.js');

const W = loadWindowScripts([...dataFiles, ...(fs.existsSync(assetFile) ? [assetFile] : []), ...scenarioFiles]);
const compiled = Compiler.compileAll(W.SCENARIO);

const problems = [];
const warnings = [];
function P(msg) { problems.push(msg); }
function Wn(msg) { warnings.push(msg); }

compiled.errors.forEach(e => P('コンパイル: ' + e.message));

const CHARS = W.CHARACTERS || {};
const CGS = new Set((W.CG_LIST || []).map(c => c.id));
const ENDINGS = new Set((W.ENDINGS || []).map(e => e.id));
const MEMOS = new Set(Object.keys(W.MEMO || {}));
const ASSETS = W.ASSETS || { bg: {}, bgm: {}, se: {} };
const SPEAKERS_EXTRA = new Set((W.EXTRA_SPEAKERS || []));

const where = ins => `${ins.file}:${ins.line}`;
const labelRefs = new Map();
function refLabel(l, ins) { if (!labelRefs.has(l)) labelRefs.set(l, []); labelRefs.get(l).push(where(ins)); if (compiled.labels[l] === undefined) P(`未定義ラベル "${l}" (${where(ins)})`); }

const flagSets = new Map();
const flagUses = new Map();
function addMap(m, k, v) { if (!m.has(k)) m.set(k, []); m.get(k).push(v); }
function useExpr(expr, ins) {
  try {
    Compiler.identifiers(expr).forEach(id => addMap(flagUses, id, where(ins)));
  } catch (e) { P(`式エラー "${expr}" (${where(ins)}): ${e.message}`); }
}

const speakerNames = new Set(Object.values(CHARS).map(c => c.name));
const nameToId = {}; Object.keys(CHARS).forEach(k => { nameToId[CHARS[k].name] = k; });

compiled.program.forEach(ins => {
  if (ins.op === 'jmpf') useExpr(ins.cond, ins);
  if (ins.op === 'choice') {
    ins.options.forEach(o => { refLabel(o.label, ins); if (o.cond) useExpr(o.cond, ins); });
    if (ins.def) refLabel(ins.def, ins);
    if (ins.timed && !ins.def) P(`時限選択肢に default がありません (${where(ins)})`);
  }
  if (ins.op === 'text' && ins.speaker) {
    const sp = ins.speaker;
    if (sp !== '{name}' && !speakerNames.has(sp) && !SPEAKERS_EXTRA.has(sp)) Wn(`未登録の話者 "${sp}" (${where(ins)})`);
  }
  if (ins.op !== 'cmd') return;
  const a = ins.args ? ins.args.split(/\s+/) : [];
  switch (ins.name) {
    case 'goto': case 'gosub': refLabel(a[0], ins); break;
    case 'cg': if (!CGS.has(a[0])) P(`未定義CG "${a[0]}" (${where(ins)})`); break;
    case 'ending': if (!ENDINGS.has(a[0])) P(`未定義エンディング "${a[0]}" (${where(ins)})`); break;
    case 'memo': if (!MEMOS.has(a[0])) P(`未定義メモ "${a[0]}" (${where(ins)})`); break;
    case 'portrait': if (a[0] && a[0] !== 'none' && !CHARS[a[0]]) P(`未定義立ち絵キャラ "${a[0]}" (${where(ins)})`);
      else if (a[0] && a[0] !== 'none' && a[1] && CHARS[a[0]].expressions && !CHARS[a[0]].expressions.includes(a[1])) P(`未定義表情 "${a[0]} ${a[1]}" (${where(ins)})`);
      break;
    case 'aff': if (!VM.CHARS.includes(a[0])) P(`@aff 不明キャラ "${a[0]}" (${where(ins)})`); break;
    case 'bg': if (!ASSETS.bg[a[0]]) P(`未定義背景 "${a[0]}" (${where(ins)})`); break;
    case 'bgm': if (a[0] !== 'stop' && !ASSETS.bgm[a[0]]) P(`未定義BGM "${a[0]}" (${where(ins)})`); break;
    case 'se': if (!ASSETS.se[a[0]]) P(`未定義SE "${a[0]}" (${where(ins)})`); break;
    case 'flag': addMap(flagSets, a[0], where(ins)); break;
    case 'unflag': addMap(flagSets, a[0], where(ins)); break;
    case 'set': {
      const m = ins.args.match(/^([A-Za-z_][A-Za-z0-9_.]*)\s*(=|\+=|-=)\s*(.+)$/);
      if (!m) P(`@set 書式 (${where(ins)})`); else { addMap(flagSets, m[1], where(ins)); useExpr(m[3], ins); }
      break;
    }
    case 'set_top': addMap(flagSets, a[0], where(ins)); a.slice(1).forEach(kv => useExpr(kv.slice(kv.indexOf('=') + 1), ins)); break;
    case 'gflag': addMap(flagSets, a[0], where(ins)); break;
    case 'line': if (!['1', '2'].includes(a[0]) || !['ring', 'talk', 'hold', 'off'].includes(a[1])) P(`@line 書式 (${where(ins)})`); break;
  }
});

// 暗黙に設定される変数
['name', 'kokoro', 'aff.reny', 'aff.hyu', 'aff.jin', 'aff.muni', 'aff.gel', 'aff.neo', 'G_CLEAR_ONCE'].forEach(k => addMap(flagSets, k, '(engine)'));
(W.ENDINGS || []).forEach(e => addMap(flagSets, 'G_END_' + e.id, '(engine:@ending)'));

for (const [k, uses] of flagUses) if (!flagSets.has(k) && !k.startsWith('MEMO_')) P(`使用されるが設定されない変数 "${k}" (${uses.slice(0, 3).join(', ')})`);
const DICT = W.FLAG_DICT || {};
const isRecord = k => DICT[k] && typeof DICT[k] === 'object' && DICT[k].record;
for (const [k, sets] of flagSets) {
  if (sets[0].startsWith('(engine')) continue;
  if (/^[A-Z]/.test(k) && !k.startsWith('G_') && !k.startsWith('aff.') && DICT[k] === undefined) P(`フラグ辞書(data/flags.js)に未登録の変数 "${k}" (${sets[0]})`);
  if (!flagUses.has(k) && /^F_|^G_/.test(k) && !k.startsWith('G_END_') && !isRecord(k)) Wn(`設定されるが条件で使われないフラグ "${k}" (${sets[0]})`);
}
Object.keys(DICT).forEach(k => { if (!flagSets.has(k)) Wn(`フラグ辞書に登録されているがシナリオで設定されない変数 "${k}"`); });

/* ---------------- 口調チェック ---------------- */
const VOICE = W.VOICE_RULES || {};
compiled.program.forEach(ins => {
  if (ins.op !== 'text' || !ins.speaker) return;
  const id = nameToId[ins.speaker];
  const rule = VOICE[id];
  if (!rule) return;
  const t = ins.text;
  (rule.forbid || []).forEach(f => {
    const re = f instanceof RegExp ? f : new RegExp(f);
    if (re.test(t)) P(`口調違反 [${ins.speaker}] 禁止表現 ${re} : 「${t}」 (${where(ins)})`);
  });
  (rule.warn || []).forEach(f => {
    const re = f instanceof RegExp ? f : new RegExp(f);
    if (re.test(t)) Wn(`口調注意 [${ins.speaker}] ${re} : 「${t}」 (${where(ins)})`);
  });
});

/* ---------------- 名前の呼び方チェック ----------------
 * キャラが {name} と口にする行は、そのキャラに名乗っている（F_NAME_XXX）ことが
 * 保証されていなければならない。保証の根拠：
 *   (a) 囲んでいる @if / @elif の条件に F_NAME_XXX が肯定形で含まれる
 *   (b) 同じラベル内で、それより前に @flag F_NAME_XXX がある
 *   (c) ラベル単位の保証（エンディング判定で名前を知る者だけが到達する場所）
 */
const NAME_FLAG = { reny: 'F_NAME_RENY', hyu: 'F_NAME_HYU', jin: 'F_NAME_JIN', muni: 'F_NAME_MUNI', gel: 'F_NAME_GEL', neo: 'F_NAME_NEO' };
const LABEL_GUARANTEE = {
  end_true: Object.values(NAME_FLAG), end_true_post: Object.values(NAME_FLAG),
  end_reny: ['F_NAME_RENY'], end_hyu: ['F_NAME_HYU'], end_jin: ['F_NAME_JIN'], end_muni: ['F_NAME_MUNI'], end_gel: ['F_NAME_GEL'], end_neo: ['F_NAME_NEO']
};
(function checkNames() {
  const files = {};
  W.SCENARIO.forEach(f => { files[f.id] = f.text.split(/\r?\n/); });
  Object.keys(files).forEach(fid => {
    let label = null, setFlags = new Set(), stack = [];
    files[fid].forEach((raw, i) => {
      const s = raw.trim();
      if (!s || s.startsWith('//')) return;
      if (s[0] === '*') { label = s.slice(1).trim(); setFlags = new Set(LABEL_GUARANTEE[label] || []); return; }
      if (s[0] === '@') {
        const m = s.match(/^@(\S+)\s*(.*)$/);
        const cmd = m[1], arg = m[2];
        if (cmd === 'if') stack.push({ cond: arg });
        else if (cmd === 'elif') stack[stack.length - 1] = { cond: arg };
        else if (cmd === 'else') stack[stack.length - 1] = { cond: '' };
        else if (cmd === 'endif') stack.pop();
        else if (cmd === 'flag') setFlags.add(arg.trim());
        return;
      }
      const dm = s.match(Compiler.DIALOGUE_RE);
      if (!dm || !dm[2].includes('{name}')) return;
      const ch = nameToId[dm[1]];
      const need = NAME_FLAG[ch];
      if (!need) return;
      const ok = setFlags.has(need) || stack.some(e => new RegExp('(^|[^!A-Z_])' + need + '(?![A-Z_])').test(e.cond));
      if (!ok) P(`名前の呼び方: ${dm[1]} は {name} を知らない可能性がある (${fid}:${i + 1}) 「${dm[2].slice(0, 30)}」`);
    });
  });
})();

/* ---------------- 眠っている者が喋らないかチェック ----------------
 * 第17話以降、レニィの台詞は「起きている」ことが保証された場所でのみ許可する。 */
(function checkSleepers() {
  const AWAKE_LABELS = new Set(['ep17_wake', 'ep17_wake_b', 'ep17_wake_common', 'ep17_dream', 'ep17_party', 'ep17_party_hotel', 'ep17_party_reny', 'ep17_party_common',
    'ep19_apt', 'ep19_path_apt', 'ep19_apt_roof', 'ep19_apt_ladder', 'ep19_apt_stairs', 'ep19_apt_after', 'ep21_dream', 'ep21_dream_go',
    'ep27_reny', 'end_true', 'end_true_post', 'end_reny']);
  const ASLEEP_OK = /RENY_STATE\s*==\s*"AWAKE"|MUNI_LOC\s*==\s*"RENY"/;
  const order = ['05_night5', '06_night6', '07_night7', '08_endings'];
  W.SCENARIO.filter(f => order.includes(f.id)).forEach(f => {
    let label = null, active = f.id !== '05_night5', stack = [];
    f.text.split(/\r?\n/).forEach((raw, i) => {
      const s = raw.trim();
      if (!s || s.startsWith('//')) return;
      if (s[0] === '*') { label = s.slice(1).trim(); if (label === 'ep17') active = true; return; }
      if (s[0] === '@') {
        const m = s.match(/^@(\S+)\s*(.*)$/);
        if (m[1] === 'if') stack.push(m[2]); else if (m[1] === 'elif') stack[stack.length - 1] = m[2];
        else if (m[1] === 'else') stack[stack.length - 1] = ''; else if (m[1] === 'endif') stack.pop();
        return;
      }
      if (!active) return;
      const dm = s.match(Compiler.DIALOGUE_RE);
      if (!dm || dm[1] !== 'レニィ') return;
      if (AWAKE_LABELS.has(label) || stack.some(c => ASLEEP_OK.test(c))) return;
      P(`眠っている可能性のあるレニィが喋っている (${f.id}:${i + 1}, label=${label}) 「${dm[2].slice(0, 30)}」`);
    });
  });
})();

/* ---------------- ランダム周回シミュレーション ---------------- */
function simulate(runs) {
  const endingCount = {};
  const visited = new Set();
  const errors = new Map();
  let globals = { flags: {}, cg: {}, endings: {}, memo: {}, read: {} };
  const labelAt = {}; Object.keys(compiled.labels).forEach(l => { labelAt[compiled.labels[l]] = l; });
  const stateSamples = {};
  for (let r = 0; r < runs; r++) {
    if (r % 40 === 0) globals = { flags: {}, cg: {}, endings: {}, memo: {}, read: {} }; // 40周ごとに新規プレイヤー
    let ended = null;
    const host = {
      text() {}, choice() {}, inputName() {}, visual() {}, sound() {}, effect() {}, title() {}, wait() {},
      ending(id) { ended = id; }, saveGlobals() {}, autosave() {}
    };
    const m = new VM(compiled, host, globals);
    const origJump = m.jump.bind(m);
    m.jump = function (l) { visited.add(l); return origJump(l); };
    try {
      m.start('start');
      let steps = 0;
      while (!ended) {
        if (++steps > 20000) throw new Error('終わらない周回（20000ステップ）');
        const w = m.waiting;
        const lbl = labelAt[m.state.pc - 1];
        if (w === 'text' || w === 'wait' || w === 'title') m.advance();
        else if (w === 'input') m.setName('テスト');
        else if (w === 'choice') {
          const n = m.currentOptions.length;
          // 最後の選択肢に少し偏らせず一様ランダム
          m.choose(Math.floor(Math.random() * n));
        } else if (w === 'ending') break;
        else throw new Error('待機状態不明: ' + w + ' ' + lbl);
      }
      endingCount[ended] = (endingCount[ended] || 0) + 1;
      if (!stateSamples[ended]) stateSamples[ended] = JSON.parse(JSON.stringify(m.state.vars));
    } catch (e) {
      const key = e.message.split('\n')[0];
      errors.set(key, (errors.get(key) || 0) + 1);
    }
  }
  return { endingCount, visited, errors, stateSamples };
}

/* ---------------- ゴールデンパス（決定的な到達確認） ---------------- */
function runPolicy(policy) {
  const globals = { flags: {}, cg: {}, endings: {}, memo: {}, read: {} };
  (policy.globals || []).forEach(g => { globals.flags[g] = true; });
  let ended = null;
  const host = { text() {}, choice() {}, inputName() {}, visual() {}, sound() {}, effect() {}, title() {}, wait() {}, ending(id) { ended = id; }, saveGlobals() {}, autosave() {} };
  const m = new VM(compiled, host, globals);
  const trail = [];
  m.start('start');
  let steps = 0;
  while (!ended) {
    if (++steps > 20000) throw new Error('終わらない');
    const w = m.waiting;
    if (w === 'text' || w === 'wait' || w === 'title') m.advance();
    else if (w === 'input') m.setName('テスト');
    else if (w === 'choice') {
      let best = 0, bestScore = Infinity;
      m.currentOptions.forEach((o, i) => { const sc = policy.prefer.indexOf(o.label); if (sc >= 0 && sc < bestScore) { best = i; bestScore = sc; } });
      trail.push(m.currentOptions[best].label);
      m.choose(best);
    } else break;
  }
  return { ended, trail, vars: m.state.vars };
}
const goldenResults = [];
let golden = [];
try { golden = require('./golden_paths.js'); } catch (e) { Wn('golden_paths.js を読み込めません: ' + e.message); }
golden.forEach(p => {
  try {
    const r = runPolicy(p);
    goldenResults.push({ name: p.name, expect: p.expect, got: r.ended, vars: r.vars });
    if (r.ended !== p.expect) P(`ゴールデンパス「${p.name}」: 期待 ${p.expect} / 実際 ${r.ended}  (W=${r.vars.W}, TOP=${r.vars.TOP}, RENY=${r.vars.RENY_STATE}, MINASE=${r.vars.MINASE_STATE}, ROUTE=${r.vars.ROUTE}, kokoro=${r.vars.kokoro})`);
  } catch (e) { P(`ゴールデンパス「${p.name}」実行時エラー: ${e.message}`); }
});

const sim = simulate(RUNS);
const allLabels = Object.keys(compiled.labels);
const unvisited = allLabels.filter(l => !sim.visited.has(l) && l !== 'start');
sim.errors.forEach((n, e) => P(`実行時エラー ×${n}: ${e}`));
(W.ENDINGS || []).forEach(e => { if (!sim.endingCount[e.id]) Wn(`シミュレーションで未到達のエンディング: ${e.id} ${e.title}`); });
unvisited.forEach(l => Wn(`シミュレーションで未到達のラベル: ${l}`));

/* ---------------- 出力 ---------------- */
const textCount = compiled.program.filter(i => i.op === 'text').length;
const charCount = compiled.program.filter(i => i.op === 'text').reduce((s, i) => s + i.text.length, 0);
const choiceCount = compiled.program.filter(i => i.op === 'choice').length;

console.log('==== Midnight Telephone シナリオ検証 ====');
console.log(`ファイル ${scenarioFiles.length} / 命令 ${compiled.program.length} / 本文行 ${textCount} / 本文文字数 ${charCount} / 選択肢 ${choiceCount} / ラベル ${allLabels.length}`);
console.log(`ゴールデンパス: ${goldenResults.filter(r => r.expect === r.got).length} / ${golden.length} 成功`);
goldenResults.forEach(r => console.log(`  ${r.expect === r.got ? '○' : '×'} ${r.name.padEnd(28)} → ${r.got}`));
console.log(`シミュレーション ${RUNS}周`);
Object.keys(sim.endingCount).sort().forEach(k => console.log(`  ${k.padEnd(12)} ${sim.endingCount[k]}`));
console.log(`\n問題 ${problems.length}件`);
problems.forEach(p => console.log('  ✗ ' + p));
console.log(`\n警告 ${warnings.length}件`);
warnings.slice(0, 200).forEach(p => console.log('  △ ' + p));

if (WRITE_REPORT) {
  const out = path.join(ROOT, 'docs', 'generated');
  fs.mkdirSync(out, { recursive: true });
  let md = '# 検証レポート（自動生成）\n\n';
  md += `- 生成: tools/validate.js --report\n- ファイル ${scenarioFiles.length} / 本文行 ${textCount} / 本文文字数 ${charCount} / 選択肢 ${choiceCount} / ラベル ${allLabels.length}\n- シミュレーション ${RUNS}周\n\n`;
  md += '## ゴールデンパス（全エンディング到達確認）\n\n| 方針 | 期待 | 結果 |\n|---|---|---|\n';
  goldenResults.forEach(r => { md += `| ${r.name} | ${r.expect} | ${r.got} ${r.expect === r.got ? '✅' : '❌'} |\n`; });
  md += '\n## エンディング到達数\n\n| ID | タイトル | 到達回数 |\n|---|---|---|\n';
  (W.ENDINGS || []).forEach(e => { md += `| ${e.id} | ${e.title} | ${sim.endingCount[e.id] || 0} |\n`; });
  md += `\n## 問題（${problems.length}件）\n\n` + (problems.map(p => '- ' + p).join('\n') || '- なし') + '\n';
  md += `\n## 警告（${warnings.length}件）\n\n` + (warnings.map(p => '- ' + p).join('\n') || '- なし') + '\n';
  fs.writeFileSync(path.join(out, 'validation_report.md'), md);

  let fm = '# フラグ・変数 参照表（自動生成）\n\nシナリオ中で設定／参照されるすべての変数。設計書「04_分岐とフラグ」と突き合わせて使う。\n\n| 変数 | 設定箇所 | 参照箇所 |\n|---|---|---|\n';
  const keys = new Set([...flagSets.keys(), ...flagUses.keys()]);
  [...keys].sort().forEach(k => {
    fm += `| \`${k}\` | ${(flagSets.get(k) || []).slice(0, 6).join('<br>')} | ${(flagUses.get(k) || []).slice(0, 6).join('<br>')} |\n`;
  });
  fs.writeFileSync(path.join(out, 'flags_reference.md'), fm);
  console.log('\nレポートを書き出しました: docs/generated/');
}

process.exit(problems.length ? 1 : 0);
