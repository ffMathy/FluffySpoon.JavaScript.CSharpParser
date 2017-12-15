import { CSharpMethod, CSharpClass, CSharpMethodParameter, CSharpStruct, CSharpInterface } from './Models';
import { TypeParser } from './TypeParser';
export declare class MethodParser {
    private typeParser;
    private scopeHelper;
    private regexHelper;
    private attributeParser;
    constructor(typeParser: TypeParser);
    parseMethods(content: string, parent: CSharpClass | CSharpInterface | CSharpMethod | CSharpStruct): CSharpMethod[];
    parseMethodParameters(content: string): CSharpMethodParameter[];
    private parseMethodParameter(match);
}
