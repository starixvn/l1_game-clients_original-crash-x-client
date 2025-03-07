import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetControlStore } from "../../handlers/crash-v2/bet/bet-control-store";
import { IBetControlSettings } from "../../handlers/crash-v2/interfaces";
import CrashBetControl from "./crash-bet-control";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass("CrashBetControlContainer")
export default class CrashBetControlContainer extends ObserverComponent {
    @property({ type: CrashBetControl })
    controls: CrashBetControl[] = [];

    onLoad() {
        super.onLoad();
        this.controls.forEach((control, index) => {
            control.betKey = index;
        });
    }

    @render(BetControlStore, (store) => store.getBetState(0))
    renderBetStateFirst(state: string) {
        this.controls[0].renderBetState(state);
    }

    @render(BetControlStore, (store) => store.getBetState(1))
    renderBetStateSecond(state: string) {
        this.controls[1].renderBetState(state);
    }

    @render(BetControlStore, (store) => store.getBetSetting(0))
    renderBetSettingFirst(setting: IBetControlSettings) {
        this.controls[0].renderSetting(setting);
    }

    @render(BetControlStore, (store) => store.getBetSetting(1))
    renderBetSettingSecond(setting: IBetControlSettings) {
        this.controls[1].renderSetting(setting);
    }

    @render(BetControlStore, (store) => store.getCashedOutValue(0))
    renderCashOutValueFirst(value: number) {
        this.controls[0].renderCashOutValue(value);
    }

    @render(BetControlStore, (store) => store.getCashedOutValue(1))
    renderCashOutValueSecond(value: number) {
        this.controls[1].renderCashOutValue(value);
    }
}
