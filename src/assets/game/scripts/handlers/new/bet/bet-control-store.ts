import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

export interface IBetControlSettings {
    isAuto: boolean;
    autoCashOut: boolean;
    autoBet: boolean;
    cashOutAt: number;
    amount: number;
}

@injectable()
export class BetControlStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    processing = {};

    settings: IBetControlSettings[] = [
        {
            isAuto: false,
            autoCashOut: false,
            autoBet: false,
            cashOutAt: 2.0,
            amount: 0.1,
        },
        {
            isAuto: false,
            autoCashOut: false,
            autoBet: false,
            cashOutAt: 5.0,
            amount: 0.5,
        },
    ];

    setAuto(betKey: number, enabled: boolean) {
        this.settings[betKey] = { ...this.settings[betKey], isAuto: enabled };
    }

    setAutoBet(betKey: number, enabled: boolean) {
        this.settings[betKey] = { ...this.settings[betKey], autoBet: enabled };
    }

    setAutoCashOut(betKey: number, enabled: boolean) {
        this.settings[betKey] = { ...this.settings[betKey], autoCashOut: enabled };
    }

    setCashOutMultiplier(betKey: number, multiplier: number) {
        this.settings[betKey] = { ...this.settings[betKey], cashOutAt: multiplier };
    }

    setBetAmount(betKey: number, amount: number) {
        this.settings[betKey] = { ...this.settings[betKey], amount: amount };
    }

    getBetSetting(betKey: number) {
        return this.settings[betKey];
    }
}
