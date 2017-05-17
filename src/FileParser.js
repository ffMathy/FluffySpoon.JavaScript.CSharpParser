"use strict";
var Models_1 = require("./Models");
var NamespaceParser_1 = require("./NamespaceParser");
var UsingsParser_1 = require("./UsingsParser");
var ClassParser_1 = require("./ClassParser");
var EnumParser_1 = require("./EnumParser");
var FileParser = (function () {
    function FileParser(contents) {
        this.contents = contents;
        this.namespaceParser = new NamespaceParser_1.NamespaceParser();
        this.usingsParser = new UsingsParser_1.UsingsParser();
        this.classParser = new ClassParser_1.ClassParser();
        this.enumParser = new EnumParser_1.EnumParser();
        this.contents = contents.replace(/\r\n/g, '\n');
    }
    FileParser.prototype.parseFile = function () {
        var file = new Models_1.CSharpFile();
        file.innerScopeText = this.contents;
        file.usings = this.usingsParser.parseUsings(file.innerScopeText);
        file.namespaces = this.namespaceParser.parseNamespaces(file.innerScopeText);
        file.classes = this.classParser.parseClasses(file.innerScopeText);
        file.enums = this.enumParser.parseEnums(file.innerScopeText);
        return file;
    };
    return FileParser;
}());
exports.FileParser = FileParser;
