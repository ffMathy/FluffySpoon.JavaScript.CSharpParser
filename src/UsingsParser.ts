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

        var statements = this.scopeHelper.getStatements(scope.prefix);
        for(var statement of statements) {
            var matches = this.regexHelper.getMatches(
                statement,
                new RegExp("^" + this.regexHelper.getUsingRegex(false, true, true) + "$", "g"));
            for (var match of matches) {
                try {
                    var using = <CSharpUsing>{
                        alias: match[0] || null,
                        namespace: new CSharpNamespace(match[1])
                    };

                    usings.push(using);
                } catch(ex) {
                    console.error("Skipping using due to parsing error.", statement, ex);
                    debugger;
                }
            }
        }

        return usings;
    }
}