import gc from "@sg/game-client-base";
import inversify from "inversify";

import { IHandler } from "@sg/game-client-base/dist/shared";

import { BetHistoryRocketXModel, BetHistoryRocketXStore, MyBetModel, MyBetStore } from "../bet/rocketx-bet-history-store";

const { injectable, inject } = inversify;

export class HistoryConstants {
    static mybet = "mybet";
    static history = "history";
    static pageSizeHistory = 20;
    static pageSizeMyHistory = 11;
}

export namespace BetHistoryRocketXHandlers {
    @injectable()
    export class BetHistoryRocketXCallServiceHandler implements IHandler<number> {
        @inject(gc.Connection.ConnectionStore) protected readonly connectionStore: gc.Connection.ConnectionStore;

        handle(page = 1) {
            this.connectionStore.send(gc.GameClientEmitMessage.BetHistory.eventName, { page });
        }

        getHistory(page: number, pageSize: number, responseKey: string) {
            this.connectionStore.send(gc.GameClientEmitMessage.BetHistory.eventName, { page, pageSize, responseKey });
        }

        getMyHistory(page: number, pageSize: number, responseKey: string) {
            this.connectionStore.send(gc.GameClientEmitMessage.BetHistory.eventName, { page, pageSize, responseKey });
        }
    }

    @injectable()
    export class BetHistoryRocketXHandlers implements IHandler<BetHistoryRocketXModel> {
        name = HistoryConstants.history;
        @inject(BetHistoryRocketXStore) protected readonly betHistoryStore: BetHistoryRocketXStore;

        handle(data: BetHistoryRocketXModel) {
            this.betHistoryStore.setData(data);
        }
    }

    @injectable()
    export class MyBetRocketXHandlers implements IHandler<MyBetModel> {
        name = HistoryConstants.mybet;
        @inject(MyBetStore) protected readonly myBetStore: MyBetStore;

        handle(data: MyBetModel) {
            this.myBetStore.setData(data);
        }
    }
}
