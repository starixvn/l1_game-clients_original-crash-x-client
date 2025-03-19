import { _decorator, Color, Component, instantiate, Label, Node, Prefab, Sprite, Toggle, ToggleContainer } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BetResultContainer")
export class BetResultContainer extends Component {
    @property({ type: ToggleContainer })
    toggleGroup: ToggleContainer = null;

    @property({ type: [Node] })
    tabButtons: Toggle[] = [];

    @property({ type: [Node] })
    tabContents: Node[] = [];

    @property({ type: [Prefab] })
    prefabContents: Prefab[] = [];

    private prefabInstances: Node[] = [];

    onLoad() {
        let toggles = this.toggleGroup.getComponentsInChildren(Toggle);
        toggles.forEach((tabButton, index) => {
            tabButton.node.on(Toggle.EventType.CLICK, this.onTabChanged.bind(this, index));
            if (index === 0) {
                tabButton.isChecked = true;
            }
        });

        this.onTabChanged(0);
    }

    onTabChanged(index) {
        for (let i = 0; i < this.tabContents.length; i++) {
            this.tabContents[i].active = i === index;
            this.tabButtons[i].getComponent(Sprite).enabled = i === index;
            if (i === index) {
                this.prefabInstances[i] = instantiate(this.prefabContents[i]);
                this.tabContents[i].addChild(this.prefabInstances[i]);
                this.tabButtons[i].getComponentInChildren(Label).color = new Color().fromHEX("30df0a");
            } else {
                if (this.prefabInstances[i]) {
                    this.prefabInstances[i].destroy();
                    this.prefabInstances[i] = null;
                    this.tabButtons[i].getComponentInChildren(Label).color = new Color().fromHEX("E6E5DF");
                }
            }
        }
    }

    onDestroy() {
        let toggles = this.toggleGroup.getComponentsInChildren(Toggle);
        toggles.forEach((tabButton) => {
            tabButton.node.off(Toggle.EventType.CLICK, this.onTabChanged.bind, this);
        });
    }
}
