import gc from "@sg/game-client-base";
import { _decorator, EditBox, UIOpacity } from "cc";
import { ClientSeedSettingsPopup } from "db://shared-components/game-crash/provably-fair/scripts/client-seed-settings-popup";

const { ccclass, property } = _decorator;
const { GameCrash, Shared } = gc;

@ccclass
export class ClientSeedSettingsDirectPopup extends ClientSeedSettingsPopup {
    @property(EditBox)
    private inputManualSeed: EditBox = null;

    private static readonly OPACITY_DISABLED = 153;
    private static readonly OPACITY_ENABLED = 255;

    onLoad() {
        super.onLoad();
        this.setupInputListeners();
    }

    private setupInputListeners() {
        const inputNode = this.inputManualSeed.node;
        inputNode.on(EditBox.EventType.EDITING_DID_ENDED, this.onEditEndManualSeed, this);
        //inputNode.on(EditBox.EventType.EDITING_DID_BEGAN, this.onEditBeginManualSeed, this);
    }

    clickManualOption() {
        const randomCS = this.lblRandomClientSeed.string;
        this.inputManualSeed.string = randomCS;
        this.clickManualMode();
        this.setVisibleAutoComponent(false);
    }

    clickAutoOption() {
        this.inputManualSeed.string = "";
        this.clickRandomMode();
        this.setVisibleAutoComponent(true);
    }

    private setVisibleAutoComponent(selectedRandomMode: boolean) {
        this.updateRandomModeElements(selectedRandomMode);
        this.updateManualModeElements(selectedRandomMode);
        this.updateInputField(selectedRandomMode);
    }

    private updateRandomModeElements(selectedRandomMode: boolean) {
        const opacity = selectedRandomMode ? ClientSeedSettingsDirectPopup.OPACITY_ENABLED : ClientSeedSettingsDirectPopup.OPACITY_DISABLED;
        this.tglRandomClientSeed.node.getComponent(UIOpacity).opacity = opacity;
        this.lblRandomClientSeed.node.getComponent(UIOpacity).opacity = opacity;
        this.nodeRandomLabelDisabledBg.active = selectedRandomMode;
    }

    private updateManualModeElements(selectedRandomMode: boolean) {
        const opacity = !selectedRandomMode
            ? ClientSeedSettingsDirectPopup.OPACITY_ENABLED
            : ClientSeedSettingsDirectPopup.OPACITY_DISABLED;
        this.tglManualClientSeed.node.getComponent(UIOpacity).opacity = opacity;
        this.lblManualClientSeed.node.getComponent(UIOpacity).opacity = opacity;
        this.nodeManualLabelDisabledBg.active = !selectedRandomMode;
    }

    private updateInputField(selectedRandomMode: boolean) {
        const opacity = !selectedRandomMode
            ? ClientSeedSettingsDirectPopup.OPACITY_ENABLED
            : ClientSeedSettingsDirectPopup.OPACITY_DISABLED;
        this.inputManualSeed.enabled = !selectedRandomMode;
        this.inputManualSeed.node.getComponent(UIOpacity).opacity = opacity;
    }

    private onEditEndManualSeed() {
        const manualInputValue = this.inputManualSeed.string;
        if (manualInputValue) {
            this.updateValueManualMode(manualInputValue);
        }
    }

    override updateManualClientSeed(manualClientSeed: string) {
        this.inputManualSeed.string = manualClientSeed;
    }

    override setDisplayManualClientSeedPopup(showManualClientSeedPopup: boolean) {}
}
