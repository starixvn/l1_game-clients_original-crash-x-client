import gc from "@sg/game-client-base";
import { siteConfigs } from "db://assets/scripts/site-configs";
import { settings } from "../../game-settings";
import ApiClient from "../api-client/api-client";
import { ApiPath } from "./api-urls-constants";

const { UrlUtils } = gc;

export class TopResultClient {
    private apiClient: ApiClient;

    constructor() {
        let baseURL = UrlUtils.buildUrl("http", "/", siteConfigs);
        this.apiClient = new ApiClient(baseURL);
    }

    async getTopCrashMonthly() {
        let response = await this.apiClient.get<TopCrashItem[]>(ApiPath.monthlyTopCrash + settings.id);
        return response;
    }

    async getTopCrashYearly() {
        let response = await this.apiClient.get<TopCrashItem[]>(ApiPath.yearlyTopCrash + settings.id);
        return response;
    }

    async getTopWinMonthly() {
        let response = await this.apiClient.get<TopWinItem[]>(ApiPath.monthlyTopWin + settings.id);
        return response;
    }

    async getTopWinYearly() {
        let response = await this.apiClient.get<TopWinItem[]>(ApiPath.yearlyTopWin + settings.id);
        return response;
    }
}

export interface ProvablyFair {
    clientSeeds: string[];
    time: string;
    roundId: number;
    serverSeedHash: string;
    serverSeed: string;
    __v: number;
    finalHash: string;
    mergeClientSeed: string;
    mergeSeed: string;
}

export interface TopCrashItem {
    id: number;
    result: number;
    time: string;
    provablyFair: ProvablyFair;
}

export interface TopWinItem {
    cashoutPoint: number;
    crashPoint: number;
    uid: string;
    name: string;
    operatorId: string;
    currency: string;
    time: string;
    roundId: number;
}
