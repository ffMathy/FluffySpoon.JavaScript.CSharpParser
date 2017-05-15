import {
    CSharpFile,
    CSharpNamespace
} from './Models';

export class FileParser {

    constructor(private contents: string) {
        this.contents = contents.replace(/\r\n/g, '\n');
    }

    parseFile(): CSharpFile {
        var file = new CSharpFile();
        this.parseUsings(file);

        return file;
    }

    private getOuterScopeContents() {
        var matches = /(?:.|[\n\r])*?\{((?:.|[\n\r])*)\}(?:.|[.\n\r])*/gm.exec(this.contents);
        if (!matches) 
            return this.contents;

        var match = matches[1];
        return this.contents.replace('{' + match + '}', '');
    }

    private getLines(content: string) {
        return content.split('\n');
    }

    private parseUsings(file: CSharpFile) {
        var outerScope = this.getOuterScopeContents();
        var lines = this.getLines(outerScope);
        
        for (var line of lines) {
            var match = /^\s*using\s+(?:(\w+?)\s*=)?\s*([.\w]+?)\s*;\s*$/g.exec(line);
            file.usings.push({
                alias: match[1],
                namespace: new CSharpNamespace(match[2])
            });
        }
    }

}