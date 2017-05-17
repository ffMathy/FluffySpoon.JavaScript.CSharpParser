export class CSharpType {
    name: string;
    namespace: CSharpNamespace;

    get fullName() {
        var name = this.name;
        if (this.namespace) {
            name = this.namespace.fullName + "." + name;
        }
        return name;
    }
}

export interface CSharpUsingArea {
    usings: CSharpUsing[];
    namespaces: CSharpNamespace[];
    parent: CSharpNamespace;

    name: string;
}

export interface CSharpUsing {
    alias: string;
    namespace: CSharpNamespace;
    parent?: CSharpUsingArea;
}

export interface CSharpTypeDeclarationScope extends CSharpScope {
    name: string;
    classes: CSharpClass[];
    enums: CSharpEnum[];
}

export interface CSharpScope {
    innerScopeText: string;
}

export class CSharpNamespace implements CSharpTypeDeclarationScope, CSharpUsingArea {
    name: string;
    innerScopeText: string;

    parent: CSharpNamespace;
    
    classes: CSharpClass[];
    enums: CSharpEnum[];

    usings: CSharpUsing[];
    namespaces: CSharpNamespace[];

    constructor(name: string) {
        this.name = name;

        this.classes = [];
        this.enums = [];
        this.usings = [];
        this.namespaces = [];
    }
    
    get fullName() {
        var name = this.name;
        if (this.parent) {
            name = this.parent.fullName + "." + name;
        }
        return name;
    }
}

export class CSharpFile implements CSharpTypeDeclarationScope, CSharpUsingArea {
    name: string;
    innerScopeText: string;

    classes: CSharpClass[];
    enums: CSharpEnum[];

    usings: CSharpUsing[];
    namespaces: CSharpNamespace[];
    parent: CSharpNamespace;

    constructor() {
        this.usings = [];
        this.namespaces = [];
        this.classes = [];
        this.enums = [];
    }
}

export class CSharpMethod {
    name: string;
    isConstructor: boolean;
    isExplicitImplementation: boolean;
    parameters: CSharpMethodParameter[];
}

declare type CSharpToken = boolean | number | string | CSharpNamedToken;

export class CSharpNamedToken {
    name: string;
}

export class CSharpMethodParameter {
    name: string;
    type: CSharpType;
    defaultValue: CSharpToken;
}

export class CSharpClass implements CSharpTypeDeclarationScope {
    constructors: CSharpMethod[];
    methods: CSharpMethod[];

    name: string;
    classes: CSharpClass[];
    enums: CSharpEnum[];
}

export class CSharpEnum {
    values: CSharpEnumValue[];
}

export class CSharpEnumValue {
    name: string;
    value: number;
}