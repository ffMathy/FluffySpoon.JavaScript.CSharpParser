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

    private parseNamespaces(file: CSharpFile) {
        var outerScope = this.getOuterScopeContents();
        var matches = RegExHelper.getMatches(outerScope, /namespace\s+([\.\w]+?)\s*{}/g);
        for (var match of matches) {
            file.namespaces.push(new CSharpNamespace(match[0]));
        }
    }

    private parseUsings(file: CSharpFile) {
        var outerScope = this.getOuterScopeContents();
        var matches = RegExHelper.getMatches(outerScope, /using\s+(?:(\w+?)\s*=)?\s*([.\w]+?)\s*;/g);

        for (var match of matches) {
            file.usings.push({
                alias: match[0],
                namespace: new CSharpNamespace(match[1])
            });
        }
    }

}