import gc from "@sg/game-client-base";
import inversify from "inversify";
import { TopCrashItem, TopResultClient } from "../../../handlers/api-client/top-result-client";
import { PeriodType } from "../../api-client/api-settings";
import { TopCrashStore } from "../bet/top-crash-store";

const { injectable, inject } = inversify;

@injectable()
export class TopCrashHandlers {
    @inject(TopResultClient) protected readonly topResultClient: TopResultClient;
    @inject(TopCrashStore) protected readonly topCrashStore: TopCrashStore;
    @inject(gc.GameCrash.ProvablyFair.ProvablyFairStore) protected readonly provablyFairStore: gc.GameCrash.ProvablyFair.ProvablyFairStore;
    @inject(gc.RoundPF.RoundPFHandler) protected readonly roundPFHandler: gc.RoundPF.RoundPFHandler;
    @inject(gc.RoundPF.RoundPFStore) protected readonly roundPFStore: gc.RoundPF.RoundPFStore;

    async getTopCrashByType(type: number) {
        let topCrashItems: TopCrashItem[] = [];
        if(type === PeriodType.Monthly) {
            topCrashItems = await this.topResultClient.getTopCrashMonthly();
            
        } else if(type === PeriodType.Yearly) {
            topCrashItems = await this.topResultClient.getTopCrashYearly();
        }
        this.topCrashStore.topCrashItems = topCrashItems;
        return topCrashItems;
    }

    openVerificationHistory(roundId: number) {
        this.roundPFHandler.requestForCurrentRound = false;
        const roundPFResult = this.getRoundPF(roundId);
        this.roundPFStore.pf = roundPFResult;
        this.provablyFairStore.openVerification = { mode: gc.GameCrash.ProvablyFair.VerificationMode.History, roundId };
    }

    getRoundPF(roundId: number) {
        const topCrashItem = this.topCrashStore.getTopCrashItemByRoundId(roundId);
        
        var roundPfResult: gc.GameServiceMessage.RoundPFResult = {
            roundId: topCrashItem.provablyFair?.roundId,
            serverSeedHash: topCrashItem.provablyFair?.serverSeedHash,
            serverSeed: topCrashItem.provablyFair?.serverSeed,
            clientSeeds: topCrashItem.provablyFair?.clientSeeds?.map(clientSeed => ({
                nickname: clientSeed?.name,
                ...clientSeed
            })),
            mergeClientSeed: topCrashItem.provablyFair?.mergeClientSeed,
            mergeSeed: topCrashItem.provablyFair?.mergeSeed,
            finalHash: topCrashItem.provablyFair?.finalHash,
            result: topCrashItem.result,
        }

        return roundPfResult;
    }
}
