"use strict";
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var UsingsParser_1 = require("./UsingsParser");
var ClassParser_1 = require("./ClassParser");
var EnumParser_1 = require("./EnumParser");
var NamespaceParser = (function () {
    function NamespaceParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.usingsParser = new UsingsParser_1.UsingsParser();
        this.classParser = new ClassParser_1.ClassParser();
        this.enumParser = new EnumParser_1.EnumParser();
    }
    NamespaceParser.prototype.parseNamespaces = function (content) {
        var namespaces = new Array();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var matches = this.regexHelper.getMatches(scope.prefix, /namespace\s+([\.\w]+?)\s*{/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var namespace = new Models_1.CSharpNamespace(match[0]);
                namespace.innerScopeText = scope.content;
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
                var usings = this.usingsParser.parseUsings(scope.content);
                for (var _d = 0, usings_1 = usings; _d < usings_1.length; _d++) {
                    var using = usings_1[_d];
                    using.parent = namespace;
                    namespace.usings.push(using);
                }
                var subNamespaces = this.parseNamespaces(scope.content);
                for (var _e = 0, subNamespaces_1 = subNamespaces; _e < subNamespaces_1.length; _e++) {
                    var subNamespace = subNamespaces_1[_e];
                    subNamespace.parent = namespace;
                    namespace.namespaces.push(subNamespace);
                }
                namespaces.push(namespace);
            }
        }
        return namespaces;
    };
    return NamespaceParser;
}());
exports.NamespaceParser = NamespaceParser;
//# sourceMappingURL=NamespaceParser.js.map