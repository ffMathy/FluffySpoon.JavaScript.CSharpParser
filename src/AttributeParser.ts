import {
    CSharpAttribute
} from './Models';

import { RegExHelper } from './RegExHelper';

export class AttributeParser {
    private regexHelper = new RegExHelper();

    constructor() {

    }

    parseAttributes(content: string) {
        var attributes = new Array<CSharpAttribute>();

        if(content) {
            var matches = this.regexHelper.getMatches(
                content,
                /(\w+)\s*(?:\((?:.|\s)+?\))?/g);
            for (var match of matches) {
                var attribute = new CSharpAttribute(match[0]);
                attributes.push(attribute);
            }
        }

        return attributes;
    }
}