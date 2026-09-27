/*
 * ゴールデンパス定義：各エンディングへ確実に到達できる選択方針。
 * prefer に並べたラベルを優先して選ぶ（リスト内の順番が優先度）。該当が無ければ先頭の選択肢。
 * globals で周回フラグ（G_*）を事前に与えられる。
 * tools/validate.js が実行し、期待エンディングに到達するか検査する。
 */
const WARM = ['pro_answer','pro_a','ep01_a','ep01_name','ep02_a','ep03_wait','ep04_a','day1_talk','day1_drawer',
  'ep05_a','ep06_a','ep06_name','ep07_reny','ep07_hyu_a','ep08_name','n2f_pair','day2_mil','day2_notbad','day2_phone',
  'ep09_conf','ep09_wish','ep09_jinname','ep10_onair','ep10_msg_a','ep10_onair_name','ep11_grandpa','ep11_s_a',
  'ep12_a','ep12_givename','ep12_muni_b','n3f_jin','n3f_jin_a','n3_route','ep13_tell','ep14_r_window','ep14_jc_b',
  'ep15_why','ep15_truth','ep16_t_old_a','ep16_t_girl_a','day4_phone','ep17_wake','ep19_n_with','ep19_apt_roof','ep19_h_attic','ep19_h_back','ep19_neo_grandpa',
  'ep20_jin_a','ep20_neo_a','ep20_gel_b','ep21_dream_go','ep21_h_conf','ep21_r1_a','ep21_r2_a','ep22_conf','ep23_confess_yes',
  'ep24_wish_out','ep24_name_all','ep25_answer','ep27_reny','ep27_gel','ep28_lw_b','day5_drawer'];

