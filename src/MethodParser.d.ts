import { CSharpMethod, CSharpMethodParameter } from './Models';
export declare class MethodParser {
    private scopeHelper;
    private regexHelper;
    private typeParser;
    constructor();
    parseMethods(content: string): CSharpMethod[];
    parseMethodParameters(content: string): CSharpMethodParameter[];
}
