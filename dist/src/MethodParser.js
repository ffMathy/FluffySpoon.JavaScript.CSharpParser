"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var AttributeParser_1 = require("./AttributeParser");
var MethodParser = /** @class */ (function () {
    function MethodParser(typeParser) {
        this.typeParser = typeParser;
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.attributeParser = new AttributeParser_1.AttributeParser();
    }
    MethodParser.prototype.parseMethods = function (content, parent) {
        var methods = new Array();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var matches = this.regexHelper.getMatches(scope.prefix, /\s*((?:\[.*\]\s*?)*)?\s*((?:\w+\s)*)((?:[\w.]+\s*<\s*.+\s*>)|[\w.]+)\s+(\w+?)\s*\(((?:.|\s)*?)\)\s*({|;)/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var method = new Models_1.CSharpMethod(match[3]);
                method.attributes = this.attributeParser.parseAttributes(match[0]);
                method.innerScopeText = scope.content;
                method.parent = parent;
                method.returnType = this.typeParser.parseType(match[2] || "void");
                var modifiers = match[1] || "";
                if (parent instanceof Models_1.CSharpClass && parent.name === method.name) {
                    method.isConstructor = true;
                    method.isVirtual = false;
                    modifiers = match[2];
                }
                else {
                    method.isVirtual = modifiers.indexOf("virtual") > -1;
                    method.isConstructor = false;
                }
                method.isPublic = modifiers.indexOf("public") > -1;
                method.isBodyless = match[5] === ";";
                var parameters = this.parseMethodParameters(match[4]);
                for (var _b = 0, parameters_1 = parameters; _b < parameters_1.length; _b++) {
                    var parameter = parameters_1[_b];
                    method.parameters.push(parameter);
                }
                var subMethods = this.parseMethods(scope.content, method);
                for (var _c = 0, subMethods_1 = subMethods; _c < subMethods_1.length; _c++) {
                    var subMethod = subMethods_1[_c];
                    subMethod.parent = method;
                    method.methods.push(subMethod);
                }
                methods.push(method);
                console.log("Detected method", method);
            }
        }
        return methods;
    };
    MethodParser.prototype.parseMethodParameters = function (content) {
        var result = new Array();
        var matches = this.regexHelper.getMatches(content, /(?:(params)\s*)?([\w.\[\]]+\s*(?:<\s*.+\s*>)?)\s+(\w+)(?:\s*=\s*(.+?))?\s*(?:,|$)/g);
        for (var _i = 0, matches_2 = matches; _i < matches_2.length; _i++) {
            var match = matches_2[_i];
            result.push(this.parseMethodParameter(match));
        }
        return result;
    };
    MethodParser.prototype.parseMethodParameter = function (match) {
        var valueInput = match[3];
        var defaultValue = null;
        if (valueInput) {
            if ((valueInput.charAt(0) === "\"" || valueInput.charAt(0) === "'") && valueInput.charAt(valueInput.length - 1) === valueInput.charAt(0)) {
                defaultValue = valueInput.substr(1, valueInput.length - 2);
            }
            else if (!isNaN(parseFloat(valueInput))) {
                defaultValue = parseFloat(valueInput);
            }
            else if (valueInput === "false" || valueInput === "true") {
                defaultValue = valueInput === "true";
            }
            else {
                defaultValue = {
                    name: valueInput
                };
            }
        }
        return {
            type: this.typeParser.parseType(match[1]),
            name: match[2],
            isVariadicContainer: !!match[0],
            defaultValue: defaultValue
        };
    };
    return MethodParser;
}());
exports.MethodParser = MethodParser;
//# sourceMappingURL=MethodParser.js.map