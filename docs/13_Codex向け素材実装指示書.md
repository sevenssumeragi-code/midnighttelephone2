# 13 Codex向け素材実装指示書（グラフィック・BGM・SE）

このゲームは **素材以外すべて実装済み**。以下のパスにファイルを置けば、コードを変更せずに反映される。
未配置の素材はエンジンがプレースホルダー（背景＝単色、CG＝構図説明パネル、立ち絵＝シルエット、音＝無音）に置き換えるので、途中段階でも常に通しプレイできる。

## 0. 作業手順
1. `js/assets.js`（背景・立ち絵・BGM・SE・UI）と `data/cg.js`（イベントCG）に記載のパスへファイルを置く
2. `index.html` をブラウザで開いて確認（`index.html?debug=1` でラベルジャンプ・全CG解放が使える）
3. タイトル画面「サウンド」でBGMを試聴、「ギャラリー」でCGを確認
4. 拡張子を変える（.png→.webp、.ogg→.mp3 等）場合は **パスの記述だけ** 書き換える。シナリオはIDで参照しているので触らない
5. `node tools/validate.js` が通ることを確認（素材ファイルの有無は検査しない。IDの整合性のみ）

**禁止**：シナリオ（`scenario/`）・エンジン（`js/compiler.js` `js/engine.js`）の変更は不要。ID名を変えたい場合は、シナリオ側の参照も全置換すること。

## 1. 背景（`assets/bg/`、1920×1080）

主人公は部屋から出られないため、背景の大半は **707号室** の時間・状態違い。

| ID | ファイル | 内容 | 使用箇所 |
|---|---|---|---|
| black | black.png | 黒 | 暗転、エピローグ |
| white | white.png | 白 | 世界の終わり、手紙、白い夢の余白 |
| room_evening | room_evening.png | 707号室・夕方。ベッド、小机、黒い2回線電話機、窓（月と小さな白星）、分厚いガラス壁、前室の扉、受け渡し口 | 序章 |
| room_night | room_night.png | 707号室・夜。電話機の赤いランプ、窓に白星 | 各夜の基本 |
| room_dawn | room_dawn.png | 707号室・明け方。ガラスの向こうの廊下にミナセが立つ余地 | 5時の回診 |
| room_day | room_day.png | 707号室・昼。カーテン越しの白い光 | 昼パート |
| room_dark | room_dark.png | 停電中の707号室。非常灯の緑、窓の外は白星の光だけ | 第五夜（真実ルート） |
| room_fever | room_fever.png | 発熱時の707号室。色相を赤紫に寄せ、輪郭が滲む | 第四〜六夜 |
| city_white | city_white.png | 窓から見た朝の街。道に横たわる人々、救急車、北の山の天文台ドーム | 昼パート「窓」 |
| city_fire | city_fire.png | 窓から見た燃える街（駅前と月見坂の方角に火） | 第19話 |
| corridor | corridor.png | 7階の廊下と、屋上へ続く階段 | 第28話（部屋の外へ） |
| dream_white | dream_white.png | 上下の区別のない白い空間、遠くに星 | 第七夜・BAD06 |
| rooftop | rooftop.png | 病院の屋上庭園（小さな花壇、ベンチ、テーブル）。空の全部が白星 | 第28話 |
| rooftop_dawn | rooftop_dawn.png | 同・夜明け。白い光がまぶしさに変わる | TRUE / GOOD |

## 2. 立ち絵（`assets/chara/<id>_<expr>.png`）
一覧と表情は `12_スチル製作・回収指示書.md` §4。計50枚。透過PNG、画面右に表示（表示枠 420×640px、object-fit: contain、下揃え）。

## 3. イベントCG（`assets/cg/`）
一覧と構図は `12_スチル製作・回収指示書.md` §2（`data/cg.js`）。計53枚。

## 4. UI（`assets/ui/`、任意）
| キー | ファイル | 内容 |
|---|---|---|
| title_bg | title_bg.png | タイトル背景（夜空、月と白星、病院の窓。右上に白星が来る構図だとCSSの光球と重なって自然） |
| title_logo | title_logo.png | ロゴ（現在はテキスト表示。画像にする場合は `index.html` の `.title-logo` を置き換え） |
| phone | phone.png | 電話パネルの質感（任意。CSS `#phone` の background に指定） |
| textbox | textbox.png | テキストウィンドウ枠（任意。CSS `#textbox` に指定） |

## 5. BGM（`assets/bgm/`、ループ再生、OGG推奨）

