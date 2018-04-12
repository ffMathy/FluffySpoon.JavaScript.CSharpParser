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

        var splits = this.scopeHelper.getScopedList(";", scope.prefix);
        for(var split of splits) {
            var matches = this.regexHelper.getMatches(
                split,
                new RegExp("^" + this.regexHelper.getUsingRegex(false, true, true) + "$", "g"));
            for (var match of matches) {
                var using = <CSharpUsing>{
                    alias: match[0] || null,
                    namespace: new CSharpNamespace(match[1])
                };

                usings.push(using);
            }
        }

        return usings;
    }
}