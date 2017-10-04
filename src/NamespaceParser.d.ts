import { CSharpNamespace } from './Models';
export declare class NamespaceParser {
    private scopeHelper;
    private regexHelper;
    private usingsParser;
    private classParser;
    private interfaceParser;
    private enumParser;
    private structParser;
    constructor();
    parseNamespaces(content: string): CSharpNamespace[];
}
