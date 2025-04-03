import gc from "@sg/game-client-base";
import { _decorator, EditBox } from "cc";
import { ClientSeedSettingsPopup } from "db://shared-components/game-crash/provably-fair/scripts/client-seed-settings-popup";
import Observer from "observer";
const { ccclass, property } = _decorator;
const { GameCrash, Shared } = gc;
const { utils } = Shared;
const { render, handle } = Observer;

@ccclass
export class ClientSeedSettingsDirectPopup extends ClientSeedSettingsPopup {
    @property(EditBox)
    inputManualSeed: EditBox = null;

    onLoad() {
        this.inputManualSeed.node.on(EditBox.EventType.EDITING_DID_ENDED, this.onEditEndManualSeed, this);
        this.inputManualSeed.node.on(EditBox.EventType.EDITING_DID_BEGAN, this.onEditBeginManualSeed, this);
        super.onLoad();
    }

    clickManualOption() {
        this.inputManualSeed.inputMode = EditBox.InputMode.NUMERIC;
        super.clickManualMode();
    }

    clickAutoOption() {
        this.inputManualSeed.inputMode = EditBox.InputMode.SINGLE_LINE;
        super.clickRandomMode();
    }

    onEditEndManualSeed() {
        let manualInputValue = this.inputManualSeed.string;
        if (manualInputValue !== "") {
            this.updateValueManualMode(manualInputValue);
        }
    }

    onEditBeginManualSeed() {}
}
