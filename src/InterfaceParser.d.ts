import { CSharpInterface } from './Models';
export declare class InterfaceParser {
    private scopeHelper;
    private regexHelper;
    private methodParser;
    private propertyParser;
    constructor();
    parseInterfaces(content: string): CSharpInterface[];
}
