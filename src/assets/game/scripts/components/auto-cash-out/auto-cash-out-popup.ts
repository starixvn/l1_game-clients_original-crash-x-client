import gc from "@sg/game-client-base";
import { _decorator, Button, Color, Label } from "cc";
import Observer from "observer";

import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AutoCashOutStore } from "../../handlers/crash-v2/bet/auto-cash-out-store";
import { AutoCashOutHandlers } from "../../handlers/crash-v2/handlers/auto-cash-out-handlers";

const { FormatUtils, GameCrash } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoCashOutPopup extends ObserverComponent {
    @property(Label)
    multiplierLabel: Label = null;

    @property(Label)
    multiplierRangeLabel: Label = null;

    @property(Button)
    confirmButton: Button = null;

    @handle(AutoCashOutHandlers, (handle, enable: boolean) => handle.closeAutoCashOutPopup())
    close() {
        this.playSoundClick();
    }

    @handle(AutoCashOutHandlers, (handle, multiplier: number) => handle.setMultiplierAutoCashOut(multiplier))
    confirm() {
        this.playSoundClick();
        return parseFloat(this.removeCommasMultiplier());
    }

    @handle(AutoCashOutHandlers, (handle, multiplier: string) => handle.handleMultiplier(multiplier))
    addValue(event, value) {
        this.playSoundClick();
        const multiplier = this.removeCommasMultiplier();

        if (multiplier === "0" && value !== ".") {
            return value;
        }

        const regex = new RegExp(/^[1-9]\d{0,3}(\.\d{0,2})?$/);
        const newValue = `${multiplier}${value}`;

        if (regex.test(newValue)) {
            return newValue;
        }

        return multiplier;
    }

    @render(AutoCashOutStore, (store) => store.multiplierString)
    updateMultiplierString(multiplier: string) {
        let slitStr;
        const suffix = multiplier.split(".")[1];
        if (suffix === "") {
            slitStr = ".";
        } else if (suffix === "0" || suffix === "00") {
            slitStr = `.${suffix}`;
        } else {
            slitStr = "";
        }

        this.multiplierLabel.string = `${FormatUtils.numberWithCommas(+multiplier, 2)}${slitStr}`;
    }

    @render(GameCrash.CrashGameConfigs.CrashGameConfigStore, (store) => ({
        minMultiplier: store.minMultiplier,
        maxMultiplier: store.maxMultiplier,
    }))
    updateMultiplierRangeLabel({ minMultiplier, maxMultiplier }) {
        this.multiplierRangeLabel.string = `${FormatUtils.numberWithCommas(minMultiplier, 2, false)}x - ${FormatUtils.numberWithCommas(
            maxMultiplier,
            2,
            false
        )}x`;
    }

    @render(AutoCashOutStore, (store) => store.isValidAutoCashOutValue)
    updateMultiplierTextColor(isValid: boolean) {
        this.multiplierLabel.color = isValid ? Color.fromHEX(this.multiplierLabel.color, "#FFFC09") : Color.RED;
        this.confirmButton.interactable = isValid;
        this.confirmButton.node.getChildByName("overlay").active = !isValid;
    }

    @handle(AutoCashOutHandlers, (handle, multiplier: string) => handle.handleMultiplier(multiplier))
    removeLastLetter() {
        this.playSoundClick();
        let multiplierString = this.removeCommasMultiplier().slice(0, -1);
        if (!multiplierString) {
            multiplierString = "0";
        }

        return multiplierString;
    }

    @handle(AutoCashOutHandlers, (handle, multiplier: string) => handle.handleMultiplier(multiplier))
    clear() {
        this.playSoundClick();
        return "0";
    }

    @render(AutoCashOutStore, (store) => store.enable)
    setDisplayAutoCashoutPopup(enable: boolean) {
        this.node.active = enable;
        enable && this.closeOtherPopups();
    }

    @handle(GameCrash.Popups.PopupsHandlers, (handle) => handle.closeOtherPopupsWithoutAutoCashOut())
    closeOtherPopups() {}

    private removeCommasMultiplier(): string {
        return this.multiplierLabel.string.replace(",", "");
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
