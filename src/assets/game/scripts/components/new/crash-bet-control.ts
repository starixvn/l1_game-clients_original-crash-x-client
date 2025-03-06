import gc from "@sg/game-client-base";
import { _decorator, EditBox, Node, Toggle } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetControlStore } from "../../handlers/crash-v2/bet/bet-control-store";
import { ButtonState, IBetControlSettings } from "../../handlers/crash-v2/interfaces";
import { CrashBetHandler } from "../../handlers/override/crash-bet-handler";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass("CrashBetControl")
export default class CrashBetControl extends ObserverComponent {
    @property(Toggle)
    toggleAutoBet: Toggle = null;

    @property(Toggle)
    toggleAutoCashOut: Toggle = null;

    @property(EditBox)
    inputBetAmount: EditBox = null;

    @property(EditBox)
    inputCashOutAt: EditBox = null;

    @property(Node)
    nodePlaceBet: Node = null;

    @property(Node)
    nodeAcceptedBet: Node = null;

    @property(Node)
    nodeCashOut: Node = null;

    @property(Node)
    nodeBetNextRound: Node = null;

    @property(Node)
    nodeWaitingNextRound: Node = null;

    betKey = 0;

    @handle(CrashBetHandler, (handler, betKey: number) => handler.callBet(betKey))
    onClickBet() {
        return this.betKey;
    }

    @handle(CrashBetHandler, (handler, betKey: number) => handler.callCashOut(betKey))
    onClickCashOut() {
        return this.betKey;
    }

    @handle(CrashBetHandler, (handler, betKey: number) => handler.setEarlyBet(betKey))
    onClickBetNextRound() {
        return this.betKey;
    }

    @handle(CrashBetHandler, (handler, betKey: number) => handler.cancelEarlyBet(betKey))
    onClickCancelEarlyBet() {
        return this.betKey;
    }

    @handle(BetControlStore, (handler, betKey: number) => handler.toggleAutoBet(betKey))
    onToggleAutoBet() {
        return this.betKey;
    }

    @handle(BetControlStore, (handler, betKey: number) => handler.toggleAutoCashOut(betKey))
    onToggleAutoCashOut() {
        return this.betKey;
    }

    renderBetState(state: string) {
        this.nodeCashOut.active = state === ButtonState.CASH_OUT;

        this.nodeAcceptedBet.active = state === ButtonState.BET_ACCEPTED;
        this.nodePlaceBet.active = state === ButtonState.PLACE_BET;
        this.nodePlaceBet.parent.active = this.nodePlaceBet.active || this.nodeAcceptedBet.active;

        this.nodeBetNextRound.active = state === ButtonState.BET_NEXT_ROUND;
        this.nodeWaitingNextRound.active = state === ButtonState.CANCEL_BET;
        this.nodeBetNextRound.parent.active = this.nodeWaitingNextRound.active || this.nodeBetNextRound.active;
    }

    renderSetting(setting: IBetControlSettings) {
        this.toggleAutoBet.isChecked = setting.isAuto;
        this.toggleAutoCashOut.isChecked = setting.autoCashOut;
        this.inputBetAmount.string = setting.amount.toString();
        this.inputCashOutAt.string = setting.cashOutAt.toString();
    }
}
