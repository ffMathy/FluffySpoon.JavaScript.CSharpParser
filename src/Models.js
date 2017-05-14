"use strict";
var CSharpType = (function () {
    function CSharpType() {
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
    }
    return CSharpFile;
}());
exports.CSharpFile = CSharpFile;
var CSharpMethod = (function () {
    function CSharpMethod() {
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
    function CSharpClass() {
    }
    return CSharpClass;
}());
exports.CSharpClass = CSharpClass;
var CSharpEnum = (function () {
    function CSharpEnum() {
    }
    return CSharpEnum;
}());
exports.CSharpEnum = CSharpEnum;
var CSharpEnumValue = (function () {
    function CSharpEnumValue() {
    }
    return CSharpEnumValue;
}());
exports.CSharpEnumValue = CSharpEnumValue;