module.exports = [
  { name: 'TRUE（周回・レニィの部屋）', expect: 'TRUE', globals: ['G_CLEAR_ONCE', 'G_DREAM_2222'], prefer: ['ep13_to_reny', ...WARM] },
  { name: 'TRUE（周回・月見館・嘘ルート和解）', expect: 'TRUE', globals: ['G_CLEAR_ONCE', 'G_DREAM_2222', 'G_DREAM_FIRE'],
    prefer: ['ep13_to_hotel', 'ep15_why', 'ep15_lie', 'ep16_gel_honest', 'ep16_lie_tell', 'ep18_l_defend', 'ep18_l_heard', 'ep20_hl_a', ...WARM] },
  { name: 'GOOD（初回・ゲルを取る）', expect: 'GOOD', globals: [], prefer: ['ep13_to_reny', 'ep23_take_gel', ...WARM] },
  { name: 'BAD04（初回・ムニを取る）', expect: 'BAD04', globals: [], prefer: ['ep13_to_reny', 'ep23_keep', ...WARM] },
  { name: 'BAD02（ジンパチを動かせない）', expect: 'BAD02', globals: [], prefer: ['ep19_n_escape', 'ep19_n_hurry', 'ep13_to_reny', ...WARM] },
  { name: 'BAD03（ネオの説得失敗）', expect: 'BAD03', globals: [],
    prefer: ['ep02_b', 'ep06_b', 'ep07_reny', 'n2f_jin', 'ep11_house', 'n3f_reny', 'ep13_to_hotel', 'ep19_neo_b', 'ep19_neo_c', ...WARM.filter(l => !['ep02_a','ep06_a','ep06_name','n2f_pair','ep11_grandpa'].includes(l))] },
  { name: 'BAD06（夢に留まる）', expect: 'BAD06', globals: [], prefer: ['ep25_stay', 'ep23_take_gel', ...WARM] },
  { name: 'BAD01（断線）', expect: 'BAD01', globals: [],
    prefer: ['pro_b', 'pro_wait1', 'pro_wait2', 'ep01_b', 'ep01_noname', 'ep02_b', 'ep03_c', 'ep04_c', 'day1_tired', 'day1_window',
      'ep05_b', 'ep06_b', 'ep06_noname', 'ep07_hyu', 'ep07_hyu_b', 'ep08_noname', 'n2f_jin', 'day2_nothing', 'day2_askname', 'day2_window',
      'ep09_food', 'ep09_jinnoname', 'ep10_decline', 'ep11_direct', 'ep12_a', 'ep12_noname', 'n3f_jin', 'n3_careful', 'end_bad01'] },
  { name: 'BAD05（誰にも名乗らない）', expect: 'BAD05', globals: [],
    prefer: ['ep01_noname', 'ep06_noname', 'ep08_noname', 'ep09_jinnoname', 'ep10_onair', 'ep10_onair_noname', 'ep12_c', 'ep12_noname',
      'ep23_take_gel', 'ep23_confess_no', 'ep24_name_keep', 'ep13_notell',
      ...WARM.filter(l => !['ep01_name','ep06_name','ep08_name','ep09_jinname','ep10_onair_name','ep12_a','ep12_givename','ep23_confess_yes','ep24_name_all','ep13_tell'].includes(l))] },
  { name: 'END_MUNI（ムニだけに名乗る）', expect: 'END_MUNI', globals: [],
    prefer: ['ep01_noname', 'ep06_noname', 'ep08_name', 'ep09_jinnoname', 'ep10_decline', 'ep12_c', 'ep12_noname', 'ep23_take_gel', 'ep23_confess_no', 'ep24_name_keep',
      ...WARM.filter(l => !['ep01_name','ep06_name','ep09_jinname','ep10_onair','ep12_a','ep12_givename','ep23_confess_yes','ep24_name_all'].includes(l))] },
  { name: 'END_RENY（レニィだけに名乗る）', expect: 'END_RENY', globals: [],
    prefer: ['ep01_name', 'ep06_noname', 'ep08_noname', 'ep09_jinnoname', 'ep10_decline', 'ep12_c', 'ep12_noname', 'ep23_take_gel', 'ep23_confess_no', 'ep24_name_keep', 'n3f_reny', 'ep27_reny',
      ...WARM.filter(l => !['ep06_name','ep08_name','ep09_jinname','ep10_onair','ep12_a','ep12_givename','ep23_confess_yes','ep24_name_all','n3f_jin'].includes(l))] },
  { name: 'END_NEO（ネオだけに名乗る）', expect: 'END_NEO', globals: [],
    prefer: ['ep01_noname', 'ep06_name', 'ep08_noname', 'ep09_jinnoname', 'ep10_decline', 'ep12_c', 'ep12_noname', 'ep23_take_gel', 'ep23_confess_no', 'ep24_name_keep', 'n2f_neo', 'n2f_neo_b', 'n3f_neo', 'ep13_to_hotel',
      ...WARM.filter(l => !['ep01_name','ep08_name','ep09_jinname','ep10_onair','ep12_a','ep12_givename','ep23_confess_yes','ep24_name_all','n2f_pair','n3f_jin'].includes(l))] },
  { name: 'END_JIN（ジンパチだけに名乗る）', expect: 'END_JIN', globals: [],
    prefer: ['ep01_noname', 'ep06_noname', 'ep08_noname', 'ep09_jinname', 'ep10_decline', 'ep12_c', 'ep12_noname', 'ep23_take_gel', 'ep23_confess_no', 'ep24_name_keep', 'n2f_jin', 'n2f_jin_b',
      ...WARM.filter(l => !['ep01_name','ep06_name','ep08_name','ep10_onair','ep12_a','ep12_givename','ep23_confess_yes','ep24_name_all'].includes(l))] },
  { name: 'END_GEL（ゲルだけに名乗る）', expect: 'END_GEL', globals: [],
    prefer: ['ep01_noname', 'ep06_noname', 'ep08_noname', 'ep09_jinnoname', 'ep10_decline', 'ep12_a', 'ep12_givename', 'ep23_take_gel', 'ep23_confess_yes', 'ep24_name_keep', 'ep20_gel_b',
      ...WARM.filter(l => !['ep01_name','ep06_name','ep08_name','ep09_jinname','ep10_onair','ep24_name_all'].includes(l))] },
  { name: 'END_HYU（電波で名乗る→ヒュウ最優先）', expect: 'END_HYU', globals: [],
    prefer: ['ep01_noname', 'ep06_noname', 'ep08_noname', 'ep05_b', 'ep09_food', 'ep09_jinnoname', 'ep10_onair', 'ep10_onair_name', 'ep07_hyu', 'ep07_hyu_a', 'n3f_hyu', 'ep12_b',
      'ep15_why', 'ep15_lie', 'ep18_l_heard', 'ep20_hl_a', 'ep21_h_skip', 'ep19_n_go', 'ep19_n_with', 'ep23_take_gel', 'ep23_confess_no', 'ep24_name_keep', 'ep20_gel_a',
      ...WARM.filter(l => !['ep01_name','ep06_name','ep08_name','ep09_jinname','ep12_a','ep12_givename','ep23_confess_yes','ep24_name_all','ep05_a','ep09_wish','ep14_jc_b','ep20_jin_a','ep20_gel_b','n3f_jin','n3f_jin_a','ep15_truth','ep21_h_conf'].includes(l))] }
];
