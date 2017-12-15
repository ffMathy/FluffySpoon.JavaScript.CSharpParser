import { CSharpNamespace } from './Models';
import { ClassParser } from './ClassParser';
import { InterfaceParser } from './InterfaceParser';
import { EnumParser } from './EnumParser';
import { StructParser } from './StructParser';
export declare class NamespaceParser {
    private classParser;
    private interfaceParser;
    private enumParser;
    private structParser;
    private scopeHelper;
    private regexHelper;
    private usingsParser;
    constructor(classParser: ClassParser, interfaceParser: InterfaceParser, enumParser: EnumParser, structParser: StructParser);
    parseNamespacesFromCode(content: string): CSharpNamespace[];
    static parseNamespaceFromName(name: string): CSharpNamespace;
    static parseNamespacesFromName(name: string): CSharpNamespace[];
}
