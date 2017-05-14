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

export interface CSharpUsingScope {
    usings: CSharpUsing[];
    namespaces: CSharpNamespace[];
    parent: CSharpNamespace;
}

export interface CSharpUsing {
    alias: string;
    namespace: CSharpNamespace;
    parent?: CSharpUsingScope;
}

export interface CSharpTypeDeclarationScope {
    name: string;
    classes: CSharpClass[];
    enums: CSharpEnum[];
}

export class CSharpNamespace implements CSharpTypeDeclarationScope, CSharpUsingScope {
    name: string;
    parent: CSharpNamespace;
    
    classes: CSharpClass[];
    enums: CSharpEnum[];

    usings: CSharpUsing[];
    namespaces: CSharpNamespace[];

    constructor(name: string) {
        this.name = name;
    }
    
    get fullName() {
        var name = this.name;
        if (this.parent) {
            name = this.parent.fullName + "." + name;
        }
        return name;
    }
}

export class CSharpFile implements CSharpTypeDeclarationScope, CSharpUsingScope {
    name: string;
    classes: CSharpClass[];
    enums: CSharpEnum[];

    usings: CSharpUsing[];
    namespaces: CSharpNamespace[];
    parent: CSharpNamespace;
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