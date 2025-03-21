import { _decorator, instantiate, Node, Prefab, UITransform } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { TopCrashItem, TopResultClient } from "../api-client/top-result-client";
import TopDrashesBodyItem from "./top-crashes-body-item";

const { ccclass, property } = _decorator;

@ccclass("TopDrashesBody")
export class TopDrashesBody extends ObserverComponent {
    @property({ type: Node })
    content: Node = null;

    @property({ type: Prefab })
    itemPrefab: Prefab = null;

    private currentIndex: number = 0;
    private itemHeight: number = 0;
    protected topResultClient: TopResultClient = new TopResultClient();

    async fetchData() {
        let topCrashItems: TopCrashItem[] = [];
        return topCrashItems;
    }

    async bindContent() {
        let topCrashItems = await this.fetchData();
        topCrashItems.forEach((data, rowIndex) => {
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
        return node.getComponent(TopDrashesBodyItem);
    }

    buildBodyRow(bodyItemPrefab: Prefab, index: number, data: TopCrashItem): Node {
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
