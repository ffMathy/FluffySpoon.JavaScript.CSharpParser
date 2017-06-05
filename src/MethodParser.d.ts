import { CSharpMethod, CSharpClass, CSharpMethodParameter } from './Models';
export declare class MethodParser {
    private scopeHelper;
    private regexHelper;
    private typeParser;
    constructor();
    parseMethods(content: string, parent: CSharpClass | CSharpMethod): CSharpMethod[];
    parseMethodParameters(content: string): CSharpMethodParameter[];
    private parseMethodParameter(match);
}
