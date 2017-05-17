import { CSharpEnum, CSharpEnumOption } from './Models';
export declare class EnumParser {
    private scopeHelper;
    private regexHelper;
    constructor();
    parseEnums(content: string): CSharpEnum[];
    parseEnumValues(content: string): CSharpEnumOption[];
}
