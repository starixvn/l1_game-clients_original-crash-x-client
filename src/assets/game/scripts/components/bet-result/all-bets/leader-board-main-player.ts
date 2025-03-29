import { _decorator, Component } from "cc";

import { LeaderBoardCashOut } from "db://shared-components/game-crash/leader-board/scripts/components/leader-board-cash-out";
import { CrashUtils } from "../../../crash-utils";
import { MainPlayerBetData } from "../../../handlers/crash-v2/interfaces";

const { ccclass, property } = _decorator;
@ccclass
export class LeaderBoardMainPlayer extends Component {
    @property(LeaderBoardCashOut)
    firstRow: LeaderBoardCashOut = null;

    @property(LeaderBoardCashOut)
    secondRow: LeaderBoardCashOut = null;

    onLoad() {
        this.setFirstRowDisplay(false);
        this.setSecondRowDisplay(false);
    }

    setData(data: MainPlayerBetData) {
        let currentRow = this.firstRow;
        if (data.betKey === 1) {
            currentRow = this.secondRow;
            this.setSecondRowDisplay(true);
        } else {
            this.setFirstRowDisplay(true);
        }

        if (data.cashOutWin !== undefined && data.cashOutWin > 0) {
            currentRow.setData({
                name: data.name,
                amount: data.amount,
                multiplier: data.multiplier,
                win: data.cashOutWin,
            });
            currentRow.lblMultiplier.color = CrashUtils.getMultiplierColor(data.multiplier);
        } else {
            currentRow.setData({
                name: data.name,
                amount: data.amount,
            });
            this.firstRow.lblMultiplier.color = CrashUtils.getWhiteColor();
        }
    }

    setSecondRowDisplay(status: boolean) {
        this.secondRow.node.active = status;
    }

    isShowSecondRow(): boolean {
        return this.secondRow.node.active;
    }

    setFirstRowDisplay(status: boolean) {
        this.firstRow.node.active = status;
    }

    isShowFirstRow(): boolean {
        return this.firstRow.node.active;
    }
}
