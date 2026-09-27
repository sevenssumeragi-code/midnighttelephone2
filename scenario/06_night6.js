window.SCENARIO = window.SCENARIO || [];
window.SCENARIO.push({ id: '06_night6', text: String.raw`
// ============================================================
// 第六夜「二時二十二分」 Night6 22:00 〜 04:30
// 第21話 探しもの（ミナセ捜索開始 / ヒュウとジンパチの和解＝LIEのみ）
// 第22話 中央駅（ミナセ発見。夢ルートなら22:40、通常は2:10）
// 第23話 二時二十二分の手紙（ゲルか、ミナセか ＝シュレディンガーの選択）
// 第24話 受話器が落ちる（最後にしたいこと / 集合の約束 / 主人公の白眠）
// ============================================================
*night6
@chapter night6 第六夜　二時二十二分
@bg room_fever
@bgm bgm_night_calm
@clock 22:00
六日目の夜。
窓の外は、もう、夜と呼べる色ではなかった。
白星は、月の三倍ほどの大きさになって、空の四分の一を覆っていた。
私は、ミルの手紙を、電話機の横に置いた。
二時二十二分まで、あと四時間二十二分。
@goto ep21

// ------------------------------------------------------------
// 第21話　探しもの
// ------------------------------------------------------------
*ep21
@episode 第21話　探しもの
@clock 22:04
@if BASE == "HOTEL"
@line 1 ring 月見館
@else
@line 1 ring レニィ
@endif
@se phone_ring
@se phone_pickup
@line 1 talk 拠点
@bgm bgm_warm
@portrait neo normal
ネオ「……聞こえるか。こちらは、全員揃っている」
@if BASE == "HOTEL"
ネオ「月見館の、玄関ホールの電話だ。スピーカーにしてある」
@else
ネオ「レニィの部屋の電話だ。……狭い。実に狭い。私の館のクローゼットより狭い」
@if RENY_STATE == "AWAKE"
レニィ「ひどいよぉ」
@endif
@endif
@if RENY_STATE == "AWAKE"
@portrait reny smile
レニィ「こんばんはぁ。今日は、ちゃんと起きてるよ」
@else
ネオ「レニィは……まだ、眠っている。ソファに寝かせてある。穏やかな顔だ」
@endif
@portrait muni normal
ムニ「……ねぇ。ママ、みつかった？」
その一言で、受話器の向こうが、静かになった。
@portrait jin serious
ジンパチ「……今夜こそ、見つける」
@if JIN_STATE == "INJURED"
ジンパチ「腕はこんなだけどよ、足は動く。……運転は、無理だけどな」
ネオ「運転なら、私がする。祖父の車が、門の横の車庫に残っている」
ジンパチ「お前、運転したことねえって言ってただろ」
ネオ「免許は持っている。運転したことがないだけだ」
ジンパチ「一番怖えやつじゃねえか！」
@flag F_NEO_DRIVES
@endif
@if F_DREAM_MINASE
@goto ep21_dream
@endif
@if F_MINASE_ROUTE
@goto ep21_route
@endif
@goto ep21_lost

*ep21_dream
@bgm bgm_tension
――ムニのママはね、中央駅の、東口の階段にいるよ。
――踊り場で、白い袋を抱えて、眠ってる。
昨夜、眠りから覚めたレニィが言った言葉。
夢の中で、何回も見た、と。
@choice
- 「中央駅の、東口の階段。踊り場に、ミナセさんがいる」 -> ep21_dream_go
@endchoice

*ep21_dream_go
@set MINASE_SEARCH = "DREAM"
ジンパチ「……レニィの夢の話か」
レニィ「うん。……信じて、くれる？」
ジンパチ「夢だろうが何だろうが、行き先がありゃ十分だ。今すぐ行く」
@memo search_dream
@goto ep21_hyu

*ep21_route
@set MINASE_SEARCH = "ROUTE"
ジンパチ「中央駅の地下通路。昨日は入口が封鎖されてた。今夜は、別の入口から入ってみる」
ジンパチ「地下は広い。停電で真っ暗だ。……時間は、かかるかもしれねえ」
@memo search_route
@goto ep21_hyu

*ep21_lost
@set MINASE_SEARCH = "LOST"
ジンパチ「薬局の周り、もう一回、全部回ってみる」
ジンパチ「……どの道通ったか分かりゃ、いいんだけどな」
その言葉に、私は、何も返せなかった。
あの朝、「どこの薬局？」と、ひとこと訊いていれば。
@memo search_lost
@goto ep21_hyu

// ---- ヒュウとジンパチ（LIEルートのみ） ----
*ep21_hyu
@hangup
@if ROUTE == "LIE"
@goto ep21_hyu_lie
@endif
@goto ep22

*ep21_hyu_lie
@clock 22:31
@bgm bgm_sad
@line 1 ring ヒュウ
@se phone_ring
@se phone_pickup
@line 1 talk ヒュウ
@portrait hyu sad
ヒュウ「……こんばんは」
ヒュウ「港の倉庫の陰から、失礼します。……まだ、生きています」
ヒュウ「あの、……ジンパチくんたちは、無事ですか」
私が、みんな無事だと伝えると、彼は長い息を吐いた。
@if F_ADVISED_LIE
ヒュウ「……あなたを、共犯者にしてしまいましたね。すみません」
@elif F_TRIED_STOP
ヒュウ「……あなたは、止めてくれたのに。すみません」
@endif
ヒュウ「……謝りたいんです。ジンパチくんに。火事の、ことで」
ヒュウ「でも、僕の声なんか、聞きたくないでしょうね」
@if F_CONDEMN_HYU && !F_HYU_HEARD
@goto ep21_h_condemned
@endif
@choice
- ジンパチを、つなぐ -> ep21_h_conf
- 「今は、やめておこう」 -> ep21_h_skip
@endchoice

*ep21_h_condemned
ヒュウ「……いえ。やっぱり、やめておきます」
ヒュウ「僕には、謝る資格もない。……あなたにも、そう言われましたから」
その言葉が、胸に刺さった。
@choice
- 「……あの時は、ひどいことを言った。ごめん」 -> ep21_h_apologize
- 「……そう」 -> ep21_h_skip
@endchoice

*ep21_h_apologize
@unflag F_CONDEMN_HYU
@aff hyu +10
ヒュウ「……」
ヒュウ「……あなたが謝ることでは、ないでしょう」
ヒュウ「でも。……ありがとうございます。もう一度だけ、声を出してみます」
@goto ep21_h_conf

*ep21_h_skip
@flag F_HYU_ESTRANGED
ヒュウ「……ええ。そうですね」
ヒュウ「それでは、また。……電池が、続く限り」
@hangup
@goto ep22

*ep21_h_conf
@se phone_dial
@line 2 talk ジンパチ
@conf on
@portrait jin angry
ジンパチ「……なんだよ」
ヒュウ「……ジンパチくん。僕です。ヒュウです」
ジンパチ「……」
ジンパチ「何の用だ、嘘つき野郎」
ヒュウ「……謝りたくて」
ジンパチ「謝る？　今さら？　お前の嘘のせいで、街が燃えたんだぞ」
ジンパチ「レニィの部屋も、お坊ちゃんの館も」
@if BASE == "HOTEL"
ジンパチ「レニィの部屋は、灰になった」
@else
ジンパチ「月見館は、灰になった」
@endif
ヒュウ「……ええ」
@set RECON = 0
@choice
- 「ヒュウは、橋の上の人たちを救いたかったんだ」 -> ep21_r1_a if F_HYU_REASON
- 「ヒュウ。自分の言葉で、話して」 -> ep21_r1_c
- 「二人とも、落ち着いて」 -> ep21_r1_b
@endchoice

*ep21_r1_a
@set RECON += 1
{name}「ヒュウは、橋の上の人たちを救いたかったんだ」
{name}「三年前、ヒュウも、あの橋の上にいたから」
@if F_DEFEND_HYU
ジンパチ「……それは、聞いた。お前から」
@else
ジンパチ「……は？」
@endif
ヒュウ「……僕が話します」
@goto ep21_hyu_story

*ep21_r1_c
@if F_HYU_REASON
@set RECON += 1
ヒュウ「……はい」
@goto ep21_hyu_story
@endif
ヒュウ「……いえ。言い訳は、しません」
ヒュウ「嘘をついたのは、僕です。理由なんて、関係ない」
ジンパチ「……ああ、そうかよ」
@goto ep21_r2

*ep21_r1_b
ジンパチ「落ち着いてられっか！」
ヒュウ「……いいんです、相談員さん。怒られて、当然です」
@goto ep21_r2

*ep21_hyu_story
@bgm bgm_sad
@portrait hyu sad
ヒュウ「三年前。僕は、舞台の事故で、右目の光を失いました」
ヒュウ「全部なくして、あの橋の上に立って。……欄干に手をかけたとき、誰かのラジオから、声が聞こえた」
ヒュウ「『生きてるだけでいいんです。今夜は、それだけでいい』」
ヒュウ「それだけで、僕は、降りられた」
ヒュウ「あの夜の橋の上に、百人以上いました。本当のことを言って、間に合う自信が、僕にはなかった」
ヒュウ「……それでも、嘘は嘘です。その嘘が、火をつけた」
@goto ep21_r2

*ep21_r2
@portrait jin angry
ジンパチ「……理由があったら、嘘ついていいのかよ」
ジンパチ「あの夜、お前の嘘信じて、家族に会いに行くのやめた奴がいんだぞ。最後の挨拶、しなかった奴が」
ジンパチ「……俺は、逃げた奴が、一番嫌いなんだよ。俺自身も含めてな」
@choice
- 「ジンパチも、逃げたことをずっと悔やんでた。ヒュウも、同じなんだよ」 -> ep21_r2_a if F_JIN_PAST
- 「ヒュウの嘘で、橋の人たちは生きてる。ジンパチが火の中から助けたムニと、同じように」 -> ep21_r2_c if F_DEFEND_HYU || F_HYU_HEARD
- 「……嘘は、許されないよね」 -> ep21_r2_b
@endchoice

*ep21_r2_a
@set RECON += 1
ジンパチ「……同じ、だと」
ジンパチ「……」
ジンパチ「……」
長い沈黙のあとで、ヒュウが、小さな声で言った。
@portrait hyu serious
ヒュウ「……今、前髪を上げました」
ヒュウ「見えないでしょうけど。……右目、白く濁っているんです。美しくないでしょう」
ヒュウ「ずっと、隠してきました。……僕も、逃げてきたんです。鏡から」
@portrait jin sad
ジンパチ「……」
ジンパチ「……お前も、なんか失くしてたんだな」
@goto ep21_r_result

*ep21_r2_c
@set RECON += 1
ジンパチ「……」
ジンパチ「……ずりいな、その言い方」
ジンパチ「チビを出されたら、何も言えねえだろうが」
@goto ep21_r_result

*ep21_r2_b
ヒュウ「……ええ」
ヒュウ「許されません。……分かっています」
@goto ep21_r_result

*ep21_r_result
@if RECON >= 2
@goto ep21_r_ok
@endif
@flag F_HYU_ESTRANGED
@portrait jin serious
ジンパチ「……悪いけどよ。今は、お前と話したくねえ」
ジンパチ「ミナセさん探さなきゃいけねえんだ。切るぞ」
@line 2 off
@conf off
ヒュウ「……ええ。ありがとうございました、相談員さん。……話させてくれて」
ヒュウ「僕は、最後まで、ひとりで喋ります。電池が、続く限り」
@hangup
@kokoro -1
@goto ep22

*ep21_r_ok
@flag F_HYU_RECONCILED
@aff hyu +10
@aff jin +5
@memo hyu_jin_recon
@portrait jin normal
ジンパチ「……おい、キザ野郎」
ジンパチ「一個だけ、言っとく。……許したわけじゃねえからな」
ヒュウ「……はい」
ジンパチ「許してねえけど。……謝るなら、生きてる奴全員に謝れ。世界が終わるまでに」
ジンパチ「一人でも多く、ラジオで、な」
ヒュウ「……」
@portrait hyu cry
ヒュウ「……はい」
ジンパチ「……泣いてんのか」
ヒュウ「泣いていません。……港の、潮風が、目に」
ジンパチ「片目だけにか」
ヒュウ「……片目だけにです」
@cg CG22
ジンパチ「……はっ」
ジンパチが、少しだけ笑った。
その笑い声を聞いて、ヒュウも、笑った。
@cgoff
@hangup
@goto ep22

// ------------------------------------------------------------
// 第22話　中央駅
// ------------------------------------------------------------
*ep22
@episode 第22話　中央駅
@if MINASE_SEARCH == "DREAM"
@goto ep22_dream
@endif
@if MINASE_SEARCH == "ROUTE"
@goto ep22_route_wait
@endif
@goto ep22_lost

// ---- 夢ルート：22:40 発見 → 23:00 目覚め ----
*ep22_dream
@clock 22:41
@bgm bgm_tension
@line 1 ring ジンパチ
@se phone_ring
@se phone_pickup
@line 1 talk ジンパチ
@portrait jin surprised
ジンパチ「……いた」
ジンパチ「東口の階段の、踊り場。……レニィの言った通りだ」
ジンパチ「青い髪の、看護師の格好した人が、壁に寄りかかって、寝てる。……白い薬局の袋、抱えて」
ジンパチ「息、してる。……ちゃんと、してる」
@memo minase_found
@goto ep22_wake

// ---- 通常ルート：2:10 発見 ----
*ep22_route_wait
@clock 00:30
@bgm bgm_night_calm
時計の針が、のろのろと進んでいく。
ジンパチからの連絡は、まだない。
私は、何度も、ミルの手紙の封筒を手に取っては、置いた。
@clock 01:40
@se quake
小さな揺れが、また来た。
@clock 02:10
@bgm bgm_tension
@line 1 ring ジンパチ
@se phone_ring
@se phone_pickup
@line 1 talk ジンパチ
@portrait jin surprised
ジンパチ「……いた！」
ジンパチ「地下通路の、東口の階段の踊り場だ！　入口が瓦礫で塞がってて、別の通路から回り込んで……やっと……！」
ジンパチ「青い髪の、看護師の格好した人が、壁に寄りかかって、寝てる。……白い薬局の袋、抱えて」
ジンパチ「息、してる。……ちゃんと、してる」
@memo minase_found
@goto ep22_wake

*ep22_wake
ジンパチ「……おい。袋の中、見たぞ。薬が入ってる。『七〇七号室』って、メモが貼ってある」
ジンパチ「……これ、お前の薬だろ」
私は、答えられなかった。
彼女は、最後まで、これを抱えていたのだ。
私の薬を。
@flag F_MINASE_FOUND
@if F_KNOW_WAKE || F_GEL_THEORY
――眠っている人間は、夢の中で、何かを待っている。
――待っていたものが届けば、目を覚ます。
@else
（……ミナセさんが、待っているもの）
彼女が、最後に何を約束していたのか。私は知っていた。
――今日はね、帰ったら、ずっと一緒にいるって約束したの。
@endif
ミナセさんが待っているのは、きっと、ひとつだけだ。
@choice
- ムニを、つなぐ -> ep22_conf
@endchoice

*ep22_conf
@se phone_dial
@line 2 talk 拠点
@conf on
私は、二番の回線で、ムニのいる場所に電話をかけた。
そして、『三者』のボタンを押した。
@portrait muni surprised
ムニ「……ママ？　ママ、いたの？」
ジンパチ「ああ。ここにいる。……今、チビの声が聞こえるように、耳に当ててやる」
ジンパチ「話せ、チビ。……ママに、言いたいこと、あんだろ」
@if MINASE_SEARCH == "DREAM"
@goto ep22_wake_dream
@endif
@goto ep22_wake_route

*ep22_wake_dream
@bgm bgm_sad
@gosub muni_calls_mama
@goto ep22_awake

*ep22_wake_route
@bgm bgm_sad
@gosub muni_calls_mama_start
@goto ep23_dilemma

// ムニの呼びかけ（完全版）
*muni_calls_mama
@portrait muni cry
@if F_MUNI_SORRY
ムニ「……ママ」
ムニ「ママ、ごめんね」
ムニ「きらいって、いって、ごめんね。ほんとは、だいすき」
ムニ「ぼく、れんしゅうしたの。{name}ちゃんと、いっぱい、れんしゅうしたの」
ムニ「だから、ちゃんと、いえるよ」
ムニ「……ママ、おかえりなさい」
@else
ムニ「……ママ」
ムニ「ママ……ママ……」
ムニ「おきて、ママ。……ぼく、いいこにしてたよ。ずっと、まってたよ」
ムニ「ママ……かえってきて……」
@endif
@return

*muni_calls_mama_start
@portrait muni cry
ムニ「……ママ」
ムニ「ママ、きこえる？　ムニだよ」
ムニ「ぼくね、ずっと、まってたの……」
ムニは、泣きながら、ゆっくりと、話し始めた。
ジンパチ「……今、指が動いた。……続けろ、チビ。続けろ……！」
@return

*ep22_awake
@set MINASE_STATE = "AWAKE"
@bgm bgm_warm
長い、長い沈黙。
それから。
ジンパチ「……おい」
ジンパチ「……目、開けた」
@portrait minase sleepy
ミナセ「……む、に……？」
かすれた声が、受話器の向こうから聞こえた。
三日ぶりの、ミナセさんの声だった。
ミナセ「……むにちゃん……ごめんね……ママ、遅くなって……」
ムニ「ママぁ！！」
ムニ「おかえり！　おかえりなさい！　ママ、おかえり……！」
@cg CG25
@memo minase_awake
ミナセ「……ただいま」
ミナセ「……ただいま、むにちゃん」
私は、声を出さずに泣いた。
泣き声を殺すのが上手な人の真似をして。
@cgoff
@kokoro +2
@aff muni +10
@portrait minase normal
ミナセ「……ねぇ。この電話、……{name}？」
@if F_NAME_MUNI
ムニ「{name}ちゃんだよ！　{name}ちゃんが、ママをさがしてくれたの！」
@else
ムニ「でんわのひとだよ！　でんわのひとが、ママをさがしてくれたの！」
@endif
ミナセ「……そっか。……そっか」
@if F_MUNI_KNOWS_707
ミナセ「……むにちゃん、どうして、{name}のこと……」
ムニ「しってるよ！　ママのたいせつな、ななまるななのひと！　ぼくの、たいせつなひとでもあるの！」
@endif
ミナセ「{name}、……薬……持って、帰らなきゃ……」
ミナセ「あなた、熱、出てるでしょう。声で分かる」
その言葉に、私は、泣きながら笑ってしまった。
目を覚ましてすぐに、彼女は、私の熱の心配をしている。
@goto ep22_dream_after

*ep22_dream_after
@clock 23:40
それから一時間後。
ネオの運転する古い車で、ミナセさんとムニが、病院にやってきた。
ジンパチも、後部座席に乗っていた。
@if F_NEO_DRIVES
ネオ「……到着だ。……誰も、死ななかった」
ジンパチ「三回死ぬかと思ったわ」
@endif
@se door
@bg room_night
@portrait minase smile
前室の扉が開いて、ガウンの擦れる音がした。
ミナセ「ただいま、{name}」
ミナセ「……遅くなって、ごめんね」
ガラスの向こうに、ミナセさんがいた。
そして、その足元に、彼女の服の裾を握りしめた、小さな男の子が。
青い髪の、男の子が。
@portrait muni surprised
ムニ「……でんわのひと？」
ムニは、ずっと嫌っていたはずの病院の廊下で、ガラスに両手をぺたりとつけて、私の顔を見上げていた。
@if F_NAME_MUNI
ムニ「{name}ちゃんだ……！」
@else
ムニ「でんわのひと、おかお、あったんだ……！」
@endif
@cg CG25B
ムニ「ぼくのえと、ちょっとちがう！　でも、にてる！」
その声を、はじめて、受話器を通さずに聞いた。
@flag F_MUNI_MET
@memo muni_met
@cgoff
ミナセさんは、受け渡し口から薬を差し入れて、それから、少し困ったように笑った。
ミナセ「病院、あんなに嫌がってたのに。……『でんわのひとにあいたい』って、聞かないの」
ムニ「ママといっしょなら、こわくないもん」
@flag F_MEDS
@portrait none
@goto ep23_free

// ---- 見つからなかった ----
*ep22_lost
@clock 01:50
@bgm bgm_sad
@line 1 ring ジンパチ
@se phone_ring
@se phone_pickup
@line 1 talk ジンパチ
@portrait jin sad
ジンパチ「……だめだ。どこにもいねえ」
ジンパチ「薬局の周りの道、病院までの道、全部回った。倒れてる人、何十人も見た。……全員、違った」
ジンパチ「どこかにいるはずなんだ。どこかで、眠ってるはずなんだ」
ジンパチ「……悪い」
@set MINASE_STATE = "LOST"
@memo minase_lost
私は、首を横に振った。受話器の向こうの彼には見えないと分かっていながら。
謝るのは、私のほうだった。
@hangup
@goto ep23_free

// ------------------------------------------------------------
// 第23話　二時二十二分の手紙　★シュレディンガーの選択
// ------------------------------------------------------------
*ep23_dilemma
@episode 第23話　二時二十二分
@clock 02:22
@gflag G_DREAM_2222
@bgm bgm_tension
@se phone_ring
二番の回線に、割り込み着信の音が鳴った。
@line 2 ring 非通知
液晶に、「非通知」の三文字。
二時二十二分。
@memo dilemma
一番の回線では、ジンパチが、眠るミナセさんの耳元に受話器を当てている。
二番の回線では、ムニが、泣きながら母親に話しかけている。
三者通話は、二つの回線を使っている。
割り込みに出れば、ムニの声は、ミナセさんに届かなくなる。
――二時二十二分だけは、別だ。一日に一度、この時間だけ、私は星から目を離す。
――明日の夜、潮汐のピークが来る。このドームも、どうなるか分からない。
@se quake
机の上で、ミルの手紙が、小さく震えた。
@choice timed=20000 default=ep23_keep style=phone
- ムニの声を、届け続ける（割り込みに出ない） -> ep23_keep
- 割り込み着信（ゲル）に出る -> ep23_take_gel
@endchoice

*ep23_keep
@set CHOSE_2222 = "MUNI"
私は、割り込みのボタンに、手を伸ばさなかった。
呼び出し音が、鳴り続ける。
二回。五回。十回。
@if F_MUNI_SORRY
ムニ「……ママ、ごめんね。きらいって、いって、ごめんね。ほんとは、だいすき」
ムニ「……ママ、おかえりなさい」
@else
ムニ「ママ……ママ……おきて……」
@endif
二十回目で、呼び出し音は、止んだ。
@line 2 talk 拠点
@clock 02:31
@goto ep23_keep_wake

*ep23_keep_wake
@set MINASE_STATE = "AWAKE"
@bgm bgm_warm
ジンパチ「……おい」
ジンパチ「……目、開けた……！」
@portrait minase sleepy
ミナセ「……む、に……？」
ムニ「ママぁ！！」
ムニ「おかえり！　おかえりなさい……！」
@cg CG25
ミナセ「……ただいま、むにちゃん」
私は、声を出さずに泣いた。
泣きながら、ずっと、あの呼び出し音のことを考えていた。
@cgoff
@clock 02:40
@bgm stop
@se quake
@effect shake
そして、二時四十分。
今までで一番大きな揺れが、街を襲った。
@goto end_bad04

*ep23_take_gel
@set CHOSE_2222 = "GEL"
@line 1 hold ジンパチ
@conf off
@bgm bgm_sad
私は、割り込みのボタンを押した。
三者通話が切れる。
@if F_NAME_MUNI
ムニ「……ママ？　{name}ちゃん？　きこえない、きこえないよ……！」
@else
ムニ「……ママ？　でんわのひと？　きこえない、きこえないよ……！」
@endif
ムニの声が、途中で途切れた。
ごめん、と心の中で言った。何度も。
@goto ep23_gel

*ep23_free
@episode 第23話　二時二十二分
@clock 02:22
@bgm bgm_mystery
@line 2 ring 非通知
@se phone_ring
二時二十二分。
液晶に、「非通知」の三文字。
私は、ミルの手紙を手に取って、受話器を上げた。
@goto ep23_gel

*ep23_gel
@se phone_pickup
@line 2 talk ゲル
@se quake
@se dome
@portrait gel serious
ゲル「……出たか」
ゲル「今夜は、出ないかと思った」
受話器の向こうで、何かが軋む音がした。
ゲル「ドームが、ずっと揺れている。レールが歪んで、もう回らない。……観測も、あと少しで終わりだ」
ゲル「だが、私はここにいる。最後まで、見届ける」
私は、封筒を開けた。
@se paper
{name}「……ミルから、手紙があります」
@portrait gel surprised
ゲル「……何を、言っている」
{name}「電話の底に、隠してあったんです。『お姉ちゃんへ』って」
{name}「お姉ちゃんは手紙を読まない人だから、電話で読んであげてって。……ミルの電話から、お姉ちゃんに」
ゲル「……」
受話器の向こうで、息を呑む音がした。
ゲル「……読んでくれ」
@cg CG24
@goto ep23_letter

*ep23_letter
@bgm bgm_true
私は、読んだ。
@portrait mil smile
――お姉ちゃんへ。
――お姉ちゃん、この手紙、誰かの声で聞いてるよね？　お姉ちゃんは手紙を読まないから、声で届くように、お願いしたの。
――お姉ちゃん、夜中に電話しても、なかなか出てくれないよね。知ってるよ。星を見てるんだよね。
――それでいいの。私、星を見てるお姉ちゃんが、大好き。
――出てくれなくても、怒ってないよ。呼び出し音が鳴ってる間、お姉ちゃんがドームの中で星を見てるところを想像するの。それで、私も窓から、同じ空を見るの。それで、じゅうぶん。
@portrait mil normal
――だからね。もし私がいなくなって、お姉ちゃんが、私の電話に出なかったことを気にしてたら。
――それは、ぜんぜん、気にしなくていいことです。
――それから、ひとつだけ、お願い。
――お姉ちゃん、星ばっかり見てないで、たまには、前も見てね。
――前には、ちゃんと、人がいるから。
――隣の部屋の{name}は、やさしい子だよ。お姉ちゃんと、たぶん、気が合うよ。
――あと、私が見つけた、消える星のこと。お姉ちゃんは気のせいだって言ったけど、いつか本当に見つかったら、名前は、私につけさせてね。
@portrait mil smile
――大好きなお姉ちゃんへ。　ミル
@portrait none
@flag F_LETTER_READ
@memo letter_gel
読み終えても、しばらく、何の音もしなかった。
風の音も、ドームの軋む音も、遠くなっていた。
@portrait gel cry
ゲル「……っ」
ゲル「……あの、子は」
ゲル「……っ、う……っ」
泣き声を殺すのが上手な人が、はじめて、声を上げて泣いた。
一年分の。いや、もっと長い間、ずっと堰き止めていたものが、全部。
@cgoff
@if F_MIL_CHART
@goto ep23_chart
@endif
@goto ep23_confess

*ep23_chart
@flag F_GEL_CHART
@memo chart_truth
私は、引き出しの星図のことを話した。
ミルの字で書かれた注釈。赤い丸。二年前の冬の日付。
――ここの星が、ときどき消える。なにかが前を通ってる？
@portrait gel surprised
ゲル「……その、座標を」
私が読み上げると、受話器の向こうで、彼女が何かを激しく叩く音がした。キーボードだ。
ゲル「……」
ゲル「……白星が、最初に観測された位置だ」
ゲル「正式な発見の、一年以上前。まだ誰も気づいていなかった頃に」
ゲル「あの子は、白星の影を、見ていたんだ」
ゲル「世界を終わらせる星を、最初に見つけたのは、……ミルだった」
ゲル「私は、それを、笑った。気のせいだと」
@portrait gel cry
ゲル「……名前は、私につけさせてね、か」
ゲル「……ああ。つけてやる。お前の名前を、つけてやるよ、ミル」
@goto ep23_confess

*ep23_confess
@if F_KNEW_MIL_TOLD || F_NAME_GEL
@flag F_NAME_GEL
@portrait gel sad
ゲル「……隣の部屋の{name}、と書いてあったな。……君のことだ」
ゲル「……ありがとう、{name}」
@else
@portrait gel sad
ゲル「……隣の部屋の子、か。……ミルには、そんな友達がいたんだな」
ゲル「……ありがとう。読んでくれた、君」
@endif
ゲル「あの子の声を、届けてくれて」
――ありがとう。
その言葉を受け取る資格が、私にあるのだろうか。
@choice
- 「……私も、あの夜、ミルの電話に出なかった」 -> ep23_confess_yes
- 黙って、その言葉を受け取る -> ep23_confess_no
@endchoice

*ep23_confess_yes
@flag F_CONFESS_MIL
@flag F_NAME_GEL
@aff gel +10
@kokoro +1
@memo confess
@if !F_KNEW_MIL_TOLD
{name}「……私が、その『隣の部屋の{name}』です」
@endif
{name}「あの夜。ミルは、ゲルさんに電話したあとで、私にも内線をかけてきたんです」
{name}「私は、起きていました。でも、出なかった。……毎晩の長電話に、少し、疲れていて」
{name}「次の日の朝、ミルがいなくなったって聞いて」
{name}「それからずっと、電話の呼び出し音が、怖かった」
@portrait gel surprised
ゲル「……」
ゲル「……君も、か」
ゲル「……そうか。君も、出なかったのか」
しばらくして、受話器の向こうで、小さな笑い声がした。泣きながらの、ひどく不格好な笑い声だった。
@portrait gel smile
ゲル「……ミルに言わせれば、おあいこだな。私たちは」
ゲル「あの子は、どっちのことも、怒ってない。手紙にそう書いてある。……二人分、先回りして」
ゲル「……本当に、ずるい妹だ」
@goto ep23_leave

*ep23_confess_no
私は、何も言わなかった。
言えなかった言葉は、胸の奥で、小さな石のまま残った。
けれど、その石は、昨日よりずっと軽かった。
――出てくれなかった夜があっても、いいの。
@goto ep23_leave

*ep23_leave
@se quake
@se collapse
受話器の向こうで、何かが大きく崩れる音がした。
ゲル「……っ。天井の梁が、落ちた」
ゲル「……」
ゲル「……前も見ろ、か」
ゲル「……分かったよ、ミル」
ゲル「降りる。観測は、ここまでだ」
@se footsteps
駆け出す足音。車のドアが閉まる音。エンジン。
@clock 02:40
@se quake
@effect shake
二時四十分。
今までで一番大きな揺れが、街を襲った。
受話器の向こうで、遠く、何か巨大なものが崩れ落ちる音がした。
ゲル「……ドームが、落ちた」
ゲル「……さっきまで、私がいた場所だ」
ゲル「……っ、は……」
ゲル「……生きてる。……生きてるぞ、ミル」
@cg CG26
@flag F_GEL_SAVED
@memo gel_saved
@kokoro +1
@cgoff
@goto ep23_truth

*ep23_truth
@bgm bgm_mystery
@portrait gel serious
ゲル「……運転しながらで悪いが、聞いてくれ。最後の観測結果だ」
ゲル「白星は、衝突しない」
私は、耳を疑った。
ゲル「かすめて通る。月よりも近くを。……それでも、その重力で、海も、大地も、ただでは済まない。世界が終わることに変わりはない」
@if ROUTE == "LIE"
ゲル「……皮肉なものだな。あのラジオの男の嘘は、半分だけ、本当だった」
@endif
ゲル「だが、その前に、もうひとつ起きることがある」
ゲル「白星の磁場が、地球全体を包む。……四時四十四分。最接近の瞬間だ」
ゲル「今までの白眠は、その前触れだった。磁場の先端が、少しずつ触れていただけだ」
ゲル「四時四十四分。全員が、眠る」
ゲル「人類は、眠ったまま、終わる。……誰も、痛みを知らずに」
@flag F_KNOW_END
@memo the_end
ゲル「……さっき、二時四十分のピークで、白眠はさらに深くなったはずだ」
ゲル「今、眠っている人間を起こすのは、もう、ひとつの声では難しい」
@if CHOSE_2222 == "GEL"
ムニの泣き声が、耳の奥で鳴った。
ミナセさんは――
@endif
@if F_NAME_GEL
ゲル「……なあ、{name}」
@else
ゲル「……なあ」
@endif
ゲル「ミルの部屋を、見に行ってもいいか。……君の、いる部屋を」
ゲル「一年、行けなかった。……今なら、行ける気がする」
私は、待っている、と答えた。
@hangup
@goto ep23_after

*ep23_after
@if CHOSE_2222 == "GEL"
@goto ep23_after_gel
@endif
@goto ep24

*ep23_after_gel
@bgm bgm_sad
@clock 02:50
@line 1 talk ジンパチ
保留を解くと、ジンパチの荒い息が聞こえた。
@portrait jin sad
ジンパチ「……どうした、急に切れて」
ジンパチ「チビの声、途中で聞こえなくなった。……さっきのでかい揺れのあと、ミナセさん、また、深く眠っちまったみたいだ」
ジンパチ「指も、もう動かねえ」
私はもう一度、ムニをつないだ。
ムニは、泣きながら、何度も、何度も呼んだ。
けれど、ミナセさんの寝息は、もう、変わらなかった。
@set MINASE_STATE = "ASLEEP"
@memo minase_asleep
ムニ「……ママ、おきない……」
ムニ「ぼくのこえ、とどかない……？」
私は、ごめんね、としか言えなかった。
――取らなかった電話の向こうで何が起きているのか、私には、知る方法がない。
私は、ゲルの電話を取った。
その代わりに、ムニの声を、届けられなかった。
@kokoro -1
@portrait jin serious
ジンパチ「……ミナセさんと薬、病院に運ぶ。お前んとこに」
ジンパチ「眠ってたって、そばにいたほうがいいだろ。……チビも、あとで連れてく」
@clock 03:30
@se door
@bg room_night
一時間後。
前室の、すりガラスの扉の向こうに、大きな影が立った。
@portrait jin normal
ジンパチ「……届け物だ」
ジンパチ「受け渡し口ってのに、入れとく。……薬だ。ミナセさんが、ずっと抱えてた」
すりガラス越しで、顔は見えなかった。
けれど、それは、私が初めて受話器を通さずに聞いた、ジンパチの声だった。
@flag F_MEDS
ジンパチ「ミナセさんは、隣の部屋に寝かせた。七〇六号室。……空いてたからな」
七〇六号室。
一年前まで、私がいた部屋。
ミルの電話を、取らなかった部屋。
@portrait none
@goto ep24

// ------------------------------------------------------------
// 第24話　最後にしたいこと / 受話器が落ちる
// ------------------------------------------------------------
*ep24
@episode 第24話　最後にしたいこと
@clock 03:40
@bgm bgm_warm
@hangup
@line 1 ring 拠点
@se phone_ring
@se phone_pickup
@line 1 talk 拠点
@if F_HYU_RECONCILED
@line 2 talk ヒュウ
@conf on
@endif
電話の向こうは、ざわざわしていた。
スピーカーの向こうに、何人もの気配がある。
@portrait neo normal
ネオ「……聞こえるか。全員、揃っている」
@if MINASE_STATE == "AWAKE" && F_MUNI_MET
ネオ「ムニとミナセとやらは、そちらだな。ジンパチは、こちらに戻った」
@endif
@if F_HYU_RECONCILED
ヒュウ「僕も、います。港の倉庫から、失礼します」
@endif
@if RENY_STATE == "AWAKE"
@portrait reny normal
レニィ「ねぇ、ゲルさんから聞いた？　四時四十四分のこと」
@endif
ゲルから聞いた最後の観測結果を、私は、みんなに話した。
四時四十四分。全員が、眠る。
眠ったまま、世界が終わる。
@bgm bgm_sad
しばらく、誰も何も言わなかった。
@if RENY_STATE == "AWAKE"
@portrait reny serious
レニィ「……僕ね、ずっと、眠るのが怖かったんだ」
レニィ「眠ったまま、終わっちゃうのが」
レニィ「……でも、今は、ちょっと違う」
レニィ「眠るのが怖いんじゃなくて。……最後まで、みんなといたい」
レニィ「だから、起きてたい。四時四十四分まで、ずっと」
@else
ネオ「……レニィは、もう眠っている。あの子は、ずっと、それを怖がっていたのに」
ネオ「……今は、穏やかな顔だ。いい夢を、見ているのだろうか」
@endif
@portrait neo normal
ネオ「……ならば、決めよう」
ネオ「最後にしたいことを、ひとつずつ。……祖父の晩餐会では、最後に皆で、来年の抱負を言うのが習わしだった」
ネオ「来年は、ないがな。……だから、明日の抱負だ」
@memo wishlist
@goto ep24_wishes

*ep24_wishes
@bgm bgm_warm
@if RENY_STATE == "AWAKE"
@portrait reny smile
レニィ「僕は、朝ごはん。みんなで、いただきますって言う」
@endif
@portrait jin normal
ジンパチ「俺は、届け物だ。……病院の七階宛ての、あの箱」
ジンパチ「宛名、見たんだよ。『白鷺総合病院　七〇七号室』って書いてある」
ジンパチ「……お前んとこだろ」
@flag F_PACKAGE_707
@memo package_707
私は、息を呑んだ。
ジンパチ「差出人は、丸っこい字でさ。……『ミナセ』って」
@if MINASE_STATE == "AWAKE"
@portrait minase surprised
受話器の向こうで、ミナセさんが「あっ」と小さく声を上げた。
ミナセ「……それ、三ヶ月前に頼んだやつ……！　届かないと思ってた……」
ミナセ「……中身は、内緒。明日、ジンパチくんから受け取って」
@endif
@portrait neo smile
ネオ「私は、晩餐会だ。……いや、朝食会だな。夜明け前だ」
@if F_NEO_BANQUET_IDEA
ネオ「貴様が言ったのだ。晩餐会は、館ではなく、私が開くものだと」
@endif
@if BASE == "RENY_APT"
ネオ「館は燃えたが、銀食器は残っている。料理は、……レニィの台所で、何とかする」
@else
ネオ「月見館の厨房は、無事だ。存分に腕を振るえる」
@endif
ネオ「客人全員の分を作る。……弱火で、バターを多めにな」
@if F_HYU_RECONCILED
@portrait hyu smile
ヒュウ「僕は、最後の放送を。送信機がひとつ、残っていますから」
ヒュウ「最終回のゲストは、……もちろん、あなたです。相談員さん」
@endif
@portrait muni smile
@if MINASE_STATE == "AWAKE"
ムニ「ぼくは、ママに、おかえりっていえた！」
@if F_NAME_MUNI
ムニ「だから、つぎは、{name}ちゃんとあさごはん！」
@else
ムニ「だから、つぎは、でんわのひとと、あさごはん！」
@endif
@elif MINASE_STATE == "ASLEEP"
@portrait muni sad
ムニ「ぼくは……ママの、となりにいる」
ムニ「ママ、ねてても、となりにいる。……おきたとき、ひとりだと、さみしいから」
@else
@portrait muni sad
ムニ「ぼくは……ママを、まってる」
ムニ「ママ、きっと、かえってくるから。……ぼく、まつの、とくいだから」
@endif
@portrait none
最後に、みんなが私に訊いた。
@if RENY_STATE == "AWAKE"
レニィ「{name}は？」
@else
ネオ「貴様は、どうしたい」
@endif
@choice
- 「……外に出て、みんなの顔が見たい」 -> ep24_wish_out
- 「最後まで、電話の前にいたい」 -> ep24_wish_phone
@endchoice

*ep24_wish_out
@flag F_WISH_OUT
{name}「……外に出て、みんなの顔が見たい」
{name}「三年間、この部屋から出てない。みんなの声は知ってるのに、顔を知らない」
@goto ep24_plan

*ep24_wish_phone
@flag F_WISH_PHONE
{name}「最後まで、電話の前にいたい」
{name}「みんなの声を、最後まで聞いていたい」
@goto ep24_plan

*ep24_plan
@flag F_PLAN_GATHER
@memo plan_gather
@if RENY_STATE == "AWAKE"
@portrait reny smile
レニィ「……じゃあさ。僕たちが、{name}のところに行けばいいんだよ」
レニィ「病院の屋上って、行ける？」
@else
@portrait jin normal
ジンパチ「……じゃあよ。俺たちが、お前んとこに行きゃいいんだろ」
ジンパチ「病院の屋上って、行けんのか」
@endif
屋上には、患者用の小さな庭園がある。
ミナセさんが、昔、ミルを車椅子に乗せて連れていってくれた場所だ。
ネオ「決まりだな。明日の夜明け前、病院の屋上で、朝食会を開く」
ネオ「全員、正装で来い。……いや、煤だらけでも構わん」
@if F_HYU_RECONCILED
ヒュウ「僕は、そこから最終回を放送します。街中に」
@endif
ジンパチ「箱も、そこで渡す」
@goto ep24_names

*ep24_names
@bgm bgm_warm
――二、自分の名前を、名乗らないこと。
@if (F_NAME_RENY || RENY_STATE != "AWAKE") && F_NAME_NEO && F_NAME_MUNI && F_NAME_JIN && (F_NAME_HYU || !F_HYU_RECONCILED)
みんなが、口々に私の名前を呼んでいた。
いつの間にか、この電話の向こうの全員が、私の名前を知っていた。
@goto ep24_collapse
@endif
電話の向こうで、みんなが、口々に私を呼んでいた。
名前で呼ぶ人。「相談員さん」と呼ぶ人。「貴様」と呼ぶ人。「でんわのひと」と呼ぶ人。
ミナセさんの決まりを、私は思い出した。
――名前を教えるとね、情が移るの。あなたも、相手も。
――あと七日で全部終わるのに、それって、きっと辛いから。
あと、一日。
@if kokoro >= 5
@choice
- 電話の向こうの全員に、名乗る -> ep24_name_all
- 決まりを、守る -> ep24_name_keep
@endchoice
@endif
@goto ep24_name_keep

*ep24_name_all
@flag F_NAME_ALL
@memo name_all
{name}「……みんな。聞いて」
{name}「私の名前は、{name}」
@if RENY_STATE == "AWAKE"
@flag F_NAME_RENY
@endif
@flag F_NAME_NEO
@flag F_NAME_JIN
@if F_HYU_RECONCILED
@flag F_NAME_HYU
@endif
@flag F_NAME_MUNI
一瞬、静かになって。
それから、みんなが、一斉に私の名前を呼んだ。
@if RENY_STATE == "AWAKE"
レニィ「{name}！」
@endif
ネオ「{name}」
ジンパチ「{name}な！」
ムニ「{name}ちゃん！」
@if F_HYU_RECONCILED
ヒュウ「{name}さん」
@endif
情が移る。辛くなる。
ミナセさんの言う通りだった。
胸が、痛いくらいに、いっぱいだった。
@kokoro +1
@goto ep24_collapse

*ep24_name_keep
私は、何も言わなかった。
名前を呼ばれるのは、嬉しい。けれど、自分から差し出すのは、まだ、怖かった。
@goto ep24_collapse

*ep24_collapse
@bgm bgm_night_calm
@clock 04:15
@hangup
電話を切ったあと、私は、しばらく窓の外を見ていた。
白星が、空の半分を覆っていた。
あと、一日。
明日の夜明け、屋上で。
そう思ったとき、急に、まぶたが重くなった。
@bgm bgm_dream
熱のせいだと思った。
でも、違った。
これは、いつもの眠気じゃない。
@clock 04:20
@line 1 ring 着信
@se phone_ring
電話が、鳴った。
@if RENY_STATE == "AWAKE"
液晶に、見慣れた番号。
@else
液晶に、見慣れた番号がにじんで見えた。
@endif
取らなきゃ。
受話器に手を伸ばす。
指先が、受話器に触れる。
@se phone_pickup
@if RENY_STATE == "AWAKE"
@if F_NAME_RENY
レニィ「……あ、{name}？　あのね、明日の朝ごはん、何食べたいか聞き忘れて――」
@else
レニィ「……あ、相談員さん？　あのね、明日の朝ごはん、何食べたいか聞き忘れて――」
@endif
@else
ネオ「……おい、明日の献立だが――」
@endif
{name}「……ごめん」
{name}「……ちょっと、眠い……」
@se collapse
受話器が、手から滑り落ちた。
@cg CG27
コードの先で、ぶらりと揺れる受話器から、誰かが私の名前を呼んでいる。
あるいは、名前ではない何かを。
@if MINASE_STATE == "AWAKE" && F_MUNI_MET
前室の扉が開く音。ミナセさんの叫ぶ声。
@endif
@memo collapse
@center その夜、私は眠った。
@center 白い夢の、底へ。
@cgoff
@goto night7
`});
