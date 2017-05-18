import {
    CSharpProperty,
    CSharpType
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';

export class PropertyParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();

    constructor() {

    }

    parseProperties(content: string) {
        var properties = new Array<CSharpProperty>();
        var scopes = this.scopeHelper.getScopes(content);
        
        for (var scope of scopes) {
            var subScope = this.scopeHelper
                .getScopes(scope.content)
                .map(x => x.prefix)
                .join('');

            var matchCandidate = scope.prefix + subScope;
            var matches = this.regexHelper.getMatches(
                matchCandidate,
                /(\w+)\s+(\w+?)\s*{(?:(?:\s*\w+\s*)*(?:get|set){1}\s*(?:;|\{)\s*){0,2}/g);
            for (var match of matches) {
                var property = new CSharpProperty(match[1]);
                property.type = new CSharpType(match[0]);

                properties.push(property);
            }

        }

        return properties;
    }
}