"use strict";
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var UsingsParser_1 = require("./UsingsParser");
var NamespaceParser = (function () {
    function NamespaceParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.usingsParser = new UsingsParser_1.UsingsParser();
    }
    NamespaceParser.prototype.parseNamespaces = function (content) {
        var namespaces = new Array();
        var scopes = this.scopeHelper.getScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var matches = this.regexHelper.getMatches(scope.prefix, /namespace\s+([\.\w]+?)\s*{/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var namespace = new Models_1.CSharpNamespace(match[0]);
                var usings = this.usingsParser.parseUsings(scope.content);
                for (var _b = 0, usings_1 = usings; _b < usings_1.length; _b++) {
                    var using = usings_1[_b];
                    using.parent = namespace;
                    namespace.usings.push(using);
                }
                var subNamespaces = this.parseNamespaces(scope.content);
                for (var _c = 0, subNamespaces_1 = subNamespaces; _c < subNamespaces_1.length; _c++) {
                    var subNamespace = subNamespaces_1[_c];
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
