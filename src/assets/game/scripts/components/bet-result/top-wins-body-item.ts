import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label, Node } from "cc";
import Observer from "observer";

import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";

const { property, ccclass } = _decorator;
const { DateTimeUtils, FormatUtils } = gc;
const { BetHistory } = gc;
const { handle } = Observer;

export type BetResultHistoryBodyItemType = {
    betHistoryLog: gc.BetHistory.BetHistoryLog;
    index: number;
    betKey: number;
    fractionalOddsFormat?: boolean;
};

@ccclass
export default class TopWinsBodyItem extends ObserverComponent {
    @property(Label)
    lblPlayer: Label = null;

    @property(Label)
    lblTotalStake: Label = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblWin: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    @property(Label)
    lblResult: Label = null;

    @property(Label)
    lblWinLoss: Label = null;

    betHistoryLog: gc.BetHistory.BetHistoryLog = null;

    setData(data: BetResultHistoryBodyItemType) {
        const { betHistoryLog, index, betKey } = data;
        this.betHistoryLog = betHistoryLog;
        this.nodeBackground.active = index % 2 > 0;
        const { betwin } = betHistoryLog;

        //this.lblPlayer && (this.lblPlayer.string = betHistoryLog.betLogDetails[0].playerName);

        this.lblWin && (this.lblWin.string = FormatUtils.numberWithCommas(betwin, 2));

        let amount = betHistoryLog.betLogDetails.find(
            (element) =>
                element.action.toString() === gc.GameClientEmitMessage.Bet.eventName.toString() &&
                element.betKey.toString() === betKey.toString()
        );

        let totalAmount = amount === undefined ? 0 : Number(amount.amount);
        this.lblTotalStake && (this.lblTotalStake.string = FormatUtils.numberWithCommas(totalAmount, 2));

        if (this.lblWinLoss) {
            const winloss = betwin - totalAmount;
            this.lblWinLoss.string = FormatUtils.numberWithCommas(winloss, 2);
            this.lblWinLoss.color = winloss >= 0 ? new Color().fromHEX("F1E344") : new Color().fromHEX("EB3D26");
        }

        let multiplier = betHistoryLog.betLogDetails.find(
            (element) => element.action.toString() === "cashOut" && element.betKey.toString() === betKey.toString()
        );

        this.lblMultiplier.string = multiplier === undefined ? "-" : `${FormatUtils.numberWithCommas(+multiplier.multiplier, 2, false)}x`;
        this.lblResult.string = `${FormatUtils.numberWithCommas(+betHistoryLog.result, 2, false)}x`;
    }

    @handle(BetHistory.BetDetailsHandlers)
    openTicketDetail() {
        this.playSoundClick();
        return this.betHistoryLog;
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

    @handle(gc.BetDetailsNew.BetDetailsHandler, (handler, payload: any) => handler.openBetDetails(payload))
    openBetDetails() {
        this.playSoundClick();
        return {
            roundId: this.betHistoryLog.roundId,
            mode: "dark",
            language: gc.Translator.getLanguageId(),
            timeZoneOffset: -new Date().getTimezoneOffset() / 60,
        };
    }
}

export class BaseResultBodyItem extends Component {
    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>) {}
}
