export class FileParser {

    constructor(private contents: string) {

    }

    parseFile(): CSharpFile {
        var file = <CSharpFile>{};
        this.parseUsings(file);

        return file;
    }

    private getOuterScopeContents() {
        var regex = /.*?\{(.*)\}.*?/gm;
        var match = regex.(this.contents)[0];
        match.
    }

    private parseUsings(file: CSharpFile) {

    }

}