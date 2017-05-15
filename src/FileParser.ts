import {
    CSharpFile,
    CSharpNamespace
} from './Models';

import { RegExHelper } from './RegExHelper';

export class FileParser {

    constructor(private contents: string) {
        this.contents = contents.replace(/\r\n/g, '\n');
    }

    parseFile(): CSharpFile {
        var file = new CSharpFile();

        this.parseUsings(file);
        this.parseNamespaces(file);

        return file;
    }

    private getOuterScopeContents() {
        var result = '';

        var scope = 0;
        var insideString = false;
        var insideStringEscapeCharacter = false;

        for (var character of this.contents) {

            if (insideString && character === '\\') {
                insideStringEscapeCharacter = true;
                continue;
            } else if (insideString)
                insideStringEscapeCharacter = false;

            if (character === '"' || character === "'")
                insideString = !insideString;

            if (insideString)
                continue;

            if (character === '}')
                scope--;

            if (scope === 0)
                result += character;

            if (character === '{') 
                scope++;

        }

        return result;
    }

    private getLines(content: string) {
        return content.split('\n');
    }

    private parseNamespaces(file: CSharpFile) {
        var outerScope = this.getOuterScopeContents();
        var matches = RegExHelper.getMatches(outerScope, /namespace\s+([.\w]+?)\s*{}/g);

        for (var match of matches) {
            file.namespaces.push(new CSharpNamespace(match));
        }
    }

    private parseUsings(file: CSharpFile) {
        var outerScope = this.getOuterScopeContents();
        var lines = this.getLines(outerScope);

        for (var line of lines) {
            var match = /using\s+(?:(\w+?)\s*=)?\s*([.\w]+?)\s*;/g.exec(line);
            if (!match)
                continue;

            file.usings.push({
                alias: match[1],
                namespace: new CSharpNamespace(match[2])
            });
        }
    }

}