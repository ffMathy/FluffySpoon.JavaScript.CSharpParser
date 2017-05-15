"use strict";
var Models_1 = require("./Models");
var FileParser = (function () {
    function FileParser(contents) {
        this.contents = contents;
        this.contents = contents.replace(/\r\n/g, '\n');
    }
    FileParser.prototype.parseFile = function () {
        var file = new Models_1.CSharpFile();
        this.parseUsings(file);
        return file;
    };
    FileParser.prototype.getOuterScopeContents = function () {
        var matches = /(?:.|[\n\r])*?\{((?:.|[\n\r])*)\}(?:.|[.\n\r])*/gm.exec(this.contents);
        if (!matches)
            return this.contents;
        var match = matches[1];
        return this.contents.replace('{' + match + '}', '');
    };
    FileParser.prototype.getLines = function (content) {
        return content.split('\n');
    };
    FileParser.prototype.parseUsings = function (file) {
        var outerScope = this.getOuterScopeContents();
        var lines = this.getLines(outerScope);
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var match = /^\s*using\s+(?:(\w+?)\s*=)?\s*([.\w]+?)\s*;\s*$/g.exec(line);
            file.usings.push({
                alias: match[1],
                namespace: new Models_1.CSharpNamespace(match[2])
            });
        }
    };
    return FileParser;
}());
exports.FileParser = FileParser;
