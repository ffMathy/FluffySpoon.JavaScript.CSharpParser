import {
    CSharpMethod,
    CSharpType,
    CSharpMethodParameter
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { NamespaceParser } from './NamespaceParser';

export class MethodParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();

    constructor() {

    }

    public parseMethods(content: string) {
        var methods = new Array<CSharpMethod>();
        var scopes = this.scopeHelper.getScopes(content);
        for (var scope of scopes) {
            var matches = this.regexHelper.getMatches(
                scope.prefix,
                /(\w+?)?\s+(\w+?)\s*\((.*?)\)\s*{/g);
            for (var match of matches) {
                var method = new CSharpMethod(match[1]);
                method.innerScopeText = scope.content;

                method.returnType = new CSharpType(match[0] || "void");
                method.isExplicitImplementation = method.name.indexOf('.') > -1;

                var parameters = this.parseMethodParameters(match[2]);
                for (var parameter of parameters) {
                    method.parameters.push(parameter);
                }

                var subMethods = this.parseMethods(scope.content);
                for (var subMethod of subMethods) {
                    subMethod.parent = method;
                    method.methods.push(subMethod);
                }

                methods.push(method);
            }
        }

        return methods;
    }

    public parseMethodParameters(content: string): CSharpMethodParameter[] {
        var result = new Array<CSharpMethodParameter>();

        var argumentRegions = content
            .split(',')
            .map(x => x.trim());
        for (var argumentRegion of argumentRegions) {
            var matches = this.regexHelper.getMatches(
                argumentRegion,
                /(\w+)\s+(\w+)(?:\s*=\s*(.+))?/g);
            for (var match of matches) {
                result.push({
                    type: new CSharpType(match[0]),
                    name: match[1],
                    defaultValue: match[2]
                });
            }
        }

        return result;
    }
}