import { CSharpInterface } from './Models';
export declare class InterfaceParser {
    private scopeHelper;
    private regexHelper;
    private methodParser;
    private propertyParser;
    private typeParser;
    constructor();
    parseInterfaces(content: string): CSharpInterface[];
}
