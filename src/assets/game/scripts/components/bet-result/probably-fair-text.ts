import * as i18n from "db://i18n/LanguageData";

import { _decorator, Component, RichText } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass("ProbablyFairRichText")
@executeInEditMode
export class LocalizedRichText extends Component {
    richText: RichText | null = null;

    @property({ visible: false })
    key: string = "";

    @property({ displayName: "Key", visible: true })
    get _key() {
        return this.key;
    }
    set _key(str: string) {
        this.key = str;
        this.updateRichText();
    }

    onLoad() {
        if (!i18n.ready) {
            i18n.init("en");
        }
        this.fetchRender();
    }

    setKey(key: string) {
        this._key = key;
    }

    fetchRender() {
        let richText = this.getComponent("cc.RichText") as RichText;
        if (richText) {
            this.richText = richText;
            this.updateRichText();
            return;
        }
    }

    updateRichText() {
        try {
            let text = i18n.t(this.key);
            text = text.replace("{provablyFairIcon}", "<img src='icon-pf' width='30' height='30' vertical-align='middle'/>");
            this.richText && (this.richText.string = text);
        } catch (e) {
            console.log(e);
        }
    }
}
