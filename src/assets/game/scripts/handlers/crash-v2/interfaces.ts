import gc from "@sg/game-client-base";

export interface IBetControlSettings {
    isAuto: boolean;
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
