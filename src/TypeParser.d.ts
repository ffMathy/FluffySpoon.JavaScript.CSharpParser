import { CSharpType } from './Models';
export declare class TypeParser {
    private scopeHelper;
    private regexHelper;
    constructor();
    private getTypeNameFromGenericScopePrefix(prefix);
    private prepareTypeForGenericParameters(type, content);
    parseTypesFromGenericParameters(content: string): CSharpType[];
    parseType(typeString: string): CSharpType;
}
