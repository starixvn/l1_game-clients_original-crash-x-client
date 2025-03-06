import { _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;

import Observer from "observer";
import { BetControlStore } from "./scripts/handlers/crash-v2/bet/bet-control-store";
import { IBetControlSettings } from "./scripts/handlers/crash-v2/interfaces";
const { render, handle } = Observer;

@ccclass("Test")
export class Test extends ObserverComponent {
    @render(BetControlStore, (store) => store.getBetSetting(1))
    renderFirstBetSettings(settings: IBetControlSettings) {
        console.log("first ----- ", settings.amount);
    }
}
