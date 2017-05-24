export interface Scope {
    prefix: string;
    content: string;
    suffix: string;
}
export declare class ScopeHelper {
    getCurlyScopes(content: string): Scope[];
    getGenericTypeScopes(content: string): Scope[];
    private getScopes(content, entry, exit);
}
