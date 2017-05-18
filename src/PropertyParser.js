"use strict";
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var PropertyParser = (function () {
    function PropertyParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
    }
    PropertyParser.prototype.parseProperties = function (content) {
        var properties = new Array();
        var scopes = this.scopeHelper.getScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var subScope = this.scopeHelper
                .getScopes(scope.content)
                .map(function (x) { return x.prefix; })
                .join('');
            var matchCandidate = scope.prefix + subScope;
            var matches = this.regexHelper.getMatches(matchCandidate, /(\w+)\s+(\w+?)\s*{\s*(?:(?:\w+\s*)?(?:get|set){1}\s*(?:;|\{)\s*){1,2}/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var property = new Models_1.CSharpProperty(match[1]);
                property.type = new Models_1.CSharpType(match[0]);
                properties.push(property);
            }
        }
        return properties;
    };
    return PropertyParser;
}());
exports.PropertyParser = PropertyParser;
//# sourceMappingURL=PropertyParser.js.map