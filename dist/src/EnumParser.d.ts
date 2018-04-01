import { CSharpEnum, CSharpEnumOption } from './Models';
import { TypeParser } from './TypeParser';
export declare class EnumParser {
    private typeParser;
    private scopeHelper;
    private regexHelper;
    private attributeParser;
    constructor(typeParser: TypeParser);
    parseEnums(content: string): CSharpEnum[];
    parseEnumValues(content: string): CSharpEnumOption[];
}
