import gc from "@sg/game-client-base";
import { _decorator, Component } from "cc";

import { LeaderBoardCashOut } from "db://shared-components/game-crash/leader-board/scripts/components/leader-board-cash-out";
import { CrashUtils } from "../../crash-utils";

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

    setData(data: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        const { name, cashOut, halfCashOut, amount } = data;
        if (cashOut) {
            if (this.firstRow.node.active) {
                let firstRowAmount = Number(this.firstRow.lblBetAmount.string);
                if (firstRowAmount === cashOut.amount) {
                    this.firstRow.setData({
                        name,
                        amount: cashOut.amount,
                        multiplier: cashOut.multiplier,
                        win: cashOut.win,
                    });
                } else {
                    this.secondRow.setData({
                        name,
                        amount: cashOut.amount,
                        multiplier: cashOut.multiplier,
                        win: cashOut.win,
                    });
                }

                this.firstRow.lblMultiplier.color = CrashUtils.getMultiplierColor(cashOut.multiplier);
            }
        } else {
            if (this.firstRow.node.active) {
                this.secondRow.setData({
                    name,
                    amount,
                });
                this.setSecondRowDisplay(true);
            } else {
                this.firstRow.setData({
                    name,
                    amount,
                });
                this.setFirstRowDisplay(true);
            }

            this.firstRow.lblMultiplier.color = CrashUtils.getMultiplierColor(0);
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
