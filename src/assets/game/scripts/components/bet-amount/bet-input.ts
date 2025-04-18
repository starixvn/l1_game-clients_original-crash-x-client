import gc from "@sg/game-client-base";
import { _decorator, Button, CCInteger, Label, Node } from "cc";
import Observer from "observer";

import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BetControlStore } from "../../handlers/crash-v2/bet/bet-control-store";
import { BetInputStore } from "../../handlers/crash-v2/bet/bet-input-store";
import { BetInputHandlers } from "../../handlers/crash-v2/handlers/bet-input-handlers";

const { FormatUtils, GameCrash } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
@ccclass
export class BetInput extends ObserverComponent {
    @property(Label)
    lblBetAmount: Label = null;

    @property(Button)
    btnDecrease: Button = null;

    @property(Button)
    btnIncrease: Button = null;

    @property(Node)
    nodeDisabledLayer: Node = null;

    @property(CCInteger)
    beyKey: number = 0;

    @render(BetInputStore, (store) => store.isDisabledBetInput)
    private setDisabledLayerVisibility(isDisabledBetInput: boolean) {
        this.nodeDisabledLayer.active = isDisabledBetInput;
    }

    @render(BetControlStore, (store) => store.controls[0].setting.amount)
    private updateBetAmountWithBetKey0(amount: number) {
        if (this.beyKey === 0) {
            this.lblBetAmount.string = amount > 0 ? `${FormatUtils.numberWithCommas(amount, 2)}` : "";
        }
    }

    @render(BetControlStore, (store) => store.controls[1].setting.amount)
    private updateBetAmountWithBetKey1(amount: number) {
        if (this.beyKey === 1) {
            this.lblBetAmount.string = amount > 0 ? `${FormatUtils.numberWithCommas(amount, 2)}` : "";
        }
    }

    @handle(BetInputHandlers, (handle, betKey: number) => handle.openPopup(betKey))
    openPopup() {
        this.playSoundClick();
        return this.beyKey;
    }

    private onClickBetAmountQuickChange(event) {
        this.playSoundClick();
        return event.target.name === "increase";
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
