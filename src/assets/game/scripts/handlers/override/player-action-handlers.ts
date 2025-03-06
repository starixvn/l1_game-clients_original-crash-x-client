import gc from "@sg/game-client-base";
import inversify from "inversify";
const { injectable, inject } = inversify;

@injectable()
export class PlayerActionHandlers extends gc.GameCrash.PlayerActions.PlayerActionHandlers {
    handle(flag: boolean) {}

    changeButtonBetNextRound() {}

    handleEndShowCashOutNotice(flag: boolean) {}

    changeButtonState(state: string) {}

    handleReceivedBet(lastReceivedBet: any) {}

    handleFlyingTime(roundTime: number) {}

    handlePlacingBet(isPlacingBet: boolean) {}

    handleShowingResult(showingResult: boolean) {}
}
