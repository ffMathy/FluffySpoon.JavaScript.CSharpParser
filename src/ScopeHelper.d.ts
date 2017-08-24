export interface Scope {
    prefix: string;
    content: string;
    suffix: string;
    offset: number;
    length: number;
}
export declare class ScopeHelper {
    getCurlyScopes(content: string): Scope[];
    getGenericTypeScopes(content: string): Scope[];
    getScopes(content: string, entry: string, exit: string): Scope[];
    private getCommentScopes(content);
    private removeComments(scope);
    private stringEndsWith(content, search);
}
