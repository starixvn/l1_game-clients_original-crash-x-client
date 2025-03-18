import gc from "@sg/game-client-base";
import { _decorator, CCInteger, instantiate, Node, Prefab, UITransform } from "cc";
import Observer from "observer";

import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BetHistoryRocketXModel, BetHistoryRocketXStore } from "../../handlers/crash-v2/bet/rocketx-bet-history-store";
import { BetHistoryRocketXHandlers } from "../../handlers/crash-v2/handlers/bet-history-handlers";
import BetResultHistoryBodyItem from "./bet-result-history-body-item";

const eventName = "getHistory";
const pageSize = 10;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { BetHistory } = gc;

@ccclass("MyBetHistory")
export class MyBetHistory extends ObserverComponent {
    @property({ type: Node })
    content: Node = null;

    @property({ type: Prefab })
    itemPrefab: Prefab = null;

    @property({ type: CCInteger })
    loadThreshold: number = 50;

    @property({ type: CCInteger })
    totalItems: number = 100;

    @property({ type: CCInteger })
    startYPosition: number = -50;

    @property({ type: CCInteger })
    itemHeight: number = 100;

    private stepItems: number = 20;
    private currentPageIndex: number = 1;

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
        return bodyItem;
    }

    @handle(
        BetHistoryRocketXHandlers.BetHistoryRocketXCallServiceHandler,
        (handler, pageNumber: number, responseKey: string, pageSize: number) => handler.getHistory(pageNumber, pageSize, eventName)
    )
    fetchData() {
        return this.currentPageIndex;
    }

    @render(BetHistoryRocketXStore, (store) => store.betHistoryRocketXModel, { fireImmediately: false })
    showBetHistory(betHistoryRocketXModel: BetHistoryRocketXModel) {
        let index = 0;
        betHistoryRocketXModel.betLogs.forEach((betLogItem, rowIndex) => {
            betLogItem.betLogDetails.forEach((betLogDetail) => {
                if (betLogDetail.action.toString() === gc.GameClientEmitMessage.Bet.eventName.toString()) {
                    let item = this.buildBodyRow(this.itemPrefab, betLogItem, rowIndex, Number(betLogDetail.betKey));
                    this.content.addChild(item);

                    let currentPosition = item.getPosition();
                    let y = this.startYPosition - ((this.currentPageIndex - 1) * pageSize + index) * this.itemHeight;

                    item.setPosition(currentPosition.x, y);
                    index++;
                }
            });
        });
    }

    onLoad() {
        this.itemHeight = this.itemPrefab.data.height;
        this.content.getComponent(UITransform).height = this.totalItems * this.itemHeight;
        super.onLoad();
        this.fetchData();
        this.node.on("scrolling", this.onScrolling, this);
    }

    onScrolling(event) {
        const contentY = event.content.getPosition().y;
        const scrollPosition = this.content.position;

        // Check if we've reached the threshold at the bottom of the scroll view

        if (contentY <= -this.loadThreshold) {
            this.addItemsToTop(); // Add items to the top when we reach the bottom
        }
        // Check if we've reached the threshold at the top of the scroll view
        else if (contentY >= this.content.getComponent(UITransform).height - 180) {
            //else if (contentY >= this.content.getComponent(UITransform).height - window.innerHeight + this.loadThreshold) {
            // this.addItemsToBottom(); // Add items to the bottom when we reach the top

            this.currentPageIndex++;
            this.fetchData();
        }
    }

    addItemsToTop() {
        console.log("addItemsToTop");
        /*
        let firstItem = this.items[0];
        this.items.shift(); // Remove the first item from the array

        // Move the first item to the bottom
        firstItem.y = this.items[this.items.length - 1].y - this.itemHeight;
        this.items.push(firstItem); // Add it back at the end of the array

        // Optionally, update the label or content here
        firstItem.getComponentInChildren(cc.Label).string = `Item ${this.items.length + 1}`;*/
    }
}
