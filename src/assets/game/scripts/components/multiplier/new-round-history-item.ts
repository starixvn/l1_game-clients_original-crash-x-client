import gc from "@sg/game-client-base";
import { _decorator, Color } from "cc";
import { RoundHistoryItem } from "db://shared-components/game-crash/statistics-bar/round-history-item";
import Observer from "observer";
import { CrashUtils } from "../../crash-utils";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass("NewRoundHistoryItem")
export default class NewRoundHistoryItem extends RoundHistoryItem {
    @property({
        type: Color,
        visible: false,
        override: true,
    })
    labelColors: Color[] = [];

    protected updateMultiplierDisplay(multiplier: number) {
        const index = CrashUtils.getMultiplierIndex(multiplier);
        const colorName = CrashUtils.getMultiplierColorName(index);

        this.nodeMultiplier.spriteFrame = this.mainAtlas.getSpriteFrame(`${this.prefixFrameBg}-${colorName}`);
        if (this.changeMultiplierLabelColor) {
            this.lblMultiplier.color = CrashUtils.getMultiplierColorByIndex(index);
        }
    }
}
