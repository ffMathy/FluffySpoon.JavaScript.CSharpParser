import {
    CSharpType
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';

export class TypeParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();

    constructor() {

    }

	private getTypeNameFromGenericScopePrefix(prefix: string) {
		if (!prefix)
			return null;

        var result = prefix
            .substr(0, prefix.length - 1)
            .trim();
        if (result.indexOf(",") == 0) {
            result = result
                .substr(1)
                .trim();
        }

        return result;
    }

    private prepareTypeForGenericParameters(type: CSharpType, content: string) {
        type.genericParameters = this.parseTypesFromGenericParameters(content);
        if (type.genericParameters)
            type.name += "<>";
    }

    parseTypesFromGenericParameters(content: string): CSharpType[] {
        var result = new Array<CSharpType>();

        var scopes = this.scopeHelper.getGenericTypeScopes(content);
        for (var scope of scopes) {
            var type = <CSharpType>{};
            type.name = this.getTypeNameFromGenericScopePrefix(scope.prefix);

            if (!type.name)
                continue;

            this.prepareTypeForGenericParameters(
                type,
                scope.content);

            result.push(type);
        }

        return result.length === 0 ? null : result;
    }

    parseType(typeString: string): CSharpType {
        var matches = this.regexHelper.getMatches(
            typeString,
            /(\w+)(?:\s*<\s*(.+)\s*>)?/g);
        var match = matches[0];
        if (!match)
            return null;

        var type = <CSharpType>{
            name: match[0]
        };

        this.prepareTypeForGenericParameters(
            type,
            match[1]);

        return type;
    }
}