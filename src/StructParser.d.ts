import { CSharpStruct } from './Models';
export declare class StructParser {
    private scopeHelper;
    private regexHelper;
    private methodParser;
    private propertyParser;
    private fieldParser;
    constructor();
    parseStructs(content: string): CSharpStruct[];
}
