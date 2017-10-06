import {
    CSharpEnum,
    CSharpEnumOption
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { AttributeParser } from './AttributeParser';
import { TypeParser } from './TypeParser';

export class EnumParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();
    private attributeParser = new AttributeParser();

    constructor(
        private typeParser: TypeParser) {

    }

    public parseEnums(content: string) {
        var enums = new Array<CSharpEnum>();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var scope of scopes) {
            var matches = this.regexHelper.getMatches(
                scope.prefix,
                /\s*((?:\[.*\]\s*?)*)?\s*((?:\w+\s)*)enum\s+(\w+?)(?:\s*:\s*([\.\w]+?))?\s*{/g);
            for (var match of matches) {
                var enumObject = new CSharpEnum(match[2]);
				enumObject.isPublic = (match[1] || "").indexOf("public") > -1;
                enumObject.attributes = this.attributeParser.parseAttributes(match[0]);
                enumObject.options = this.parseEnumValues(scope.content);
                enumObject.inheritsFrom = this.typeParser.parseType(match[3]);

                enums.push(enumObject);
            }
        }

        return enums;
    }

    public parseEnumValues(content: string) {
        var result = new Array<CSharpEnumOption>();

        var nextValue = 0;

        var matches = this.regexHelper.getMatches(
            content,
            /\s*((?:\[.*\]\s*?)*)?\s*(\w+)(?:\s*=\s*(\-*\d+))?/g);
        
        for (var match of matches) {
            var option = new CSharpEnumOption(match[1]);
            option.attributes = this.attributeParser.parseAttributes(match[0]);

            if (match[2]) {
                option.value = parseInt(match[2]);
                nextValue = option.value + 1;
            } else {
                option.value = nextValue;
                nextValue++;
            }

            result.push(option);
        }

        return result;
    }
}