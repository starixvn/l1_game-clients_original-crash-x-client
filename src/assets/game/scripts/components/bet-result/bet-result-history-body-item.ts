import gc from "@sg/game-client-base";
import { _decorator, Button, Color, Component, Label, Node } from "cc";
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

    @property(Label)
    lblWin: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    @property(Label)
    lblHour: Label = null;

    @property(Button)
    btnRound: Button = null;

    @property(Label)
    lblResult: Label = null;

    @property(Label)
    lblWinLoss: Label = null;

    betHistoryLog: gc.BetHistory.BetHistoryLog = null;

    setData(data: BetResultHistoryBodyItemType) {
        const { betHistoryLog, index, betKey } = data;
        this.betHistoryLog = betHistoryLog;
        this.nodeBackground.active = index % 2 > 0;
        const { time, betwin, roundId } = betHistoryLog;

        this.lblDate && (this.lblTime.string = DateTimeUtils.getStringDate(time));

        const date = new Date(time);
        const formattedTime = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        this.lblTime && (this.lblTime.string = formattedTime);

        this.lblRound.string = roundId.toString();

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

    @handle(gc.RoundBasePF.ProvablyFairHandler, (handle, roundId: number) => handle.openVerificationHistory(roundId))
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
