"use strict";
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var TypeParser_1 = require("./TypeParser");
var PropertyParser = (function () {
    function PropertyParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.typeParser = new TypeParser_1.TypeParser();
    }
    PropertyParser.prototype.parseProperties = function (content) {
        var properties = new Array();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var subScope = this.scopeHelper
                .getCurlyScopes(scope.content)
                .map(function (x) { return x.prefix; })
                .join('');
            var matchCandidate = scope.prefix + subScope;
            var matches = this.regexHelper.getMatches(matchCandidate, /((?:\w+\s)*)([^\s]+?)\s+(\w+?)\s*{\s*(?:(?:\w+\s*)?(?:get|set){1}\s*(?:;|\{)\s*){1,2}/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var property = new Models_1.CSharpProperty(match[2]);
                property.type = this.typeParser.parseType(match[1]);
                var modifiers = match[0] || "";
                property.isVirtual = modifiers.indexOf("virtual") > -1;
                properties.push(property);
            }
        }
        return properties;
    };
    return PropertyParser;
}());
exports.PropertyParser = PropertyParser;
//# sourceMappingURL=PropertyParser.js.map