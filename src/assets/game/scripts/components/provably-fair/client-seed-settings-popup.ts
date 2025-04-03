import gc from "@sg/game-client-base";
import { _decorator, EditBox, UIOpacity } from "cc";
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

    private readonly OPACITY_DISABLED_1 = 153;
    private readonly OPACITY_ENABLED_1 = 255;
    onLoad() {
        this.inputManualSeed.node.on(EditBox.EventType.EDITING_DID_ENDED, this.onEditEndManualSeed, this);
        this.inputManualSeed.node.on(EditBox.EventType.EDITING_DID_BEGAN, this.onEditBeginManualSeed, this);
        super.onLoad();
    }

    clickManualOption() {
        this.inputManualSeed.inputMode = EditBox.InputMode.NUMERIC;

        super.clickManualMode();
        this.setVisibleComponent(false);
    }

    clickAutoOption() {
        this.inputManualSeed.inputMode = EditBox.InputMode.SINGLE_LINE;
        super.clickRandomMode();
        this.setVisibleComponent(true);
    }

    setVisibleComponent(selectedRandomMode: boolean) {
        this.tglRandomClientSeed.node.getComponent(UIOpacity).opacity = selectedRandomMode
            ? this.OPACITY_ENABLED_1
            : this.OPACITY_DISABLED_1;
        this.nodeRandomLabelDisabledBg.active = selectedRandomMode;

        this.lblRandomClientSeed.node.getComponent(UIOpacity).opacity = selectedRandomMode
            ? this.OPACITY_ENABLED_1
            : this.OPACITY_DISABLED_1;

        this.nodeManualLabelDisabledBg.active = !selectedRandomMode;
        this.tglManualClientSeed.node.getComponent(UIOpacity).opacity = !selectedRandomMode
            ? this.OPACITY_ENABLED_1
            : this.OPACITY_DISABLED_1;
        this.lblManualClientSeed.node.getComponent(UIOpacity).opacity = !selectedRandomMode
            ? this.OPACITY_ENABLED_1
            : this.OPACITY_DISABLED_1;

        this.inputManualSeed.enabled = !selectedRandomMode;
        this.inputManualSeed.node.getComponent(UIOpacity).opacity = !selectedRandomMode ? this.OPACITY_ENABLED_1 : this.OPACITY_DISABLED_1;
    }

    onEditEndManualSeed() {
        let manualInputValue = this.inputManualSeed.string;
        if (manualInputValue !== "") {
            this.updateValueManualMode(manualInputValue);
        }
    }

    onEditBeginManualSeed() {}
}
