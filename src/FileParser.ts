import {
    CSharpFile
} from './Models';

import { NamespaceParser } from './NamespaceParser';
import { UsingsParser } from './UsingsParser';
import { ClassParser } from './ClassParser';
import { EnumParser } from './EnumParser';

export class FileParser {
    private namespaceParser = new NamespaceParser();
    private usingsParser = new UsingsParser();
    private classParser = new ClassParser();
    private enumParser = new EnumParser();

    constructor(private contents: string) {
        this.contents = contents.replace(/\r\n/g, '\n');
    }

    parseFile(): CSharpFile {
        var file = new CSharpFile();

        file.innerScopeText = this.contents;

        file.usings = this.usingsParser.parseUsings(file.innerScopeText);
        file.namespaces = this.namespaceParser.parseNamespaces(file.innerScopeText);
        file.classes = this.classParser.parseClasses(file.innerScopeText);
        file.enums = this.enumParser.parseEnums(file.innerScopeText);

        this.fixParents(file, file.usings);
        this.fixParents(file, file.namespaces);
        this.fixParents(file, file.classes);
        this.fixParents(file, file.enums);

        return file;
    }

    private fixParents(file: CSharpFile, array: Array<{ parent?: any }>) {
        for (var item of array) {
            item.parent = file;
        }
    }

}