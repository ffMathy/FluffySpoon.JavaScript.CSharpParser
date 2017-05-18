"use strict";
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var EnumParser = (function () {
    function EnumParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
    }
    EnumParser.prototype.parseEnums = function (content) {
        var enums = new Array();
        var scopes = this.scopeHelper.getScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var matches = this.regexHelper.getMatches(scope.prefix, /enum\s+(\w+?)\s*{/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var enumObject = new Models_1.CSharpEnum(match[0]);
                enumObject.options = this.parseEnumValues(scope.content);
                enums.push(enumObject);
            }
        }
        return enums;
    };
    EnumParser.prototype.parseEnumValues = function (content) {
        var result = new Array();
        var nextValue = 0;
        var argumentRegions = content
            .split(',')
            .map(function (x) { return x.trim(); });
        for (var _i = 0, argumentRegions_1 = argumentRegions; _i < argumentRegions_1.length; _i++) {
            var argumentRegion = argumentRegions_1[_i];
            var matches = this.regexHelper.getMatches(argumentRegion, /(\w+)(?:\s*=\s*(\-*\d+))?/g);
            for (var _a = 0, matches_2 = matches; _a < matches_2.length; _a++) {
                var match = matches_2[_a];
                var option = new Models_1.CSharpEnumOption(match[0]);
                if (match[1]) {
                    option.value = parseInt(match[1]);
                    nextValue = option.value + 1;
                }
                else {
                    option.value = nextValue;
                    nextValue++;
                }
                result.push(option);
            }
        }
        return result;
    };
    return EnumParser;
}());
exports.EnumParser = EnumParser;
//# sourceMappingURL=EnumParser.js.map