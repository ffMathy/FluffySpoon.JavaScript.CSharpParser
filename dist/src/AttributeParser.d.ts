import { CSharpAttribute } from './Models';
export declare class AttributeParser {
    private regexHelper;
    constructor();
    parseAttributes(content: string): CSharpAttribute[];
}
