import { _decorator, Component, UITransform } from 'cc';
import { ClientSeedInfo } from 'db://shared-components/shared/common-components/provably-fair/client-seed-info';
const { ccclass, property } = _decorator;

@ccclass('resize_client_seed')
export class ResizeClientSeed extends Component {
    protected onLoad(){
        const clientSeedInfos = this.node.getComponentsInChildren(ClientSeedInfo);
        clientSeedInfos.forEach(info => {
            info.lblClientSeed.node.parent.active = false;
        });

        this.scheduleOnce(() => {
            const clientSeedInfos = this.node.getComponentsInChildren(ClientSeedInfo);
            let maxWidth = 0;
            clientSeedInfos.forEach(info => {
                const width = info.lblName.node.parent.getComponent(UITransform).width;
                maxWidth = Math.max(maxWidth, width);
            });

            clientSeedInfos.forEach((info, index) => {
                
                //35 + maxwidth
                //358 - 35 - maxwidth
                let width = (333 - 10 - maxWidth);
                info.lblClientSeed.node.parent.getComponent(UITransform).width = (width);
                info.nodeDisabledBg.getComponent(UITransform).width = (width);

                info.lblClientSeed.node.parent.setPosition(10 + maxWidth + width / 2, info.lblClientSeed.node.getPosition().y, 0);
                info.lblClientSeed.node.parent.active = true;
            });
        }, 0.1); 
    }
    
}


