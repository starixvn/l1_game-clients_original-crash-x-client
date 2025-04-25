import gc from "@sg/game-client-base";
import { ILastReceivedBet } from "@sg/game-client-base/dist/game/bets";
import inversify from "inversify";
const { injectable, inject } = inversify;

@injectable()
export class CrashBetListHandlers extends gc.GameCrash.CrashBetList.CrashBetListHandlers {
    eventHandleList = [];

    override reactionStartRound(isStartRound: boolean) {}

    override reactionLastReceivedBet(lastReceivedBet: ILastReceivedBet) {}

    override reactionHalfCashOut(halfCashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {}

    override reactionCashOut(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {}
}
