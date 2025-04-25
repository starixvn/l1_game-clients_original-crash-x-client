import gc from "@sg/game-client-base";
import inversify from "inversify";
const { injectable, inject } = inversify;

@injectable()
export class CrashBetListHandlers extends gc.GameCrash.CrashBetList.CrashBetListHandlers {
    eventHandleList = [];

    override reactionStartRound(isStartRound: boolean) {}

    override reactionLastReceivedBet(lastReceivedBet: gc.Bet.ILastReceivedBet) {}

    override reactionHalfCashOut(halfCashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {}

    override reactionCashOut(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {}
}
