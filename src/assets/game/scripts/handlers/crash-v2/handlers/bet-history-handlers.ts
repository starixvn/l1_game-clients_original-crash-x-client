import gc from "@sg/game-client-base";
import inversify from "inversify";

import { IHandler } from "@sg/game-client-base/dist/shared";

import { BetHistoryRocketXModel, BetHistoryRocketXStore } from "../bet/rocketx-bet-history-store";

const { injectable, inject } = inversify;
const eventName = "getHistory";

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
    }

    @injectable()
    export class BetHistoryRocketXHandlers implements IHandler<BetHistoryRocketXModel> {
        name = eventName;
        @inject(BetHistoryRocketXStore) protected readonly betHistoryStore: BetHistoryRocketXStore;

        handle(data: BetHistoryRocketXModel) {
            this.betHistoryStore.setData(data);
        }
    }
}
