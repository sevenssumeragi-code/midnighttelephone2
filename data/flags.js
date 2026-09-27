/*
 * フラグ辞書：シナリオで使う全変数の意味。
 *   tools/validate.js が「未登録のフラグ」「登録されているが使われていないフラグ」を検査する。
 *   record: true … 条件分岐には使わない記録用（将来の拡張・分析・デバッグ用）。未使用警告を出さない。
 */
window.FLAG_DICT = {
  // ---- 名乗り ----
  F_NAME_RENY: 'レニィに名乗った', F_NAME_NEO: 'ネオに名乗った', F_NAME_MUNI: 'ムニに名乗った',
  F_NAME_JIN: 'ジンパチが名前を知る（直接／電波）', F_NAME_HYU: 'ヒュウが名前を知る（電波／全員に名乗る）',
  F_NAME_GEL: 'ゲルが名前を知る（電波／直接／手紙から推測／告白）',
  F_NAME_ONAIR: { d: 'ヒュウの番組で名乗った（ヒュウ・ジンパチ・ゲルに届く）' },
  F_NAME_ALL: { d: '第24話で全員に名乗った', record: true },

  // ---- レニィ ----
  F_RENY_OHAYO: '両親の毎朝7時の「おはよう、レニィ」を聞いた（目覚めの鍵）',
  F_RENY_PHONEWAKE: '「電話の音だけは起きられる」を聞いた',
  F_RENY_NUMBER: { d: 'レニィの番号を控えた（全ルート）', record: true },
  F_RENY_ROOF: '隣のビルの屋上に渡れる／はしごは錆びている（アパート火災の鍵）',
  F_RENY_WISH: '「誰かと朝ごはんを食べたい」を聞いた',
  F_RENY_DAWN: '自由通話B：一緒に夜明けを見る約束',
  F_TOLD_RENY_LIE: '嘘ルートで、レニィに放送は嘘だと伝えた',
  F_KNOW_WAKE: 'レニィを起こし、目覚めの法則を実証した',
  F_WAKE_BY_WISH: { d: '「朝ごはん」で起こした（別解）', record: true },
  F_DREAM_FIRE: '周回：レニィの夢で火事のヒントを得た',
  F_DREAM_MINASE: '周回：レニィの夢でミナセの居場所を知った（TRUEの鍵）',
  F_BANQUET_PROMISE: '第17話で晩餐会の約束をした',

  // ---- ヒュウ ----
  F_HYU_FACE: { d: '「顔が見えないから分からない」と答えた', record: true },
  F_ONAIR: '番組に出演した', F_HYU_LONELY: { d: '出演を断り、孤独を聞いた', record: true },
  F_HYU_MIRROR: '自由通話B：鏡のない部屋',
  F_HYU_REASON: '橋の上の夜（ヒュウの過去）を聞いた',
  F_ADVISED_LIE: '「優しい嘘も必要」と言った', F_TRIED_STOP: '止めたがヒュウは嘘を選んだ',
  F_HYU_HEARD: '「私には届いてる」等、ヒュウを支えた', F_CONDEMN_HYU: 'ヒュウを責めた（第21話で謝れば解除）',
  F_DEFEND_HYU: 'ジンパチにヒュウを弁護した',
  F_HYU_EYES: '真実ルート：停電の夜、ヒュウが街の目になる（火事の経路を実況）',
  F_HYU_TRANSMITTER: { d: '予備の小型送信機が残っている', record: true },
  F_HYU_RECONCILED: 'ヒュウとジンパチが和解（真実ルートは自動）',
  F_HYU_ESTRANGED: { d: 'ヒュウが断絶したまま', record: true },
  F_GEL_RESPECT_HYU: { d: '真実ルート：ゲルがヒュウを評価', record: true },
  F_GEL_UNDERSTANDS_HYU: { d: '嘘ルート：ゲル「私も嘘つきだ」', record: true },
  F_JIN_RESPECT_HYU: { d: '真実ルート：ジンパチ「やるじゃねえか」', record: true },

  // ---- ジンパチ ----
  F_JIN_SMOKE: { d: '「焦げ臭えのは嫌い」', record: true }, F_JIN_PACKAGE: { d: '7階宛ての届けられない箱', record: true },
  F_JIN_HINT: { d: '「逃げたくねえだけだ」', record: true }, F_JIN_RADIO: 'ジンパチはヒュウのラジオを聴いている',
  F_JIN_NUMBER: { d: 'ジンパチの番号を控えた', record: true }, F_JIN_TAKERU: '親友タケルの話を聞いた',
  F_JIN_PAST: '5年前の火事の告白を聞いた（火事と和解の鍵）', F_JIN_LINE: '火事で「一緒に行く」と言った',
  F_JIN_SHIOBUTTER: { d: 'ジンパチがしおバターを食べた', record: true },
  F_LIED_TO_JIN: '嘘ルート：「知らなかった」とジンパチに嘘をついた',
  F_FIRE_PERFECT: { d: '火事で完璧な救出', record: true },
  F_PACKAGE_707: { d: '箱の宛名が707号室と判明', record: true },

  // ---- ムニ ----
  F_MUNI_FRIDGE: { d: '冷蔵庫のメモ', record: true }, F_STORY_MAILMAN: 'ミルの「星をひろう郵便屋さん」を話した',
  F_MUNI_SONG: { d: '子守唄を歌った', record: true }, F_MUNI_SORRY: '「ごめんね・だいすき・おかえり」を練習した',
  F_MUNI_IS_MINASE: { d: 'ムニの母がミナセと判明', record: true }, F_MUNI_KNOWS_707: 'ムニに「707の人は私」と明かした',
  F_MUNI_ATTIC: '月見館の屋根裏がムニの隠れ場所', F_MUNI_MET: 'ガラス越しにムニと会った（夢ルート）',

  // ---- ゲル ----
  F_GEL_WAIT1: '第3話で沈黙を待った', F_GEL_MIL: { d: '「……ミル？」', record: true },
  F_GEL_SISTER: { d: 'ゲルがミルの姉と判明', record: true }, F_GEL_KNOWS_NEIGHBOR: { d: '電波の名前でゲルが隣室の子だと気づいた', record: true },
  F_KNEW_MIL_TOLD: 'ゲルに「ミルを知っている（隣室だった）」と明かした',
  F_TOLD_GEL_TRUTH: { d: '嘘ルート：放送の嘘を知っていたと正直に言った', record: true },
  F_LIED_TO_GEL: '嘘ルート：知らなかったとゲルに嘘をついた',
  F_GEL_THEORY: 'ゲルの白眠の仮説を聞いた',
  F_LETTER: { d: 'ミルの手紙を発見', record: true }, F_LETTER_READ: { d: '手紙をゲルに朗読', record: true },
  F_GEL_CHART: 'ゲルに星図の真相を伝えた', F_CONFESS_MIL: 'ミルの最後の電話に出なかったと告白（TRUE条件）',
  F_GEL_SAVED: { d: 'ゲル生還', record: true }, F_KNOW_END: { d: '最後の観測結果（全員が眠る）を知った', record: true },

  // ---- ネオ ----
  F_NEO_FLYER: { d: 'ネオの苦情', record: true }, F_NEO_OMELET: 'オムレツの作り方を教えた',
  F_NEO_TEA: '自由通話A：祖父の紅茶', F_NEO_JIN_MET: '自由通話A：ネオとジンパチをつないだ',
  F_NEO_BACKSTAIRS: '月見館の裏階段（月見館火災の鍵）', F_NEO_GRANDPA: 'ネオの口調は祖父の真似と知った（説得の鍵）',
  F_NEO_SAVED: { d: 'ネオ生還', record: true }, F_NEO_BANQUET_IDEA: '「晩餐会は、あなたが開くもの」',
  F_NEO_DRIVES: 'ジンパチ負傷のためネオが運転する', F_OMELET_RELAY: { d: 'オムレツのコツがリレーされた', record: true },

  // ---- ミナセ・主人公 ----
  F_TOLD_MINASE_MIL: { d: 'ミナセに「ミル？」の電話を話した', record: true }, F_MIL_SISTER_HINT: { d: 'ミルに姉がいると知った', record: true },
  F_MINASE_HUSBAND: { d: 'ミナセの夫は1年前に亡くなった', record: true }, F_MINASE_ROUTE: '中央薬局への近道（第六夜の捜索の鍵）',
  F_MINASE_PROMISE: '「帰ったらずっと一緒にいる」約束を聞いた', F_MINASE_FOUND: { d: 'ミナセ発見', record: true },
  F_MEDS: { d: '薬が届いた', record: true }, F_FEVER: { d: '発熱', record: true },
  F_PHONE_BASE: '電話機の底板が浮いているのに気づいた', F_PHONE_PAPER: { d: '隙間に紙が見えた', record: true },
  F_MIL_CHART: 'ミルの星図を見つけた', F_SAW_DOME: { d: '窓から天文台のドームを見た', record: true },
  F_CONF: { d: '三者通話を覚えた', record: true }, F_MOVED_TO_HOTEL: { d: 'レニィ（とムニ）が月見館へ移送された', record: true },
  F_PLAN_GATHER: { d: '屋上の朝食会の約束', record: true }, F_WISH_OUT: '「外に出てみんなの顔が見たい」',
  F_WISH_PHONE: '「最後まで電話の前にいたい」', F_SCARF: { d: 'マフラーを受け取った', record: true },

  // ---- ルート変数・数値 ----
  MUNI_LOC: 'ムニの居場所 RENY/HOTEL', ROUTE: '放送 LIE/TRUTH', RENY_STATE: 'レニィ AWAKE/ASLEEP',
  JIN_STATE: 'ジンパチ OK/INJURED', BASE: '火事後の拠点 HOTEL/RENY_APT', MINASE_SEARCH: 'DREAM/ROUTE/LOST',
  MINASE_STATE: 'AWAKE/ASLEEP/LOST', CHOSE_2222: 'MUNI/GEL', W: '名前を知っていて起きている人数', TOP: '個別ENDの相手',
  FAV_DISH: '最後の朝食会の一皿', N2_TOOK: '第7話で取った回線', HYU_INTRO_SHORT: 'ヒュウの紹介が2回目か',
  WAKE_TRY: 'レニィへの呼びかけ回数', NERVE: 'ジンパチが動けたか', NERVE_TRY: 'ジンパチへの呼びかけ回数',
  HOTEL_FOUND: '月見館火災で屋根裏を即答したか', RECON: '和解の説得段数', DREAM_HINTS: '夢のヒントの数',
  STAY: '白い夢に留まった回数', TALKS: '第27話で話した人数',
  T_RENY: '第27話で話した', T_HYU: '第27話で話した', T_JIN: '第27話で話した', T_MUNI: '第27話で話した', T_GEL: '第27話で話した', T_NEO: '第27話で話した'
};
