import gc from "@sg/game-client-base";
import { _decorator, Button, CCInteger, instantiate, Node, Prefab, ScrollView, UITransform, Vec3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BetHistoryRocketXModel, BetHistoryRocketXStore } from "../../handlers/crash-v2/bet/rocketx-bet-history-store";
import { BetHistoryRocketXHandlers } from "../../handlers/crash-v2/handlers/bet-history-handlers";
import BetResultHistoryBodyItem from "./bet-result-history-body-item";

const eventName = "getHistory";
const pageSize = 11;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { BetHistory } = gc;

@ccclass("MyBetHistory")
export class MyBetHistory extends ObserverComponent {
    @property({ type: Node })
    content: Node = null;

    @property({ type: Prefab })
    itemPrefab: Prefab = null;

    @property({ type: Node })
    reachMaxWinNode: Node = null;

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

    getHistoryItemComponent(node: Node) {
        return node.getComponent(BetResultHistoryBodyItem);
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
        bodyItem.on("hover-trigger-parent", this.onHoverMaxReachTrigger, this);
        bodyItem.on("exit-hover-trigger-parent", this.onExitHoverMaxReachTrigger, this);
        return bodyItem;
    }

    onHoverMaxReachTrigger(childNode: Node) {
        let node = this.reachMaxWinNode.getComponent(Button);
        let position = childNode.getPosition();
        let positionY = this.content.getPosition().y + position.y - 40;
        node.node.setPosition(new Vec3(241, positionY, 0));
        node.node.active = true;
    }

    onExitHoverMaxReachTrigger() {
        let node = this.reachMaxWinNode.getComponent(Button);
        node.node.active = false;
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
