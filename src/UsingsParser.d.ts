import { CSharpUsing } from './Models';
export declare class UsingsParser {
    private scopeHelper;
    private regexHelper;
    constructor();
    parseUsings(content: string): CSharpUsing[];
}
