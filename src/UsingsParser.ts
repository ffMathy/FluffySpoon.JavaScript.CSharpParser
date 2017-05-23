import {
    CSharpUsing,
    CSharpNamespace
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';

export class UsingsParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();

    constructor() {

    }

    parseUsings(content: string) {
        var usings = new Array<CSharpUsing>();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        var scope = scopes[0];
        if (!scope)
            return usings;

        var matches = this.regexHelper.getMatches(
            scope.prefix,
            /using\s+(?:(\w+?)\s*=)?\s*([.\w]+?)\s*;/g);
        for (var match of matches) {
            var using = <CSharpUsing>{
                alias: match[0],
                namespace: new CSharpNamespace(match[1])
            };

            usings.push(using);
        }

        return usings;
    }
}