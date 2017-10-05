import { CSharpStruct } from './Models';
import { TypeParser } from './TypeParser';
export declare class StructParser {
    private typeParser;
    private scopeHelper;
    private regexHelper;
    private propertyParser;
    private methodParser;
    private fieldParser;
    constructor(typeParser: TypeParser);
    parseStructs(content: string): CSharpStruct[];
}
