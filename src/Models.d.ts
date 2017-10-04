export declare class CSharpType {
    name: string;
    namespace: CSharpNamespace;
    genericParameters: CSharpType[];
    constructor(name: string);
    readonly isOptional: boolean;
    readonly fullName: string;
}
export interface CSharpUsing {
    alias: string;
    namespace: CSharpNamespace;
    parent?: CSharpNamespace | CSharpFile;
}
export interface CSharpTypeDeclarationScope extends CSharpScope {
    name: string;
    classes: CSharpClass[];
    enums: CSharpEnum[];
}
export interface CSharpScope {
    innerScopeText: string;
}
export declare class CSharpNamespace implements CSharpTypeDeclarationScope {
    name: string;
    innerScopeText: string;
    parent: CSharpNamespace;
    classes: CSharpClass[];
    structs: CSharpStruct[];
    enums: CSharpEnum[];
    usings: CSharpUsing[];
    namespaces: CSharpNamespace[];
    constructor(name: string);
    readonly fullName: string;
}
export declare class CSharpFile implements CSharpTypeDeclarationScope {
    innerScopeText: string;
    name: string;
    fullName: string;
    classes: CSharpClass[];
    structs: CSharpStruct[];
    enums: CSharpEnum[];
    usings: CSharpUsing[];
    namespaces: CSharpNamespace[];
    parent: CSharpNamespace;
    constructor();
}
export declare class CSharpMethod implements CSharpScope {
    name: string;
    innerScopeText: string;
    isConstructor: boolean;
    isVirtual: boolean;
    isPublic: boolean;
    parent: CSharpClass | CSharpMethod | CSharpStruct;
    returnType: CSharpType;
    parameters: CSharpMethodParameter[];
    methods: CSharpMethod[];
    constructor(name: string);
}
export declare type CSharpToken = boolean | number | string | CSharpNamedToken;
export declare class CSharpNamedToken {
    name: string;
}
export declare class CSharpMethodParameter {
    name: string;
    type: CSharpType;
    defaultValue: CSharpToken;
}
export declare class CSharpStruct implements CSharpScope {
    properties: CSharpProperty[];
    methods: CSharpMethod[];
    fields: CSharpField[];
    parent: CSharpClass | CSharpNamespace | CSharpFile;
    innerScopeText: string;
    name: string;
    constructor(name: string);
    readonly fullName: string;
}
export declare class CSharpClass implements CSharpTypeDeclarationScope {
    constructors: CSharpMethod[];
    methods: CSharpMethod[];
    classes: CSharpClass[];
    enums: CSharpEnum[];
    properties: CSharpProperty[];
    fields: CSharpField[];
    inheritsFrom?: CSharpType;
    parent: CSharpClass | CSharpNamespace | CSharpFile;
    innerScopeText: string;
    name: string;
    constructor(name: string);
    readonly fullName: string;
}
export declare class CSharpEnum implements CSharpScope {
    options: CSharpEnumOption[];
    parent: CSharpNamespace | CSharpFile | CSharpClass;
    name: string;
    innerScopeText: string;
    constructor(name: string);
    readonly fullName: string;
}
export declare class CSharpField {
    name: string;
    type: CSharpType;
    parent: CSharpClass | CSharpStruct;
    isPublic: boolean;
    isReadOnly: boolean;
    constructor(name: string);
}
export declare class CSharpPropertyComponent {
    type: 'set' | 'get';
}
export declare class CSharpProperty {
    name: string;
    type: CSharpType;
    parent: CSharpClass | CSharpStruct;
    components: CSharpPropertyComponent[];
    isVirtual: boolean;
    isPublic: boolean;
    constructor(name: string);
    readonly isReadOnly: boolean;
}
export declare class CSharpAttribute {
    name: string;
    constructor(name: string);
}
export declare class CSharpEnumOption {
    name: string;
    value: number;
    attributes: CSharpAttribute[];
    constructor(name: string);
}
