import {
    CSharpFile
} from './Models';

import { NamespaceParser } from './NamespaceParser';
import { ScopeHelper } from './ScopeHelper';
import { UsingsParser } from './UsingsParser';
import { ClassParser } from './ClassParser';
import { InterfaceParser } from './InterfaceParser';
import { EnumParser } from './EnumParser';
import { StructParser } from './StructParser';
import { TypeParser } from './TypeParser';
import { FieldParser } from './FieldParser';

export class FileParser {
    private namespaceParser: NamespaceParser;
    private usingsParser: UsingsParser;
    private classParser: ClassParser;
    private interfaceParser: InterfaceParser;
    private enumParser: EnumParser;
    private structParser: StructParser;
    private fieldParser: FieldParser;

    private scopeHelper: ScopeHelper;

    constructor(private contents: string) {
        this.contents = contents.replace(/\r\n/gi, '\n').replace(/\r/gi, '\n');

        this.scopeHelper = new ScopeHelper();

        var typeParser = new TypeParser();

        this.usingsParser = new UsingsParser();
        this.enumParser = new EnumParser(typeParser);
        this.fieldParser = new FieldParser(typeParser);
        this.classParser = new ClassParser(typeParser, this.enumParser, this.fieldParser);
        this.interfaceParser = new InterfaceParser(typeParser);
        this.structParser = new StructParser(typeParser);
        this.namespaceParser = new NamespaceParser(this.classParser, this.interfaceParser, this.enumParser, this.structParser);
    }

    parseFile(): CSharpFile {
        var file = new CSharpFile();

        file.innerScopeText = this.contents;

        file.usings = this.usingsParser.parseUsings(file.innerScopeText);
        file.namespaces = this.namespaceParser.parseNamespacesFromCode(file.innerScopeText);
        file.classes = this.classParser.parseClasses(file.innerScopeText);
		file.enums = this.enumParser.parseEnums(file.innerScopeText);
        file.structs = this.structParser.parseStructs(file.innerScopeText);
        file.interfaces = this.interfaceParser.parseInterfaces(file.innerScopeText);
        
        return file;
    }

}