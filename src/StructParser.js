"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var MethodParser_1 = require("./MethodParser");
var PropertyParser_1 = require("./PropertyParser");
var FieldParser_1 = require("./FieldParser");
var AttributeParser_1 = require("./AttributeParser");
var StructParser = /** @class */ (function () {
    function StructParser(typeParser) {
        this.typeParser = typeParser;
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.propertyParser = new PropertyParser_1.PropertyParser();
        this.attributeParser = new AttributeParser_1.AttributeParser();
        this.methodParser = new MethodParser_1.MethodParser(typeParser);
        this.fieldParser = new FieldParser_1.FieldParser(typeParser);
    }
    StructParser.prototype.parseStructs = function (content) {
        var structs = new Array();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var matches = this.regexHelper.getMatches(scope.prefix, /\s*((?:\[.*\]\s*?)*)?\s*((?:\w+\s)*)struct\s+(\w+?)\s*(?:\:\s*(\w+?)\s*)?{/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var struct = new Models_1.CSharpStruct(match[2]);
                struct.attributes = this.attributeParser.parseAttributes(match[0]);
                struct.innerScopeText = scope.content;
                struct.isPublic = (match[1] || "").indexOf("public") > -1;
                var fields = this.fieldParser.parseFields(scope.content);
                for (var _b = 0, fields_1 = fields; _b < fields_1.length; _b++) {
                    var field = fields_1[_b];
                    field.parent = struct;
                    struct.fields.push(field);
                }
                var properties = this.propertyParser.parseProperties(scope.content);
                for (var _c = 0, properties_1 = properties; _c < properties_1.length; _c++) {
                    var property = properties_1[_c];
                    property.parent = struct;
                    struct.properties.push(property);
                }
                var methods = this.methodParser.parseMethods(scope.content, struct);
                for (var _d = 0, methods_1 = methods; _d < methods_1.length; _d++) {
                    var method = methods_1[_d];
                    method.parent = struct;
                    struct.methods.push(method);
                }
                structs.push(struct);
                console.log("Detected struct", struct);
            }
        }
        return structs;
    };
    return StructParser;
}());
exports.StructParser = StructParser;
//# sourceMappingURL=StructParser.js.map