declare interface CSharpType {
    name: string;
    namespace: CSharpNamespace;
    fullName: string;
}

declare interface CSharpUsingScope {
    usings: CSharpUsing[];
    namespaces: CSharpNamespace[];
    parent: CSharpNamespace;
}

declare interface CSharpUsing {
    namespace: CSharpNamespace;
    parent: CSharpUsingScope;
}

declare interface CSharpTypeDeclarationScope {
    name: string;
    classes: CSharpClass[];
    enums: CSharpEnum[];
}

declare interface CSharpNamespace extends CSharpTypeDeclarationScope, CSharpUsingScope {
    name: string;
    parent: CSharpNamespace;
    fullName: string;
}

declare interface CSharpFile extends CSharpTypeDeclarationScope, CSharpUsingScope {
}

declare interface CSharpMethod {
    name: string;
    isConstructor: boolean;
    isExplicitImplementation: boolean;
    parameters: CSharpMethodParameter[];
}

declare type CSharpToken = boolean | number | string | CSharpNamedToken;

declare interface CSharpNamedToken {
    name: string;
}

declare interface CSharpMethodParameter {
    name: string;
    type: CSharpType;
    defaultValue: CSharpToken;
}

declare interface CSharpClass extends CSharpTypeDeclarationScope {
    constructors: CSharpMethod[];
    methods: CSharpMethod[];
}

declare interface CSharpEnum {
    values: CSharpEnumValue[];
}

declare interface CSharpEnumValue {
    name: string;
    value: number;
}