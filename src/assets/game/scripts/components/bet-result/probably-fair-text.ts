import * as i18n from "db://i18n/LanguageData";

import { _decorator, Component, RichText } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass("ProbablyFairRichText")
@executeInEditMode
export class ProbablyFairRichText extends Component {
    richText: RichText | null = null;

    @property({ visible: false })
    key = "";

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
        const richText = this.getComponent(RichText);
        if (richText) {
            this.richText = richText;
            this.updateRichText();
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
