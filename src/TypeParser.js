"use strict";
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var TypeParser = (function () {
    function TypeParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
    }
    TypeParser.prototype.getTypeNameFromGenericScopePrefix = function (prefix) {
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
    };
    TypeParser.prototype.prepareTypeForGenericParameters = function (type, content) {
        type.genericParameters = this.parseTypesFromGenericParameters(content);
        if (type.genericParameters)
            type.name += "<>";
    };
    TypeParser.prototype.parseTypesFromGenericParameters = function (content) {
        var result = new Array();
        var scopes = this.scopeHelper.getGenericTypeScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var type = {};
            type.name = this.getTypeNameFromGenericScopePrefix(scope.prefix);
            if (!type.name)
                continue;
            this.prepareTypeForGenericParameters(type, scope.content);
            result.push(type);
        }
        return result.length === 0 ? null : result;
    };
    TypeParser.prototype.parseType = function (typeString) {
        var matches = this.regexHelper.getMatches(typeString, /(\w+)(?:\s*<\s*(.+)\s*>)?/g);
        var match = matches[0];
        if (!match)
            return null;
        var type = {
            name: match[0]
        };
        this.prepareTypeForGenericParameters(type, match[1]);
        return type;
    };
    return TypeParser;
}());
exports.TypeParser = TypeParser;
//# sourceMappingURL=TypeParser.js.map