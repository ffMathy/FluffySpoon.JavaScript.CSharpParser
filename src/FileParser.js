"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var FileParser = /** @class */ (function () {
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
        for (var _i = 0, _a = file.usings; _i < _a.length; _i++) {
            var using = _a[_i];
            using.parent = file;
        }
        file.namespaces = this.namespaceParser.parseNamespacesFromCode(file.innerScopeText);
        for (var _b = 0, _c = file.namespaces; _b < _c.length; _b++) {
            var namespace = _c[_b];
            namespace.parent = file;
        }
        file.classes = this.classParser.parseClasses(file.innerScopeText);
        for (var _d = 0, _e = file.classes; _d < _e.length; _d++) {
            var classObject = _e[_d];
            classObject.parent = file;
        }
        file.enums = this.enumParser.parseEnums(file.innerScopeText);
        for (var _f = 0, _g = file.enums; _f < _g.length; _f++) {
            var enumObject = _g[_f];
            enumObject.parent = file;
        }
        file.structs = this.structParser.parseStructs(file.innerScopeText);
        for (var _h = 0, _j = file.structs; _h < _j.length; _h++) {
            var struct = _j[_h];
            struct.parent = file;
        }
        file.interfaces = this.interfaceParser.parseInterfaces(file.innerScopeText);
        for (var _k = 0, _l = file.interfaces; _k < _l.length; _k++) {
            var interfaceObject = _l[_k];
            interfaceObject.parent = file;
        }
        return file;
    };
    return FileParser;
}());
exports.FileParser = FileParser;
//# sourceMappingURL=FileParser.js.map