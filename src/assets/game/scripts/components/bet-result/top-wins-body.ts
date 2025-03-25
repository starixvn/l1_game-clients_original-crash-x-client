import { _decorator, instantiate, Node, Prefab, UITransform } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { TopResultClient, TopWinItem } from "../api-client/top-result-client";
import TopWinsBodyItem from "./top-wins-body-item";

const { ccclass, property } = _decorator;

@ccclass("TopWinsBody")
export class TopWinsBody extends ObserverComponent {
    @property({ type: Node })
    content: Node = null;

    @property({ type: Prefab })
    itemPrefab: Prefab = null;

    private currentIndex: number = 0;
    private itemHeight: number = 0;
    protected topResultClient: TopResultClient = new TopResultClient();

    async fetchData() {
        let topWinItems: TopWinItem[] = [];
        return topWinItems;
    }

    async bindContent() {
        let topWinItems = await this.fetchData();
        topWinItems.forEach((data, rowIndex) => {
            let item = this.buildBodyRow(this.itemPrefab, rowIndex, data);
            this.content.addChild(item);

            let currentPosition = item.getPosition();
            let y = this.itemHeight / 2 - this.currentIndex * this.itemHeight;
            item.setPosition(currentPosition.x, y);
            this.currentIndex++;
        });

        this.content.getComponent(UITransform).height = this.currentIndex * this.itemHeight;
    }

    getHistoryItemComponent(node: Node) {
        return node.getComponent(TopWinsBodyItem);
    }

    buildBodyRow(bodyItemPrefab: Prefab, index: number, data: TopWinItem): Node {
        const bodyItem = instantiate(bodyItemPrefab);
        this.getHistoryItemComponent(bodyItem)?.setData(index, data);
        return bodyItem;
    }

    onLoad() {
        this.itemHeight = this.itemPrefab.data.height;
        super.onLoad();
        this.bindContent();
    }
}
