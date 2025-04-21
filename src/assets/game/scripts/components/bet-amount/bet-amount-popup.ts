import gc from "@sg/game-client-base";
import { _decorator, Button, Color, Label } from "cc";
import Observer from "observer";

import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BetInputStore } from "../../handlers/crash-v2/bet/bet-input-store";
import { BetInputHandlers } from "../../handlers/crash-v2/handlers/bet-input-handlers";

const { FormatUtils, GameCrash } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class BetAmountPopup extends ObserverComponent {
    @property(Label)
    lblBetAmount: Label = null;

    @property(Label)
    lblBetRange: Label = null;

    @property(Button)
    btnConfirm: Button = null;

    private readonly chipsLimit = 8;
    private maxBet = 0;

    @render(BetInputStore, (store) => store.isOpenBetAmountPopup)
    private setBetAmountPopupVisibilty(status: boolean) {
        this.node.active = status;
        status && this.closeOtherPopups();
    }

    private checkConfirmBtnStatus(status: boolean) {
        this.btnConfirm.interactable = status;
        this.btnConfirm.node.getChildByName("overlay").active = !status;
    }

    @handle(BetInputHandlers, (handle, enable: boolean) => handle.closePopup())
    close() {
        this.playSoundClick();
    }

    @handle(BetInputHandlers, (handle, betAmount: number) => handle.setBetAmount(betAmount))
    confirm() {
        this.playSoundClick();
        return parseFloat(this.removeCommas());
    }

    @handle(BetInputHandlers, (handle, betAmount: string) => handle.handleBetAmount(betAmount))
    addValue(event, value) {
        this.playSoundClick();
        const betAmount = this.removeCommas();

        if (betAmount === "0" && value !== ".") {
            return value;
        }

        let newValue = `${betAmount}${value}`;
        if (Number(newValue) > this.maxBet) {
            newValue = this.maxBet.toString();
        }

        return newValue;
    }

    @render(BetInputStore, (store) => store.betAmountString)
    updateBetAmountString(betAmount: string) {
        let slitStr;
        const suffix = betAmount.split(".")[1];
        if (suffix === "") {
            slitStr = ".";
        } else if (suffix === "0" || suffix === "00") {
            slitStr = `.${suffix}`;
        } else {
            slitStr = "";
        }

        this.lblBetAmount.string = `${FormatUtils.numberWithCommas(+betAmount, 2)}${slitStr}`;
    }

    @render(gc.Rounds.RoundStore, (store) => ({
        minBet: store.minBet,
        maxBet: store.maxBet,
    }))
    private updateBetRange({ minBet, maxBet }) {
        this.maxBet = maxBet;
        this.lblBetRange.string = `${FormatUtils.numberWithCommas(minBet, 2)} - ${FormatUtils.numberWithCommas(maxBet, 2)}`;
    }

    @render(BetInputStore, (store) => store.isAmountValid)
    updateMultiplierTextColor(isValid: boolean) {
        this.lblBetAmount.color = isValid ? Color.fromHEX(this.lblBetAmount.color, "#FFFC09") : Color.RED;
        this.btnConfirm.interactable = isValid;
        this.btnConfirm.node.getChildByName("overlay").active = !isValid;
    }

    @handle(BetInputHandlers, (handle, betAmount: string) => handle.handleBetAmount(betAmount))
    removeLastLetter() {
        this.playSoundClick();
        let betAmountString = this.removeCommas().slice(0, -1);
        if (!betAmountString) {
            betAmountString = "0";
        }

        return betAmountString;
    }

    @handle(BetInputHandlers, (handle, betAmount: string) => handle.handleBetAmount(betAmount))
    clear() {
        this.playSoundClick();
        return "0";
    }

    @render(BetInputStore, (store) => store.enable)
    setDisplayAutoCashoutPopup(enable: boolean) {
        this.node.active = enable;
        enable && this.closeOtherPopups();
    }

    @handle(GameCrash.Popups.PopupsHandlers, (handle) => handle.closeOtherPopupsWithoutAutoCashOut())
    closeOtherPopups() {}

    private removeCommas(): string {
        return this.lblBetAmount.string.replace(",", "");
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
