import { _decorator, Component, instantiate, Node, Prefab, Sprite, Toggle, ToggleContainer } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TabsControl")
export class TabsControl extends Component {
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
                this.showTab(index);
            } else {
                this.hideTab(i);
            }
        }
    }

    showTab(index: number) {
        this.prefabInstances[index] = instantiate(this.prefabContents[index]);
        this.tabContents[index].addChild(this.prefabInstances[index]);
        this.extendShowTab(index);
    }

    extendShowTab(index: number) {}

    hideTab(index: number) {
        if (this.prefabInstances[index]) {
            this.prefabInstances[index].destroy();
            this.prefabInstances[index] = null;
        }
        this.extendHideTab(index);
    }

    extendHideTab(index: number) {}

    onDestroy() {
        let toggleGroup = this.toggleGroup;
        if (toggleGroup && toggleGroup.node) {
            let toggles = toggleGroup.getComponentsInChildren(Toggle);
            toggles.forEach((tabButton) => {
                tabButton.node.off(Toggle.EventType.CLICK, this.onTabChanged.bind, this);
            });
        }
    }
}
