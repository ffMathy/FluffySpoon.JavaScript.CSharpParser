"use strict";
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var AttributeParser_1 = require("./AttributeParser");
var EnumParser = (function () {
    function EnumParser(typeParser) {
        this.typeParser = typeParser;
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.attributeParser = new AttributeParser_1.AttributeParser();
    }
    EnumParser.prototype.parseEnums = function (content) {
        var enums = new Array();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var matches = this.regexHelper.getMatches(scope.prefix, /enum\s+(\w+?)(?:\s*:\s*([\.\w]+?))?\s*{/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var enumObject = new Models_1.CSharpEnum(match[0]);
                enumObject.options = this.parseEnumValues(scope.content);
                if (match[1])
                    enumObject.inheritsFrom = this.typeParser.parseType(match[1]);
                enums.push(enumObject);
            }
        }
        return enums;
    };
    EnumParser.prototype.parseEnumValues = function (content) {
        var result = new Array();
        var nextValue = 0;
        var matches = this.regexHelper.getMatches(content, /((?:\s*\[.*\]\s*)*)?\s*(\w+)(?:\s*=\s*(\-*\d+))?/g);
        for (var _i = 0, matches_2 = matches; _i < matches_2.length; _i++) {
            var match = matches_2[_i];
            var option = new Models_1.CSharpEnumOption(match[1]);
            option.attributes = this.attributeParser.parseAttributes(match[0]);
            if (match[2]) {
                option.value = parseInt(match[2]);
                nextValue = option.value + 1;
            }
            else {
                option.value = nextValue;
                nextValue++;
            }
            result.push(option);
        }
        return result;
    };
    return EnumParser;
}());
exports.EnumParser = EnumParser;
//# sourceMappingURL=EnumParser.js.map