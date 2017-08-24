"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Models_1 = require("./Models");
var NamespaceParser_1 = require("./NamespaceParser");
var ScopeHelper_1 = require("./ScopeHelper");
var UsingsParser_1 = require("./UsingsParser");
var ClassParser_1 = require("./ClassParser");
var EnumParser_1 = require("./EnumParser");
var StructParser_1 = require("./StructParser");
var FileParser = (function () {
    function FileParser(contents) {
        this.contents = contents;
        this.namespaceParser = new NamespaceParser_1.NamespaceParser();
        this.usingsParser = new UsingsParser_1.UsingsParser();
        this.classParser = new ClassParser_1.ClassParser();
        this.enumParser = new EnumParser_1.EnumParser();
        this.structParser = new StructParser_1.StructParser();
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.contents = contents.replace(/\r\n/g, '\n');
    }
    FileParser.prototype.parseFile = function () {
        var file = new Models_1.CSharpFile();
        file.innerScopeText = this.contents;
        file.usings = this.usingsParser.parseUsings(file.innerScopeText);
        file.namespaces = this.namespaceParser.parseNamespaces(file.innerScopeText);
        file.classes = this.classParser.parseClasses(file.innerScopeText);
        file.enums = this.enumParser.parseEnums(file.innerScopeText);
        file.structs = this.structParser.parseStructs(file.innerScopeText);
        return file;
    };
    return FileParser;
}());
exports.FileParser = FileParser;
//# sourceMappingURL=FileParser.js.map