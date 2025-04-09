import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { AudioIds } from "../../../audios/AudioIds";

const { ccclass, property } = _decorator;
const { handle } = Observer;

@ccclass("BetHistoryRocketXDialog")
export default class BetHistoryRocketXDialog extends ObserverComponent {
    @property({ type: Node })
    dialogContent: Node = null;

    @property({ type: Prefab })
    contentPrefab: Prefab = null;

    onLoad() {
        const content = instantiate(this.contentPrefab);
        this.dialogContent.addChild(content);   
        super.onLoad();
    }

    onDestroy() {
        this.playSFX(AudioIds.CLICK);
        super.onDestroy();
    }

    @handle(gc.Audios.AudioHandler, (handler, id: string) => handler.playSFX(id))
    playSFX(audioId: string) {
        return audioId;
    }
}
