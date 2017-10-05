"use strict";
var Models_1 = require("./Models");
var NamespaceParser_1 = require("./NamespaceParser");
var ScopeHelper_1 = require("./ScopeHelper");
var UsingsParser_1 = require("./UsingsParser");
var ClassParser_1 = require("./ClassParser");
var InterfaceParser_1 = require("./InterfaceParser");
var EnumParser_1 = require("./EnumParser");
var StructParser_1 = require("./StructParser");
var TypeParser_1 = require("./TypeParser");
var FieldParser_1 = require("./FieldParser");
var FileParser = (function () {
    function FileParser(contents) {
        this.contents = contents;
        this.contents = contents.replace(/\r\n/gi, '\n').replace(/\r/gi, '\n');
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        var typeParser = new TypeParser_1.TypeParser();
        this.usingsParser = new UsingsParser_1.UsingsParser();
        this.enumParser = new EnumParser_1.EnumParser(typeParser);
        this.fieldParser = new FieldParser_1.FieldParser(typeParser);
        this.classParser = new ClassParser_1.ClassParser(typeParser, this.enumParser, this.fieldParser);
        this.interfaceParser = new InterfaceParser_1.InterfaceParser(typeParser);
        this.structParser = new StructParser_1.StructParser(typeParser);
        this.namespaceParser = new NamespaceParser_1.NamespaceParser(this.classParser, this.interfaceParser, this.enumParser, this.structParser);
    }
    FileParser.prototype.parseFile = function () {
        var file = new Models_1.CSharpFile();
        file.innerScopeText = this.contents;
        file.usings = this.usingsParser.parseUsings(file.innerScopeText);
        file.namespaces = this.namespaceParser.parseNamespacesFromCode(file.innerScopeText);
        file.classes = this.classParser.parseClasses(file.innerScopeText);
        file.enums = this.enumParser.parseEnums(file.innerScopeText);
        file.structs = this.structParser.parseStructs(file.innerScopeText);
        file.interfaces = this.interfaceParser.parseInterfaces(file.innerScopeText);
        return file;
    };
    return FileParser;
}());
exports.FileParser = FileParser;
//# sourceMappingURL=FileParser.js.map