import gc from "@sg/game-client-base";

export interface IBetControlSettings {
    autoCashOut: boolean;
    autoBet: boolean;
    cashOutAt: number;
    amount: number;
}

export class CrashCashOutData extends gc.GameCrash.GameCrashServiceMessage.CrashCashOut {
    betKey: number;
}

export class CrashOwnBets {
    [betKey: number]: gc.GameCrash.GameCrashServiceMessage.CrashOwnBets;
}

export const ButtonState = gc.GameCrash.ButtonState;
export interface ICrashBetResponse {
    endBet: number;
    betKey: number;
}

export interface IBetControl {
    processing: boolean;
    betAccepted: { value: number };
    earlyBet: boolean;
    betState: string;
    cashedOut: CrashCashOutData;
    setting: IBetControlSettings;
}
