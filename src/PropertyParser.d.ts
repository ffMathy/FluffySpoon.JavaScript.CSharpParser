import { CSharpProperty } from './Models';
export declare class PropertyParser {
    private scopeHelper;
    private regexHelper;
    constructor();
    parseProperties(content: string): CSharpProperty[];
}
