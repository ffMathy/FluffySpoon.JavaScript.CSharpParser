import { CSharpField } from './Models';
export declare class FieldParser {
    private scopeHelper;
    private regexHelper;
    private typeParser;
    constructor();
    parseFields(content: string): CSharpField[];
}
