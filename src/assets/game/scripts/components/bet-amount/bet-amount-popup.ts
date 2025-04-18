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
    private maxBetLimit = 0;

    @render(BetInputStore, (store) => store.isOpenBetAmountPopup)
    private setBetAmountPopupVisibilty(status: boolean) {
        this.node.active = status;
        status && this.closeOtherPopups();
    }

    @render(BetInputStore, (store) => store.betAmountTemp)
    private updateBetAmount(amount: number) {
        this.lblBetAmount.string = `${FormatUtils.numberWithCommas(amount, 2)}`;
        this.checkConfirmBtnStatus(amount > 0);
    }

    private checkConfirmBtnStatus(status: boolean) {
        this.btnConfirm.interactable = status;
        this.btnConfirm.node.getChildByName("overlay").active = !status;
    }

    @handle(BetInputHandlers, (handle, enable: boolean) => handle.closePopup())
    close() {
        this.playSoundClick();
    }

    @handle(BetInputHandlers, (handle, multiplier: number) => handle.setBetAmount(multiplier))
    confirm() {
        this.playSoundClick();
        return parseFloat(this.removeCommasMultiplier());
    }

    @handle(BetInputHandlers, (handle, multiplier: string) => handle.handleBetAmount(multiplier))
    addValue(event, value) {
        this.playSoundClick();
        const multiplier = this.removeCommasMultiplier();

        if (multiplier === "0" && value !== ".") {
            return value;
        }
        const maxBetLength = this.maxBetLimit.toString().length;
        const regex = new RegExp(`^[1-9]\\d{0,${maxBetLength - 1}}(\\.\\d{0,2})?$`);
        const newValue = `${multiplier}${value}`;

        if (regex.test(newValue)) {
            console.log("newValue", newValue);
            return newValue;
        }

        return multiplier;
    }

    @render(BetInputStore, (store) => store.betAmountString)
    updateMultiplierString(betAmount: string) {
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
        this.maxBetLimit = maxBet;
        this.lblBetRange.string = `${FormatUtils.numberWithCommas(minBet, 2)} - ${FormatUtils.numberWithCommas(maxBet, 2)}`;
    }

    @render(BetInputStore, (store) => store.isAmountValid)
    updateMultiplierTextColor(isValid: boolean) {
        console.log("isValid", isValid);
        this.lblBetAmount.color = isValid ? Color.fromHEX(this.lblBetAmount.color, "#FFFC09") : Color.RED;
        this.btnConfirm.interactable = isValid;
        this.btnConfirm.node.getChildByName("overlay").active = !isValid;
    }

    @handle(BetInputHandlers, (handle, multiplier: string) => handle.handleBetAmount(multiplier))
    removeLastLetter() {
        this.playSoundClick();
        let multiplierString = this.removeCommasMultiplier().slice(0, -1);
        if (!multiplierString) {
            multiplierString = "0";
        }

        return multiplierString;
    }

    @handle(BetInputHandlers, (handle, multiplier: string) => handle.handleBetAmount(multiplier))
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

    private removeCommasMultiplier(): string {
        return this.lblBetAmount.string.replace(",", "");
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
