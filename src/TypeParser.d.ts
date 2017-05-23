import { CSharpType } from './Models';
export declare class TypeParser {
    private scopeHelper;
    private regexHelper;
    constructor();
    parseTypesFromGenericParameters(content: string): CSharpType[];
    parseType(typeString: string): CSharpType;
}
