import gc from "@sg/game-client-base";
import inversify from "inversify";
import { BetControlStore } from "../bet/bet-control-store";
import { ICrashBetResponse } from "../interfaces";
const { injectable, inject } = inversify;

@injectable()
export class CrashBetResponseHandlers {
    eventHandleList = [
        {
            name: "endBet,betKey",
            handle: this.handleResponseByBetKey,
        },
    ];

    @inject(gc.Bet.BetStore) protected readonly betStore: gc.Bet.BetStore;
    @inject(BetControlStore) protected readonly betControlStore: BetControlStore;

    handleResponseByBetKey(data: ICrashBetResponse) {
        if (data.endBet > 0) {
            this.betStore.lastReceivedBet = { value: data.endBet, isAnimated: true };
            this.betControlStore.setAcceptedBet(data.betKey, data.endBet);
        }
    }
}
