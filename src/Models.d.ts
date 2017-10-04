export declare class CSharpType {
    name: string;
    namespace: CSharpNamespace;
    isNullable: boolean;
    genericParameters: CSharpType[];
    constructor(name: string);
    readonly fullName: string;
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
export declare class CSharpNamespace implements CSharpImplementationTypeDeclarationScope {
    name: string;
    innerScopeText: string;
    parent: CSharpNamespace;
    classes: CSharpClass[];
    interfaces: CSharpInterface[];
    structs: CSharpStruct[];
    enums: CSharpEnum[];
    usings: CSharpUsing[];
    namespaces: CSharpNamespace[];
    constructor(name: string);
    readonly fullName: string;
}
export declare class CSharpFile implements CSharpImplementationTypeDeclarationScope {
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
    constructor();
}
export declare class CSharpMethod implements CSharpScope {
    name: string;
    innerScopeText: string;
    isConstructor: boolean;
    isVirtual: boolean;
    isBodyless: boolean;
    parent: CSharpClass | CSharpInterface | CSharpMethod | CSharpStruct;
    returnType: CSharpType;
    parameters: CSharpMethodParameter[];
    methods: CSharpMethod[];
    private _isPublic;
    constructor(name: string);
    isPublic: boolean;
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
export declare class CSharpInterface implements CSharpInterfaceTypeDeclarationScope {
    methods: CSharpMethod[];
    properties: CSharpProperty[];
    inheritsFrom?: CSharpType;
    parent: CSharpClass | CSharpNamespace | CSharpFile;
    innerScopeText: string;
    name: string;
    constructor(name: string);
    readonly fullName: string;
}
export declare class CSharpClass implements CSharpImplementationTypeDeclarationScope {
    constructors: CSharpMethod[];
    interfaces: CSharpInterface[];
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
    parent: CSharpClass | CSharpStruct | CSharpInterface;
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
