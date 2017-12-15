import { CSharpInterface } from './Models';
import { TypeParser } from './TypeParser';
export declare class InterfaceParser {
    private typeParser;
    private scopeHelper;
    private regexHelper;
    private propertyParser;
    private attributeParser;
    private methodParser;
    constructor(typeParser: TypeParser);
    parseInterfaces(content: string): CSharpInterface[];
}
