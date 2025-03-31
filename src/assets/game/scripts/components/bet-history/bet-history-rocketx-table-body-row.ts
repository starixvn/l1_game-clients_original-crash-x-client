import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import Observer from "observer";

import { DynamicObject } from "@sg/game-client-base/dist/game/bet-history";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BetWinCell } from "./bet-win-cell";

const { property, ccclass } = _decorator;
const { DateTimeUtils, FormatUtils } = gc;
const { handle } = Observer;
const cashOutEventName = "cashOut";
const refundEventName = "refund";

export type BetResultHistoryBodyItemType = {
    betHistoryLog: gc.BetHistory.BetHistoryLog;
    index: number;
    betKey: number;
    fractionalOddsFormat?: boolean;
};

@ccclass
export default class BetHistoryRocketXTableBodyRow extends ObserverComponent {
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
        return betHistoryLog.betLogDetails.find((element) => this.isBetRowData(element, betKey.toString()))?.time.toString();
    }

    private setLabels(betTime: string, betHistoryLog: gc.BetHistory.BetHistoryLog, betKey: number) {
        if (this.lblDate) this.lblDate.string = DateTimeUtils.getStringDate(betTime);
        if (this.lblTime) this.lblTime.string = DateTimeUtils.getStringHourByTime(betTime);
        this.lblRound.string = betHistoryLog.roundId.toString();

        const betAmount = this.getBetAmount(betHistoryLog, betKey);
        if (this.lblTotalStake) this.lblTotalStake.string = FormatUtils.numberWithCommas(betAmount, 2);

        this.bindMultiplier(betHistoryLog, betKey);
        this.lblResult.string = `${FormatUtils.numberWithCommas(+betHistoryLog.result, 2, false)}x`;
        this.bindWin(betHistoryLog, betKey);
    }

    private getBetAmount(betHistoryLog: gc.BetHistory.BetHistoryLog, betKey: number): number {
        const amount = betHistoryLog.betLogDetails.find((element) => this.isBetRowData(element, betKey.toString()));
        return amount === undefined ? 0 : Number(amount.amount);
    }

    private bindMultiplier(betHistoryLog: gc.BetHistory.BetHistoryLog, betKey: number) {
        const multiplierRow = betHistoryLog.betLogDetails.find((element) => this.isSettledData(element, betKey.toString()));

        let multiplierText = "-";
        if (multiplierRow !== undefined) {
            const multiplier = Number(multiplierRow.multiplier);
            // this.lblMultiplier.color = CrashUtils.getMultiplierColor(multiplier);
            multiplierText = `${FormatUtils.numberWithCommas(+multiplier, 2, false)}x`;
        }

        this.lblMultiplier.string = multiplierText;
    }

    private bindWin(betHistoryLog: gc.BetHistory.BetHistoryLog, betKey: number) {
        const betCashOut = betHistoryLog.betLogDetails.find((element) => this.isSettledData(element, betKey.toString()));

        const isReachMaxWin = Boolean(betCashOut?.reachMaxWin);
        const betwin = betCashOut === undefined ? 0 : Number(betCashOut.winAmount);
        const win = FormatUtils.numberWithCommas(betwin, 2);

        this.betWinCell.getComponent(BetWinCell)?.setData(win, isReachMaxWin);
    }

    isBetRowData(betDetail: DynamicObject<object>, betKey: string): boolean {
        let actionName = betDetail.action.toString();
        return actionName === gc.GameClientEmitMessage.Bet.eventName.toString() && betDetail.betKey.toString() === betKey;
    }

    isSettledData(betDetail: DynamicObject<object>, betKey: string): boolean {
        let actionName = betDetail.action.toString();
        return (actionName === cashOutEventName || actionName === refundEventName) && betDetail.betKey.toString() === betKey;
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
