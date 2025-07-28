const win = window as any;
export const languages = {
    "Common": {},
    "Spaceflight": {
        "auto_cashout": "自动兑现",
        "auto_play": "自动游戏",
        "bet_accepted": "接受投注",
        "bet_amount": "投注金额",
        "cancel_bet": "取消投注",
        "cashed": "兑现",
        "cashout": "兑现",
        "cashout_50%": "兑现 50%",
        "crash": "爆炸",
        "crashed": "坠毁",
        "current_multiplier": "当前倍数",
        "game_icon_name": "航天",
        "game_name": "航天",
        "glossary_bet": "赌注",
        "glossary_crash_point": "崩溃点",
        "glossary_option": "选项",
        "glossary_refund": "退款",
        "glossary_total_bet": "总赌注",
        "in_play": "在玩",
        "message_bet_is_accepted": "投注接受",
        "multiplier": "乘数",
        "next_round": "(下一轮)",
        "number_of_auto_play": "数量 自动游戏:",
        "place_bet": "下注",
        "player": "玩家",
        "reach_max_win": "达到最大胜利",
        "Start_in ": "开始于",
        "stop_auto_play": "停止自动游戏",
        "total_cashout_amount_reach_max": "提现总额 达到最大胜利",
        "waiting": "等待...",
        "you_reach_max_win": "您达到了最大胜利"
    },
    "RocketX": {
        "all_bets": "全部投注",
        "auto_cashout": "自动兑现",
        "auto_play": "自动游戏",
        "bet_accepted": "接受投注",
        "biggest_win": "最大赢家",
        "cancel_bet": "取消投注",
        "cashed": "兑现",
        "cashout": "兑现",
        "crashed": "飞走了",
        "date": "时间",
        "game_icon_name": "火箭 X",
        "game_name": "火箭 X",
        "glossary_bet": "赌注",
        "glossary_message_reach_max_win": "达到最大胜利",
        "glossary_multiplier": "乘数",
        "glossary_refund": "退款",
        "glossary_this_game_is_provably_fair": "该游戏是{provablyFairIcon}<b>可证明公平的</b>。",
        "highest_crash_points": "最高乘数",
        "message_bet_is_accepted": "投注接受",
        "message_total_cashout_amounts_reach_max_win": "提现总额 达到最大胜利",
        "month": "月份",
        "my_bets": "我的投注",
        "next_round": "(下一轮)",
        "place_bet": "下注",
        "player": "玩家",
        "start_in": "开始于",
        "top": "顶部",
        "waiting": "等待...",
        "year": "年"
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zh_cn = languages;