import { CSharpProperty } from './Models';
export declare class PropertyParser {
    private scopeHelper;
    private regexHelper;
    private typeParser;
    constructor();
    parseProperties(content: string): CSharpProperty[];
}
