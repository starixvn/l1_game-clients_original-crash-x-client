import inversify from "inversify";
import { AutoCashOutStore } from "../bet/auto-cash-out-store";
import { BetControlStore } from "../bet/bet-control-store";

const { injectable, inject } = inversify;

@injectable()
export class AutoCashOutHandlers {
    @inject(BetControlStore) private readonly betControlStore: BetControlStore;
    @inject(AutoCashOutStore) private readonly autoCashOutStore: AutoCashOutStore;

    closeAutoCashOutPopup() {
        this.autoCashOutStore.enable = false;
    }

    openAutoCashOutPopup(betKey: number) {
        this.autoCashOutStore.currentBetKey = betKey;
        this.autoCashOutStore.enable = true;
    }

    handleMultiplier(multiplierString: string) {
        this.autoCashOutStore.multiplierString = multiplierString;
    }

    setMultiplierAutoCashOut(multiplier: number) {
        this.betControlStore.setCashOutMultiplier(this.autoCashOutStore.currentBetKey, multiplier);
        this.closeAutoCashOutPopup();
    }
}
