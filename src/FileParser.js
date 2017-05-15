"use strict";
var Models_1 = require("./Models");
var RegExHelper_1 = require("./RegExHelper");
var FileParser = (function () {
    function FileParser(contents) {
        this.contents = contents;
        this.contents = contents.replace(/\r\n/g, '\n');
    }
    FileParser.prototype.parseFile = function () {
        var file = new Models_1.CSharpFile();
        this.parseUsings(file);
        this.parseNamespaces(file);
        return file;
    };
    FileParser.prototype.getOuterScopeContents = function () {
        var result = '';
        var scope = 0;
        var insideString = false;
        var insideStringEscapeCharacter = false;
        for (var _i = 0, _a = this.contents; _i < _a.length; _i++) {
            var character = _a[_i];
            if (insideString && character === '\\') {
                insideStringEscapeCharacter = true;
                continue;
            }
            else if (insideString)
                insideStringEscapeCharacter = false;
            if (character === '"' || character === "'")
                insideString = !insideString;
            if (insideString)
                continue;
            if (character === '}')
                scope--;
            if (scope === 0)
                result += character;
            if (character === '{')
                scope++;
        }
        return result;
    };
    FileParser.prototype.getLines = function (content) {
        return content.split('\n');
    };
    FileParser.prototype.parseNamespaces = function (file) {
        var outerScope = this.getOuterScopeContents();
        var matches = RegExHelper_1.RegExHelper.getMatches(outerScope, /namespace\s+([.\w]+?)\s*{}/g);
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            file.namespaces.push(new Models_1.CSharpNamespace(match));
        }
    };
    FileParser.prototype.parseUsings = function (file) {
        var outerScope = this.getOuterScopeContents();
        var lines = this.getLines(outerScope);
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var match = /using\s+(?:(\w+?)\s*=)?\s*([.\w]+?)\s*;/g.exec(line);
            if (!match)
                continue;
            file.usings.push({
                alias: match[1],
                namespace: new Models_1.CSharpNamespace(match[2])
            });
        }
    };
    return FileParser;
}());
exports.FileParser = FileParser;
