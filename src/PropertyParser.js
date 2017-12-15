"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var TypeParser_1 = require("./TypeParser");
var AttributeParser_1 = require("./AttributeParser");
var PropertyParser = /** @class */ (function () {
    function PropertyParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.typeParser = new TypeParser_1.TypeParser();
        this.attributeParser = new AttributeParser_1.AttributeParser();
    }
    PropertyParser.prototype.parseProperties = function (content) {
        var properties = new Array();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var subScopes = this.scopeHelper
                .getCurlyScopes(scope.content);
            var subScopeContent = subScopes
                .map(function (x) { return x.prefix; })
                .join('');
            var matchCandidate = scope.prefix + subScopeContent;
            var matches = this.regexHelper.getMatches(matchCandidate, /\s*((?:\[.*\]\s*?)*)?\s*((?:\w+\s)*)([^\s]+?(?:<.+>)?)\s+(\w+?)\s*{\s*(?:(?:\w+\s*)?(?:get|set){1}\s*(?:;|\{)\s*){1,2}/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var property = new Models_1.CSharpProperty(match[3]);
                property.attributes = this.attributeParser.parseAttributes(match[0]);
                property.type = this.typeParser.parseType(match[2]);
                var modifiers = match[1] || "";
                property.isVirtual = modifiers.indexOf("virtual") > -1;
                property.isPublic = modifiers.indexOf("public") > -1;
                for (var _b = 0, subScopes_1 = subScopes; _b < subScopes_1.length; _b++) {
                    var subScope = subScopes_1[_b];
                    var componentTypeMatches = this.regexHelper.getMatches(subScope.prefix, /(get|set)\s*[{;]/g);
                    for (var _c = 0, componentTypeMatches_1 = componentTypeMatches; _c < componentTypeMatches_1.length; _c++) {
                        var componentTypeMatch = componentTypeMatches_1[_c];
                        var component = new Models_1.CSharpPropertyComponent();
                        component.type = componentTypeMatch[0];
                        property.components.push(component);
                    }
                }
                properties.push(property);
            }
        }
        return properties;
    };
    return PropertyParser;
}());
exports.PropertyParser = PropertyParser;
//# sourceMappingURL=PropertyParser.js.map