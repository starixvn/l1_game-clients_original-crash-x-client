import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

import gc from "@sg/game-client-base";
import { ButtonState, CrashCashOutData, IBetControlSettings } from "../interfaces";

@injectable()
export class BetControlStore {
    @inject(gc.Rounds.RoundTimeStore) protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    processing = {
        0: false,
        1: false,
    };

    betState = {
        0: ButtonState.PLACE_BET,
        1: ButtonState.PLACE_BET,
    };

    betAccepted = {
        0: false,
        1: false,
    };

    cashedOut: { [betKey: number]: CrashCashOutData } = {
        0: null,
        1: null,
    };

    earlyBet = {
        0: false,
        1: false,
    };

    settings: IBetControlSettings[] = [
        {
            isAuto: false,
            autoCashOut: false,
            autoBet: false,
            cashOutAt: 2.0,
            amount: 1,
        },
        {
            isAuto: false,
            autoCashOut: false,
            autoBet: false,
            cashOutAt: 5.0,
            amount: 2,
        },
    ];

    setProcessing(betKey: number, processing: boolean) {
        this.processing[betKey] = processing;
    }

    setAcceptedBet(betKey: number, accepted: boolean) {
        this.betAccepted[betKey] = accepted;
        this.setProcessing(betKey, false);
    }

    setCashedOut(cashedOut: CrashCashOutData) {
        //TODO:remove this after testing
        if (!cashedOut.betKey) {
            cashedOut.betKey = 0;
        }
        this.cashedOut[cashedOut.betKey] = cashedOut;
    }

    resetLastBet() {
        this.processing = {
            0: false,
            1: false,
        };
        this.betAccepted = {
            0: false,
            1: false,
        };
        this.cashedOut = {
            0: null,
            1: null,
        };
    }

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

    getBetState(betKey: number) {
        const betAccepted = this.betAccepted[betKey];
        const cashedOut = this.cashedOut[betKey];
        const earlyBet = this.earlyBet[betKey];

        if (this.roundTimeStore.roundTime > 0 && this.roundTimeStore.roundTime <= this.roundTimeStore.placingBet) {
            return betAccepted ? ButtonState.BET_ACCEPTED : ButtonState.PLACE_BET;
        }

        if (this.roundTimeStore.roundTime === 0 || this.roundTimeStore.roundTime > this.roundTimeStore.placingBet) {
            //flying and result
            if (betAccepted) {
                return !cashedOut ? ButtonState.CASH_OUT : ButtonState.BET_NEXT_ROUND;
            } else {
                return !earlyBet ? ButtonState.BET_NEXT_ROUND : ButtonState.CANCEL_BET;
            }
        }

        return ButtonState.PLACE_BET;
    }
}
