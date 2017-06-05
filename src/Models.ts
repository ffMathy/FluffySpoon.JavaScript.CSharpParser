export class CSharpType {
    name: string;
	namespace: CSharpNamespace;

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
    parent?: CSharpNamespace|CSharpFile;
}

export interface CSharpTypeDeclarationScope extends CSharpScope {
    name: string;
    classes: CSharpClass[];
    enums: CSharpEnum[];
}

export interface CSharpScope {
    innerScopeText: string;
}

export class CSharpNamespace implements CSharpTypeDeclarationScope {
    name: string;
    innerScopeText: string;

    parent: CSharpNamespace;
    
	classes: CSharpClass[];
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
    }
    
    get fullName() {
        var name = this.name;
        if (this.parent && this.parent.fullName) {
            name = this.parent.fullName + "." + name;
        }
        return name;
    }
}

export class CSharpFile implements CSharpTypeDeclarationScope {
    innerScopeText: string;
    name: string;
    fullName: string;

	classes: CSharpClass[];
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
    }
}

export class CSharpMethod implements CSharpScope {
    name: string;
    innerScopeText: string;

    isConstructor: boolean;
	isVirtual: boolean;
	isPublic: boolean;

    parent: CSharpClass | CSharpMethod | CSharpStruct;
    returnType: CSharpType;

    parameters: CSharpMethodParameter[];
    methods: CSharpMethod[];

    constructor(name: string) {
        this.name = name;

        this.parameters = [];
        this.methods = [];
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
}

export class CSharpStruct implements CSharpScope {
	properties: CSharpProperty[];
	methods: CSharpMethod[];
	fields: CSharpField[];

	parent: CSharpClass | CSharpNamespace | CSharpFile;

	innerScopeText: string;
	name: string;

	constructor(name: string) {
		this.name = name;
        
		this.methods = [];
		this.properties = [];
		this.fields = [];
	}

	get fullName() {
		var name = this.name;
		if (this.parent && this.parent.fullName) {
			name = this.parent.fullName + "." + name;
		}
		return name;
	}
}

export class CSharpClass implements CSharpTypeDeclarationScope {
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

    constructor(name: string) {
        this.name = name;

        this.constructors = [];
        this.methods = [];
        this.classes = [];
        this.enums = [];
		this.properties = [];
		this.fields = [];
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

    name: string;
    innerScopeText: string;

    constructor(name: string) {
        this.name = name;
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

	constructor(name: string) {
		this.name = name;
	}
}

export class CSharpPropertyComponent {
	type: 'set' | 'get';
}

export class CSharpProperty {
    name: string;

    type: CSharpType;
	parent: CSharpClass | CSharpStruct;

	components: CSharpPropertyComponent[];

	isVirtual: boolean;
	isPublic: boolean;

    constructor(name: string) {
		this.name = name;

		this.components = [];
	}

	get isReadOnly() {
		return !this.components.filter(c => c.type === 'set')[0];
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