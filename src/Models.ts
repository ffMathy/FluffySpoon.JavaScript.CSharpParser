export class CSharpType {
    name: string;
    namespace: CSharpNamespace;
    isNullable: boolean;

    genericParameters: CSharpType[];

    constructor(name: string) {
        this.name = name;
    }

    get fullName() {
        var name = this.name;
        if (this.namespace && this.namespace.fullName) {
            name = this.namespace.fullName + "." + name;
        }
        return name;
    }
}

export interface CSharpUsing {
    alias: string;
    namespace: CSharpNamespace;
    parent?: CSharpNamespace | CSharpFile;
}

export interface CSharpInterfaceTypeDeclarationScope extends CSharpScope {
    name: string;
    properties: CSharpProperty[];
    methods: CSharpMethod[];
}

export interface CSharpImplementationTypeDeclarationScope extends CSharpScope {
    classes: CSharpClass[];
    interfaces: CSharpInterface[];
    enums: CSharpEnum[];
    name: string;
}

export interface CSharpScope {
    innerScopeText: string;
}

export interface CSharpGenericParameterContainer {
    genericParameters: CSharpType[];
}

export class CSharpNamespace implements CSharpImplementationTypeDeclarationScope {
    name: string;
    innerScopeText: string;

    parent: CSharpNamespace | CSharpFile;

    classes: CSharpClass[];
    interfaces: CSharpInterface[];
    structs: CSharpStruct[];
    enums: CSharpEnum[];

    usings: CSharpUsing[];
    namespaces: CSharpNamespace[];

    constructor(name: string) {
        this.name = name;

        this.classes = [];
        this.enums = [];
        this.usings = [];
        this.namespaces = [];
        this.structs = [];
        this.interfaces = [];
    }

    get fullName() {
        var name = this.name;
        if (this.parent && this.parent.fullName) {
            name = this.parent.fullName + "." + name;
        }
        return name;
    }
}

export class CSharpFile implements CSharpImplementationTypeDeclarationScope {
    innerScopeText: string;
    name: string;
    fullName: string;

    classes: CSharpClass[];
    interfaces: CSharpInterface[];
    structs: CSharpStruct[];
    enums: CSharpEnum[];

    usings: CSharpUsing[];
    namespaces: CSharpNamespace[];
    parent: CSharpNamespace;

    constructor() {
        this.usings = [];
        this.namespaces = [];
        this.classes = [];
        this.enums = [];
        this.structs = [];
        this.interfaces = [];
    }
}

export class CSharpMethod implements CSharpScope {
    name: string;
    innerScopeText: string;

    isConstructor: boolean;
    isVirtual: boolean;
    isBodyless: boolean;

    parent: CSharpClass | CSharpInterface | CSharpMethod | CSharpStruct;
    returnType: CSharpType;

    parameters: CSharpMethodParameter[];
    methods: CSharpMethod[];
    attributes: CSharpAttribute[];

    private _isPublic: boolean;

    constructor(name: string) {
        this.name = name;

        this.parameters = [];
        this.methods = [];
        this.attributes = [];
    }

    public get isPublic() {
        return this._isPublic || this.parent instanceof CSharpInterface;
    }

    public set isPublic(isPublic: boolean) {
        this._isPublic = isPublic;
    }
}

export type CSharpToken = boolean | number | string | CSharpNamedToken;

export class CSharpNamedToken {
    name: string;
}

export class CSharpMethodParameter {
    name: string;
    type: CSharpType;
    defaultValue: CSharpToken;

    attributes: CSharpAttribute[];

    constructor(name: string) {
        this.name = name;

        this.attributes = [];
    }
}

export class CSharpStruct implements CSharpScope {
    properties: CSharpProperty[];
    methods: CSharpMethod[];
    fields: CSharpField[];

    parent: CSharpClass | CSharpNamespace | CSharpFile;

    innerScopeText: string;
    name: string;

    attributes: CSharpAttribute[];

