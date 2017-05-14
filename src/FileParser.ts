import {
    CSharpFile,
    CSharpNamespace
} from './Models';

export class FileParser {

    constructor(private contents: string) {
        this.contents = contents.replace('\r\n', '\n');
    }

    parseFile(): CSharpFile {
        var file = new CSharpFile();
        this.parseUsings(file);

        return file;
    }

    private getOuterScopeContents() {
        var match = this.contents.match(/.*?\{(.*)\}.*?/gm)[1];
        return this.contents.replace(match, '');
    }

    private getLines(content: string) {
        return content.split('\n');
    }

    private parseUsings(file: CSharpFile) {
        var outerScope = this.getOuterScopeContents();
        var lines = this.getLines(outerScope);

        for (var line of lines) {
            var match = line.match(/using\s+(?:(\w+?)\s*=)?\s*(.+?)\s*;/g);
            file.usings.push({
                alias: match[1],
                namespace: new CSharpNamespace(match[2])
            });
        }
    }

}