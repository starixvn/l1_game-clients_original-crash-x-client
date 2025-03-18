import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

export type DynamicObject<T> = {
    [key: string]: T;
};

export type BetHistoryLog = {
    time: string;
    roundId: number;
    win: number;
    betwin: number;
    totalAmount: number;
    freeBet: boolean;
    winLoss?: number;
    odds: DynamicObject<number>;
    result: DynamicObject<object>;
    settlementResult: DynamicObject<boolean>;
    betLogDetails?: Array<DynamicObject<object>>;
    verifiable?: boolean;
};

export type BetHistoryRocketXModel = {
    page: number;
    pageSize: number;
    total: number;
    betLogs: Array<BetHistoryLog>;
    fractionalOddsFormat?: boolean;
};

@injectable()
export class BetHistoryRocketXStore {
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    betHistoryRocketXModel: BetHistoryRocketXModel = null;

    setData(betHistoryRocketXModel: BetHistoryRocketXModel) {
        betHistoryRocketXModel.fractionalOddsFormat = this.mainPlayerStore?.fractionalOddsFormat;
        this.betHistoryRocketXModel = betHistoryRocketXModel;
    }
}
