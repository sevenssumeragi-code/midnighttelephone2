/*
 * キャラクター定義 / 口調ルール
 * - expressions: 立ち絵（通話中の「想像の姿」）の表情差分ID。assets/chara/<id>_<expr>.png
 * - color: 名前欄・電話パネルのアクセントカラー
 * - VOICE_RULES: tools/validate.js が台詞を自動検査する（キャラ崩壊防止）
 */
window.CHARACTERS = {
  reny: {
    name: 'レニィ', color: '#6fa8ff',
    expressions: ['normal', 'smile', 'sad', 'surprised', 'sleepy', 'serious'],
    profile: '一人称「僕」。駅前のコンビニの上に住む男子高校生。いつも眠そうな、ほわほわした天然。青い髪、青い目。',
    secret: '白眠の初期症状を「いつもの眠気」と思い込んでいる。眠りの中で「別の夜」の夢を見る。'
  },
  hyu: {
    name: 'ヒュウ', color: '#5fcf8f',
    expressions: ['normal', 'smile', 'sad', 'surprised', 'serious', 'cry', 'smug'],
    profile: '一人称「僕」、常に敬語。海賊ラジオ「ミッドナイト・ヒュウ」のパーソナリティ。ナルシストで気取り屋。緑の髪、右目を前髪で隠している。瞳は赤。',
    secret: '元・舞台俳優。照明事故で右目の視力を失い、引退した。'
  },
  jin: {
    name: 'ジンパチ', color: '#e89a4f',
    expressions: ['normal', 'smile', 'angry', 'sad', 'surprised', 'serious', 'cry'],
    profile: '一人称「俺」。俺様系の熱血漢。会社が止まっても荷物を配り続けるバイク便ライダー。茶髪のツンツンヘアー。',
    secret: '五年前の火事で、親友を置いて逃げた。'
  },
  muni: {
    name: 'ムニ', color: '#8fd3ff',
    expressions: ['normal', 'smile', 'sad', 'cry', 'sleepy', 'surprised'],
    profile: '五歳の男の子。甘えん坊で寂しがり屋。青い髪。夜勤の母を待ちながら、ひとりで夜を過ごしている。',
    secret: '出かける母に「ママなんてきらい」と言ってしまったことを、ずっと気にしている。'
  },
  gel: {
    name: 'ゲル', color: '#b58cff',
    expressions: ['normal', 'serious', 'sad', 'surprised', 'angry', 'cry', 'smile'],
    profile: '一人称「私」。唯一の女性。〜だ、〜だな、と硬く話す。白鷺天文台の研究員。紫のセミロングボブ。',
    secret: '一年前、妹ミルの最後の電話（二時二十二分）に出なかった。'
  },
  neo: {
    name: 'ネオ', color: '#f2d06b',
    expressions: ['normal', 'smile', 'angry', 'surprised', 'sad', 'shy', 'cry'],
    profile: '一人称「私」、二人称「貴様」。高飛車で高圧的だが、根は普通の青年。坂の上のホテル「月見館」の三代目の主。金髪ロングヘアー。',
    secret: '客も使用人もおらず、館にたった一人。口調は亡き祖父の真似。'
  },
  minase: {
    name: 'ミナセ', color: '#9ec9e8',
    expressions: ['normal', 'smile', 'sad', 'surprised', 'cry', 'sleepy'],
    profile: '白鷺総合病院の看護師。主人公の担当。青い髪をひとつに結んでいる。',
    secret: 'ムニの母。一年前に夫を亡くしている。'
  },
  mil: {
    name: 'ミル', color: '#ffd1e8',
    expressions: ['normal', 'smile', 'sad', 'cry'],
    profile: 'ゲルの妹。一年前まで七〇七号室にいた少女。十四歳で亡くなった。星が好きだった。',
    secret: '二年前、白星の影を最初に見つけていた。'
  }
};

// キャラ以外の話者（モブ・放送など）
window.EXTRA_SPEAKERS = ['ラジオ', 'アナウンサー', '男', '女', '老人', '少女', '声', '留守番電話', '群衆', '店員', '青年'];

// 口調ルール：forbid はエラー、warn は警告
window.VOICE_RULES = {
  reny: {
    forbid: [/俺/, /私(?!服)/, /貴様/, /ジンパチ(さん|くん|君)/, /ヒュウ(さん|くん|君)/, /でございます/],
    warn: [/です[。！？」…]|ます[。！？」…]/]
  },
  hyu: {
    forbid: [/俺/, /貴様/, /じゃねえ/, /だろ[。！？]/, /ジンパチ(?!くん)/, /レニィ(さん|くん|君)/, /てめえ/]
  },
  jin: {
    forbid: [/僕/, /貴様/, /私/, /わたし/, /でございます/]
  },
  gel: {
    forbid: [/貴様/, /あたし/, /のよ/, /かしら/, /だわ/, /わね/, /わよ/, /僕/, /俺/]
  },
  neo: {
    forbid: [/僕/, /俺/, /です(?!ら)/, /(?<![覚冷醒済])ます[。！？」…、]|ました|ません|ましょう/, /あなた/]
  },
  muni: {
    warn: [/[一-龯]/]
  }
};
