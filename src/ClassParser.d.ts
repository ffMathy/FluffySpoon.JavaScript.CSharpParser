import { CSharpClass } from './Models';
export declare class ClassParser {
    private scopeHelper;
    private regexHelper;
    private methodParser;
    private enumParser;
    private propertyParser;
    private fieldParser;
    private interfaceParser;
    constructor();
    parseClasses(content: string): CSharpClass[];
}
