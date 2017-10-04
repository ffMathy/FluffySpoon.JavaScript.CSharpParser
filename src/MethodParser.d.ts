import { CSharpMethod, CSharpClass, CSharpMethodParameter, CSharpStruct, CSharpInterface } from './Models';
export declare class MethodParser {
    private scopeHelper;
    private regexHelper;
    private typeParser;
    constructor();
    parseMethods(content: string, parent: CSharpClass | CSharpInterface | CSharpMethod | CSharpStruct): CSharpMethod[];
    parseMethodParameters(content: string): CSharpMethodParameter[];
    private parseMethodParameter(match);
}
