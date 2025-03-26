import gc from "@sg/game-client-base";
import { _decorator, Button, Label, Node } from "cc";
import Observer from "observer";

import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { CrashUtils } from "../../crash-utils";
import { BetWinCell } from "./bet-win-cell";

const { property, ccclass } = _decorator;
const { DateTimeUtils, FormatUtils } = gc;
const { handle } = Observer;
const cashOutEventName = "cashOut";

export type BetResultHistoryBodyItemType = {
    betHistoryLog: gc.BetHistory.BetHistoryLog;
    index: number;
    betKey: number;
    fractionalOddsFormat?: boolean;
};

@ccclass
export default class BetResultHistoryBodyItem extends ObserverComponent {
    @property(Label)
    lblDate: Label = null;

    @property(Label)
    lblTime: Label = null;

    @property(Label)
    lblRound: Label = null;

    @property(Label)
    lblTotalStake: Label = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    @property(Button)
    btnRound: Button = null;

    @property(Label)
    lblResult: Label = null;

    @property(Node)
    betWinCell: Node = null;

    betHistoryLog: gc.BetHistory.BetHistoryLog = null;

    setData(data: BetResultHistoryBodyItemType) {
        const { betHistoryLog, index, betKey } = data;
        this.betHistoryLog = betHistoryLog;
        this.nodeBackground.active = index % 2 > 0;

        const betTime = this.getBetTime(betHistoryLog, betKey);
        this.setLabels(betTime, betHistoryLog, betKey);
    }

    private getBetTime(betHistoryLog: gc.BetHistory.BetHistoryLog, betKey: number): string {
        return betHistoryLog.betLogDetails
            .find(
                (element) =>
                    element.action.toString() === gc.GameClientEmitMessage.Bet.eventName.toString() &&
                    element.betKey.toString() === betKey.toString()
            )
            ?.time.toString();
    }

    private setLabels(betTime: string, betHistoryLog: gc.BetHistory.BetHistoryLog, betKey: number) {
        if (this.lblDate) this.lblDate.string = DateTimeUtils.getStringDate(betTime);
        if (this.lblTime) this.lblTime.string = DateTimeUtils.getStringHourByTime(betTime);
        this.lblRound.string = betHistoryLog.roundId.toString();

        const totalAmount = this.getTotalAmount(betHistoryLog, betKey);
        if (this.lblTotalStake) this.lblTotalStake.string = FormatUtils.numberWithCommas(totalAmount, 2);

        this.bindMultiplier(betHistoryLog, betKey);
        this.lblResult.string = `${FormatUtils.numberWithCommas(+betHistoryLog.result, 2, false)}x`;
        this.bindWin(betHistoryLog, betKey);
    }

    private getTotalAmount(betHistoryLog: gc.BetHistory.BetHistoryLog, betKey: number): number {
        const amount = betHistoryLog.betLogDetails.find(
            (element) =>
                element.action.toString() === gc.GameClientEmitMessage.Bet.eventName.toString() &&
                element.betKey.toString() === betKey.toString()
        );
        return amount === undefined ? 0 : Number(amount.amount);
    }

    private bindMultiplier(betHistoryLog: gc.BetHistory.BetHistoryLog, betKey: number) {
        const multiplierRow = betHistoryLog.betLogDetails.find(
            (element) => element.action.toString() === cashOutEventName && element.betKey.toString() === betKey.toString()
        );

        let multiplierText = "-";
        if (multiplierRow !== undefined) {
            const multiplier = Number(multiplierRow.multiplier);
            this.lblMultiplier.color = CrashUtils.getMultiplierColor(multiplier);
            multiplierText = `${FormatUtils.numberWithCommas(+multiplier, 2, false)}x`;
        }

        this.lblMultiplier.string = multiplierText;
    }

    private bindWin(betHistoryLog: gc.BetHistory.BetHistoryLog, betKey: number) {
        const betCashOut = betHistoryLog.betLogDetails.find(
            (element) => element.action.toString() === cashOutEventName && element.betKey.toString() === betKey.toString()
        );

        const isReachMaxWin = Boolean(betCashOut?.reachMaxWin);
        const betwin = betCashOut === undefined ? 0 : Number(betCashOut.winAmount);
        const win = FormatUtils.numberWithCommas(betwin, 2);

        this.betWinCell.getComponent(BetWinCell)?.setData(win, isReachMaxWin);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle, roundId: number) => handle.openVerificationHistory(roundId))
    onClickVerify() {
        this.playSoundClick();
        return this.betHistoryLog.roundId;
    }

    onLoad() {
        this.setupEventListeners();
        super.onLoad();
    }

    private setupEventListeners() {
        const betWinCellComponent = this.betWinCell.getComponent(BetWinCell);
        betWinCellComponent.btnReachMaxWin.node.on(Node.EventType.MOUSE_ENTER, this.triggerHoverMaxReachCallback, this);
        betWinCellComponent.btnReachMaxWin.node.on(Node.EventType.MOUSE_LEAVE, this.triggerExitHoverMaxReachCallback, this);
    }

    triggerHoverMaxReachCallback() {
        this.node.emit("hover-trigger-parent", this.node);
    }

    triggerExitHoverMaxReachCallback() {
        this.node.emit("exit-hover-trigger-parent", this.node);
    }
}
