import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

import gc from "@sg/game-client-base";
import { ButtonState, CrashCashOutData, IBetControl } from "../interfaces";

@injectable()
export class BetControlStore {
    @inject(gc.Rounds.RoundTimeStore) protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;
    @inject(gc.GameCrash.CrashMultiplier.MultiplierStore) protected readonly multiplierStore: gc.GameCrash.CrashMultiplier.MultiplierStore;

    @inject(gc.GameConfigs.GameConfigStore) protected readonly gameConfigStore: gc.GameConfigs.GameConfigStore;
    @inject(gc.GameCrash.CrashGameConfigs.CrashGameConfigStore)
    protected readonly crashGameConfigStore: gc.GameCrash.CrashGameConfigs.CrashGameConfigStore;
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;

    @inject(gc.GameUserSettings.GameUserSettingStore) protected readonly gameUserSettingStore: gc.GameUserSettings.GameUserSettingStore;

    constructor() {
        mobx.makeAutoObservable(this);
        setTimeout(() => {
            this.onLoadStorage();

            mobx.reaction(
                () => this.gameConfigStore.chips,
                (chips) => {
                    this.inputValues = chips.map((chip) => +chip);

                    if (this.inputValues.length > 3) {
                        console.warn("Setting chips MUST equal 3");
                        this.inputValues = this.inputValues.slice(0, 3);
                    }
                }
            );

            mobx.reaction(
                () => this.gameUserSettingStore.permanentStorage,
                (trigger) => {
                    if (trigger?.action === gc.GameUserSettings.GameUserSettingAction.Save) {
                        this.onSaveStorage();
                    }
                }
            );
        }, 0);
    }

    controls: { [betKey: number]: IBetControl } = {
        0: {
            processing: false,
            betAccepted: null,
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
            betAccepted: null,
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

    inputValues: number[] = [];

    selectBetInput(betkey: number, index: number) {
        let value = 0;
        if (index < this.inputValues.length) {
            value = this.inputValues[index];
        } else {
            value = Math.min(this.maxBet, this.mainPlayerStore.balance);
        }

        this.setValidBetAmount(betkey, value);
    }

    get maxBet() {
        const betAmount = Object.values(this.controls).reduce((acc, control) => acc + (control?.betAccepted?.value ?? 0), 0);
        return this.gameConfigStore.maxBet - betAmount;
    }

    get minBet() {
        return this.gameConfigStore.minBet;
    }

    changeBetAmount(betkey: number, increase: boolean) {
        const amount = this.minBet * (increase ? 1 : -1);
        const currentAmount = this.getBetAmount(betkey);
        let newAmount = currentAmount + amount;
        this.setValidBetAmount(betkey, newAmount);
    }

    setValidBetAmount(betKey: number, amount: number) {
        let validAmount = Math.min(amount, this.maxBet);
        validAmount = Math.max(validAmount, this.minBet);
        this.setBetAmount(betKey, validAmount);
    }

    setValidCashOutAt(betKey: number, cashOutAt: number) {
        let validCashOutAt = Math.min(cashOutAt, this.crashGameConfigStore.maxMultiplier);
        validCashOutAt = Math.max(validCashOutAt, this.crashGameConfigStore.minMultiplier);
        this.setCashOutMultiplier(betKey, validCashOutAt);
    }

    setProcessing(betKey: number, processing: boolean) {
        this.controls[betKey].processing = processing;
    }

    setAcceptedBet(betKey: number, value: number) {
        this.controls[betKey].betAccepted = { value };
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
            this.controls[betKey].betAccepted = null;
            this.controls[betKey].cashedOut = null;
        });
    }

    toggleAutoBet(betKey: number) {
        this.controls[betKey].setting = {
            ...this.controls[betKey].setting,
            autoBet: !this.controls[betKey].setting.autoBet,
        };
        this.onSaveStorage();
    }

    toggleAutoCashOut(betKey: number) {
        this.controls[betKey].setting = {
            ...this.controls[betKey].setting,
            autoCashOut: !this.controls[betKey].setting.autoCashOut,
        };
        this.onSaveStorage();
    }

    setAutoBet(betKey: number, enabled: boolean) {
        this.controls[betKey].setting = {
            ...this.controls[betKey].setting,
            autoBet: enabled,
        };
        this.onSaveStorage();
    }

    setAutoCashOut(betKey: number, enabled: boolean) {
        this.controls[betKey].setting = {
            ...this.controls[betKey].setting,
            autoCashOut: enabled,
        };
        this.onSaveStorage();
    }

    setEarlyBet(betKey: number, earlyBet: boolean) {
        this.controls[betKey].earlyBet = earlyBet;
    }

    setCashOutMultiplier(betKey: number, multiplier: number) {
        this.controls[betKey].setting = {
            ...this.controls[betKey].setting,
            cashOutAt: multiplier,
        };
        this.onSaveStorage();
    }

    setBetAmount(betKey: number, amount: number) {
        this.controls[betKey].setting = {
            ...this.controls[betKey].setting,
            amount: amount,
        };
        this.onSaveStorage();
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

    onSaveStorage() {
        const settings = {};
        Object.values(this.controls).map((control, betKey) => (settings[betKey] = control.setting));
        gc.StorageManager.set(gc.localStorageKeys.permanentGameUserSetting, settings);
    }

    onLoadStorage() {
        const data = gc.StorageManager.get(gc.localStorageKeys.permanentGameUserSetting);

        if (data) {
            Object.values(data).forEach((setting, index) => {
                this.controls[index].setting = setting;
            });
        }
    }
}
