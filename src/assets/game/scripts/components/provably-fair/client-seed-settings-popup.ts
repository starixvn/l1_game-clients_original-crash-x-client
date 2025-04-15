import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { ClientSeedSettingsPopup } from "db://shared-components/game-crash/provably-fair/scripts/client-seed-settings-popup";
import Observer from "observer";
import { BetControlStore } from "../../handlers/crash-v2/bet/bet-control-store";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class ClientSeedSettingsDirectPopup extends ClientSeedSettingsPopup {
    @render(gc.Bet.BetStore, (store) => store.lastReceivedBet, { fireImmediately: false })
    closeSettingPopup(lastReceivedBet: gc.Bet.ILastReceivedBet) {
        if (lastReceivedBet?.value > 0) {
            this.closeSettingsPopup();
        }
    }

    @render(BetControlStore, (store) => store.notAllowChangeClientSeed, { fireImmediately: true })
    setDisplayComponentsNew(notAllowChangeClientSeed: boolean) {
        this.setDisplayComponents(notAllowChangeClientSeed);

        const highlightManualMode = !notAllowChangeClientSeed && this.tglManualClientSeed.isChecked;
        const highlightRandomMode = !notAllowChangeClientSeed && this.tglRandomClientSeed.isChecked;

        this.setDisplayContentManualMode(highlightManualMode);
        this.setDisplayContentRandomMode(highlightRandomMode);
    }
}
