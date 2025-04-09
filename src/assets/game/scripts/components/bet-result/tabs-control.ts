import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab, Sprite, Toggle, ToggleContainer } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { AudioIds } from "../../../audios/AudioIds";
const { ccclass, property } = _decorator;
const { handle } = Observer;

@ccclass("TabsControl")
export class TabsControl extends ObserverComponent {
    @property({ type: ToggleContainer })
    toggleGroup: ToggleContainer = null;

    @property({ type: [Node] })
    tabButtons: Toggle[] = [];

    @property({ type: [Node] })
    tabContents: Node[] = [];

    @property({ type: [Prefab] })
    prefabContents: Prefab[] = [];

    private prefabInstances: Node[] = [];
    private currentTabIndex: number = -1;

    onLoad() {
        let toggles = this.toggleGroup.getComponentsInChildren(Toggle);
        toggles.forEach((tabButton, index) => {
            tabButton.node.on(Toggle.EventType.CLICK, this.onTabChanged.bind(this, index));
            if (index === 0) {
                tabButton.isChecked = true;
            }
        });

        this.onTabChanged(0);
        super.onLoad();
    }

    onTabChanged(index) {
        if (index !== this.currentTabIndex) {
            this.playSFX(AudioIds.CLICK);
            this.currentTabIndex = index;
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
    }

    @handle(gc.Audios.AudioHandler, (handler, id: string) => handler.playSFX(id))
    playSFX(audioId: string) {
        return audioId;
    }

    showTab(index: number) {
        this.prefabInstances[index] = instantiate(this.prefabContents[index]);
        this.tabContents[index].addChild(this.prefabInstances[index]);
        this.extendShowTab(index);
    }

    extendShowTab(index: number) {}

    hideTab(index: number) {
        if (this.prefabInstances[index]) {
            this.tabContents[index].removeAllChildren();
            // this.prefabInstances[index].destroy();
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
