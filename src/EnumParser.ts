import {
    CSharpEnum,
    CSharpEnumOption
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';

export class EnumParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();

    constructor() {

    }

    public parseEnums(content: string) {
        var enums = new Array<CSharpEnum>();
        var scopes = this.scopeHelper.getScopes(content);
        var scope = scopes[0];
        if (!scope)
            return enums;

        var matches = this.regexHelper.getMatches(
            scope.prefix,
            /enum\s+(\w+?)\s*{/g);
        for (var match of matches) {
            var enumObject = new CSharpEnum(match[0]);
            enumObject.options = this.parseEnumValues(scope.content);

            enums.push(enumObject);
        }

        return enums;
    }

    public parseEnumValues(content: string) {
        var result = new Array<CSharpEnumOption>();

        var nextValue = 0;

        var argumentRegions = content
            .split(',')
            .map(x => x.trim());
        for (var argumentRegion of argumentRegions) {
            var matches = this.regexHelper.getMatches(
                argumentRegion,
                /(\w+)(?:\s*=\s*(\-*\d+))?/g);

            for (var match of matches) {
                var option = new CSharpEnumOption(match[0]);
                if (match[1]) {
                    option.value = parseInt(match[1]);
                    nextValue = option.value + 1;
                } else {
                    option.value = nextValue;
                    nextValue++;
                }

                result.push(option);
            }
        }

        return result;
    }
}