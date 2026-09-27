window.SCENARIO = window.SCENARIO || [];
window.SCENARIO.push({ id: '07_night7', text: String.raw`
// ============================================================
// 第七夜「おはよう」 Day7 〜 Day8 04:44
// 第25話 白い夢（ミル / 名前を呼ぶ声 = W の判定）
// 第26話 おはよう（W>=4：21:47に目覚める）
// 第27話 最後の夜（二人を選んで話す）
// 第28話 屋上へ（TRUE / GOOD）
// W<=3 → 個別エンディング（4:30に目覚める） / W==0 → BAD05 / 夢に留まる → BAD06
// ============================================================
*night7
@chapter night7 第七夜　おはよう
@bg dream_white
@bgm bgm_dream
@clock --:--
白かった。
上も、下も、右も、左も。
痛みも、熱も、重さもない。空気清浄機の唸りも聞こえない。
私は、白い場所に立っていた。
――立っている。
三年間、ほとんどベッドの上にいた私が。
@set W = count(F_NAME_RENY && RENY_STATE == "AWAKE", F_NAME_HYU, F_NAME_JIN, F_NAME_MUNI, F_NAME_GEL, F_NAME_NEO)
@goto ep25

// ------------------------------------------------------------
// 第25話　白い夢
// ------------------------------------------------------------
*ep25
@episode 第25話　白い夢
@portrait mil smile
ミル「ひさしぶり、{name}」
振り向くと、そこに、ミルがいた。
一年前と同じ、少し大きすぎるパジャマ。細い手首。星の形の髪留め。
病室の窓越しにしか見たことのなかった女の子が、白い場所の真ん中で、笑っていた。
@cg CG28
@memo dream_mil
ミル「ここはね、白い夢の中。白星の光の中で眠った人は、みんなここに来るの」
ミル「怖いものも、痛いものも、なんにもないよ」
ミル「{name}、ずっと、がんばってたね。電話の前で」
@cgoff
@if F_CONFESS_MIL
ミル「……お姉ちゃんに、言ってくれたんだね。あの夜のこと」
ミル「ありがとう。お姉ちゃん、泣いてた？　……泣いてたよね。あの人、泣くの、ほんとに下手なんだから」
私は、うん、とだけ答えた。
@else
{name}「……ミル。ごめん」
{name}「あの夜、ミルの電話に、出なかった」
ミル「知ってるよ」
ミル「手紙、読んだでしょ？　気にしなくていいの。ほんとだよ」
ミル「……でも、言ってくれて、うれしい」
@endif
@portrait mil normal
ミル「ねぇ、{name}。ここにいてもいいんだよ」
ミル「もう、誰の電話にも出なくていい。誰の怖さも、誰の寂しさも、聞かなくていい」
ミル「一緒に、星を見ようよ。ここからだと、すっごくよく見えるんだよ」
白い空に、無数の星が浮かんでいた。
その真ん中に、ひときわ大きな、白い星。
ミル「あれ、私が見つけた星なんだよ」
ミル「……お姉ちゃんは、気のせいだって言ったけどね」
@se phone_ring
そのとき。
遠くで、電話が鳴った。
@goto ep25_rings

*ep25_rings
@cg CG29
ジリリ、という、古い呼び出し音。
ミルの電話の、音。
白い空の、ずっと向こうから。
@se beep
留守番電話の、ピーッという音。
それから、声が聞こえた。
@if F_NAME_MUNI
@portrait muni cry
ムニ「{name}ちゃん！　おきて！　{name}ちゃん！」
@else
@portrait muni cry
ムニ「でんわのひと！　おきて……！」
@endif
@if F_NAME_NEO
@portrait neo angry
ネオ「{name}。起きろ。朝食会の主賓が寝坊など、許されると思うな」
@else
@portrait neo angry
ネオ「おい、貴様。起きろ。……起きんか……！」
@endif
@if F_NAME_JIN
@portrait jin angry
ジンパチ「{name}！　起きろバカ！　届け物があんだよ！　受け取りのサインがいんだよ！」
@else
@portrait jin angry
ジンパチ「おい、相談窓口！　起きろって……！」
@endif
@if F_NAME_HYU
@portrait hyu serious
ヒュウ「{name}さん。……最終回のゲストが寝坊では、困ります」
@else
@portrait hyu serious
ヒュウ「相談員さん。……聞こえていますか」
@endif
@if F_NAME_GEL
@portrait gel serious
ゲル「{name}。……ミルに、よろしくなんて言うなよ。起きろ」
@endif
@if RENY_STATE == "AWAKE"
@if F_NAME_RENY
@portrait reny sleepy
レニィ「{name}、おはよぉ。……今度は、僕が起こす番だよ」
@else
@portrait reny sleepy
レニィ「相談員さん、おはよぉ。……起きて、ねぇ、起きてよぉ」
@endif
@endif
@portrait none
@cgoff
@if W == 0
@goto ep25_nobody
@endif
@goto ep25_reach

*ep25_nobody
声は、聞こえた。
たくさんの声が、何かを叫んでいた。
けれど、それが私を呼んでいるのだと、夢の中の私には、分からなかった。
「相談員さん」。「でんわのひと」。「貴様」。
それは、私の名前ではなかった。
私は、誰にも、名前を教えなかったのだから。
@portrait mil sad
ミル「……聞こえない？　みんな、呼んでるのに」
ミル「……名前じゃないから、届かないのかな」
@goto end_bad05

*ep25_reach
私の名前を、誰かが呼んでいた。
一人ではない。
@if W >= 4
何人もの声が、重なって、白い空を震わせていた。
@else
遠く、小さく。それでも、はっきりと。
@endif
――名前を教えるとね、情が移るの。あなたも、相手も。
情が、移っていた。
私の名前を知っている人たちが、私を、呼んでいた。
@portrait mil smile
ミル「……ほら。鳴ってる」
@if W < 4
ミル「……声が少ないとね、帰り道が暗いの。ちょっと、時間がかかっちゃうかもしれない」
ミル「それでも、ちゃんと届いてるよ。{name}って、呼んでる」
@else
ミル「すごいね。こんなにたくさん。……声が多いほど、帰り道は明るいんだよ」
@endif
ミル「私ね、呼び出し音を鳴らすのが好きだった。でも、出てもらえるのは、もっと好きだったよ」
ミル「……だから、出てあげて」
@set STAY = 0
@goto ep25_choice

*ep25_choice
@choice
- 電話に、出る -> ep25_answer
- 「……もう少しだけ、ここにいたい」 -> ep25_stay
@endchoice

*ep25_stay
@set STAY += 1
@if STAY >= 2
@goto end_bad06
@endif
@portrait mil normal
ミル「……うん。少しだけね」
ミルは、私の手を握った。
その手は、あたたかくも、冷たくもなかった。
@se phone_ring
呼び出し音が、少しずつ、遠ざかっていく。
@if W >= 4
それでも、声は止まなかった。何人もの声が、代わる代わる、私の名前を呼び続けていた。
@else
声が、ひとつずつ、小さくなっていく。
@endif
@goto ep25_choice

*ep25_answer
@portrait mil smile
ミル「……いってらっしゃい、{name}」
ミル「お姉ちゃんに、よろしくね。……あと、前も見ろって、もう一回言っといて」
ミル「私、ずっと、ここで鳴らしてるから」
@portrait none
私は、鳴り続ける電話のほうへ、手を伸ばした。
白い空の向こうで、受話器が、指先に触れた。
@if W >= 4
@goto ep26
@endif
@goto ep_ind_wake

// ------------------------------------------------------------
// 第26話　おはよう（W>=4）
// ------------------------------------------------------------
*ep26
@episode 第26話　おはよう
@bg room_night
@bgm bgm_warm
@clock 21:47
目を開けると、天井があった。
見慣れた、七〇七号室の天井。
空気清浄機の、低い唸り。
そして、耳元に、受話器が押し当てられていた。
@if MINASE_STATE == "AWAKE"
@portrait minase cry
ミナセ「……{name}」
ミナセさんが、ベッドの横に膝をついて、受話器を私の耳に当てていた。
ガウンもマスクもつけずに。
ミナセ「……おはよう、{name}」
ミナセ「丸一日、寝てたんだよ。……ずっと、みんな、かけ続けてくれてた」
@else
留守番電話のスピーカーから、何人もの声が流れていた。
受話器は、枕元に置かれていた。誰かが、置いてくれたのだ。
@endif
受話器の向こうで、声が、一斉に弾けた。
@if RENY_STATE == "AWAKE" && F_NAME_RENY
レニィ「……あ、起きた？　起きたよね！？　おはよぉ、{name}！」
@elif RENY_STATE == "AWAKE"
レニィ「……あ、起きた？　起きたよね！？　おはよぉ！」
@endif
@if F_NAME_MUNI
ムニ「{name}ちゃん！　おはよう！」
@else
ムニ「でんわのひと！　おはよう！」
@endif
ジンパチ「……っ、遅えんだよ、バカ……！」
ネオ「……寝坊だ。だが、許してやる。主賓だからな」
@if F_HYU_RECONCILED && F_NAME_HYU
ヒュウ「おはようございます、{name}さん。……いい朝ですね。夜ですけど」
@elif F_HYU_RECONCILED
ヒュウ「おはようございます、相談員さん。……いい朝ですね。夜ですけど」
@endif
@memo wake_up
@kokoro +2
私は、声を出そうとして、うまく出なくて、それから、やっと言った。
{name}「……おはよう」
@goto ep26_gel

*ep26_gel
@bgm bgm_night_calm
@portrait none
それから、私は、ガラスの向こうに気づいた。
前室の椅子に、誰かが座っていた。
紫色の、短く切り揃えた髪。白衣の上に、煤けたジャケット。
膝の上に、ミルの星図を広げて。
@portrait gel normal
ゲル「……起きたか」
低くて、少し掠れた声。
二時二十二分に、何度も聞いた声。
ゲル「……ゲルだ。昼前に着いた。……ずっと、ここで見ていた」
@cg CG32
@memo gel_met
ゲル「……ここが、ミルの部屋か」
ゲル「この窓から、あの子は星を見ていたんだな。……ドームより、ずっと狭い」
ゲル「……それでも、白星を、最初に見つけた」
ゲルは、ガラス越しに、私の顔をじっと見た。
それから、ほんの少しだけ、口の端を上げた。
ゲル「……ミルの言った通りだ。やさしい顔をしている」
ゲル「……気が合うかどうかは、まだ分からんがな」
@cgoff
@if MINASE_STATE == "AWAKE"
@portrait minase smile
ミナセ「……ゲルさんね、お昼からずっと、そこから動かないの。ご飯も食べないで」
ゲル「……食べた。ゼリーを一つ」
ミナセ「それ、{name}の非常食」
ゲル「……」
@endif
@portrait none
@goto ep26_arrive

*ep26_arrive
@bgm bgm_warm
@clock 23:10
@se footsteps
十一時過ぎ。
病院の廊下に、賑やかな足音が響いた。
ガラスの向こうの前室が、あっという間に、人でいっぱいになった。
@if RENY_STATE == "AWAKE"
青い髪の、眠そうな目をした男の子。
@else
眠ったままの青い髪の男の子を、背中に背負った、
@endif
茶色いツンツン頭に、両腕に包帯を巻いた青年。
@if JIN_STATE == "OK"
（包帯は、転んだときの擦り傷だ、と本人は言い張った）
@endif
金色の長い髪を、煤で少し汚した、背の高い青年。銀の食器箱を、大事そうに抱えて。
@if F_HYU_RECONCILED
緑色の前髪で片目を隠した、すらりとした青年。肩に、小さな無線機を下げて。
@endif
そして、ガラスに両手をぺたりとつけた、小さな男の子。
@cg CG33
@memo everyone_arrive
声だけしか知らなかった人たちが、ガラスの向こうに、並んでいた。
@if RENY_STATE == "AWAKE"
@portrait reny smile
@if F_NAME_RENY
レニィ「わぁ……{name}だぁ。本物だぁ」
@else
レニィ「わぁ……相談員さんだぁ。本物だぁ」
@endif
@endif
@portrait jin normal
ジンパチ「……へえ。思ったより、ちっせえな」
@portrait neo normal
ネオ「……ふむ。声と顔が一致している。合格だ」
@if F_HYU_RECONCILED
@portrait hyu smile
ヒュウ「……ああ。声の通りの方だ。……美しい」
ジンパチ「お前、それしか言えねえのか」
@endif
@portrait muni smile
ムニ「ほらね！　ぼくのえ、にてるでしょ！」
@if F_HYU_RECONCILED && ROUTE == "LIE"
@portrait gel serious
ゲル「……あのラジオの男か」
@portrait hyu sad
ヒュウ「……天文台の方ですね。あの夜は、天文台の名前を騙って、申し訳ありませんでした」
@portrait gel normal
ゲル「……いい。私も、嘘つきだ。妹の葬式に、忙しいと嘘をついた」
ゲル「嘘つき同士だな」
ヒュウ「……光栄です、と言っていいものか」
@elif F_HYU_RECONCILED
@portrait gel normal
ゲル「……あのラジオの男か。正直な放送だった」
@portrait hyu smile
ヒュウ「天文学者の方に褒められるとは。……光栄です」
@endif
私は、笑った。
泣きながら、笑った。
ガラス一枚向こうの、声だけの友達たちに。
@cgoff
@portrait none
@goto ep27

// ------------------------------------------------------------
// 第27話　最後の夜（二人を選んで話す）
// ------------------------------------------------------------
*ep27
@episode 第27話　最後の夜
@bgm bgm_warm
@clock 00:30
ネオが病院の職員用の厨房を占拠して朝食会の準備を始め、ジンパチが屋上に机を運び、ヒュウが無線機のアンテナを立てて回る間。
私は、ベッドの横の電話で、一人ずつと話をした。
ガラス越しの、内線で。
@set TALKS = 0
@goto ep27_pick

*ep27_pick
@if TALKS >= 2
@goto ep27_end
@endif
@choice
- レニィと話す -> ep27_reny if RENY_STATE == "AWAKE" && !T_RENY
- ヒュウと話す -> ep27_hyu if !T_HYU
- ジンパチと話す -> ep27_jin if !T_JIN
- ムニと話す -> ep27_muni if !T_MUNI
- ゲルと話す -> ep27_gel if !T_GEL
- ネオと話す -> ep27_neo if !T_NEO
@endchoice

*ep27_reny
@set TALKS += 1
@flag T_RENY
@portrait reny sleepy
レニィ「……ふぁ。眠くないよ。眠くない。ぜんぜん眠くない」
レニィ「……三回言うと、ほんとになる気がするんだよぉ」
レニィ「ねぇ。変なこと言っていい？」
レニィ「僕ね、夢の中で、君と会ったことあるんだ。何回も」
レニィ「毎回ちょっとずつ違う夜で、毎回ちょっとずつ違う君で。……でも、毎回、君は電話の前にいた」
@if G_CLEAR_ONCE
レニィ「たぶん僕、何回も君に助けてもらってるんだと思う。この夜にたどり着くまで」
レニィ「だからね、今度は、ちゃんと言いたかったの」
@endif
@portrait reny smile
レニィ「起こしてくれて、ありがと」
レニィ「……それとね、最後の朝ごはん。メニュー、決めよ」
レニィ「僕、しおバター。ネオのオムレツ。ジンパチのみかん。ムニのお子様ランチの旗。……それから、君のゼリー」
レニィ「全部、ちょっとずつ、交換こしよ」
@aff reny +5
@goto ep27_pick

*ep27_hyu
@set TALKS += 1
@flag T_HYU
@if F_HYU_RECONCILED
@portrait hyu serious
ヒュウ「……ひとつ、お願いがあります」
ヒュウ「僕の顔を、見てもらえますか。……全部」
ガラスの向こうで、ヒュウが、ゆっくりと前髪をかき上げた。
右目は、白く、薄く濁っていた。瞼の上から頬にかけて、細い傷跡が走っている。
@cg CG34
ヒュウ「……美しくないでしょう」
@choice
- 「きれいだよ」 -> ep27_hyu_a
- 「ヒュウの顔だ」 -> ep27_hyu_b
@endchoice
@endif
@portrait hyu sad
電話は、港の倉庫の番号にかけた。
@if F_NAME_HYU
ヒュウ「……起きたんですね、{name}さん。よかった」
@else
ヒュウ「……起きたんですね、相談員さん。よかった」
@endif
ヒュウ「行けなくて、すみません。……僕には、あの輪の中に入る資格がない」
ヒュウ「最後まで、ここから放送します。電池が、続く限り」
ヒュウ「……僕の声、聞こえますか」
私は、聞こえるよ、と答えた。
ヒュウ「……それだけで、十分です」
@aff hyu +5
@goto ep27_pick

*ep27_hyu_a
@aff hyu +10
@portrait hyu surprised
ヒュウ「……」
ヒュウ「……あなたは、本当に、ずるい人だ」
@portrait hyu smile
@if F_HYU_MIRROR
ヒュウ「全部外した鏡を、一枚だけ、戻してもいい気がしてきました」
@else
ヒュウ「三年ぶりに、鏡を見てもいい気がしてきました」
@endif
@cgoff
@goto ep27_pick

*ep27_hyu_b
@aff hyu +10
@portrait hyu surprised
ヒュウ「……僕の、顔」
ヒュウ「……ええ。そうですね。これが、僕の顔です」
@portrait hyu smile
ヒュウ「美しいかどうかは、もう、どうでもいいのかもしれない」
@cgoff
@goto ep27_pick

*ep27_jin
@set TALKS += 1
@flag T_JIN
@portrait jin normal
ジンパチ「……昼間、行ってきたんだ。タケルの墓」
ジンパチ「白眠で寝てる奴らを跨ぎながらよ。墓地も、半分くらい崩れてた」
ジンパチ「報告してきた。……逃げなかったって」
ジンパチ「あいつ、なんて言うかな。『遅えよ』かな。『知ってた』かな」
@portrait jin smile
ジンパチ「……どっちでもいいや。言えたから」
@if F_NAME_JIN
ジンパチ「……お前のおかげだぞ、{name}」
@else
ジンパチ「……お前のおかげだぞ」
@endif
@if F_JIN_LINE
ジンパチ「お前が、電話切らなかったから。……一緒に行くって、言ったから」
@else
ジンパチ「お前が、行けって言ったから。……お前が言うなら、そうなんだろって思えた」
@endif
ジンパチ「あと、例の箱な。屋上で渡す。……開けるときは、俺の前で開けろよ。配達員の特権だ」
@aff jin +5
@goto ep27_pick

*ep27_muni
@set TALKS += 1
@flag T_MUNI
@portrait muni smile
@if F_NAME_MUNI
ムニ「{name}ちゃん！　あのね、あたらしいえ、かいたの！」
@else
ムニ「でんわのひと！　あのね、あたらしいえ、かいたの！」
@endif
ムニは、ガラスに一枚の紙を押し当てた。
黒い電話機の横に、ちゃんと、人の顔が描いてあった。ちょっと目が大きすぎて、髪がぐるぐるしているけれど。
ムニ「ほんとのおかお！」
@if F_STORY_MAILMAN
ムニ「それとね、こんどは、ぼくがおはなししてあげる」
ムニ「むかしむかし、よぞらには、ほしをひろうゆうびんやさんがいました」
ムニ「ゆうびんやさんは、もうあえなくなったひとのおてがみを、ちゃんととどけるの。どんなにとおくても、どんなにおくれても」
ムニ「……ジンパチおにいちゃん、ゆうびんやさんみたいだね」
@endif
@if MINASE_STATE == "AWAKE"
ムニ「ママ、いまね、ネオさまのおてつだいしてるの。ぼくも、あとでたまごわるの」
@elif MINASE_STATE == "ASLEEP"
ムニ「ママ、となりのおへやで、ねてるの。……でも、ぼく、ずっとそばにいたよ」
ムニ「おきたとき、ひとりだと、さみしいから」
@else
ムニ「ママ、まだ、かえってこないの。……でも、きっと、おなじおそら、みてるよね」
@endif
@aff muni +5
@goto ep27_pick

*ep27_gel
@set TALKS += 1
@flag T_GEL
@portrait gel normal
ゲル「……星に、名前をつけることにした」
ゲル「白星の正式名称は、発見者が提案する。……発見者は、私の妹だ」
@if F_GEL_CHART
ゲル「二年前の冬の、あの星図。あれが、世界で最初の観測記録だ」
@endif
ゲル「『ミル』。……それが、あの星の名前だ」
ゲル「世界を終わらせる星に、妹の名前をつける姉なんて、ひどい話だろう」
ゲル「……でも、あの子なら、喜ぶ。絶対に」
@portrait gel smile
ゲル「……それと。前も、見ることにした」
ゲル「前を見たら、君がいた。……悪くない眺めだ」
@aff gel +5
@goto ep27_pick

*ep27_neo
@set TALKS += 1
@flag T_NEO
@portrait neo normal
ネオ「……厨房から抜け出してきた。卵を三十個割ったところだ」
ネオ「黄色いぞ。全部、黄色い」
@if F_NEO_OMELET
ネオ「弱火で、バターを多めに。混ぜすぎず。……貴様の教えだ」
@endif
@if F_NAME_NEO
ネオ「……なあ、{name}」
@else
ネオ「……なあ、貴様」
@endif
@if F_NEO_TEA
ネオ「紅茶も淹れてある。ベルガモットだ。……屋上で、三分、きっかり待て」
@endif
ネオ「これから言うのは、祖父の言葉ではない。私の言葉だ」
ネオ「……ありがとう」
ネオ「……以上だ。卵が焦げる。戻る」
@portrait neo shy
言い捨てて、彼は走っていった。
廊下を走るでない、と、誰かに言っていた人が。
@aff neo +5
@goto ep27_pick

*ep27_end
@portrait none
@clock 03:30
三時半。
白星が、空の、ほとんど全部を覆っていた。
夜明けまで、あと一時間十四分。
@goto ep28

// ------------------------------------------------------------
// 第28話　屋上へ
// ------------------------------------------------------------
*ep28
@episode 第28話　屋上へ
@bgm bgm_finale
@se door
@if MINASE_STATE == "AWAKE"
@portrait minase smile
ミナセさんが、前室の奥の、もう一枚の扉――七〇七号室の、内側の扉の前に立った。
三年間、一度も、私の側から開いたことのない扉。
ミナセ「……もう、いいよね」
ミナセ「外に、出よう。{name}」
@else
@portrait gel serious
ゲルが、前室の奥の、もう一枚の扉――七〇七号室の、内側の扉の前に立った。
手に、ナースステーションから持ってきたカードキーを握って。
ゲル「……ミルの部屋のドアは、私が開ける」
@if F_NAME_GEL
ゲル「一年、開けられなかったからな。……出てこい、{name}」
@else
ゲル「一年、開けられなかったからな。……出てこい。ミルの友達」
@endif
@endif
@se door
扉が、開いた。
@bgm bgm_true
私は、ベッドから降りた。
足が、震えていた。
三年ぶりに踏む、部屋の外の床。
廊下の空気は、少し冷たくて、埃と、消毒液と、焦げた煤の匂いがした。
それは、世界の匂いだった。
@if F_WISH_PHONE
――最後まで、電話の前にいたい。
そう言った私の手に、ヒュウが、無線機につないだ小さな受話器を握らせてくれた。
「電話の前」は、今夜、屋上まで一緒に来てくれるらしかった。
@endif
@memo step_out
@if F_WISH_OUT
――外に出て、みんなの顔が見たい。
@endif
@bg corridor
@se footsteps
階段を、一段ずつ上った。
誰かが肩を貸してくれて、誰かが後ろから支えてくれた。
屋上の扉を開けると、風が吹き込んできた。
@bg rooftop
@clock 03:52
@se wind
白い空。
空の全部が、白星だった。
その光の下で、小さな屋上庭園に、テーブルが並べられていた。銀の食器。黄色いオムレツ。湯気の立つカップ麺。みかん。
@goto ep28_package

*ep28_package
@portrait jin normal
ジンパチ「……ほらよ」
ジンパチが、少し潰れた箱を差し出した。
宛名は、「白鷺総合病院　七〇七号室」。差出人は、丸っこい字で「ミナセ」。
ジンパチ「白鷺急便、最後の配達だ。……受け取りのサイン、くれよ」
私は、自分の名前を言った。
それが、私の、受け取りのサインだった。
@se paper
箱の中には、柔らかな毛糸のマフラーが入っていた。
空の色みたいな、淡い青。
小さなカードが添えられていた。
――{name}へ。いつか、外に出る日に。寒くないように。　ミナセ
@cg CG35
@if MINASE_STATE == "AWAKE"
@portrait minase cry
ミナセ「……三ヶ月前にね、頼んだの。あなたが、いつか外に出られる日が来るって、信じたくて」
ミナセ「……間に合った」
ミナセ「間に合ったね、{name}」
@elif MINASE_STATE == "ASLEEP"
私は、マフラーを首に巻いた。
七〇六号室で眠っている人のことを、思った。
@else
私は、マフラーを首に巻いた。
この街のどこかで、今も眠っている人のことを、思った。
@endif
ジンパチ「……これで、全部だ」
ジンパチ「倉庫の荷物、全部、届けた」
@flag F_SCARF
@memo scarf
@cgoff
@portrait none
@goto ep28_breakfast

*ep28_breakfast
@clock 04:10
@bgm bgm_finale
@portrait neo normal
ネオ「――諸君」
ネオが、グラス代わりの紙コップを掲げた。
ネオ「これより、月見館の晩餐会……いや、朝食会を始める」
ネオ「祖父の代からの習わしだ。最初に、乾杯の言葉を言う」
ネオ「今宵、この卓を囲む全ての客人に」
ネオ「……明日もまた、この卓で会えますように」
@if RENY_STATE == "AWAKE"
@portrait reny smile
レニィ「……いただきまぁす」
@endif
ムニ「いただきます！」
ジンパチ「いただきます」
@if F_HYU_RECONCILED
ヒュウ「いただきます」
@endif
ゲル「……いただきます」
@if MINASE_STATE == "AWAKE"
ミナセ「いただきます」
@endif
{name}「……いただきます」
@if RENY_STATE == "AWAKE"
レニィ「……ねぇ、見て。みんなで、いただきますって言った」
レニィ「最後の朝ごはん。……叶っちゃった」
@else
眠ったままのレニィは、ジンパチの上着を掛けられて、テーブルの端の椅子で、穏やかな寝息を立てていた。
みんなで、彼の分のカップ麺にも、お湯を注いだ。
@endif
@cg CG30
@memo breakfast
オムレツは、黄色くて、ふわふわだった。
しおバターのカップ麺は、確かに、世界で一番おいしかった。
@if FAV_DISH == "pudding"
テーブルの真ん中に、少しだけ形の崩れたプリンが置いてあった。
ネオ「……客人の希望だ。卵と、牛乳と、砂糖と、少しの我慢」
@elif FAV_DISH == "omelet"
私の皿のオムレツだけ、ひとまわり大きかった。
ネオ「……客人の希望だ。主菜に格上げすると言っただろう」
@elif FAV_DISH == "noodle"
銀の皿の上に、しおバター味のカップ麺が、恭しく載せられていた。
ネオ「……客人の希望だ。祖父も、きっと喜んでいる」
@endif
@if F_NEO_TEA
ネオ「それから、これだ。……約束の紅茶だ。三分、きっかり」
ベルガモットの香りが、白い夜明けの風に溶けていった。
@endif
@cgoff
@goto ep28_broadcast

*ep28_broadcast
@if F_HYU_RECONCILED
@goto ep28_bc_here
@endif
@goto ep28_bc_away

*ep28_bc_here
@bgm bgm_radio
@se radio_noise
@portrait hyu smile
ヒュウ「――こんばんは。いえ、おはようございます」
ヒュウ「七十七・七メガヘルツ、『ミッドナイト・ヒュウ』。今夜が、最終回です」
ヒュウ「今、白鷺総合病院の屋上から、お送りしています」
ヒュウ「最終回のゲストは、この街の夜に、ずっと電話の前にいてくれた人です」
@if F_NAME_HYU
ヒュウ「{name}さん。……最後に、この街に、何を話しますか」
@else
ヒュウ「真夜中の、相談員さん。……最後に、この街に、何を話しますか」
@endif
@goto ep28_lastwords

*ep28_bc_away
@bgm bgm_radio
@se radio_noise
テーブルの上のラジオから、ヒュウの声が流れ始めた。
@portrait hyu sad
ヒュウ「――こんばんは。七十七・七メガヘルツ、『ミッドナイト・ヒュウ』。最終回です」
ヒュウ「……僕は、この街に、嘘をつきました。そのことを、まず、謝らせてください」
ヒュウ「それから。……白鷺総合病院の屋上の皆さん。港の倉庫の屋根の上から、見えていますよ。……片目ですが」
@if F_NAME_HYU
ヒュウ「最終回のゲストに、電話をつなぎます。{name}さん」
@else
ヒュウ「最終回のゲストに、電話をつなぎます。真夜中の、相談員さん」
@endif
ジンパチが、舌打ちをして、それから、自分の携帯を私に差し出した。
ジンパチ「……出てやれ」
@goto ep28_lastwords

*ep28_lastwords
@choice
- 「話してくれて、ありがとう」 -> ep28_lw_a
- 「ひとりじゃないよ」 -> ep28_lw_b
- 「おやすみなさい。……それから、おはよう」 -> ep28_lw_c
@endchoice

*ep28_lw_a
{name}「この七日間、電話をかけてくれた全ての人に」
{name}「話してくれて、ありがとう。……私は、みんなの話を、最後まで聞けて、幸せでした」
@goto ep28_end_judge

*ep28_lw_b
{name}「今、眠りかけている全ての人に」
{name}「ひとりじゃないよ。私は、三年間、ひとりの部屋にいたけど、今は、ひとりじゃない」
{name}「だから、あなたも、きっと」
@goto ep28_end_judge

*ep28_lw_c
{name}「この街の全ての人に」
{name}「おやすみなさい。……それから、おはよう」
{name}「どっちも言える朝が来て、よかった」
@goto ep28_end_judge

*ep28_end_judge
@portrait none
@if RENY_STATE == "AWAKE" && MINASE_STATE == "AWAKE" && F_HYU_RECONCILED && W == 6 && F_CONFESS_MIL
@goto end_true
@endif
@goto end_good

// ------------------------------------------------------------
// 個別ルート：4:30 に目覚める（1 <= W <= 3）
// ------------------------------------------------------------
*ep_ind_wake
@bg room_night
@bgm bgm_night_calm
@clock 04:30
目を開けると、七〇七号室の天井があった。
時計は、四時三十分を指していた。
窓の外は、真っ白だった。
世界の終わりまで、あと、十四分。
@set_top TOP reny=F_NAME_RENY&&RENY_STATE=="AWAKE" hyu=F_NAME_HYU jin=F_NAME_JIN muni=F_NAME_MUNI gel=F_NAME_GEL neo=F_NAME_NEO
@memo late_wake
耳元で、受話器が、まだ誰かの声を伝えていた。
私の名前を、呼び続けていた声を。
@if TOP == "reny"
@goto end_reny
@endif
@if TOP == "hyu"
@goto end_hyu
@endif
@if TOP == "jin"
@goto end_jin
@endif
@if TOP == "muni"
@goto end_muni
@endif
@if TOP == "gel"
@goto end_gel
@endif
@goto end_neo
`});
