import { CSharpField } from './Models';
import { TypeParser } from './TypeParser';
export declare class FieldParser {
    private typeParser;
    private scopeHelper;
    private regexHelper;
    constructor(typeParser: TypeParser);
    parseFields(content: string): CSharpField[];
}
