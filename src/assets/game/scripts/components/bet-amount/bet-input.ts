import gc from "@sg/game-client-base";
import { _decorator, CCInteger, Label } from "cc";
import Observer from "observer";

import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BetInputHandlers } from "../../handlers/crash-v2/handlers/bet-input-handlers";

const { FormatUtils, GameCrash } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
@ccclass
export class BetInput extends ObserverComponent {
    @property(Label)
    lblBetAmount: Label = null;

    @property(CCInteger)
    beyKey: number = 0;

    @handle(BetInputHandlers, (handle, betKey: number) => handle.openPopup(betKey))
    openPopup() {
        this.playSoundClick();
        return this.beyKey;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
