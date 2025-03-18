import { _decorator, Component, Node, Toggle, ToggleContainer, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TopBoard')
export class TopBoard extends Component {
    @property({type: ToggleContainer})
    toggleGroup: ToggleContainer = null;
    
    @property({type: [Node]})
    tabButtons: Toggle[] = [];
    
    @property({type: [Node]})
    tabContents: Node[] = [];
    
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
            this.tabContents[i].active = (i === index); 
            this.tabButtons[i].getComponent(Sprite).enabled = (i === index);
        }
    }
}


