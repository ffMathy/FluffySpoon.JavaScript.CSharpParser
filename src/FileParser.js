"use strict";
var Models_1 = require("./Models");
var FileParser = (function () {
    function FileParser(contents) {
        this.contents = contents;
        this.contents = contents.replace('\r\n', '\n');
    }
    FileParser.prototype.parseFile = function () {
        var file = new Models_1.CSharpFile();
        this.parseUsings(file);
        return file;
    };
    FileParser.prototype.getOuterScopeContents = function () {
        var match = this.contents.match(/.*?\{(.*)\}.*?/gm)[1];
        return this.contents.replace(match, '');
    };
    FileParser.prototype.getLines = function (content) {
        return content.split('\n');
    };
    FileParser.prototype.parseUsings = function (file) {
        var outerScope = this.getOuterScopeContents();
        var lines = this.getLines(outerScope);
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var match = line.match(/using\s+(?:(\w+?)\s*=)?\s*(.+?)\s*;/g);
            file.usings.push({
                alias: match[1],
                namespace: new Models_1.CSharpNamespace(match[2])
            });
        }
    };
    return FileParser;
}());
exports.FileParser = FileParser;
