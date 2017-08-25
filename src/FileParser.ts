import {
    CSharpFile
} from './Models';

import { NamespaceParser } from './NamespaceParser';
import { ScopeHelper } from './ScopeHelper';
import { UsingsParser } from './UsingsParser';
import { ClassParser } from './ClassParser';
import { EnumParser } from './EnumParser';
import { StructParser } from './StructParser';

export class FileParser {
    private namespaceParser = new NamespaceParser();
    private usingsParser = new UsingsParser();
    private classParser = new ClassParser();
    private enumParser = new EnumParser();
    private structParser = new StructParser();
    private scopeHelper = new ScopeHelper();

    constructor(private contents: string) {
        this.contents = contents.replace(/\r\n/gi, '\n').replace(/\r/gi, '\n');
    }

    parseFile(): CSharpFile {
        var file = new CSharpFile();

        file.innerScopeText = this.contents;

        file.usings = this.usingsParser.parseUsings(file.innerScopeText);
        file.namespaces = this.namespaceParser.parseNamespaces(file.innerScopeText);
        file.classes = this.classParser.parseClasses(file.innerScopeText);
		file.enums = this.enumParser.parseEnums(file.innerScopeText);
        file.structs = this.structParser.parseStructs(file.innerScopeText);
        
        return file;
    }

}