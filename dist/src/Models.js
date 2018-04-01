"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CSharpType = /** @class */ (function () {
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
var CSharpNamespace = /** @class */ (function () {
    function CSharpNamespace(name) {
        this.name = name;
        this.classes = [];
        this.enums = [];
        this.usings = [];
        this.namespaces = [];
        this.structs = [];
        this.interfaces = [];
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
    CSharpNamespace.prototype.getAllClassesRecursively = function () {
        var classes = new Array();
        for (var _i = 0, _a = this.classes; _i < _a.length; _i++) {
            var classObject = _a[_i];
            classes.push(classObject);
            classes = classes.concat.apply(classes, classObject.getAllClassesRecursively());
        }
        for (var _b = 0, _c = this.namespaces; _b < _c.length; _b++) {
            var namespace = _c[_b];
            classes = classes.concat.apply(classes, namespace.getAllClassesRecursively());
        }
        return classes;
    };
    return CSharpNamespace;
}());
exports.CSharpNamespace = CSharpNamespace;
var CSharpFile = /** @class */ (function () {
    function CSharpFile() {
        this.usings = [];
        this.namespaces = [];
        this.classes = [];
        this.enums = [];
        this.structs = [];
        this.interfaces = [];
    }
    CSharpFile.prototype.getAllClassesRecursively = function () {
        var classes = new Array();
        for (var _i = 0, _a = this.classes; _i < _a.length; _i++) {
            var classObject = _a[_i];
            classes.push(classObject);
            classes = classes.concat.apply(classes, classObject.getAllClassesRecursively());
        }
        for (var _b = 0, _c = this.namespaces; _b < _c.length; _b++) {
            var namespace = _c[_b];
            classes = classes.concat.apply(classes, namespace.getAllClassesRecursively());
        }
        return classes;
    };
    return CSharpFile;
}());
exports.CSharpFile = CSharpFile;
var CSharpMethod = /** @class */ (function () {
    function CSharpMethod(name) {
        this.name = name;
        this.parameters = [];
        this.methods = [];
        this.attributes = [];
    }
    Object.defineProperty(CSharpMethod.prototype, "isPublic", {
        get: function () {
            return this._isPublic || this.parent instanceof CSharpInterface;
        },
        set: function (isPublic) {
            this._isPublic = isPublic;
        },
        enumerable: true,
        configurable: true
    });
    return CSharpMethod;
}());
exports.CSharpMethod = CSharpMethod;
var CSharpNamedToken = /** @class */ (function () {
    function CSharpNamedToken() {
    }
    return CSharpNamedToken;
}());
exports.CSharpNamedToken = CSharpNamedToken;
var CSharpMethodParameter = /** @class */ (function () {
    function CSharpMethodParameter(name) {
        this.name = name;
        this.attributes = [];
    }
    return CSharpMethodParameter;
}());
exports.CSharpMethodParameter = CSharpMethodParameter;
var CSharpStruct = /** @class */ (function () {
    function CSharpStruct(name) {
        this.name = name;
        this.methods = [];
        this.properties = [];
        this.fields = [];
        this.attributes = [];
    }
    Object.defineProperty(CSharpStruct.prototype, "isPublic", {
        get: function () {
            if (this.parent instanceof CSharpClass) {
                return this._isPublic && this.parent.isPublic;
            }
            return true;
        },
        set: function (isPublic) {
            this._isPublic = isPublic;
        },
        enumerable: true,
        configurable: true
    });
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
var CSharpInterface = /** @class */ (function () {
    function CSharpInterface(name) {
        this.name = name;
        this.methods = [];
        this.properties = [];
        this.attributes = [];
    }
    Object.defineProperty(CSharpInterface.prototype, "isPublic", {
        get: function () {
            if (this.parent instanceof CSharpClass) {
                return this._isPublic && this.parent.isPublic;
            }
            return true;
        },
        set: function (isPublic) {
            this._isPublic = isPublic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CSharpInterface.prototype, "fullName", {
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
    return CSharpInterface;
}());
exports.CSharpInterface = CSharpInterface;
var CSharpClass = /** @class */ (function () {
    function CSharpClass(name) {
        this.name = name;
        this.constructors = [];
        this.methods = [];
        this.classes = [];
        this.enums = [];
        this.properties = [];
        this.fields = [];
        this.structs = [];
        this.interfaces = [];
        this.attributes = [];
    }
    Object.defineProperty(CSharpClass.prototype, "isPublic", {
        get: function () {
            if (this.parent instanceof CSharpClass) {
                return this._isPublic && this.parent.isPublic;
            }
            return true;
        },
        set: function (isPublic) {
            this._isPublic = isPublic;
        },
        enumerable: true,
        configurable: true
    });
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
    CSharpClass.prototype.getAllClassesRecursively = function () {
        var classes = new Array();
        for (var _i = 0, _a = this.classes; _i < _a.length; _i++) {
            var classObject = _a[_i];
            classes.push(classObject);
            classes = classes.concat.apply(classes, classObject.getAllClassesRecursively());
        }
        return classes;
    };
    return CSharpClass;
}());
exports.CSharpClass = CSharpClass;
var CSharpEnum = /** @class */ (function () {
    function CSharpEnum(name) {
        this.name = name;
        this.attributes = [];
    }
    Object.defineProperty(CSharpEnum.prototype, "isPublic", {
        get: function () {
            if (this.parent instanceof CSharpClass) {
                return this._isPublic && this.parent.isPublic;
            }
            return true;
        },
        set: function (isPublic) {
            this._isPublic = isPublic;
        },
        enumerable: true,
        configurable: true
    });
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
var CSharpField = /** @class */ (function () {
    function CSharpField(name) {
        this.name = name;
        this.attributes = [];
    }
    return CSharpField;
}());
exports.CSharpField = CSharpField;
var CSharpPropertyComponent = /** @class */ (function () {
    function CSharpPropertyComponent() {
    }
    return CSharpPropertyComponent;
}());
exports.CSharpPropertyComponent = CSharpPropertyComponent;
var CSharpProperty = /** @class */ (function () {
    function CSharpProperty(name) {
        this.name = name;
        this.components = [];
        this.attributes = [];
    }
    Object.defineProperty(CSharpProperty.prototype, "isReadOnly", {
        get: function () {
            return !this.components.filter(function (c) { return c.type === 'set'; })[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CSharpProperty.prototype, "isPublic", {
        get: function () {
            return this._isPublic || this.parent instanceof CSharpInterface;
        },
        set: function (isPublic) {
            this._isPublic = isPublic;
        },
        enumerable: true,
        configurable: true
    });
    return CSharpProperty;
}());
exports.CSharpProperty = CSharpProperty;
var CSharpAttribute = /** @class */ (function () {
    function CSharpAttribute(name) {
        this.name = name;
    }
    return CSharpAttribute;
}());
exports.CSharpAttribute = CSharpAttribute;
var CSharpEnumOption = /** @class */ (function () {
    function CSharpEnumOption(name) {
        this.name = name;
        this.attributes = [];
    }
    return CSharpEnumOption;
}());
exports.CSharpEnumOption = CSharpEnumOption;
//# sourceMappingURL=Models.js.map