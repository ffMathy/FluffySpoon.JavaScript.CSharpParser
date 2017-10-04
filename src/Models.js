"use strict";
var CSharpType = (function () {
    function CSharpType(name) {
        this.name = name;
    }
    Object.defineProperty(CSharpType.prototype, "fullName", {
        get: function () {
            var name = this.name;
            if (this.namespace && this.namespace.fullName) {
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
        this.structs = [];
    }
    Object.defineProperty(CSharpNamespace.prototype, "fullName", {
        get: function () {
            var name = this.name;
            if (this.parent && this.parent.fullName) {
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
        this.structs = [];
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
var CSharpStruct = (function () {
    function CSharpStruct(name) {
        this.name = name;
        this.methods = [];
        this.properties = [];
        this.fields = [];
    }
    Object.defineProperty(CSharpStruct.prototype, "fullName", {
        get: function () {
            var name = this.name;
            if (this.parent && this.parent.fullName) {
                name = this.parent.fullName + "." + name;
            }
            return name;
        },
        enumerable: true,
        configurable: true
    });
    return CSharpStruct;
}());
exports.CSharpStruct = CSharpStruct;
var CSharpClass = (function () {
    function CSharpClass(name) {
        this.name = name;
        this.constructors = [];
        this.methods = [];
        this.classes = [];
        this.enums = [];
        this.properties = [];
        this.fields = [];
    }
    Object.defineProperty(CSharpClass.prototype, "fullName", {
        get: function () {
            var name = this.name;
            if (this.parent && this.parent.fullName) {
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
    Object.defineProperty(CSharpEnum.prototype, "fullName", {
        get: function () {
            var name = this.name;
            if (this.parent && this.parent.fullName) {
                name = this.parent.fullName + "." + name;
            }
            return name;
        },
        enumerable: true,
        configurable: true
    });
    return CSharpEnum;
}());
exports.CSharpEnum = CSharpEnum;
var CSharpField = (function () {
    function CSharpField(name) {
        this.name = name;
    }
    return CSharpField;
}());
exports.CSharpField = CSharpField;
var CSharpPropertyComponent = (function () {
    function CSharpPropertyComponent() {
    }
    return CSharpPropertyComponent;
}());
exports.CSharpPropertyComponent = CSharpPropertyComponent;
var CSharpProperty = (function () {
    function CSharpProperty(name) {
        this.name = name;
        this.components = [];
    }
    Object.defineProperty(CSharpProperty.prototype, "isReadOnly", {
        get: function () {
            return !this.components.filter(function (c) { return c.type === 'set'; })[0];
        },
        enumerable: true,
        configurable: true
    });
    return CSharpProperty;
}());
exports.CSharpProperty = CSharpProperty;
var CSharpAttribute = (function () {
    function CSharpAttribute(name) {
        this.name = name;
    }
    return CSharpAttribute;
}());
exports.CSharpAttribute = CSharpAttribute;
var CSharpEnumOption = (function () {
    function CSharpEnumOption(name) {
        this.name = name;
        this.attributes = [];
    }
    return CSharpEnumOption;
}());
exports.CSharpEnumOption = CSharpEnumOption;
//# sourceMappingURL=Models.js.map