import { CSharpClass } from './Models';
import { EnumParser } from './EnumParser';
import { FieldParser } from './FieldParser';
import { TypeParser } from './TypeParser';
export declare class ClassParser {
    private typeParser;
    private enumParser;
    private fieldParser;
    private scopeHelper;
    private regexHelper;
    private propertyParser;
    private attributeParser;
    private methodParser;
    private interfaceParser;
    constructor(typeParser: TypeParser, enumParser: EnumParser, fieldParser: FieldParser);
    parseClasses(content: string): CSharpClass[];
}
