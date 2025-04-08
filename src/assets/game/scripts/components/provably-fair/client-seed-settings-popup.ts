import gc from "@sg/game-client-base";
import { _decorator, EditBox, Label, Node, Toggle, UIOpacity } from "cc";
import { ClientSeedSettingsPopup } from "db://shared-components/game-crash/provably-fair/scripts/client-seed-settings-popup";
import Observer from "observer";
import { BetControlStore } from "../../handlers/crash-v2/bet/bet-control-store";
import { ButtonState } from "../../handlers/crash-v2/interfaces";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class ClientSeedSettingsDirectPopup extends ClientSeedSettingsPopup {
    @property(EditBox)
    private inputManualSeed: EditBox = null;

    @property(Label)
    lblRandomClientSeed: Label = null;

    @property(Label)
    lblManualClientSeed: Label = null;

    @property(Toggle)
    tglRandomClientSeed: Toggle = null;

    @property(Toggle)
    tglManualClientSeed: Toggle = null;

    @property(Node)
    nodeRandomLabelDisabledBg: Node = null;

    @property(Node)
    nodeManualLabelDisabledBg: Node = null;

    private static readonly OPACITY_DISABLED = 153;
    private static readonly OPACITY_ENABLED = 255;

    onLoad() {
        super.onLoad();
        this.setupInputListeners();
    }

    private setupInputListeners() {
        const inputNode = this.inputManualSeed.node;
        inputNode.on(EditBox.EventType.EDITING_DID_ENDED, this.onEditEndManualSeed, this);
    }

    clickManualOption() {
        const randomCS = this.lblRandomClientSeed.string;
        this.inputManualSeed.string = randomCS;
        this.updateValueManualMode(randomCS);
        this.clickManualMode();
    }

    clickAutoOption() {
        this.inputManualSeed.string = "";
        this.clickRandomMode();
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

    updateManualClientSeed(manualClientSeed: string) {
        this.inputManualSeed.string = manualClientSeed;
    }

    setDisplayManualClientSeedPopup(showManualClientSeedPopup: boolean) {}

    @render(gc.Bet.BetStore, (store) => store.lastReceivedBet, { fireImmediately: false })
    closeSettingPopup(lastReceivedBet: gc.Bet.ILastReceivedBet) {
        if (!lastReceivedBet || lastReceivedBet.value <= 0) {
            return;
        }

        this.closeSettingsPopup();
    }

    updateRandomMode(randomClientSeedEnabled: boolean) {
        super.updateRandomMode(randomClientSeedEnabled);
        this.updateInputField(randomClientSeedEnabled);
    }

    @render(BetControlStore, (store) => store.notAllowChangeClientSeed, { fireImmediately: true })
    setDisplayComponentsNew(notAllowChangeClientSeed: boolean) {
        console.log("notAllowChangeClientSeed", notAllowChangeClientSeed);
        this.setDisplayComponents(notAllowChangeClientSeed);

        if(this.tglManualClientSeed.isChecked) {
            this.inputManualSeed.enabled = !notAllowChangeClientSeed;
        }
    }

    isNotAllowChangeClientSeed(betStates: string[]) {
        return betStates.some(state => 
            state === ButtonState.BET_ACCEPTED || 
            state === ButtonState.CASH_OUT
        );
    }
}
