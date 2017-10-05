"use strict";
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var UsingsParser_1 = require("./UsingsParser");
var ClassParser_1 = require("./ClassParser");
var InterfaceParser_1 = require("./InterfaceParser");
var EnumParser_1 = require("./EnumParser");
var StructParser_1 = require("./StructParser");
var NamespaceParser = (function () {
    function NamespaceParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.usingsParser = new UsingsParser_1.UsingsParser();
        this.classParser = new ClassParser_1.ClassParser();
        this.interfaceParser = new InterfaceParser_1.InterfaceParser();
        this.enumParser = new EnumParser_1.EnumParser();
        this.structParser = new StructParser_1.StructParser();
    }
    NamespaceParser.prototype.parseNamespaces = function (content) {
        var namespaces = new Array();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var matches = this.regexHelper.getMatches(scope.prefix, /namespace\s+([\.\w]+?)\s*{/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var name = match[0];
                var previousNamespace = null;
                if (name.indexOf(".") > -1) {
                    var subNames = name.split(".");
                    console.log("Sub-namespaces found", subNames);
                    for (var i = 0; i < subNames.length - 1; i++) {
                        var subName = subNames[i];
                        var subNamespace = new Models_1.CSharpNamespace(subName);
                        if (previousNamespace) {
                            subNamespace.parent = previousNamespace;
                            previousNamespace.namespaces.push(subNamespace);
                        }
                        console.log("Handling sub-namespace", subNamespace);
                        previousNamespace = subNamespace;
                    }
                    name = subNames[subNames.length - 1];
                }
                var namespace = new Models_1.CSharpNamespace(name);
                namespace.innerScopeText = scope.content;
                if (previousNamespace) {
                    previousNamespace.namespaces.push(namespace);
                    namespace.parent = previousNamespace;
                    console.log("Attaching namespace to sub-namespace", namespace);
                }
                var enums = this.enumParser.parseEnums(scope.content);
                for (var _b = 0, enums_1 = enums; _b < enums_1.length; _b++) {
                    var enumObject = enums_1[_b];
                    enumObject.parent = namespace;
                    namespace.enums.push(enumObject);
                }
                var classes = this.classParser.parseClasses(scope.content);
                for (var _c = 0, classes_1 = classes; _c < classes_1.length; _c++) {
                    var classObject = classes_1[_c];
                    classObject.parent = namespace;
                    namespace.classes.push(classObject);
                }
                var structs = this.structParser.parseStructs(scope.content);
                for (var _d = 0, structs_1 = structs; _d < structs_1.length; _d++) {
                    var struct = structs_1[_d];
                    struct.parent = namespace;
                    namespace.structs.push(struct);
                }
                var usings = this.usingsParser.parseUsings(scope.content);
                for (var _e = 0, usings_1 = usings; _e < usings_1.length; _e++) {
                    var using = usings_1[_e];
                    using.parent = namespace;
                    namespace.usings.push(using);
                }
                var subNamespaces = this.parseNamespaces(scope.content);
                for (var _f = 0, subNamespaces_1 = subNamespaces; _f < subNamespaces_1.length; _f++) {
                    var subNamespace = subNamespaces_1[_f];
                    subNamespace.parent = namespace;
                    namespace.namespaces.push(subNamespace);
                }
                var interfaces = this.interfaceParser.parseInterfaces(scope.content);
                for (var _g = 0, interfaces_1 = interfaces; _g < interfaces_1.length; _g++) {
                    var interfaceObject = interfaces_1[_g];
                    namespace.interfaces.push(interfaceObject);
                }
                var final = previousNamespace || namespace;
                console.log("Detected namespace", final);
                namespaces.push(final);
            }
        }
        return namespaces;
    };
    return NamespaceParser;
}());
exports.NamespaceParser = NamespaceParser;
//# sourceMappingURL=NamespaceParser.js.map