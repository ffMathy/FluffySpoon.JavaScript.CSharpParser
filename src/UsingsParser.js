"use strict";
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var UsingsParser = (function () {
    function UsingsParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
    }
    UsingsParser.prototype.parseUsings = function (content) {
        var usings = new Array();
        var scopes = this.scopeHelper.getScopes(content);
        var scope = scopes[0];
        if (!scope)
            return usings;
        var matches = this.regexHelper.getMatches(scope.prefix, /using\s+(?:(\w+?)\s*=)?\s*([.\w]+?)\s*;/g);
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            var using = {
                alias: match[0],
                namespace: new Models_1.CSharpNamespace(match[1])
            };
            usings.push(using);
        }
        return usings;
    };
    return UsingsParser;
}());
exports.UsingsParser = UsingsParser;
