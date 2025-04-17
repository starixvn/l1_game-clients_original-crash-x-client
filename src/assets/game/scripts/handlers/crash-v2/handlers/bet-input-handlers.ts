import inversify from "inversify";
import { BetControlStore } from "../bet/bet-control-store";
import { BetInputStore } from "../bet/bet-input-store";

const { injectable, inject } = inversify;

@injectable()
export class BetInputHandlers {
    @inject(BetControlStore) private readonly betControlStore: BetControlStore;
    @inject(BetInputStore) private readonly betInputStore: BetInputStore;

    closePopup() {
        this.betInputStore.enable = false;
    }

    openPopup(betKey: number) {
        this.betInputStore.currentBetKey = betKey;
        this.betInputStore.enable = true;
    }

    handleBetAmount(betAmountString: string) {
        this.betInputStore.betAmountString = betAmountString;
    }

    setBetAmount(betAmount: number) {
        this.betControlStore.setBetAmount(this.betInputStore.currentBetKey, betAmount);
    }
}
