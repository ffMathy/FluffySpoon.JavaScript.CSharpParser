"use strict";
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var TypeParser = (function () {
    function TypeParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
    }
    TypeParser.prototype.parseTypesFromGenericParameters = function (content) {
        var result = new Array();
        var scope = this.scopeHelper.getGenericTypeScopes(match[1])[0];
    };
    TypeParser.prototype.parseType = function (typeString) {
        var matches = this.regexHelper.getMatches(typeString, /(\w+(?:\s*<\s*(.+)\s*>)?)/g);
        var match = matches[0];
        if (!match)
            return null;
        var type = {
            name: match[0]
        };
        if (match[1]) {
            type.genericParameters = [];
            var scope = this.scopeHelper.getGenericTypeScopes(match[1])[0];
            type.name = scope
                .prefix
                .substr(0, scope.prefix.length - 1)
                .trim();
        }
        return type;
    };
    return TypeParser;
}());
exports.TypeParser = TypeParser;
//# sourceMappingURL=TypeParser.js.map