    constructor(name: string) {
        this.name = name;

        this.methods = [];
        this.properties = [];
        this.fields = [];
        this.attributes = [];
    }

    get fullName() {
        var name = this.name;
        if (this.parent && this.parent.fullName) {
            name = this.parent.fullName + "." + name;
        }
        return name;
    }
}

export class CSharpInterface implements CSharpInterfaceTypeDeclarationScope, CSharpGenericParameterContainer {
    methods: CSharpMethod[];
    properties: CSharpProperty[];

    inheritsFrom?: CSharpType;
    parent: CSharpClass | CSharpNamespace | CSharpFile;

    isPublic: boolean;

    innerScopeText: string;
    name: string;

    genericParameters: CSharpType[];
    attributes: CSharpAttribute[];

    constructor(name: string) {
        this.name = name;

        this.methods = [];
        this.properties = [];
        this.attributes = [];
    }

    get fullName() {
        var name = this.name;
        if (this.parent && this.parent.fullName) {
            name = this.parent.fullName + "." + name;
        }
        return name;
    }
}

export class CSharpClass implements CSharpImplementationTypeDeclarationScope, CSharpGenericParameterContainer {
    constructors: CSharpMethod[];
    interfaces: CSharpInterface[];
    methods: CSharpMethod[];
    classes: CSharpClass[];
    enums: CSharpEnum[];
    properties: CSharpProperty[];
    fields: CSharpField[];

    isPublic: boolean;

    inheritsFrom?: CSharpType;
    parent: CSharpClass | CSharpNamespace | CSharpFile;

    innerScopeText: string;
    name: string;

    genericParameters: CSharpType[];
    attributes: CSharpAttribute[];

    constructor(name: string) {
        this.name = name;

        this.constructors = [];
        this.methods = [];
        this.classes = [];
        this.enums = [];
        this.properties = [];
        this.fields = [];
        this.interfaces = [];
        this.attributes = [];
    }

    get fullName() {
        var name = this.name;
        if (this.parent && this.parent.fullName) {
            name = this.parent.fullName + "." + name;
        }
        return name;
    }
}

export class CSharpEnum implements CSharpScope {
    options: CSharpEnumOption[];

    parent: CSharpNamespace | CSharpFile | CSharpClass;

    inheritsFrom?: CSharpType;

    isPublic: boolean;

    name: string;
    innerScopeText: string;

    attributes: CSharpAttribute[];

    constructor(name: string) {
        this.name = name;

        this.attributes = [];
    }

    get fullName() {
        var name = this.name;
        if (this.parent && this.parent.fullName) {
            name = this.parent.fullName + "." + name;
        }
        return name;
    }
}

export class CSharpField {
    name: string;

    type: CSharpType;
    parent: CSharpClass | CSharpStruct;

    isPublic: boolean;
    isReadOnly: boolean;

    attributes: CSharpAttribute[];

    constructor(name: string) {
        this.name = name;

        this.attributes = [];
    }
}

export class CSharpPropertyComponent {
    type: 'set' | 'get';
}

export class CSharpProperty {
    name: string;

    type: CSharpType;
    parent: CSharpClass | CSharpStruct | CSharpInterface;

    components: CSharpPropertyComponent[];
    attributes: CSharpAttribute[];

    isVirtual: boolean;

    private _isPublic: boolean;

    constructor(name: string) {
        this.name = name;

        this.components = [];
        this.attributes = [];
    }

    get isReadOnly() {
        return !this.components.filter(c => c.type === 'set')[0];
    }

    public get isPublic() {
        return this._isPublic || this.parent instanceof CSharpInterface;
    }

    public set isPublic(isPublic: boolean) {
        this._isPublic = isPublic;
    }
}

export class CSharpAttribute {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export class CSharpEnumOption {
    name: string;
    value: number;

    attributes: CSharpAttribute[];

    constructor(name: string) {
        this.name = name

        this.attributes = [];
    }
}