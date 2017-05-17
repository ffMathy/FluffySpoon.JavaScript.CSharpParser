import {
    CSharpNamespace
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { UsingsParser } from './UsingsParser';

export class NamespaceParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();
    private usingsParser = new UsingsParser();

    constructor() {
        
    }

    public parseNamespaces(content: string) {
        var namespaces = new Array<CSharpNamespace>();
        var scopes = this.scopeHelper.getScopes(content);
        for (var scope of scopes) {
            var matches = this.regexHelper.getMatches(
                scope.prefix, 
                /namespace\s+([\.\w]+?)\s*{/g);
            for (var match of matches) {
                var namespace = new CSharpNamespace(match[0]);

                var usings = this.usingsParser.parseUsings(scope.content);
                for (var using of usings) {
                    using.parent = namespace;
                    namespace.usings.push(using);
                }
                
                var subNamespaces = this.parseNamespaces(scope.content);
                for (var subNamespace of subNamespaces) {
                    subNamespace.parent = namespace;
                    namespace.namespaces.push(subNamespace);
                }

                namespaces.push(namespace);
            }
        }

        return namespaces;
    }
}