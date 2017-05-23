"use strict";
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var TypeParser_1 = require("./TypeParser");
var MethodParser = (function () {
    function MethodParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.typeParser = new TypeParser_1.TypeParser();
    }
    MethodParser.prototype.parseMethods = function (content) {
        var methods = new Array();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var matches = this.regexHelper.getMatches(scope.prefix, /((?:\w+\s*<\s*.+\s*>)|\w+)\s+(\w+?)\s*\((.*?)\)\s*{/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var method = new Models_1.CSharpMethod(match[1]);
                method.innerScopeText = scope.content;
                method.returnType = this.typeParser.parseType(match[0] || "void");
                method.isExplicitImplementation = method.name.indexOf('.') > -1;
                var parameters = this.parseMethodParameters(match[2]);
                for (var _b = 0, parameters_1 = parameters; _b < parameters_1.length; _b++) {
                    var parameter = parameters_1[_b];
                    method.parameters.push(parameter);
                }
                var subMethods = this.parseMethods(scope.content);
                for (var _c = 0, subMethods_1 = subMethods; _c < subMethods_1.length; _c++) {
                    var subMethod = subMethods_1[_c];
                    subMethod.parent = method;
                    method.methods.push(subMethod);
                }
                methods.push(method);
            }
        }
        return methods;
    };
    MethodParser.prototype.parseMethodParameters = function (content) {
        var result = new Array();
        var matches = this.regexHelper.getMatches(content, /\s*((?:\w+\s*<\s*.+\s*>)|\w+)\s+(\w+)(?:\s*=\s*(.+?))?\s*(?:,|$)/g);
        for (var _i = 0, matches_2 = matches; _i < matches_2.length; _i++) {
            var match = matches_2[_i];
            result.push({
                type: this.typeParser.parseType(match[0]),
                name: match[1],
                defaultValue: match[2]
            });
        }
        return result;
    };
    return MethodParser;
}());
exports.MethodParser = MethodParser;
//# sourceMappingURL=MethodParser.js.map