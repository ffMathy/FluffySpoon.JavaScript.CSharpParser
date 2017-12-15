import { CSharpProperty } from './Models';
export declare class PropertyParser {
    private scopeHelper;
    private regexHelper;
    private typeParser;
    private attributeParser;
    constructor();
    parseProperties(content: string): CSharpProperty[];
}
