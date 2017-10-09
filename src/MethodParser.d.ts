import { CSharpMethod, CSharpClass, CSharpMethodParameter, CSharpStruct } from './Models';
export declare class MethodParser {
    private scopeHelper;
    private regexHelper;
    private typeParser;
    constructor();
    parseMethods(content: string, parent: CSharpClass | CSharpMethod | CSharpStruct): CSharpMethod[];
    parseMethodParameters(content: string): CSharpMethodParameter[];
    private parseMethodParameter(match);
}
