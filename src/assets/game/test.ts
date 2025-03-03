import { _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;

import Observer from "observer";
import { BetControlStore, IBetControlSettings } from "./scripts/handlers/new/bet/bet-control-store";
const { render, handle } = Observer;

@ccclass("Test")
export class Test extends ObserverComponent {
    @render(BetControlStore, (store) => store.getBetSetting(1))
    renderFirstBetSettings(settings: IBetControlSettings) {
        console.log("first ----- ", settings.amount);
    }
}
