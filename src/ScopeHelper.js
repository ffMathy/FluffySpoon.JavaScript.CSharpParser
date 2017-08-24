"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScopeHelper = (function () {
    function ScopeHelper() {
    }
    ScopeHelper.prototype.getCurlyScopes = function (content) {
        var _this = this;
        return this
            .getScopes(content, "{", "}")
            .map(function (x) { return _this.removeComments(x); });
    };
    ScopeHelper.prototype.getGenericTypeScopes = function (content) {
        var _this = this;
        var scopes = this
            .getScopes(content, "<", ">")
            .map(function (x) { return _this.removeComments(x); });
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
            var lastScope = scopes[scopes.length - 1];
            var lastOffset = lastScope ? lastScope.offset : 0;
            var offset = content.indexOf(entry, lastOffset);
            scopes.push({
                prefix: results[0].substring(0, results[0].length - (entry.length - 1)),
                content: results[1],
                suffix: results[2],
                offset: offset,
                length: entry.length + results[1].length + exit.length
            });
            results[0] = results[2] || '';
            results[1] = '';
            results[2] = '';
        };
        var popCharacters = function (count) {
            for (var i = 0; i < count; i++) {
                results[area] = results[area].substr(0, results[area].length - 1);
            }
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
            pushCharacter(character);
            var result = results[area];
            if (this.stringEndsWith(result, exit)) {
                popCharacters(exit.length);
                scope--;
                if (scope === 0)
                    area = 2;
            }
            if (this.stringEndsWith(result, entry)) {
                popCharacters(entry.length - 1);
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
    ScopeHelper.prototype.getCommentScopes = function (content) {
        return this.getScopes(content, "//", "\n").concat(this.getScopes(content, "/*", "*/"));
    };
    ScopeHelper.prototype.removeComments = function (scope) {
        while (true) {
            var commentScope = this
                .getCommentScopes(scope.content)
                .filter(function (x) { return x.content; })[0];
            if (!commentScope)
                break;
            console.log("Removing comment region \"" + scope.content.substr(commentScope.offset, commentScope.length) + "\"");
            scope.content = scope.content.substr(0, commentScope.offset) + scope.content.substr(commentScope.offset + commentScope.length);
            console.log("Removed \"" + scope.content + "\"");
            scope.length -= commentScope.length;
        }
        return scope;
    };
    ScopeHelper.prototype.stringEndsWith = function (content, search) {
        return content.substr(content.length - search.length) === search;
    };
    return ScopeHelper;
}());
exports.ScopeHelper = ScopeHelper;
//# sourceMappingURL=ScopeHelper.js.map