import gc from "@sg/game-client-base";
import { _decorator, CCInteger, instantiate, Node, Prefab, ScrollView, UITransform } from "cc";
import Observer from "observer";

import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BetHistoryRocketXModel, BetHistoryRocketXStore } from "../../handlers/crash-v2/bet/rocketx-bet-history-store";
import { BetHistoryRocketXHandlers } from "../../handlers/crash-v2/handlers/bet-history-handlers";
import ApiClient from "../api-client/api-client";
import TopWinsBodyItem from "./top-wins-body-item";

const apiClient = new ApiClient("https://l1-proxy3.lumigame.com");
const eventName = "getHistory";
const pageSize = 11;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { BetHistory } = gc;

@ccclass("TopWinsMonth")
export class TopWinsMonth extends ObserverComponent {
    @property({ type: Node })
    content: Node = null;

    @property({ type: Prefab })
    itemPrefab: Prefab = null;

    @property({ type: CCInteger })
    loadThreshold: number = 50;

    @property({ type: CCInteger })
    totalItems: number = 10;

    @property({ type: CCInteger })
    startYPosition: number = -50;

    @property({ type: CCInteger })
    itemHeight: number = 80;

    private currentPageIndex: number = 1;
    private currentIndex: number = 0;
    private isFetchingData: boolean = false;
    private isNodataToFetch: boolean = false;

    async fetchData1() {
        try {
            const response = await apiClient.get<ApiResponseItem[]>("/top-stats/monthly-top-results?gameId=113");
            //const data: ApiResponseItem[] = response.json();
            response.forEach((item) => {
                console.log(`ID: ${item.id}, Result: ${item.result}`);
                console.log(`Provably Fair - Round ID: ${item.provablyFair.roundId}`);
                console.log(`Server Seed Hash: ${item.provablyFair.serverSeedHash}`);
            });

            console.log("GET response data:", response);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    getHistoryItemComponent(node: Node) {
        return node.getComponent(TopWinsBodyItem);
    }

    buildBodyRow(
        bodyItemPrefab: Prefab,
        betHistoryLog: gc.BetHistory.BetHistoryLog,
        index: number,
        betKey: number,
        fractionalOddsFormat?: boolean
    ): Node {
        const bodyItem = instantiate(bodyItemPrefab);
        this.getHistoryItemComponent(bodyItem)?.setData({
            betHistoryLog,
            index,
            betKey,
            fractionalOddsFormat,
        });
        return bodyItem;
    }

    @handle(BetHistoryRocketXHandlers.BetHistoryRocketXCallServiceHandler, (handler, pageNumber: number) =>
        handler.getHistory(pageNumber, pageSize, eventName)
    )
    fetchData() {
        return this.currentPageIndex;
    }

    @render(BetHistoryRocketXStore, (store) => store.betHistoryRocketXModel, { fireImmediately: false })
    showBetHistory(betHistoryRocketXModel: BetHistoryRocketXModel) {
        betHistoryRocketXModel.betLogs.forEach((betLogItem, rowIndex) => {
            betLogItem.betLogDetails.forEach((betLogDetail) => {
                if (betLogDetail.action.toString() === gc.GameClientEmitMessage.Bet.eventName.toString()) {
                    let item = this.buildBodyRow(this.itemPrefab, betLogItem, rowIndex, Number(betLogDetail.betKey));
                    this.content.addChild(item);

                    let currentPosition = item.getPosition();
                    let y = this.startYPosition - this.currentIndex * this.itemHeight;
                    item.setPosition(currentPosition.x, y);
                    this.currentIndex++;
                }
            });
        });

        if (betHistoryRocketXModel.betLogs.length < pageSize) {
            this.isNodataToFetch = true;
        }

        this.content.getComponent(UITransform).height = this.currentIndex * this.itemHeight;
        this.isFetchingData = false;
    }

    onLoad() {
        this.fetchData1();
        this.itemHeight = this.itemPrefab.data.height;
        super.onLoad();
        this.fetchData();
        this.node.on(ScrollView.EventType.SCROLL_TO_BOTTOM, this.onScrolling, this);
    }

    onScrolling() {
        if (!this.isNodataToFetch) {
            this.currentPageIndex++;
            if (!this.isFetchingData) {
                this.fetchData();
                this.isFetchingData = true;
            }
        }
    }

    onDestroy() {
        if (this.node !== null) {
            this.node.on(ScrollView.EventType.SCROLL_TO_BOTTOM, this.onScrolling, this);
        }
    }
}

interface ProvablyFair {
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

interface ApiResponseItem {
    id: number;
    result: number;
    time: string;
    provablyFair: ProvablyFair;
}
