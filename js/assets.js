/*
 * 素材マニフェスト
 * ─────────────────────────────────────────────
 * Codex（グラフィック/BGM担当）への指示：
 *   1. 下記パスに素材ファイルを置くだけで自動的に表示・再生される。
 *   2. ファイルが存在しない場合は、エンジンが自動でプレースホルダー（色付きパネル＋ID表示）を描画する。
 *   3. 仕様（サイズ・尺・ループ・雰囲気）は docs/13_Codex向け素材実装指示書.md を参照。
 *   4. 拡張子を変えたい場合はこのファイルのパスだけ書き換えること（シナリオ側はIDで参照している）。
 * ─────────────────────────────────────────────
 */
window.ASSETS = {
  // 背景 1920x1080
  bg: {
    black:        { path: 'assets/bg/black.png',        color: '#000000' },
    white:        { path: 'assets/bg/white.png',        color: '#f4f6ff' },
    room_evening: { path: 'assets/bg/room_evening.png', color: '#2b2440' },
    room_night:   { path: 'assets/bg/room_night.png',   color: '#141a2e' },
    room_dawn:    { path: 'assets/bg/room_dawn.png',    color: '#5c6a8a' },
    room_day:     { path: 'assets/bg/room_day.png',     color: '#8a94ad' },
    room_dark:    { path: 'assets/bg/room_dark.png',    color: '#07080d' },
    room_fever:   { path: 'assets/bg/room_fever.png',   color: '#3a2230' },
    city_white:   { path: 'assets/bg/city_white.png',   color: '#c9cfe0' },
    city_fire:    { path: 'assets/bg/city_fire.png',    color: '#5a1e12' },
    corridor:     { path: 'assets/bg/corridor.png',     color: '#2a3140' },
    dream_white:  { path: 'assets/bg/dream_white.png',  color: '#eef0fa' },
    rooftop:      { path: 'assets/bg/rooftop.png',      color: '#3b4a6b' },
    rooftop_dawn: { path: 'assets/bg/rooftop_dawn.png', color: '#e8dccb' }
  },
  // 立ち絵（通話中に表示する「想像の姿」）: assets/chara/<char>_<expr>.png  （縦1080程度・透過PNG）
  charaPath: 'assets/chara/{char}_{expr}.png',
  // イベントCG 1920x1080 : data/cg.js の file を参照
  // BGM（ループ）
  bgm: {
    bgm_title:       'assets/bgm/title.ogg',
    bgm_room:        'assets/bgm/room.ogg',
    bgm_night_calm:  'assets/bgm/night_calm.ogg',
    bgm_warm:        'assets/bgm/warm.ogg',
    bgm_mystery:     'assets/bgm/mystery.ogg',
    bgm_tension:     'assets/bgm/tension.ogg',
    bgm_sad:         'assets/bgm/sad.ogg',
    bgm_fire:        'assets/bgm/fire.ogg',
    bgm_radio:       'assets/bgm/radio.ogg',
    bgm_dream:       'assets/bgm/dream.ogg',
    bgm_finale:      'assets/bgm/finale.ogg',
    bgm_true:        'assets/bgm/true.ogg',
    bgm_bad:         'assets/bgm/bad.ogg',
    bgm_ending:      'assets/bgm/ending.ogg'
  },
  // 効果音（ワンショット）
  se: {
    phone_ring:    'assets/se/phone_ring.ogg',
    phone_pickup:  'assets/se/phone_pickup.ogg',
    phone_hangup:  'assets/se/phone_hangup.ogg',
    phone_busy:    'assets/se/phone_busy.ogg',
    phone_dial:    'assets/se/phone_dial.ogg',
    button:        'assets/se/button.ogg',
    beep:          'assets/se/answering_beep.ogg',
    door:          'assets/se/door.ogg',
    clock_tick:    'assets/se/clock_tick.ogg',
    grandfather_clock: 'assets/se/grandfather_clock.ogg',
    wind:          'assets/se/wind.ogg',
    hum:           'assets/se/hum.ogg',
    breath:        'assets/se/breath.ogg',
    quake:         'assets/se/quake.ogg',
    fire:          'assets/se/fire.ogg',
    crowd:         'assets/se/crowd.ogg',
    cheer:         'assets/se/cheer.ogg',
    radio_noise:   'assets/se/radio_noise.ogg',
    siren:         'assets/se/siren.ogg',
    smoke_alarm:   'assets/se/smoke_alarm.ogg',
    bike:          'assets/se/bike.ogg',
    noodle:        'assets/se/noodle.ogg',
    sizzle:        'assets/se/sizzle.ogg',
    heartbeat:     'assets/se/heartbeat.ogg',
    footsteps:     'assets/se/footsteps.ogg',
    glass:         'assets/se/glass.ogg',
    fireworks:     'assets/se/fireworks.ogg',
    dome:          'assets/se/dome_motor.ogg',
    collapse:      'assets/se/collapse.ogg',
    paper:         'assets/se/paper.ogg',
    blackout:      'assets/se/blackout.ogg'
  },
  // UI
  ui: {
    title_logo: 'assets/ui/title_logo.png',
    title_bg:   'assets/ui/title_bg.png',
    phone:      'assets/ui/phone.png',
    textbox:    'assets/ui/textbox.png'
  }
};
