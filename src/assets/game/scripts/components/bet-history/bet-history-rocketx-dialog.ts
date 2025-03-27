import { _decorator, Component, instantiate, Node, Prefab } from "cc";

const { ccclass, property } = _decorator;

@ccclass("BetHistoryRocketXDialog")
export default class BetHistoryRocketXDialog extends Component {
    @property({ type: Node })
    dialogContent: Node = null;

    @property({ type: Prefab })
    contentPrefab: Prefab = null;

    onLoad() {
        const content = instantiate(this.contentPrefab);
        this.dialogContent.addChild(content);
    }
}
