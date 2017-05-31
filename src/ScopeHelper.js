"use strict";
var ScopeHelper = (function () {
    function ScopeHelper() {
    }
    ScopeHelper.prototype.getCurlyScopes = function (content) {
        return this.getScopes(content, "{", "}");
    };
    ScopeHelper.prototype.getGenericTypeScopes = function (content) {
        var scopes = this.getScopes(content, "<", ">");
        if (scopes.length > 0 && scopes[scopes.length - 1].prefix.trim() === ">") {
            scopes = scopes.slice(0, scopes.length - 1);
        }
        return scopes;
    };
    ScopeHelper.prototype.getScopes = function (content, entry, exit) {
        var scopes = new Array();
        if (!content)
            return scopes;
        var results = ['', '', ''];
        var scope = 0;
        var area = 0;
        var insideString = false;
        var insideStringEscapeCharacter = false;
        var pushScope = function () {
            scopes.push({
                prefix: results[0],
                content: results[1],
                suffix: results[2]
            });
            results[0] = results[2] || '';
            results[1] = '';
            results[2] = '';
        };
        var pushCharacter = function (character) {
            results[area] += character;
        };
        for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
            var character = content_1[_i];
            if (insideString && character === '\\') {
                insideStringEscapeCharacter = true;
                pushCharacter(character);
                continue;
            }
            else if (insideString)
                insideStringEscapeCharacter = false;
            if (character === '"' || character === "'")
                insideString = !insideString;
            if (insideString) {
                pushCharacter(character);
                continue;
            }
            if (character === exit) {
                scope--;
                if (scope === 0)
                    area = 2;
            }
            pushCharacter(character);
            if (character === entry) {
                scope++;
                if (scope === 1 && area === 2) {
                    pushScope();
                }
                if (scope === 1)
                    area = 1;
            }
        }
        pushScope();
        if (results[0])
            pushScope();
        return scopes;
    };
    return ScopeHelper;
}());
exports.ScopeHelper = ScopeHelper;
//# sourceMappingURL=ScopeHelper.js.map