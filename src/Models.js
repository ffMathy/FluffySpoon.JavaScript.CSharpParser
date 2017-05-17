"use strict";
var CSharpType = (function () {
    function CSharpType(name) {
        this.name = name;
    }
    Object.defineProperty(CSharpType.prototype, "fullName", {
        get: function () {
            var name = this.name;
            if (this.namespace) {
                name = this.namespace.fullName + "." + name;
            }
            return name;
        },
        enumerable: true,
        configurable: true
    });
    return CSharpType;
}());
exports.CSharpType = CSharpType;
var CSharpNamespace = (function () {
    function CSharpNamespace(name) {
        this.name = name;
        this.classes = [];
        this.enums = [];
        this.usings = [];
        this.namespaces = [];
    }
    Object.defineProperty(CSharpNamespace.prototype, "fullName", {
        get: function () {
            var name = this.name;
            if (this.parent) {
                name = this.parent.fullName + "." + name;
            }
            return name;
        },
        enumerable: true,
        configurable: true
    });
    return CSharpNamespace;
}());
exports.CSharpNamespace = CSharpNamespace;
var CSharpFile = (function () {
    function CSharpFile() {
        this.usings = [];
        this.namespaces = [];
        this.classes = [];
        this.enums = [];
    }
    return CSharpFile;
}());
exports.CSharpFile = CSharpFile;
var CSharpMethod = (function () {
    function CSharpMethod(name) {
        this.name = name;
        this.parameters = [];
        this.methods = [];
    }
    return CSharpMethod;
}());
exports.CSharpMethod = CSharpMethod;
var CSharpNamedToken = (function () {
    function CSharpNamedToken() {
    }
    return CSharpNamedToken;
}());
exports.CSharpNamedToken = CSharpNamedToken;
var CSharpMethodParameter = (function () {
    function CSharpMethodParameter() {
    }
    return CSharpMethodParameter;
}());
exports.CSharpMethodParameter = CSharpMethodParameter;
var CSharpClass = (function () {
    function CSharpClass(name) {
        this.name = name;
        this.constructors = [];
        this.methods = [];
        this.classes = [];
        this.enums = [];
    }
    Object.defineProperty(CSharpClass.prototype, "fullName", {
        get: function () {
            var name = this.name;
            if (this.parent) {
                name = this.parent.fullName + "." + name;
            }
            return name;
        },
        enumerable: true,
        configurable: true
    });
    return CSharpClass;
}());
exports.CSharpClass = CSharpClass;
var CSharpEnum = (function () {
    function CSharpEnum(name) {
        this.name = name;
    }
    return CSharpEnum;
}());
exports.CSharpEnum = CSharpEnum;
var CSharpEnumOption = (function () {
    function CSharpEnumOption(name) {
        this.name = name;
    }
    return CSharpEnumOption;
}());
exports.CSharpEnumOption = CSharpEnumOption;
