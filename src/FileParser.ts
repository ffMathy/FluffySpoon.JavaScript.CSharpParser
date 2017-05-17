import {
    CSharpFile,
    CSharpNamespace
} from './Models';

import { RegExHelper } from './RegExHelper';
import { NamespaceParser } from './NamespaceParser';
import { UsingsParser } from './UsingsParser';

export class FileParser {
    private namespaceParser = new NamespaceParser();
    private usingsParser = new UsingsParser();

    constructor(private contents: string) {
        this.contents = contents.replace(/\r\n/g, '\n');
    }

    parseFile(): CSharpFile {
        var file = new CSharpFile();

        file.innerScopeText = this.contents;

        file.usings = this.usingsParser.parseUsings(file.innerScopeText);
        file.namespaces = this.namespaceParser.parseNamespaces(file.innerScopeText);

        return file;
    }

}