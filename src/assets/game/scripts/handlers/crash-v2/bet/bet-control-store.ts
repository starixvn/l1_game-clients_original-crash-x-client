import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

import gc from "@sg/game-client-base";
import { ButtonState, CrashCashOutData, IBetControl } from "../interfaces";

@injectable()
export class BetControlStore {
    @inject(gc.Rounds.RoundTimeStore) protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;
    @inject(gc.GameCrash.CrashMultiplier.MultiplierStore) protected readonly multiplierStore: gc.GameCrash.CrashMultiplier.MultiplierStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    controls: { [betKey: number]: IBetControl } = {
        0: {
            processing: false,
            betAccepted: false,
            earlyBet: false,
            betState: ButtonState.PLACE_BET,
            cashedOut: null,
            setting: {
                autoCashOut: false,
                autoBet: false,
                cashOutAt: 2.0,
                amount: 1,
            },
        },
        1: {
            processing: false,
            betAccepted: false,
            earlyBet: false,
            betState: ButtonState.PLACE_BET,
            cashedOut: null,
            setting: {
                autoCashOut: false,
                autoBet: false,
                cashOutAt: 5.0,
                amount: 2,
            },
        },
    };

    setProcessing(betKey: number, processing: boolean) {
        this.controls[betKey].processing = processing;
    }

    setAcceptedBet(betKey: number, accepted: boolean) {
        this.controls[betKey].betAccepted = accepted;
        this.setProcessing(betKey, false);
    }

    setCashedOut(cashedOut: CrashCashOutData) {
        //TODO:remove this after testing
        if (!cashedOut.betKey) {
            cashedOut.betKey = 0;
        }
        this.controls[cashedOut.betKey].cashedOut = cashedOut;
    }

    resetLastBet() {
        // Đặt lại tất cả các trạng thái về mặc định cho tất cả các betKey
        Object.keys(this.controls).forEach((key) => {
            const betKey = Number(key);
            this.controls[betKey].processing = false;
            this.controls[betKey].betAccepted = false;
            this.controls[betKey].cashedOut = null;
        });
    }

    toggleAutoBet(betKey: number) {
        this.controls[betKey].setting = {
            ...this.controls[betKey].setting,
            autoBet: !this.controls[betKey].setting.autoBet,
        };
    }

    toggleAutoCashOut(betKey: number) {
        this.controls[betKey].setting = {
            ...this.controls[betKey].setting,
            autoCashOut: !this.controls[betKey].setting.autoCashOut,
        };
    }

    setAutoBet(betKey: number, enabled: boolean) {
        this.controls[betKey].setting = {
            ...this.controls[betKey].setting,
            autoBet: enabled,
        };
    }

    setAutoCashOut(betKey: number, enabled: boolean) {
        this.controls[betKey].setting = {
            ...this.controls[betKey].setting,
            autoCashOut: enabled,
        };
    }

    setEarlyBet(betKey: number, earlyBet: boolean) {
        this.controls[betKey].earlyBet = earlyBet;
    }

    setCashOutMultiplier(betKey: number, multiplier: number) {
        this.controls[betKey].setting = {
            ...this.controls[betKey].setting,
            cashOutAt: multiplier,
        };
    }

    setBetAmount(betKey: number, amount: number) {
        this.controls[betKey].setting = {
            ...this.controls[betKey].setting,
            amount: amount,
        };
    }

    getBetSetting(betKey: number) {
        return this.controls[betKey].setting;
    }

    getBetState(betKey: number) {
        const betAccepted = this.controls[betKey].betAccepted;
        const cashedOut = this.controls[betKey].cashedOut;
        const earlyBet = this.controls[betKey].earlyBet;

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

    getBetAmount(betKey: number) {
        return this.controls[betKey].setting.amount;
    }

    getCashedOutValue(betKey: number) {
        const cashedOut = this.controls[betKey].cashedOut;
        const betAmount = this.getBetAmount(betKey);

        return cashedOut ? cashedOut.cashOutWin : betAmount * this.multiplierStore.multiplier;
    }

    isCashedOutAllBets() {
        const controls = Object.values(this.controls);
        const betCount = controls.filter((control) => control.betAccepted).length;
        const cashedOutCount = controls.filter((control) => control.cashedOut).length;
        return cashedOutCount === betCount;
    }
}
