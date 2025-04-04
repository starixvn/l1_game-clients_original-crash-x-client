import gc from "@sg/game-client-base";
import { _decorator, Button, instantiate, Node, Prefab, ScrollView, UITransform, Vec3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BetHistoryRocketXModel, BetHistoryRocketXStore } from "../../handlers/crash-v2/bet/rocketx-bet-history-store";
import { BetHistoryRocketXHandlers, HistoryConstants } from "../../handlers/crash-v2/handlers/bet-history-handlers";
import BetResultHistoryBodyItem from "./bet-history-rocketx-table-body-row";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass("BetHistoryRocketXTableBody")
export class BetHistoryRocketXTableBody extends ObserverComponent {
    @property({ type: Node })
    content: Node = null;

    @property({ type: Prefab })
    itemPrefab: Prefab = null;

    @property({ type: Node })
    reachMaxWinNode: Node = null;

    protected startYPosition: number;
    protected itemHeight: number;
    private tooltipPositionX: number = 230;
    private tooltipPositionYBuffer: number = 48;
    protected currentPageIndex: number = 1;
    protected currentIndex: number = 0;
    protected isFetchingData: boolean = false;
    protected isNodataToFetch: boolean = false;
    private pageSize;

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
        bodyItem.on(HistoryConstants.hoverTriggerParent, this.onHoverMaxReachTrigger, this);
        bodyItem.on(HistoryConstants.exitHoverTriggerParent, this.onExitHoverMaxReachTrigger, this);
        return bodyItem;
    }

    onHoverMaxReachTrigger(childNode: Node) {
        let node = this.reachMaxWinNode.getComponent(Button);
        let position = childNode.getPosition();
        let positionY = this.content.getPosition().y + position.y - this.tooltipPositionYBuffer;
        node.node.setPosition(new Vec3(this.tooltipPositionX, positionY, 0));
        node.node.active = true;
    }

    onExitHoverMaxReachTrigger() {
        let node = this.reachMaxWinNode.getComponent(Button);
        node.node.active = false;
    }

    @handle(BetHistoryRocketXHandlers.BetHistoryRocketXCallServiceHandler, (handler, pageNumber: number) =>
        handler.getHistory(pageNumber, HistoryConstants.pageSizeHistory, HistoryConstants.history)
    )
    fetchData() {
        return this.currentPageIndex;
    }

    @render(BetHistoryRocketXStore, (store) => store.betHistoryRocketXModel, { fireImmediately: false })
    showBetHistory(betHistoryRocketXModel: BetHistoryRocketXModel) {
        this.renderData(betHistoryRocketXModel);
    }

    renderData(betHistoryRocketXModel: BetHistoryRocketXModel) {
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

        if (betHistoryRocketXModel.betLogs.length < this.pageSize) {
            this.isNodataToFetch = true;
        }

        this.content.getComponent(UITransform).height = this.currentIndex * this.itemHeight;
        this.isFetchingData = false;
    }

    onLoad() {
        this.pageSize = HistoryConstants.pageSizeHistory;
        this.itemHeight = this.itemPrefab.data.getComponent(UITransform).height;
        this.startYPosition = -this.itemHeight / 2;
        super.onLoad();
        this.fetchData();
        this.node.on(ScrollView.EventType.SCROLL_TO_BOTTOM, this.onScrolling, this);
    }

    onScrolling() {
        if (!this.isNodataToFetch) {
            this.currentPageIndex++;
            if (!this.isFetchingData) {
                this.isFetchingData = true;
                this.fetchData();
            }
        }
    }

    onDestroy() {
        if (this.node !== null) {
            this.node.on(ScrollView.EventType.SCROLL_TO_BOTTOM, this.onScrolling, this);
        }
    }
}
