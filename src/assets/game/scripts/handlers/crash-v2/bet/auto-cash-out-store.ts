import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

import gc from "@sg/game-client-base";

@injectable()
export class AutoCashOutStore {
    @inject(gc.GameCrash.CrashGameConfigs.CrashGameConfigStore)
    private readonly crashGameConfigs: gc.GameCrash.CrashGameConfigs.CrashGameConfigStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    currentBetKey: number = 0;
    enable: boolean = false;
    multiplier: number = 0;
    multiplierString: string = "0";

    get isValidAutoCashOutValue(): boolean {
        const parsedMultiplier = parseFloat(this.multiplierString);
        return parsedMultiplier >= this.crashGameConfigs.minMultiplier && parsedMultiplier <= this.crashGameConfigs.maxMultiplier;
    }

    resetDefaultValueStore() {
        this.enable = false;
        this.multiplier = this.crashGameConfigs.minMultiplier;
    }
}
