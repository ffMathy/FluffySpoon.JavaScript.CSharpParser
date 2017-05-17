"use strict";
var ScopeHelper = (function () {
    function ScopeHelper() {
    }
    ScopeHelper.prototype.getScopes = function (content) {
        var results = ['', '', ''];
        var scope = 0;
        var area = 0;
        var insideString = false;
        var insideStringEscapeCharacter = false;
        var scopes = new Array();
        var pushScope = function () {
            return scopes.push({
                prefix: results[0],
                content: results[1],
                suffix: results[2]
            });
        };
        for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
            var character = content_1[_i];
            if (insideString && character === '\\') {
                insideStringEscapeCharacter = true;
                continue;
            }
            else if (insideString)
                insideStringEscapeCharacter = false;
            if (character === '"' || character === "'")
                insideString = !insideString;
            if (insideString)
                continue;
            if (character === '}') {
                scope--;
                if (scope === 0)
                    area = 2;
            }
            if (scope === 0 || area == 1)
                results[area] += character;
            if (character === '{') {
                scope++;
                if (area === 2) {
                    pushScope();
                    results[0] = results[2];
                    results[1] = '';
                    results[2] = '';
                }
                if (scope === 1)
                    area = 1;
            }
        }
        pushScope();
        return scopes;
    };
    return ScopeHelper;
}());
exports.ScopeHelper = ScopeHelper;