| ID | ファイル | 曲想 | テンポ／楽器の目安 | 主な使用場面（回数） |
|---|---|---|---|---|
| bgm_title | title.ogg | 静かで少し寂しい、白い夜の予感 | 60bpm、ピアノ＋パッド、オルゴール風の高音 | タイトル |
| bgm_room | room.ogg | 無菌室の静けさ。空気清浄機のような持続音の上に細い旋律 | 70bpm、エレピ、ドローン | 序章、朝の回診（4） |
| bgm_night_calm | night_calm.ogg | 電話を待つ夜。穏やかだが孤独 | 72bpm、ピアノ、ローファイ | 各夜の基本（23） |
| bgm_warm | warm.ogg | 日常の温かさ。夜食会、笑い声 | 90bpm、アコギ、グロッケン | 日常イベント（22） |
| bgm_mystery | mystery.ogg | 2:22の無言電話。低い唸り、不穏 | テンポ感薄、低音ドローン、金属音 | 無言電話、ゲル（7） |
| bgm_tension | tension.ogg | 事件の緊張。時計の刻み | 110bpm、ストリングスのスタッカート | 失踪、嘘、ジレンマ（15） |
| bgm_sad | sad.ogg | 喪失と告白 | 64bpm、ピアノソロ＋チェロ | 告白、喪失（22） |
| bgm_fire | fire.ogg | 火事。焦燥と鼓動 | 130bpm、太鼓、低弦 | 第19話（3） |
| bgm_radio | radio.ogg | 海賊ラジオのジングル的な曲。少し気取ったジャズ | 96bpm、ウッドベース、ブラシ | ヒュウの番組（7） |
| bgm_dream | dream.ogg | 白い夢。浮遊、甘美、危うさ | 無拍、パッド、ボーイソプラノ風シンセ | 第七夜・BAD06（3） |
| bgm_finale | finale.ogg | 屋上へ。高揚と別れ | 80bpm、ピアノ＋ストリングス、盛り上がる | 第28話（3） |
| bgm_true | true.ogg | 真のエンディング、手紙の朗読 | 68bpm、ピアノ＋ストリングス＋コーラス | 手紙、TRUE（5） |
| bgm_bad | bad.ogg | BADエンディング。空虚 | 無拍、薄いパッド、残響 | BAD（5） |
| bgm_ending | ending.ogg | エンディング画面（TRUE/GOOD/個別） | 余韻、2分程度でループ | エンディング画面 |

- 音量はゲーム内設定で調整されるので、マスターは -14 LUFS 前後で揃える。
- ループ曲はイントロなしでループポイントが自然につながること（HTML5 Audio の loop を使用）。

## 6. SE（`assets/se/`、ワンショット）

| ID | ファイル | 内容 | 使用回数 |
|---|---|---|---|
| phone_ring | phone_ring.ogg | **最重要**。古い黒電話のベル「ジリリ」1〜2回分（2秒程度） | 67 |
| phone_pickup | phone_pickup.ogg | 受話器を取る「カチャ」 | 58 |
| phone_hangup | phone_hangup.ogg | 受話器を置く／通話が切れる | 3＋@hangup時 |
| phone_busy | phone_busy.ogg | 「ツー、ツー」 | 2 |
| phone_dial | phone_dial.ogg | プッシュ音の連なり（ピポパ） | 19 |
| button | button.ogg | 電話機のボタン（保留・三者） | 6 |
| beep | answering_beep.ogg | 留守番電話の「ピーッ」 | 5 |
| door | door.ogg | 前室の自動ドア／エアロック | 12 |
| clock_tick | clock_tick.ogg | ナースステーションの時計のチャイム | 1 |
| grandfather_clock | grandfather_clock.ogg | 月見館の柱時計「ボーン」（長い残響＝広い空間） | 3 |
| wind | wind.ogg | 高所の風（天文台・屋上） | 10 |
| hum | hum.ogg | 空気清浄機が一瞬おかしな音を立てる | 1 |
| breath | breath.ogg | 堪えた息、寝息 | 2 |
| quake | quake.ogg | 地鳴りと揺れ | 11 |
| collapse | collapse.ogg | 崩落（梁、ドーム、電話機の落下） | 11 |
| fire | fire.ogg | 燃える音 | 12 |
| crowd | crowd.ogg | 怒号・群衆 | 3 |
| cheer | cheer.ogg | 遠くの歓声 | 1 |
| fireworks | fireworks.ogg | 遠い花火（ガラス越しでくぐもる） | 1 |
| radio_noise | radio_noise.ogg | FMのノイズとチューニング音 | 16 |
| siren | siren.ogg | サイレン | 予備 |
| smoke_alarm | smoke_alarm.ogg | 煙探知機「ピーッ、ピーッ」 | 1 |
| bike | bike.ogg | バイクのアイドリングと吹かし | 6 |
| noodle | noodle.ogg | カップ麺の蓋を剥がす／すする | 4 |
| sizzle | sizzle.ogg | フライパンの「じゅう」 | 2 |
| heartbeat | heartbeat.ogg | 心臓の鼓動 | 3 |
| footsteps | footsteps.ogg | 走る足音／階段 | 10 |
| glass | glass.ogg | ガラスや機材が割れる | 4 |
| dome | dome_motor.ogg | 天文台ドームの回転モーター（無言電話の背景音と同じ質感） | 3 |
| paper | paper.ogg | 便箋を開く | 4 |
| blackout | blackout.ogg | 停電「ばつん」と機械の停止 | 1 |

## 7. 表示仕様（参考）
- ステージ 1280×720 を等比拡縮。素材は 1920×1080 で作れば高DPIでも鮮明。
- 背景・CG は `object-fit: cover`。上下左右の端 5% は UI（電話パネル＝左上、テキストウィンドウ＝下部 230px）と重なるため、重要な要素は中央〜右上に置く。
- 立ち絵は右端（right: 60px）、高さ 640px 枠。
