"use strict";
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var MethodParser_1 = require("./MethodParser");
var EnumParser_1 = require("./EnumParser");
var PropertyParser_1 = require("./PropertyParser");
var FieldParser_1 = require("./FieldParser");
var InterfaceParser_1 = require("./InterfaceParser");
var TypeParser_1 = require("./TypeParser");
var ClassParser = (function () {
    function ClassParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.methodParser = new MethodParser_1.MethodParser();
        this.enumParser = new EnumParser_1.EnumParser();
        this.propertyParser = new PropertyParser_1.PropertyParser();
        this.fieldParser = new FieldParser_1.FieldParser();
        this.interfaceParser = new InterfaceParser_1.InterfaceParser();
        this.typeParser = new TypeParser_1.TypeParser();
    }
    ClassParser.prototype.parseClasses = function (content) {
        var classes = new Array();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var matches = this.regexHelper.getMatches(scope.prefix, /class\s+(\w+?)\s*(?:<\s*(.+)\s*>)?\s*(?:\:\s*(\w+?\s*(?:<\s*(.+)\s*>)?))?\s*{/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var classObject = new Models_1.CSharpClass(match[0]);
                classObject.innerScopeText = scope.content;
                classObject.genericParameters = this.typeParser.parseTypesFromGenericParameters(match[1]);
                if (match[2]) {
                    classObject.inheritsFrom = this.typeParser.parseType(match[2]);
                }
                var fields = this.fieldParser.parseFields(scope.content);
                for (var _b = 0, fields_1 = fields; _b < fields_1.length; _b++) {
                    var field = fields_1[_b];
                    field.parent = classObject;
                    classObject.fields.push(field);
                }
                var properties = this.propertyParser.parseProperties(scope.content);
                for (var _c = 0, properties_1 = properties; _c < properties_1.length; _c++) {
                    var property = properties_1[_c];
                    property.parent = classObject;
                    classObject.properties.push(property);
                }
                var enums = this.enumParser.parseEnums(scope.content);
                for (var _d = 0, enums_1 = enums; _d < enums_1.length; _d++) {
                    var enumObject = enums_1[_d];
                    enumObject.parent = classObject;
                    classObject.enums.push(enumObject);
                }
                var methods = this.methodParser.parseMethods(scope.content, classObject);
                for (var _e = 0, methods_1 = methods; _e < methods_1.length; _e++) {
                    var method = methods_1[_e];
                    method.parent = classObject;
                    classObject.methods.push(method);
                }
                var subClasses = this.parseClasses(scope.content);
                for (var _f = 0, subClasses_1 = subClasses; _f < subClasses_1.length; _f++) {
                    var subClass = subClasses_1[_f];
                    subClass.parent = classObject;
                    classObject.classes.push(subClass);
                }
                var interfaces = this.interfaceParser.parseInterfaces(scope.content);
                for (var _g = 0, interfaces_1 = interfaces; _g < interfaces_1.length; _g++) {
                    var interfaceObject = interfaces_1[_g];
                    classObject.interfaces.push(interfaceObject);
                }
                classes.push(classObject);
                console.log("Detected class", classObject);
            }
        }
        return classes;
    };
    return ClassParser;
}());
exports.ClassParser = ClassParser;
//# sourceMappingURL=ClassParser.js.map